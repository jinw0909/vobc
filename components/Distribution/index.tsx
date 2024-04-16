'use client';
import styles from './styles.module.css';
import  { DoughnutChart } from '@/ui/DoughnutChart';
import {DistDetail} from "@/ui/DistDetail";
import { useState, useEffect } from "react";
export const Distribution = () => {
    const [index, setIndex] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const handleIdx = (idx:any) => {
        setIsActive(true);
        setIndex(idx);
    }
    const handleActive = (state:any) => {
        setIsActive(state);
    }

    useEffect(() => {
    }, [index]);

    return (
        <div>
            <div className={styles.title}>VOB Token<br/>Distribution Model</div>
            <DoughnutChart isActive={isActive} index={index} handleIdx={handleIdx} handleActive={handleActive}/>
            <DistDetail isActive={isActive} index={index} handleIdx={handleIdx}/>
        </div>
    )
}