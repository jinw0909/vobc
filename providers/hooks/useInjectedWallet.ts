'use client'

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type Dispatch,
    type SetStateAction,
} from 'react'

import { createBaseAccountSDK } from '@base-org/account'

import {
    ConnectionType,
    SavedWalletSession,
    Web3Provider,
    WalletOption,
    ConnectedWallet,
} from '@/types/web3'

import {
    isValidEvmAddress,
    normalizeHexChainId,
} from '@/utils/web3'

type Eip6963ProviderInfo = {
    uuid?: string
    name: string
    icon: string
    rdns?: string
}

type Eip6963AnnounceDetail = {
    info: Eip6963ProviderInfo
    provider: Web3Provider
}

type UseInjectedWalletParams = {
    saveWalletSession: (session: SavedWalletSession) => void
    getSavedWalletSession: () => SavedWalletSession
    clearSavedWalletSession: () => void

    resetLoginState: () => void
    resetWalletConnectionStateOnly: () => void

    account: string
    connectionType: ConnectionType
    activeInjectedProvider: Web3Provider | null
    connectedWallet: ConnectedWallet | null

    setAccount: Dispatch<SetStateAction<string>>
    setChainId: Dispatch<SetStateAction<string>>
    setConnectionType: Dispatch<SetStateAction<ConnectionType>>
    setActiveInjectedProvider: Dispatch<SetStateAction<Web3Provider | null>>
    setConnectedWallet: Dispatch<SetStateAction<ConnectedWallet | null>>
}

const COINBASE_WALLET_OPTION: WalletOption = {
    id: 'coinbase-wallet',
    name: 'Base Account',
    icon: '/wallets/base.svg',
    type: 'coinbase-wallet',
    detected: false,
}

const WALLETCONNECT_OPTION: WalletOption = {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '/wallets/walletconnect.svg',
    type: 'walletconnect',
    detected: false,
}

function getWalletOptions(discoveredMap: Map<string, WalletOption>): WalletOption[] {
    return [
        ...Array.from(discoveredMap.values()),
        WALLETCONNECT_OPTION,
        COINBASE_WALLET_OPTION,
    ]
}

function createBaseAccountProvider() {
    const origin =
        typeof window !== 'undefined'
            ? window.location.origin
            : 'https://www.vobc.io'

    const baseAccount = createBaseAccountSDK({
        appName: 'VOB',
        appLogoUrl: `${origin}/favicon.svg`,
        appChainIds: [8453],
    })

    return baseAccount.getProvider() as unknown as Web3Provider
}

export function useInjectedWallet({
                                      saveWalletSession,
                                      getSavedWalletSession,
                                      clearSavedWalletSession,

                                      resetLoginState,
                                      resetWalletConnectionStateOnly,

                                      account,
                                      connectionType,
                                      activeInjectedProvider,
                                      connectedWallet,

                                      setAccount,
                                      setChainId,
                                      setConnectionType,
                                      setActiveInjectedProvider,
                                      setConnectedWallet,
                                  }: UseInjectedWalletParams) {
    const discoveredWalletsRef = useRef<Map<string, WalletOption>>(new Map())
    const getSavedWalletSessionRef = useRef(getSavedWalletSession)

    const [walletOptions, setWalletOptions] = useState<WalletOption[]>([
        WALLETCONNECT_OPTION,
        COINBASE_WALLET_OPTION,
    ])

    useEffect(() => {
        getSavedWalletSessionRef.current = getSavedWalletSession
    }, [getSavedWalletSession])

    const connectInjectedWallet = useCallback(
        async (walletId: string) => {
            try {
                const option = discoveredWalletsRef.current.get(walletId)

                if (!option?.provider) {
                    console.warn('[connectInjectedWallet] provider not found:', walletId)
                    return false
                }

                resetLoginState()
                clearSavedWalletSession()
                resetWalletConnectionStateOnly()

                const accounts = (await option.provider.request({
                    method: 'eth_requestAccounts',
                })) as string[]

                const selectedAccount = accounts?.[0] || ''

                if (!selectedAccount || !isValidEvmAddress(selectedAccount)) {
                    return false
                }

                const currentChainId = (await option.provider.request({
                    method: 'eth_chainId',
                })) as string

                const normalizedChainId = normalizeHexChainId(currentChainId)

                saveWalletSession({
                    type: 'injected',
                    id: option.id,
                    name: option.name,
                    icon: option.icon,
                    account: selectedAccount,
                    chainId: normalizedChainId,
                })

                setActiveInjectedProvider(option.provider)
                setConnectionType('injected')
                setAccount(selectedAccount)
                setChainId(normalizedChainId)
                setConnectedWallet({
                    address: selectedAccount,
                    icon: option.icon,
                    name: option.name,
                })

                return true
            } catch (error) {
                console.error('[connectInjectedWallet error]', error)
                return false
            }
        },
        [
            resetLoginState,
            clearSavedWalletSession,
            resetWalletConnectionStateOnly,
            saveWalletSession,
            setActiveInjectedProvider,
            setConnectionType,
            setAccount,
            setChainId,
            setConnectedWallet,
        ]
    )

    const restoreInjectedConnection = useCallback(
        async () => {
            try {
                const saved = getSavedWalletSessionRef.current()

                if (saved.type !== 'injected' || !saved.id) {
                    return false
                }

                const option = discoveredWalletsRef.current.get(saved.id)

                if (!option?.provider) {
                    return false
                }

                const accounts = (await option.provider.request({
                    method: 'eth_accounts',
                })) as string[]

                const selectedAccount = accounts?.[0] || ''

                if (!selectedAccount) {
                    return false
                }

                if (!isValidEvmAddress(selectedAccount)) {
                    clearSavedWalletSession()
                    resetWalletConnectionStateOnly()
                    return false
                }

                if (
                    saved.account &&
                    saved.account.toLowerCase() !== selectedAccount.toLowerCase()
                ) {
                    console.warn('[restoreInjectedConnection] account mismatch', {
                        savedAccount: saved.account,
                        selectedAccount,
                    })

                    clearSavedWalletSession()
                    resetWalletConnectionStateOnly()
                    return false
                }

                const currentChainId = (await option.provider.request({
                    method: 'eth_chainId',
                })) as string

                const normalizedChainId = normalizeHexChainId(currentChainId)

                saveWalletSession({
                    type: 'injected',
                    id: option.id,
                    name: option.name,
                    icon: option.icon,
                    account: selectedAccount,
                    chainId: normalizedChainId,
                })

                setActiveInjectedProvider(option.provider)
                setConnectionType('injected')
                setAccount(selectedAccount)
                setChainId(normalizedChainId)
                setConnectedWallet({
                    address: selectedAccount,
                    icon: option.icon,
                    name: option.name,
                })

                return true
            } catch (error) {
                console.error('[restoreInjectedConnection error]', error)
                return false
            }
        },
        [
            clearSavedWalletSession,
            resetWalletConnectionStateOnly,
            saveWalletSession,
            setActiveInjectedProvider,
            setConnectionType,
            setAccount,
            setChainId,
            setConnectedWallet,
        ]
    )

    const restoreInjectedConnectionRef = useRef(restoreInjectedConnection)

    useEffect(() => {
        restoreInjectedConnectionRef.current = restoreInjectedConnection
    }, [restoreInjectedConnection])

    const connectBaseAccount = useCallback(
        async () => {
            try {
                resetLoginState()
                clearSavedWalletSession()
                resetWalletConnectionStateOnly()

                const provider = createBaseAccountProvider()

                const accounts = (await provider.request({
                    method: 'eth_requestAccounts',
                })) as string[]

                const selectedAccount = accounts?.[0] || ''

                if (!selectedAccount || !isValidEvmAddress(selectedAccount)) {
                    return false
                }

                const currentChainId = (await provider.request({
                    method: 'eth_chainId',
                })) as string

                const normalizedChainId = normalizeHexChainId(currentChainId)

                saveWalletSession({
                    type: 'coinbase-wallet',
                    id: COINBASE_WALLET_OPTION.id,
                    name: COINBASE_WALLET_OPTION.name,
                    icon: COINBASE_WALLET_OPTION.icon,
                    account: selectedAccount,
                    chainId: normalizedChainId,
                })

                setActiveInjectedProvider(provider)
                setConnectionType('coinbase-wallet')
                setAccount(selectedAccount)
                setChainId(normalizedChainId)
                setConnectedWallet({
                    address: selectedAccount,
                    icon: COINBASE_WALLET_OPTION.icon,
                    name: COINBASE_WALLET_OPTION.name,
                })

                return true
            } catch (error) {
                console.error('[connectBaseAccount error]', error)
                return false
            }
        },
        [
            resetLoginState,
            clearSavedWalletSession,
            resetWalletConnectionStateOnly,
            saveWalletSession,
            setActiveInjectedProvider,
            setConnectionType,
            setAccount,
            setChainId,
            setConnectedWallet,
        ]
    )

    const restoreBaseAccountConnection = useCallback(
        async () => {
            try {
                const saved = getSavedWalletSessionRef.current()

                if (saved.type !== 'coinbase-wallet') {
                    return false
                }

                const provider = createBaseAccountProvider()

                const accounts = (await provider.request({
                    method: 'eth_accounts',
                })) as string[]

                const selectedAccount = accounts?.[0] || ''

                if (!selectedAccount) {
                    console.warn('[restoreBaseAccountConnection] no selected account')
                    return false
                }

                if (!isValidEvmAddress(selectedAccount)) {
                    resetWalletConnectionStateOnly()
                    return false
                }

                if (
                    saved.account &&
                    saved.account.toLowerCase() !== selectedAccount.toLowerCase()
                ) {
                    console.warn('[restoreBaseAccountConnection] account mismatch', {
                        savedAccount: saved.account,
                        selectedAccount,
                    })

                    clearSavedWalletSession()
                    resetWalletConnectionStateOnly()
                    return false
                }

                const currentChainId = (await provider.request({
                    method: 'eth_chainId',
                })) as string

                const normalizedChainId = normalizeHexChainId(currentChainId)

                saveWalletSession({
                    type: 'coinbase-wallet',
                    id: COINBASE_WALLET_OPTION.id,
                    name: COINBASE_WALLET_OPTION.name,
                    icon: COINBASE_WALLET_OPTION.icon,
                    account: selectedAccount,
                    chainId: normalizedChainId,
                })

                setActiveInjectedProvider(provider)
                setConnectionType('coinbase-wallet')
                setAccount(selectedAccount)
                setChainId(normalizedChainId)
                setConnectedWallet({
                    address: selectedAccount,
                    icon: COINBASE_WALLET_OPTION.icon,
                    name: COINBASE_WALLET_OPTION.name,
                })

                return true
            } catch (error) {
                console.error('[restoreBaseAccountConnection error]', error)
                return false
            }
        },
        [
            clearSavedWalletSession,
            resetWalletConnectionStateOnly,
            saveWalletSession,
            setActiveInjectedProvider,
            setConnectionType,
            setAccount,
            setChainId,
            setConnectedWallet,
        ]
    )

    useEffect(() => {
        if (
            !activeInjectedProvider ||
            !['injected', 'coinbase-wallet'].includes(connectionType || '')
        ) {
            return
        }

        const handleAccountsChanged = async (accounts: string[]) => {
            const nextAccount = accounts?.[0] || ''

            if (!nextAccount || !isValidEvmAddress(nextAccount)) {
                clearSavedWalletSession()
                resetWalletConnectionStateOnly()
                resetLoginState()
                return
            }

            try {
                const nextChainId = (await activeInjectedProvider.request({
                    method: 'eth_chainId',
                })) as string

                const normalizedChainId = normalizeHexChainId(nextChainId)

                setAccount(nextAccount)
                setChainId(normalizedChainId)

                setConnectedWallet((prev) =>
                    prev
                        ? {
                            ...prev,
                            address: nextAccount,
                        }
                        : null
                )

                saveWalletSession({
                    type: connectionType,
                    account: nextAccount,
                    chainId: normalizedChainId,
                    name: connectedWallet?.name,
                    icon: connectedWallet?.icon,
                })
            } catch (error) {
                console.error('[injected accountsChanged error]', error)
            }
        }

        const handleChainChanged = (nextChainId: string) => {
            const normalizedChainId = normalizeHexChainId(nextChainId)

            setChainId(normalizedChainId)

            saveWalletSession({
                type: connectionType,
                account,
                chainId: normalizedChainId,
                name: connectedWallet?.name,
                icon: connectedWallet?.icon,
            })
        }

        const handleDisconnect = () => {
            clearSavedWalletSession()
            resetWalletConnectionStateOnly()
            resetLoginState()
        }

        activeInjectedProvider.on?.('accountsChanged', handleAccountsChanged)
        activeInjectedProvider.on?.('chainChanged', handleChainChanged)
        activeInjectedProvider.on?.('disconnect', handleDisconnect)

        return () => {
            activeInjectedProvider.removeListener?.(
                'accountsChanged',
                handleAccountsChanged
            )
            activeInjectedProvider.removeListener?.(
                'chainChanged',
                handleChainChanged
            )
            activeInjectedProvider.removeListener?.(
                'disconnect',
                handleDisconnect
            )
        }
    }, [
        activeInjectedProvider,
        connectionType,
        account,
        connectedWallet,
        clearSavedWalletSession,
        resetWalletConnectionStateOnly,
        resetLoginState,
        saveWalletSession,
        setAccount,
        setChainId,
        setConnectedWallet,
    ])

    useEffect(() => {
        if (typeof window === 'undefined') return

        let restored = false

        const tryRestoreInjected = async () => {
            if (restored) return

            const saved = getSavedWalletSessionRef.current()

            if (saved.type !== 'injected') return

            const restoredOk = await restoreInjectedConnectionRef.current()

            if (restoredOk) {
                restored = true
            }
        }

        const handleAnnounceProvider = async (event: Event) => {
            const customEvent = event as CustomEvent<Eip6963AnnounceDetail>
            const detail = customEvent.detail

            if (!detail?.info || !detail?.provider) return

            const id =
                detail.info.rdns ||
                detail.info.uuid ||
                detail.info.name

            discoveredWalletsRef.current.set(id, {
                id,
                name: detail.info.name,
                icon: detail.info.icon,
                type: 'injected',
                provider: detail.provider,
                detected: true,
            })

            setWalletOptions(getWalletOptions(discoveredWalletsRef.current))

            await tryRestoreInjected()
        }

        window.addEventListener(
            'eip6963:announceProvider',
            handleAnnounceProvider as EventListener
        )

        window.dispatchEvent(new Event('eip6963:requestProvider'))

        setWalletOptions(getWalletOptions(discoveredWalletsRef.current))

        return () => {
            window.removeEventListener(
                'eip6963:announceProvider',
                handleAnnounceProvider as EventListener
            )
        }
    }, [])

    return {
        walletOptions,
        connectInjectedWallet,
        restoreInjectedConnection,
        connectBaseAccount,
        restoreBaseAccountConnection,
    }
}