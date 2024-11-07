'use client';
import styles from './styles.module.css';
import Image from 'next/image';
import lbankLogo from '@/public/exchange/lbank-logo-yellow.webp';
import cointrLogo from '@/public/exchange/cointrwhite-logo.png';
import chartBg from '@/public/chart-bg-white.png';
import vobLogo from '@/public/vob_logo_2.png';
import {LogoPlain} from "@/ui/LogoPlain";
import crossWhite from '@/public/icons/cross-white.png';
import Link from 'next/link'
import { useTranslations} from "next-intl";
import {useState} from "react";
export function Partners() {

    const [lbank, setLbank] = useState(false);
    const [cointr, setCointr] = useState(false);
    const t = useTranslations('partners');

    const clickLbank = () => {
        setLbank(!lbank);
        setCointr(false);
    }
    const clickCointr = () => {
        setCointr(!cointr);
        setLbank(false);
    }

    return (
        <div className={styles.partnersWrapper}>
        <div className={styles.title}>{t('title')}</div>
        <div className={styles.desc}>{t('subtitle')}</div>
        <div className={styles.wrapper}>
            <div className={`${styles.elemWrapper} ${lbank ? styles.hover : ''}`}
                onClick={clickLbank}>
                <div className={`${styles.excElem} ${styles.excElem1}`}>
                    <div className={styles.vob}><LogoPlain/></div>
                    <div className={styles.startElem}>
                        <Link href="https://www.lbank.com/trade/vob_usdt" target="_blank" rel="noopener noreferrer" locale={false} >
                        <button className={styles.startBtn}><span>{t('startbtn')}</span></button>
                        </Link>
                    </div>
                    <div className={styles.exchange}><Image className="p-4" src={lbankLogo} width={200} height={100} alt="l bank logo"></Image></div>
                    <div className={styles.crossElem}><Image src={crossWhite} width={25} height={25} alt="white cross"/></div>
                    <div className={styles.circleElem}>
                        <svg
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 102 102"
                            className={styles.svgContainer}
                        >
                            <rect
                                className={styles.btnCircle}
                                x="0.5"
                                y="0.5"
                                width="101"
                                height="101"
                                fill="none"
                                stroke="#999"
                                strokeWidth="0.25"
                                rx="10" // Border radius for the rectangle's x-axis
                                ry="10" // Border radius for the rectangle's y-axis
                            ></rect>
                            <rect
                                className={styles.btnCircleProg}
                                x="0.5"
                                y="0.5"
                                width="101"
                                height="101"
                                fill="none"
                                stroke="#FFD800"
                                strokeWidth="1"
                                strokeDasharray="0 400"
                                strokeDashoffset="0"
                                rx="10" // Border radius for the rectangle's x-axis
                                ry="10" // Border radius for the rectangle's y-axis
                            ></rect>
                        </svg>
                    </div>
                </div>
                <div className={styles.descElem}>
                    {/*Since its launch at 2004, CoinTrPro has maintained its position as the most stable and reliable cryptocurrency exchange of the Republic of Turkey.*/}
                    {/*VOB as been listed in CoinTrPro since 2018 and since then the partnership is growing in its efficiency and its scale.*/}
                    {/*CoinTRPro held multiple events for the VOB coin which we are proud to let our community informed.*/}
                    {t('lbank')}
                </div>
            </div>
            <div className={`${styles.elemWrapper} ${cointr ? styles.hover : ''}`}
                onClick={clickCointr}>
                <div className={`${styles.excElem} ${styles.excElem2}`}>
                    <div className={styles.vob}><LogoPlain/></div>
                    <div className={styles.startElem}>
                        <Link href="https://www.cointr.pro/en-us/spot/VOBUSDT" target="_blank" rel="noopener noreferrer" locale={false}>
                            <button className={styles.startBtn}><span>{t('startbtn')}</span></button>
                        </Link>
                    </div>
                    <div className={styles.exchange}><Image className="p-2" src={cointrLogo} width={200} height={100} alt="coin t r logo"></Image></div>
                    <div className={styles.crossElem}><Image src={crossWhite} width={25} height={25} alt="white cross"/></div>
                    <div className={styles.circleElem}>
                        <svg
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 102 102"
                            className={styles.svgContainer}
                        >
                            <rect
                                className={styles.btnCircle}
                                x="0.5"
                                y="0.5"
                                width="101"
                                height="101"
                                fill="none"
                                stroke="#999"
                                strokeWidth="0.25"
                                rx="10" // Border radius for the rectangle's x-axis
                                ry="10" // Border radius for the rectangle's y-axis
                            ></rect>
                            <rect
                                className={styles.btnCircleProg}
                                x="0.5"
                                y="0.5"
                                width="101"
                                height="101"
                                fill="none"
                                stroke="#03D56F"
                                strokeWidth="1"
                                strokeDasharray="0 400"
                                strokeDashoffset="0"
                                rx="10" // Border radius for the rectangle's x-axis
                                ry="10" // Border radius for the rectangle's y-axis
                            ></rect>
                        </svg>
                    </div>
                </div>
                <div className={styles.descElem}>
                    {t('cointrpro')}
                    {/*Since its launch at 2004, CoinTrPro has maintained its position as the most stable and reliable cryptocurrency exchange of the Republic of Turkey.*/}
                    {/*VOB as been listed in CoinTrPro since 2018 and since then the partnership is growing in its efficiency and its scale.*/}
                    {/*CoinTRPro held multiple events for the VOB coin which we are proud to let our community informed.*/}
                </div>
            </div>
        </div>
        </div>
    )
}