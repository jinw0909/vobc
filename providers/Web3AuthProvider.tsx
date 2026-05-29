'use client'

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type Dispatch,
    type SetStateAction,
} from 'react'

import {
    useAccount,
    useChainId,
    useConnect,
    useDisconnect,
    useSignMessage,
} from 'wagmi'

import {
    ConnectionType,
    ConnectedWallet,
    WalletOption,
    Web3Provider,
} from '@/types/web3'

import {
    normalizeOptionalString,
    shortenAddress,
} from '@/utils/web3'

export type UserConnection = {
    walletAddress: string
    profileImageUrl?: string
    nickname?: string
    email?: string
    bio?: string
}

type ViewState = 'disconnected' | 'connected' | 'loggedIn'

type WalletKind = 'injected' | 'walletconnect' | 'coinbase-wallet'

type Web3AuthContextValue = {
    account: string
    chainId: string
    accessToken: string
    connectionType: ConnectionType
    activeInjectedProvider: Web3Provider | null
    connectedWallet: ConnectedWallet | null
    userProfile: UserConnection | null
    vobBalance: string

    walletOptions: WalletOption[]

    connectWallet: (kind: WalletKind, walletId?: string) => Promise<boolean>
    connectInjectedWallet: (walletId: string) => Promise<boolean>
    connectWalletConnect: () => Promise<boolean>
    connectBaseAccount: () => Promise<boolean>

    restoreWalletConnection: () => Promise<boolean>
    connectionChecked: boolean
    authChecked: boolean

    isConnected: boolean
    isLoggedIn: boolean
    isSameWalletLogin: boolean
    viewState: ViewState

    displayNickname: string
    displayProfileImage: string

    setAccount: Dispatch<SetStateAction<string>>
    setChainId: Dispatch<SetStateAction<string>>
    setAccessToken: Dispatch<SetStateAction<string>>
    setConnectionType: Dispatch<SetStateAction<ConnectionType>>
    setActiveInjectedProvider: Dispatch<SetStateAction<Web3Provider | null>>
    setConnectedWallet: Dispatch<SetStateAction<ConnectedWallet | null>>
    setUserProfile: Dispatch<SetStateAction<UserConnection | null>>
    setVobBalance: Dispatch<SetStateAction<string>>

    getActiveProvider: () => Web3Provider | null
    getConnector: () => null
    getWalletConnectProvider: () => null
    getActiveSessionTopic: () => string

    clearSavedWalletSession: () => void

    resetWalletConnectionStateOnly: () => void
    resetLoginState: () => void
    resetWeb3State: () => void

    disconnectWallet: () => Promise<void>

    signMessage: (message: string) => Promise<string>

    fetchVobBalance: (token?: string) => Promise<void>
    restoreLoginSession: () => Promise<boolean>
}

type Eip6963ProviderDetail = {
    info: {
        uuid: string
        name: string
        icon: string
        rdns?: string
    }
    provider: Web3Provider
}

const Web3AuthContext = createContext<Web3AuthContextValue | null>(null)

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

const SELECTED_WALLET_STORAGE_KEY = 'vob.selected.wallet.option'

const FIXED_WALLET_OPTIONS: WalletOption[] = [
    {
        id: 'walletconnect',
        name: 'WalletConnect',
        icon: '/wallets/walletconnect.svg',
        type: 'walletconnect',
        // detected: true,
    },
    // {
    //     id: 'base',
    //     name: 'Base Account',
    //     icon: '/wallets/base.svg',
    //     type: 'coinbase-wallet',
    //     // detected: true,
    // },
    {
        id: 'coinbaseWalletSDK',
        name: 'Base Account',
        icon: '/wallets/base.svg',
        type: 'coinbase-wallet',
    },
]
function getInjectedWalletIconFallback(name?: string, rdns?: string) {
    const value = `${name || ''} ${rdns || ''}`.toLowerCase()

    if (value.includes('metamask')) return '/wallets/metamask.png'
    if (value.includes('phantom')) return '/wallets/phantom.png'
    if (value.includes('rabby')) return '/wallets/rabby.png'
    if (value.includes('okx') || value.includes('okex')) return '/wallets/okx.png'
    if (value.includes('binance')) return '/wallets/binance.png'

    return '/default-wallet.png'
}

function readSelectedWalletOption() {
    if (typeof window === 'undefined') return null

    try {
        const raw = sessionStorage.getItem(SELECTED_WALLET_STORAGE_KEY)
        if (!raw) return null

        return JSON.parse(raw) as WalletOption
    } catch {
        return null
    }
}

function saveSelectedWalletOption(option: WalletOption | null) {
    if (typeof window === 'undefined') return

    try {
        if (!option) {
            sessionStorage.removeItem(SELECTED_WALLET_STORAGE_KEY)
            sessionStorage.removeItem('vob.wallet.icon')
            return
        }

        sessionStorage.setItem(
            SELECTED_WALLET_STORAGE_KEY,
            JSON.stringify(option),
        )

        if (option.icon) {
            sessionStorage.setItem('vob.wallet.icon', option.icon)
        }
    } catch {
        // ignore
    }
}

function makeInjectedWalletId(detail: Eip6963ProviderDetail) {
    return (
        detail.info.rdns ||
        detail.info.uuid ||
        detail.info.name
    ).toLowerCase()
}

function normalizeDetectedInjectedWallet(
    detail: Eip6963ProviderDetail,
): WalletOption {
    return {
        id: makeInjectedWalletId(detail),
        name: `${detail.info.name}`,
        icon:
            detail.info.icon ||
            getInjectedWalletIconFallback(
                detail.info.name,
                detail.info.rdns,
            ),
        type: 'injected',
        detected: true,
    }
}

// function getFallbackInjectedWallets(): WalletOption[] {
//     if (typeof window === 'undefined') return []
//
//     const ethereum = (window as any).ethereum
//     if (!ethereum) return []
//
//     const providers = Array.isArray(ethereum.providers)
//         ? ethereum.providers
//         : [ethereum]
//
//     const wallets: WalletOption[] = []
//
//     for (const provider of providers) {
//         if (provider?.isMetaMask) {
//             wallets.push({
//                 id: 'io.metamask',
//                 name: 'MetaMask',
//                 icon: provider.icon || '/wallets/metamask.png',
//                 type: 'injected',
//                 detected: true,
//             })
//         }
//
//         if (provider?.isRabby) {
//             wallets.push({
//                 id: 'io.rabby',
//                 name: 'Rabby Wallet',
//                 icon: provider.icon || '/wallets/rabby.png',
//                 type: 'injected',
//                 detected: true,
//             })
//         }
//
//         if (provider?.isOkxWallet || provider?.isOKExWallet) {
//             wallets.push({
//                 id: 'com.okex.wallet',
//                 name: 'OKX Wallet',
//                 icon: provider.icon || '/wallets/okx.png',
//                 type: 'injected',
//                 detected: true,
//             })
//         }
//
//         if (provider?.isBinance || (window as any).BinanceChain) {
//             wallets.push({
//                 id: 'com.binance',
//                 name: 'Binance Wallet',
//                 icon: provider.icon || '/wallets/binance.png',
//                 type: 'injected',
//                 detected: true,
//             })
//         }
//
//         if (provider?.isPhantom) {
//             wallets.push({
//                 id: 'app.phantom',
//                 name: 'Phantom',
//                 icon: provider.icon || '/wallets/phantom.png',
//                 type: 'injected',
//                 detected: true,
//             })
//         }
//     }
//
//     const unique = new Map<string, WalletOption>()
//
//     for (const wallet of wallets) {
//         unique.set(wallet.id, wallet)
//     }
//
//     return [...unique.values()]
// }

function resolveConnectionTypeFromConnector(
    connectorId?: string,
    connectorName?: string,
): ConnectionType {
    const value = `${connectorId || ''} ${connectorName || ''}`.toLowerCase()

    if (value.includes('walletconnect')) {
        return 'walletconnect'
    }

    if (
        value.includes('base') ||
        value.includes('coinbase') ||
        value.includes('coinbase wallet')
    ) {
        return 'coinbase-wallet'
    }

    if (connectorId || connectorName) {
        return 'injected'
    }

    return null
}

function findFixedOptionByKind(kind: WalletKind) {
    if (kind === 'walletconnect') {
        return FIXED_WALLET_OPTIONS.find(
            (option) => option.type === 'walletconnect',
        )
    }

    if (kind === 'coinbase-wallet') {
        return FIXED_WALLET_OPTIONS.find(
            (option) => option.type === 'coinbase-wallet',
        )
    }

    return null
}

function findWalletOptionById(
    walletOptions: WalletOption[],
    walletId?: string,
) {
    if (!walletId) return null

    const target = walletId.toLowerCase()

    return (
        walletOptions.find((option) => {
            const id = option.id.toLowerCase()
            const name = option.name.toLowerCase()

            return (
                id === target ||
                name === target ||
                id.includes(target) ||
                name.includes(target)
            )
        }) || null
    )
}

function isConnectorMatch(
    connector: { id: string; name: string; type?: string },
    kind: WalletKind,
    walletId?: string,
) {
    const id = connector.id.toLowerCase()
    const name = connector.name.toLowerCase()
    const type = connector.type?.toLowerCase() || ''
    const target = walletId?.toLowerCase()

    if (kind === 'walletconnect') {
        return id.includes('walletconnect') || name.includes('walletconnect')
    }

    // if (kind === 'coinbase-wallet') {
    //     return (
    //         id === 'base' ||
    //         id.includes('baseaccount') ||
    //         name.includes('base account')
    //     )
    // }
    // if (kind === 'coinbase-wallet') {
    //     return (
    //         id === 'base' ||
    //         id.includes('baseaccount') ||
    //         id.includes('base-account') ||
    //         name === 'base account' ||
    //         name.includes('base account')
    //     )
    // }
    if (kind === 'coinbase-wallet') {
        return (
            id === 'base' ||
            id.includes('baseaccount') ||
            id.includes('base-account') ||
            id.includes('coinbasewallet') ||
            id.includes('coinbasewalletsdk') ||
            name.includes('base account') ||
            name.includes('coinbase wallet') ||
            type.includes('coinbasewallet')
        )
    }

    if (kind === 'injected') {
        if (!target) return false

        return (
            id === target ||
            name === target ||
            id.includes(target) ||
            target.includes(id) ||
            name.includes(target) ||
            target.includes(name) ||
            target.includes('metamask') && name.includes('metamask') ||
            target.includes('phantom') && name.includes('phantom') ||
            target.includes('rabby') && name.includes('rabby') ||
            target.includes('okx') && name.includes('okx') ||
            target.includes('binance') && name.includes('binance')
        )
    }

    return false
}

export function Web3AuthProvider({ children }: { children: React.ReactNode }) {
    const {
        address,
        isConnected: wagmiIsConnected,
        connector,
        status,
    } = useAccount()

    const wagmiChainId = useChainId()
    const { connectors, connectAsync } = useConnect()
    const { disconnectAsync } = useDisconnect()
    const { signMessageAsync } = useSignMessage()

    const [accessToken, setAccessToken] = useState('')
    const [userProfile, setUserProfile] = useState<UserConnection | null>(null)
    const [vobBalance, setVobBalance] = useState('0')
    const [authChecked, setAuthChecked] = useState(false)
    const [selectedWalletOption, setSelectedWalletOption] =
        useState<WalletOption | null>(null)
    const [detectedInjectedWallets, setDetectedInjectedWallets] = useState<WalletOption[]>([])
    const [walletConnectPeer, setWalletConnectPeer] = useState<{
        name?: string
        icon?: string
    } | null>(null)

    useEffect(() => {
        const saved = readSelectedWalletOption()

        if (saved) {
            setSelectedWalletOption(saved)
        }
    }, [])

    // useEffect(() => {
    //     if (typeof window === 'undefined') return
    //
    //     const detectedMap = new Map<string, WalletOption>()
    //
    //     const updateDetectedWallets = () => {
    //         const fallbackWallets = getFallbackInjectedWallets()
    //
    //         for (const wallet of fallbackWallets) {
    //             detectedMap.set(wallet.id, wallet)
    //         }
    //
    //         setDetectedInjectedWallets([...detectedMap.values()])
    //     }
    //
    //     const handleProviderAnnouncement = (event: Event) => {
    //         const customEvent = event as CustomEvent<Eip6963ProviderDetail>
    //         const detail = customEvent.detail
    //
    //         if (!detail?.info?.name || !detail?.provider) return
    //
    //         const wallet = normalizeDetectedInjectedWallet(detail)
    //         detectedMap.set(wallet.id, wallet)
    //
    //         setDetectedInjectedWallets([...detectedMap.values()])
    //     }
    //
    //     window.addEventListener(
    //         'eip6963:announceProvider',
    //         handleProviderAnnouncement,
    //     )
    //
    //     window.dispatchEvent(new Event('eip6963:requestProvider'))
    //
    //     updateDetectedWallets()
    //
    //     const timer = window.setTimeout(updateDetectedWallets, 500)
    //
    //     return () => {
    //         window.removeEventListener(
    //             'eip6963:announceProvider',
    //             handleProviderAnnouncement,
    //         )
    //         window.clearTimeout(timer)
    //     }
    // }, [])

    useEffect(() => {
        if (typeof window === 'undefined') return

        const detectedMap = new Map<string, WalletOption>()

        const handleProviderAnnouncement = (event: Event) => {
            const customEvent = event as CustomEvent<Eip6963ProviderDetail>
            const detail = customEvent.detail

            if (!detail?.info?.name || !detail?.provider) return

            const wallet = normalizeDetectedInjectedWallet(detail)

            detectedMap.set(wallet.id, wallet)
            setDetectedInjectedWallets([...detectedMap.values()])
        }

        window.addEventListener(
            'eip6963:announceProvider',
            handleProviderAnnouncement,
        )

        window.dispatchEvent(new Event('eip6963:requestProvider'))

        return () => {
            window.removeEventListener(
                'eip6963:announceProvider',
                handleProviderAnnouncement,
            )
        }
    }, [])

    const account = address || ''
    const chainId = wagmiChainId ? `0x${wagmiChainId.toString(16)}` : ''

    const walletOptions = useMemo<WalletOption[]>(() => {
        return [
            ...detectedInjectedWallets,
            ...FIXED_WALLET_OPTIONS,
        ]
    }, [detectedInjectedWallets])

    const connectionType = useMemo<ConnectionType>(() => {
        if (selectedWalletOption?.type) {
            return selectedWalletOption.type as ConnectionType
        }

        return resolveConnectionTypeFromConnector(connector?.id, connector?.name)
    }, [connector?.id, connector?.name, selectedWalletOption?.type])

    const activeInjectedProvider: Web3Provider | null = null

    const connectedWallet: ConnectedWallet | null = useMemo(() => {
        if (!account) return null

        const connectorAny = connector as any

        const connectorIcon =
            connectorAny?.icon ||
            connectorAny?.icons?.[0] ||
            connectorAny?.metadata?.icons?.[0] ||
            connectorAny?.peer?.metadata?.icons?.[0] ||
            connectorAny?.session?.peer?.metadata?.icons?.[0]

        const connectorName =
            connectorAny?.metadata?.name ||
            connectorAny?.peer?.metadata?.name ||
            connectorAny?.session?.peer?.metadata?.name ||
            connector?.name

        const fallbackOption =
            selectedWalletOption ||
            findFixedOptionByKind(connectionType as WalletKind)

        return {
            address: account,
            name:
                connectionType === 'walletconnect'
                    ? walletConnectPeer?.name || connectorName || fallbackOption?.name || 'WalletConnect'
                    : fallbackOption?.name || connectorName || 'Wallet',
            icon:
                connectionType === 'walletconnect'
                    ? walletConnectPeer?.icon || connectorIcon || fallbackOption?.icon || '/wallets/walletconnect.svg'
                    : fallbackOption?.icon || connectorIcon || '/default-wallet.png',
        }
    }, [account, connector, connectionType, selectedWalletOption, walletConnectPeer])

    const connectionChecked =
        status !== 'connecting' && status !== 'reconnecting'

    const resetLoginState = useCallback(() => {
        setAccessToken('')
        setUserProfile(null)
        setVobBalance('0')
    }, [])

    const resetWalletConnectionStateOnly = useCallback(() => {
        setSelectedWalletOption(null)
        saveSelectedWalletOption(null)
    }, [])

    const resetWeb3State = useCallback(() => {
        resetWalletConnectionStateOnly()
        resetLoginState()
    }, [resetLoginState, resetWalletConnectionStateOnly])

    const clearSavedWalletSession = useCallback(() => {
        setSelectedWalletOption(null)
        saveSelectedWalletOption(null)
    }, [])

    // const connectWallet = useCallback(
    //     async (kind: WalletKind, walletId?: string) => {
    //         const targetConnector = connectors.find((item) =>
    //             isConnectorMatch(item, kind, walletId),
    //         )
    //
    //         if (!targetConnector) {
    //             console.warn('[connectWallet] connector not found', {
    //                 kind,
    //                 walletId,
    //                 connectors: connectors.map((item) => ({
    //                     id: item.id,
    //                     name: item.name,
    //                     type: item.type,
    //                 })),
    //             })
    //             return false
    //         }
    //
    //         const option =
    //             findWalletOptionById(walletOptions, walletId) ||
    //             findFixedOptionByKind(kind)
    //
    //         try {
    //             await connectAsync({
    //                 connector: targetConnector,
    //             })
    //
    //             if (option) {
    //                 setSelectedWalletOption(option)
    //                 saveSelectedWalletOption(option)
    //             }
    //
    //             return true
    //         } catch (error) {
    //             console.error('[connectWallet error]', {
    //                 kind,
    //                 walletId,
    //                 error,
    //             })
    //
    //             return false
    //         }
    //     },
    //     [connectAsync, connectors, walletOptions],
    // )
    useEffect(() => {
        if (connectionType !== 'walletconnect') {
            setWalletConnectPeer(null)
            return
        }

        if (!connector) {
            setWalletConnectPeer(null)
            return
        }

        let cancelled = false

        async function loadWalletConnectPeer() {
            try {
                const provider = await connector?.getProvider?.()
                const providerAny = provider as any

                const metadata =
                    providerAny?.session?.peer?.metadata ||
                    providerAny?.signer?.session?.peer?.metadata ||
                    providerAny?.client?.session?.values?.()?.[0]?.peer?.metadata

                const name = metadata?.name
                const icon = metadata?.icons?.[0]

                if (cancelled) return

                if (name || icon) {
                    setWalletConnectPeer({
                        name,
                        icon,
                    })
                } else {
                    setWalletConnectPeer(null)
                }
            } catch (error) {
                console.warn('[loadWalletConnectPeer error]', error)

                if (!cancelled) {
                    setWalletConnectPeer(null)
                }
            }
        }

        void loadWalletConnectPeer()

        return () => {
            cancelled = true
        }
    }, [connectionType, connector])

    const connectWallet = useCallback(
        async (kind: WalletKind, walletId?: string) => {
            const targetConnector = connectors.find((item) =>
                isConnectorMatch(item, kind, walletId),
            )

            if (!targetConnector) {
                console.warn('[connectWallet] connector not found', {
                    kind,
                    walletId,
                    connectors: connectors.map((item) => ({
                        id: item.id,
                        name: item.name,
                        type: item.type,
                    })),
                })
                return false
            }

            const option =
                findWalletOptionById(walletOptions, walletId) ||
                findFixedOptionByKind(kind)

            try {
                await connectAsync({
                    connector: targetConnector,
                    // chainId: kind === 'coinbase-wallet' ? 8453 : undefined,
                })

                if (option) {
                    setSelectedWalletOption(option)
                    saveSelectedWalletOption(option)
                }

                return true
            } catch (error) {
                console.error('[connectWallet error]', {
                    kind,
                    walletId,
                    connector: {
                        id: targetConnector.id,
                        name: targetConnector.name,
                        type: targetConnector.type,
                    },
                    error,
                })

                return false
            }
        },
        [connectAsync, connectors, walletOptions],
    )

    const connectInjectedWallet = useCallback(
        async (walletId: string) => {
            return connectWallet('injected', walletId)
        },
        [connectWallet],
    )

    const connectWalletConnect = useCallback(async () => {
        return connectWallet('walletconnect', 'walletconnect')
    }, [connectWallet])

    const connectBaseAccount = useCallback(async () => {
        return connectWallet('coinbase-wallet', 'base')
    }, [connectWallet])

    const disconnectWallet = useCallback(async () => {
        try {
            await disconnectAsync()
        } catch (error) {
            console.error('[disconnectWallet error]', error)
        } finally {
            resetWeb3State()
        }
    }, [disconnectAsync, resetWeb3State])

    const signMessage = useCallback(
        async (message: string) => {
            return await signMessageAsync({
                message,
            })
        },
        [signMessageAsync],
    )

    const getActiveProvider = useCallback((): Web3Provider | null => {
        return null
    }, [])

    const getConnector = useCallback(() => null, [])

    const getWalletConnectProvider = useCallback(() => null, [])

    const getActiveSessionTopic = useCallback(() => '', [])

    const isConnected =
        !!account && wagmiIsConnected && !!connectionType && !!connectedWallet

    const isLoggedIn = !!accessToken && !!userProfile?.walletAddress

    const isSameWalletLogin =
        !!accessToken &&
        !!account &&
        !!userProfile?.walletAddress &&
        account.toLowerCase() === userProfile.walletAddress.toLowerCase()

    const viewState: ViewState = !isConnected
        ? 'disconnected'
        : isSameWalletLogin
            ? 'loggedIn'
            : 'connected'

    const savedWalletIcon =
        typeof window !== 'undefined'
            ? sessionStorage.getItem('vob.wallet.icon')
            : null

    const displayNickname =
        userProfile?.nickname ||
        shortenAddress(userProfile?.walletAddress || account)

    const displayProfileImage =
        userProfile?.profileImageUrl ||
        connectedWallet?.icon ||
        savedWalletIcon ||
        '/default-wallet.png'

    const fetchVobBalance = useCallback(async (token?: string) => {
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            }

            if (token) {
                headers.Authorization = `Bearer ${token}`
            }

            const res = await fetch(`${API_BASE_URL}/web3/vob-balance`, {
                method: 'GET',
                headers,
                credentials: 'include',
            })

            const contentType = res.headers.get('content-type') || ''

            if (!res.ok) {
                setVobBalance('0')
                return
            }

            if (contentType.includes('application/json')) {
                const data = await res.json()

                const balance =
                    data?.balance ??
                    data?.vobBalance ??
                    data?.amount ??
                    data?.data?.balance ??
                    '0'

                setVobBalance(String(balance))
                return
            }

            const text = await res.text()
            setVobBalance(text || '0')
        } catch (error) {
            console.error('[fetchVobBalance error]', error)
            setVobBalance('0')
        }
    }, [])

    const restoreWalletConnection = useCallback(async () => {
        return !!account && wagmiIsConnected
    }, [account, wagmiIsConnected])

    const restoreLoginSession = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/web3/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
            })

            const data = await res.json().catch(() => null)

            if (!res.ok || !data?.accessToken) {
                resetLoginState()
                return false
            }

            const restoredWalletAddress = normalizeOptionalString(
                data?.walletAddress,
            )

            if (!restoredWalletAddress) {
                resetLoginState()
                return false
            }

            const newAccessToken = data.accessToken as string
            const profileImageUrl = normalizeOptionalString(data?.profileImageUrl)
            const nickname =
                normalizeOptionalString(data?.nickname) ||
                shortenAddress(restoredWalletAddress)

            setAccessToken(newAccessToken)

            setUserProfile({
                walletAddress: restoredWalletAddress,
                profileImageUrl,
                nickname,
                email: normalizeOptionalString(data?.email),
                bio: normalizeOptionalString(data?.bio),
            })

            await fetchVobBalance(newAccessToken)

            return true
        } catch (error) {
            console.error('[restoreLoginSession error]', error)
            resetLoginState()
            return false
        }
    }, [fetchVobBalance, resetLoginState])

    useEffect(() => {
        if (typeof window === 'undefined') return

        async function initAuth() {
            try {
                await restoreLoginSession()
            } finally {
                setAuthChecked(true)
            }
        }

        void initAuth()
    }, [restoreLoginSession])

    useEffect(() => {
        console.log('[wagmi account changed]', {
            status,
            address,
            wagmiIsConnected,
            chainId,
            connector: connector
                ? {
                    id: connector.id,
                    name: connector.name,
                    type: connector.type,
                }
                : null,
        })
    }, [status, address, wagmiIsConnected, chainId, connector])

    const noopSetString = useCallback(() => {}, [])
    const noopSetConnectionType = useCallback(() => {}, [])
    const noopSetProvider = useCallback(() => {}, [])
    const noopSetConnectedWallet = useCallback(() => {}, [])

    const value = useMemo<Web3AuthContextValue>(() => {
        return {
            account,
            chainId,
            accessToken,
            connectionType,
            activeInjectedProvider,
            connectedWallet,
            userProfile,
            vobBalance,

            walletOptions,

            connectWallet,
            connectInjectedWallet,
            connectWalletConnect,
            connectBaseAccount,

            restoreWalletConnection,
            connectionChecked,
            authChecked,

            isConnected,
            isLoggedIn,
            isSameWalletLogin,
            viewState,

            displayNickname,
            displayProfileImage,

            setAccount: noopSetString as Dispatch<SetStateAction<string>>,
            setChainId: noopSetString as Dispatch<SetStateAction<string>>,
            setAccessToken,
            setConnectionType:
                noopSetConnectionType as Dispatch<SetStateAction<ConnectionType>>,
            setActiveInjectedProvider:
                noopSetProvider as Dispatch<SetStateAction<Web3Provider | null>>,
            setConnectedWallet:
                noopSetConnectedWallet as Dispatch<
                    SetStateAction<ConnectedWallet | null>
                >,
            setUserProfile,
            setVobBalance,

            getActiveProvider,
            getConnector,
            getWalletConnectProvider,
            getActiveSessionTopic,

            clearSavedWalletSession,

            resetWalletConnectionStateOnly,
            resetLoginState,
            resetWeb3State,

            disconnectWallet,

            signMessage,

            fetchVobBalance,
            restoreLoginSession,
        }
    }, [
        account,
        chainId,
        accessToken,
        connectionType,
        activeInjectedProvider,
        connectedWallet,
        userProfile,
        vobBalance,

        walletOptions,

        connectWallet,
        connectInjectedWallet,
        connectWalletConnect,
        connectBaseAccount,

        restoreWalletConnection,
        connectionChecked,
        authChecked,

        isConnected,
        isLoggedIn,
        isSameWalletLogin,
        viewState,

        displayNickname,
        displayProfileImage,

        noopSetString,
        noopSetConnectionType,
        noopSetProvider,
        noopSetConnectedWallet,

        getActiveProvider,
        getConnector,
        getWalletConnectProvider,
        getActiveSessionTopic,

        clearSavedWalletSession,

        resetWalletConnectionStateOnly,
        resetLoginState,
        resetWeb3State,

        disconnectWallet,

        signMessage,

        fetchVobBalance,
        restoreLoginSession,
    ])

    return (
        <Web3AuthContext.Provider value={value}>
            {children}
        </Web3AuthContext.Provider>
    )
}

export function useWeb3Auth() {
    const context = useContext(Web3AuthContext)

    if (!context) {
        throw new Error('useWeb3Auth must be used inside Web3AuthProvider')
    }

    return context
}