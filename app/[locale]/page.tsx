import Image from "next/image";
import styles from './styles.module.css'
import Link from 'next/link';
import { About } from "@/components/About";
import {DevsMain} from "@/components/DevsMain";
import {getMessages, getTranslations, setRequestLocale, unstable_setRequestLocale} from "next-intl/server";
import {useTranslations} from "next-intl";
import {Whitepaper} from "@/components/Whitepaper";
import {SmartContract} from "@/components/SmartContract";
import {Roadmap} from "@/components/Roadmap";
import {Distribution} from "@/components/Distribution";
import {Partners} from "@/components/Partners";
import {NextIntlClientProvider} from "next-intl";
import {Vision} from "@/components/Vision";
import {Wrapup} from "@/components/Wrapup";
import {PartnersNew} from "@/components/PartnersNew";
import AnimatedDiv from "@/components/Whitepaper/AnimatedDiv";
import {Devs} from "@/components/Devs";


export default function Page({params : { locale }} : {params : {locale : string}}) {
  // unstable_setRequestLocale(locale);
  setRequestLocale(locale);

  // const t = await getTranslations('main');
  const t = useTranslations('main');
  // const messages = await getMessages();

  return (
      <>
          <main className={styles.mainWrapper}>
              <div className={styles.mainText}>
                  {/*<div className={`${styles.fadeInAnimation}`}>{intl.main.title_0}</div>*/}
                  {/*<div className={`${styles.delayedAnimation} opacity-0`}>{intl.main.title_1}</div>*/}
                  <div className={`${styles.fadeInAnimation}`}>{t('title_0')}</div>
                  <div className={`${styles.delayedAnimation} opacity-0`}>{t('title_1')}</div>
                  <div className={`${styles.subText} ${styles.moreDelayedAnimation} opacity-0`}>
                      <div>{t('subtitle_0')}</div>
                      <div>{t('subtitle_1')}</div>
                      <div>{t('subtitle_2')}</div>
                  </div>
              </div>
          </main>
          <div className={`${styles.subWrapper} ${styles.visionWrapper}`}>
              <Vision/>
          </div>
          {/*<div className={styles.subWrapper}>*/}
          {/*    <About/>*/}
          {/*</div>*/}
          {/*<div className={styles.subWrapper}>*/}
          {/*    /!*<NextIntlClientProvider messages={messages}>*!/*/}
          {/*    <Whitepaper/>*/}
          {/*    /!*</NextIntlClientProvider>*!/*/}
          {/*</div>*/}
          <div className={styles.subWrapperPlus}>
              <Whitepaper/>
              <SmartContract/>
              <DevsMain/>
          </div>
          {/*<div className={styles.subWrapper}>*/}
          {/*    <SmartContract/>*/}
          {/*</div>*/}
          <div className={styles.subWrapper}>
              {/*<NextIntlClientProvider messages={messages}>*/}
              <Roadmap/>
              {/*</NextIntlClientProvider>*/}
          </div>
          <div className={styles.subWrapper}>
              {/*<NextIntlClientProvider messages={messages}>*/}
              <Distribution/>
              {/*</NextIntlClientProvider>*/}
          </div>

          <div className={styles.subWrapper}>
              {/*<NextIntlClientProvider messages={messages}>*/}
              <PartnersNew/>
              {/*</NextIntlClientProvider>*/}
          </div>
          {/*<div className={styles.subWrapper}>*/}
          {/*    <Wrapup/>*/}
          {/*</div>*/}
      </>
  );
}
