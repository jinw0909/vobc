// 'use client';
//
// import { useState } from 'react';
// import styles from './styles.module.css';
// import Image, { StaticImageData } from 'next/image';
//
// import useEmblaCarousel from 'embla-carousel-react';
// import type { EmblaOptionsType } from 'embla-carousel';
//
// import october from '@/public/roadmap/october.png';
// import october1 from '@/public/roadmap/october1.png';
// import may from '@/public/roadmap/may.png';
// import december from '@/public/roadmap/december.png';
// import june from '@/public/roadmap/june.png';
// import february from '@/public/roadmap/february.png';
// import september from '@/public/roadmap/september.png';
// import march from '@/public/roadmap/march.png';
//
// import { useTranslations } from 'next-intl';
//
// export function Roadmap() {
//     const t = useTranslations('roadmap');
//     const [clickedIndex, setClickedIndex] = useState<number | null>(null);
//
//     const roadmapData = [
//         { index: 7, date: 'Q1 2025', title: 'Launch of VOB NFT Project', content: "Introducing the VOB NFT project to further enhance the platform's ecosystem and user engagement.", backgroundImage: 'march' },
//         { index: 6, date: 'Q3 2024', title: 'Full Launch of Rising X Platform', content: 'The VOB token will act as the primary payment currency, enabling global growth on the Rising X platform.', backgroundImage: 'september' },
//         { index: 5, date: 'October 2023', title: 'Rising X Beta Platform Launch', content: 'Initiation of the Rising X platform in beta, paving the way for future releases.', backgroundImage: 'october' },
//         { index: 4, date: 'October 2023', title: 'System Enhancements', content: "Launch of ReTri's advanced computing system and GOYABOT's premium chart feature.", backgroundImage: 'october1' },
//         { index: 3, date: 'May 2023', title: 'GoyaBot 5.0 Launch & Global Expansion', content: 'Release of a complete automated trading bot and expanded global reach through online channels.', backgroundImage: 'may' },
//         { index: 2, date: 'December 2022', title: 'Listing on LBank CEX Exchange', content: 'Successfully listed on LBank, a leading centralized exchange.', backgroundImage: 'december' },
//         { index: 1, date: 'June 2017', title: 'Arbitrage Trading Data Collection and Analysis', content: 'Research and compilation of six years of data on arbitrage trading and historical crypto market patterns for deeper market insights.', backgroundImage: 'june' },
//         { index: 0, date: 'February 2017', title: 'Crypto Price Prediction', content: "Visualized projections of crypto prices based on GoyaBot's AI-driven analysis, forecasting future trends with the Goya score.", backgroundImage: 'february' },
//     ];
//
//     const imageMap: Record<string, StaticImageData> = {
//         october,
//         october1,
//         may,
//         december,
//         june,
//         february,
//         september,
//         march,
//     };
//
//     // Embla 옵션: 원하면 align/loop 조절 가능
//     const options: EmblaOptionsType = {
//         align: 'start',
//         loop: false,
//         dragFree: true, // 손 떼면 스냅되게
//         containScroll: 'keepSnaps'
//     };
//
//     const [emblaRef] = useEmblaCarousel(options);
//
//     const handleClick = (i: number) => {
//         setClickedIndex(clickedIndex === i ? null : i);
//     };
//
//     return (
//         <div className={styles.roadmap}>
//             <div className={styles.roadmapTitle}>{t('title')}</div>
//
//             {/* Embla viewport */}
//             <div style={{display: 'flex'}}>
//                 <div className={styles.embla} ref={emblaRef}>
//                 {/* Embla container */}
//                 <div className={styles.embla__container}>
//                     {roadmapData.map((item, i) => (
//                         <div className={`${styles.embla__slide} ${clickedIndex === i ? styles.clicked : ''}` } key={i}>
//                             <div
//                                 className={`${styles.roadmapElem}`}
//                                 onClick={() => handleClick(i)}
//                             >
//                                 <div className={styles.roadmapElemHead}>{t(`${item.index}.date`)}</div>
//
//                                 <div className={styles.roadmapElemBody}>
//                                     <div className={styles.roadmapBodyTitle}>{t(`${item.index}.title`)}</div>
//                                     <div className={styles.roadmapBodyContent}>{t(`${item.index}.content`)}</div>
//                                 </div>
//
//                                 <div className={styles.backgroundWhite} />
//
//                                 <div className={styles.roadmapBackground}>
//                                     <Image
//                                         src={imageMap[item.backgroundImage]}
//                                         alt={`${item.date} background`}
//                                         fill
//                                         style={{ objectFit: 'cover' }}
//                                         sizes="(max-width: 768px) 80vw, 360px"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             </div>
//         </div>
//     );
// }


'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';
import Image, { StaticImageData } from 'next/image';

import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaOptionsType } from 'embla-carousel';

import october from '@/public/roadmap/october.png';
import october1 from '@/public/roadmap/october1.png';
import may from '@/public/roadmap/may.png';
import december from '@/public/roadmap/december.png';
import june from '@/public/roadmap/june.png';
import february from '@/public/roadmap/february.png';
import september from '@/public/roadmap/september.png';
import march from '@/public/roadmap/march.png';

import { useTranslations } from 'next-intl';

export function Roadmap() {
    const t = useTranslations('roadmap');
    const [clickedIndex, setClickedIndex] = useState<number | null>(null);

    // ✅ roadmap 실제 width 기준으로 마지막 슬라이드 margin-right 계산
    const roadmapRef = useRef<HTMLDivElement | null>(null);
    const [endMargin, setEndMargin] = useState(0);

    const roadmapData = [
        {
            index: 7,
            date: 'Q1 2025',
            title: 'Launch of VOB NFT Project',
            content:
                "Introducing the VOB NFT project to further enhance the platform's ecosystem and user engagement.",
            backgroundImage: 'march',
        },
        {
            index: 6,
            date: 'Q3 2024',
            title: 'Full Launch of Rising X Platform',
            content:
                'The VOB token will act as the primary payment currency, enabling global growth on the Rising X platform.',
            backgroundImage: 'september',
        },
        {
            index: 5,
            date: 'October 2023',
            title: 'Rising X Beta Platform Launch',
            content:
                'Initiation of the Rising X platform in beta, paving the way for future releases.',
            backgroundImage: 'october',
        },
        {
            index: 4,
            date: 'October 2023',
            title: 'System Enhancements',
            content:
                "Launch of ReTri's advanced computing system and GOYABOT's premium chart feature.",
            backgroundImage: 'october1',
        },
        {
            index: 3,
            date: 'May 2023',
            title: 'GoyaBot 5.0 Launch & Global Expansion',
            content:
                'Release of a complete automated trading bot and expanded global reach through online channels.',
            backgroundImage: 'may',
        },
        {
            index: 2,
            date: 'December 2022',
            title: 'Listing on LBank CEX Exchange',
            content: 'Successfully listed on LBank, a leading centralized exchange.',
            backgroundImage: 'december',
        },
        {
            index: 1,
            date: 'June 2017',
            title: 'Arbitrage Trading Data Collection and Analysis',
            content:
                'Research and compilation of six years of data on arbitrage trading and historical crypto market patterns for deeper market insights.',
            backgroundImage: 'june',
        },
        {
            index: 0,
            date: 'February 2017',
            title: 'Crypto Price Prediction',
            content:
                "Visualized projections of crypto prices based on GoyaBot's AI-driven analysis, forecasting future trends with the Goya score.",
            backgroundImage: 'february',
        },
    ];

    const imageMap: Record<string, StaticImageData> = {
        october,
        october1,
        may,
        december,
        june,
        february,
        september,
        march,
    };

    const options: EmblaOptionsType = {
        align: 'start',
        loop: false,
        dragFree: true,
        containScroll: 'keepSnaps',
    };

    const [emblaRef, emblaApi] = useEmblaCarousel(options);

    const handleClick = (i: number) => {
        setClickedIndex((prev) => (prev === i ? null : i));
    };

    // ✅ (100vw - roadmapWidth) / 2 를 마지막 슬라이드 margin-right로 적용
    // - resize, 폰트/이미지 로딩 이후 레이아웃 변동에도 대응
    useEffect(() => {
        const calc = () => {
            const roadmapEl = roadmapRef.current;
            if (!roadmapEl) return;

            const roadmapWidth = roadmapEl.getBoundingClientRect().width;
            const vw = window.innerWidth; // 너가 말한 100vw 기준
            const gap = Math.max(0, (vw - roadmapWidth) / 2);

            setEndMargin(gap);

            // ✅ margin 변화로 트랙 길이가 변하니까 Embla 재계산
            // 두 프레임 주면 이미지 fill/폰트 적용 후에도 안정적
            if (emblaApi) {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => emblaApi.reInit());
                });
            }
        };

        calc();

        // Resize 대응
        window.addEventListener('resize', calc);

        // ResizeObserver: roadmap 폭이 margin/padding/레이아웃으로 변하면 재계산
        const ro =
            typeof ResizeObserver !== 'undefined'
                ? new ResizeObserver(() => calc())
                : null;

        if (ro && roadmapRef.current) ro.observe(roadmapRef.current);

        return () => {
            window.removeEventListener('resize', calc);
            ro?.disconnect();
        };
    }, [emblaApi]);

    return (
        <div className={styles.roadmap} ref={roadmapRef}>
            <div className={styles.roadmapTitle}>{t('title')}</div>

            {/* Embla viewport */}
            <div style={{ display: 'flex' }}>
                <div className={styles.embla} ref={emblaRef}>
                    {/* Embla container */}
                    <div className={styles.embla__container}>
                        {roadmapData.map((item, i) => {
                            const isLast = i === roadmapData.length - 1;

                            return (
                                <div
                                    key={i}
                                    className={`${styles.embla__slide} ${
                                        clickedIndex === i ? styles.clicked : ''
                                    }`}
                                    // ✅ 마지막 요소에만 margin-right 추가
                                    style={isLast ? { marginRight: `${endMargin}px` } : undefined}
                                >
                                    <div
                                        className={styles.roadmapElem}
                                        onClick={() => handleClick(i)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') handleClick(i);
                                        }}
                                    >
                                        <div className={styles.roadmapElemHead}>
                                            {t(`${item.index}.date`)}
                                        </div>

                                        <div className={styles.roadmapElemBody}>
                                            <div className={styles.roadmapBodyTitle}>
                                                {t(`${item.index}.title`)}
                                            </div>
                                            <div className={styles.roadmapBodyContent}>
                                                {t(`${item.index}.content`)}
                                            </div>
                                        </div>

                                        <div className={styles.backgroundWhite} />

                                        <div className={styles.roadmapBackground}>
                                            <Image
                                                src={imageMap[item.backgroundImage]}
                                                alt={`${item.date} background`}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                sizes="(max-width: 768px) 80vw, 360px"
                                                // ✅ 이미지 로드 후 레이아웃 변하면 margin/embla 재계산
                                                onLoadingComplete={() => {
                                                    // 다음 tick에서 calc 실행(즉시 width 측정하면 아직 반영 전일 수 있음)
                                                    requestAnimationFrame(() => {
                                                        const roadmapEl = roadmapRef.current;
                                                        if (!roadmapEl) return;

                                                        const roadmapWidth = roadmapEl.getBoundingClientRect().width;
                                                        const vw = window.innerWidth;
                                                        const gap = Math.max(0, (vw - roadmapWidth) / 2);
                                                        setEndMargin(gap);

                                                        requestAnimationFrame(() => emblaApi?.reInit());
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
