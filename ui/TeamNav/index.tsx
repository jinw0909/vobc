'use client'

import styles from './styles.module.css'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { useLocale, useTranslations } from 'next-intl'
import {useEffect, useLayoutEffect} from "react";

export function TeamNav({
                            iconPic,
                            handleIndex,
                            selectedIdx,
                        }: {
    iconPic: any
    handleIndex: (i: number) => void
    selectedIdx: any[] // items 배열로 쓰는 중이라고 가정
}) {
    const t = useTranslations('team')
    const locale = useLocale()
    const isCN = locale === 'cn' || locale === 'zh' || locale === 'zh-CN'

    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
        skipSnaps: true,
        loop: false, // ✅ headband 네비는 보통 loop 끄는 게 자연스러움
    })

    return (
        <div className={styles.headbandWrapper}>
            <div className={styles.container}>
                <div className={styles.headband}>
                    <div className={styles.embla} ref={emblaRef}>
                        <div className={styles.embla__container}>
                            {selectedIdx.map((a: any, i: number) => (
                                <div
                                    key={i}
                                    className={`${styles.embla__slide} ${styles.elem} ${isCN ? styles.cn : ''} ${i === 0 ? styles.firstElem : ''}`}
                                    onClick={() => {
                                        handleIndex(i)
                                        emblaApi?.scrollTo(i)
                                    }}
                                >
                                    <div className={styles.elemInner}>
                                        <div className={styles.teamIcon}>
                                            <Image
                                                className={styles.teamIconImg}
                                                src={iconPic[i]}
                                                width={64}
                                                height={64}
                                                alt="team icon"
                                                draggable={false}   // ✅ 중요 (이미지가 드래그를 먹는 경우 많음)
                                            />
                                        </div>
                                        <div className={styles.iconDesc}>
                                            <span>{t(`${i}.first`)}</span>
                                            <span>{t(`${i}.second`)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* wheel 로직 삭제 */}
                </div>
            </div>
        </div>
    )
}
