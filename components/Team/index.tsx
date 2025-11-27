'use client';
import styles from './styles.module.css';
import iconManagement from '@/public/teams/teams_management.png';
import iconBusiness from '@/public/teams/teams_business.png';
import iconEngineering from '@/public/teams/teams_engineering.png';
import iconStrategy from '@/public/teams/teams_strategy.png';
import iconTrading from '@/public/teams/teams_trading.png';
import iconAdvisor from '@/public/teams/teams_advisors.png';
import iconLaw from '@/public/teams/teams_law.png';
import iconSupport from '@/public/teams/teams_finance.png'

import management0 from '@/public/teams/profile/ceo.png';
import management1 from '@/public/teams/profile/coo.png';
import support0 from '@/public/teams/profile/cfo.png';
import support1 from '@/public/teams/profile/kim.png';
import engineering0 from '@/public/teams/profile/cto.png';
import engineering1 from '@/public/teams/profile/hong.png';
import engineering2 from '@/public/teams/profile/sangyong.png';
import engineering3 from '@/public/teams/profile/hunook.png';
import engineering4 from '@/public/teams/profile/hyunjung.png';
import engineering5 from '@/public/teams/profile/doyoon.png';
import engineering6 from '@/public/teams/profile/seoungook.png';
import engineering7 from '@/public/teams/profile/jinwoo.png';
import engineering8 from '@/public/teams/profile/eunmin.png';
import engineering9 from '@/public/teams/profile/hyejin.png';
import engineering10 from '@/public/teams/profile/yunghoo.png';
import engineering11 from '@/public/teams/profile/yaejin.png';
import engineering12 from '@/public/teams/profile/seonga.png';
import strategy0 from '@/public/teams/profile/choi.png';
import strategy1 from '@/public/teams/profile/doo.png';
import strategy2 from '@/public/teams/profile/jowoong.png';
import strategy3 from '@/public/teams/profile/minho.png';
import strategy4 from '@/public/teams/profile/jieun.png';
import strategy5 from '@/public/teams/profile/thichinh.png';
import strategy6 from '@/public/teams/profile/ukyoon.png';
import strategy7 from '@/public/teams/profile/he.png';
import strategy8 from '@/public/teams/profile/jiwoong.png';
import strategy9 from '@/public/teams/profile/byungjung.png';


import trading0 from '@/public/teams/profile/ujung.png';
import trading1 from '@/public/teams/profile/sunghyun.png';
import trading2 from '@/public/teams/profile/harim.png';
import trading3 from '@/public/teams/profile/yungsoo.png';
import advisor0 from '@/public/teams/profile/mrmin.png';
import fallbackImg from '@/public/teams/fallback.png';

import { useEffect, useRef, useState } from "react";
import { TeamNav } from "@/ui/TeamNav";
import { TeamBand } from "@/ui/TeamBand";
import { useLocale } from "next-intl";

const managementPic = [management0, management1];
const supportPic = [support0, support1, fallbackImg]
const engineeringPic = [engineering0, engineering1, engineering2, engineering3, engineering4, engineering5, engineering6, engineering7, engineering8, engineering9, engineering10, engineering11, engineering12, fallbackImg]
const strategyPic = [strategy0, strategy1, strategy2, strategy3, strategy4, strategy5, strategy6, strategy7, strategy8, strategy9];
// const businessPic = [business0, business1, business2, business3];
const tradingPic = [trading0, trading1, trading2, trading3, fallbackImg];
const advisorPic = [advisor0, fallbackImg, fallbackImg, fallbackImg, fallbackImg];
const lawPic = [fallbackImg, fallbackImg];
const iconPic = [iconManagement, iconSupport, iconEngineering, iconBusiness, iconTrading, iconAdvisor, iconLaw];
const profileArr = [managementPic, supportPic, engineeringPic, strategyPic, tradingPic, advisorPic, lawPic];
export function Team() {

    let lang = useLocale();
    console.log("lang from useLocale: ", lang);

    const data = require(`@/json/team_${lang}.json`);

    const [selectedIdx, setSelectedIdx] = useState([true, true, true, true, true, true, true]);
    const bandRefs = useRef<Array<HTMLElement|null>>([]);
    const handleIndex = (i:any) => {
        console.log(i);
        let copy = [...selectedIdx];

        let element = bandRefs.current[i] as HTMLElement;
        if (element) {
            let offset = window.innerWidth > 576 ? 200 : 150;
            let scrollPosition = element.offsetTop - offset;
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            })
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