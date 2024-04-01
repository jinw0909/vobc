'use client';
import styles from './styles.module.css'
import {useState, useEffect} from "react";
// import { useRouter, usePathname } from "next/navigation";
import { useRouter, usePathname} from "@/navigation";
import triPic from '@/public/icons/triangle-icon-white.png';
import rvtriPic from '@/public/icons/triangle-icon-white-rv.png';
import Image from 'next/image';
// import Link from 'next/link'
import { NavigationLink} from "@/ui/NavigationLink";

export const MobileNav = ({click, lang, onClick} : {click : any, lang: string, onClick : any}) => {

    const router = useRouter();
    const pathName = usePathname();

    const [language, setLanguage] = useState(false);
    const [selectedLang, setSelectedLang] = useState(lang?.toString());
    const [currentPage, setCurrentPage] = useState('');

    // const handleLinkClick = (page : any) => {
    //     onClick();
    //     setCurrentPage(page);
    // }

    useEffect(() => {
        router.replace(pathName, {locale : selectedLang});
    }, [selectedLang]);

    // useEffect(() => {
    //     setCurrentPage(pathname.split('/')[2] || '');
    // }, []);

    useEffect(() => {
        if (!click) {
            setLanguage(false);
        }
    }, [click]);

    return (
        <div className={`${click ? styles.clicked : ''} ${styles.mobileNav}`}>
            <ul className={styles.navWrapper}>
                <li className={styles.navElem}>
                    <NavigationLink href="/" onClick={onClick}>Home</NavigationLink>
                </li>
                <li className={styles.navElem}>
                    <NavigationLink href="/about" onClick={onClick}>About</NavigationLink>
                </li>
                <li className={styles.navElem}>
                    <NavigationLink href="/devs" onClick={onClick}>Devs</NavigationLink>
                </li>
                <li className={styles.navElem}>
                    <NavigationLink href="/team" onClick={onClick}>Team</NavigationLink>
                </li>
                <li className={styles.navElem}>
                    <NavigationLink href="/news" onClick={onClick}>News</NavigationLink>
                </li>
                <li className={`${styles.navElem} 
                    flex justify-center items-center gap-2 cursor-pointer`}
                    onClick={() => {setLanguage(!language)}}
                >
                    <span>Select Language</span>
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
                        className={`${styles.langChild} ${lang == 'en' ? styles.current : ''}`}
                        onClick={() => {setSelectedLang('en')}}
                    >English</span>
                    <span
                        className={`${styles.langChild} ${lang == 'jp' ? styles.current : ''}`}
                        onClick={() => {setSelectedLang('jp')}}
                    >Japanese</span>
                    <span
                        className={`${styles.langChild} ${lang == 'cn' ? styles.current : ''}`}
                        onClick={() => {setSelectedLang('cn')}}
                    >Chinese</span>
                </li>
            </ul>
        </div>
    )
}