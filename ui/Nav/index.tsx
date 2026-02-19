'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './styles.module.css';
import { useTranslations } from 'next-intl';
import { NavigationLink } from '@/ui/NavigationLink';

export const Nav = () => {
    const t = useTranslations('nav');
    const pathname = usePathname();

    // locale 제거
    const segments = pathname.split('/').filter(Boolean);
    const pathWithoutLocale =
        segments.length > 0 ? `/${segments.slice(1).join('/')}` : '/';

    const isHome = pathWithoutLocale === '/';

    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    // 🔥 wrapper 상태 계산
    const wrapperClass = isHome
        ? styles.navHome
        : open
            ? styles.navOpen
            : styles.navClosed;

    return (
        <>
            {!isHome && (
                <button
                    type="button"
                    className={`${styles.hamburgerButton} ${open ? styles.open : ''}`}
                    onClick={() => setOpen(v => !v)}
                >
                    <div className={styles.hamburgerInner}>
                        <span className={`${styles.hamburgerLine} ${styles.firstLine}`}/>
                        <span className={`${styles.hamburgerLine} ${styles.secondLine}`}/>
                        <span className={`${styles.hamburgerLine} ${styles.thirdLine}`}/>
                    </div>
                </button>
            )}

            <div className={`${styles.navbarWrapper} ${wrapperClass}`}>
                <ul className={`${styles.navbar} ${open ? styles.open : ''}`}>
                    <NavigationLink href="/about">{t('about')}</NavigationLink>
                    <NavigationLink href="/blog">{t('blog')}</NavigationLink>
                    <NavigationLink href="/devs">{t('devs')}</NavigationLink>
                    <NavigationLink href="/team">{t('team')}</NavigationLink>
                    <NavigationLink href="/news">{t('news')}</NavigationLink>
                </ul>
            </div>
        </>
    );
};