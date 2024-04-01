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

const inter = Inter({ subsets: ["latin"] });
const notoserifjp = Noto_Serif_JP({
  weight: ['200', '300', '400', '500', '600', '700', '900'],
  style : "normal",
  subsets: ['latin']
});
export default function RootLayout ({
  children,
  params : { locale }
} : {
  children: React.ReactNode;
  params: { locale: string }
}) {

  const messages = useMessages();

  return (
      <html lang={locale}>
          <body className={`${notoserifjp.className}`}>
            <Header lang={locale}/>
            <MobileHeader lang={locale}/>
            <NextIntlClientProvider messages={messages}>
              <Breadcrumbs />
            </NextIntlClientProvider>
            {children}
            <MobileFooter lang={locale} />
            <Footer lang={locale} />
          </body>
      </html>
  );
}
