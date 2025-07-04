import {ReactNode} from 'react';
import {getTranslations} from "next-intl/server";

type Props = {
    children: ReactNode;
};

export const metadata = {
    metadataBase: new URL('https://www.vobc.io'),
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
        icon: '/icon.ico'
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

// export async function generateMetadata({params: {locale}}) {
//
//     const t = await getTranslations({locale, namespace: 'Metadata'});
//
//     return {
//         title: t('title')
//     }
// }
// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({children}: Props) {
    return children;
}