import "./global.css";
import { Header } from "@/components/Header";
import { Noto_Serif_JP, Noto_Serif_KR, Noto_Serif_SC } from "next/font/google";
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


const notoserifjp = Noto_Serif_JP({
    weight: ['200', '300', '400', '500', '600', '700', '900'],
    style: "normal",
    subsets: ['latin'],
    preload: false
});

const notoserifsc = Noto_Serif_SC({
    weight: ['200', '300', '400', '500', '600', '700', '900'],
    style: "normal",
    subsets: ['latin'],
    preload: false
});

const notoserifkr = Noto_Serif_KR({
    weight: ['400','700','800'],
    style: "normal",
    subsets: ['latin'],
    preload: false
});

const fontByLocale: Record<string, any> = {
    en: notoserifkr,
    jp: notoserifjp,
    cn: notoserifsc,
    kr: notoserifkr,
};

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

    const font = fontByLocale[locale];

    return (
        <html lang={locale}>
        <body className={font.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
            <Header lang={locale} />
            <MobileHeader />
            {/*<Breadcrumbs />*/}
            {children}
            <MobileFooter />
            <Footer />
            <BottomReachedHint/>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}
