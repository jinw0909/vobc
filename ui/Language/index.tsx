'use client'

import styles from './styles.module.css'
import { usePathname, useRouter, Link } from '@/i18n/navigation'
// import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {useState, useRef, useEffect, Fragment} from 'react'
import Image from 'next/image'
import triangle   from '@/public/icons/triangle-icon-white.png'
import rvtriangle from '@/public/icons/triangle-icon-white-rv.png'
import languageIcon from '@/public/icons/language-icon-white.png'

export const Language = ({ lang }: { lang: string }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [showModal, setShowModal] = useState(false);

    // close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current?.contains(event.target as Node) ||
                modalRef.current?.contains(event.target as Node)
            ) return
            setShowModal(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // rebuild the “base” href (no locale prefix) + any search params
    const baseHref = searchParams.toString()
        ? `${pathname}?${searchParams.toString()}`
        : pathname


    return (
        <>
            <div className={styles.languageWrapper} ref={wrapperRef}>
                <div className={styles.languageInner}>
                    <div
                        onClick={() => setShowModal((v) => !v)}
                        className={styles.languageSelect}
                    >
                        { lang.toUpperCase() }
                        {/*<Image src={languageIcon} alt={'languageIcon'} width={20} height={20}></Image>*/}
                    </div>
                </div>
            </div>

            <div
                className={`${styles.languageModal} ${
                    showModal ? styles.show : ''
                }`}
                ref={modalRef}
            >
                {(['cn', 'jp', 'en'] as const).map((locale, index, array) => (
                    <Fragment key={locale}>
                        <Link
                            key={locale}
                            href={baseHref}
                            locale={locale}
                            replace
                            onClick={() => setShowModal(false)}
                        >
                            <button
                                className={`${styles.langElem} ${
                                    lang === locale ? styles.current : ''
                                }`}
                            >
                                {locale === 'en' ? 'English'
                                    : locale === 'jp' ? '日本語'
                                    : locale === 'cn' ? '中文'
                                    : '한국어'}
                            </button>
                        </Link>
                    </Fragment>
                ))}
            </div>
        </>
    )
}