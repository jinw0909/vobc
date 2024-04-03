import styles from './styles.module.css';
import Image from 'next/image';
import paperPic from '@/public/whitepaper.png';
import contractPic from '@/public/smartcontract.png';
import Link from "next/link";
export const Whitepaper = () => {
    return (
        <div className={styles.whitepaperWrapper}>
            <div className={styles.whitepaperInner}>

                <div className={`${styles.whitepaperText}`}>
                    <div className={styles.whitepaperTitle}>White Paper</div>
                    <div className={styles.whitepaperDesc}>View the VOB white paper</div>
                    <button className={styles.whitepaperBtn}>
                        <Link href="/VOB_whitepaper.pdf" target="_blank" rel="noopener noreferrer" locale={false}>View</Link>
                    </button>
                </div>
                <div className={`${styles.whitepaperImg}`}>
                    <Image
                        src={paperPic}
                        // width={250}
                        // height={250}
                        fill={true}
                        objectFit="contain"
                        alt="whitepaper image"/>
                </div>
                {/*<div className={`${styles.whitepaperDetail}`}>*/}
                {/*    <button className={styles.whitepaperBtn}>*/}
                {/*        <Link href="/VOB_whitepaper.pdf" target="_blank" rel="noopener noreferrer" locale={false}>View</Link>*/}
                {/*    </button>*/}
                {/*</div>*/}
            </div>
            <div className={styles.hrLine}></div>
            <div className={styles.whitepaperInner}>
                <div className={`${styles.whitepaperImg} ${styles.contractImg}`}>
                    <Image src={contractPic}
                        // width={250}
                        // height={250}
                           fill={true}
                           objectFit="contain"
                           alt="whitepaper image"/>
                </div>
                <div className={`${styles.whitepaperText} ${styles.contractText}`}>
                    <div className={`${styles.whitepaperTitle}`}>Smart Contract</div>
                    <div className={styles.whitepaperDesc}>View the VOB smart contract account</div>
                    <button className={styles.whitepaperBtn}>
                        <Link
                            href="https://bscscan.com/address/0xD2AcB5BC4851536d64D8DE36E9bC3aeaBa88dD8A"
                            target="_blank"
                            rel="noopener noreferrer"
                            locale={false}
                        >Check</Link>
                    </button>
                </div>
            </div>
        </div>
    )
}