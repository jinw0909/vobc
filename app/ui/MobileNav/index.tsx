'use client';
import styles from './styles.module.css'
import {useState, useEffect} from "react";
import { useRouter, usePathname } from "next/navigation";
import triPic from '@/public/icons/triangle-icon-white.png';
import rvtriPic from '@/public/icons/triangle-icon-white-rv.png';
import Image from 'next/image';
import Link from 'next/link'

export const MobileNav = ({click, lang, onClick}) => {

    const router = useRouter();
    const pathname = usePathname();

    const [language, setLanguage] = useState(false);
    const [selectedLang, setSelectedLang] = useState(lang?.toString());
    const [currentPage, setCurrentPage] = useState('');

    const handleLinkClick = (page) => {
        onClick();
        setCurrentPage(page);
    }

    useEffect(() => {
        const segments = pathname.split('/');
        segments[1] = selectedLang;
        const newPathname = segments.join('/');
        router.replace(newPathname);
    }, [selectedLang]);

    useEffect(() => {
        setCurrentPage(pathname.split('/')[2] || '');
    }, []);

    useEffect(() => {
        console.log("isClick: ", click);
        if (!click) {
            setLanguage(false);
        }
    }, [click]);

    return (
        <div className={`${click ? styles.clicked : ''} ${styles.mobileNav}`}>
            <ul className={styles.navWrapper}>
                <Link
                    className={`${styles.navElem} ${language ? styles.lang : ''}
                    ${currentPage == '' ? styles.current : ''}`}
                    href={`/${lang}`}
                    onClick={() => handleLinkClick('')}
                >
                    <li>Home</li>
                </Link>
                <Link
                    className={`${styles.navElem} ${language ? styles.lang : ''}
                        ${currentPage == 'about' ? styles.current : ''}`}
                    href={`/${lang}/about`}
                    onClick={() => handleLinkClick('about')}
                >
                    <li onClick={onClick}>About</li>
                </Link>
                <Link
                    className={`${styles.navElem} ${language ? styles.lang : ''}
                        ${currentPage == 'devs' ? styles.current : ''}`}
                    href={`/${lang}/devs`}
                    onClick={() => handleLinkClick('devs')}
                >
                    <li onClick={onClick}>Devs</li>
                </Link>
                <Link
                    className={`${styles.navElem} ${language ? styles.lang : ''}
                        ${currentPage == 'team' ? styles.current : ''}`}
                    href={`/${lang}/team`}
                    onClick={() => handleLinkClick('team')}
                >
                    <li onClick={onClick}>Team</li>
                </Link>
                <Link
                    className={`${styles.navElem} ${language ? styles.lang : ''}
                        ${currentPage == 'news' ? styles.current : ''}`}
                    href={`/${lang}/news`}
                    onClick={() => handleLinkClick('news')}
                >
                    <li onClick={onClick}>News</li>
                </Link>
                <li className={`${styles.navElem} 
                    flex justify-center items-center gap-2 cursor-pointer`}
                    onClick={() => {setLanguage(!language)}}
                >   {
                        language ?
                        <Image className={`${styles.langArrow}`}
                               src={triPic} width={12} height={12} alt="triangle up"/>
                        : <Image className={`${styles.langArrow}`}
                                 src={rvtriPic} width={12} height={12} alt="triangle down"/>
                    }
                    <span>Select Language</span>
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