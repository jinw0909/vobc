'use client';
import styles from './styles.module.css';
import iconManagement from '@/public/teams/teams_management.png';
import iconBusiness from '@/public/teams/teams_business.png';
import iconEngineering from '@/public/teams/teams_engineering.png';
import iconStrategy from '@/public/teams/teams_strategy.png';
import iconTrading from '@/public/teams/teams_trading.png';
import iconAdvisor from '@/public/teams/teams_advisors.png';
import iconLaw from '@/public/teams/teams_law.png';
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
import advisor0 from '@/public/teams/profile/mrmin.png';
import fallbackImg from '@/public/teams/profile/fallback.png';
import rightArrow from '@/public/icons/right-arrow-white.png';
import { useEffect, useRef, useState } from "react";
import { TeamNav } from "@/ui/TeamNav";
import { TeamBand } from "@/ui/TeamBand";

const managementPic = [management0, management1, fallbackImg, management2, management3];
const engineeringPic = [engineering0, engineering1, engineering2, engineering3, engineering4, engineering5, engineering6, engineering7, engineering8, engineering9, fallbackImg]
const strategyPic = [strategy0, strategy1, strategy2, fallbackImg, fallbackImg, fallbackImg];
const businessPic = [business0, business1, business2, fallbackImg ,fallbackImg, business3];
const tradingPic = [trading0, fallbackImg, fallbackImg];
const advisorPic = [advisor0, fallbackImg, fallbackImg];
const lawPic = [fallbackImg, fallbackImg];
const iconPic = [iconManagement, iconEngineering, iconStrategy, iconBusiness, iconTrading, iconAdvisor, iconLaw];
const profileArr = [managementPic, engineeringPic, strategyPic, businessPic, tradingPic, advisorPic, lawPic];
export function Team() {

    const data = require('@/json/team_en.json');

    const [selectedIdx, setSelectedIdx] = useState([true, true, true, true, true, true, true]);
    const bandRefs = useRef<Array<HTMLElement|null>>([]);
    const handleIndex = (i:any) => {
        console.log(i);
        let copy = [...selectedIdx];
        // if (!copy[i]) {
        //     let element = bandRefs.current[i] as HTMLElement;
        //     if (element) {
        //         element.scrollIntoView({behavior: 'smooth', block: 'center'})
        //     }
        // }
        let element = bandRefs.current[i] as HTMLElement;
        if (element) {
            let offset = window.innerWidth > 769 ? 200 : 150;
            let scrollPosition = element.offsetTop - offset;
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            })
            // element.scrollIntoView({behavior: 'smooth', block: 'start'})
        }
        copy[i] = !copy[i];
        setSelectedIdx(copy);
    }
    useEffect(() => {
        console.log(selectedIdx);
        console.log(bandRefs);
    }, [selectedIdx])

    const registerRef = (index : any, ref: HTMLElement | null) => {
        bandRefs.current[index] = ref;
    }



    return (
        <div className={styles.teamWrapper}>
            <TeamNav iconPic={iconPic} handleIndex={handleIndex} selectedIdx={selectedIdx}/>
            <div className={styles.mainContent}>
                {
                    selectedIdx.map((a, i) => {
                        return (
                            <TeamBand data={data} key={i} selected={selectedIdx[i]} profile={profileArr[i]} order={i} registerRef={registerRef}/>
                        )
                    })
                }
            </div>
        </div>
    )
}