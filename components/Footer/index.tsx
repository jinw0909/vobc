import xLogo from '@/public/x-logo-white.png';
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
                        <NavigationLink href="/terms">{t('terms')}</NavigationLink>
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
                          rel="noopener noreferrer" locale={false}
                    >
                        <div className={`${styles.snsLogo} ${styles.footerElem}`}>
                            <Image className={styles.snsImg}
                                src={xLogo}
                                width={20}
                                height={20}
                                alt="x.com logo"
                            />
                            <span>X.com</span>
                        </div>
                    </Link>
                    <Link href="https://medium.com/@risingxofficial" target="_blank"
                          rel="noopener noreferrer" locale={false}
                    >
                        <div className={`${styles.snsLogo} ${styles.footerElem}`}>
                            <Image className={styles.snsImg}
                                src={mediumLogo}
                                width={20}
                                height={20}
                                alt="medium logo"
                            />
                            <span>Medium</span>
                        </div>
                    </Link>
                </div>
            </div>
        </footer>
    )
}