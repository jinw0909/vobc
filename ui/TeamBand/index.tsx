'use-client';

import styles from "./styles.module.css";
import Image from "next/image";
import {useTranslations} from "next-intl";
import {useEffect, useRef, useState} from "react";
import {spans} from "next/dist/build/webpack/plugins/profiling-plugin";

export function TeamBand({selected, profile, order, registerRef, data} : {selected : any, profile: any, order : any, registerRef:any, data:any}) {

    const t = useTranslations('team');

    const [expanded, setExpanded] = useState<boolean[]>(
        new Array(profile.length).fill(false)
    );

    const toggleItem = (index: number) => {
        setExpanded((prevExpanded) => {
            const newExpanded = [...prevExpanded];
            newExpanded[index] = !newExpanded[index];
            return newExpanded;
        });
    }


    const bandRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);

    useEffect(() => {
        registerRef(order, bandRef.current);
    }, [order, registerRef]);

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;

        const handleWheel = (event: WheelEvent) => {
            if (event.deltaY !== 0) {
                event.preventDefault();
                el.scrollLeft += event.deltaY;
            }
        };

        const updateWheelBehavior = () => {
            if (window.innerWidth <= 768) {
                //enable wheel hijack
                el.addEventListener('wheel', handleWheel, {passive: false});
            } else {
                //disable wheel hijack
                el.removeEventListener('wheel', handleWheel);
            }
        }

        //Initial check
        updateWheelBehavior();

        //Listen to resize and re-check
        window.addEventListener('resize', updateWheelBehavior);

        // Cleanup
        return () => {
            el.removeEventListener('wheel', handleWheel);;
            window.removeEventListener('resize', updateWheelBehavior);
        }
    }, []);

    return (
            <div ref={bandRef} className={`${styles.itemBandWrapper}`}>
                <div className={styles.itemContainer}>
                    {/*<div className={`${selected ? "" : styles.hide} ${styles.itemBand}`}>*/}
                    <div className={`${styles.itemBand}`}>
                        {/*<h2 className={`${selected ? styles.selected : ''}`}>{t(`${order}.title`)}</h2>*/}
                        <h2>{t(`${order}.title`)}</h2>
                        <ul ref={listRef} className={styles.itemList}>
                            {
                                profile.map((a:any, i:any) => {
                                    if (order != 6) {
                                        return (
                                            <li className={styles.item} key={i} onClick={() => toggleItem(i)}>
                                                <div className={styles.itemInner}>
                                                    <div className={styles.profilePic}>
                                                        <div className={styles.imgContainer}>
                                                            <Image
                                                                src={profile[i]}
                                                                alt="ceo"
                                                                fill={true}
                                                                style={{ objectFit: "cover"}}
                                                            />
                                                        </div>
                                                        {
                                                            data[order] && data[order][i] && (
                                                                <>
                                                                    <span className={styles.profileName}>{data[order][i].name}</span>

                                                                </>
                                                            )
                                                        }
                                                    </div>
                                                    <div className={styles.profileDesc}>
                                                        {
                                                            data[order] && data[order][i] && (
                                                                <>
                                                                    <span>{data[order][i].status}</span>
                                                                    <p className={expanded[i] ? styles.show : ''}>
                                                                        {
                                                                            data[order][i].desc.map((a:string, j:number) =>
                                                                                <span key={j}>{a}</span>
                                                                            )
                                                                        }
                                                                        {/*Participation in VC projects as follows: Hycon (HYC) / Cardano (ADA) / VERASITY (VRA) / ICON (ICX) / Electric Vehicle Zone (EVZ) / BlueWhale (BWX) / FuzeX (FXT)*/}
                                                                    </p>
                                                                </>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    } else {
                                        return (
                                            <li className={`${styles.item} ${styles.wide}`} key={i}>
                                                <div className={styles.itemInner}>
                                                    <div className={`${styles.profileDesc} ${styles.wide}`}>
                                                        {
                                                            data[order] && data[order][i] && (
                                                                <>
                                                                    <span>{data[order][i].name}</span>
                                                                    <p>
                                                                        {
                                                                            data[order][i].desc.map((a:string, j:number) =>
                                                                                <span key={j}>{a}</span>
                                                                            )
                                                                        }
                                                                    </p>
                                                                </>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    }
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
    )
}