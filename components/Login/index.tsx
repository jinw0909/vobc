'use client'

import { useState } from 'react'
import styles from './styles.module.css'
import vobLogo from '@/public/vob_white.png'
import vobLogoWhite from '@/public/favicon.svg'
import Image from 'next/image'
import retryImage from '@/public/icons/retry-green.svg'
import { NavigationLink } from '@/ui/NavigationLink'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useWeb3Auth } from '@/providers/Web3AuthProvider'
import { WalletOption } from '@/types/web3'
import {
    isValidEvmAddress,
    shortenAddress,
    normalizeOptionalString,
    getNetworkName,
} from '@/utils/web3'

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
    onConnectSuccess?: (
        conn: WalletConnection,
    ) => void | Promise<void>

    onLoginSuccess?: (
        user: UserConnection,
    ) => void | Promise<void>

    onLogout?: () => void | Promise<void>
    onDisconnect?: () => void | Promise<void>
    onClose?: () => void
    onGoMyPage?: () => void
}

function LoadingSpinner() {
    return (
        <span
            className={styles.loadingSpinner}
            role="status"
            aria-label="Loading"
        />
    )
}

export default function Login({
                                  onLoginSuccess,
                                  onLogout,
                                  onDisconnect,
                                  onClose,
                              }: LoginProps) {
    const [status, setStatus] =
        useState<Status>('idle')

    const [message, setMessage] =
        useState('Select a wallet to connect')

    const [apiResult, setApiResult] =
        useState('')

    const [
        showWalletOptions,
        setShowWalletOptions,
    ] = useState(true)

    const [
        confirmModal,
        setConfirmModal,
    ] = useState<
        'disconnect' | 'logout' | null
    >(null)

    const [
        pendingConnectWalletIds,
        setPendingConnectWalletIds,
    ] = useState<Set<string>>(
        new Set(),
    )

    // const [
    //     isLoginPending,
    //     setIsLoginPending,
    // ] = useState(false)

    const [
        loginPendingCount,
        setLoginPendingCount,
    ] = useState(0)

    const isLoginPending = loginPendingCount > 0

    const {
        account,
        chainId,
        chainInfo,
        connectionType,
        connectedWallet,
        vobBalance,

        viewState,
        displayNickname,
        displayProfileImage,
        walletOptions,

        setAccessToken,
        setUserProfile,
        setVobBalance,

        connectWalletConnect,
        connectBaseAccount,
        connectInjectedWallet,

        resetLoginState,

        disconnectWallet,

        fetchVobBalance,
        signMessage,
    } = useWeb3Auth()

    const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        'http://localhost:8080'

    const router = useRouter()
    const pathname = usePathname()

    const connectedProfileImage =
        connectionType === 'walletconnect'
            ? '/wallets/walletconnect.svg'
            : connectedWallet?.icon ||
            '/default-wallet.png'

    const handleDisconnectClick =
        async () => {
            // try {
            //     await fetch(
            //         `${API_BASE_URL}/web3/auth/logout`,
            //         {
            //             method: 'POST',
            //             credentials: 'include',
            //         },
            //     )
            // } catch (error) {
            //     console.error(
            //         '[handleDisconnectClick error]',
            //         error,
            //     )
            // }

            await fetch(`${API_BASE_URL}/web3/auth/disconnect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                credentials: 'include',
                body: account,
            })

            await disconnectWallet()

            setLoginPendingCount(0)

            setStatus('idle')
            setMessage(
                'Manually disconnected.',
            )
            setShowWalletOptions(true)

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

    const confirmDisconnect =
        async () => {
            setConfirmModal(null)
            await handleDisconnectClick()
        }

    const confirmLogout =
        async () => {
            setConfirmModal(null)
            await logoutWeb3()
        }

    const handleGoMyPage = () => {
        onClose?.()

        if (pathname === '/profile') {
            router.refresh()
            return
        }

        router.push('/profile')
    }

    const handleWalletOptionClick =
        async (
            option: WalletOption,
        ) => {

            setStatus('connecting')

            try {
                let connected = false

                if (
                    option.type ===
                    'coinbase-wallet'
                ) {
                    setMessage(
                        'Opening Base Account...',
                    )

                    connected =
                        await connectBaseAccount()
                } else if (
                    option.type ===
                    'walletconnect'
                ) {
                    setMessage(
                        'Opening wallet list...',
                    )

                    connected =
                        await connectWalletConnect()
                } else if (
                    option.type ===
                    'injected'
                ) {
                    setMessage(
                        'Connecting to browser wallet...',
                    )

                    connected =
                        await connectInjectedWallet(
                            option.id,
                        )
                } else {
                    setStatus('failed')

                    setMessage(
                        'Could not find the selected wallet provider.',
                    )

                    return
                }

                if (!connected) {
                    setStatus('failed')

                    setMessage(
                        `Failed to connect ${option.name}.`,
                    )

                    return
                }

                setStatus('connected')
                setShowWalletOptions(false)
            } catch (error: any) {
                console.error(
                    '[handleWalletOptionClick error]',
                    error,
                )

                setStatus('failed')

                setMessage(
                    error?.message ||
                    `Failed to connect ${option.name}.`,
                )
            }
        }

    const loginWithWeb3 =
        async () => {

            // setIsLoginPending(true)
            setLoginPendingCount((count) => count + 1)

            try {
                if (!account) {
                    setApiResult(
                        'Please connect an EVM wallet first.',
                    )

                    return
                }

                if (!chainId) {
                    setApiResult(
                        'Could not detect chainId. Please reconnect your wallet.',
                    )

                    return
                }

                const decimalChainId =
                    Number.parseInt(
                        chainId,
                        16,
                    )

                if (
                    Number.isNaN(
                        decimalChainId,
                    )
                ) {
                    setApiResult(
                        `Invalid chainId: ${chainId}`,
                    )

                    return
                }

                setMessage(
                    `Wallet: ${account} / chain ${chainId}`,
                )

                if (
                    !isValidEvmAddress(
                        account,
                    )
                ) {
                    setApiResult(
                        'Login is not available for non-EVM accounts.',
                    )

                    return
                }

                setApiResult(
                    '1) Requesting nonce...',
                )

                const nonceRes =
                    await fetch(
                        `${API_BASE_URL}/web3/auth/nonce`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type':
                                    'application/json',
                            },
                            credentials:
                                'include',
                            body:
                                JSON.stringify(
                                    {
                                        address:
                                        account,
                                        chainId:
                                        decimalChainId,
                                    },
                                ),
                        },
                    )

                const nonceData =
                    await nonceRes
                        .json()
                        .catch(
                            () => null,
                        )

                if (
                    !nonceRes.ok ||
                    !nonceData?.message
                ) {
                    setApiResult(
                        `Nonce request failed (${nonceRes.status}) ${
                            nonceData
                                ? JSON.stringify(
                                    nonceData,
                                    null,
                                    2,
                                )
                                : ''
                        }`,
                    )

                    return
                }

                const messageToSign =
                    nonceData.message

                setApiResult(
                    '2) Requesting signature...',
                )

                const signature =
                    await signMessage(
                        messageToSign,
                    )

                setApiResult(
                    '3) Verifying...',
                )

                const verifyRes =
                    await fetch(
                        `${API_BASE_URL}/web3/auth/verify`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type':
                                    'application/json',
                            },
                            credentials:
                                'include',
                            body:
                                JSON.stringify(
                                    {
                                        address:
                                        account,
                                        signature,
                                        nonce:
                                        nonceData.nonce,
                                        chainId:
                                        decimalChainId,
                                    },
                                ),
                        },
                    )

                const verifyData =
                    await verifyRes
                        .json()
                        .catch(
                            () => null,
                        )

                if (!verifyRes.ok) {
                    setApiResult(
                        `Verification failed (${verifyRes.status}) ${
                            verifyData
                                ? JSON.stringify(
                                    verifyData,
                                    null,
                                    2,
                                )
                                : ''
                        }`,
                    )

                    return
                }

                const token =
                    verifyData?.accessToken

                if (!token) {
                    setApiResult(
                        'Verify succeeded, but accessToken is missing.',
                    )

                    return
                }

                setAccessToken(token)

                const nextUserProfile:
                    UserConnection = {
                    walletAddress:
                        normalizeOptionalString(
                            verifyData?.walletAddress,
                        ) || account,

                    profileImageUrl:
                        normalizeOptionalString(
                            verifyData?.profileImageUrl,
                        ),

                    nickname:
                        normalizeOptionalString(
                            verifyData?.nickname,
                        ) ||
                        shortenAddress(
                            account,
                        ),

                    email:
                        normalizeOptionalString(
                            verifyData?.email,
                        ),

                    bio:
                        normalizeOptionalString(
                            verifyData?.bio,
                        ),
                }

                setUserProfile(
                    nextUserProfile,
                )

                await fetchVobBalance(
                    token,
                )

                await onLoginSuccess?.(
                    nextUserProfile,
                )

                setApiResult(
                    'Login successful',
                )
            } catch (error: any) {
                console.error(
                    '[loginWithWeb3 error raw]',
                    error,
                )

                if (
                    error?.code === 4001
                ) {
                    setApiResult(
                        'User rejected the signature request.',
                    )

                    return
                }

                setApiResult(
                    `Login error:
                    message=${error?.message || 'unknown error'}
                    code=${error?.code ?? 'unknown'}
                    data=${JSON.stringify(
                        error?.data ?? null,
                        null,
                        2,
                    )}`,
                )
            } finally {
                // setIsLoginPending(false)
                setLoginPendingCount((count) => Math.max(0, count - 1))
            }
        }

    const logoutWeb3 =
        async () => {
            try {
                await fetch(
                    `${API_BASE_URL}/web3/auth/logout`,
                    {
                        method: 'POST',
                        credentials: 'include',
                    },
                )

                setAccessToken('')
                setUserProfile(null)
                setVobBalance('0')
                resetLoginState()

                setLoginPendingCount(0)

                setApiResult(
                    'Logged out. Successfully removed accessToken',
                )

                await onLogout?.()
            } catch (error: any) {
                console.error(
                    '[logoutWeb3 error]',
                    error,
                )

                setApiResult(
                    `Logout error: ${
                        error?.message ||
                        'unknown error'
                    }`,
                )
            }
        }

    const renderWalletOptionList =
        () => {
            return (
                <div
                    className={
                        styles.walletOptionBox
                    }
                >
                    {walletOptions.map(
                        (option) => {
                            return (
                                <button
                                    key={
                                        option.id
                                    }
                                    type="button"
                                    onClick={() => {
                                        void handleWalletOptionClick(
                                            option,
                                        )
                                    }}
                                    className={
                                        styles.walletOptionButton
                                    }
                                >
                                    {option.icon ? (
                                        <img
                                            src={
                                                option.icon
                                            }
                                            alt={
                                                option.name
                                            }
                                            className={
                                                styles.walletOptionIcon
                                            }
                                        />
                                    ) : (
                                        <div
                                            className={
                                                styles.walletOptionIconFallback
                                            }
                                        >
                                            {option.name.slice(
                                                0,
                                                1,
                                            )}
                                        </div>
                                    )}

                                    <span>
                                    {
                                        option.name
                                    }
                                </span>

                                    {option.detected && (
                                        <span
                                            style={{
                                                color:
                                                    '#9ca3af',

                                                fontSize:
                                                    '12px',

                                                marginRight: '12px'
                                            }}
                                        >
                                            (Detected)
                                        </span>
                                    )}

                                    <span
                                        className={
                                            styles.walletOptionArrow
                                        }
                                    >
                                    ›
                                </span>
                                </button>
                            )
                        },
                    )}
                </div>
            )
        }
    const renderConnectedWalletInfo =
        () => {
            if (!connectedWallet) {
                return null
            }

            return (
                <div
                    className={
                        styles.connectedMainProfile
                    }
                >
                    <div
                        className={
                            styles.profileImageWrap
                        }
                    >
                        {/*<img*/}
                        {/*    src={*/}
                        {/*        connectedWallet.icon*/}
                        {/*    }*/}
                        {/*    alt={*/}
                        {/*        connectedWallet.name*/}
                        {/*    }*/}
                        {/*    className={*/}
                        {/*        styles.connectedMainIcon*/}
                        {/*    }*/}
                        {/*/>*/}
                        <img
                            src={connectedProfileImage}
                            alt={
                                connectionType === 'walletconnect'
                                    ? 'WalletConnect'
                                    : connectedWallet.name
                            }
                            className={styles.connectedMainIcon}
                        />
                        <span
                            className={
                                styles.checkBadge
                            }
                        >
                            ✓
                        </span>
                    </div>

                    <div
                        className={
                            styles.statusPills
                        }
                    >
                        <span
                            className={`${styles.statusPill} ${styles.connectedPill}`}
                        >
                            ● Connected
                        </span>
                    </div>
                </div>
            )
        }

    const renderLoggedInProfile =
        () => {
            if (!connectedWallet) {
                return null
            }

            return (
                <>
                    <div
                        className={
                            styles.connectedMainProfile
                        }
                    >
                        <div
                            className={
                                styles.profileImageWrap
                            }
                        >
                            <img
                                src={
                                    displayProfileImage
                                }
                                alt={
                                    displayNickname
                                }
                                className={
                                    styles.connectedMainIcon
                                }
                            />

                            <span
                                className={
                                    styles.checkBadge
                                }
                            >
                                ✓
                            </span>
                        </div>

                        <div
                            className={
                                styles.statusPills
                            }
                        >
                            <span
                                className={`${styles.statusPill} ${styles.connectedPill}`}
                            >
                                ● Connected
                            </span>

                            <span
                                className={`${styles.statusPill} ${styles.loggedInPill}`}
                            >
                                ● Logged In
                            </span>
                        </div>
                    </div>

                    <div
                        className={
                            styles.profileSummaryGrid
                        }
                    >
                        <div
                            className={
                                styles.profileSummaryItem
                            }
                        >
                            <div
                                className={
                                    styles.infoLabel
                                }
                            >
                                VOB Balance
                            </div>

                            <div
                                className={
                                    styles.vobBalanceText
                                }
                            >
                                <div
                                    className={
                                        styles.vobBadge
                                    }
                                >
                                    <Image
                                        src={
                                            vobLogo
                                        }
                                        alt="vob coin symbol"
                                        objectFit="contain"
                                    />
                                </div>

                                {
                                    vobBalance
                                }
                            </div>
                        </div>

                        <div
                            className={
                                styles.profileSummaryDivider
                            }
                        />

                        <div
                            className={
                                styles.profileSummaryItem
                            }
                        >
                            <div
                                className={
                                    styles.infoLabel
                                }
                            >
                                Nickname
                            </div>

                            <div
                                className={
                                    styles.nicknameText
                                }
                            >
                                {
                                    displayNickname
                                }
                            </div>
                        </div>
                    </div>
                </>
            )
        }

    const renderWalletFooter =
        () => {
            if (!connectedWallet) {
                return null
            }

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
                        {chainInfo?.icon && (
                            <img
                                src={chainInfo.icon}
                                alt={`${chainInfo.name} icon`}
                                className={styles.walletFooterNetworkIcon}
                            />
                        )}

                        <span>{chainInfo?.name}</span>
                    </div>
                </div>
            )
        }

    const renderWalletHelpText =
        () => {
            return (
                <div
                    className={
                        styles.walletHelpText
                    }
                >
                    New to wallets?

                    <NavigationLink
                        href="/web3-guide"
                        className={
                            styles.learnMoreLink
                        }
                        onClick={
                            onClose
                        }
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
                    <h1 className={styles.title}>
                        Web3 Connection
                    </h1>

                    {viewState ===
                        'disconnected' && (
                            <section className={styles.section}>
                                <div className={styles.emptyWalletIconBox}>
                                    <Image
                                        src={vobLogoWhite}
                                        alt="vob logo"
                                        objectFit="contain"
                                    />
                                </div>

                                <h2 className={styles.disconnectedTitle}>
                                    Select a wallet
                                    to connect
                                </h2>

                                <p className={styles.disconnectedDesc}>
                                    Connect your
                                    wallet to
                                    continue
                                </p>

                                {renderWalletOptionList()}

                                {renderWalletHelpText()}
                            </section>
                        )}

                    {viewState ===
                        'connected' && (
                            <section className={styles.section}>
                                {renderConnectedWalletInfo()}

                                <div className={styles.topActionRow}>
                                    <button
                                        type="button"
                                        onClick={openDisconnectConfirm}
                                        className={styles.disconnectButton}
                                    >
                                        Disconnect
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => { void loginWithWeb3() }}
                                        className={styles.loginButton}
                                        disabled={isLoginPending}
                                    >
                                        {isLoginPending ? (
                                            <LoadingSpinner />
                                        ) : (
                                            'Login'
                                        )}
                                    </button>

                                </div>

                                {isLoginPending && (
                                    <div className={styles.loginRetryNotice}>
                                        <span className={styles.loginRetryText}>
                                            Has the signature request not arrived in your wallet?
                                        </span>
                                        <button
                                            type="button"
                                            className={styles.loginRetryInlineButton}
                                            onClick={() => {
                                                void loginWithWeb3()
                                            }}
                                        >
                                            <span>Send request once more</span>
                                            <Image
                                                className={styles.loginRetryInlineIcon}
                                                src={retryImage}
                                                alt={"retry login"}
                                                width={16}
                                                height={16}/>
                                        </button>
                                    </div>
                                )}


                                {renderWalletFooter()}

                                {renderWalletHelpText()}
                            </section>
                        )}

                    {viewState ===
                        'loggedIn' && (
                            <section
                                className={
                                    styles.section
                                }
                            >
                                {renderLoggedInProfile()}

                                <div
                                    className={
                                        styles.topActionRow
                                    }
                                >
                                    <button
                                        type="button"
                                        onClick={
                                            openLogoutConfirm
                                        }
                                        className={
                                            styles.logoutButton
                                        }
                                    >
                                        Logout
                                    </button>

                                    <button
                                        type="button"
                                        className={
                                            styles.myPageButton
                                        }
                                        onClick={
                                            handleGoMyPage
                                        }
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

            {confirmModal ===
                'disconnect' && (
                    <div
                        className={
                            styles.confirmOverlay
                        }
                    >
                        <div
                            className={
                                styles.confirmModal
                            }
                        >
                            <div
                                className={
                                    styles.confirmIconDanger
                                }
                            >
                                ⌁
                            </div>

                            <h2
                                className={
                                    styles.confirmTitle
                                }
                            >
                                Disconnect wallet?
                            </h2>

                            <p
                                className={
                                    styles.confirmDesc
                                }
                            >
                                Your wallet will be
                                disconnected and you
                                will be returned to
                                the initial screen.
                            </p>

                            <div
                                className={
                                    styles.confirmActionRow
                                }
                            >
                                <button
                                    type="button"
                                    className={
                                        styles.confirmCancelButton
                                    }
                                    onClick={
                                        closeConfirmModal
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className={
                                        styles.confirmDisconnectButton
                                    }
                                    onClick={() => {
                                        void confirmDisconnect()
                                    }}
                                >
                                    Disconnect
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            {confirmModal ===
                'logout' && (
                    <div
                        className={
                            styles.confirmOverlay
                        }
                    >
                        <div
                            className={
                                styles.confirmModal
                            }
                        >
                            <div
                                className={
                                    styles.confirmIconSuccess
                                }
                            >
                                ↪
                            </div>

                            <h2
                                className={
                                    styles.confirmTitle
                                }
                            >
                                Logout from VOB?
                            </h2>

                            <p
                                className={
                                    styles.confirmDesc
                                }
                            >
                                You will remain
                                connected to your
                                wallet, but you will
                                be logged out of VOB.
                            </p>

                            <div
                                className={
                                    styles.confirmActionRow
                                }
                            >
                                <button
                                    type="button"
                                    className={
                                        styles.confirmCancelButton
                                    }
                                    onClick={
                                        closeConfirmModal
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className={
                                        styles.confirmLogoutButton
                                    }
                                    onClick={() => {
                                        void confirmLogout()
                                    }}
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