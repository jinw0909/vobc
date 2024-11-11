'use client';
import {useEffect, useRef, useState} from 'react';
import styles from './styles.module.css';
import Image, {StaticImageData} from 'next/image';
import october from '@/public/roadmap/october.png';
import october1 from '@/public/roadmap/october1.png';
import may from '@/public/roadmap/may.png';
import december from '@/public/roadmap/december.png';
import june from '@/public/roadmap/june.png';
import february from '@/public/roadmap/february.png';
import september from '@/public/roadmap/september.png';
import march from '@/public/roadmap/march.png';
import {useTranslations} from "next-intl";

// import lbankLogo from "@/public/exchange/lbank-logo-yellow.webp";
// import cointrLogo from "@/public/exchange/cointrwhite-logo.png";
// import deepcoinLogo from "@/public/exchange/deepcoinLogo.png";

export function Roadmap() {
    const t = useTranslations('roadmap');
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [clickedIndex, setClickedIndex] = useState<number | null>(null);

    const roadmapData = [
        { index: 7, date: 'Q1 2025', title: 'Launch of VOB NFT Project', content: 'Introducing the VOB NFT project to further enhance the platform\'s ecosystem and user engagement.', backgroundImage: 'march' },
        { index: 6, date: 'Q3 2024', title: 'Full Launch of Rising X Platform', content: 'The VOB token will act as the primary payment currency, enabling global growth on the Rising X platform.', backgroundImage: 'september' },
        { index: 5, date: 'October 2023', title: 'Rising X Beta Platform Launch', content: 'Initiation of the Rising X platform in beta, paving the way for future releases.', backgroundImage: 'october' },
        { index: 4, date: 'October 2023', title: 'System Enhancements', content: 'Launch of ReTri\'s advanced computing system and GOYABOT\'s premium chart feature.', backgroundImage: 'october1' },
        { index: 3, date: 'May 2023', title: 'GoyaBot 5.0 Launch & Global Expansion', content: 'Release of a complete automated trading bot and expanded global reach through online channels.', backgroundImage: 'may' },
        { index: 2, date: 'December 2022', title: 'Listing on LBank CEX Exchange', content: 'Successfully listed on LBank, a leading centralized exchange.', backgroundImage: 'december' },
        { index: 1, date: 'June 2017', title: 'Arbitrage Trading Data Collection and Analysis', content: 'Research and compilation of six years of data on arbitrage trading and historical crypto market patterns for deeper market insights.', backgroundImage: 'june' },
        { index: 0, date: 'February 2017', title: 'Crypto Price Prediction', content: 'Visualized projections of crypto prices based on GoyaBot\'s AI-driven analysis, forecasting future trends with the Goya score.', backgroundImage: 'february' },
    ];

    const imageMap: { [key: string]: StaticImageData } = {
        october,
        october1,
        may,
        december,
        june,
        february,
        september,
        march
    };

    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            const wrapper = wrapperRef.current;

            if (!wrapper) return;

            // Prevent the default only for vertical scroll (deltaY)
            if (event.deltaY !== 0) {
                event.preventDefault(); // Prevent vertical scroll from affecting the page
                wrapper.scrollLeft += event.deltaY; // Apply vertical scroll delta to horizontal scroll
            }
            // Allow native horizontal scroll (deltaX) to work without interference
        };

        // Add the wheel event listener with passive: false
        const wrapper = wrapperRef.current;
        if (wrapper) {
            wrapper.addEventListener('wheel', handleWheel, { passive: false });
        }

        // Cleanup the event listener on component unmount
        return () => {
            if (wrapper) {
                wrapper.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    const handleClick = (index: number) => {
        setClickedIndex(clickedIndex === index ? null : index); // Toggle the clicked item
    };

    // @ts-ignore
    return (
        <div className={styles.roadmap}>
            <div className={styles.roadmapTitle}>{t('title')}</div>
            {/*<div className={styles.roadmapContainer}>*/}
                <div ref={wrapperRef} className={styles.roadmapWrapper}>
                {roadmapData.map((item, index) => (
                    <div
                        key={index}
                        className={`${styles.roadmapElem} ${clickedIndex === index ? styles.clicked : ''}`}
                        onClick={() => handleClick(index)}
                    >
                        <div className={styles.roadmapElemHead}>{t(`${item.index}.date`)}</div>
                        <div className={styles.roadmapElemBody}>
                            <div className={styles.roadmapBodyTitle}>{t(`${item.index}.title`)}</div>
                            <div className={styles.roadmapBodyContent}>{t(`${item.index}.content`)}</div>
                        </div>
                        <div className={styles.backgroundWhite}></div>
                        <div className={styles.roadmapBackground}>
                            <Image
                                src={imageMap[item.backgroundImage]}
                                style={{objectFit: "cover"}}
                                alt={`${item.date} background`}
                                fill={true}
                            />
                        </div>
                    </div>
                ))}
            </div>
            {/*</div>*/}
        </div>
    );
}
