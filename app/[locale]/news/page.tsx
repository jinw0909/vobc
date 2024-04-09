'use client';
import styles from './styles.module.css'
import {useEffect, useState} from "react";
import image0 from '@/public/news/retriseminar.jpeg';
import image1 from '@/public/news/herald.jpeg';
import image2 from '@/public/news/herald2.jpeg';
import image3 from '@/public/news/herald3.jpeg';

import Image from 'next/image';
export default function Page() {

    const arr = Array(4).fill(0);
    const imgSrc = [image0, image1, image2, image3];

    const [currentIdx, setCurrentIdx] = useState(-1);
    const [isHover, setIsHover] = useState(false);
    const handleClick = (idx:any) => {
        setCurrentIdx(idx);
        setIsHover(true);
    }

    useEffect(() => {
        console.log(currentIdx)
    }, [currentIdx])

    return (
        <div className={styles.newsWrapper}>
            <div className={styles.newsContent}>
                {
                    arr.map((a, i) => {
                        return (
                            <div
                                onClick={() => {handleClick(i)}} key={i}
                                className={`${currentIdx !== i && isHover ? styles.hide : ''}`}
                            >
                                <Image src={imgSrc[i]} fill={true} style={{objectFit: 'cover'}} alt={`news image ${i}`}/>
                                {`news${i}`}
                            </div>
                        )
                    })
                }
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