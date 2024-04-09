import styles from './styles.module.css';
import Image from 'next/image';
import lbankLogo from '@/public/lbank-logo-yellow.webp';
import cointrLogo from '@/public/cointrwhite-logo.png';
import chartBg from '@/public/chart-bg-white.png';
import vobLogo from '@/public/vob_logo_2.png';
import {LogoPlain} from "@/ui/LogoPlain";
import crossWhite from '@/public/icons/cross-white.png';
import Link from 'next/link'
export function Partners() {
    return (
        <div>
        <div className={styles.title}>Get Started with VOB</div>
        <div className={styles.desc}>Start trading now with VOB&apos;s partner and globally verified CEX</div>
        <div className={styles.wrapper}>
            <div className={`${styles.excElem} ${styles.excElem1}`}>
                <div className={styles.vob}><LogoPlain/></div>
                <div className={styles.startElem}>
                    <Link href="https://www.lbank.com/trade/vob_usdt" target="_blank" rel="noopener noreferrer" locale={false} >
                    <button className={styles.startBtn}><span>Get Started</span></button>
                    </Link>
                </div>

                <div className={styles.exchange}><Image className="p-4" src={lbankLogo} width={200} height={100} alt="l bank logo"></Image></div>
                <div className={styles.crossElem}><Image src={crossWhite} width={25} height={25} alt="white cross"/></div>
                {/*<div className={styles.circleElem}>*/}
                {/*    <svg*/}
                {/*        version="1.1"*/}
                {/*        xmlns="http://www.w3.org/2000/svg"*/}
                {/*        viewBox="0 0 102 102"*/}
                {/*        className={styles.svgContainer}*/}
                {/*    >*/}
                {/*        <circle*/}
                {/*            className={styles.btnCircle}*/}
                {/*            cx="51"*/}
                {/*            cy="51"*/}
                {/*            r="50"*/}
                {/*            fill="none"*/}
                {/*            stroke="#fff"*/}
                {/*            strokeWidth="0"*/}
                {/*        ></circle>*/}
                {/*        <circle*/}
                {/*            className={styles.btnCircleProg}*/}
                {/*            cx="51"*/}
                {/*            cy="51"*/}
                {/*            r="50"*/}
                {/*            fill="none"*/}
                {/*            stroke="#FFD800"*/}
                {/*            strokeWidth="1"*/}
                {/*            strokeDasharray="0 351"*/}
                {/*            strokeDashoffset="0"*/}
                {/*        ></circle>*/}
                {/*    </svg>*/}
                {/*</div>*/}
                <div className={styles.circleElem}>
                    <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 102 102"
                        className={styles.svgContainer}
                    >
                        <rect
                            className={styles.btnCircle}
                            x="0"
                            y="0"
                            width="100"
                            height="100"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="0"
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
            <div className={`${styles.excElem} ${styles.excElem2}`}>
                <div className={styles.vob}><LogoPlain/></div>
                <div className={styles.startElem}>
                    <Link href="https://www.cointr.pro/en-us/spot/VOBUSDT" target="_blank" rel="noopener noreferrer" locale={false}>
                    <button className={styles.startBtn}><span>Get Started</span></button>
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
                            x="0"
                            y="0"
                            width="100"
                            height="100"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="0"
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
        </div>
        </div>
    )
}