'use client';

import styles from './styles.module.css'
import {getDictionary} from "@/app/[lang]/dictionaries";
import Link from 'next/link';
import {usePathname} from "next/navigation";
import {useState, useEffect} from "react";

export const Nav = ({dict, lang}) => {
    const pathName = usePathname();
    const current = pathName.split('/')[2];
    // console.log('currentPath: ', current);
    return (
        <div className={styles.navbarWrapper}>
            <ul className={styles.navbar}>
                <li className={`${current == undefined ? styles.currentItem : ''}`}>
                    <Link href={`/${lang}`}>{dict.nav.home}</Link>
                </li>
                <li className={`${current == 'about' ? styles.currentItem : ''}`}>
                    <Link href={`/${lang}/about`}>{dict.nav.about}</Link>
                </li>
                <li className={`${current == 'devs' ? styles.currentItem : ''}`}>
                    <Link href={`/${lang}/devs`}>{dict.nav.devs}</Link>
                </li>
                <li>
                    <Link href={`/${lang}/team`}>{dict.nav.team}</Link>
                </li>
                <li>
                    <Link href={`/${lang}/news`}>{dict.nav.news}</Link>
                </li>
            </ul>
        </div>

    )
}