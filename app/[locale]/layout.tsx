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
            <link rel="icon" href="/favicon.ico" sizes="any" type="image/x-icon"/>
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
