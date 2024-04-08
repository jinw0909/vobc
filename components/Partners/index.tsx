import styles from './styles.module.css';
import Image from 'next/image';
import lbankLogo from '@/public/lbank-logo.png';
import cointrLogo from '@/public/cointrwhite-logo.png';
import chartBg from '@/public/chart-bg-white.png';
import vobLogo from '@/public/vob_logo_2.png';
import crossWhite from '@/public/icons/cross-white.png';
export function Partners() {
    return (
        <div className={styles.wrapper}>
            <Image className={styles.bg} src={chartBg} fill={true} objectFit="contain" objectPosition="center" alt="background image" />
            <div className={styles.excElem1}>
                <div><Image src={vobLogo} width={32} height={100} alt="vob logo"/></div>
                <div className={styles.btnElem}><button>Get Started</button></div>
                <div className={styles.crossElem}><Image src={crossWhite} width={25} height={25} alt="white cross"/></div>
                <div><Image src={lbankLogo} width={200} height={100} alt="l bank logo"></Image></div>
            </div>
            <div className={styles.excElem2}>
                <div><Image src={vobLogo} width={32} height={100} alt="vob logo"/></div>
                <div className={styles.btnElem}><button>Get Started</button></div>
                <div className={styles.crossElem}><Image src={crossWhite} width={25} height={25} alt="white cross"/></div>
                <div><Image src={cointrLogo} width={200} height={100} alt="coin t r logo"></Image></div>
            </div>
        </div>
    )
}