'use client'

import styles from './styles.module.css'
import Image from 'next/image'
import rightArrow from '@/public/icons/right-arrow-white.png'
import { NavigationLink } from '@/ui/NavigationLink'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import useEmblaCarousel from 'embla-carousel-react'
import WheelGesturesPlugin from 'embla-carousel-wheel-gestures'

export function NewsMediaBand({data, imgSrc, index}: { data: any, imgSrc: any, index: number }) {
    const t = useTranslations('media')

    // ✅ 모바일에서만 Embla 활성화
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false
        return window.innerWidth <= 768
    });

    const PAGE_SIZE = 8;

    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    // PC에서는 visibleCount만큼, 모바일에서는 전체 표시
    const visibleData = isMobile
        ? data
        : data.slice(0, visibleCount);

    const hasMore = !isMobile && visibleCount < data.length;
    const isExpanded = visibleCount > PAGE_SIZE;

    const handleToggleMore = () => {
        if (!hasMore) {
            // 모두 표시한 상태라면 처음 8개로 접기
            setVisibleCount(PAGE_SIZE);
        } else {
            // 8개씩 추가 표시
            setVisibleCount(prev =>
                Math.min(prev + PAGE_SIZE, data.length)
            );
        }
    };

    useEffect(() => {
        const update = () => setIsMobile(window.innerWidth <= 768)
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, []);

    const [emblaRef] = useEmblaCarousel(
        {
            align: 'start',
            dragFree: true,
            // containScroll: 'trimSnaps',
            containScroll: 'keepSnaps',
            skipSnaps: true,
        },
        [
            WheelGesturesPlugin({
                forceWheelAxis: 'x',
                wheelDraggingClass: 'is-wheel-dragging'
            })
        ]
    )

    return (
        <>
            <div
                ref={isMobile ? emblaRef : undefined}
                className={`${styles.mediaViewport} ${isMobile ? styles.mediaEmbla : ''}`}
            >
                <ul className={`${styles.mediaElementWrapper} ${isMobile ? styles.mediaContainer : ''}`}>
                    {visibleData.map((a: any, i: number) => {
                        let typeText = ''
                        switch (a.type) {
                            case 'editorial':
                                typeText = t('type.editorial')
                                break
                            case 'interview':
                                typeText = t('type.interview')
                                break
                            case 'event':
                                typeText = t('type.event')
                                break
                            case 'publicity':
                                typeText = t('type.publicity')
                                break
                            default:
                                typeText = a.type
                        }

                        return (
                            <li
                                key={i}
                                className={`${styles.mediaElement} ${isMobile ? styles.mediaSlide : ''}`}
                            >
                                <p className={styles.mediaElemType}>{typeText}</p>

                                <div>
                                    <NavigationLink className={styles.white} href={`/news/${a.id}`}>
                                        <p className={styles.mediaElemTitle}>{a.title}</p>
                                    </NavigationLink>
                                </div>

                                <div className={styles.mediaElemImg}>
                                    <NavigationLink href={`/news/${a.id}`}>
                                        <Image
                                            fill
                                            className={styles.imgCss}
                                            src={imgSrc[i]}
                                            alt="media image"
                                            draggable={false}
                                            unoptimized
                                        />
                                    </NavigationLink>
                                </div>

                                <div className={styles.mediaElemViewWrapper}>
                                    <NavigationLink href={`/news/${a.id}`}>
                                        <div className={styles.mediaElemView}>
                                            <span className={styles.viewBtn}>{t('read')}</span>
                                            <span className={styles.arrowPic}>
                                              <Image src={rightArrow} width={10} alt="right arrow" draggable={false} />
                                            </span>
                                        </div>
                                    </NavigationLink>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
            {!isMobile && data.length > PAGE_SIZE && (
                <div className={styles.loadMoreWrapper}>
                    <button
                        type="button"
                        className={styles.loadMoreButton}
                        onClick={handleToggleMore}
                    >
                        {!hasMore ? 'LESS' : 'MORE'}

                        <span className={styles.loadMoreArrow}>
                {!hasMore ? '↑' : '↓'}
            </span>
                    </button>
                </div>
            )}

        </>
    )
}
