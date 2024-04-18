import styles from './styles.module.css';
import Image from 'next/image';
import paperPic from '@/public/whitepaper.png';
import contractPic from '@/public/smartcontract.png';
import Link from "next/link";
import {getTranslations} from "next-intl/server";
export const Whitepaper = async () => {
    const t = await getTranslations('whitepaper');
    return (
        <div className={styles.whitepaperWrapper}>
            <div className={styles.vtLine}></div>
            <div className={styles.whitepaperInner}>
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
                        style={{objectFit:"contain"}}
                        alt="whitepaper image"/>
                </div>
            </div>
            <div className={styles.hrLine}></div>
            <div className={`${styles.whitepaperInner} ${styles.smartContract}`}>
                <div className={`${styles.whitepaperImg} ${styles.contractImg}`}>
                    <Image src={contractPic}
                           fill={true}
                           style={{objectFit: "contain"}}
                           alt="whitepaper image"/>
                </div>
                <div className={`${styles.whitepaperText} ${styles.contractText}`}>
                    <div className={`${styles.whitepaperTitle}`}>Smart Contract</div>
                    <div className={styles.whitepaperDesc}>{t('smartcontract')}</div>
                    <button className={styles.whitepaperBtn}>
                        <Link
                            href="https://bscscan.com/address/0xD2AcB5BC4851536d64D8DE36E9bC3aeaBa88dD8A"
                            target="_blank"
                            rel="noopener noreferrer"
                            locale={false}
                        >{t('checkbtn')}</Link>
                    </button>
                </div>
            </div>
            <div className={styles.vtLine}></div>
        </div>
    )
}