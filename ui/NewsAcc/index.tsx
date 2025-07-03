'use client';
import styles from './styles.module.css'
import {useEffect, useState} from "react";
import arrowIcon from '@/public/icons/right-arrow-white.png';
import Image from 'next/image';
import image0 from '@/public/news/herald.jpeg';
import image1 from '@/public/news/herald2.jpeg';
import image2 from '@/public/news/herald3.jpeg';
import image3 from '@/public/news/herald4.jpeg';
import image4 from '@/public/news/cointelegraphimage.png';
import image5 from '@/public/news/retriseminar.jpeg';
import {CloseBtn} from "@/ui/CloseBtn";
import {NavigationLink} from "@/ui/NavigationLink";


export function NewsAcc({data, imgSrc, index}:{data:any, imgSrc:any, index:number}) {

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

    return (
        <div className={`${styles.newsContent} ${isHover ? styles.expand : ''}`}>
            {
                data.map((a:any, i:number) => {
                    return (
                        <div
                            key={i}
                            className={`
                                ${styles.newsElem} ${currentIdx !== i && isHover ? styles.hide : ''}
                                ${currentIdx === i && isHover ? styles.active : ''}
                                ${(i % 2) == 0 ? styles.even : styles.odd}
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
                                                    ${!isHover && (currentIdx == i) ? styles.hide : ''}
                                                    ${showOpen && (currentIdx == i) ? styles.showOpen : ''}
                                                `}><CloseBtn/></div>
                                        </div>
                                    </div>
                                    <div className={styles.newsBody}>
                                        <div className={styles.dateMobile}>{a.date}</div>
                                        <div className={styles.newsTitle}>
                                            <h2>{a.title}</h2>
                                            <p>{`${a.author == '' ? '' : `Reporter: ${a.author}`}`}</p>
                                        </div>
                                        <div className={styles.newsSubtitle}>
                                            <p className={styles.publisher}>{a.press}</p>
                                            <NavigationLink
                                                className={`${styles.learnDetail} ${showOpen ? styles.showOpen : ''}`}
                                                href={`/news/${i + index}`}>
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
    )
}