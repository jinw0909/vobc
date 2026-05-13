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

export type ConnectionType = 'walletconnect' | 'injected' | null

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


/// 헬퍼 함수

function shortenAddress(address?: string) {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function normalizeOptionalString(value: unknown) {
    return typeof value === 'string' && value.trim().length > 0
        ? value.trim()
        : undefined
}

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export function Web3AuthProvider({ children }: { children: React.ReactNode }) {
    const connectorRef = useRef<UniversalConnector | null>(null)

    const [account, setAccount] = useState('')
    const [chainId, setChainId] = useState('')
    const [accessToken, setAccessToken] = useState('')
    const [connectionType, setConnectionType] = useState<ConnectionType>(null)
    const [activeInjectedProvider, setActiveInjectedProvider] =
        useState<Web3Provider | null>(null)
    const [connectedWallet, setConnectedWallet] =
        useState<ConnectedWallet | null>(null)
    const [userProfile, setUserProfile] = useState<UserConnection | null>(null)
    const [vobBalance, setVobBalance] = useState('0')

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

        if (connectionType === 'injected') {
            return activeInjectedProvider
        }

        return null
    }

    const getActiveSessionTopic = (): string => {
        const provider = getWalletConnectProvider()
        const topic = provider?.session?.topic
        return typeof topic === 'string' && topic.length > 0 ? topic : ''
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

        void restoreLoginSession()
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
        isConnected,
        isLoggedIn,
        isSameWalletLogin,
        viewState,
        displayNickname,
        displayProfileImage,
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