import Image from "next/image";
import styles from './styles.module.css'
import Link from 'next/link';
import { Locale, getDictionary } from "@/app/[lang]/dictionaries";
import { About } from "@/app/components/About";
import {DevsMain} from "@/app/components/DevsMain";

type Props = {
      params : {
          lang: Locale
      }
  }

export default async function Page({params : { lang }} : Props) {
  const intl = await getDictionary(lang) //en
  return (
      <>
          <main className={styles.mainWrapper}>
              <div className={styles.mainText}>
                  <div className={`${styles.fadeInAnimation}`}>{intl.main.title_0}</div>
                  <div className={`${styles.delayedAnimation} opacity-0`}>{intl.main.title_1}</div>
              </div>
              <div className={`${styles.subText} ${styles.moreDelayedAnimation} opacity-0`}>
                  <div>{intl.main.subtitle_0}<br/>{intl.main.subtitle_1}</div>
                  <div>{intl.main.subtitle_2}</div>
              </div>
          </main>
          <div className={styles.subWrapper}>
              <About lang={lang}/>
          </div>
          <div className={styles.subWrapper}>
              <DevsMain lang={lang}/>
          </div>
      </>
  );
}
