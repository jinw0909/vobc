'use client'

import styles from './styles.module.css'
// import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "@/navigation";
import Image from 'next/image';
import triangle from '@/public/icons/triangle-icon-white.png';
import rvtriangle from '@/public/icons/triangle-icon-white-rv.png';

export const Language = ({lang} : {lang : string}) => {
    const router = useRouter();
    const pathname = usePathname();
    // const currentLang = pathname.split('/')[1];
    const [selectedLang, setSelectedLang] = useState(lang?.toString());
    const [showModal, setShowModal] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null); // Reference to languageWrapper div
    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        router.replace(pathname, {locale: selectedLang})
    }, [selectedLang]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {

            const wrapperNode = wrapperRef.current;
            const modalNode = modalRef.current;

            if (wrapperNode && !wrapperNode.contains(event.target as Node) &&
            modalNode && !modalNode.contains(event.target as Node)) {
                setShowModal(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [wrapperRef, modalRef]);

    return (
        <>
        <div className={styles.languageWrapper} ref={wrapperRef}>
            <div
                onClick={() => { setShowModal(!showModal) }}
                className={styles.languageSelect}>
                <span>
                    {showModal ?
                        <Image src={triangle} width={12} height={12} alt="trianle"
                               className={styles.languageArrowUp}/>
                        : <Image src={rvtriangle} width={12} height={12} alt="triangle"
                                 className={styles.languageArrow}/>}
                </span>
                <span>{selectedLang?.toUpperCase()}</span>
            </div>
        </div>
        <div className={`${styles.languageModal} 
            ${showModal ? styles.show : ""}`} ref={modalRef}>
                <button
                    className={`${selectedLang == 'en' ? styles.current : ''}`}
                    onClick={()=>{setSelectedLang('en')}}>
                    English
                </button>
                <span className={styles.langBar}></span>
                <button
                    className={`${selectedLang == 'jp' ? styles.current : ''}`}
                    onClick={()=>{setSelectedLang('jp')}}>
                    日本語
                </button>
                <span className={styles.langBar}></span>
                <button
                    className={`${selectedLang == 'cn' ? styles.current : ''}`}
                    onClick={()=>{setSelectedLang('cn')}}>
                    汉文
                </button>
        </div>
        </>
    )
}