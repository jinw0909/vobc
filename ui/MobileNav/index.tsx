'use client';
import styles from './styles.module.css'
import {useState, useEffect} from "react";
// import { useRouter, usePathname } from "next/navigation";
import { useRouter, usePathname} from "@/navigation";
import triPic from '@/public/icons/triangle-icon-white.png';
import rvtriPic from '@/public/icons/triangle-icon-white-rv.png';
import Image from 'next/image';
// import Link from 'next/link'
import { NavigationLink } from "@/ui/NavigationLink";
import {useTranslations, useLocale} from "next-intl";

export const MobileNav = ({click, onClick} : {click : any, onClick : any}) => {

    const t = useTranslations('nav');
    const locale = useLocale();

    const router = useRouter();
    const pathName = usePathname();

    const [language, setLanguage] = useState(false);
    const [selectedLang, setSelectedLang] = useState(locale);

    useEffect(() => {
        router.replace(pathName, {locale : selectedLang});
    }, [selectedLang]);

    useEffect(() => {
        if (!click) {
            setLanguage(false);
        }
    }, [click]);

    return (
        <div className={`${click ? styles.clicked : ''} ${styles.mobileNav}`}>
            <ul className={styles.navWrapper}>
                <li className={styles.navElem}>
                    <NavigationLink href="/" onClick={onClick}>{t('home')}</NavigationLink>
                </li>
                <li className={styles.navElem}>
                    <NavigationLink href="/about" onClick={onClick}>{t('about')}</NavigationLink>
                </li>
                <li className={styles.navElem}>
                    <NavigationLink href="/devs" onClick={onClick}>{t('devs')}</NavigationLink>
                </li>
                <li className={styles.navElem}>
                    <NavigationLink href="/team" onClick={onClick}>{t('team')}</NavigationLink>
                </li>
                <li className={styles.navElem}>
                    <NavigationLink href="/news" onClick={onClick}>{t('news')}</NavigationLink>
                </li>
                <li className={`${styles.navElem} 
                    flex justify-center items-center gap-2 cursor-pointer`}
                    onClick={() => {setLanguage(!language)}}
                >
                    <span>{t('language')}</span>
                    {
                        language ?
                        <Image className={`${styles.langArrow}`}
                               src={triPic} width={12} height={12} alt="triangle up"/>
                        : <Image className={`${styles.langArrow}`}
                                 src={rvtriPic} width={12} height={12} alt="triangle down"/>
                    }
                </li>
                <li className={`${styles.navElem} 
                    ${styles.langElem} 
                    ${language ? styles.lang : ''}`}>
                    <span
                        className={`${styles.langChild} ${locale == 'en' ? styles.current : ''}`}
                        onClick={() => {setSelectedLang('en')}}
                    >English</span>
                    <span
                        className={`${styles.langChild} ${locale == 'jp' ? styles.current : ''}`}
                        onClick={() => {setSelectedLang('jp')}}
                    >日本語</span>
                    <span
                        className={`${styles.langChild} ${locale == 'cn' ? styles.current : ''}`}
                        onClick={() => {setSelectedLang('cn')}}
                    >汉文</span>
                </li>
            </ul>
        </div>
    )
}