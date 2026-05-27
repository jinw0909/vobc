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

import { UniversalConnector } from '@reown/appkit-universal-connector'

import {
    ConnectionType,
    SavedWalletSession,
    Web3Provider,
    WalletOption,
    ConnectedWallet,
} from '@/types/web3'

import { useWalletSessionStorage } from '@/providers/hooks/useWalletSessionStorage'
import { useWalletConnectWallet } from '@/providers/hooks/useWalletConnectWallet'
import { useInjectedWallet } from '@/providers/hooks/useInjectedWallet'

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
    disconnectWalletConnect: () => Promise<void>

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

    disconnectWallet: () => Promise<void>

    fetchVobBalance: (token?: string) => Promise<void>
    restoreLoginSession: () => Promise<boolean>
}

const Web3AuthContext = createContext<Web3AuthContextValue | null>(null)

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export function Web3AuthProvider({ children }: { children: React.ReactNode }) {
    const {
        saveWalletSession,
        getSavedWalletSession,
        clearSavedWalletSession,
    } = useWalletSessionStorage()

    const [account, setAccount] = useState('')
    const [chainId, setChainId] = useState('')
    const [accessToken, setAccessToken] = useState('')
    const [connectionType, setConnectionType] = useState<ConnectionType>(null)
    const [activeInjectedProvider, setActiveInjectedProvider] =
        useState<Web3Provider | null>(null)
    const [connectedWallet, setConnectedWallet] =
        useState<ConnectedWallet | null>(null)
    const [userProfile, setUserProfile] =
        useState<UserConnection | null>(null)
    const [vobBalance, setVobBalance] = useState('0')

    const [connectionChecked, setConnectionChecked] = useState(false)
    const [authChecked, setAuthChecked] = useState(false)

    const resetWalletConnectionStateOnly = useCallback(() => {
        setAccount('')
        setChainId('')
        setConnectionType(null)
        setActiveInjectedProvider(null)
        setConnectedWallet(null)
    }, [])

    const resetLoginState = useCallback(() => {
        setAccessToken('')
        setUserProfile(null)
        setVobBalance('0')
    }, [])

    const resetWeb3State = useCallback(() => {
        resetWalletConnectionStateOnly()
        resetLoginState()
    }, [resetLoginState, resetWalletConnectionStateOnly])

    const walletConnect = useWalletConnectWallet({
        saveWalletSession,
        getSavedWalletSession,
        clearSavedWalletSession,
        resetLoginState,
        resetWalletConnectionStateOnly,
        setAccount,
        setChainId,
        setConnectionType,
        setConnectedWallet,
    })

    const injectedWallet = useInjectedWallet({
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
    })

    const disconnectWallet = async () => {
        if (connectionType === 'walletconnect') {
            await walletConnect.disconnectWalletConnect()
        } else {
            clearSavedWalletSession()
            resetWalletConnectionStateOnly()
        }

        resetLoginState()
    }

    const getActiveProvider = (): Web3Provider | null => {
        if (connectionType === 'walletconnect') {
            return walletConnect.getWalletConnectProvider()
        }

        if (connectionType === 'injected' || connectionType === 'coinbase-wallet') {
            return activeInjectedProvider
        }

        return null
    }

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
            return await injectedWallet.restoreBaseAccountConnection()
        }

        if (saved.type === 'walletconnect') {
            return await walletConnect.restoreWalletConnectConnection()
        }

        if (saved.type === 'injected') {
            return await injectedWallet.restoreInjectedConnection()
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

            walletOptions: injectedWallet.walletOptions,
            connectInjectedWallet: injectedWallet.connectInjectedWallet,
            restoreInjectedConnection: injectedWallet.restoreInjectedConnection,
            connectBaseAccount: injectedWallet.connectBaseAccount,

            initWalletConnect: walletConnect.initWalletConnect,
            connectWalletConnect: walletConnect.connectWalletConnect,
            syncWalletConnectSession: walletConnect.syncWalletConnectSession,
            disconnectWalletConnectConnectorOnly:
            walletConnect.disconnectWalletConnectConnectorOnly,
            disconnectWalletConnect: walletConnect.disconnectWalletConnect,

            setConnector: walletConnect.setConnector,
            getConnector: walletConnect.getConnector,
            getWalletConnectProvider: walletConnect.getWalletConnectProvider,
            getActiveSessionTopic: walletConnect.getActiveSessionTopic,

            restoreWalletConnection,

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

            getActiveProvider,

            saveWalletSession,
            getSavedWalletSession,
            clearSavedWalletSession,

            resetWalletConnectionStateOnly,
            resetLoginState,
            resetWeb3State,

            disconnectWallet,

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

        injectedWallet.walletOptions,
        injectedWallet.connectInjectedWallet,
        injectedWallet.restoreInjectedConnection,
        injectedWallet.connectBaseAccount,

        walletConnect.initWalletConnect,
        walletConnect.connectWalletConnect,
        walletConnect.syncWalletConnectSession,
        walletConnect.disconnectWalletConnectConnectorOnly,
        walletConnect.disconnectWalletConnect,
        walletConnect.setConnector,
        walletConnect.getConnector,
        walletConnect.getWalletConnectProvider,
        walletConnect.getActiveSessionTopic,

        connectionChecked,
        authChecked,

        isConnected,
        isLoggedIn,
        isSameWalletLogin,
        viewState,

        displayNickname,
        displayProfileImage,

        getActiveProvider,

        saveWalletSession,
        getSavedWalletSession,
        clearSavedWalletSession,

        resetWalletConnectionStateOnly,
        resetLoginState,
        resetWeb3State,

        disconnectWallet,

        fetchVobBalance,
        restoreLoginSession,
        restoreWalletConnection,
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