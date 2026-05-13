import createMiddleware from "next-intl/middleware";
import { locales, localePrefix} from "@/navigation";
import {routing} from "@/i18n/routing";

export default createMiddleware(routing);

// export const config = {
//     // Match only internationalized pathnames
//     matcher: ['/', '/(en|jp|cn)/:path*',// Enable redirects that add missing locales
//         // (e.g. `/pathnames` -> `/en/pathnames`)
//         '/((?!_next|_vercel|.*\\..*).*)']
// }
export const config = {
    matcher: [
        // Enable a redirect to a matching locale at the root
        '/',

        // Set a cookie to remember the previous locale for
        // all requests that have a locale prefix
        '/(en|jp|cn)/:path*',

        // Enable redirects that add missing locales
        // (e.g. `/pathnames` -> `/en/pathnames`)
        '/((?!_next|_vercel|.*\\..*).*)'
    ]
};
//
// // middleware.ts
// import createMiddleware from 'next-intl/middleware';
// import { NextRequest, NextResponse } from 'next/server';
// import { routing } from '@/i18n/routing';
//
// const intlMiddleware = createMiddleware(routing);
//
// const PROFILE_PATH_REGEX = /^\/(en|jp|cn)\/profile(?:\/.*)?$/;
//
// export default async function middleware(request: NextRequest) {
//     const { pathname } = request.nextUrl;
//
//     const isProfileRoute = PROFILE_PATH_REGEX.test(pathname);
//
//     // profile이 아니면 기존 next-intl middleware만 실행
//     if (!isProfileRoute) {
//         return intlMiddleware(request);
//     }
//
//     const accessToken = request.cookies.get('accessToken')?.value;
//     const refreshToken = request.cookies.get('refreshToken')?.value;
//
//     // accessToken 있으면 통과
//     if (accessToken) {
//         return intlMiddleware(request);
//     }
//
//     // accessToken 없고 refreshToken 있으면 갱신 시도
//     if (refreshToken) {
//         try {
//             const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web3/auth/refresh`, {
//                 method: 'POST',
//                 headers: {
//                     Cookie: `refreshToken=${refreshToken}`,
//                 },
//             });
//
//             if (refreshRes.ok) {
//                 const data = await refreshRes.json();
//
//                 const response = intlMiddleware(request);
//
//                 response.cookies.set('accessToken', data.accessToken, {
//                     httpOnly: true,
//                     secure: process.env.NODE_ENV === 'production',
//                     sameSite: 'lax',
//                     path: '/',
//                     maxAge: 60 * 15,
//                 });
//
//                 return response;
//             }
//         } catch (error) {
//             // refresh 실패하면 아래에서 그냥 통과시킴
//         }
//     }
//
//     // 로그인 페이지가 없으니까 redirect 안 함
//     // profile/page.tsx에서 accessToken 없으면 LoginRequired 보여주면 됨
//     return intlMiddleware(request);
// }
//
// export const config = {
//     matcher: [
//         '/',
//         '/(en|jp|cn)/:path*',
//         '/((?!_next|_vercel|.*\\..*).*)',
//     ],
// };