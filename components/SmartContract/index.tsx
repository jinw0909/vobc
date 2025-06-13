'use client';
import styles from './styles.module.css';
import Image from 'next/image';
import paperPic from '@/public/whitepaper.png';
import contractPic from '@/public/smartcontract.png';
import Link from "next/link";
import { useTranslations} from "next-intl";
import {useState} from "react";
export const SmartContract = () => {

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
            <div className={`${styles.whitepaperInner} ${styles.smartContract} ${showContract ? styles.show : ''}`}
                 onClick={()=>{ handleShowContract()} }>
                <div className={`${styles.whitepaperText} ${styles.contractText}`}>
                    <div className={`${styles.whitepaperTitle}`}>Smart Contract</div>
                    <div className={styles.whitepaperDesc}>{t('smartcontract')}</div>
                    <button className={styles.whitepaperBtn}>
                        <Link
                            href="https://bscscan.com/address/0xD2AcB5BC4851536d64D8DE36E9bC3aeaBa88dD8A"
                            target="_blank"
                            rel="noopener noreferrer"
                            locale={undefined}
                        >{t('checkbtn')}</Link>
                    </button>
                </div>
                <div className={`${styles.whitepaperImg} ${styles.contractImg}`}>
                    <Image src={contractPic}
                           fill={true}
                           style={{objectFit: "contain"}}
                           alt="whitepaper image"/>
                </div>
            </div>
            {/*<div className={styles.vtLine}></div>*/}
        </div>
    )
}