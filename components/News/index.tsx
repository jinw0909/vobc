'use client';
import styles from './styles.module.css'
import {useEffect, useState} from "react";
import arrowIcon from '@/public/icons/right-arrow-white.png';
import image0 from '@/public/news/retriseminar.jpeg';
import image1 from '@/public/news/herald.jpeg';
import image2 from '@/public/news/herald2.jpeg';
import image3 from '@/public/news/herald3.jpeg';
import {CloseBtn} from "@/ui/CloseBtn";
import {NavigationLink} from "@/ui/NavigationLink";
import data from "@/json/news.json";

import Image from 'next/image';
export function News() {

    const arr = Array(4).fill(0);
    const imgSrc = [image0, image1, image2, image3];
    const [currentIdx, setCurrentIdx] = useState(-1);
    const [isHover, setIsHover] = useState(false);
    const [showOpen, setShowOpen] = useState(false);
    const openNews = (idx:any) => {
        if (isHover) {
            setShowOpen(true);
            setTimeout(() => {
                setShowOpen(false);
            }, 1000)
        }
        setCurrentIdx(idx);
        setIsHover(true);
    }

    useEffect(() => {
        console.log("currentIdx: ", currentIdx);
    }, [currentIdx])

    useEffect(() => {
        console.log("isHover: ", isHover);
    }, [isHover])

    return (
        <div className={styles.newsWrapper}>
            <div className={styles.newsContent}>
                {
                    data.map((a, i) => {
                        return (
                            <div
                                key={i}
                                className={`${styles.newsElem} ${currentIdx !== i && isHover ? styles.hide : ''}
                                    ${currentIdx === i && isHover ? styles.active : ''}
                                `}
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
                                                <div onClick={() => {setIsHover(false)}}
                                                     className={`
                                                        ${styles.closeBtn} 
                                                        ${!isHover ? styles.hide : ''}
                                                        ${showOpen ? styles.showOpen : ''}
                                                    `}><CloseBtn/></div>
                                            </div>
                                        </div>
                                        <div className={styles.newsBody}>
                                            <div className={styles.dateMobile}>{a.date}</div>
                                            <div className={styles.newsTitle}>
                                                <h2>{a.title}</h2>
                                                <p>{`Reporter: ${a.author}`}</p>
                                            </div>
                                            <div className={styles.newsSubtitle}>
                                                <p className={styles.publisher}>{a.press}</p>
                                                <NavigationLink
                                                    className={`${styles.learnDetail} ${showOpen ? styles.showOpen : ''}`}
                                                    href={`/news/${i}`}>
                                                    <span className={styles.learnDetailSpan}>Learn More</span>
                                                    <Image className={styles.rightArrow} src={arrowIcon} width={12} height={12} alt="right arrow"></Image>
                                                </NavigationLink>
                                            </div>
                                        </div>
                                        <div
                                            onClick={() => {openNews(i)}}
                                            className={`
                                                ${styles.newsClick} 
                                                ${isHover ? styles.hide : ''}
                                                ${showOpen ? styles.showOpen : ''}
                                            `}></div>
                                    </div>
                                </div>
                                <Image src={imgSrc[i]} fill={true} style={{objectFit: 'cover'}} alt={`news image ${i}`}/>
                                {`news${i}`}
                            </div>
                        )
                    })
                }
            </div>
            <div className={styles.middleContent}>
                For over a decade VOB foundation has deepend its partnerships with global cryptocurrency exchanges and buisness organizations, including L BANK, CoinTR pro, and multiple domestic exchanges.
                VOBs own token economy initiatives include the rising-X platform, a digital platfrom dedicated to crypto currency trading of the VOB community and the overall token ecosystem including the upcomming NFT project.
                Our collaborations and programs embrace the complexities of the crypto currency landscape by exploring new ideas and perspectives with individuals and organizations
                within and beyond the token ecosystem. The team steering these partnerships and initiatives is the VOB foundation. Our goal is to spark meaningful trading experience,
                cultivate the use of aritificial intelligence in trading, and facilitate NFT project that connects across boundaries by supporting the
                token economy that inspires us all.
            </div>
            <div onClick={() => setIsHover(false)}className={styles.newsContent}>
                <div>news5</div>
                <div>news6</div>
                <div>news7</div>
                <div>news8</div>
            </div>
        </div>
    )
}