import styles from './styles.module.css'
// import Link from 'next/link';
import { Link } from "@/navigation";
import {usePathname, useRouter} from "next/navigation";
import {useState, useEffect} from "react";
import { useTranslations } from "next-intl";
import { NavigationLink } from "@/ui/NavigationLink";

export const Nav = () => {
    const t = useTranslations('nav');

    return (
        <div className={styles.navbarWrapper}>
            <ul className={styles.navbar}>
                <NavigationLink href="/" pseudo={true}>{t('home')}</NavigationLink>
                <NavigationLink href="/about" pseudo={true}>{t('about')}</NavigationLink>
                <NavigationLink href="/devs" pseudo={true}>{t('devs')}</NavigationLink>
                <NavigationLink href="/team" pseudo={true}>{t('team')}</NavigationLink>
                <NavigationLink href="/news" pseudo={true}>{t('news')}</NavigationLink>
            </ul>
        </div>

    )
}