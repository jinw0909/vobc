"use client";
import React, {useEffect, useRef, useState} from 'react';
import {Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);
import Image from 'next/image';
import vobPic from '@/public/vob_white.png';
import styles from './styles.module.css';
// import data from '@/json/distribution_en.json';
import {useLocale} from "next-intl";
import {useTranslations} from "next-intl";
export const DoughnutChart = ({ handleIdx, index, handleActive, isActive }: {handleIdx:any, index:any, handleActive:any, isActive:any}) => {

    const locale = useLocale();
    const data = require(`@/json/distribution_${locale}.json`);
    const t = useTranslations('distribution');

    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const spacingValue = isMobile ? 16 : 24

    const chartRef = useRef<HTMLDivElement | null>(null);
    const imgRef = useRef<HTMLDivElement | null>(null);
    const textRef = useRef<HTMLDivElement | null>(null);
    const labelRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const valueRef = useRef<HTMLDivElement | null>(null);
    const doughnutRef = useRef<any|null>(null);

    const finalData : any = {
        labels: data.map((item:any) => item.label),
        datasets: [{
            data: data.map((item:any) => Math.round(item.value)),
            backgroundColor: data.map((item:any) => item.color),
            borderColor: 'rgba(255,255,255,0.8)',
            borderWidth: 1,
            spacing: spacingValue,
            offset : new Array(data.length).fill(0),
        }],
    };

    const defaultOptions: any = {
        // layout: {
        //     padding: {
        //         top: 20,
        //         bottom: 20,
        //         left: 20,
        //         right: 20,
        //     }
        // },
        plugins: {
            // tooltip: {
            //     backgroundColor: '#000',
            //     borderColor: 'rgba(255,255,255,0.8)',
            //     borderWidth: 1,
            //     padding: 16,
            //     displayColors: false,
            //     callbacks: {
            //         label: (datapoint : any) => {return ` ${datapoint.raw}%`}
            //     },
            // },
            tooltip: {
                enabled : false
            },
            legend: {
                display: false,
            },
        },
        onClick: (event : any, elements : any[]) => {
            if (elements.length > 0) {
                //console.log('🔔 Chart clicked!', { event, elements });
                const idx = elements[0].index;
                setCurrentIdx(idx);
                handleIdx(idx);
                doughnutRef.current?.update();
            }
            // else {
            //     setCurrentIdx(null);
            // }
        },

        animation : {
            animateScale: true
        },
    };


    const [currentIdx, setCurrentIdx] = useState<number|null>(index ?? null);
    //const [showImg, setShowImg] = useState(true);
    const [options, setOptions] = useState<ChartOptions<any>>(defaultOptions);
    const [chartjsData, setChartjsData] = useState<any>(finalData);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        if (currentIdx == null) return;
        labelRef.current!.innerText = data[currentIdx].label;
        contentRef.current!.innerText = data[currentIdx].content + ` ${t('EA')}`;
        valueRef.current!.innerText = '[ ' + data[currentIdx].value + '% ]';

        //redraw chart
        const datasets = doughnutRef.current?.data.datasets;
        if (datasets && datasets.length > 0) {
            const backgroundColors = (datasets[0] as any)?.backgroundColor;
            const offsets = (datasets[0] as any)?.offset;
            backgroundColors[currentIdx] = 'rgba(180, 180, 30, 0.8)';

            offsets[currentIdx] = 32;
            for (let i = 0; i < backgroundColors.length; i++) {
                if (i !== currentIdx) {
                    backgroundColors[i] = data[i].color;
                    offsets[i] = 0;
                }
            }
        } else {
            console.error("Datasets are undefined or empty.");
        }
        doughnutRef.current.update();
    }, [currentIdx, data, t])

    // useEffect(() => {
    //     setShowImg(false);
    // }, []);

    useEffect(() => {
        setCurrentIdx(index);
    }, [index]);

    // useEffect(() => {
    //     if (isActive) {
    //         setShowImg(false);
    //     }
    // }, [isActive]);

    const redrawChart = () => {
        handleActive(false);
        setCurrentIdx(null);
        setChartjsData(finalData);
    }

    const handleClickDown = () => {
        setIsClicked(true);
    }
    const handleClickUp = () => {
        redrawChart();
        setIsClicked(false);
    }

    const centerVisible = currentIdx === null;
    return (
        <div ref={chartRef} className={styles.chart}>
            <Doughnut
                redraw={true}
                ref={doughnutRef}
                className={styles.doughnut}
                data={chartjsData}
                options={options}
            />
            <div className={`${styles.centerDiv}`}
                 onPointerDown={handleClickDown}
                 onPointerUp={handleClickUp}
                 // onMouseDown={handleClickDown}
                 // onMouseUp={handleClickUp}
                 // onTouchStart={handleClickDown}
                 // onTouchEnd={handleClickUp}
            ></div>
            <div
               ref={textRef}
               className={[
                   styles.centerText,
                   isClicked && styles.isClicked,
                   !centerVisible && styles.show,
               ].filter(Boolean).join(' ')}
            >
            <div className={styles.labelText} ref={labelRef}></div>
            <div className={styles.contentText} ref={contentRef}></div>
            <div className={styles.valueText} ref={valueRef}></div>
        </div>
    <div
        ref={imgRef}
        className={[
            styles.centerImg,
            isClicked && styles.isClicked,
                     centerVisible && styles.show].filter(Boolean).join(' ')}
                 >
                    <Image
                        className={styles.ml}
                        src={vobPic}
                        width={128}
                        height={128}
                        alt="vob image"
                    />
                </div>
            </div>
    )
}
