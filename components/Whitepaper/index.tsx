'use client';
import styles from './styles.module.css';
import Image from 'next/image';
import paperPic from '@/public/whitepaper.png';
// import contractPic from '@/public/smartcontract.png';
import Link from "next/link";
import { useTranslations} from "next-intl";
import {useState} from "react";
export const Whitepaper = () => {

    const [showPaper, setShowPaper] = useState(false);
    const [showContract, setShowContract] = useState(false);

    const handleShowPaper = () => {
        if (showPaper) {
            setShowPaper(false);
        } else {
            setShowPaper(true);
        }
    }

    const handleShowContract = () => {
        if (showContract) {
            setShowContract(false);
        } else {
            setShowContract(true);
        }
    }

    const t = useTranslations('whitepaper');
    return (
        <div className={styles.whitepaperWrapper}>
            {/*<div className={styles.vtLine}></div>*/}
            <div className={`${styles.whitepaperInner} ${styles.whitePaper} ${showPaper ? styles.show : ''}`}
                 onClick={() => {
                     handleShowPaper()
                 }}>
                <div className={`${styles.whitepaperText}`}>
                    <div className={styles.whitepaperTitle}>White Paper</div>
                    <div className={styles.whitepaperDesc}>{t('whitepaper')}</div>
                    <button className={styles.whitepaperBtn}>
                        <Link href="/VOB_whitepaper.pdf" target="_blank" rel="noopener noreferrer" locale={false}
                        >{t('viewbtn')}</Link>
                    </button>
                </div>
                <div className={`${styles.whitepaperImg}`}>
                    <Image
                        src={paperPic}
                        fill={true}
                        style={{objectFit: "contain"}}
                        alt="whitepaper image"/>
                </div>
                <span className={`${styles.borderTop} ${showPaper ? styles.show : ''}`} ></span>
            </div>
        </div>
    )
}