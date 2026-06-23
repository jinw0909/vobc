'use client'

import { useCallback } from 'react'
import { useWeb3Auth } from '@/providers/Web3AuthProvider'

export function useAuthFetch() {
    const {
        accessToken,
        restoreLoginSession,
    } = useWeb3Auth()

    return useCallback(
        async (
            input: RequestInfo | URL,
            init: RequestInit = {},
        ): Promise<Response> => {
            const request = async (
                token: string,
            ) => {
                const headers =
                    new Headers(init.headers)

                headers.set(
                    'Authorization',
                    `Bearer ${token}`,
                )

                return fetch(input, {
                    ...init,
                    headers,
                    credentials:
                        init.credentials ??
                        'include',
                })
            }

            let token: string | null = accessToken

            // 정상적으로 AuthGuard를 통과했다면 거의 발생하지 않지만,
            // 공통 함수 자체도 안전하게 방어한다.
            if (!token) {
                token =
                    await restoreLoginSession()

                if (!token) {
                    throw new Error(
                        '로그인이 필요합니다.',
                    )
                }
            }

            const firstResponse =
                await request(token)

            if (
                firstResponse.status !==
                401
            ) {
                return firstResponse
            }

            const refreshedToken =
                await restoreLoginSession()

            if (!refreshedToken) {
                return firstResponse
            }

            // 무한 반복을 방지하기 위해 재시도는 한 번만 한다.
            return request(refreshedToken)
        },
        [
            accessToken,
            restoreLoginSession,
        ],
    )
}