import Link from 'next/link';
import xLogo from '@/public/x-logo-white.png';
import mediumLogo from '@/public/medium_logo_white.png';
import Image from 'next/image';
import styles from './styles.module.css';
import {LogoSub} from "@/ui/LogoSub";
import {NavigationLink} from "@/ui/NavigationLink";

export const Footer = async ({lang} : {lang : string}) => {
    return (
        <footer className={styles.footer}>
            <div className={`${styles.footerWrapper}`}>
                <div className={styles.footerLeft}>
                    <LogoSub />
                    <div className={styles.footerElem}>
                        <NavigationLink href="/terms">Terms of Use</NavigationLink>
                    </div>
                    <div className={styles.footerElem}>
                        <NavigationLink href="/privacy">Privacy Policy</NavigationLink>
                    </div>
                    <div className={styles.footerElem}>
                        <NavigationLink href="/cookies">Cookies Policy</NavigationLink>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className={`${styles.snsLogo} ${styles.footerElem}`}>
                        <Image className={styles.snsImg}
                            src={xLogo}
                            width={20}
                            height={20}
                            alt="x.com logo"
                        />
                        <span>X.com</span>
                    </div>
                    <div className={`${styles.snsLogo} ${styles.footerElem}`}>
                        <Image className={styles.snsImg}
                            src={mediumLogo}
                            width={20}
                            height={20}
                            alt="medium logo"
                        />
                        <span>Medium</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}