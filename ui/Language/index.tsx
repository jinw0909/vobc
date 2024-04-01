'use client'

import styles from './styles.module.css'
// import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "@/navigation";

export const Language = ({lang} : {lang : string}) => {
    const router = useRouter();
    const pathname = usePathname();
    // const currentLang = pathname.split('/')[1];
    const [selectedLang, setSelectedLang] = useState(lang?.toString());
    const [showModal, setShowModal] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null); // Reference to languageWrapper div
    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
    //     const segments = pathname.split('/');
    //     segments[1] = selectedLang;
    //     const newPathname = segments.join('/');
    //     // router.replace(newPathname);
        router.replace(pathname, {locale: selectedLang})
    }, [selectedLang]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (wrapperRef.current &&
                !wrapperRef.current!.contains(event.target as Node) &&
                modalRef.current &&
                !modalRef.current!.contains(event.target as Node)) {
                setShowModal(false); // Clicked outside of languageWrapper
            }
        };
        // Attach click event listener to document body
        document.body.addEventListener('click', handleClickOutside);
        // Cleanup function to remove event listener
        return () => {
            document.body.removeEventListener('click', handleClickOutside);
        };
    }, []); // Run effect only once on component mount

    return (
        <>
        <div
            className={styles.languageWrapper}
            ref={wrapperRef}
        >
            <div
                onClick={() => { setShowModal(!showModal) }}
                className={styles.languageSelect}>{selectedLang?.toUpperCase()}
            </div>
        </div>
        <div className={`${styles.languageModal} 
            ${showModal ? styles.show : ""}`} ref={modalRef}>
            <button
                className={`${selectedLang == 'en' ? styles.current : ''}`}
                onClick={()=>{setSelectedLang('en')}}>English</button>
            <button
                className={`${selectedLang == 'jp' ? styles.current : ''}`}
                onClick={()=>{setSelectedLang('jp')}}>日本語</button>
            <button
                className={`${selectedLang == 'cn' ? styles.current : ''}`}
                onClick={()=>{setSelectedLang('cn')}}>中文</button>
        </div>
        </>
    )
}