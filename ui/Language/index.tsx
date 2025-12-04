'use client'

import styles from './styles.module.css'
import { usePathname, useRouter, Link } from '@/i18n/navigation'
// import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {useState, useRef, useEffect, Fragment} from 'react'
import Image from 'next/image'
import triangle   from '@/public/icons/triangle-icon-white.png'
import rvtriangle from '@/public/icons/triangle-icon-white-rv.png'

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
                          <span>
                            {showModal ? (
                                <Image
                                    src={triangle}
                                    width={12}
                                    height={12}
                                    alt="▲"
                                    className={styles.languageArrowUp}
                                />
                            ) : (
                                <Image
                                    src={rvtriangle}
                                    width={12}
                                    height={12}
                                    alt="▼"
                                    className={styles.languageArrow}
                                />
                            )}
                          </span>
                          <span>{lang.toUpperCase()}</span>
                    </div>
                </div>
            </div>

            <div
                className={`${styles.languageModal} ${
                    showModal ? styles.show : ''
                }`}
                ref={modalRef}
            >
                {(['en', 'jp', 'cn'] as const).map((locale, index, array) => (
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
                                {locale === 'en'
                                    ? 'English'
                                    : locale === 'jp'
                                        ? '日本語'
                                        : '汉文'}
                            </button>
                        </Link>
                        {/*/!* Separator, only between items *!/*/}
                        {/*{index < array.length - 1 && (*/}
                        {/*    // <span className={styles.langBar}></span>*/}
                        {/*    <span className={styles.langBar}></span>*/}
                        {/*)}*/}
                    </Fragment>
                ))}
            </div>
        </>
    )
}