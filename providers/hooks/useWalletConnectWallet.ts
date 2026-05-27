'use client'

import { useCallback, useRef, type Dispatch, type SetStateAction } from 'react'
import { UniversalConnector } from '@reown/appkit-universal-connector'
import { defineChain } from '@reown/appkit/networks'

import type { ConnectionType, SavedWalletSession, ConnectedWallet, Web3Provider } from '@/types/web3'
import {
    isValidEvmAddress,
    normalizeHexChainId,
} from '@/utils/web3'

type UseWalletConnectWalletParams = {
    saveWalletSession: (session: SavedWalletSession) => void
    getSavedWalletSession: () => SavedWalletSession
    clearSavedWalletSession: () => void

    resetLoginState: () => void
    resetWalletConnectionStateOnly: () => void

    setAccount: Dispatch<SetStateAction<string>>
    setChainId: Dispatch<SetStateAction<string>>
    setConnectionType: Dispatch<SetStateAction<ConnectionType>>
    setConnectedWallet: Dispatch<SetStateAction<ConnectedWallet | null>>
}

const WALLETCONNECT_PROJECT_ID =
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

const WALLETCONNECT_OPTION = {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '/wallets/walletconnect.svg',
    type: 'walletconnect' as const,
    detected: false,
}

const ethereumMainnet = defineChain({
    id: 1,
    caipNetworkId: 'eip155:1',
    chainNamespace: 'eip155',
    name: 'Ethereum',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['https://cloudflare-eth.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Etherscan',
            url: 'https://etherscan.io',
        },
    },
})

const bscMainnet = defineChain({
    id: 56,
    caipNetworkId: 'eip155:56',
    chainNamespace: 'eip155',
    name: 'BNB Smart Chain',
    nativeCurrency: {
        decimals: 18,
        name: 'BNB',
        symbol: 'BNB',
    },
    rpcUrls: {
        default: {
            http: ['https://bsc-dataseed.binance.org'],
        },
    },
    blockExplorers: {
        default: {
            name: 'BscScan',
            url: 'https://bscscan.com',
        },
    },
})

export function useWalletConnectWallet({
                                           saveWalletSession,
                                           getSavedWalletSession,
                                           clearSavedWalletSession,
                                           resetLoginState,
                                           resetWalletConnectionStateOnly,
                                           setAccount,
                                           setChainId,
                                           setConnectionType,
                                           setConnectedWallet,
                                       }: UseWalletConnectWalletParams) {
    const connectorRef = useRef<UniversalConnector | null>(null)

    const setConnector = useCallback((connector: UniversalConnector | null) => {
        connectorRef.current = connector
    }, [])

    const getConnector = useCallback(() => {
        return connectorRef.current
    }, [])

    const getWalletConnectProvider = useCallback((): Web3Provider | null => {
        return (connectorRef.current?.provider as Web3Provider | undefined) ?? null
    }, [])

    const getActiveSessionTopic = useCallback((): string => {
        const provider = getWalletConnectProvider()
        const topic = provider?.session?.topic
        return typeof topic === 'string' && topic.length > 0 ? topic : ''
    }, [getWalletConnectProvider])

    const initWalletConnect = useCallback(async () => {
        const currentConnector = getConnector()

        if (currentConnector) return currentConnector

        if (!WALLETCONNECT_PROJECT_ID) {
            throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID not found')
        }

        const origin =
            typeof window !== 'undefined'
                ? window.location.origin
                : 'https://www.vobc.io'

        const connector = await UniversalConnector.init({
            projectId: WALLETCONNECT_PROJECT_ID,
            metadata: {
                name: 'VOBC.IO',
                description: 'VOB Login with WalletConnect',
                url: origin,
                icons: [`${origin}/favicon.svg`],
            },
            networks: [
                {
                    namespace: 'eip155',
                    chains: [bscMainnet, ethereumMainnet],
                    methods: [
                        'eth_accounts',
                        'eth_requestAccounts',
                        'personal_sign',
                        'eth_signTypedData',
                        'eth_signTypedData_v4',
                        'eth_sendTransaction',
                        'wallet_switchEthereumChain',
                    ],
                    events: ['accountsChanged', 'chainChanged', 'disconnect'],
                },
            ],
        })

        setConnector(connector)

        return connector
    }, [getConnector, setConnector])

    const disconnectWalletConnectConnectorOnly = useCallback(
        async (targetConnector?: UniversalConnector | null) => {
            const connector = targetConnector || getConnector()

            try {
                await (connector as any)?.disconnect?.()
            } catch (error) {
                console.warn('[wc connector disconnect error]', error)
            }

            try {
                await (connector as any)?.appKit?.disconnect?.()
            } catch (error) {
                console.warn('[wc appKit disconnect error]', error)
            }

            try {
                await (connector as any)?.appKit?.resetWcConnection?.()
            } catch (error) {
                console.warn('[wc appKit resetWcConnection error]', error)
            }

            try {
                await (connector as any)?.appKit?.resetAccount?.()
            } catch (error) {
                console.warn('[wc appKit resetAccount error]', error)
            }

            setConnector(null)
        },
        [getConnector, setConnector]
    )

    const syncWalletConnectSession = useCallback(
        async (
            sessionToSync?: any,
            options?: {
                validateSavedSession?: boolean
            }
        ) => {
            try {
                const provider = getWalletConnectProvider()
                const session = sessionToSync || provider?.session

                if (!provider || !session?.topic) {
                    return false
                }

                const sessionAccount =
                    session?.namespaces?.eip155?.accounts?.[0] as string | undefined

                const [, sessionChainId, sessionAddress] =
                sessionAccount?.split(':') ?? []

                const accounts = (await provider.request({
                    method: 'eth_accounts',
                })) as string[]

                const requestChainId = (await provider.request({
                    method: 'eth_chainId',
                })) as string

                const selectedAccount = sessionAddress || accounts?.[0] || ''
                const currentChainId = requestChainId || sessionChainId || ''
                const currentTopic = String(
                    session?.topic || provider?.session?.topic || ''
                )

                if (!selectedAccount || !currentTopic) {
                    return false
                }

                if (!isValidEvmAddress(selectedAccount)) {
                    clearSavedWalletSession()
                    resetWalletConnectionStateOnly()
                    return false
                }

                if (options?.validateSavedSession) {
                    const saved = getSavedWalletSession()

                    if (saved.topic && saved.topic !== currentTopic) {
                        console.warn('[syncWalletConnectSession] topic mismatch', {
                            savedTopic: saved.topic,
                            currentTopic,
                        })

                        clearSavedWalletSession()
                        resetWalletConnectionStateOnly()
                        return false
                    }

                    if (
                        saved.account &&
                        saved.account.toLowerCase() !==
                        selectedAccount.toLowerCase()
                    ) {
                        console.warn('[syncWalletConnectSession] account mismatch', {
                            savedAccount: saved.account,
                            selectedAccount,
                        })

                        clearSavedWalletSession()
                        resetWalletConnectionStateOnly()
                        return false
                    }
                }

                const normalizedChainId = normalizeHexChainId(currentChainId)

                const peerMetadata = session?.peer?.metadata
                const walletName = peerMetadata?.name || WALLETCONNECT_OPTION.name
                const walletIcon = peerMetadata?.icons?.[0] || WALLETCONNECT_OPTION.icon

                saveWalletSession({
                    type: 'walletconnect',
                    topic: currentTopic,
                    name: walletName,
                    icon: walletIcon,
                    account: selectedAccount,
                    chainId: normalizedChainId,
                })

                setConnectionType('walletconnect')
                setAccount(selectedAccount)
                setChainId(normalizedChainId)
                setConnectedWallet({
                    address: selectedAccount,
                    icon: walletIcon,
                    name: walletName,
                })

                return true
            } catch (error) {
                console.error('[syncWalletConnectSession error]', error)
                return false
            }
        },
        [
            getWalletConnectProvider,
            clearSavedWalletSession,
            resetWalletConnectionStateOnly,
            getSavedWalletSession,
            saveWalletSession,
            setConnectionType,
            setAccount,
            setChainId,
            setConnectedWallet,
        ]
    )

    const connectWalletConnect = useCallback(async () => {
        try {
            resetLoginState()

            const existingConnector = getConnector()

            if (existingConnector) {
                await disconnectWalletConnectConnectorOnly(existingConnector)
            }

            clearSavedWalletSession()
            resetWalletConnectionStateOnly()

            const connector = await initWalletConnect()
            const result = await connector.connect()

            return await syncWalletConnectSession(result?.session, {
                validateSavedSession: false,
            })
        } catch (error) {
            console.error('[connectWalletConnect error]', error)
            return false
        }
    }, [
        resetLoginState,
        getConnector,
        disconnectWalletConnectConnectorOnly,
        clearSavedWalletSession,
        resetWalletConnectionStateOnly,
        initWalletConnect,
        syncWalletConnectSession,
    ])

    const disconnectWalletConnect = useCallback(async () => {
        const connector = getConnector()

        await disconnectWalletConnectConnectorOnly(connector)

        clearSavedWalletSession()
        resetWalletConnectionStateOnly()
    }, [
        getConnector,
        disconnectWalletConnectConnectorOnly,
        clearSavedWalletSession,
        resetWalletConnectionStateOnly,
    ])

    const restoreWalletConnectConnection = useCallback(async () => {
        try {
            const saved = getSavedWalletSession()

            if (saved.type !== 'walletconnect') {
                return false
            }

            const connector = await initWalletConnect()
            const provider = connector.provider as Web3Provider | undefined

            if (!provider?.session?.topic) {
                return false
            }

            const liveTopic = provider.session.topic

            const accounts = (await provider.request({
                method: 'eth_accounts',
            })) as string[]

            const liveAccount = accounts?.[0] || ''

            if (!liveAccount) {
                console.warn('[restoreWalletConnectConnection] no live account')

                clearSavedWalletSession()
                await disconnectWalletConnectConnectorOnly(connector)
                resetWalletConnectionStateOnly()

                return false
            }

            if (
                saved.account &&
                saved.account.toLowerCase() !== liveAccount.toLowerCase()
            ) {
                console.warn('[restoreWalletConnectConnection] account mismatch', {
                    savedAccount: saved.account,
                    liveAccount,
                })

                clearSavedWalletSession()
                await disconnectWalletConnectConnectorOnly(connector)
                resetWalletConnectionStateOnly()
                return false
            }

            if (saved.topic && liveTopic !== saved.topic) {
                console.warn(
                    '[restoreWalletConnectConnection] topic changed but account matched. Accepting live session.',
                    {
                        savedTopic: saved.topic,
                        liveTopic,
                        savedAccount: saved.account,
                        liveAccount,
                    }
                )

                saveWalletSession({
                    ...saved,
                    type: 'walletconnect',
                    topic: liveTopic,
                })
            }

            return await syncWalletConnectSession(provider.session, {
                validateSavedSession: false,
            })
        } catch (error) {
            console.error('[restoreWalletConnectConnection error]', error)
            return false
        }
    }, [
        getSavedWalletSession,
        initWalletConnect,
        disconnectWalletConnectConnectorOnly,
        clearSavedWalletSession,
        resetWalletConnectionStateOnly,
        saveWalletSession,
        syncWalletConnectSession,
    ])

    return {
        setConnector,
        getConnector,
        getWalletConnectProvider,
        getActiveSessionTopic,
        initWalletConnect,
        disconnectWalletConnectConnectorOnly,
        disconnectWalletConnect,
        syncWalletConnectSession,
        connectWalletConnect,
        restoreWalletConnectConnection,
    }
}