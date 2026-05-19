// 'use client';
//
// import { useEffect, useState } from 'react';
// import ProfileContent from '@/components/ProfileContent';
// import LoginRequired from '@/components/LoginRequired';
// import { useWeb3Auth } from '@/providers/Web3AuthProvider';
//
// type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';
//
// export default function ProfileClient() {
//     const {
//         accessToken,
//         setAccessToken,
//         setUserProfile,
//         fetchVobBalance,
//     } = useWeb3Auth();
//
//     const [status, setStatus] = useState<AuthStatus>('checking');
//     const [profileToken, setProfileToken] = useState<string | null>(null);
//
//     const API_BASE_URL =
//         process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
//
//     useEffect(() => {
//         let ignore = false;
//
//         async function checkAuth() {
//             try {
//                 const refreshRes = await fetch(`${API_BASE_URL}/web3/auth/refresh`, {
//                     method: 'POST',
//                     credentials: 'include',
//                     cache: 'no-store',
//                 });
//
//                 const data = await refreshRes.json().catch(() => null);
//
//                 if (!refreshRes.ok || !data?.accessToken) {
//                     if (!ignore) {
//                         if (accessToken) {
//                             setProfileToken(accessToken);
//                             setStatus('authenticated');
//                         } else {
//                             setStatus('unauthenticated');
//                         }
//                     }
//                     return;
//                 }
//
//                 if (!ignore) {
//                     setAccessToken(data.accessToken);
//                     setProfileToken(data.accessToken);
//                     setUserProfile(
//                         data.userProfile ?? {
//                             walletAddress: data.walletAddress,
//                             nickname: data.nickname,
//                             email: data.email,
//                             bio: data.bio,
//                             profileImageUrl: data.profileImageUrl,
//                         }
//                     );
//                     await fetchVobBalance(data.accessToken);
//                     setStatus('authenticated');
//                 }
//             } catch (error) {
//                 if (!ignore) {
//                     if (accessToken) {
//                         setProfileToken(accessToken);
//                         setStatus('authenticated');
//                     } else {
//                         setStatus('unauthenticated');
//                     }
//                 }
//             }
//         }
//
//         checkAuth();
//
//         return () => {
//             ignore = true;
//         };
//     }, [API_BASE_URL]);
//
//     useEffect(() => {
//         if (!accessToken) {
//             setProfileToken(null);
//             setStatus('unauthenticated');
//             return;
//         }
//
//         setProfileToken(accessToken);
//         setStatus('authenticated');
//     }, [accessToken]);
//
//     if (status === 'checking') {
//         return <div>인증 확인 중...</div>;
//     }
//
//     if (status === 'authenticated' && profileToken) {
//         return <ProfileContent accessToken={profileToken} />;
//     }
//
//     return <LoginRequired />;
// }

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
        setUserProfile,
        fetchVobBalance,
    } = useWeb3Auth();

    const [status, setStatus] = useState<AuthStatus>('checking');
    const [profileToken, setProfileToken] = useState<string | null>(null);

    const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

    async function syncProfileFromRefresh(tokenFallback?: string) {
        const refreshRes = await fetch(`${API_BASE_URL}/web3/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            cache: 'no-store',
        });

        const data = await refreshRes.json().catch(() => null);

        if (!refreshRes.ok || !data?.accessToken) {
            if (tokenFallback) {
                setProfileToken(tokenFallback);
                setStatus('authenticated');
                return;
            }

            setProfileToken(null);
            setStatus('unauthenticated');
            return;
        }

        setAccessToken(data.accessToken);
        setProfileToken(data.accessToken);

        setUserProfile(
            data.userProfile ?? {
                walletAddress: data.walletAddress,
                nickname: data.nickname,
                email: data.email,
                bio: data.bio,
                profileImageUrl: data.profileImageUrl,
            }
        );

        await fetchVobBalance(data.accessToken);

        setStatus('authenticated');
    }

    useEffect(() => {
        let ignore = false;

        async function checkAuth() {
            try {
                const refreshRes = await fetch(`${API_BASE_URL}/web3/auth/refresh`, {
                    method: 'POST',
                    credentials: 'include',
                    cache: 'no-store',
                });

                const data = await refreshRes.json().catch(() => null);

                if (ignore) return;

                if (!refreshRes.ok || !data?.accessToken) {
                    setProfileToken(null);
                    setStatus('unauthenticated');
                    return;
                }

                setAccessToken(data.accessToken);
                setProfileToken(data.accessToken);

                setUserProfile(
                    data.userProfile ?? {
                        walletAddress: data.walletAddress,
                        nickname: data.nickname,
                        email: data.email,
                        bio: data.bio,
                        profileImageUrl: data.profileImageUrl,
                    }
                );

                await fetchVobBalance(data.accessToken);

                if (!ignore) {
                    setStatus('authenticated');
                }
            } catch (error) {
                if (!ignore) {
                    setProfileToken(null);
                    setStatus('unauthenticated');
                }
            }
        }

        checkAuth();

        return () => {
            ignore = true;
        };
    }, [API_BASE_URL]);

    useEffect(() => {
        let ignore = false;

        async function handleAccessTokenChange() {
            if (!accessToken) {
                setProfileToken(null);
                setStatus('unauthenticated');
                return;
            }

            setProfileToken(accessToken);
            setStatus('authenticated');

            try {
                const refreshRes = await fetch(`${API_BASE_URL}/web3/auth/refresh`, {
                    method: 'POST',
                    credentials: 'include',
                    cache: 'no-store',
                });

                const data = await refreshRes.json().catch(() => null);

                if (ignore) return;

                if (!refreshRes.ok || !data?.accessToken) {
                    return;
                }

                setAccessToken(data.accessToken);
                setProfileToken(data.accessToken);

                setUserProfile(
                    data.userProfile ?? {
                        walletAddress: data.walletAddress,
                        nickname: data.nickname,
                        email: data.email,
                        bio: data.bio,
                        profileImageUrl: data.profileImageUrl,
                    }
                );

                await fetchVobBalance(data.accessToken);
            } catch (error) {
                console.error('[ProfileClient token sync error]', error);
            }
        }

        handleAccessTokenChange();

        return () => {
            ignore = true;
        };
    }, [accessToken, API_BASE_URL]);

    if (status === 'checking') {
        return <div>인증 확인 중...</div>;
    }

    if (status === 'authenticated' && profileToken) {
        return <ProfileContent accessToken={profileToken} />;
    }

    return <LoginRequired />;
}