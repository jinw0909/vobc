import xLogo from '@/public/x_logo_white.png';
import mediumLogo from '@/public/medium_logo_white.png';
import Image from 'next/image';
import styles from './styles.module.css';
import {LogoSub} from "@/ui/LogoSub";
import {NavigationLink} from "@/ui/NavigationLink";
import {getTranslations} from "next-intl/server";
import Link from "next/link";

export const Footer = async () => {

    const t = await getTranslations('nav');

    return (
        <footer className={styles.footer}>
            <div className={`${styles.footerWrapper}`}>
                <div className={styles.footerLeft}>
                    <LogoSub />
                    <div className={styles.footerElem}>
                        <NavigationLink href="/use">{t('use')}</NavigationLink>
                    </div>
                    <div className={styles.footerElem}>
                        <NavigationLink href="/privacy">{t('privacy')}</NavigationLink>
                    </div>
                    <div className={styles.footerElem}>
                        <NavigationLink href="/cookies">{t('cookies')}</NavigationLink>
                    </div>
                </div>
                <div className="flex gap-4">
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
        </footer>
    )
}