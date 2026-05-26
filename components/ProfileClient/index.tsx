'use client'

import ProfileContent from '@/components/ProfileContent'
import LoginRequired from '@/components/LoginRequired'
import { useWeb3Auth } from '@/providers/Web3AuthProvider'
import styles from './styles.module.css'

export default function ProfileClient() {
    const {
        accessToken,
        isLoggedIn,
        authChecked,
    } = useWeb3Auth()

    if (!authChecked) {
        return (
            <div className={styles.loading}>
                <div>Authenticating...</div>
            </div>
        )
    }

    if (isLoggedIn && accessToken) {
        return <ProfileContent accessToken={accessToken} />
    }

    return <LoginRequired />
}