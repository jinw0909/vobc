"use client";
import React, {useEffect, useRef, useState} from 'react';
import {Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);
import Image from 'next/image';
import vobPic from '@/public/vob_logo_2.png';
import styles from './styles.module.css';
export const DoughnutChart = () => {

    const chartRef = useRef<HTMLDivElement | null>(null);
    const imgRef = useRef<HTMLDivElement | null>(null);
    const textRef = useRef<HTMLDivElement | null>(null);
    const labelRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const valueRef = useRef<HTMLDivElement | null>(null);
    const doughnutRef = useRef<any|null>(null);

    let data = [
        {
            label: "Management Team",
            value: 10,
            content: '24M',
            color: "rgba(255, 255, 255, 0)",
            cutout: "50%",
        },
        {
            label: "Management Team\n(Locked)",
            value: 2,
            content: '6M',
            color: "rgba(255, 255, 255, 0.08)",
            cutout: "50%",
        },
        {
            label: "Reserves",
            value: 8,
            content: '24M',
            color: "rgba(255, 255, 255, 0.16)",
            cutout: "30%",
        },
        {
            label: "Reserves\n(Locked)",
            value: 2,
            content: '6M',
            color: "rgba(255, 255, 255, 0.24)",
            cutout: '50%',
        },
        {
            label: "Community",
            value: 14,
            content: '42M',
            color: "rgba(255, 255, 255, 0.32)",
            cutout: "50%",
        },
        {
            label: "Ecosystem",
            value: 20,
            content: '60M',
            color: "rgba(255, 255, 255, 0.40)",
            cutout: "50%",
        },
        {
            label: "Marketing",
            value: 18,
            content: '54M',
            color: "rgba(255, 255, 255, 0.48)",
            cutout: "50%",
            offset: 0
        },
        {
            label: "Partner",
            value: 6,
            content: '18M',
            color: "rgba(255, 255, 255, 0.56)",
            cutout: "50%",
            offset: 0
        },
        {
            label: "Team/Advisor",
            value: 7,
            content: '21M',
            color: "rgba(255, 255, 255, 0.64)",
            cutout: "50%",
        },
        {
            label: "Development",
            value: 9,
            content: '27M',
            color: "rgba(255, 255, 255, 0.72)",
            cutout: "50%",
        },
        {
            label: "Auto-burn",
            value: 5,
            content: '15M',
            color: "rgba(255, 255, 255, 0.80)",
            cutout: "50%",
        },
        {
            label: "Pre-sale",
            value: 1,
            content: '3M',
            color: "rgba(255, 255, 255, 0.88)",
            cutout: "50%",
        },
    ]
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
                const datasets = doughnutRef.current?.data.datasets;
                if (datasets && datasets.length > 0) {
                    const backgroundColors = (datasets[0] as any)?.backgroundColor;
                    const offsets = (datasets[0] as any)?.offset;
                    backgroundColors[idx] = '#1DFCFF';

                    offsets[idx] = 32;
                    for (let i = 0; i < backgroundColors.length; i++) {
                        if (i !== idx) {
                            backgroundColors[i] = data[i].color;
                            offsets[i] = 0;
                        }
                    }
                } else {
                    console.error("Datasets are undefined or empty.");
                }

                doughnutRef.current?.update();
            }

        },
        animation : {
            animateScale: true
        },
    };


    const [currentIdx, setCurrentIdx] = useState(0);
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
    }, [currentIdx])

    useEffect(() => {
        setShowImg(true);
    }, []);

    const redrawChart = () => {
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
