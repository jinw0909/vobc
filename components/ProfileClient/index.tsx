'use client';

import { useEffect, useState } from 'react';
import ProfileContent from '@/components/ProfileContent';
import LoginRequired from '@/components/LoginRequired';
import { useWeb3Auth } from '@/providers/Web3AuthProvider';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

export default function ProfileClient() {
    const {
        accessToken,
        setAccessToken,
        fetchVobBalance,
    } = useWeb3Auth();

    const [status, setStatus] = useState<AuthStatus>('checking');

    const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

    useEffect(() => {
        let ignore = false;

        async function checkAuth() {
            if (accessToken) {
                setStatus('authenticated');
                return;
            }

            try {
                const refreshRes = await fetch(`${API_BASE_URL}/web3/auth/refresh`, {
                    method: 'POST',
                    credentials: 'include',
                });

                const data = await refreshRes.json().catch(() => null);

                if (!refreshRes.ok || !data?.accessToken) {
                    if (!ignore) {
                        setStatus('unauthenticated');
                    }
                    return;
                }

                if (!ignore) {
                    setAccessToken(data.accessToken);
                    await fetchVobBalance(data.accessToken);
                    setStatus('authenticated');
                }
            } catch (error) {
                if (!ignore) {
                    setStatus('unauthenticated');
                }
            }
        }

        checkAuth();

        return () => {
            ignore = true;
        };
    }, [API_BASE_URL, accessToken, setAccessToken, fetchVobBalance]);

    if (status === 'checking') {
        return <div>인증 확인 중...</div>;
    }

    if (status === 'authenticated' && accessToken) {
        return <ProfileContent accessToken={accessToken} />;
    }

    return <LoginRequired/>;
}