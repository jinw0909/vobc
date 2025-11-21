import {ReactNode} from 'react';
import {getTranslations} from "next-intl/server";

type Props = {
    children: ReactNode;
};

export const metadata = {
    metadataBase: new URL('https://www.vobc.io'),
    title: 'VOB | Vision of Blockchain',
    description:
        'VOB (Vision of Blockchain) expands access to blockchain for everyone and deepens engagement between exchanges, developers, and communities.',
    alternates: {
        canonical: '/',
        languages: {
            'en-US': '/en',
            'ja-JP': '/jp',
            'zh-CN': '/cn',
        },
    },
    openGraph: {
        title: 'VOB | VISION OF BLOCKCHAIN',
        description: 'The Vision of Blockchain foundation and the VOB token expands access to the blockchain for all and deepens the engagement between exchanges, developers, and communities.',
        type: 'website',
        // locale: 'en-US',
        url: 'https://vobc.io',
        siteName: 'The VOB Foundation'
    },
    icons: {
        icon: [
            { url: '/favicons/icon.ico', type: 'image/x-icon'},
            { url: '/favicons/icon.svg', type: 'image/svg+xml', sizes: 'any' },
            { url: '/favicons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
            { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },

            // { url: '/icon.ico' },
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180' },
        ],
    },

    verification: {
        google: 'ru0B7RK4jUkPTr8qhdl2N6KsC1gQ1VEU1_Y6K46lC74',
    },
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
}


// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({children}: Props) {
    return children;
}