'use client';
import styles from './styles.module.css';
import  { DoughnutChart } from '@/ui/DoughnutChart';
import {DistDetail} from "@/ui/DistDetail";
import { useState, useEffect } from "react";
import {useTranslations} from "next-intl";
export const Distribution = () => {

    const t = useTranslations('distribution');

    const [index, setIndex] = useState(null);
    const [isActive, setIsActive] = useState(true);
    const handleIdx = (idx:any) => {
        setIsActive(true);
        setIndex(idx);
    }
    const handleActive = (state:any) => {
        setIsActive(state);
    }

    return (
        <div className={styles.distributionWrapper}>
            <div className={styles.distMain}>
                <DoughnutChart isActive={isActive} index={index} handleIdx={handleIdx} handleActive={handleActive}/>
                <DistDetail isActive={isActive} index={index} handleIdx={handleIdx}/>
            </div>
        </div>
    )
}