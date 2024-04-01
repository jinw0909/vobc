import Image from "next/image";
import styles from './styles.module.css'
import Link from 'next/link';
import { About } from "@/components/About";
import {DevsMain} from "@/components/DevsMain";
import {getTranslations} from "next-intl/server";
import {useTranslations} from "next-intl";


export default async function Page({params : { locale }} : {params : {locale : string}}) {
  // const intl = await getDictionary(lang) //en
  // const t = await getTranslations('main');
  const t = await getTranslations('main');
  return (
      <>
          <main className={styles.mainWrapper}>
              <div className={styles.mainText}>
                  {/*<div className={`${styles.fadeInAnimation}`}>{intl.main.title_0}</div>*/}
                  {/*<div className={`${styles.delayedAnimation} opacity-0`}>{intl.main.title_1}</div>*/}
                  <div className={`${styles.fadeInAnimation}`}>{t('title_0')}</div>
                  <div className={`${styles.delayedAnimation} opacity-0`}>{t('title_1')}</div>
              </div>
              <div className={`${styles.subText} ${styles.moreDelayedAnimation} opacity-0`}>
                  <div>{t('subtitle_0')}<br/>{t('subtitle_1')}</div>
                  <div>{t('subtitle_2')}</div>
              </div>
          </main>
          <div className={styles.subWrapper}>
              <About/>
          </div>
          <div className={styles.subWrapper}>
              <DevsMain lang={locale}/>
          </div>
      </>
  );
}
