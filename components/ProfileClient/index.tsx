'use client';

import { useEffect, useRef, useState } from 'react';
import ProfileContent from '@/components/ProfileContent';
import LoginRequired from '@/components/LoginRequired';
import { useWeb3Auth } from '@/providers/Web3AuthProvider';
import Image from 'next/image';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

type RefreshResponse = {
    accessToken?: string;
};

type ProfileResponse = {
    walletAddress?: string;
    nickname?: string;
    email?: string;
    bio?: string;
    profileImageUrl?: string;
};

// React StrictMode 개발환경 중복 실행 완화용
let refreshPromise: Promise<RefreshResponse | null> | null = null;

function normalizeOptionalString(value: unknown) {
    return typeof value === 'string' && value.trim().length > 0
        ? value.trim()
        : undefined;
}

export default function ProfileClient() {
    const {
        accessToken,
        setAccessToken,
        setUserProfile,
        fetchVobBalance,
    } = useWeb3Auth();

    const [status, setStatus] = useState<AuthStatus>('checking');
    const [profileToken, setProfileToken] = useState<string | null>(null);

    const profileFetchInFlightRef = useRef(false);

    const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

    async function refreshAccessToken() {
        if (!refreshPromise) {
            refreshPromise = fetch(`${API_BASE_URL}/web3/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
                cache: 'no-store',
            })
                .then(async (res) => {
                    const data = await res.json().catch(() => null);

                    if (!res.ok || !data?.accessToken) {
                        return null;
                    }

                    return data as RefreshResponse;
                })
                .finally(() => {
                    refreshPromise = null;
                });
        }

        return refreshPromise;
    }

    async function fetchProfile(token: string) {
        if (profileFetchInFlightRef.current) return;

        profileFetchInFlightRef.current = true;

        try {
            const profileRes = await fetch(`${API_BASE_URL}/web3/profile`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: 'include',
                cache: 'no-store',
            });

            const data = await profileRes.json().catch(() => null) as ProfileResponse | null;

            if (!profileRes.ok || !data) {
                throw new Error('Failed to fetch profile');
            }

            setUserProfile({
                walletAddress: normalizeOptionalString(data.walletAddress) || '',
                nickname: normalizeOptionalString(data.nickname),
                email: normalizeOptionalString(data.email),
                bio: normalizeOptionalString(data.bio),
                profileImageUrl: normalizeOptionalString(data.profileImageUrl),
            });

            await fetchVobBalance(token);
        } finally {
            profileFetchInFlightRef.current = false;
        }
    }

    useEffect(() => {
        let ignore = false;

        async function checkAuth() {
            try {
                setStatus('checking');

                // 1. 이미 accessToken이 있으면 refresh 하지 않음
                //    accessToken으로 profile API 호출
                if (accessToken) {
                    setProfileToken(accessToken);

                    await fetchProfile(accessToken);

                    if (!ignore) {
                        setStatus('authenticated');
                    }

                    return;
                }

                // 2. accessToken이 없을 때만 refresh 호출
                const refreshData = await refreshAccessToken();

                if (ignore) return;

                if (!refreshData?.accessToken) {
                    setProfileToken(null);
                    setStatus('unauthenticated');
                    return;
                }

                const newAccessToken = refreshData.accessToken;

                setAccessToken(newAccessToken);
                setProfileToken(newAccessToken);

                await fetchProfile(newAccessToken);

                if (!ignore) {
                    setStatus('authenticated');
                }
            } catch (error) {
                console.error('[ProfileClient checkAuth error]', error);

                if (!ignore) {
                    setProfileToken(null);
                    setStatus('unauthenticated');
                }
            }
        }

        void checkAuth();

        return () => {
            ignore = true;
        };
    }, [API_BASE_URL, accessToken]);

    if (status === 'checking') {
        return <div>인증 확인 중...</div>;
    }

    if (status === 'authenticated' && profileToken) {
        return <ProfileContent accessToken={profileToken} />;
    }

    return <LoginRequired />;
}