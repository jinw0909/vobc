import styles from './styles.module.css'
import {LogoSub} from "@/ui/LogoSub";
import Image from 'next/image';
import mediumLogo from '@/public/medium_logo_white.png';
import xLogo from '@/public/x-logo-white.png';
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
                            <Image className={styles.snsImg}
                                src={xLogo}
                                width={16}
                                height={16}
                                alt="x.com logo"
                            />
                            <span>X.com</span>
                        </div>
                    </Link>
                    <Link href="https://medium.com/@risingxofficial" target="_blank"
                          rel="noopener noreferrer" locale={undefined}
                    >
                        <div className={`${styles.snsLogo} ${styles.footerElem}`}>

                                <Image className={styles.snsImg}
                                       src={mediumLogo}
                                       width={16}
                                       height={16}
                                       alt="medium logo"
                                />
                                <span>Medium</span>
                        </div>
                    </Link>
                </div>
            </div>
            <div className={styles.footerLevel}>
                <div className={styles.levelLeft}></div>
                <div className={styles.levelRight}>
                    <div className={styles.footerElem}>
                        <NavigationLink href="/terms">{t('terms')}</NavigationLink>
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