'use client'

import {ChangeEvent, useEffect, useMemo, useState} from 'react'
import styles from './styles.module.css'
import { useWeb3Auth } from '@/providers/Web3AuthProvider'
import Image from "next/image";
import vobLogo from "@/public/vob_white.png";

type ReAuthNonceResponse = {
    nonce?: string
    message?: string
    [key: string]: unknown
}

type ReAuthVerifyResponse = {
    reAuthToken?: string
    [key: string]: unknown
}

type PortfolioResponse = {
    totalValue?: number
    pnl?: number
    pnlPct?: number
    assets?: PortfolioAsset[]
    raw?: string
    originalResponse?: unknown
    [key: string]: unknown
}

type PortfolioAsset = {
    symbol: string
    name?: string
    amount: number
    value: number
    ratio: number
}

type ProfileForm = {
    nickname: string
    email: string
    bio: string
    profileImageUrl: string
}

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'

const mockPortfolio: PortfolioResponse = {
    totalValue: 12840.55,
    pnl: 1840.22,
    pnlPct: 16.74,
    assets: [
        {
            symbol: 'VOB',
            name: 'VOB Token',
            amount: 2400,
            value: 7200,
            ratio: 56,
        },
        {
            symbol: 'ETH',
            name: 'Ethereum',
            amount: 0.72,
            value: 3800,
            ratio: 30,
        },
        {
            symbol: 'USDT',
            name: 'Tether',
            amount: 1840.55,
            value: 1840.55,
            ratio: 14,
        },
    ],
}

export default function ProfileContent({ accessToken }: { accessToken: string }) {
    const {
        account,
        chainId,
        connectionType,
        connectedWallet,
        userProfile,
        vobBalance,
        displayNickname,
        displayProfileImage,
        fetchVobBalance,
        getActiveProvider,
        setUserProfile,
    } = useWeb3Auth()

    const [loading, setLoading] = useState(false)
    const [editing, setEditing] = useState(false)
    const [logs, setLogs] = useState<string[]>([])
    const [reAuthToken, setReAuthToken] = useState<string | null>(null)
    const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null)

    const [profile, setProfile] = useState({
        nickname: '',
        email: '',
        bio: '',
        profileImageUrl: '', // 저장용 S3 URL
    })

    const [profilePreviewUrl, setProfilePreviewUrl] = useState('')
    const [imageUploading, setImageUploading] = useState(false)

    const displayAddress = useMemo(() => {
        if (!account) return '-'
        return `${account.slice(0, 6)}...${account.slice(-4)}`
    }, [account])


    const addLog = (message: string) => {
        setLogs((prev) => [...prev, message])
    }

    const clearResult = () => {
        setLogs([])
        setPortfolio(null)
    }

    const handleProfileChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target

        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleProfileImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const blobUrl = URL.createObjectURL(file)
        setProfilePreviewUrl(blobUrl)

        try {
            setImageUploading(true)

            const token = getRequiredAccessToken()

            const formData = new FormData()
            formData.append('file', file)

            const res = await fetch(`${API_BASE_URL}/web3/profile/image`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })

            const data = await res.json()

            if (!res.ok || !data.imageUrl) {
                throw new Error('이미지 업로드 실패')
            }

            setProfile((prev) => ({
                ...prev,
                profileImageUrl: data.imageUrl,
            }))

            // 이제 S3 URL이 있으니까 preview도 S3 URL로 교체
            setProfilePreviewUrl(data.imageUrl)
        } finally {
            setImageUploading(false)
        }
    }

    const saveProfile = async () => {
        setLoading(true)

        try {
            const token = getRequiredAccessToken()

            addLog('프로필 수정 요청 시작')

            const res = await fetch(`${API_BASE_URL}/web3/profile/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nickname: profile.nickname,
                    profileImageUrl: profile.profileImageUrl,
                    email: profile.email,
                    bio: profile.bio,
                }),
            })

            const text = await res.text()

            if (!res.ok) {
                throw new Error(`프로필 수정 실패: ${res.status} / ${text}`)
            }

            const data = text ? JSON.parse(text) : null

            const nextUserProfile = {
                walletAddress: data?.walletAddress || userProfile?.walletAddress || account,
                nickname: data?.nickname ?? null,
                email: data?.email ?? null,
                bio: data?.bio ?? null,
                profileImageUrl: data?.profileImageUrl ?? null,
            }

            setUserProfile(nextUserProfile)

            setProfile({
                nickname: nextUserProfile.nickname ?? '',
                email: nextUserProfile.email ?? '',
                bio: nextUserProfile.bio ?? '',
                profileImageUrl: nextUserProfile.profileImageUrl ?? '',
            })

            setProfilePreviewUrl('')

            addLog('프로필 수정 성공')
            addLog(JSON.stringify(data, null, 2))

            setEditing(false)
        } catch (error) {
            addLog(error instanceof Error ? error.message : String(error))
        } finally {
            setLoading(false)
        }
    }

    const getRequiredAccessToken = () => {
        if (!accessToken) {
            throw new Error('accessToken이 없습니다. 먼저 로그인하거나 refresh를 수행해야 합니다.')
        }

        return accessToken
    }

    const getRequiredWallet = () => {
        const provider = getActiveProvider()

        if (!provider) {
            throw new Error('연결된 지갑 provider가 없습니다. 먼저 지갑을 연결해주세요.')
        }

        if (!account) {
            throw new Error('연결된 지갑 주소가 없습니다. 먼저 지갑을 연결해주세요.')
        }

        return {
            provider,
            walletAddress: account,
        }
    }

    const requestPortfolio = async (targetReAuthToken: string) => {
        const token = getRequiredAccessToken()

        const res = await fetch(`${API_BASE_URL}/web3/profile/portfolio`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'X-Reauth-Token': targetReAuthToken,
            },
        })

        const text = await res.text()

        if (!res.ok) {
            throw new Error(`portfolio 요청 실패: ${res.status} / ${text}`)
        }

        try {
            return JSON.parse(text) as PortfolioResponse
        } catch {
            return {
                raw: text,
            }
        }
    }

    const runReAuthAndRequestPortfolio = async () => {
        setLoading(true)
        clearResult()

        try {
            const token = getRequiredAccessToken()
            const { provider, walletAddress } = getRequiredWallet()

            addLog('1. 현재 지갑 세션 확인')
            addLog(`walletAddress: ${walletAddress}`)
            addLog(`connectionType: ${connectionType ?? '-'}`)
            addLog(`walletName: ${connectedWallet?.name ?? '-'}`)

            addLog('2. 재인증 nonce 요청')

            const nonceRes = await fetch(`${API_BASE_URL}/web3/auth/reauth/nonce`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    action: 'PORTFOLIO',
                }),
            })

            const nonceText = await nonceRes.text()

            if (!nonceRes.ok) {
                throw new Error(`reauth nonce 요청 실패: ${nonceRes.status} / ${nonceText}`)
            }

            const nonceData = JSON.parse(nonceText) as ReAuthNonceResponse
            const messageToSign = nonceData.message ?? nonceData.nonce

            if (!messageToSign || typeof messageToSign !== 'string') {
                throw new Error(`서명할 message 또는 nonce가 없습니다: ${nonceText}`)
            }

            addLog('3. 현재 연결된 provider로 지갑 서명 요청')

            const signature = await provider.request({
                method: 'personal_sign',
                params: [messageToSign, walletAddress],
            })

            if (typeof signature !== 'string') {
                throw new Error('서명 응답 형식이 올바르지 않습니다.')
            }

            addLog(`signature: ${signature.slice(0, 24)}...`)

            addLog('4. 재인증 verify 요청')

            const verifyRes = await fetch(`${API_BASE_URL}/web3/auth/reauth/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    walletAddress,
                    nonce: nonceData.nonce,
                    message: messageToSign,
                    signature,
                    purpose: 'PORTFOLIO',
                }),
            })

            const verifyText = await verifyRes.text()

            if (!verifyRes.ok) {
                throw new Error(`reauth verify 실패: ${verifyRes.status} / ${verifyText}`)
            }

            const verifyData = JSON.parse(verifyText) as ReAuthVerifyResponse

            if (!verifyData.reAuthToken || typeof verifyData.reAuthToken !== 'string') {
                throw new Error(`reAuthToken이 응답에 없습니다: ${verifyText}`)
            }

            setReAuthToken(verifyData.reAuthToken)
            addLog('5. reAuthToken 발급 성공')

            addLog('6. reAuthToken으로 portfolio 요청')

            const portfolioData = await requestPortfolio(verifyData.reAuthToken)

            /**
             * 백엔드 응답 구조가 아직 화면용으로 정해지지 않았다면
             * 일단 화면은 mockPortfolio 기준으로 보여주고,
             * 실제 응답은 raw/debug 영역에서 확인해도 됨.
             */
            setPortfolio({
                ...mockPortfolio,
                originalResponse: portfolioData,
            })

            addLog('7. portfolio 요청 성공')
        } catch (error) {
            addLog(error instanceof Error ? error.message : String(error))
        } finally {
            setLoading(false)
        }
    }

    const requestWithSavedReAuthToken = async () => {
        if (!reAuthToken) {
            addLog('저장된 reAuthToken이 없습니다.')
            return
        }

        setLoading(true)

        try {
            addLog('저장된 reAuthToken으로 portfolio 요청')

            const portfolioData = await requestPortfolio(reAuthToken)

            setPortfolio({
                ...mockPortfolio,
                originalResponse: portfolioData,
            })

            addLog('portfolio 요청 성공')
        } catch (error) {
            addLog(error instanceof Error ? error.message : String(error))
        } finally {
            setLoading(false)
        }
    }

    // useEffect(() => {
    //     setProfile((prev) => ({
    //         ...prev,
    //         nickname: userProfile?.nickname || displayNickname || prev.nickname,
    //         email: userProfile?.email || prev.email,
    //         bio: userProfile?.bio || prev.bio,
    //         profileImageUrl: userProfile?.profileImageUrl || displayProfileImage || prev.profileImageUrl,
    //     }))
    // }, [userProfile, displayNickname, displayProfileImage])
    useEffect(() => {
        setProfile((prev) => ({
            ...prev,
            nickname: userProfile?.nickname ?? '',
            email: userProfile?.email ?? '',
            bio: userProfile?.bio ?? '',
            profileImageUrl: userProfile?.profileImageUrl ?? '',
        }))

        setProfilePreviewUrl('')
    }, [userProfile])

    const shownPortfolio = portfolio ?? mockPortfolio
    const assets = shownPortfolio.assets ?? []

    const walletFallbackNickname =
        account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Unnamed User'

    const shownNickname =
        profile.nickname.trim() ||
        (editing ? walletFallbackNickname : displayNickname || walletFallbackNickname)

    const shownProfileImage =
        // profilePreviewUrl || profile.profileImageUrl || displayProfileImage
        profilePreviewUrl || profile.profileImageUrl || connectedWallet?.icon || ''

    const resetProfileImage = () => {
        setProfilePreviewUrl('')

        setProfile((prev) => ({
            ...prev,
            profileImageUrl: '',
        }))
    }

    const resetProfileForm = () => {
        setProfile({
            nickname: userProfile?.nickname ?? '',
            email: userProfile?.email ?? '',
            bio: userProfile?.bio ?? '',
            profileImageUrl: userProfile?.profileImageUrl ?? '',
        })

        setProfilePreviewUrl('')
    }

    const handleEditToggle = () => {
        if (editing) {
            resetProfileForm()
            setEditing(false)
            return
        }

        resetProfileForm()
        setEditing(true)
    }

    return (
        <div className={styles.profileContent}>
            <section className={styles.heroSection}>
                <div className={styles.profileMain}>
                    <div className={styles.avatarWrap}>
                        {/*{profile.profileImageUrl ? (*/}
                        {/*    <img*/}
                        {/*        src={profilePreviewUrl || profile.profileImageUrl || displayProfileImage}*/}
                        {/*        alt="Profile"*/}
                        {/*        className={styles.avatarImage}*/}
                        {/*    />*/}
                        {/*) : (*/}
                        {/*    <div className={styles.avatarPlaceholder}>*/}
                        {/*        {profile.nickname.slice(0, 1).toUpperCase()}*/}
                        {/*    </div>*/}
                        {/*)}*/}
                        {shownProfileImage ? (
                            <img
                                src={shownProfileImage}
                                alt="Profile"
                                className={styles.avatarImage}
                            />
                        ) : (
                            // <div className={styles.avatarPlaceholder}>
                            //     {(profile.nickname || 'V').slice(0, 1).toUpperCase()}
                            // </div>
                            <div className={styles.avatarPlaceholder}>
                                {shownNickname.slice(0, 1).toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className={styles.profileText}>
                        <div className={styles.profileTitleRow}>
                            {/*<h1>{profile.nickname || 'Unnamed User'}</h1>*/}
                            <h1>{shownNickname}</h1>

                            <button
                                type="button"
                                className={styles.secondaryButton}
                                onClick={handleEditToggle}
                            >
                                {editing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>

                        <p className={styles.walletAddress}>{displayAddress}</p>

                        <div className={styles.statusRow}>
                            <span>{connectionType || 'Not connected'}</span>
                            <span>{connectedWallet?.name || 'No wallet'}</span>
                            <span>{accessToken ? 'Logged in' : 'No access token'}</span>
                        </div>
                        <div className={styles.mobileSecondary}>
                            <button
                                type="button"
                                className={styles.secondaryButton}
                                onClick={handleEditToggle}
                            >
                                {editing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>

                    </div>
                </div>

                <div className={styles.balanceCard}>
                    <span className={styles.cardLabel}>VOB Balance</span>
                    <div className={styles.vobBalanceText}>
                        <div className={styles.vobBadge}>
                            <Image
                                src={vobLogo}
                                alt={"vob coin symbol"}
                                objectFit="contain"
                            ></Image>
                        </div>
                        <strong>{vobBalance}</strong>
                    </div>
                    {/*<p>현재는 context 또는 API 연결 전 임시 값입니다.</p>*/}
                </div>
            </section>

            {editing && (
                <section className={styles.card}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <h2>Profile Settings</h2>
                            <p>Register or update nickname, email, profile image, and bio</p>
                        </div>
                    </div>

                    <div className={styles.formGrid}>
                        <label className={styles.inputGroup}>
                            <span>Nickname</span>
                            <input
                                name="nickname"
                                value={profile.nickname}
                                onChange={handleProfileChange}
                                placeholder="nickname"
                            />
                        </label>

                        <label className={styles.inputGroup}>
                            <span>Email</span>
                            <input
                                name="email"
                                value={profile.email}
                                onChange={handleProfileChange}
                                placeholder="you@example.com"
                            />
                        </label>

                        <div className={styles.inputGroup}>
                            <span>Profile Image</span>

                            <div className={styles.imageButtonRow}>
                                <label className={styles.imageUploadButton}>
                                    {imageUploading ? 'Uploading...' : 'Change Image'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfileImageChange}
                                        className={styles.hiddenFileInput}
                                        disabled={imageUploading}
                                    />
                                </label>

                                <button
                                    type="button"
                                    className={styles.imageResetButton}
                                    onClick={resetProfileImage}
                                    disabled={imageUploading}
                                >
                                    Reset Image
                                </button>
                            </div>
                        </div>

                        <label className={styles.inputGroupFull}>
                            <span>Bio</span>
                            <textarea
                                name="bio"
                                value={profile.bio}
                                onChange={handleProfileChange}
                                placeholder="tell us about yourself"
                                rows={4}
                            />
                        </label>
                    </div>

                    <div className={styles.buttonRowRight}>
                        <button
                            type="button"
                            className={styles.primaryButton}
                            onClick={saveProfile}
                            disabled={loading || imageUploading}
                        >
                            {imageUploading ? 'Uploading image...' : loading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </section>
            )}

            <section className={styles.card}>
                <div className={styles.sectionHeader}>
                    <div>
                        <h2>About</h2>
                        <p>Basic Information</p>
                    </div>
                </div>

                <div className={styles.infoGrid}>
                    <div>
                        <span>Email</span>
                        <strong>{profile.email || 'Not registered'}</strong>
                    </div>

                    <div>
                        <span>Bio</span>
                        <strong>{profile.bio || 'Not registered'}</strong>
                    </div>
                </div>
            </section>

            <section className={`${styles.card} ${styles.portfolio}`}>
                <div className={styles.sectionHeader}>
                    <div>
                        <h2>Portfolio</h2>
                        <p>민감 엔드포인트이므로 요청 시 지갑 재인증을 수행합니다.</p>
                    </div>

                    <div className={styles.headerActions}>
                        <button
                            type="button"
                            className={styles.primaryButton}
                            onClick={runReAuthAndRequestPortfolio}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Load Portfolio'}
                        </button>

                        <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={requestWithSavedReAuthToken}
                            disabled={loading || !reAuthToken}
                        >
                            Use Saved Token
                        </button>
                    </div>
                </div>

                <div className={styles.portfolioSummary}>
                    <div>
                        <span>Total Value</span>
                        <strong>${shownPortfolio.totalValue?.toLocaleString() ?? '-'}</strong>
                    </div>

                    <div>
                        <span>Profit / Loss</span>
                        <strong>
                            ${shownPortfolio.pnl?.toLocaleString() ?? '-'}
                        </strong>
                    </div>

                    <div>
                        <span>ROI</span>
                        <strong>{shownPortfolio.pnlPct ?? '-'}%</strong>
                    </div>
                </div>

                <div className={styles.fakeChart}>
                    {assets.map((asset) => (
                        <div
                            key={asset.symbol}
                            className={styles.chartBar}
                            style={{ height: `${Math.max(asset.ratio, 8)}%` }}
                        >
                            <span>{asset.symbol}</span>
                        </div>
                    ))}
                </div>

                <div className={styles.assetList}>
                    {assets.map((asset) => (
                        <div key={asset.symbol} className={styles.assetItem}>
                            <div>
                                <strong>{asset.symbol}</strong>
                                <span>{asset.name || asset.symbol}</span>
                            </div>

                            <div>
                                <strong>{asset.amount.toLocaleString()}</strong>
                                <span>${asset.value.toLocaleString()}</span>
                            </div>

                            <div className={styles.assetRatio}>
                                {asset.ratio}%
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.portfolioActions}>
                    <button type="button" className={styles.secondaryButton}>
                        공개
                    </button>

                    <button type="button" className={styles.secondaryButton}>
                        분석
                    </button>
                </div>
            </section>

            <section className={styles.twoColumn}>
                <div className={styles.card}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <h2>My Posts</h2>
                            <p>Posts written</p>
                        </div>
                    </div>

                    <div className={styles.emptyBox}>
                        -
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <h2>Liked Posts</h2>
                            <p>Liked posts</p>
                        </div>
                    </div>

                    <div className={styles.emptyBox}>
                        -
                    </div>
                </div>
            </section>

            <section className={styles.card}>
                <div className={styles.sectionHeader}>
                    <div>
                        <h2>Follow</h2>
                        {/*<p>팔로우/팔로잉 기능은 추후 추가 예정입니다.</p>*/}
                    </div>
                </div>

                <div className={styles.followGrid}>
                    <div>
                        <strong>0</strong>
                        <span>Followers</span>
                    </div>

                    <div>
                        <strong>0</strong>
                        <span>Following</span>
                    </div>
                </div>
            </section>

            {logs.length > 0 && (
                <section className={styles.debugCard}>
                    <h2>Debug Logs</h2>

                    {logs.map((log, index) => (
                        <p key={`${log}-${index}`}>{log}</p>
                    ))}
                </section>
            )}

            {portfolio?.originalResponse !== undefined && (
                <section className={styles.debugCard}>
                    <h2>Original Portfolio Response</h2>
                    <pre>{JSON.stringify(portfolio.originalResponse, null, 2)}</pre>
                </section>
            )}
        </div>
    )
}