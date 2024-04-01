import styles from './styles.module.css'
// import Link from 'next/link';
import { Link } from "@/navigation";
import {usePathname, useRouter} from "next/navigation";
import {useState, useEffect} from "react";
import { useTranslations } from "next-intl";
import { NavigationLink } from "@/ui/NavigationLink";

export const Nav = ({lang} : {lang : string}) => {
    const t = useTranslations('nav');

    return (
        <div className={styles.navbarWrapper}>
            <ul className={styles.navbar}>
                <li><NavigationLink href="/">{t('home')}</NavigationLink></li>
                <li><NavigationLink href="/about">{t('about')}</NavigationLink></li>
                <li><NavigationLink href="/devs">{t('devs')}</NavigationLink></li>
                <li><NavigationLink href="/team">{t('team')}</NavigationLink></li>
                <li><NavigationLink href="/news">{t('news')}</NavigationLink></li>
            </ul>
        </div>

    )
}