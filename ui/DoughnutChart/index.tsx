"use client";
import React, {useEffect, useRef, useState} from 'react';
import {Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);
import Image from 'next/image';
import vobPic from '@/public/vob_logo_2.png';
import styles from './styles.module.css';
import data from '@/json/distribution.json';
export const DoughnutChart = ({ handleIdx, index, handleActive, isActive }: {handleIdx:any, index:any, handleActive:any, isActive:any}) => {

    const chartRef = useRef<HTMLDivElement | null>(null);
    const imgRef = useRef<HTMLDivElement | null>(null);
    const textRef = useRef<HTMLDivElement | null>(null);
    const labelRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const valueRef = useRef<HTMLDivElement | null>(null);
    const doughnutRef = useRef<any|null>(null);

    const finalData : any = {
        labels: data.map((item) => item.label),
        datasets: [{
            data: data.map((item) => Math.round(item.value)),
            backgroundColor: data.map((item) => item.color),
            borderColor: 'rgba(255,255,255,0.8)',
            borderWidth: 1,
            spacing: 16,
            offset : new Array(data.length).fill(0),
        }],
    };
    const defaultOptions: any = {
        plugins: {
            tooltip: {
                backgroundColor: '#000',
                borderColor: 'rgba(255,255,255,0.8)',
                borderWidth: 1,
                padding: 16,
                displayColors: false,
                callbacks: {
                    label: (datapoint : any) => {return ` ${datapoint.raw}%`}
                },
            },
            legend: {
                display: false,
            },
        },
        onHover: (event : any, chartElement : any) => {
            if (chartElement.length > 0) {
                let idx = chartElement[0].index;
                setShowImg(false);
                setCurrentIdx(idx);
                handleIdx(idx);
                doughnutRef.current?.update();
            }

        },
        animation : {
            animateScale: true
        },
    };


    const [currentIdx, setCurrentIdx] = useState(index);
    const [showImg, setShowImg] = useState(true);
    const [options, setOptions] = useState<ChartOptions<any>>(defaultOptions);
    const [chartjsData, setChartjsData] = useState<any>(finalData);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {

        labelRef.current!.style.opacity = '0';
        contentRef.current!.style.opacity = '0';
        valueRef.current!.style.opacity = '0';
        labelRef.current!.innerText = data[currentIdx].label;
        contentRef.current!.innerText = data[currentIdx].content + ' EA';
        valueRef.current!.innerText = '[ ' + data[currentIdx].value + '% ]';
        setTimeout(() => {
            labelRef.current!.style.opacity = '1';
            contentRef.current!.style.opacity = '1';
            valueRef.current!.style.opacity = '1';
        }, 500)

        //redraw chart
        const datasets = doughnutRef.current?.data.datasets;
        if (datasets && datasets.length > 0) {
            const backgroundColors = (datasets[0] as any)?.backgroundColor;
            const offsets = (datasets[0] as any)?.offset;
            backgroundColors[currentIdx] = '#1DFCFF';

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
    }, [currentIdx])

    useEffect(() => {
        setShowImg(false);
    }, []);

    useEffect(() => {
        setCurrentIdx(index);
    }, [index]);

    useEffect(() => {
        setShowImg(false);
    }, [isActive]);

    const redrawChart = () => {
        handleActive(false);
        setChartjsData(finalData);
        setShowImg(true);
    }

    const handleClickDown = () => {
        setIsClicked(true);
    }
    const handleClickUp = () => {
        redrawChart();
        setIsClicked(false);
    }

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
                     onMouseDown={handleClickDown}
                     onMouseUp={handleClickUp}
                     onTouchStart={handleClickDown}
                     onTouchEnd={handleClickUp}
                ></div>
                <div ref={textRef} className={`${styles.centerText} ${isClicked ? styles.isClicked : ''}
                        ${showImg ? '' : styles.show}
                    `}>
                    <div className={styles.labelText} ref={labelRef}></div>
                    <div className={styles.contentText} ref={contentRef}></div>
                    <div className={styles.valueText} ref={valueRef}></div>
                </div>
                <div ref={imgRef} className={`${styles.centerImg} ${isClicked ? styles.isClicked : ''}
                    ${showImg ? styles.show : ''}
                `}>
                    <Image
                        className={styles.ml}
                        src={vobPic}
                        width={32}
                        height={49}
                        alt="vob image"
                    />
                </div>
            </div>
    )
}
