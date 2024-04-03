'use client';
import styles from './styles.module.css';
import {useState, useEffect, useRef, RefObject} from "react";
import Image from 'next/image';
import plusPic from '@/public/icons/plus-icon.png';
import minusPic from "@/public/icons/minus-icon.png";
import {useTranslations} from "next-intl";
const accData = [
    {title: "1. Improved Decision Making", content: "AI can analyze massive data from various sources. This helps traders make more informed decisions and identify opportunities that may have been overlooked when traditional methods were taken."},
    {title: "2. Improved Risk Management", content: "AI analyze data in real time and identifies potential risks, allowing traders to take appropriate action to mitigate risks"},
    {title: "3. Improved Efficiency", content: "AI automates certain tasks and processes, allowing traders to focus on more complex tasks that require human expertise"},
    {title: "4. Improved Accuracy", content: "AI algorithms help reduce the risk of errors or mistake sby analyzing data and making decisions based on logic without being swayed by personal emotions or prejudices"},
    {title: "5. Improved Personalization", content: "By analyzing the past behaviors of each trader, AI provides personalized recommendations and adjust strategies to suit their specific needs and preferences"},
]
export const DevsAcc = () => {

    const t = useTranslations('devs.devs_acc');
    const [expandedItems, setExpandedItems ] = useState<{[key:number]:boolean}>({});

    //Function to toggle the content of an item
    const toggleItem = (idx : number) => {
        setExpandedItems((prevState) => ({
          ...prevState as {[key:number] : boolean},
          [idx]: !prevState[idx]
        }));
    }

    useEffect(() => {
        for (const idx in expandedItems) {
            if (expandedItems[idx]) {
                if (divRefs.current[idx].current) {
                    divRefs.current[idx].current!.style.maxHeight = '100px';
                    divRefs.current[idx].current!.style.opacity = '1';
                }
            } else {
                if (divRefs.current[idx].current) {
                    divRefs.current[idx].current!.style.maxHeight = '0';
                    divRefs.current[idx].current!.style.opacity = '0';
                }
            }

        }
    }, [expandedItems])

    const divRefs = useRef<Array<RefObject<HTMLDivElement | null>>>([])

    return (
        <div className={styles.devsAccWrapper}>
            {
                accData.map((elem, idx) => {
                    return (
                        <div className={styles.accElem} key={idx}>
                            <div className={styles.elemTitle} onClick={() => {toggleItem(idx)}}>
                                {t(`${idx}.title`)}
                                {
                                    expandedItems[idx] ?
                                        <Image className="self-end" src={minusPic} width={20} height={20} alt="minus icon"/>
                                    : <Image className="self-end" src={plusPic} width={20} height={20} alt="plus icon"/>
                                }
                            </div>
                            <div
                                className={styles.elemContent}
                                ref={(element) => {divRefs.current[idx] = {current : element}}}
                                onClick={() => {toggleItem(idx)}}
                            >{t(`${idx}.content`)}</div>
                        </div>
                    )
                })
            }
        </div>
    )
}