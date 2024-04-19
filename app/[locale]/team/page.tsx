'use client';
import styles from './styles.module.css';
import iconManagement from '@/public/teams/teams_management.png';
import iconBusiness from '@/public/teams/teams_business.png';
import iconEngineering from '@/public/teams/teams_engineering.png';
import iconStrategy from '@/public/teams/teams_strategy.png';
import iconTrading from '@/public/teams/teams_trading.png';
import Image from 'next/image';
import management0 from '@/public/teams/profile/ceo.png';
import management1 from '@/public/teams/profile/cfo.png';
import management2 from '@/public/teams/profile/kim.png';
import management3 from '@/public/teams/profile/kunduz.png';
import engineering0 from '@/public/teams/profile/cto.png';
import engineering1 from '@/public/teams/profile/hong.png';
import engineering2 from '@/public/teams/profile/hunook.png';
import engineering3 from '@/public/teams/profile/eunmin.png';
import engineering4 from '@/public/teams/profile/insup.png';
import engineering5 from '@/public/teams/profile/chanyoung.png';
import engineering6 from '@/public/teams/profile/doyoon.png';
import engineering7 from '@/public/teams/profile/hyunjung.png';
import engineering8 from '@/public/teams/profile/seoungook.png';
import engineering9 from '@/public/teams/profile/jinwoo.png';
import strategy0 from '@/public/teams/profile/coo.png';
import strategy1 from '@/public/teams/profile/choi.png';
import strategy2 from '@/public/teams/profile/minho.png';
import business0 from '@/public/teams/profile/son.png';
import business1 from '@/public/teams/profile/doo.png';
import business2 from '@/public/teams/profile/yu.png';
import business3 from '@/public/teams/profile/minjung.png';
import trading0 from '@/public/teams/profile/koo.png';
import rightArrow from '@/public/icons/right-arrow-white.png';
import {useEffect, useState} from "react";

const managementPic = [management0, management1, management2, management3];
const engineeringPic = [engineering0, engineering1, engineering2, engineering3, engineering4, engineering5, engineering6, engineering7, engineering8, engineering9]
const strategyPic = [strategy0, strategy1, strategy2];
const businessPic = [business0, business1, business2, business3];
const tradingPic = [trading0];

export default function Page() {

    const [selectedIdx, setSelectedIdx] = useState([true, true, true, true, true]);
    const handleIndex = (i:any) => {
        console.log(i);
        let copy = [...selectedIdx];
        copy[i] = !copy[i];
        setSelectedIdx(copy);
    }
    useEffect(() => {
        console.log(selectedIdx);
    }, [selectedIdx])

    return (
        <div className={styles.teamWrapper}>
            <div className={styles.headbandWrapper}>
                <div className={styles.container}>
                    <div className={styles.headband}>
                        <ul className={styles.list}>
                            <li className={styles.elem} onClick={() => handleIndex(0)}>
                                <div className={styles.elemInner}>
                                    <div className={styles.teamIcon}>
                                    <Image src={iconManagement} width={64} height={64} alt="management icon"/>
                                    </div>
                                    <div className={styles.iconDesc}>Management<br/>Team</div>
                                </div>
                            </li>
                            <li className={styles.elem} onClick={() => handleIndex(1)}>
                                <div className={styles.elemInner}>
                                    <div className={styles.teamIcon}>
                                    <Image src={iconEngineering} width={64} height={64} alt="engineering icon"/>
                                    </div>
                                    <div className={styles.iconDesc}>Engineering<br/>Team</div>
                                </div>
                            </li>
                            <li className={styles.elem} onClick={() => handleIndex(2)}>
                                <div className={styles.elemInner}>
                                    <div className={styles.teamIcon}>
                                    <Image src={iconStrategy} width={64} height={64} alt="strategy icon"/>
                                    </div>
                                    <div className={styles.iconDesc}>Strategy<br/>Team</div>
                                </div>
                            </li>
                            <li className={styles.elem} onClick={() => handleIndex(3)}>
                                <div className={styles.elemInner}>
                                    <div className={styles.teamIcon}>
                                    <Image src={iconBusiness} width={64} height={64} alt="business icon"/>
                                    </div>
                                    <div className={styles.iconDesc}>Business<br/>Team</div>
                                </div>
                            </li>
                            <li className={styles.elem} onClick={() => handleIndex(4)}>
                                <div className={styles.elemInner}>
                                    <div className={styles.teamIcon}>
                                    <Image src={iconTrading} width={64} height={64} alt="trading icon"/>
                                    </div>
                                    <div className={styles.iconDesc}>Trading<br/>Team</div>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
            <div className={styles.mainContent}>
                <div className={`${styles.itemBandWrapper}`}>
                    <div className={styles.itemContainer}>
                        <h2>Management Team</h2>
                        <div className={`${selectedIdx[0] ? "" : styles.hide} ${styles.itemBand}`}>
                            <ul className={styles.itemList}>
                                {
                                    managementPic.map((a, i) => {
                                        return (
                                        <li className={styles.item} key={i}>
                                            <div className={styles.itemInner}>
                                                <div className={styles.profilePic}>
                                                    <Image src={managementPic[i]} width={128} height={128} alt="ceo"></Image>
                                                </div>
                                                <div className={styles.profileDesc}>
                                                    <span>CEO</span>
                                                    <p>
                                                        Participation in VC projects as follows: Hycon (HYC) / Cardano (ADA) / VERASITY (VRA) / ICON (ICX) / Electric Vehicle Zone (EVZ) / BlueWhale (BWX) / FuzeX (FXT)
                                                    </p>
                                                </div>
                                            </div>
                                        </li>)
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={`${styles.itemBandWrapper}`}>
                    <h2>Engineering Team</h2>
                    <div className={styles.itemContainer}>
                        <div className={`${selectedIdx[1] ? "" : styles.hide} ${styles.itemBand}`}>
                            <ul className={styles.itemList}>
                                {
                                    engineeringPic.map((a, i) => {
                                        return (
                                            <li className={styles.item} key={i}>
                                                <div className={styles.itemInner}>
                                                    <div className={styles.profilePic}>
                                                        <Image src={engineeringPic[i]} width={128} height={128} alt="ceo"></Image>
                                                    </div>
                                                    <div className={styles.profileDesc}>
                                                        <span>CTO</span>
                                                        <p>
                                                            The executive developer of the GOYA AI
                                                            Engagement in arbitrage trading and market data analysis for over six years
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>)
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={`${selectedIdx[2] ? "" : styles.hide} ${styles.itemBandWrapper}`}>
                    <h2>Strategy Team</h2>
                    <div className={`${selectedIdx[2] ? "" : styles.hide} ${styles.itemBand}`}>
                        <div className={styles.itemBand}>
                            <ul className={styles.itemList}>
                                {
                                    strategyPic.map((a, i) => {
                                        return (
                                            <li className={styles.item} key={i}>
                                                <div className={styles.itemInner}>
                                                    <div className={styles.profilePic}>
                                                        <Image src={strategyPic[i]} width={128} height={128} alt="ceo"></Image>
                                                    </div>
                                                    <div className={styles.profileDesc}>
                                                        <span>COO</span>
                                                        <p>
                                                            The co-founder of Blocksquare
                                                            Engagement in arbitrage trading and market data analysis for over six years
                                                            The executive marketer for overseas VOB expansion in over 20 nations
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>)
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={`${selectedIdx[3] ? "" : styles.hide} ${styles.itemBandWrapper}`}>
                    <h2>Business Team</h2>
                    <div className={styles.itemContainer}>
                        <div className={`${selectedIdx[3] ? "" : styles.hide} ${styles.itemBand}`}>
                            <ul className={styles.itemList}>
                                {
                                    businessPic.map((a, i) => {
                                        return (
                                            <li className={styles.item} key={i}>
                                                <div className={styles.itemInner}>
                                                    <div className={styles.profilePic}>
                                                        <Image src={businessPic[i]} width={128} height={128} alt="ceo"></Image>
                                                    </div>
                                                    <div className={styles.profileDesc}>
                                                        <span>SON</span>
                                                        <p>
                                                            Business Director
                                                            Ehwa University
                                                            Participation in ETH projects
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>)
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={`${selectedIdx[4] ? "" : styles.hide} ${styles.itemBandWrapper}`}>
                    <h2>Trading Team</h2>
                    <div className={styles.itemContainer}>
                        <div className={`${selectedIdx[4] ? "" : styles.hide} ${styles.itemBand}`}>
                            <ul className={styles.itemList}>
                                {
                                    tradingPic.map((a, i) => {
                                        return (
                                            <li className={styles.item} key={i}>
                                                <div className={styles.itemInner}>
                                                    <div className={styles.profilePic}>
                                                        <Image src={tradingPic[i]} width={128} height={128} alt="ceo"></Image>
                                                    </div>
                                                    <div className={styles.profileDesc}>
                                                        <span>KOO</span>
                                                        <p>
                                                            Data Director
                                                            Professional trade analyst
                                                            Professional cryptocurrency broadcaster
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>)
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}