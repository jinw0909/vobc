'use client';
import styles from './styles.module.css';
import {useState, useEffect, useRef} from "react";
import Image from 'next/image';
import plusPic from '@/public/icons/plus-icon.png';
import minusPic from "@/public/icons/minus-icon.png"
const accData = [
    {title: "1. Improved Decision Making", content: "AI can analyze massive data from various sources. This helps traders make more informed decisions and identify opportunities that may have been overlooked when traditional methods were taken."},
    {title: "2. Improved Risk Management", content: "AI analyze data in real time and identifies potential risks, allowing traders to take appropriate action to mitigate risks"},
    {title: "3. Improved Efficiency", content: "AI automates certain tasks and processes, allowing traders to focus on more complex tasks that require human expertise"},
    {title: "4. Improved Accuracy", content: "AI algorithms help reduce the risk of errors or mistake sby analyzing data and making decisions based on logic without being swayed by personal emotions or prejudices"},
    {title: "5. Improved Personalization", content: "By analyzing the past behaviors of each trader, AI provides personalized recommendations and adjust strategies to suit their specific needs and preferences"},
]
export const DevsAcc = () => {

    const [expandedItems, setExpandedItems ] = useState({});

    //Function to toggle the content of an item
    const toggleItem = (idx) => {
        setExpandedItems((prevState) => ({
          ...prevState,
          [idx]: !prevState[idx]
        }));
    }

    useEffect(() => {
        for (const idx in expandedItems) {
            if (expandedItems[idx]) {
                divRefs.current[idx].style.maxHeight = '100px';
                divRefs.current[idx].style.opacity = 1;
            } else {
                divRefs.current[idx].style.maxHeight = 0;
                divRefs.current[idx].style.opacity = 0;
            }

        }
    }, [expandedItems])

    // const [selectedIdx, setSelectedIdx] = useState(-1);
    const divRefs = useRef([])
    // const handleClick = (idx) => {
    //     setSelectedIdx(idx);
    //     accData.map((a, i) => {
    //        if (i == idx) {
    //            divRefs.current[i].style.maxHeight = '100px';
    //            divRefs.current[i].style.opacity = 1;
    //        } else {
    //            divRefs.current[i].style.maxHeight = 0;
    //            divRefs.current[i].style.opacity = 0;
    //        }
    //    })
    //
    // }

    return (
        <div className={styles.devsAccWrapper}>
            {
                accData.map((elem, idx) => {
                    return (
                        <div className={styles.accElem} key={idx}>
                            <div className={styles.elemTitle} onClick={() => {toggleItem(idx)}}>
                                {elem.title}
                                {
                                    expandedItems[idx] ?
                                        <Image className="self-end" src={minusPic} width={20} height={20} alt="minus icon"/>
                                    : <Image className="self-end" src={plusPic} width={20} height={20} alt="plus icon"/>
                                }
                            </div>
                            <div className={styles.elemContent} ref={(element) => {divRefs.current[idx] = element}}>{elem.content}</div>
                        </div>
                    )
                })
            }
        </div>
    )
}