'use client'
import styles from './styles.module.css'
import Image from "next/image";
import iconManagement from "@/public/teams/teams_management.png";
import iconEngineering from "@/public/teams/teams_engineering.png";
import iconStrategy from "@/public/teams/teams_strategy.png";
import iconBusiness from "@/public/teams/teams_business.png";
import iconTrading from "@/public/teams/teams_trading.png";
import iconAdvisor from "@/public/teams/teams_advisors.png";
import iconLaw from "@/public/teams/teams_law.png";
import {useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";
export function TeamNav({iconPic, handleIndex, selectedIdx} : { iconPic : any, handleIndex : any, selectedIdx : any }) {
    const t = useTranslations('team');
    const wrapperRef = useRef<HTMLUListElement | null>(null);

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return

        // apply only when width < 768
        if (window.innerWidth >= 768) return;

        const handleWheel = (event: WheelEvent) => {
            if (event.deltaY !== 0) {
                event.preventDefault();
                el.scrollLeft += event.deltaY;
            }
        };

        const updateWheelBehavior = () => {
            if (window.innerWidth < 768) {
                el.addEventListener('wheel', handleWheel, {passive: false});
            } else {
                el.removeEventListener('wheel', handleWheel);
            }
        }

        updateWheelBehavior();
        window.addEventListener('resize', updateWheelBehavior);

        return () => {
            el.removeEventListener('wheel', handleWheel);
            window.removeEventListener('resize', updateWheelBehavior);
        }
    }, []);

    return (
        <div className={styles.headbandWrapper}>
            <div className={styles.container}>
                <div className={styles.headband}>
                    <ul ref={wrapperRef} className={styles.list}>
                        {
                            selectedIdx.map((a:any, i:number) => {
                                return (
                                    <li key={i} className={`${styles.elem}`}
                                        onClick={() => {handleIndex(i)}}>
                                        <div className={styles.elemInner}>
                                            <div className={styles.teamIcon}>
                                                <Image className={styles.teamIcon} src={iconPic[i]} width={64} height={64} alt="team icon"/>
                                            </div>
                                            <div className={styles.iconDesc}>
                                                <span>{t(`${i}.first`)}</span>
                                                <span>{t(`${i}.second`)}</span>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>

            </div>
        </div>
    )
}