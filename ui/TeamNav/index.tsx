import styles from './styles.module.css'
import Image from "next/image";
import iconManagement from "@/public/teams/teams_management.png";
import iconEngineering from "@/public/teams/teams_engineering.png";
import iconStrategy from "@/public/teams/teams_strategy.png";
import iconBusiness from "@/public/teams/teams_business.png";
import iconTrading from "@/public/teams/teams_trading.png";
import iconAdvisor from "@/public/teams/teams_advisors.png";
import iconLaw from "@/public/teams/teams_law.png";
import {useEffect, useState} from "react";
import {useTranslations} from "next-intl";
export function TeamNav({iconPic, handleIndex, selectedIdx} : { iconPic : any, handleIndex : any, selectedIdx : any }) {
    const t = useTranslations('team');
    // const [selectedIdx, setSelectedIdx] = useState([true, true, true, true, true, true, true]);
    // const handleIndex = (i:any) => {
    //     console.log(i);
    //     let copy = [...selectedIdx];
    //     copy[i] = !copy[i];
    //     setSelectedIdx(copy);
    // }
    // useEffect(() => {
    //     console.log(selectedIdx);
    // }, [selectedIdx])

    return (
        <div className={styles.headbandWrapper}>
            <div className={styles.container}>
                <div className={styles.headband}>
                    <ul className={styles.list}>
                        {
                            selectedIdx.map((a:any, i:number) => {
                                return (
                                    <li key={i} className={`${styles.elem} ${selectedIdx[i] ? styles.selected : ''}`}
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
                        {/*<li className={`${styles.elem} ${selectedIdx[0] ? styles.selected : ''}`} onClick={() => handleIndex(0)}>*/}
                        {/*    <div className={styles.elemInner}>*/}
                        {/*        <div className={styles.teamIcon}>*/}
                        {/*            <Image className={styles.teamIcon} src={iconManagement} width={64} height={64} alt="management icon"/>*/}
                        {/*        </div>*/}
                        {/*        <div className={styles.iconDesc}>*/}
                        {/*            <span>Management</span>*/}
                        {/*            <span>Index</span>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</li>*/}
                        {/*<li className={`${styles.elem} ${selectedIdx[1] ? styles.selected : ''}`} onClick={() => handleIndex(1)}>*/}
                        {/*    <div className={styles.elemInner}>*/}
                        {/*        <div className={styles.teamIcon}>*/}
                        {/*            <Image src={iconEngineering} width={64} height={64} alt="engineering icon"/>*/}
                        {/*        </div>*/}
                        {/*        <div className={styles.iconDesc}>*/}
                        {/*            <span>Engineering</span>*/}
                        {/*            <span>Index</span>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</li>*/}
                        {/*<li className={`${styles.elem} ${selectedIdx[2] ? styles.selected : ''}`} onClick={() => handleIndex(2)}>*/}
                        {/*    <div className={styles.elemInner}>*/}
                        {/*        <div className={styles.teamIcon}>*/}
                        {/*            <Image src={iconStrategy} width={64} height={64} alt="strategy icon"/>*/}
                        {/*        </div>*/}
                        {/*        <div className={styles.iconDesc}>*/}
                        {/*            <span>Strategy</span>*/}
                        {/*            <span>Index</span>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</li>*/}
                        {/*<li className={`${styles.elem} ${selectedIdx[3] ? styles.selected : ''}`} onClick={() => handleIndex(3)}>*/}
                        {/*    <div className={styles.elemInner}>*/}
                        {/*        <div className={styles.teamIcon}>*/}
                        {/*            <Image src={iconBusiness} width={64} height={64} alt="business icon"/>*/}
                        {/*        </div>*/}
                        {/*        <div className={styles.iconDesc}>*/}
                        {/*            <span>Business</span>*/}
                        {/*            <span>Index</span>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</li>*/}
                        {/*<li className={`${styles.elem} ${selectedIdx[4] ? styles.selected : ''}`} onClick={() => handleIndex(4)}>*/}
                        {/*    <div className={styles.elemInner}>*/}
                        {/*        <div className={styles.teamIcon}>*/}
                        {/*            <Image src={iconTrading} width={64} height={64} alt="trading icon"/>*/}
                        {/*        </div>*/}
                        {/*        <div className={styles.iconDesc}>*/}
                        {/*            <span>Trading</span>*/}
                        {/*            <span>Index</span>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</li>*/}
                        {/*<li className={`${styles.elem} ${selectedIdx[4] ? styles.selected : ''}`} onClick={() => handleIndex(4)}>*/}
                        {/*    <div className={styles.elemInner}>*/}
                        {/*        <div className={styles.teamIcon}>*/}
                        {/*            <Image src={iconAdvisor} width={64} height={64} alt="trading icon"/>*/}
                        {/*        </div>*/}
                        {/*        <div className={styles.iconDesc}>*/}
                        {/*            <span>External</span>*/}
                        {/*            <span>Advisors</span>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</li>*/}
                        {/*<li className={`${styles.elem} ${selectedIdx[4] ? styles.selected : ''}`} onClick={() => handleIndex(4)}>*/}
                        {/*    <div className={styles.elemInner}>*/}
                        {/*        <div className={styles.teamIcon}>*/}
                        {/*            <Image src={iconLaw} width={64} height={64} alt="trading icon"/>*/}
                        {/*        </div>*/}
                        {/*        <div className={styles.iconDesc}>*/}
                        {/*            <span>Defense</span>*/}
                        {/*            <span>Counsel</span>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</li>*/}
                    </ul>
                </div>

            </div>
        </div>
    )
}