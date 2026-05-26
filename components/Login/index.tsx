'use client'

import { useState } from 'react'
import styles from './styles.module.css'
import vobLogo from '@/public/vob_white.png'
import vobLogoWhite from '@/public/favicon.svg'
import Image from 'next/image'
import { NavigationLink } from '@/ui/NavigationLink'
import { usePathname, useRouter } from '@/i18n/navigation'
import {
    useWeb3Auth,
    type WalletOption,
} from '@/providers/Web3AuthProvider'

type Status =
    | 'idle'
    | 'initializing'
    | 'connecting'
    | 'connected'
    | 'rejected'
    | 'pending'
    | 'failed'

type WalletConnection = {
    address: string
    icon: string
    name: string
}

type UserConnection = {
    walletAddress: string
    profileImageUrl?: string
    nickname?: string
    email?: string
    bio?: string
}

type LoginProps = {
    onConnectSuccess?: (conn: WalletConnection) => void | Promise<void>
    onLoginSuccess?: (user: UserConnection) => void | Promise<void>
    onLogout?: () => void | Promise<void>
    onDisconnect?: () => void | Promise<void>
    onClose?: () => void
    onGoMyPage?: () => void
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

function toHexUtf8(value: string): string {
    return (
        '0x' +
        Array.from(new TextEncoder().encode(value))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')
    )
}

function shortenAddress(address?: string) {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function normalizeOptionalString(value: unknown) {
    return typeof value === 'string' && value.trim().length > 0
        ? value.trim()
        : undefined
}

function getNetworkName(chainId?: string) {
    const normalized = normalizeHexChainId(chainId || '')

    switch (normalized) {
        case '0x1':
            return 'Ethereum Mainnet'
        case '0x38':
            return 'BNB Smart Chain'
        case '0x2105':
            return 'Base Mainnet'
        case '0x89':
            return 'Polygon Mainnet'
        case '0xa':
            return 'Optimism'
        case '0xa4b1':
            return 'Arbitrum One'
        default:
            return normalized || '-'
    }
}

export default function Login({
                                  onLoginSuccess,
                                  onLogout,
                                  onDisconnect,
                                  onClose,
                              }: LoginProps) {
    const [status, setStatus] = useState<Status>('idle')
    const [message, setMessage] = useState('Select a wallet to connect')
    const [apiResult, setApiResult] = useState('')
    const [showWalletOptions, setShowWalletOptions] = useState(true)
    const [confirmModal, setConfirmModal] = useState<'disconnect' | 'logout' | null>(null)

    const {
        account,
        chainId,
        connectionType,
        connectedWallet,
        vobBalance,

        viewState,
        displayNickname,
        displayProfileImage,
        walletOptions,

        setChainId,
        setAccessToken,
        setUserProfile,
        setVobBalance,
        setConnector,

        getConnector,
        getWalletConnectProvider,
        getActiveProvider,
        getActiveSessionTopic,

        clearSavedWalletSession,

        connectWalletConnect,
        connectBaseAccount,
        connectInjectedWallet,

        resetWalletConnectionStateOnly,
        resetLoginState,

        fetchVobBalance,
    } = useWeb3Auth()

    const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

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
            resetConnectionState(nextMessage, { clearSavedSession: true })
        }
    }

    const handleDisconnectClick = async () => {
        try {
            await fetch(`${API_BASE_URL}/web3/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            })
        } catch (error) {
            console.error('[handleDisconnectClick error]', error)
        }

        await disconnectConnector('Manually disconnected.')
        await onDisconnect?.()
    }

    const openDisconnectConfirm = () => {
        setConfirmModal('disconnect')
    }

    const openLogoutConfirm = () => {
        setConfirmModal('logout')
    }

    const closeConfirmModal = () => {
        setConfirmModal(null)
    }

    const confirmDisconnect = async () => {
        setConfirmModal(null)
        await handleDisconnectClick()
    }

    const confirmLogout = async () => {
        setConfirmModal(null)
        await logoutWeb3()
    }

    const router = useRouter()
    const pathname = usePathname()

    const handleGoMyPage = () => {
        onClose?.()

        if (pathname === '/profile') {
            router.refresh()
            return
        }

        router.push('/profile')
    }

    const closeWalletConnectModal = async () => {
        try {
            const appKit = (getConnector() as any)?.appKit

            if (typeof appKit?.close === 'function') {
                await appKit.close()
            }
        } catch (error) {
            console.warn('[closeWalletConnectModal error]', error)
        }
    }

    const handleConnectWalletConnect = async () => {
        try {
            setStatus('connecting')
            setMessage('Opening wallet list')

            const connected = await connectWalletConnect()

            if (!connected) {
                setStatus('failed')
                setMessage('Failed to connect via WalletConnect.')
                return
            }

            setStatus('connected')
            setShowWalletOptions(false)

            setTimeout(() => {
                void closeWalletConnectModal()
            }, 300)
        } catch (error: any) {
            setTimeout(() => {
                void closeWalletConnectModal()
            }, 300)

            console.error('[handleConnectWalletConnect error]', error)
            setStatus('failed')
            setMessage(error?.message || 'Failed to connect via WalletConnect')
        }
    }

    const handleConnectBaseAccount = async () => {
        setStatus('connecting')
        setMessage('Opening Base Account...')

        const connected = await connectBaseAccount()

        if (!connected) {
            setStatus('failed')
            setMessage('Failed to connect Base Account.')
            return
        }

        setStatus('connected')
        setShowWalletOptions(false)
    }

    const handleConnectInjectedWallet = async (option: WalletOption) => {
        setStatus('connecting')
        setMessage('Connecting to browser wallet...')

        const connected = await connectInjectedWallet(option.id)

        if (!connected) {
            setStatus('failed')
            setMessage('Failed to connect to browser wallet.')
            return
        }

        setStatus('connected')
        setShowWalletOptions(false)
    }

    const handleWalletOptionClick = async (option: WalletOption) => {
        if (option.type === 'coinbase-wallet') {
            await handleConnectBaseAccount()
            return
        }

        if (option.type === 'walletconnect') {
            await handleConnectWalletConnect()
            return
        }

        if (option.type === 'injected') {
            await handleConnectInjectedWallet(option)
            return
        }

        setStatus('failed')
        setMessage('Could not find the selected wallet provider.')
    }

    const loginWithWeb3 = async () => {
        try {
            if (!account) {
                setApiResult('Please connect an EVM wallet first.')
                return
            }

            const provider = getActiveProvider()

            if (!provider) {
                setApiResult('No connected provider found.')
                return
            }

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

            const currentChainId = (await provider.request({
                method: 'eth_chainId',
            })) as string

            const normalizedChainId = normalizeHexChainId(currentChainId)

            setChainId(normalizedChainId)
            setMessage(`Wallet: ${account} / chain ${normalizedChainId}`)

            if (!isValidEvmAddress(account)) {
                setApiResult('Login is not available for non-EVM accounts.')
                return
            }

            setApiResult('1) Requesting nonce...')

            const nonceRes = await fetch(`${API_BASE_URL}/web3/auth/nonce`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    address: account,
                    chainId: Number.parseInt(currentChainId, 16),
                }),
            })

            const nonceData = await nonceRes.json().catch(() => null)

            if (!nonceRes.ok || !nonceData?.message) {
                setApiResult(
                    `Nonce request failed (${nonceRes.status}) ${
                        nonceData ? JSON.stringify(nonceData, null, 2) : ''
                    }`
                )
                return
            }

            const signMessage = nonceData.message
            const hexMessage = toHexUtf8(signMessage)

            setApiResult('2) Requesting signature...')

            const signParam =
                connectionType === 'coinbase-wallet' ? signMessage : hexMessage

            const signature = (await provider.request({
                method: 'personal_sign',
                params: [signParam, account],
            })) as string

            setApiResult('3) Verifying...')

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
                    chainId: Number.parseInt(normalizedChainId, 16),
                }),
            })

            const verifyData = await verifyRes.json().catch(() => null)

            if (!verifyRes.ok) {
                setApiResult(
                    `Verification failed (${verifyRes.status}) ${
                        verifyData ? JSON.stringify(verifyData, null, 2) : ''
                    }`
                )
                return
            }

            const token = verifyData?.accessToken

            if (!token) {
                setApiResult('Verify succeeded, but accessToken is missing.')
                return
            }

            setAccessToken(token)

            const nextUserProfile: UserConnection = {
                walletAddress: normalizeOptionalString(verifyData?.walletAddress) || account,
                profileImageUrl: normalizeOptionalString(verifyData?.profileImageUrl),
                nickname: normalizeOptionalString(verifyData?.nickname) || shortenAddress(account),
                email: normalizeOptionalString(verifyData?.email),
                bio: normalizeOptionalString(verifyData?.bio),
            }

            setUserProfile(nextUserProfile)
            await fetchVobBalance(token)

            await onLoginSuccess?.(nextUserProfile)

            setApiResult('Login successful')
        } catch (error: any) {
            console.error('[loginWithWeb3 error raw]', error)

            const msg = String(error?.message || '')

            if (error?.code === 4001) {
                setApiResult('User rejected the signature request.')
                return
            }

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
            )
        }
    }

    const logoutWeb3 = async () => {
        try {
            await fetch(`${API_BASE_URL}/web3/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            })

            setAccessToken('')
            setUserProfile(null)
            setVobBalance('0')
            setApiResult('Logged out. Successfully removed accessToken')

            await onLogout?.()
        } catch (error: any) {
            console.error('[logoutWeb3 error]', error)
            setApiResult(`Logout error: ${error?.message || 'unknown error'}`)
        }
    }

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
                            <img
                                src={option.icon}
                                alt={option.name}
                                className={styles.walletOptionIcon}
                            />
                        ) : (
                            <div className={styles.walletOptionIconFallback}>
                                {option.name.slice(0, 1)}
                            </div>
                        )}

                        <span>{option.name}</span>

                        {option.detected && (
                            <span
                                style={{
                                    color: '#9ca3af',
                                    fontSize: '12px',
                                    marginLeft: 6,
                                }}
                            >
                                (Detected)
                            </span>
                        )}

                        <span className={styles.walletOptionArrow}>›</span>
                    </button>
                ))}
            </div>
        )
    }

    const renderConnectedWalletInfo = () => {
        if (!connectedWallet) return null

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
        )
    }

    const renderLoggedInProfile = () => {
        if (!connectedWallet) return null

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
                                    alt="vob coin symbol"
                                    objectFit="contain"
                                />
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
        )
    }

    const renderWalletFooter = () => {
        if (!connectedWallet) return null

        return (
            <div className={styles.walletFooter}>
                <div className={styles.walletFooterMain}>
                    <img
                        src={connectedWallet.icon}
                        alt={connectedWallet.name}
                        className={styles.walletFooterIcon}
                    />

                    <div>
                        <div className={styles.walletFooterName}>
                            {connectedWallet.name}
                        </div>
                        <div className={styles.walletFooterAddress}>
                            {shortenAddress(account)}
                        </div>
                    </div>
                </div>

                <div className={styles.walletFooterNetwork}>
                    {getNetworkName(chainId)}
                </div>
            </div>
        )
    }

    const renderWalletHelpText = () => {
        return (
            <div className={styles.walletHelpText}>
                New to wallets?
                <NavigationLink
                    href="/web3-guide"
                    className={styles.learnMoreLink}
                    onClick={onClose}
                >
                    Learn more
                </NavigationLink>
            </div>
        )
    }

    return (
        <>
            <main className={styles.main}>
                <div className={styles.card}>
                    <h1 className={styles.title}>Web3 Connection</h1>

                    {viewState === 'disconnected' && (
                        <section className={styles.section}>
                            <div className={styles.emptyWalletIconBox}>
                                <Image
                                    src={vobLogoWhite}
                                    alt="vob logo"
                                    objectFit="contain"
                                />
                            </div>

                            <h2 className={styles.disconnectedTitle}>
                                Select a wallet to connect
                            </h2>

                            <p className={styles.disconnectedDesc}>
                                Connect your wallet to continue
                            </p>

                            {renderWalletOptionList()}
                            {renderWalletHelpText()}
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
                            {renderWalletHelpText()}
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

                                <button
                                    type="button"
                                    className={styles.myPageButton}
                                    onClick={handleGoMyPage}
                                >
                                    My Page
                                </button>
                            </div>

                            {renderWalletFooter()}
                            {renderWalletHelpText()}
                        </section>
                    )}
                </div>
            </main>

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
        </>
    )
}