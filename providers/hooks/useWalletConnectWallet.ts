'use client'

import { useCallback, type Dispatch, type SetStateAction } from 'react'
import { UniversalConnector } from '@reown/appkit-universal-connector'

import {
    getUniversalConnector,
    getCurrentUniversalConnector,
    setUniversalConnector,
    resetUniversalConnectorSingleton,
} from '@/lib/walletconnect/universalConnectorClient'

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

const WALLETCONNECT_OPTION = {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '/wallets/walletconnect.svg',
    type: 'walletconnect' as const,
    detected: false,
}


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

    const setConnector = useCallback((connector: UniversalConnector | null) => {
        setUniversalConnector(connector)
    }, [])

    const getConnector = useCallback(() => {
        return getCurrentUniversalConnector()
    }, [])

    const getWalletConnectProvider = useCallback((): Web3Provider | null => {
        return (
            (getCurrentUniversalConnector()?.provider as Web3Provider | undefined) ??
            null
        )
    }, [])

    const getActiveSessionTopic = useCallback((): string => {
        const provider = getWalletConnectProvider()
        const topic = provider?.session?.topic
        return typeof topic === 'string' && topic.length > 0 ? topic : ''
    }, [getWalletConnectProvider])

    const initWalletConnect = useCallback(async () => {
        const connector = await getUniversalConnector()
        setConnector(connector)
        return connector
    }, [setConnector])

    const disconnectWalletConnectConnectorOnly = useCallback(
        async (targetConnector?: UniversalConnector | null) => {
            const connector = targetConnector || getConnector()
            const provider = connector?.provider as any

            try {
                await provider?.disconnect?.()
            } catch (error) {
                console.warn('[wc provider disconnect error]', error)
            }

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

            resetUniversalConnectorSingleton()
        },
        [getConnector]
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

                const selectedAccount = accounts?.[0] || sessionAddress || ''
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