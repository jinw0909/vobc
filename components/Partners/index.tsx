import styles from './styles.module.css';
import Image from 'next/image';
import lbankLogo from '@/public/lbank-logo.png';
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
        <div className={styles.wrapper}>
            <div className={`${styles.excElem}`}>
                <div className={styles.vob}><LogoPlain/></div>

                <div className={styles.startElem}>
                    <Link href="https://www.lbank.com/trade/vob_usdt" target="_blank" rel="noopener noreferrer" locale={false} >
                    <button className={styles.startBtn}><span>Get Started</span></button>
                    </Link>
                </div>

                <div className={styles.exchange}><Image src={lbankLogo} width={200} height={100} alt="l bank logo"></Image></div>
                <div className={styles.crossElem}><Image src={crossWhite} width={25} height={25} alt="white cross"/></div>
                <div className={styles.circleElem}>
                    <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 102 102"
                        className={styles.svgContainer}
                    >
                        <circle
                            className={styles.btnCircle}
                            cx="51"
                            cy="51"
                            r="50"
                            fill="none"
                            stroke="#bbb"
                            strokeWidth="1"
                        ></circle>
                        <circle
                            className={styles.btnCircleProg}
                            cx="51"
                            cy="51"
                            r="50"
                            fill="none"
                            stroke="#00FCFF"
                            strokeWidth="1"
                            strokeDasharray="0 351"
                            strokeDashoffset="0"
                        ></circle>
                    </svg>
                </div>
            </div>
            <div className={`${styles.excElem}`}>
                <div className={styles.vob}><LogoPlain/></div>
                <div className={styles.startElem}>
                    <Link href="https://www.cointr.pro/en-us/spot/VOBUSDT" target="_blank" rel="noopener noreferrer" locale={false}>
                    <button className={styles.startBtn}><span>Get Started</span></button>
                    </Link>
                </div>
                <div className={styles.exchange}><Image className="pt-2" src={cointrLogo} width={200} height={100} alt="coin t r logo"></Image></div>
                <div className={styles.crossElem}><Image src={crossWhite} width={25} height={25} alt="white cross"/></div>
                <div className={styles.circleElem}>
                    <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 102 102"
                        className={styles.svgContainer}
                    >
                        <circle
                            className={styles.btnCircle}
                            cx="51"
                            cy="51"
                            r="50"
                            fill="none"
                            stroke="#bbb"
                            strokeWidth="1"
                        ></circle>
                        <circle
                            className={styles.btnCircleProg}
                            cx="51"
                            cy="51"
                            r="50"
                            fill="none"
                            stroke="#00FCFF"
                            strokeWidth="1"
                            strokeDasharray="0 350"
                            strokeDashoffset="0"
                        ></circle>
                    </svg>
                </div>
            </div>
        </div>
        </div>
    )
}