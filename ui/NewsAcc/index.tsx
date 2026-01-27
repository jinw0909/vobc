'use client';

import styles from './styles.module.css';
import { useEffect, useState } from "react";
import arrowIcon from '@/public/icons/right-arrow-white.png';
import Image from 'next/image';
import { CloseBtn } from "@/ui/CloseBtn";
import { NavigationLink } from "@/ui/NavigationLink";
import { useRouter } from 'next/navigation';

export function NewsAcc({ data, imgSrc, index }: { data: any, imgSrc: any, index: number }) {

    const router = useRouter();

    const [currentIdx, setCurrentIdx] = useState(-1);
    const [isHover, setIsHover] = useState(false);
    const [showOpen, setShowOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => {
            const isTouch = (
                "ontouchstart" in window ||
                navigator.maxTouchPoints > 0 ||
                window.matchMedia("(pointer: coarse)").matches
            );

            setIsMobile(isTouch);
        };

        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);


    // 모바일: 클릭 → 확장
    const openNews = (idx: number) => {
        if (!isMobile) return;

        if (isHover) {
            setShowOpen(true);
            setTimeout(() => {
                setShowOpen(false);
            }, 1000);
        }

        setCurrentIdx(idx);
        setIsHover(true);
    };

    // 데스크탑: hover로 확장
    const handleMouseEnter = (idx: number) => {
        if (!isMobile) {
            setCurrentIdx(idx);
            setIsHover(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setIsHover(false);
            setCurrentIdx(-1);
        }
    };

    // 카드 클릭 (모바일: 확장, 데스크탑: 바로 이동)
    const handleCardClick = (id: string | number, idx: number) => {
        if (isMobile) {
            openNews(idx);
        } else {
            router.push(`/news/${id}`);
        }
    };

    return (
        <div className={`${styles.newsContent} ${isHover ? styles.expand : ''}`}>
            {data.map((a: any, i: number) => {

                const isActiveMobileCard =
                    isMobile && isHover && currentIdx === i; // 모바일에서 이 카드가 이미 확대된 상태인지

                return (
                    <div
                        key={i}
                        className={`
                            ${styles.newsElem} 
                            ${currentIdx !== i && isHover ? styles.hide : ''}
                            ${currentIdx === i && isHover ? styles.active : ''}
                            ${(i % 2) == 0 ? styles.even : styles.odd}
                        `}
                        onMouseEnter={() => handleMouseEnter(i)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleCardClick(a.id, i)}
                    >
                        {/* 카드 전체를 감싸는 링크 (데스크탑/확대된 모바일에서 동작) */}
                        <NavigationLink
                            href={`/news/${a.id}`}
                            style={{ color: "white" }}
                        >
                            <div className={styles.newsOverlay}>
                                <div className={styles.overlayCenter}>

                                    <div className={styles.newsDetail}>
                                        <div className={styles.detailLeft}>
                                            <div className={styles.publisherMobile}>{a.press}</div>
                                            <div className={styles.detailDate}>{a.date}</div>
                                            <div className={styles.detailDesc}>{a.desc}</div>
                                        </div>
                                        <div className={styles.detailRight}>
                                            {/*<div*/}
                                            {/*    onClick={(e) => {*/}
                                            {/*        e.stopPropagation();*/}
                                            {/*        setIsHover(false);*/}
                                            {/*        setCurrentIdx(-1);*/}
                                            {/*    }}*/}
                                            {/*    className={`*/}
                                            {/*        ${styles.closeBtn}*/}
                                            {/*        ${!isMobile ? styles.hide : ''} */}
                                            {/*        ${!isHover && (currentIdx == i) ? styles.hide : ''}*/}
                                            {/*        ${showOpen && (currentIdx == i) ? styles.showOpen : ''}*/}
                                            {/*    `}*/}
                                            {/*>*/}
                                            {/*    <CloseBtn />*/}
                                            {/*</div>*/}
                                        </div>
                                    </div>

                                    <div className={styles.newsBody}>
                                        <div className={styles.dateMobile}>{a.date}</div>

                                        <div className={styles.newsTitle}>
                                            <h2>{a.title}</h2>
                                            <p>{`${a.author ? `Reporter: ${a.author}` : ''}`}</p>
                                        </div>

                                        <div className={styles.newsSubtitle}>
                                            <p className={styles.publisher}>{a.press}</p>
                                            <div
                                                className={`
                                                    ${styles.learnDetail} 
                                                    ${showOpen ? styles.showOpen : ''}
                                                    ${isMobile ? styles.showOpen : ''}
                                                `}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <span className={styles.learnDetailSpan}>Learn More</span>
                                                <Image
                                                    className={styles.rightArrow}
                                                    src={arrowIcon}
                                                    width={12}
                                                    height={12}
                                                    alt="right arrow"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Image
                                src={imgSrc[i]}
                                fill={true}
                                style={{ objectFit: 'cover' }}
                                alt={`news image ${i}`}
                                unoptimized
                            />

                            {`news${i}`}
                        </NavigationLink>

                        {/* ✅ 모바일 전용 클릭 오버레이: "아직 안 펼쳐졌을 때만" 위에 깔림 */}
                        {isMobile && !isActiveMobileCard && (
                            <div
                                className={styles.mobileOverlay}
                                onClick={(e) => {
                                    e.stopPropagation(); // 링크로 안 넘어가게
                                    openNews(i);         // 첫 클릭: 확장
                                }}
                            />
                        )}

                        {/* ✅ 모바일 전용: 확대된 상태일 때만 보이는 closeBtn (NavigationLink의 sibling) */}
                        {isMobile && isActiveMobileCard && (
                            <button
                                type="button"
                                className={styles.closeFloating}
                                onClick={(e) => {
                                    e.stopPropagation(); // 주변에 다른 핸들러 방지
                                    setIsHover(false);
                                    setCurrentIdx(-1);   // 축소
                                }}
                            >
                                <CloseBtn />
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
