// 'use client';
//
// import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
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
// type RoadmapItem = {
//     index: number;
//     date: string;
//     title: string;
//     content: string;
//     backgroundImage: keyof typeof imageMap;
// };
//
// // ✅ 이미지 맵은 컴포넌트 밖에 두면 rerender 때마다 새 객체 안 만들어짐
// const imageMap = {
//     october,
//     october1,
//     may,
//     december,
//     june,
//     february,
//     september,
//     march,
// } satisfies Record<string, StaticImageData>;
//
// export function Roadmap() {
//     const t = useTranslations('roadmap');
//     const [clickedIndex, setClickedIndex] = useState<number | null>(null);
//
//     // ✅ "가운데 컨텐츠 폭"을 가진 박스에 ref를 달아야 edge가 정확함
//     const innerRef = useRef<HTMLDivElement | null>(null);
//
//     const roadmapData: RoadmapItem[] = useMemo(
//         () => [
//             {
//                 index: 7,
//                 date: 'Q1 2025',
//                 title: 'Launch of VOB NFT Project',
//                 content:
//                     "Introducing the VOB NFT project to further enhance the platform's ecosystem and user engagement.",
//                 backgroundImage: 'march',
//             },
//             {
//                 index: 6,
//                 date: 'Q3 2024',
//                 title: 'Full Launch of Rising X Platform',
//                 content:
//                     'The VOB token will act as the primary payment currency, enabling global growth on the Rising X platform.',
//                 backgroundImage: 'september',
//             },
//             {
//                 index: 5,
//                 date: 'October 2023',
//                 title: 'Rising X Beta Platform Launch',
//                 content:
//                     'Initiation of the Rising X platform in beta, paving the way for future releases.',
//                 backgroundImage: 'october',
//             },
//             {
//                 index: 4,
//                 date: 'October 2023',
//                 title: 'System Enhancements',
//                 content:
//                     "Launch of ReTri's advanced computing system and GOYABOT's premium chart feature.",
//                 backgroundImage: 'october1',
//             },
//             {
//                 index: 3,
//                 date: 'May 2023',
//                 title: 'GoyaBot 5.0 Launch & Global Expansion',
//                 content:
//                     'Release of a complete automated trading bot and expanded global reach through online channels.',
//                 backgroundImage: 'may',
//             },
//             {
//                 index: 2,
//                 date: 'December 2022',
//                 title: 'Listing on LBank CEX Exchange',
//                 content: 'Successfully listed on LBank, a leading centralized exchange.',
//                 backgroundImage: 'december',
//             },
//             {
//                 index: 1,
//                 date: 'June 2017',
//                 title: 'Arbitrage Trading Data Collection and Analysis',
//                 content:
//                     'Research and compilation of six years of data on arbitrage trading and historical crypto market patterns for deeper market insights.',
//                 backgroundImage: 'june',
//             },
//             {
//                 index: 0,
//                 date: 'February 2017',
//                 title: 'Crypto Price Prediction',
//                 content:
//                     "Visualized projections of crypto prices based on GoyaBot's AI-driven analysis, forecasting future trends with the Goya score.",
//                 backgroundImage: 'february',
//             },
//         ],
//         []
//     );
//
//     const options: EmblaOptionsType = useMemo(
//         () => ({
//             align: 'start',
//             loop: false,
//             dragFree: true,
//             containScroll: 'keepSnaps',
//         }),
//         []
//     );
//
//     const [emblaRef, emblaApi] = useEmblaCarousel(options);
//
//     // ✅ 데스크탑에서만 양끝 여백(=가운데 컨테이너의 left/right gutter)을 Embla container padding으로 넣기
//     const [edge, setEdge] = useState<{ left: number; right: number }>({
//         left: 0,
//         right: 0,
//     });
//
//     const calcEdge = useCallback(() => {
//         const el = innerRef.current;
//         if (!el) return;
//
//         // 모바일이면 0 (원하면 breakpoint 바꾸기)
//         const isMobile = window.innerWidth <= 768;
//         if (isMobile) {
//             setEdge({ left: 0, right: 0 });
//             return;
//         }
//
//         const rect = el.getBoundingClientRect();
//         const left = Math.max(0, rect.left);
//         const right = Math.max(0, window.innerWidth - rect.right);
//
//         setEdge({ left, right });
//     }, []);
//
//     useEffect(() => {
//         const run = () => {
//             calcEdge();
//             // padding 바뀌면 track 길이가 바뀌므로 reInit
//             requestAnimationFrame(() => emblaApi?.reInit());
//         };
//
//         run();
//         window.addEventListener('resize', run);
//
//         const ro =
//             typeof ResizeObserver !== 'undefined'
//                 ? new ResizeObserver(() => run())
//                 : null;
//
//         if (ro && innerRef.current) ro.observe(innerRef.current);
//
//         return () => {
//             window.removeEventListener('resize', run);
//             ro?.disconnect();
//         };
//     }, [emblaApi, calcEdge]);
//
//     const handleClick = useCallback((i: number) => {
//         setClickedIndex((prev) => (prev === i ? null : i));
//     }, []);
//
//     return (
//         <section className={styles.roadmap}>
//             {/* ✅ 이 박스가 "가운데 컨텐츠 폭" (max-width + margin auto) 역할 */}
//             <div className={styles.roadmapInner} ref={innerRef}>
//                 <div className={styles.roadmapTitle}>{t('title')}</div>
//
//                 <div className={styles.embla} ref={emblaRef}>
//                     <div
//                         className={styles.embla__container}
//                         style={{paddingRight: edge.right }}
//                     >
//                         {roadmapData.map((item, i) => (
//                             <div
//                                 key={i}
//                                 className={`${styles.embla__slide} ${
//                                     clickedIndex === i ? styles.clicked : ''
//                                 }`}
//                             >
//                                 <div
//                                     className={styles.roadmapElem}
//                                     onClick={() => handleClick(i)}
//                                     role="button"
//                                     tabIndex={0}
//                                     onKeyDown={(e) => {
//                                         if (e.key === 'Enter' || e.key === ' ') handleClick(i);
//                                     }}
//                                 >
//                                     <div className={styles.roadmapElemHead}>
//                                         {t(`${item.index}.date`)}
//                                     </div>
//
//                                     {/* ✅ "폭은 고정"하고, 내용만 펼치기/접기 (CSS에서 max-height로 처리 추천) */}
//                                     <div
//                                         className={`${styles.roadmapElemBody} ${
//                                             clickedIndex === i ? styles.bodyExpanded : styles.bodyCollapsed
//                                         }`}
//                                     >
//                                         <div className={styles.roadmapBodyTitle}>
//                                             {t(`${item.index}.title`)}
//                                         </div>
//                                         <div className={styles.roadmapBodyContent}>
//                                             {t(`${item.index}.content`)}
//                                         </div>
//                                     </div>
//
//                                     <div className={styles.backgroundWhite} />
//
//                                     <div className={styles.roadmapBackground}>
//                                         <Image
//                                             src={imageMap[item.backgroundImage]}
//                                             alt={`${item.date} background`}
//                                             fill
//                                             style={{ objectFit: 'cover' }}
//                                             sizes="(max-width: 768px) 80vw, 360px"
//                                             onLoadingComplete={() => {
//                                                 // 이미지 로딩으로 레이아웃이 바뀌면 한번 더 reInit
//                                                 requestAnimationFrame(() => emblaApi?.reInit());
//                                             }}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// }

'use client';

import { useCallback, useMemo, useState } from 'react';
import styles from './styles.module.css';
import Image, { StaticImageData } from 'next/image';
import { useTranslations } from 'next-intl';

// ✅ Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { FreeMode } from 'swiper/modules';

// ✅ Swiper CSS (전역이든, 이 컴포넌트에서든 1번만 import 되면 됨)
import 'swiper/css';
import 'swiper/css/free-mode';

import october from '@/public/roadmap/october.png';
import october1 from '@/public/roadmap/october1.png';
import may from '@/public/roadmap/may.png';
import december from '@/public/roadmap/december.png';
import june from '@/public/roadmap/june.png';
import february from '@/public/roadmap/february.png';
import september from '@/public/roadmap/september.png';
import march from '@/public/roadmap/march.png';

type RoadmapItem = {
    index: number;
    date: string;
    title: string;
    content: string;
    backgroundImage: keyof typeof imageMap;
};

const imageMap = {
    october,
    october1,
    may,
    december,
    june,
    february,
    september,
    march,
} satisfies Record<string, StaticImageData>;

export function Roadmap() {
    const t = useTranslations('roadmap');
    const [clickedIndex, setClickedIndex] = useState<number | null>(null);

    const roadmapData: RoadmapItem[] = useMemo(
        () => [
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
        ],
        []
    );

    const handleClick = useCallback((i: number) => {
        setClickedIndex((prev) => (prev === i ? null : i));
    }, []);

    // ✅ (선택) Swiper 인스턴스 잡고 싶으면
    const onSwiper = useCallback((swiper: SwiperType) => {
        // console.log('swiper ready', swiper);
    }, []);

    return (
        <section className={styles.roadmap}>
            <div className={styles.roadmapInner}>
                <div className={styles.roadmapTitle}>{t('title')}</div>

                <Swiper
                    modules={[FreeMode]}
                    onSwiper={onSwiper}
                    freeMode={{ enabled: true, momentum: true }}
                    grabCursor
                    slidesPerView="auto" // ✅ 슬라이드 폭을 CSS로 고정/조절
                    spaceBetween={16}
                    watchOverflow
                    // ✅ 모바일에서 시작/끝 여백 필요하면 padding을 여기서 주는 게 제일 안정적
                    // (styles에서 .swiper 자체에 padding 줘도 됨)
                    // style={{ paddingRight: 0, paddingLeft: 0 }}
                    breakpoints={{
                        0: { slidesPerView: 'auto', spaceBetween: 12 },
                        769: { slidesPerView: 'auto', spaceBetween: 16 },
                    }}
                    className={styles.swiper}
                >
                    {roadmapData.map((item, i) => (
                        <SwiperSlide
                            key={i}
                            className={`
                                ${styles.swiperSlide}
                            `}
                        >
                            <div
                                className={`${styles.roadmapElem} ${
                                    clickedIndex === i ? styles.clicked : ''
                                }`}
                                onClick={() => handleClick(i)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') handleClick(i);
                                }}
                            >
                                <div className={styles.roadmapElemHead}>{t(`${item.index}.date`)}</div>

                                {/* ✅ 폭은 고정 + 내용만 펼치기/접기 */}
                                <div
                                    className={`${styles.roadmapElemBody} ${
                                        clickedIndex === i ? styles.bodyExpanded : styles.bodyCollapsed
                                    }`}
                                >
                                    <div className={styles.roadmapBodyTitle}>{t(`${item.index}.title`)}</div>
                                    <div className={styles.roadmapBodyContent}>{t(`${item.index}.content`)}</div>
                                </div>

                                <div className={styles.backgroundWhite} />

                                <div className={styles.roadmapBackground}>
                                    <Image
                                        src={imageMap[item.backgroundImage]}
                                        alt={`${item.date} background`}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        sizes="(max-width: 768px) 80vw, 360px"
                                        priority={i < 2}
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
