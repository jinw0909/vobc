'use client'

import styles from './styles.module.css'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

type TeamBandProps = {
    selected: any
    profile: any[]
    order: number
    registerRef: (order: number, el: HTMLDivElement | null) => void
    data: any
}

export function TeamBand({ selected, profile, order, registerRef, data }: TeamBandProps) {
    const t = useTranslations('team')

    // ✅ profile 길이가 바뀌면 expanded도 리셋
    const [expanded, setExpanded] = useState<boolean[]>(() => new Array(profile.length).fill(false))
    useEffect(() => {
        setExpanded(new Array(profile.length).fill(false))
    }, [profile.length])

    const toggleItem = (index: number) => {
        setExpanded((prev) => {
            const next = [...prev]
            next[index] = !next[index]
            return next
        })
    }

    const bandRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        registerRef(order, bandRef.current)
    }, [order, registerRef])

    // ✅ 모바일 모드(슬라이더) 판별
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        const update = () => setIsMobile(window.innerWidth <= 768)
        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [])

    // ✅ Embla (모바일에서만 ref를 붙여 활성화)
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
        skipSnaps: true,
    })


    // (선택) 모바일에서 아이템 클릭 시 해당 슬라이드로 스크롤
    const scrollTo = (idx: number) => {
        if (!isMobile) return
        emblaApi?.scrollTo(idx)
    }

    const isWideBand = order === 6

    return (
        <div ref={bandRef} className={styles.itemBandWrapper}>
            <div className={styles.itemContainer}>
                <div className={styles.itemBand}>
                    <h2 className={selected ? styles.selectedTitle : ''}>{t(`${order}.title`)}</h2>

                    {/* ✅ 모바일일 때만 Embla viewport로 동작 */}
                    <div
                        ref={isMobile ? emblaRef : undefined}
                        className={`${styles.bandViewport} ${isMobile ? styles.isMobile : styles.isDesktop}`}
                    >
                        <ul
                            className={`
                ${styles.itemList}
                ${isMobile ? styles.emblaContainer : ''}
                ${isWideBand ? styles.wideList : ''}
              `}
                        >
                            {profile.map((_, i: number) => {
                                const img = profile[i]
                                const isFallback =
                                    typeof img === 'object'
                                        ? String(img?.src ?? '').includes('fallback')
                                        : String(img).includes('fallback')

                                // wide band(order 6)는 카드 확장/이미지 없는 텍스트 카드로 유지
                                if (isWideBand) {
                                    return (
                                        <li
                                            key={i}
                                            className={`${styles.item} ${styles.wide} ${isMobile ? styles.emblaSlide : ''}`}
                                            onClick={() => scrollTo(i)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') scrollTo(i)
                                            }}
                                        >
                                            <div className={styles.itemInner}>
                                                <div className={`${styles.profileDesc} ${styles.wideDesc}`}>
                                                    {data?.[order]?.[i] && (
                                                        <>
                                                            <span className={styles.profileName}>{data[order][i].name}</span>
                                                            <p className={styles.wideP}>
                                                                {data[order][i].desc?.map((line: string, j: number) => (
                                                                    <span key={j}>{line}</span>
                                                                ))}
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    )
                                }

                                // normal band
                                return (
                                    <li
                                        key={i}
                                        className={`${styles.item} ${expanded[i] ? styles.show : ''} ${isMobile ? styles.emblaSlide : ''}`}
                                        onClick={() => {
                                            toggleItem(i)
                                            scrollTo(i)
                                        }}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                toggleItem(i)
                                                scrollTo(i)
                                            }
                                        }}
                                    >
                                        <div className={styles.itemInner}>
                                            <div className={styles.profilePic}>
                                                <div className={`${styles.imgContainer} ${isFallback ? styles.fallback : ''}`}>
                                                    <Image
                                                        src={img}
                                                        alt="profile"
                                                        fill
                                                        sizes="128px"
                                                        style={{ objectFit: 'cover' }}
                                                        draggable={false}
                                                    />
                                                </div>

                                                {data?.[order]?.[i] && (
                                                    <span className={styles.profileName}>{data[order][i].name}</span>
                                                )}
                                            </div>

                                            <div className={styles.profileDesc}>
                                                {data?.[order]?.[i] && (
                                                    <>
                                                        <span className={styles.profileStatus}>{data[order][i].status}</span>
                                                        <p className={`${styles.descP} ${expanded[i] ? styles.descShow : ''}`}>
                                                            {data[order][i].desc?.map((line: string, j: number) => (
                                                                <span key={j}>{line}</span>
                                                            ))}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
