import styles from "./styles.module.css";
import Image from "next/image";
import {useTranslations} from "next-intl";
import {useEffect, useRef} from "react";

export function TeamBand({selected, profile, order, registerRef, data} : {selected : any, profile: any, order : any, registerRef:any, data:any}) {

    const t = useTranslations('team');
    useEffect(() => {
        registerRef(order, bandRef.current);
    }, []);
    const bandRef = useRef(null);
    return (
            <div ref={bandRef} className={`${styles.itemBandWrapper}`}>
                <div className={styles.itemContainer}>
                    <div className={`${selected ? "" : styles.hide} ${styles.itemBand}`}>
                        <h2 className={`${selected ? styles.selected : ''}`}>{t(`${order}.title`)}</h2>
                        <ul className={styles.itemList}>
                            {
                                profile.map((a:any, i:any) => {
                                    return (
                                        <li className={styles.item} key={i}>
                                            <div className={styles.itemInner}>
                                                <div className={styles.profilePic}>
                                                    <Image src={profile[i]} width={128} height={128} alt="ceo"></Image>
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
                                                            <p>
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
                                                {/*<div className={styles.profileDesc}>*/}
                                                {/*    <span className={styles.profileName}>Iron Won</span>*/}
                                                {/*    {*/}
                                                {/*        data[0][i] && <span>{data[0][i].status}</span>*/}
                                                {/*    }*/}
                                                {/*    <p>*/}
                                                {/*        Participation in VC projects as follows: Hycon (HYC) / Cardano (ADA) / VERASITY (VRA) / ICON (ICX) / Electric Vehicle Zone (EVZ) / BlueWhale (BWX) / FuzeX (FXT)*/}
                                                {/*    </p>*/}
                                                {/*</div>*/}
                                            </div>
                                        </li>)
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
    )
}