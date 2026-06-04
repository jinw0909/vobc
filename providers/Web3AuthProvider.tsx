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
    getChainInfo,
    type ChainInfo,
} from '@/utils/web3'

export type UserConnection = {
    walletAddress: string
    profileImageUrl?: string
    nickname?: string
    email?: string
    bio?: string
}

type ViewState = 'disconnected' | 'connected' | 'loggedIn'

type WalletKind =
    | 'injected'
    | 'walletconnect'
    | 'coinbase-wallet'

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

    connectWallet: (
        kind: WalletKind,
        walletId?: string,
    ) => Promise<boolean>

    connectInjectedWallet: (
        walletId: string,
    ) => Promise<boolean>

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

    chainInfo: ChainInfo

    setAccount: Dispatch<SetStateAction<string>>
    setChainId: Dispatch<SetStateAction<string>>
    setAccessToken: Dispatch<SetStateAction<string>>
    setConnectionType: Dispatch<SetStateAction<ConnectionType>>
    setActiveInjectedProvider:
        Dispatch<SetStateAction<Web3Provider | null>>
    setConnectedWallet:
        Dispatch<SetStateAction<ConnectedWallet | null>>
    setUserProfile:
        Dispatch<SetStateAction<UserConnection | null>>
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

const Web3AuthContext =
    createContext<Web3AuthContextValue | null>(null)

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://localhost:8080'

const SELECTED_WALLET_STORAGE_KEY =
    'vob.selected.wallet.option'

/**
 * WalletConnect와 Base Account는 브라우저 확장 프로그램 감지 여부와
 * 관계없이 항상 UI에 표시한다.
 *
 * coinbaseWalletSDK는 Wagmi config의 coinbaseWallet() connector ID다.
 * UI에서는 사용자가 이해하기 쉽게 Base Account로 표시한다.
 */
const FIXED_WALLET_OPTIONS: WalletOption[] = [
    {
        id: 'walletconnect',
        name: 'WalletConnect',
        icon: '/wallets/walletconnect.svg',
        type: 'walletconnect',
    },
    {
        id: 'coinbaseWalletSDK',
        name: 'Base Account',
        icon: '/wallets/base.svg',
        type: 'coinbase-wallet',
    },
]

function getInjectedWalletIconFallback(
    name?: string,
    id?: string,
) {
    const value =
        `${name || ''} ${id || ''}`.toLowerCase()

    if (value.includes('metamask')) {
        return '/wallets/metamask.png'
    }

    if (value.includes('phantom')) {
        return '/wallets/phantom.png'
    }

    if (
        value.includes('okx') ||
        value.includes('okex')
    ) {
        return '/wallets/okx.png'
    }

    if (value.includes('rabby')) {
        return '/wallets/rabby.png'
    }

    if (value.includes('binance')) {
        return '/wallets/binance.png'
    }

    if (value.includes('coinbase')) {
        return '/wallets/coinbase.png'
    }

    return '/default-wallet.png'
}

function readSelectedWalletOption(): WalletOption | null {
    if (typeof window === 'undefined') {
        return null
    }

    try {
        const raw =
            sessionStorage.getItem(
                SELECTED_WALLET_STORAGE_KEY,
            )

        if (!raw) {
            return null
        }

        return JSON.parse(raw) as WalletOption
    } catch {
        return null
    }
}

function saveSelectedWalletOption(
    option: WalletOption | null,
) {
    if (typeof window === 'undefined') {
        return
    }

    try {
        if (!option) {
            sessionStorage.removeItem(
                SELECTED_WALLET_STORAGE_KEY,
            )

            sessionStorage.removeItem(
                'vob.wallet.icon',
            )

            return
        }

        sessionStorage.setItem(
            SELECTED_WALLET_STORAGE_KEY,
            JSON.stringify(option),
        )

        if (option.icon) {
            sessionStorage.setItem(
                'vob.wallet.icon',
                option.icon,
            )
        }
    } catch {
        // sessionStorage 접근 실패는 무시한다.
    }
}

function resolveConnectionTypeFromConnector(
    connectorId?: string,
    connectorName?: string,
): ConnectionType {
    const value =
        `${connectorId || ''} ${connectorName || ''}`
            .toLowerCase()

    if (value.includes('walletconnect')) {
        return 'walletconnect'
    }

    if (
        value.includes('coinbasewalletsdk') ||
        value.includes('coinbase wallet') ||
        value.includes('base account')
    ) {
        return 'coinbase-wallet'
    }

    if (connectorId || connectorName) {
        return 'injected'
    }

    return null
}

function findFixedOptionByKind(
    kind: WalletKind,
): WalletOption | null {
    if (kind === 'walletconnect') {
        return (
            FIXED_WALLET_OPTIONS.find(
                (option) =>
                    option.type === 'walletconnect',
            ) || null
        )
    }

    if (kind === 'coinbase-wallet') {
        return (
            FIXED_WALLET_OPTIONS.find(
                (option) =>
                    option.type === 'coinbase-wallet',
            ) || null
        )
    }

    return null
}

function findWalletOptionById(
    walletOptions: WalletOption[],
    walletId?: string,
): WalletOption | null {
    if (!walletId) {
        return null
    }

    const target = walletId.toLowerCase()

    return (
        walletOptions.find(
            (option) =>
                option.id.toLowerCase() === target,
        ) || null
    )
}

function findConnector<
    T extends {
        id: string
        name: string
        type?: string
    },
>(
    connectors: readonly T[],
    kind: WalletKind,
    walletId?: string,
): T | undefined {
    if (kind === 'injected') {
        if (!walletId) {
            return undefined
        }

        /**
         * Injected 지갑은 정확한 ID로만 연결한다.
         *
         * 예:
         * - io.metamask
         * - app.phantom
         * - com.okex.wallet
         */
        return connectors.find(
            (connector) =>
                connector.type?.toLowerCase() ===
                'injected' &&
                connector.id.toLowerCase() ===
                walletId.toLowerCase(),
        )
    }

    if (kind === 'walletconnect') {
        return connectors.find(
            (connector) =>
                connector.id.toLowerCase() ===
                'walletconnect' ||
                connector.name.toLowerCase() ===
                'walletconnect',
        )
    }

    if (kind === 'coinbase-wallet') {
        return connectors.find(
            (connector) =>
                connector.id.toLowerCase() ===
                'coinbasewalletsdk',
        )
    }

    return undefined
}

export function Web3AuthProvider({
                                     children,
                                 }: {
    children: React.ReactNode
}) {
    const {
        address,
        isConnected: wagmiIsConnected,
        connector,
        status,
    } = useAccount()

    const wagmiChainId = useChainId()

    const {
        connectors,
        connectAsync,
    } = useConnect()

    const {
        disconnectAsync,
    } = useDisconnect()

    const {
        signMessageAsync,
    } = useSignMessage()

    const [
        accessToken,
        setAccessToken,
    ] = useState('')

    const [
        userProfile,
        setUserProfile,
    ] = useState<UserConnection | null>(null)

    const [
        vobBalance,
        setVobBalance,
    ] = useState('0')

    const [
        authChecked,
        setAuthChecked,
    ] = useState(false)

    const [
        selectedWalletOption,
        setSelectedWalletOption,
    ] = useState<WalletOption | null>(null)

    const [
        walletConnectPeer,
        setWalletConnectPeer,
    ] = useState<{
        name?: string
        icon?: string
    } | null>(null)

    const chainInfo = useMemo(
        () => getChainInfo(wagmiChainId),
        [wagmiChainId],
    )

    useEffect(() => {
        const saved = readSelectedWalletOption()

        if (saved) {
            setSelectedWalletOption(saved)
        }
    }, [])

    const account =
        address || ''

    const chainId =
        wagmiChainId
            ? `0x${wagmiChainId.toString(16)}`
            : ''

    /**
     * UI에 표시하는 injected 지갑 목록.
     *
     * 중요:
     * 직접 EIP-6963 이벤트를 구독하지 않는다.
     * Wagmi가 실제 연결 가능한 상태로 만든 connector만 사용한다.
     */
    const walletOptions =
        useMemo<WalletOption[]>(() => {
            const uniqueInjectedWallets =
                new Map<string, WalletOption>()

            for (const connector of connectors) {
                const id =
                    connector.id.toLowerCase()

                const type =
                    connector.type?.toLowerCase()

                /**
                 * 특정 지갑이 아닌 generic fallback connector는
                 * UI에 표시하지 않는다.
                 */
                if (
                    type !== 'injected' ||
                    id === 'injected'
                ) {
                    continue
                }

                const connectorIcon =
                    (connector as {
                        icon?: string
                    }).icon

                uniqueInjectedWallets.set(id, {
                    id: connector.id,
                    name: connector.name,
                    icon:
                        connectorIcon ||
                        getInjectedWalletIconFallback(
                            connector.name,
                            connector.id,
                        ),
                    type: 'injected',
                    detected: true,
                })
            }

            return [
                ...uniqueInjectedWallets.values(),
                ...FIXED_WALLET_OPTIONS,
            ]
        }, [connectors])

    const connectionType =
        useMemo<ConnectionType>(() => {
            if (selectedWalletOption?.type) {
                return (
                    selectedWalletOption.type as
                        ConnectionType
                )
            }

            return resolveConnectionTypeFromConnector(
                connector?.id,
                connector?.name,
            )
        }, [
            connector?.id,
            connector?.name,
            selectedWalletOption?.type,
        ])

    /**
     * 현재 구조에서는 provider 객체를 직접 외부로 노출하지 않는다.
     * 연결과 복원은 Wagmi connector가 담당한다.
     */
    const activeInjectedProvider:
        Web3Provider | null = null

    const connectedWallet:
        ConnectedWallet | null =
        useMemo(() => {
            if (!account) {
                return null
            }

            const connectorAny =
                connector as any

            const connectorIcon =
                connectorAny?.icon ||
                connectorAny?.icons?.[0] ||
                connectorAny?.metadata?.icons?.[0] ||
                connectorAny?.peer?.metadata
                    ?.icons?.[0] ||
                connectorAny?.session?.peer
                    ?.metadata?.icons?.[0]

            const connectorName =
                connectorAny?.metadata?.name ||
                connectorAny?.peer?.metadata
                    ?.name ||
                connectorAny?.session?.peer
                    ?.metadata?.name ||
                connector?.name

            const fallbackOption =
                selectedWalletOption ||
                findFixedOptionByKind(
                    connectionType as WalletKind,
                )

            return {
                address: account,

                name:
                    connectionType ===
                    'walletconnect'
                        ? walletConnectPeer?.name ||
                        connectorName ||
                        fallbackOption?.name ||
                        'WalletConnect'
                        : fallbackOption?.name ||
                        connectorName ||
                        'Wallet',

                icon:
                    connectionType ===
                    'walletconnect'
                        ? walletConnectPeer?.icon ||
                        connectorIcon ||
                        fallbackOption?.icon ||
                        '/wallets/walletconnect.svg'
                        : fallbackOption?.icon ||
                        connectorIcon ||
                        '/default-wallet.png',
            }
        }, [
            account,
            connector,
            connectionType,
            selectedWalletOption,
            walletConnectPeer,
        ])

    const connectionChecked =
        status !== 'connecting' &&
        status !== 'reconnecting'

    const resetLoginState =
        useCallback(() => {
            setAccessToken('')
            setUserProfile(null)
            setVobBalance('0')
        }, [])

    const resetWalletConnectionStateOnly =
        useCallback(() => {
            setSelectedWalletOption(null)
            saveSelectedWalletOption(null)
        }, [])

    const resetWeb3State =
        useCallback(() => {
            resetWalletConnectionStateOnly()
            resetLoginState()
        }, [
            resetLoginState,
            resetWalletConnectionStateOnly,
        ])

    const clearSavedWalletSession =
        useCallback(() => {
            setSelectedWalletOption(null)
            saveSelectedWalletOption(null)
        }, [])

    useEffect(() => {
        if (
            connectionType !==
            'walletconnect'
        ) {
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
                const provider =
                    await connector?.getProvider?.()

                const providerAny =
                    provider as any

                const metadata =
                    providerAny?.session?.peer
                        ?.metadata ||
                    providerAny?.signer?.session
                        ?.peer?.metadata ||
                    providerAny?.client?.session
                        ?.values?.()?.[0]
                        ?.peer?.metadata

                const name =
                    metadata?.name

                const icon =
                    metadata?.icons?.[0]

                if (cancelled) {
                    return
                }

                if (name || icon) {
                    setWalletConnectPeer({
                        name,
                        icon,
                    })
                } else {
                    setWalletConnectPeer(null)
                }
            } catch (error) {
                console.warn(
                    '[loadWalletConnectPeer error]',
                    error,
                )

                if (!cancelled) {
                    setWalletConnectPeer(null)
                }
            }
        }

        void loadWalletConnectPeer()

        return () => {
            cancelled = true
        }
    }, [
        connectionType,
        connector,
    ])

    const connectWallet =
        useCallback(
            async (
                kind: WalletKind,
                walletId?: string,
            ) => {
                const targetConnector =
                    findConnector(
                        connectors,
                        kind,
                        walletId,
                    )

                if (!targetConnector) {
                    console.warn(
                        '[connectWallet] connector not found',
                        {
                            kind,
                            walletId,
                            connectors:
                                connectors.map(
                                    (item) => ({
                                        id:
                                        item.id,
                                        name:
                                        item.name,
                                        type:
                                        item.type,
                                    }),
                                ),
                        },
                    )

                    return false
                }

                const option =
                    findWalletOptionById(
                        walletOptions,
                        walletId,
                    ) ||
                    findFixedOptionByKind(kind)

                try {
                    await connectAsync({
                        connector:
                        targetConnector,
                    })

                    if (option) {
                        setSelectedWalletOption(
                            option,
                        )

                        saveSelectedWalletOption(
                            option,
                        )
                    }

                    return true
                } catch (error) {
                    console.error(
                        '[connectWallet error]',
                        {
                            kind,
                            walletId,
                            connector: {
                                id:
                                targetConnector.id,
                                name:
                                targetConnector.name,
                                type:
                                targetConnector.type,
                            },
                            error,
                        },
                    )

                    return false
                }
            },
            [
                connectAsync,
                connectors,
                walletOptions,
            ],
        )

    const connectInjectedWallet =
        useCallback(
            async (
                walletId: string,
            ) => {
                return connectWallet(
                    'injected',
                    walletId,
                )
            },
            [connectWallet],
        )

    const connectWalletConnect =
        useCallback(async () => {
            return connectWallet(
                'walletconnect',
                'walletconnect',
            )
        }, [connectWallet])

    const connectBaseAccount =
        useCallback(async () => {
            return connectWallet(
                'coinbase-wallet',
                'coinbaseWalletSDK',
            )
        }, [connectWallet])

    const disconnectWallet =
        useCallback(async () => {
            try {
                await disconnectAsync()
            } catch (error) {
                console.error(
                    '[disconnectWallet error]',
                    error,
                )
            } finally {
                resetWeb3State()
            }
        }, [
            disconnectAsync,
            resetWeb3State,
        ])

    const signMessage =
        useCallback(
            async (
                message: string,
            ) => {
                return await signMessageAsync({
                    message,
                })
            },
            [signMessageAsync],
        )

    const getActiveProvider =
        useCallback(
            (): Web3Provider | null => {
                return null
            },
            [],
        )

    const getConnector =
        useCallback(() => null, [])

    const getWalletConnectProvider =
        useCallback(() => null, [])

    const getActiveSessionTopic =
        useCallback(() => '', [])

    const isConnected =
        !!account &&
        wagmiIsConnected &&
        !!connectionType &&
        !!connectedWallet

    const isLoggedIn =
        !!accessToken &&
        !!userProfile?.walletAddress

    const isSameWalletLogin =
        !!accessToken &&
        !!account &&
        !!userProfile?.walletAddress &&
        account.toLowerCase() ===
        userProfile.walletAddress.toLowerCase()

    const viewState: ViewState =
        !isConnected
            ? 'disconnected'
            : isSameWalletLogin
                ? 'loggedIn'
                : 'connected'

    const savedWalletIcon =
        typeof window !== 'undefined'
            ? sessionStorage.getItem(
                'vob.wallet.icon',
            )
            : null

    const displayNickname =
        userProfile?.nickname ||
        shortenAddress(
            userProfile?.walletAddress ||
            account,
        )

    // const displayProfileImage =
    //     userProfile?.profileImageUrl ||
    //     connectedWallet?.icon ||
    //     savedWalletIcon ||
    //     '/default-wallet.png'

    const displayProfileImage =
        userProfile?.profileImageUrl ||
        (
            connectionType === 'walletconnect'
                ? '/wallets/walletconnect.svg'
                : connectedWallet?.icon
        ) ||
        savedWalletIcon ||
        '/default-wallet.png'

    const fetchVobBalance =
        useCallback(
            async (
                token?: string,
            ) => {
                try {
                    const headers:
                        Record<string, string> = {
                        'Content-Type':
                            'application/json',
                    }

                    if (token) {
                        headers.Authorization =
                            `Bearer ${token}`
                    }

                    const res =
                        await fetch(
                            `${API_BASE_URL}/web3/vob-balance`,
                            {
                                method: 'GET',
                                headers,
                                credentials:
                                    'include',
                            },
                        )

                    const contentType =
                        res.headers.get(
                            'content-type',
                        ) || ''

                    if (!res.ok) {
                        setVobBalance('0')
                        return
                    }

                    if (
                        contentType.includes(
                            'application/json',
                        )
                    ) {
                        const data =
                            await res.json()

                        const balance =
                            data?.balance ??
                            data?.vobBalance ??
                            data?.amount ??
                            data?.data
                                ?.balance ??
                            '0'

                        setVobBalance(
                            String(balance),
                        )

                        return
                    }

                    const text =
                        await res.text()

                    setVobBalance(
                        text || '0',
                    )
                } catch (error) {
                    console.error(
                        '[fetchVobBalance error]',
                        error,
                    )

                    setVobBalance('0')
                }
            },
            [],
        )

    /**
     * 실제 reconnect는 Wagmi가 수행한다.
     * 이 함수는 현재 복원 여부만 반환한다.
     */
    const restoreWalletConnection =
        useCallback(async () => {
            return (
                !!account &&
                wagmiIsConnected
            )
        }, [
            account,
            wagmiIsConnected,
        ])

    const restoreLoginSession =
        useCallback(async () => {
            try {
                const res =
                    await fetch(
                        `${API_BASE_URL}/web3/auth/refresh`,
                        {
                            method: 'POST',
                            credentials:
                                'include',
                        },
                    )

                const data =
                    await res
                        .json()
                        .catch(() => null)

                if (
                    !res.ok ||
                    !data?.accessToken
                ) {
                    resetLoginState()
                    return false
                }

                const restoredWalletAddress =
                    normalizeOptionalString(
                        data?.walletAddress,
                    )

                if (
                    !restoredWalletAddress
                ) {
                    resetLoginState()
                    return false
                }

                const newAccessToken =
                    data.accessToken as string

                const profileImageUrl =
                    normalizeOptionalString(
                        data?.profileImageUrl,
                    )

                const nickname =
                    normalizeOptionalString(
                        data?.nickname,
                    ) ||
                    shortenAddress(
                        restoredWalletAddress,
                    )

                setAccessToken(
                    newAccessToken,
                )

                setUserProfile({
                    walletAddress:
                    restoredWalletAddress,
                    profileImageUrl,
                    nickname,
                    email:
                        normalizeOptionalString(
                            data?.email,
                        ),
                    bio:
                        normalizeOptionalString(
                            data?.bio,
                        ),
                })

                await fetchVobBalance(
                    newAccessToken,
                )

                return true
            } catch (error) {
                console.error(
                    '[restoreLoginSession error]',
                    error,
                )

                resetLoginState()

                return false
            }
        }, [
            fetchVobBalance,
            resetLoginState,
        ])

    useEffect(() => {
        if (
            typeof window ===
            'undefined'
        ) {
            return
        }

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
        console.log(
            '[wagmi account changed]',
            {
                status,
                address,
                wagmiIsConnected,
                chainId,
                connector:
                    connector
                        ? {
                            id:
                            connector.id,
                            name:
                            connector.name,
                            type:
                            connector.type,
                        }
                        : null,
            },
        )
    }, [
        status,
        address,
        wagmiIsConnected,
        chainId,
        connector,
    ])

    useEffect(() => {
        console.log(
            '[wagmi connectors]',
            connectors.map(
                (item) => ({
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    icon:
                        (
                            item as {
                                icon?: string
                            }
                        ).icon ||
                        null,
                }),
            ),
        )
    }, [connectors])

    const noopSetString =
        useCallback(() => {}, [])

    const noopSetConnectionType =
        useCallback(() => {}, [])

    const noopSetProvider =
        useCallback(() => {}, [])

    const noopSetConnectedWallet =
        useCallback(() => {}, [])

    const value =
        useMemo<Web3AuthContextValue>(
            () => {
                return {
                    account,
                    chainId,
                    accessToken,
                    connectionType,
                    activeInjectedProvider,
                    connectedWallet,
                    userProfile,
                    vobBalance,
                    chainInfo,

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



                    setAccount:
                        noopSetString as Dispatch<
                            SetStateAction<string>
                        >,

                    setChainId:
                        noopSetString as Dispatch<
                            SetStateAction<string>
                        >,

                    setAccessToken,

                    setConnectionType:
                        noopSetConnectionType as Dispatch<
                            SetStateAction<ConnectionType>
                        >,

                    setActiveInjectedProvider:
                        noopSetProvider as Dispatch<
                            SetStateAction<
                                Web3Provider | null
                            >
                        >,

                    setConnectedWallet:
                        noopSetConnectedWallet as Dispatch<
                            SetStateAction<
                                ConnectedWallet | null
                            >
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
            },
            [
                account,
                chainId,
                accessToken,
                connectionType,
                activeInjectedProvider,
                connectedWallet,
                userProfile,
                vobBalance,
                chainInfo,

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
            ],
        )

    return (
        <Web3AuthContext.Provider
            value={value}
        >
            {children}
        </Web3AuthContext.Provider>
    )
}

export function useWeb3Auth() {
    const context =
        useContext(Web3AuthContext)

    if (!context) {
        throw new Error(
            'useWeb3Auth must be used inside Web3AuthProvider',
        )
    }

    return context
}