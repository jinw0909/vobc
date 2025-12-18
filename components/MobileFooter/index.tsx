import styles from './styles.module.css'
import {LogoSub} from "@/ui/LogoSub";
import Image from 'next/image';
import mediumLogo from '@/public/medium_logo_white.png';
import xLogo from '@/public/x_logo_white.png';
import { NavigationLink} from "@/ui/NavigationLink";
import {getTranslations} from "next-intl/server";
import Link from "next/link";

export const MobileFooter  = async () => {

    const t = await getTranslations('nav');

    return (
        <footer className={styles.footer}>
            <div className={styles.footerLevel}>
                <div className={styles.levelLeft}>
                    <LogoSub />
                </div>
                <div className={styles.levelRight}>
                    <Link href="https://x.com/VOBCOIN" target="_blank"
                          rel="noopener noreferrer" locale={undefined}
                    >
                        <div className={`${styles.snsLogo} ${styles.footerElem}`}>
                            <span className={`${styles.iconX} ${styles.snsIcon}`}></span>
                            <span>X.com</span>
                        </div>
                    </Link>
                    <Link href="https://medium.com/@risingxofficial" target="_blank"
                          rel="noopener noreferrer" locale={undefined}
                    >
                        <div className={`${styles.snsLogo} ${styles.footerElem}`}>
                            <span className={`${styles.iconMedium} ${styles.snsIcon}`}></span>
                            <span>Medium</span>
                        </div>
                    </Link>
                </div>
            </div>
            <div className={styles.footerLevel}>
                <div className={styles.levelLeft}></div>
                <div className={styles.levelRight}>
                    <div className={styles.footerElem}>
                        <NavigationLink href="/use">{t('use')}</NavigationLink>
                    </div>
                </div>
            </div>
            <div className={styles.footerLevel}>
                <div className={styles.levelLeft}></div>
                <div className={styles.levelRight}>
                    <div className={styles.footerElem}>
                        <NavigationLink href="/privacy">{t('privacy')}</NavigationLink>
                    </div>
                    <div className={styles.footerElem}>
                        <NavigationLink href="/cookies">{t('cookies')}</NavigationLink>
                    </div>
                </div>
            </div>
        </footer>
    )
}