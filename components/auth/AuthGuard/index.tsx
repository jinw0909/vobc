'use client'

import type { ReactNode } from 'react'
import { useWeb3Auth } from '@/providers/Web3AuthProvider'
import LoginRequired from '@/components/auth/LoginRequired'

export default function AuthGuard({
                                      children,
                                  }: { children: ReactNode }) {
    const {
        authChecked,
        isLoggedIn,
    } = useWeb3Auth()

    // refresh 요청이 끝나기 전
    if (!authChecked) {
        return (
            <main>
                <p>Checking login status...</p>
            </main>
        )
    }

    // refresh 요청까지 실패한 경우
    if (!isLoggedIn) {
        return <LoginRequired />
    }

    // 로그인 상태인 경우
    return <>{children}</>
}