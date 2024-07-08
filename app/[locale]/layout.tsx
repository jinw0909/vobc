import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css";
import { Header } from "@/components/Header";
import { Noto_Serif_JP } from "next/font/google";
import { Footer } from "@/components/Footer";
import {MobileHeader} from "@/components/MobileHeader";
import {MobileFooter} from "@/components/MobileFooter";
import {Breadcrumbs} from "@/ui/Breadcrumbs";
import {useMessages, NextIntlClientProvider} from "next-intl";
import {getMessages, getTranslations} from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });
const notoserifjp = Noto_Serif_JP({
  weight: ['200', '300', '400', '500', '600', '700', '900'],
  style : "normal",
  subsets: ['latin']
});
export default async function RootLayout ({
  children,
  params : { locale }
} : {
  children: React.ReactNode;
  params: { locale: string }
}) {

  const messages = await getMessages();
  const t = await getTranslations();

  return (
      <html lang={locale}>
          <head>
            <link rel="apple-touch-icon" sizes="57x57" href="/favicons/apple-icon-57x57.png"/>
            <link rel="apple-touch-icon" sizes="60x60" href="/favicons/apple-icon-60x60.png"/>
            <link rel="apple-touch-icon" sizes="72x72" href="/favicons/apple-icon-72x72.png"/>
            <link rel="apple-touch-icon" sizes="76x76" href="/favicons/apple-icon-76x76.png"/>
            <link rel="apple-touch-icon" sizes="114x114" href="/favicons/apple-icon-114x114.png"/>
            <link rel="apple-touch-icon" sizes="120x120" href="/favicons/apple-icon-120x120.png"/>
            <link rel="apple-touch-icon" sizes="144x144" href="/favicons/apple-icon-144x144.png"/>
            <link rel="apple-touch-icon" sizes="152x152" href="/favicons/apple-icon-152x152.png"/>
            <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-icon-180x180.png"/>
            <link rel="icon" type="image/png" sizes="192x192"  href="/favicons/android-icon-192x192.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="96x96" href="/favicons/favicon-96x96.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png"/>
            <link rel="manifest" href="/favicons/manifest.json"/>
            <meta name="msapplication-TileColor" content="#ffffff"/>
            <meta name="msapplication-TileImage" content="/favicons/ms-icon-144x144.png"/>
            <meta name="theme-color" content="#ffffff"/>
            <title>VOB | VISION OF BLOCKCHAIN</title>
            <meta name="description" content={t('main.description')}/>
          </head>
          <body className={`${notoserifjp.className}`}>
            <Header lang={locale}/>
            <NextIntlClientProvider messages={messages}>
              <MobileHeader />
              <Breadcrumbs />
            </NextIntlClientProvider>
            {children}
            <MobileFooter />
            <Footer />
          </body>
      </html>
  );
}
