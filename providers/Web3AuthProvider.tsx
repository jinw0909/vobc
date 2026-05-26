'use client'

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type Dispatch,
    type SetStateAction,
} from 'react'

import { UniversalConnector } from '@reown/appkit-universal-connector'
import { defineChain } from '@reown/appkit/networks'
import { createBaseAccountSDK } from '@base-org/account'

export type ConnectionType = 'walletconnect' | 'injected' | 'coinbase-wallet' | null

export type WalletOption = {
    id: string
    name: string
    icon: string
    type: 'injected' | 'walletconnect' | 'coinbase-wallet'
    provider?: Web3Provider
    detected?: boolean
}

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

export type Web3Provider = {
    session?: any
    request: (args: {
        method: string
        params?: unknown[] | object
    }) => Promise<unknown>
    on?: (event: string, listener: (...args: any[]) => void) => void
    removeListener?: (event: string, listener: (...args: any[]) => void) => void
}

export type ConnectedWallet = {
    address: string
    icon: string
    name: string
}

export type UserConnection = {
    walletAddress: string
    profileImageUrl?: string
    nickname?: string
    email?: string
    bio?: string
}

type Web3AuthContextValue = {
    account: string
    chainId: string
    accessToken: string
    connectionType: ConnectionType
    activeInjectedProvider: Web3Provider | null
    connectedWallet: ConnectedWallet | null
    userProfile: UserConnection | null
    vobBalance: string

    initWalletConnect: () => Promise<UniversalConnector>
    connectWalletConnect: () => Promise<boolean>
    syncWalletConnectSession: (
        connectedSession?: any,
        options?: {
            validateSavedSession?: boolean
        }
    ) => Promise<boolean>
    disconnectWalletConnectConnectorOnly: (
        targetConnector?: UniversalConnector | null
    ) => Promise<void>

    connectBaseAccount: () => Promise<boolean>

    walletOptions: WalletOption[]
    connectInjectedWallet: (walletId: string) => Promise<boolean>
    restoreInjectedConnection: () => Promise<boolean>

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

    setConnector: (connector: UniversalConnector | null) => void
    getConnector: () => UniversalConnector | null
    getWalletConnectProvider: () => Web3Provider | null
    getActiveProvider: () => Web3Provider | null
    getActiveSessionTopic: () => string

    saveWalletSession: (session: SavedWalletSession) => void
    getSavedWalletSession: () => SavedWalletSession
    clearSavedWalletSession: () => void

    resetWalletConnectionStateOnly: () => void
    resetLoginState: () => void
    resetWeb3State: () => void

    fetchVobBalance: (token?: string) => Promise<void>
    restoreLoginSession: () => Promise<boolean>
}

type ViewState = 'disconnected' | 'connected' | 'loggedIn'

type SavedWalletSession = {
    type: ConnectionType
    id?: string
    name?: string
    icon?: string
    account?: string
    chainId?: string
    topic?: string
}

const Web3AuthContext = createContext<Web3AuthContextValue | null>(null)

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

const COINBASE_WALLET_OPTION: WalletOption = {
    id: 'coinbase-wallet',
    name: 'Base',
    icon: '/wallets/base.svg',
    type: 'coinbase-wallet',
    detected: false,
}

const WALLETCONNECT_PROJECT_ID =
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

const WALLETCONNECT_OPTION: WalletOption = {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '/wallets/walletconnect.svg',
    type: 'walletconnect',
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
function shortenAddress(address?: string) {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}
function normalizeOptionalString(value: unknown) {
    return typeof value === 'string' && value.trim().length > 0
        ? value.trim()
        : undefined
}
function normalizeHexChainId(chainId: string | number): string {
    if (typeof chainId === 'number') {
        return `0x${chainId.toString(16)}`
    }

    if (typeof chainId === 'string') {
        if (chainId.startsWith('0x')) {
            return chainId.toLowerCase()
        }

        const parsed = Number(chainId)
        if (!Number.isNaN(parsed)) {
            return `0x${parsed.toString(16)}`
        }
    }

    return ''
}
function isValidEvmAddress(value: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(value)
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


export function Web3AuthProvider({ children }: { children: React.ReactNode }) {
    const connectorRef = useRef<UniversalConnector | null>(null)
    const discoveredWalletsRef = useRef<Map<string, WalletOption>>(new Map())

    const [walletOptions, setWalletOptions] = useState<WalletOption[]>([
        WALLETCONNECT_OPTION,
        COINBASE_WALLET_OPTION,
    ])

    const [account, setAccount] = useState('')
    const [chainId, setChainId] = useState('')
    const [accessToken, setAccessToken] = useState('')
    const [connectionType, setConnectionType] = useState<ConnectionType>(null)
    const [activeInjectedProvider, setActiveInjectedProvider] = useState<Web3Provider | null>(null)
    const [connectedWallet, setConnectedWallet] = useState<ConnectedWallet | null>(null)
    const [userProfile, setUserProfile] = useState<UserConnection | null>(null)
    const [vobBalance, setVobBalance] = useState('0')

    const [connectionChecked, setConnectionChecked] = useState(false)
    const [authChecked, setAuthChecked] = useState(false)

    const setConnector = (connector: UniversalConnector | null) => {
        connectorRef.current = connector
    }

    const getConnector = () => {
        return connectorRef.current
    }

    const getWalletConnectProvider = (): Web3Provider | null => {
        return (connectorRef.current?.provider as Web3Provider | undefined) ?? null
    }

    const getActiveProvider = (): Web3Provider | null => {
        if (connectionType === 'walletconnect') {
            return getWalletConnectProvider()
        }

        if (connectionType === 'injected' || connectionType === 'coinbase-wallet') {
            return activeInjectedProvider
        }

        return null
    }

    const getActiveSessionTopic = (): string => {
        const provider = getWalletConnectProvider()
        const topic = provider?.session?.topic
        return typeof topic === 'string' && topic.length > 0 ? topic : ''
    }

    const initWalletConnect = async () => {
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
                name: 'VOB Login Test',
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
    }

    const disconnectWalletConnectConnectorOnly = async (
        targetConnector?: UniversalConnector | null
    ) => {
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

        setConnector(null)
    }

    const syncWalletConnectSession = async (
        connectedSession?: any,
        options?: {
            validateSavedSession?: boolean
        }
    ) => {
        try {
            const provider = getWalletConnectProvider()
            const session = connectedSession || provider?.session

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
            const currentTopic = String(session?.topic || provider?.session?.topic || '')

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
                    saved.account.toLowerCase() !== selectedAccount.toLowerCase()
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
    }

    const connectWalletConnect = async () => {
        try {
            resetLoginState()
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
    }

    const restoreWalletConnectConnection = async () => {
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
                // clearSavedWalletSession()
                // await disconnectWalletConnectConnectorOnly(connector)
                // resetWalletConnectionStateOnly()
                // return false
                console.warn('[restoreWalletConnectConnection] no live account')
                await disconnectWalletConnectConnectorOnly(connector)
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
    const connectBaseAccount = async () => {
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

            const walletConn = {
                address: selectedAccount,
                icon: COINBASE_WALLET_OPTION.icon,
                name: COINBASE_WALLET_OPTION.name,
            }

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
            setConnectedWallet(walletConn)

            return true
        } catch (error) {
            console.error('[connectBaseAccount error]', error)
            return false
        }
    }
    const saveWalletSession = (session: SavedWalletSession) => {
        if (typeof window === 'undefined') return

        if (session.type) sessionStorage.setItem('vob.wallet.type', session.type)
        if (session.id) sessionStorage.setItem('vob.wallet.id', session.id)
        if (session.name) sessionStorage.setItem('vob.wallet.name', session.name)
        if (session.icon) sessionStorage.setItem('vob.wallet.icon', session.icon)
        if (session.account) sessionStorage.setItem('vob.wallet.account', session.account)
        if (session.chainId) sessionStorage.setItem('vob.wallet.chainId', session.chainId)
        if (session.topic) sessionStorage.setItem('vob.wallet.topic', session.topic)
    }
    const getSavedWalletSession = (): SavedWalletSession => {
        if (typeof window === 'undefined') {
            return { type: null }
        }

        return {
            type: sessionStorage.getItem('vob.wallet.type') as ConnectionType,
            id: sessionStorage.getItem('vob.wallet.id') || undefined,
            name: sessionStorage.getItem('vob.wallet.name') || undefined,
            icon: sessionStorage.getItem('vob.wallet.icon') || undefined,
            account: sessionStorage.getItem('vob.wallet.account') || undefined,
            chainId: sessionStorage.getItem('vob.wallet.chainId') || undefined,
            topic: sessionStorage.getItem('vob.wallet.topic') || undefined,
        }
    }
    const clearSavedWalletSession = () => {
        if (typeof window === 'undefined') return

        sessionStorage.removeItem('vob.wallet.type')
        sessionStorage.removeItem('vob.wallet.id')
        sessionStorage.removeItem('vob.wallet.name')
        sessionStorage.removeItem('vob.wallet.icon')
        sessionStorage.removeItem('vob.wallet.account')
        sessionStorage.removeItem('vob.wallet.chainId')
        sessionStorage.removeItem('vob.wallet.topic')
    }

// 리셋 함수
    const resetWalletConnectionStateOnly = () => {
        setAccount('')
        setChainId('')
        setConnectionType(null)
        setActiveInjectedProvider(null)
        setConnectedWallet(null)
        connectorRef.current = null
    }

    const resetLoginState = () => {
        setAccessToken('')
        setUserProfile(null)
        setVobBalance('0')
    }

    const resetWeb3State = () => {
        resetWalletConnectionStateOnly()
        resetLoginState()
    }

    const restoreBaseAccountConnection = async () => {
        try {
            const saved = getSavedWalletSession()

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

            const walletConn = {
                address: selectedAccount,
                icon: COINBASE_WALLET_OPTION.icon,
                name: COINBASE_WALLET_OPTION.name,
            }

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
            setConnectedWallet(walletConn)

            return true
        } catch (error) {
            console.error('[restoreBaseAccountConnection error]', error)
            return false
        }
    }

    const restoreInjectedConnection = async () => {
        try {
            const saved = getSavedWalletSession()

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

            const walletConn = {
                address: selectedAccount,
                icon: option.icon,
                name: option.name,
            }

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
            setConnectedWallet(walletConn)

            return true
        } catch (error) {
            console.error('[restoreInjectedConnection error]', error)
            return false
        }
    }

    const connectInjectedWallet = async (walletId: string) => {
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

            if (!selectedAccount) {
                return false
            }

            if (!isValidEvmAddress(selectedAccount)) {
                return false
            }

            const currentChainId = (await option.provider.request({
                method: 'eth_chainId',
            })) as string

            const normalizedChainId = normalizeHexChainId(currentChainId)

            const walletConn = {
                address: selectedAccount,
                icon: option.icon,
                name: option.name,
            }

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
            setConnectedWallet(walletConn)

            return true
        } catch (error) {
            console.error('[connectInjectedWallet error]', error)
            return false
        }
    }

    // 로그인 판정

    const isConnected = !!account && !!connectionType && !!connectedWallet

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

// 기타

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

    const fetchVobBalance = async (token?: string) => {
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
    }
    const restoreWalletConnection = async () => {
        const saved = getSavedWalletSession()

        if (saved.type === 'coinbase-wallet') {
            return await restoreBaseAccountConnection()
        }

        if (saved.type === 'walletconnect') {
            return await restoreWalletConnectConnection()
        }

        if (saved.type === 'injected') {
            return await restoreInjectedConnection()
        }

        return false
    }
    const restoreLoginSession = async () => {
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

            const restoredWalletAddress = normalizeOptionalString(data?.walletAddress)

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
    }

    useEffect(() => {
        if (
            !activeInjectedProvider ||
            !['injected', 'coinbase-wallet'].includes(connectionType || '')
        ) return

        const handleAccountsChanged = async (accounts: string[]) => {
            const nextAccount = accounts?.[0] || ''

            if (!nextAccount) {
                clearSavedWalletSession()
                resetWalletConnectionStateOnly()
                return
            }

            if (!isValidEvmAddress(nextAccount)) {
                clearSavedWalletSession()
                resetWalletConnectionStateOnly()
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
        }

        activeInjectedProvider.on?.('accountsChanged', handleAccountsChanged)
        activeInjectedProvider.on?.('chainChanged', handleChainChanged)
        activeInjectedProvider.on?.('disconnect', handleDisconnect)

        return () => {
            activeInjectedProvider.removeListener?.('accountsChanged', handleAccountsChanged)
            activeInjectedProvider.removeListener?.('chainChanged', handleChainChanged)
            activeInjectedProvider.removeListener?.('disconnect', handleDisconnect)
        }
    }, [activeInjectedProvider, connectionType, account, connectedWallet])

    useEffect(() => {
        if (typeof window === 'undefined') return

        let restored = false

        const tryRestoreInjected = async () => {
            if (restored) return

            const saved = getSavedWalletSession()

            if (saved.type !== 'injected') return

            const restoredOk = await restoreInjectedConnection()

            if (restoredOk) {
                restored = true
            }
        }

        const handleAnnounceProvider = async (event: Event) => {
            const customEvent = event as CustomEvent<Eip6963AnnounceDetail>
            const detail = customEvent.detail

            if (!detail?.info || !detail?.provider) return

            const id = detail.info.rdns || detail.info.uuid || detail.info.name

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

    useEffect(() => {
        if (typeof window === 'undefined') return

        async function init() {
            try {
                await Promise.allSettled([
                    restoreWalletConnection(),
                    restoreLoginSession(),
                ])
            } finally {
                setConnectionChecked(true)
                setAuthChecked(true)
            }
        }
        void init()
    }, [])

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
            connectInjectedWallet,
            restoreInjectedConnection,

            initWalletConnect,
            connectWalletConnect,
            syncWalletConnectSession,
            disconnectWalletConnectConnectorOnly,
            restoreWalletConnection,
            connectBaseAccount,

            connectionChecked,
            authChecked,

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
        connectionChecked,
        authChecked,
        isConnected,
        isLoggedIn,
        isSameWalletLogin,
        viewState,
        displayNickname,
        displayProfileImage,
        restoreWalletConnection,
        restoreLoginSession,
        fetchVobBalance,
        initWalletConnect,
        connectWalletConnect,
        syncWalletConnectSession,
        disconnectWalletConnectConnectorOnly,
        connectBaseAccount,
        walletOptions,
        connectInjectedWallet,
        restoreInjectedConnection,
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