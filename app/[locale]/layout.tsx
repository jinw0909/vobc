import "./global.css";
import { Header } from "@/components/Header";
import localFont from "next/font/local";
// import { Noto_Serif_KR, Noto_Serif_JP, Noto_Serif_SC} from "next/font/google";
import { Footer } from "@/components/Footer";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileFooter } from "@/components/MobileFooter";
import { Breadcrumbs } from "@/ui/Breadcrumbs";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BottomReachedHint from "@/ui/BottomHint";
import Connect from "@/ui/Connect";
import Settings from "@/components/Settings";
import AppProviders from '@/providers/AppProviders'


// const notoserifjp = localFont({
//     src: '../../public/fonts/Noto_Serif_JP/NotoSerifJP-VariableFont_wght.woff2',
//     variable: '--font-notoserifjp',
//     display: 'auto', // 또는 optional
//     preload: true,
// });
//
// const notoserifsc = localFont({
//     src: '../../public/fonts/Noto_Serif_SC/NotoSerifSC-VariableFont_wght.woff2',
//     variable: '--font-notoserifsc',
//     display: 'auto', // 또는 optional
//     preload: true,
// });
//
// const notoserifkr = localFont({
//     src: '../../public/fonts/Noto_Serif_KR/NotoSerifKR-VariableFont_wght.woff2',
//     variable: '--font-notoserifkr',
//     display: 'auto', // 또는 optional
//     preload: true,
// });
//
// const notoserifkr = Noto_Serif_KR({
//     subsets: ["latin"],
//     weight: ["400", "500", "600"],
//     // weight: ["variable"],
//     display: "auto",
// });
//
// const notoserifjp = Noto_Serif_JP({
//     subsets: ["latin"],
//     weight: ["400", "500", "600"],
//     // weight: ["variable"],
//     display: "auto",
// });
//
// const notoserifsc = Noto_Serif_SC({
//     subsets: ["latin"],
//     weight: ["400", "500", "600"],
//     display: "auto",
// });


// const fontByLocale: Record<string, any> = {
//     en: notoserifkr,
//     jp: notoserifjp,
//     cn: notoserifsc,
//     kr: notoserifkr,
// };

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

// ✅ Per-locale metadata using translations
export async function generateMetadata(
    { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale });

    return {
        title: 'VOB | VISION OF BLOCKCHAIN',
        description: t('main.description'),
        metadataBase: new URL('https://www.vobc.io'),
        alternates: {
            canonical: '/',
            languages: {
                'en-US': '/en',
                'ja-JP': '/ja',
                'zh-CN': '/cn',
            },
        },
        openGraph: {
            title: 'VOB | VISION OF BLOCKCHAIN',
            description: t('main.description'),
            type: 'website',
            url: 'https://vobc.io',
            siteName: 'The VOB Foundation',
        },
    };
}

export default async function LocaleLayout({
                                               children,
                                               params
                                           }: any) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    setRequestLocale(locale);
    const messages = await getMessages();

    // const font = fontByLocale[locale];

    return (
        // <html lang={locale} className={font?.variable ?? ""}>
        <html lang={locale}>
        <body>
            <NextIntlClientProvider locale={locale} messages={messages}>
                <AppProviders>
                    <Connect />
                    {/*<Settings/>*/}
                    <Header lang={locale} />
                    <MobileHeader/>
                    {/*<Breadcrumbs />*/}
                    {children}
                    <MobileFooter />
                    <Footer />
                    <BottomReachedHint/>
                </AppProviders>
            </NextIntlClientProvider>
        </body>
        </html>
    );
}
