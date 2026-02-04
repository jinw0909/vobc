// 'use client'
//
// import styles from './styles.module.css';
// import Image from "next/image";
// import rightArrow from "@/public/icons/right-arrow-yellow.png";
// import {NavigationLink} from "@/ui/NavigationLink";
// import {getTranslations} from "next-intl/server";
// import {useEffect, useRef} from "react";
// import {useTranslations} from "next-intl";
// export function NewsMediaBand({ data, imgSrc, index } : { data: any, imgSrc: any, index: number}) {
//
//     const t = useTranslations('media');
//     const wrapperRef = useRef<HTMLUListElement>(null);
//
//     useEffect(() => {
//         const el = wrapperRef.current;
//         if (!el) return
//
//         const handleWheel = (event: WheelEvent) => {
//             if (event.deltaY !== 0) {
//                 event.preventDefault();
//                 el.scrollLeft += event.deltaY;
//             }
//         };
//
//         const updateWheelBehavior = () => {
//             if (window.innerWidth <= 768) {
//                 el.addEventListener('wheel', handleWheel, {passive: false});
//                 console.log('add wheel');
//             } else {
//                 el.removeEventListener('wheel', handleWheel);
//             }
//         }
//
//         updateWheelBehavior();
//         window.addEventListener('resize', updateWheelBehavior);
//
//         return () => {
//             el.removeEventListener('wheel', handleWheel);
//             window.removeEventListener('resize', updateWheelBehavior);
//         }
//     }, []);
//
//     return (
//         <ul ref={wrapperRef} className={styles.mediaElementWrapper}>
//             {
//                 data.map((a:any, i:number) => {
//
//                     let typeText = "";
//                     switch (a.type) {
//                         case 'editorial':
//                             typeText = t('type.editorial');
//                             break;
//                         case 'interview':
//                             typeText = t('type.interview');
//                             break;
//                         case 'event':
//                             typeText = t('type.event');
//                             break;
//                         case 'publicity':
//                             typeText = t('type.publicity');
//                             break;
//                         default:
//                             typeText = a.type;
//                     }
//
//                     return (
//                         <li key={i} className={styles.mediaElement}>
//                             <p className={styles.mediaElemType}>{typeText}</p>
//                             <div>
//                                 <NavigationLink className={styles.white} href={`/news/${a.id}`}>
//                                     <p className={styles.mediaElemTitle}>{a.title}</p>
//                                 </NavigationLink>
//                             </div>
//                             <div className={styles.mediaElemImg}>
//                                 <NavigationLink href={`/news/${a.id}`}>
//                                 <Image fill={true} className={styles.imgCss} src={imgSrc[i]} alt="media image"></Image>
//                                 </NavigationLink>
//                             </div>
//                             <div className={styles.mediaElemViewWrapper}>
//                             <NavigationLink href={`/news/${a.id}`}>
//                                 <div className={styles.mediaElemView}>
//                                     <span className={styles.viewBtn}>{t('read')}</span>
//                                     <span className={styles.arrowPic}><Image src={rightArrow} width={10} alt="right arrow"></Image></span>
//                                 </div>
//                             </NavigationLink>
//                             </div>
//                         </li>
//                     )
//                 })
//             }
//         </ul>
//     )
// }

'use client'

import styles from './styles.module.css'
import Image from 'next/image'
import rightArrow from '@/public/icons/right-arrow-yellow.png'
import { NavigationLink } from '@/ui/NavigationLink'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import useEmblaCarousel from 'embla-carousel-react'
import WheelGesturesPlugin from 'embla-carousel-wheel-gestures'

export function NewsMediaBand({
                                  data,
                                  imgSrc,
                                  index,
                              }: {
    data: any
    imgSrc: any
    index: number
}) {
    const t = useTranslations('media')

    // ✅ 모바일에서만 Embla 활성화
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false
        return window.innerWidth <= 768
    });

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
        <div
            ref={isMobile ? emblaRef : undefined}
            className={`${styles.mediaViewport} ${isMobile ? styles.mediaEmbla : ''}`}
        >
            <ul
                className={`
          ${styles.mediaElementWrapper}
          ${isMobile ? styles.mediaContainer : ''}
        `}
            >
                {data.map((a: any, i: number) => {
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
    )
}
