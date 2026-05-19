'use client';



import { useEffect, useMemo, useRef, useState } from 'react';
import { UniversalConnector } from '@reown/appkit-universal-connector';
import { defineChain } from '@reown/appkit/networks';
import styles from './styles.module.css';
import triangle from '@/public/icons/triangle_white.png'
import vobLogo from '@/public/vob_white.png'
import Image from 'next/image';
import {NavigationLink} from "@/ui/NavigationLink";
import {usePathname, useRouter} from "@/i18n/navigation";
import {
    useWeb3Auth,
    type Web3Provider,
} from '@/providers/Web3AuthProvider'


type Status =
    | 'idle'
    | 'initializing'
    | 'connecting'
    | 'connected'
    | 'rejected'
    | 'pending'
    | 'failed';

type ViewState = 'disconnected' | 'connected' | 'loggedIn';

type WCProvider = Web3Provider

type InjectedProvider = Web3Provider

type WalletOption = {
    id: string;
    name: string;
    icon: string;
    type: 'injected' | 'walletconnect';
    provider?: InjectedProvider;
    detected?: boolean;
};

type Eip6963ProviderInfo = {
    uuid?: string;
    name: string;
    icon: string;
    rdns?: string;
};

type Eip6963AnnounceDetail = {
    info: Eip6963ProviderInfo;
    provider: InjectedProvider;
};

type WalletConnection = {
    address: string;
    icon: string;
    name: string;
};

type UserConnection = {
    walletAddress: string;
    profileImageUrl?: string;
    nickname?: string;
    email?: string;
    bio?: string;
};

type LoginProps = {
    onConnectSuccess?: (conn: WalletConnection) => void | Promise<void>;
    onLoginSuccess?: (user: UserConnection) => void | Promise<void>;
    onLogout?: () => void | Promise<void>;
    onDisconnect?: () => void | Promise<void>;
    onClose?: () => void;
    onGoMyPage?: () => void;
};

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
});
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
});
// const ALLOWED_CHAIN_IDS = ['0x1'];
// const ALLOWED_CHAIN_IDS_DECIMAL = new Set([1]);

const WALLETCONNECT_OPTION: WalletOption = {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '/walletconnect.svg',
    type: 'walletconnect',
    detected: false,
};

function isValidEvmAddress(value: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(value);
}

function normalizeHexChainId(chainId: string | number): string {
    if (typeof chainId === 'number') {
        return `0x${chainId.toString(16)}`;
    }

    if (typeof chainId === 'string') {
        if (chainId.startsWith('0x')) {
            return chainId.toLowerCase();
        }

        const parsed = Number(chainId);
        if (!Number.isNaN(parsed)) {
            return `0x${parsed.toString(16)}`;
        }
    }

    return '';
}

function getUserFriendlyEvmMessage(chainId?: string) {
    if (!chainId) {
        return 'The currently selected account is not an EVM account or is not supported.';
    }

    return `The currently selected chain (${chainId}) is not supported for login. Please switch to Ethereum Mainnet.`;
}
function getChainInfoMessage(chainId?: string) {
    if (!chainId) {
        return 'Connected with an EVM wallet.';
    }

    return `Connected chain: ${chainId}`;
}

function toHexUtf8(value: string): string {
    return (
        '0x' +
        Array.from(new TextEncoder().encode(value))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')
    );
}
function getWalletOptionsWithWalletConnect(discoveredMap: Map<string, WalletOption>): WalletOption[] {
    return [...Array.from(discoveredMap.values()), WALLETCONNECT_OPTION];
}

function shortenAddress(address?: string) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getNetworkName(chainId?: string) {
    const normalized = normalizeHexChainId(chainId || '');

    switch (normalized) {
        case '0x1':
            return 'Ethereum Mainnet';
        case '0x38':
            return 'BNB Smart Chain';
        default:
            return normalized || '-';
    }
}

function isEvmChain(nextChainId?: string): boolean {
    const normalizedChainId = normalizeHexChainId(nextChainId || '');
    return !!normalizedChainId;
}
export default function Login({
                                  onConnectSuccess,
                                  onLoginSuccess,
                                  onLogout,
                                  onDisconnect,
                                  onClose,
                                  onGoMyPage,
                              }: LoginProps) {
    // const connectorRef = useRef<UniversalConnector | null>(null);
    const discoveredWalletsRef = useRef<Map<string, WalletOption>>(new Map());

    const [status, setStatus] = useState<Status>('idle');
    const [message, setMessage] = useState('Select a wallet to connect');

    const [apiResult, setApiResult] = useState('');

    const [walletOptions, setWalletOptions] = useState<WalletOption[]>([WALLETCONNECT_OPTION]);
    const [showWalletOptions, setShowWalletOptions] = useState(true);

    const [confirmModal, setConfirmModal] = useState<'disconnect' | 'logout' | null>(null);

    const {
        account,
        chainId,
        accessToken,
        connectionType,
        activeInjectedProvider,
        connectedWallet,
        userProfile,
        vobBalance,

        isConnected,
        isLoggedIn,
        isSameWalletLogin,
        viewState,
        displayNickname,
        displayProfileImage,

        setAccount,
        setChainId,
        setAccessToken,
        setConnectionType,
        setActiveInjectedProvider,
        setConnectedWallet,
        setUserProfile,
        setVobBalance,

        setConnector,
        getConnector,
        getWalletConnectProvider,
        getActiveProvider,
        getActiveSessionTopic,

        saveWalletSession,
        getSavedWalletSession,
        clearSavedWalletSession,

        resetWalletConnectionStateOnly,
        resetLoginState,
        resetWeb3State,

        fetchVobBalance,
        restoreLoginSession,
    } = useWeb3Auth()


    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
    const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

    const resetConnectionState = (
        nextMessage?: string,
        options?: {
            clearSavedSession?: boolean
            clearLogin?: boolean
        }
    ) => {
        if (options?.clearSavedSession) {
            clearSavedWalletSession()
        }

        resetWalletConnectionStateOnly()

        if (options?.clearLogin) {
            resetLoginState()
        }

        setStatus('idle')
        setMessage(nextMessage || 'Select a wallet to connect')
        setShowWalletOptions(true)
    }

    const disconnectConnector = async (nextMessage?: string) => {
        try {
            const connector = getConnector() as any

            await connector?.disconnect?.()
            await connector?.appKit?.disconnect?.()
            await connector?.appKit?.resetWcConnection?.()
            await connector?.appKit?.resetAccount?.()
        } catch (error) {
            console.warn('[disconnectConnector error]', error)
        } finally {
            setConnector(null)
            resetConnectionState(nextMessage, {clearSavedSession: true})
        }
    }

    const handleDisconnectClick = async () => {
        try {
            await fetch(`${API_BASE_URL}/web3/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('[handleDisconnectClick error]', error);
        }

        await disconnectConnector('Manually disconnected.');
        await onDisconnect?.();
    };


    const openDisconnectConfirm = () => {
        setConfirmModal('disconnect');
    };

    const openLogoutConfirm = () => {
        setConfirmModal('logout');
    };

    const closeConfirmModal = () => {
        setConfirmModal(null);
    };

    const confirmDisconnect = async () => {
        setConfirmModal(null);
        await handleDisconnectClick();
    };

    const confirmLogout = async () => {
        setConfirmModal(null);
        await logoutWeb3();
    };

    const normalizeOptionalString = (value: unknown) => {
        return typeof value === 'string' && value.trim().length > 0
            ? value.trim()
            : undefined
    }

    const initWalletConnect = async () => {
        const currentConnector = getConnector()

        if (currentConnector) return currentConnector

        if (!WALLETCONNECT_PROJECT_ID) {
            throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID not found')
        }

        const origin =
            typeof window !== 'undefined' ? window.location.origin : 'https://vobc.io'

        const connector = await UniversalConnector.init({
            projectId: WALLETCONNECT_PROJECT_ID,
            metadata: {
                name: 'VOB Login Test',
                description: 'VOB Login with WalletConnect',
                url: origin,
                icons: [`${origin}/icon.png`],
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
    }

    const clearWalletConnectConnectorOnly = async (targetConnector?: any) => {
        const connector = targetConnector || getConnector()

        try {
            await connector?.disconnect?.()
        } catch (error) {
            console.warn('[wc connector disconnect error]', error)
        }

        try {
            await connector?.appKit?.disconnect?.()
        } catch (error) {
            console.warn('[wc appKit disconnect error]', error)
        }

        setConnector(null)
    }

    const syncWalletConnectSession = async (
        connectedSession?: any,
        options?: {
            validateSavedSession?: boolean
        }
    ) => {
        try {
            console.log('🔥 [SYNC START]')

            const provider = getWalletConnectProvider()
            const session = connectedSession || provider?.session

            console.log('🔥 [SYNC] provider', provider)
            console.log('🔥 [SYNC] connectedSession', connectedSession)
            console.log('🔥 [SYNC] provider.session', provider?.session)
            console.log('🔥 [SYNC] session.topic', session?.topic)
            console.log('🔥 [SYNC] session.namespaces', session?.namespaces)

            if (!provider) {
                setStatus('idle')
                setMessage('WalletConnect provider is not available')
                return false
            }

            if (!session?.topic) {
                setStatus('idle')
                setMessage('Select a wallet to connect')
                return false
            }

            const sessionAccount =
                session?.namespaces?.eip155?.accounts?.[0] as string | undefined

            const [, sessionChainId, sessionAddress] =
            sessionAccount?.split(':') ?? []

            console.log('🔥 [WC SESSION ACCOUNT]', sessionAccount)
            console.log('🔥 [WC SESSION CHAIN]', sessionChainId)
            console.log('🔥 [WC SESSION ADDRESS]', sessionAddress)

            const accounts = (await provider.request({
                method: 'eth_accounts',
            })) as string[]

            const requestChainId = (await provider.request({
                method: 'eth_chainId',
            })) as string

            console.log('🔥 [WC REQUEST ACCOUNTS]', accounts)
            console.log('🔥 [WC REQUEST CHAIN]', requestChainId)

            const selectedAccount = accounts?.[0] || sessionAddress || ''
            const currentChainId = requestChainId || sessionChainId || ''
            const currentTopic = String(session?.topic || provider?.session?.topic || '')

            if (!selectedAccount) {
                resetConnectionState('No connected account found.', {
                    clearSavedSession: true,
                })
                return false
            }

            if (!isValidEvmAddress(selectedAccount)) {
                resetConnectionState(
                    'The selected account is not an EVM account. Please reconnect using an EVM wallet.',
                    { clearSavedSession: true }
                )
                return false
            }

            if (!currentTopic) {
                resetConnectionState('WalletConnect session topic is missing.', {
                    clearSavedSession: true,
                })
                return false
            }

            if (options?.validateSavedSession) {
                const savedTopic = sessionStorage.getItem('vob.wallet.topic')
                const savedAccount = sessionStorage.getItem('vob.wallet.account')

                if (savedTopic && savedTopic !== currentTopic) {
                    console.warn('[syncWalletConnectSession] topic mismatch', {
                        savedTopic,
                        currentTopic,
                    })

                    resetConnectionState(
                        'WalletConnect session changed. Please reconnect.',
                        { clearSavedSession: true }
                    )
                    return false
                }

                if (
                    savedAccount &&
                    savedAccount.toLowerCase() !== selectedAccount.toLowerCase()
                ) {
                    console.warn('[syncWalletConnectSession] account mismatch', {
                        savedAccount,
                        selectedAccount,
                    })

                    resetConnectionState(
                        'WalletConnect account changed. Please reconnect.',
                        { clearSavedSession: true }
                    )
                    return false
                }
            }

            const normalizedChainId = normalizeHexChainId(currentChainId)

            saveWalletSession({
                type: 'walletconnect',
                topic: currentTopic,
                name: WALLETCONNECT_OPTION.name,
                icon: WALLETCONNECT_OPTION.icon,
                account: selectedAccount,
                chainId: normalizedChainId,
            })

            const walletConn = {
                address: selectedAccount,
                icon: WALLETCONNECT_OPTION.icon,
                name: WALLETCONNECT_OPTION.name,
            }

            setConnectionType('walletconnect')
            setAccount(selectedAccount)
            setChainId(normalizedChainId)
            setStatus('connected')
            setShowWalletOptions(false)
            setMessage(`Wallet: ${selectedAccount} / chain ${normalizedChainId}`)
            setConnectedWallet(walletConn)

            setTimeout(() => {
                closeWalletConnectModal()
            }, 300)

            await onConnectSuccess?.(walletConn)

            return true
        } catch (error) {
            console.error('[syncWalletConnectSession error]', error)
            setStatus('idle')
            setMessage('Error while syncing WalletConnect session.')
            return false
        }
    }
    const restoreInjectedConnection = async () => {
        try {
            const savedType = sessionStorage.getItem('vob.wallet.type')
            const savedWalletId = sessionStorage.getItem('vob.wallet.id')

            if (savedType !== 'injected' || !savedWalletId) {
                return false
            }

            const option = discoveredWalletsRef.current.get(savedWalletId)

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
                resetConnectionState(
                    'The selected account is not an EVM account. Please reconnect using an EVM wallet.',
                    { clearSavedSession: true }
                )
                return false
            }

            const currentChainId = (await option.provider.request({
                method: 'eth_chainId',
            })) as string

            const normalizedChainId = normalizeHexChainId(currentChainId)

            sessionStorage.setItem('vob.wallet.account', selectedAccount)
            sessionStorage.setItem('vob.wallet.chainId', normalizedChainId)
            sessionStorage.setItem('vob.wallet.name', option.name)
            sessionStorage.setItem('vob.wallet.icon', option.icon)

            const walletConn = {
                address: selectedAccount,
                icon: option.icon,
                name: option.name
            }

            setActiveInjectedProvider(option.provider)
            setConnectionType('injected')
            setAccount(selectedAccount)
            setChainId(normalizedChainId)
            setConnectedWallet({
                address: selectedAccount,
                icon: option.icon,
                name: option.name,
            })

            await onConnectSuccess?.(walletConn)

            setStatus('connected')
            setShowWalletOptions(false)
            setMessage(`Wallet: ${selectedAccount} / chain ${normalizedChainId}`)

            return true
        } catch (error) {
            console.error('[restoreInjectedConnection error]', error)
            return false
        }
    }
    const restoreWalletConnectConnection = async () => {
        try {
            const saved = getSavedWalletSession()
            const savedType = saved.type
            const savedTopic = saved.topic
            const savedAccount = saved.account

            console.log('[WC RESTORE savedTopic]', savedTopic)

            if (savedType !== 'walletconnect') {
                return false
            }

            const connector = await initWalletConnect()
            debugWalletConnectStorage(connector)

            const provider = connector.provider as WCProvider | undefined

            console.log('[WC RESTORE provider.session]', {
                topic: provider?.session?.topic,
                expiry: provider?.session?.expiry,
                expiryDate: provider?.session?.expiry
                    ? new Date(provider.session.expiry * 1000).toISOString()
                    : null,
                accounts: provider?.session?.namespaces?.eip155?.accounts,
                peer: provider?.session?.peer?.metadata,
            })

            if (!provider?.session?.topic) {
                return false
            }

            const liveTopic = provider.session.topic

            const accounts = (await provider.request({
                method: 'eth_accounts',
            })) as string[]

            console.log('[WC RESTORE provider eth_accounts]', accounts)

            const liveAccount = accounts?.[0] || ''

            if (!liveAccount) {
                clearSavedWalletSession()
                await clearWalletConnectConnectorOnly(connector)
                resetWalletConnectionStateOnly()

                setStatus('idle')
                setMessage('WalletConnect account not found. Please reconnect.')
                setShowWalletOptions(true)

                return false
            }

            if (
                savedAccount &&
                savedAccount.toLowerCase() !== liveAccount.toLowerCase()
            ) {
                console.warn('[restoreWalletConnectConnection] account mismatch', {
                    savedAccount,
                    liveAccount,
                })

                clearSavedWalletSession()
                await clearWalletConnectConnectorOnly(connector)
                resetWalletConnectionStateOnly()

                setStatus('idle')
                setMessage('WalletConnect restored a different wallet session. Please connect again.')
                setShowWalletOptions(true)

                return false
            }

            if (savedTopic && liveTopic !== savedTopic) {
                console.warn(
                    '[restoreWalletConnectConnection] topic changed but account matched. Accepting live session.',
                    {
                        savedTopic,
                        liveTopic,
                        savedAccount,
                        liveAccount,
                    }
                )

                sessionStorage.setItem('vob.wallet.topic', liveTopic)
            }

            return await syncWalletConnectSession(provider.session, {
                validateSavedSession: false,
            })
        } catch (error) {
            console.error('[restoreWalletConnectConnection error]', error)
            return false
        }
    }

    useEffect(() => {
        if (typeof window === 'undefined') return;

        let restored = false

        const tryRestoreInjected = async () => {
            if (restored) return

            const savedType = sessionStorage.getItem('vob.wallet.type')

            if (savedType !== 'injected') return

            const restoredOk = await restoreInjectedConnection()

            if (restoredOk) {
                restored = true
            }
        }
        const handleAnnounceProvider = async (event: Event) => {
            const customEvent = event as CustomEvent<Eip6963AnnounceDetail>;
            const detail = customEvent.detail;

            if (!detail?.info || !detail?.provider) return;

            const id = detail.info.rdns || detail.info.uuid || detail.info.name;

            discoveredWalletsRef.current.set(id, {
                id,
                name: detail.info.name,
                icon: detail.info.icon,
                type: 'injected',
                provider: detail.provider,
                detected: true,
            });

            setWalletOptions(getWalletOptionsWithWalletConnect(discoveredWalletsRef.current));

            await tryRestoreInjected()
        };

        window.addEventListener('eip6963:announceProvider', handleAnnounceProvider as EventListener);
        window.dispatchEvent(new Event('eip6963:requestProvider'));
        setWalletOptions(getWalletOptionsWithWalletConnect(discoveredWalletsRef.current));

        return () => {
            window.removeEventListener(
                'eip6963:announceProvider',
                handleAnnounceProvider as EventListener
            );
        };
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return

        const restore = async () => {
            const savedType = sessionStorage.getItem('vob.wallet.type')

            if (savedType !== 'walletconnect') return

            const restoredOk = await restoreWalletConnectConnection()

            if (!restoredOk) {
                console.log('[restoreWalletConnectConnection] no active session')

                clearSavedWalletSession()
                resetWalletConnectionStateOnly()

                setStatus('idle')
                setMessage('WalletConnect session expired. Please reconnect.')
                setShowWalletOptions(true)
            }
        }

        void restore()
    }, [])

    useEffect(() => {
        if (!activeInjectedProvider || connectionType !== 'injected') return;

        const handleAccountsChanged = async (accounts: string[]) => {
            const nextAccount = accounts?.[0] || '';
            if (!nextAccount) {
                resetConnectionState('No accounts found. Please try again.', {clearSavedSession: true});
                return;
            }

            if (!isValidEvmAddress(nextAccount)) {
                resetConnectionState(
                    'The selected account is not an EVM account. Please reconnect using an EVM wallet such as MetaMask, Phantom, or OKX Wallet.',
                    {clearSavedSession: true}
                );
                return;
            }

            try {
                const nextChainId = (await activeInjectedProvider.request({
                    method: 'eth_chainId',
                })) as string;

                const normalizedChainId = normalizeHexChainId(nextChainId);

                setAccount(nextAccount);
                setChainId(normalizedChainId);
                setConnectedWallet((prev) =>
                    prev
                        ? {
                            ...prev,
                            address: nextAccount,
                        }
                        : null
                );
                setStatus('connected');
                // setMessage(
                //     isSupportedLoginChain(normalizedChainId)
                //         ? `Wallet: ${nextAccount}`
                //         : getUserFriendlyEvmMessage(normalizedChainId)
                // );
            } catch (error) {
                console.error('[injected accountsChanged] error', error);
            }
        };

        const handleChainChanged = (nextChainId: string) => {
            const normalizedChainId = normalizeHexChainId(nextChainId);
            setChainId(normalizedChainId);
            setStatus('connected');
            // setMessage(
            //     isSupportedLoginChain(normalizedChainId)
            //         ? `Wallet: ${account || 'Wallet connected'} / chain ${normalizedChainId}`
            //         : getUserFriendlyEvmMessage(normalizedChainId)
            // );
        };

        const handleDisconnect = () => {
            resetConnectionState('Wallet disconnected. Please try again.', {clearSavedSession: true});
        };

        activeInjectedProvider.on?.('accountsChanged', handleAccountsChanged);
        activeInjectedProvider.on?.('chainChanged', handleChainChanged);
        activeInjectedProvider.on?.('disconnect', handleDisconnect);

        return () => {
            activeInjectedProvider.removeListener?.('accountsChanged', handleAccountsChanged);
            activeInjectedProvider.removeListener?.('chainChanged', handleChainChanged);
            activeInjectedProvider.removeListener?.('disconnect', handleDisconnect);
        };
    }, [activeInjectedProvider, connectionType, account]);

    useEffect(() => {
        if (connectionType !== 'walletconnect') return

        const provider = getWalletConnectProvider() as any
        const connector = getConnector() as any

        if (!provider && !connector) return

        const handleWalletConnectDisconnect = (event?: any) => {
            console.warn('[WalletConnect disconnected]', event)

            clearSavedWalletSession()
            resetWalletConnectionStateOnly()

            setStatus('idle')
            setMessage('WalletConnect disconnected. Please reconnect.')
            setShowWalletOptions(true)
        }

        provider?.on?.('disconnect', handleWalletConnectDisconnect)
        provider?.on?.('session_delete', handleWalletConnectDisconnect)
        provider?.on?.('session_expire', handleWalletConnectDisconnect)

        connector?.provider?.on?.('disconnect', handleWalletConnectDisconnect)
        connector?.provider?.on?.('session_delete', handleWalletConnectDisconnect)
        connector?.provider?.on?.('session_expire', handleWalletConnectDisconnect)

        return () => {
            provider?.removeListener?.('disconnect', handleWalletConnectDisconnect)
            provider?.removeListener?.('session_delete', handleWalletConnectDisconnect)
            provider?.removeListener?.('session_expire', handleWalletConnectDisconnect)

            connector?.provider?.removeListener?.('disconnect', handleWalletConnectDisconnect)
            connector?.provider?.removeListener?.('session_delete', handleWalletConnectDisconnect)
            connector?.provider?.removeListener?.('session_expire', handleWalletConnectDisconnect)
        }
    }, [
        connectionType
    ])

    const router = useRouter()
    const pathname = usePathname()

    const handleGoMyPage = () => {
        onClose?.();

        if (pathname === '/profile') {
            router.refresh();
            return;
        }

        router.push('/profile')
    }

    async function resetExistingWalletConnectSession() {
        try {
            const connector = await initWalletConnect()
            await clearWalletConnectConnectorOnly(connector)
        } catch (error) {
            console.warn('[resetExistingWalletConnectSession error]', error)
        } finally {
            setConnector(null)
        }
    }

    const clearAllWalletConnectSessionsDebug = async () => {
        const connector = await initWalletConnect()
        const provider = connector.provider as any

        const client =
            provider?.client ||
            provider?.signClient ||
            (connector as any)?.client ||
            (connector as any)?.signClient

        const sessions = client?.session?.getAll?.() || []

        console.log('[WC CLEAR all sessions count]', sessions.length)

        for (const session of sessions) {
            try {
                await client.disconnect({
                    topic: session.topic,
                    reason: {
                        code: 6000,
                        message: 'User disconnected',
                    },
                })

                console.log('[WC CLEAR disconnected]', session.topic)
            } catch (error) {
                console.warn('[WC CLEAR failed]', session.topic, error)
            }
        }

        clearSavedWalletSession()
        resetWalletConnectionStateOnly()
        setConnector(null)
    }
    const debugWalletConnectStorage = (connector: any) => {
        const provider = connector?.provider as any

        const client =
            provider?.client ||
            provider?.signClient ||
            connector?.client ||
            connector?.signClient

        console.log('[WC DEBUG provider.session]', provider?.session)
        console.log('[WC DEBUG provider keys]', Object.keys(provider || {}))
        console.log('[WC DEBUG connector keys]', Object.keys(connector || {}))
        console.log('[WC DEBUG client]', client)
        console.log('[WC DEBUG client keys]', Object.keys(client || {}))
        console.log('[WC DEBUG client.session]', client?.session)

        try {
            const sessions = client?.session?.getAll?.()

            console.log(
                '[WC DEBUG all sessions]',
                sessions?.map((s: any) => ({
                    topic: s.topic,
                    expiry: s.expiry,
                    expiryDate: s.expiry
                        ? new Date(s.expiry * 1000).toISOString()
                        : null,
                    accounts: s.namespaces?.eip155?.accounts,
                    peer: s.peer?.metadata,
                }))
            )
        } catch (error) {
            console.warn('[WC DEBUG getAll sessions error]', error)
        }
    }
    const connectWalletConnect = async () => {
        try {
            resetLoginState()
            clearSavedWalletSession()
            resetWalletConnectionStateOnly()

            setStatus('connecting')
            setMessage('Opening wallet list')

            const connector = await initWalletConnect()
            const result = await connector.connect()

            const synced = await syncWalletConnectSession(result?.session, {
                validateSavedSession: false,
            })

            if (!synced) {
                setStatus('failed')
                setMessage('Failed to sync WalletConnect session.')
                return
            }

            debugConnector()
            debugAppKitMethods()

            setTimeout(() => {
                closeWalletConnectModal()
            }, 300)
        } catch (error: any) {
            setTimeout(() => {
                closeWalletConnectModal()
            }, 300)

            console.error('[connectWalletConnect error]', error)
            setStatus('failed')
            setMessage(error?.message || 'Failed to connect via WalletConnect')
        }
    }

    const debugConnector = () => {
        const connectorAny = getConnector() as any

        console.log('[connector keys]', Object.keys(connectorAny || {}))
        console.log('[connector]', connectorAny)
        console.log('[connector.modal]', connectorAny?.modal)
        console.log('[connector.appKit]', connectorAny?.appKit)
        console.log('[connector.provider]', connectorAny?.provider)
    }

    const debugAppKitMethods = () => {
        const appKit = (getConnector() as any)?.appKit

        console.log('[appKit keys]', Object.keys(appKit || {}))
        console.log(
            '[appKit proto keys]',
            Object.getOwnPropertyNames(Object.getPrototypeOf(appKit || {}))
        )

        const proto = Object.getPrototypeOf(appKit || {})

        Object.getOwnPropertyNames(proto).forEach((key) => {
            if (
                key.toLowerCase().includes('open') ||
                key.toLowerCase().includes('close') ||
                key.toLowerCase().includes('modal')
            ) {
                console.log('[appKit modal-ish method]', key, typeof appKit?.[key])
            }
        })
    }

    const connectInjectedWallet = async (option: WalletOption) => {
        try {
            setStatus('connecting');
            setMessage('Connecting to browser wallet...');

            const provider = option.provider;
            if (!provider) return;

            const accounts = (await provider.request({
                method: 'eth_requestAccounts',
            })) as string[];

            const selectedAccount = accounts?.[0] || '';

            if (!selectedAccount) {
                setStatus('failed');
                setMessage('No connected account found. Please try again.');
                return;
            }

            if (!isValidEvmAddress(selectedAccount)) {
                setStatus('failed');
                setMessage('The selected account is not an EVM account.');
                return;
            }

            const currentChainId = (await provider.request({
                method: 'eth_chainId',
            })) as string;

            const normalizedChainId = normalizeHexChainId(currentChainId);

            saveWalletSession({
                type: 'injected',
                id: option.id,
                name: option.name,
                icon: option.icon,
                account: selectedAccount,
                chainId: normalizedChainId,
            })

            setActiveInjectedProvider(provider);
            setConnectionType('injected');
            setAccount(selectedAccount);
            setChainId(normalizedChainId);
            setAccessToken('');
            setStatus('connected');
            setShowWalletOptions(false);
            setMessage(`Wallet: ${selectedAccount} / chain ${normalizedChainId}`);

            const walletConn = {
                address: selectedAccount,
                icon: option.icon,
                name: option.name,
            };

            setConnectedWallet(walletConn);
            await onConnectSuccess?.(walletConn);


        } catch (error: any) {
            console.error('[connectInjectedWallet error]', error);

                if (error?.code === 4001) {
                    setStatus('rejected');
                    setMessage('User rejected the request. Please try again.');
                    return;
                }

                setStatus('failed');
                setMessage(error?.message || 'Failed to connect to browser wallet.');
        }
    };
    const handleWalletOptionClick = async (option: WalletOption) => {
        if (option.type === 'walletconnect') {
            await connectWalletConnect();
            return;
        }

        if (!option.provider) {
            setStatus('failed');
            setMessage('Could not find the selected wallet provider.');
            return;
        }

        await connectInjectedWallet(option);
    };
    const closeWalletConnectModal = async () => {
        try {
            const appKit = (getConnector() as any)?.appKit

            console.log('[closeWalletConnectModal] appKit.close:', typeof appKit?.close)

            if (typeof appKit?.close === 'function') {
                await appKit.close()
            }
        } catch (error) {
            console.warn('[closeWalletConnectModal error]', error)
        }
    }
    const loginWithWeb3 = async () => {
        try {
            if (!account) {
                setApiResult('Please connect an EVM wallet first.');
                return;
            }

            const provider = getActiveProvider();
            if (!provider) {
                setApiResult('No connected provider found.');
                return;
            }

            // if (connectionType === 'walletconnect') {
            //     const topic = getActiveSessionTopic();
            //     const wcProvider = getWalletConnectProvider();
            //
            //     if (!topic || !wcProvider?.session) {
            //         setStatus('idle');
            //         setApiResult('WalletConnect session has expired or disconnected. Please reconnect.');
            //         return;
            //     }
            // }

            if (connectionType === 'walletconnect') {
                const topic = getActiveSessionTopic()
                const wcProvider = getWalletConnectProvider()

                if (!topic || !wcProvider?.session) {
                    clearSavedWalletSession()
                    resetWalletConnectionStateOnly()

                    setStatus('idle')
                    setMessage('WalletConnect session has expired or disconnected. Please reconnect.')
                    setApiResult('WalletConnect session has expired or disconnected. Please reconnect.')
                    return
                }

                try {
                    const liveAccounts = (await wcProvider.request({
                        method: 'eth_accounts',
                    })) as string[]

                    const liveAccount = liveAccounts?.[0] || ''

                    if (!liveAccount || liveAccount.toLowerCase() !== account.toLowerCase()) {
                        clearSavedWalletSession()
                        resetWalletConnectionStateOnly()

                        setStatus('idle')
                        setMessage('WalletConnect account is no longer connected. Please reconnect.')
                        setApiResult('WalletConnect account is no longer connected. Please reconnect.')
                        return
                    }
                } catch (error) {
                    console.warn('[WalletConnect live account check failed]', error)

                    clearSavedWalletSession()
                    resetWalletConnectionStateOnly()

                    setStatus('idle')
                    setMessage('WalletConnect disconnected. Please reconnect.')
                    setApiResult('WalletConnect disconnected. Please reconnect.')
                    return
                }
            }

            console.log('[LOGIN BEFORE SIGN] connectionType', connectionType);
            console.log('[LOGIN BEFORE SIGN] account state', account);

            const currentChainId = (await provider.request({
                method: 'eth_chainId',
            })) as string;

            console.log('[LOGIN BEFORE SIGN] provider eth_chainId', currentChainId);
            console.log('[LOGIN BEFORE SIGN] normalized', normalizeHexChainId(currentChainId));
            console.log('[LOGIN BEFORE SIGN] wc session', getWalletConnectProvider()?.session);

            const normalizedChainId = normalizeHexChainId(currentChainId);
            setChainId(normalizedChainId);
            setMessage(`Wallet: ${account} / chain ${normalizedChainId}`);

            if (!isValidEvmAddress(account)) {
                setApiResult('Login is not available for non-EVM accounts.');
                return;
            }

            setApiResult('1) Requesting nonce...');

            const nonceRes = await fetch(`${API_BASE_URL}/web3/auth/nonce`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    address: account,
                }),
            });

            const nonceData = await nonceRes.json().catch(() => null);

            if (!nonceRes.ok || !nonceData?.message) {
                setApiResult(
                    `Nonce request failed (${nonceRes.status}) ${
                        nonceData ? JSON.stringify(nonceData, null, 2) : ''
                    }`
                );
                return;
            }

            const signMessage = nonceData.message;
            const hexMessage = toHexUtf8(signMessage);

            setApiResult('2) Requesting signature...');

            const signature = (await provider.request({
                method: 'personal_sign',
                params: [hexMessage, account, 'Sign in to VOB'],
            })) as string;

            setApiResult('3) Verifying...');

            const verifyRes = await fetch(`${API_BASE_URL}/web3/auth/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    address: account,
                    signature,
                    nonce: nonceData.nonce,
                }),
            });

            const verifyData = await verifyRes.json().catch(() => null);

            if (!verifyRes.ok) {
                setApiResult(
                    `Verification failed (${verifyRes.status}) ${
                        verifyData ? JSON.stringify(verifyData, null, 2) : ''
                    }`
                );
                return;
            }

            const token = verifyData?.accessToken ;

            console.log('[verifyData]', verifyData);
            console.log('[token]', token);

            if (!token) {
                setApiResult('Verify succeeded, but accessToken is missing.');
                return;
            }

            setAccessToken(token);

            const nextUserProfile: UserConnection = {
                walletAddress: normalizeOptionalString(verifyData?.walletAddress) || account,
                profileImageUrl: normalizeOptionalString(verifyData?.profileImageUrl),
                nickname: normalizeOptionalString(verifyData?.nickname) || shortenAddress(account),
                email: normalizeOptionalString(verifyData?.email),
                bio: normalizeOptionalString(verifyData?.bio),
            };

            setUserProfile(nextUserProfile);
            await fetchVobBalance(token);

            await onLoginSuccess?.(nextUserProfile);

            setApiResult(
                `Login successful\n\n${JSON.stringify(
                    {
                        nonceResponse: nonceData,
                        verifyResponse: verifyData,
                    },
                    null,
                    2
                )}`
            );
        } catch (error: any) {
            console.error('[loginWithWeb3 error raw]', error);

            const msg = String(error?.message || '');

            if (error?.code === 4001) {
                setApiResult('User rejected the signature request.');
                return;
            }

            // if (connectionType === 'walletconnect' && msg.includes("session topic doesn't exist")) {
            //     await disconnectConnector('Wallet session lost. Please reconnect and try again.');
            //     setApiResult('WalletConnect session disappeared during signing. Please reconnect and try again.');
            //     return;
            // }
            const isWalletConnectSessionError =
                connectionType === 'walletconnect' &&
                (
                    msg.includes("session topic doesn't exist") ||
                    msg.toLowerCase().includes('session') ||
                    msg.toLowerCase().includes('disconnected') ||
                    msg.toLowerCase().includes('expired') ||
                    msg.toLowerCase().includes('no matching key')
                )

            if (isWalletConnectSessionError) {
                clearSavedWalletSession()
                resetWalletConnectionStateOnly()

                setStatus('idle')
                setMessage('WalletConnect session lost. Please reconnect.')
                setApiResult('WalletConnect session lost. Please reconnect and try again.')
                return
            }

            setApiResult(
                `Login error:
                message=${error?.message || 'unknown error'}
                code=${error?.code ?? 'unknown'}
                data=${JSON.stringify(error?.data ?? null, null, 2)}`
            );
        }
    };
    const logoutWeb3 = async () => {
        try {
            await fetch(`${API_BASE_URL}/web3/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            setAccessToken('');
            setUserProfile(null);
            setVobBalance('0');
            setApiResult('Logged out. Successfully removed accessToken');

            await onLogout?.();
        } catch (error: any) {
            setApiResult(`Logout error: ${error?.message || 'unknown error'}`);
        }
    };
    const requestWeb3Test = async () => {
        try {
            setApiResult('/web3/test requesting...');

            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (accessToken) {
                headers.Authorization = `Bearer ${accessToken}`;
            }

            const res = await fetch(`${API_BASE_URL}/web3/test`, {
                method: 'GET',
                headers,
                credentials: 'include',
            });

            const contentType = res.headers.get('content-type') || '';
            const body = contentType.includes('application/json')
                ? JSON.stringify(await res.json(), null, 2)
                : await res.text();

            setApiResult(`/web3/test response\nstatus: ${res.status}\n\n${body}`);
        } catch (error: any) {
            setApiResult(`/web3/test request error: ${error?.message || 'unknown error'}`);
        }
    };
    const requestVobBalance = async () => {
        try {
            setApiResult('/web3/vob-balance requesting...');

            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (accessToken) {
                headers.Authorization = `Bearer ${accessToken}`;
            }

            const res = await fetch(`${API_BASE_URL}/web3/vob-balance`, {
                method: 'GET',
                headers,
                credentials: 'include',
            });

            const contentType = res.headers.get('content-type') || '';
            const body = contentType.includes('application/json')
                ? JSON.stringify(await res.json(), null, 2)
                : await res.text();

            setApiResult(`/web3/vob-balance response\nstatus: ${res.status}\n\n${body}`);
        } catch (error: any) {
            setApiResult(`/web3/vob-balance request error: ${error?.message || 'unknown error'}`);
        }
    };
    const refreshTokenTest = async () => {
        try {
            setApiResult('requesting refresh...');

            const res = await fetch(`${API_BASE_URL}/web3/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setApiResult(`refresh failure (${res.status}) ${data ? JSON.stringify(data, null, 2) : ''}`);
                return;
            }

            const newAccessToken = data?.accessToken ?? '';
            setAccessToken(newAccessToken);
            await fetchVobBalance(newAccessToken);

            setApiResult(`refresh success\n\n${JSON.stringify(data, null, 2)}`);
        } catch (error: any) {
            setApiResult(`refresh error: ${error?.message}`);
        }
    };

    const renderWalletOptionList = () => {
        return (
            <div className={styles.walletOptionBox}>
                {walletOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => handleWalletOptionClick(option)}
                        className={styles.walletOptionButton}
                    >
                        {option.icon ? (
                            <img src={option.icon} alt={option.name} className={styles.walletOptionIcon} />
                        ) : (
                            <div className={styles.walletOptionIconFallback}>{option.name.slice(0, 1)}</div>
                        )}

                        <span>{option.name}</span>

                        {option.detected && (
                            <span style={{ color: '#9ca3af', fontSize: '12px', marginLeft: 6 }}>
                                (Detected)
                            </span>
                        )}
                        <span className={styles.walletOptionArrow}>›</span>
                    </button>
                ))}
            </div>
        );
    };
    const renderConnectedWalletInfo = () => {
        if (!connectedWallet) return null;

        return (
            <div className={styles.connectedMainProfile}>
                <div className={styles.profileImageWrap}>
                    <img
                        src={connectedWallet.icon}
                        alt={connectedWallet.name}
                        className={styles.connectedMainIcon}
                    />
                    <span className={styles.checkBadge}>✓</span>
                </div>

                <div className={styles.statusPills}>
                <span className={`${styles.statusPill} ${styles.connectedPill}`}>
                    ● Connected
                </span>
                </div>
            </div>
        );
    };

    const renderLoggedInProfile = () => {
        if (!connectedWallet) return null;

        return (
            <>
                <div className={styles.connectedMainProfile}>
                    <div className={styles.profileImageWrap}>
                        <img
                            src={displayProfileImage}
                            alt={displayNickname}
                            className={styles.connectedMainIcon}
                        />
                        <span className={styles.checkBadge}>✓</span>
                    </div>

                    <div className={styles.statusPills}>
                    <span className={`${styles.statusPill} ${styles.connectedPill}`}>
                        ● Connected
                    </span>
                        <span className={`${styles.statusPill} ${styles.loggedInPill}`}>
                        ● Logged In
                    </span>
                    </div>
                </div>

                <div className={styles.profileSummaryGrid}>
                    <div className={styles.profileSummaryItem}>
                        <div className={styles.infoLabel}>VOB Balance</div>
                        <div className={styles.vobBalanceText}>
                            <div className={styles.vobBadge}>
                                <Image
                                    src={vobLogo}
                                    alt={"vob coin symbol"}
                                    objectFit="contain"
                                ></Image>
                            </div>
                            {vobBalance}
                        </div>
                    </div>

                    <div className={styles.profileSummaryDivider} />

                    <div className={styles.profileSummaryItem}>
                        <div className={styles.infoLabel}>Nickname</div>
                        <div className={styles.nicknameText}>{displayNickname}</div>
                    </div>
                </div>
            </>
        );
    };
    const renderWalletFooter = () => {
        if (!connectedWallet) return null;

        return (
            <div className={styles.walletFooter}>
                <div className={styles.walletFooterMain}>
                    <img
                        src={connectedWallet.icon}
                        alt={connectedWallet.name}
                        className={styles.walletFooterIcon}
                    />

                    <div>
                        <div className={styles.walletFooterName}>{connectedWallet.name}</div>
                        <div className={styles.walletFooterAddress}>{shortenAddress(account)}</div>
                    </div>
                </div>

                <div className={styles.walletFooterNetwork}>
                    {getNetworkName(chainId)}
                </div>
            </div>
        );
    };

    return (
        <main className={styles.main}>
            <div className={styles.card}>

                <h1 className={styles.title}>Web3 Connection</h1>

                {/*<button*/}
                {/*    type="button"*/}
                {/*    onClick={clearAllWalletConnectSessionsDebug}*/}
                {/*    className={styles.disconnectButton}*/}
                {/*>*/}
                {/*    Clear WC Sessions*/}
                {/*</button>*/}

                {viewState === 'disconnected' && (
                    <section className={styles.section}>
                        <div className={styles.emptyWalletIconBox}>
                            <span className={styles.emptyWalletIcon}>▣</span>
                        </div>

                        <h2 className={styles.disconnectedTitle}>
                            Select a wallet to connect
                        </h2>

                        <p className={styles.disconnectedDesc}>
                            Connect your wallet to continue
                        </p>

                        {renderWalletOptionList()}

                        <div className={styles.walletHelpText}>
                            New to wallets? <span>Learn more</span>
                        </div>
                    </section>
                )}

                {viewState === 'connected' && (
                    <section className={styles.section}>
                        {renderConnectedWalletInfo()}

                        <div className={styles.topActionRow}>
                            <button
                                onClick={openDisconnectConfirm}
                                className={styles.disconnectButton}
                            >
                                Disconnect
                            </button>

                            <button
                                onClick={loginWithWeb3}
                                className={styles.loginButton}
                            >
                                Login
                            </button>
                        </div>

                        {renderWalletFooter()}
                    </section>
                )}

                {viewState === 'loggedIn' && (
                    <section className={styles.section}>
                        {renderLoggedInProfile()}

                        <div className={styles.topActionRow}>
                            <button
                                onClick={openLogoutConfirm}
                                className={styles.logoutButton}
                            >
                                Logout
                            </button>
                            {/*<NavigationLink href={'/profile'} className={`${styles.fontBlack} ${styles.myPageButton}`}>*/}
                            <button
                                type="button"
                                className={styles.myPageButton}
                                onClick={handleGoMyPage}
                            >
                                    My Page
                            </button>
                            {/*</NavigationLink>*/}
                        </div>

                        {renderWalletFooter()}
                    </section>
                )}

            </div>
            {confirmModal === 'disconnect' && (
                <div className={styles.confirmOverlay}>
                    <div className={styles.confirmModal}>
                        <div className={styles.confirmIconDanger}>⌁</div>

                        <h2 className={styles.confirmTitle}>Disconnect wallet?</h2>

                        <p className={styles.confirmDesc}>
                            Your wallet will be disconnected and you will be returned to the initial screen.
                        </p>

                        <div className={styles.confirmActionRow}>
                            <button
                                className={styles.confirmCancelButton}
                                onClick={closeConfirmModal}
                            >
                                Cancel
                            </button>

                            <button
                                className={styles.confirmDisconnectButton}
                                onClick={confirmDisconnect}
                            >
                                Disconnect
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {confirmModal === 'logout' && (
                <div className={styles.confirmOverlay}>
                    <div className={styles.confirmModal}>
                        <div className={styles.confirmIconSuccess}>↪</div>

                        <h2 className={styles.confirmTitle}>Logout from VOB?</h2>

                        <p className={styles.confirmDesc}>
                            You will remain connected to your wallet, but you will be logged out of VOB.
                        </p>

                        <div className={styles.confirmActionRow}>
                            <button
                                className={styles.confirmCancelButton}
                                onClick={closeConfirmModal}
                            >
                                Cancel
                            </button>

                            <button
                                className={styles.confirmLogoutButton}
                                onClick={confirmLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}