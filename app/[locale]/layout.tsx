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

const locales = ['en', 'jp', 'cn'];
export function generateStaticParams() {
    return locales.map((locale) => ({locale}));
}

export default async function RootLayout ({
      children,
      params : { locale }
    } : {
      children: React.ReactNode;
      params: { locale: string }
    }) {

  const messages = await getMessages();
  const t = await getTranslations();

  // @ts-ignore
  // @ts-ignore
  return (
      <html lang={locale}>
      <head>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
          {/*<link rel="manifest" href="/site.webmanifest"/>*/}
          <title>VOB | VISION OF BLOCKCHAIN</title>
          <meta name="description" content={t('main.description')}/>
          <meta name="keywords" content="vob,VOB,vobc,vision of blockchain,비전 오브 블록체인,ビジョン・オブ・ブロックチェーン,vob coin,vob token,
        vob 코인,vob 토큰,vobコイン,vobトークン,vob币,vob代币,the vob foundation,vob 재단,vob財団,VOB基金会,Quỹ VOB,blockchain,블록체인,ブロックチェーン,区块链,cryptocurrency,가상화폐,암호화폐,仮想通貨,暗号資産,暗号通貨,
        虚拟货币,加密货币,Tiền điện tử,blocksquare seoul,블록스퀘어 서울,ブロックスクエア・ソウル,blocksquare首尔,vob nft,nft,NFT,cointr,cointrpro,lbank,Goya,goya,goya score,고야,고야 스코어,ゴヤー,ゴヤースコア,goya评分,Điểm số Goya
        auto trading,자동매매,自動取引,自动交易,Giao dịch tự động,AI,인공지능,人工知能,人工智能,Trí tuệ nhân tạo,white paper,백서,白書,白皮书,Sách trắng,smart contract,스마트 컨트랙트,スマートコントラクト,智能合约,Hợp đồng thông minh"
          />
          <meta name="format-detection" content="telephone=no"/>
          <meta name="google-site-verification" content="ru0B7RK4jUkPTr8qhdl2N6KsC1gQ1VEU1_Y6K46lC74"/>
      </head>
      <body className={`${notoserifjp.className}`}>
      <Header lang={locale}/>
      <NextIntlClientProvider messages={messages}>
        <MobileHeader/>
        <Breadcrumbs/>
      </NextIntlClientProvider>
      {children}
            <MobileFooter />
            <Footer />
          </body>
      </html>
  );
}
