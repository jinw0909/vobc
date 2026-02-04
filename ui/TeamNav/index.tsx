// // 'use client'
// //
// // import styles from './styles.module.css'
// // import Image from 'next/image'
// // import useEmblaCarousel from 'embla-carousel-react'
// // import { useLocale, useTranslations } from 'next-intl'
// // import {useEffect, useLayoutEffect} from "react";
// //
// // export function TeamNav({
// //                             iconPic,
// //                             handleIndex,
// //                             selectedIdx,
// //                         }: {
// //     iconPic: any
// //     handleIndex: (i: number) => void
// //     selectedIdx: any[] // items 배열로 쓰는 중이라고 가정
// // }) {
// //     const t = useTranslations('team')
// //     const locale = useLocale()
// //     const isCN = locale === 'cn' || locale === 'zh' || locale === 'zh-CN'
// //
// //     const [emblaRef, emblaApi] = useEmblaCarousel({
// //         align: 'start',
// //         dragFree: true,
// //         containScroll: 'trimSnaps',
// //         skipSnaps: true,
// //         loop: false, // ✅ headband 네비는 보통 loop 끄는 게 자연스러움
// //     })
// //
// //     return (
// //         <div className={styles.headbandWrapper}>
// //             <div className={styles.container}>
// //                 <div className={styles.headband}>
// //                     <div className={styles.embla} ref={emblaRef}>
// //                         <div className={styles.embla__container}>
// //                             {selectedIdx.map((a: any, i: number) => (
// //                                 <div
// //                                     key={i}
// //                                     className={`${styles.embla__slide} ${styles.elem} ${isCN ? styles.cn : ''} ${i === 0 ? styles.firstElem : ''}`}
// //                                     onClick={() => {
// //                                         handleIndex(i)
// //                                         emblaApi?.scrollTo(i)
// //                                     }}
// //                                 >
// //                                     <div className={styles.elemInner}>
// //                                         <div className={styles.teamIcon}>
// //                                             <Image
// //                                                 className={styles.teamIconImg}
// //                                                 src={iconPic[i]}
// //                                                 width={64}
// //                                                 height={64}
// //                                                 alt="team icon"
// //                                                 draggable={false}   // ✅ 중요 (이미지가 드래그를 먹는 경우 많음)
// //                                             />
// //                                         </div>
// //                                         <div className={styles.iconDesc}>
// //                                             <span>{t(`${i}.first`)}</span>
// //                                             <span>{t(`${i}.second`)}</span>
// //                                         </div>
// //                                     </div>
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     </div>
// //                     {/* wheel 로직 삭제 */}
// //                 </div>
// //             </div>
// //         </div>
// //     )
// // }
//
// 'use client';
//
// import styles from './styles.module.css';
// import Image from 'next/image';
// import { useLocale, useTranslations } from 'next-intl';
//
// // ✅ Swiper
// import { Swiper, SwiperSlide } from 'swiper/react';
// import type { Swiper as SwiperType } from 'swiper';
// import { FreeMode } from 'swiper/modules';
//
// // ✅ Swiper CSS (전역에서 1번만 import 해도 됨)
// import 'swiper/css';
// import 'swiper/css/free-mode';
//
// export function TeamNav({
//                             iconPic,
//                             handleIndex,
//                             selectedIdx,
//                         }: {
//     iconPic: any;
//     handleIndex: (i: number) => void;
//     selectedIdx: any[]; // items 배열로 쓰는 중이라고 가정
// }) {
//     const t = useTranslations('team');
//     const locale = useLocale();
//     const isCN = locale === 'cn' || locale === 'zh' || locale === 'zh-CN';
//
//     const onSwiper = (swiper: SwiperType) => {
//         // 필요하면 swiper 인스턴스 저장해서 외부에서 제어 가능
//         // console.log(swiper);
//     };
//
//     return (
//         <div className={styles.headbandWrapper}>
//             <div className={styles.container}>
//                 <div className={styles.headband}>
//                     <Swiper
//                         modules={[FreeMode]}
//                         freeMode={{ enabled: true, momentum: true }}
//                         slidesPerView="auto"
//                         watchOverflow
//                         grabCursor
//                         spaceBetween={12}
//                         breakpoints={{
//                             0: { spaceBetween: 10, slidesPerView: 'auto' },
//                             769: { spaceBetween: 12, slidesPerView: 'auto' },
//                         }}
//                         onSwiper={onSwiper}
//                         className={styles.swiper}
//                     >
//                         {selectedIdx.map((a: any, i: number) => (
//                             <SwiperSlide
//                                 key={i}
//                                 className={`${styles.swiperSlide} ${styles.elem} ${isCN ? styles.cn : ''} ${
//                                     i === 0 ? styles.firstElem : ''
//                                 }`}
//                                 onClick={() => {
//                                     handleIndex(i);
//                                     // ✅ 클릭한 슬라이드가 보이도록 중앙/가시영역으로 이동
//                                     // freeMode라도 slideTo는 잘 먹음
//                                     // (centeredSlides 안 쓰는 대신 "보이게"만 이동)
//                                     // swiper 인스턴스가 필요하면 useState로 저장해서 여기서 swiper.slideTo(i) 호출하면 됨
//                                 }}
//                                 role="button"
//                                 tabIndex={0}
//                                 onKeyDown={(e) => {
//                                     if (e.key === 'Enter' || e.key === ' ') handleIndex(i);
//                                 }}
//                             >
//                                 <div className={styles.elemInner}>
//                                     <div className={styles.teamIcon}>
//                                         <Image
//                                             className={styles.teamIconImg}
//                                             src={iconPic[i]}
//                                             width={64}
//                                             height={64}
//                                             alt="team icon"
//                                             draggable={false}
//                                         />
//                                     </div>
//                                     <div className={styles.iconDesc}>
//                                         <span>{t(`${i}.first`)}</span>
//                                         <span>{t(`${i}.second`)}</span>
//                                     </div>
//                                 </div>
//                             </SwiperSlide>
//                         ))}
//                     </Swiper>
//                 </div>
//             </div>
//         </div>
//     );
// }
'use client';

import styles from './styles.module.css';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { FreeMode, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/mousewheel';

type TeamApi = {
    id: number;
    name: string;
    description: string;
    icon: string | null;
    displayOrder: number;
};

export function TeamNav({
                            teams,
                            handleIndex,
                            selectedIdx,
                        }: {
    teams: TeamApi[];
    handleIndex: (i: number) => void;
    selectedIdx: boolean[];
}) {
    const locale = useLocale();
    const isCN = locale === 'cn' || locale === 'zh' || locale === 'zh-CN';

    const onSwiper = (swiper: SwiperType) => {};

    return (
        <div className={styles.headbandWrapper}>
            <div className={styles.container}>
                <div className={styles.headband}>
                    <Swiper
                        modules={[FreeMode, Mousewheel]}
                        freeMode={{ enabled: true, momentum: true }}
                        mousewheel={{ forceToAxis: true, releaseOnEdges: true, sensitivity: 1 }}
                        slidesPerView="auto"
                        watchOverflow
                        grabCursor
                        spaceBetween={12}
                        breakpoints={{
                            0: { spaceBetween: 10, slidesPerView: 'auto' },
                            769: { spaceBetween: 12, slidesPerView: 'auto' },
                        }}
                        onSwiper={onSwiper}
                        className={styles.swiper}
                    >
                        {teams.map((team, i) => (
                            <SwiperSlide
                                key={team.id}
                                className={`${styles.swiperSlide} ${styles.elem} ${isCN ? styles.cn : ''} ${i === 0 ? styles.firstElem : ''}`}
                                onClick={() => handleIndex(i)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') handleIndex(i);
                                }}
                            >
                                <div className={styles.elemInner}>
                                    <div className={styles.teamIcon}>
                                        {/* icon이 없으면 fallback 처리 */}
                                        {team.icon ? (
                                            <Image
                                                className={styles.teamIconImg}
                                                src={team.icon}
                                                width={64}
                                                height={64}
                                                alt={`${team.name} icon`}
                                                draggable={false}
                                            />
                                        ) : (
                                            <div className={styles.teamIconImg} />
                                        )}
                                    </div>

                                    <div className={styles.iconDesc}>
                                        {(() => {
                                            const raw = team.description ?? '';

                                            // 1) HTML 엔티티 정규화
                                            const text = raw.replace(/&amp;/g, '&').trim();

                                            // 2) & 또는 ＆ 기준 분리
                                            const m = text.match(/^(.*?)([&＆])(.*)$/);
                                            if (!m) return <span>{text}</span>;

                                            const left = m[1].trim();
                                            const amp = m[2]; // & or ＆
                                            const right = m[3].trim();

                                            // 한쪽이 비어 있으면 그냥 한 줄
                                            if (!left || !right) return <span>{text}</span>;

                                            const leftLen = left.length;
                                            const rightLen = right.length;

                                            let firstLine = '';
                                            let secondLine = '';

                                            if (leftLen <= rightLen) {
                                                // ✅ 앞이 더 짧으면 → 뒤에 &
                                                firstLine = `${left} ${amp}`;
                                                secondLine = right;
                                            } else {
                                                // ✅ 뒤가 더 짧으면 → 앞에 &
                                                firstLine = left;
                                                secondLine = `${amp} ${right}`;
                                            }

                                            return (
                                                <>
                                                    <span>{firstLine}</span>
                                                    <span className={styles.subText}>{secondLine}</span>
                                                </>
                                            );
                                        })()}
                                    </div>

                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
}
