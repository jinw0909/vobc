"use client";
import React, {useEffect, useRef, useState} from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Doughnut, getElementAtEvent} from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);
import Image from 'next/image';
import vobPic from '@/public/vob_logo_2.png';
import styles from './styles.module.css'
export const DoughnutChart = () => {

    const chartRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);
    const valueRef = useRef<HTMLDivElement>(null);

    const handleMouseOut = () => {
        setShowImg(true);
    }

    const [currentIdx, setCurrentIdx] = useState(0);
    const [showImg, setShowImg] = useState(true);

    useEffect(() => {
        //console.log(data[currentIdx].label, data[currentIdx].value);
        // console.log(data[currentIdx].value);
        // console.log(data[currentIdx].label);
        //textRef.current.style.opacity = 0;
        setShowImg(false);
        labelRef.current!.style.opacity = '0';
        valueRef.current!.style.opacity = '0';
        labelRef.current!.innerText = data[currentIdx].label;
        valueRef.current!.innerText = data[currentIdx].value + '%';
        setTimeout(() => {
            labelRef.current!.style.opacity = '1';
        }, 500)
        setTimeout(() => {
            valueRef.current!.style.opacity = '1';
        }, 1000)

    }, [currentIdx])

    useEffect(() => {
        if (showImg) {
            imgRef.current!.style.opacity = '1';
            textRef.current!.style.opacity = '0';
        } else {
            imgRef.current!.style.opacity = '0';
            textRef.current!.style.opacity = '1';
        }
    }, [showImg])

    // useEffect(() => {
    //     document.addEventListener('mousedown', handleOutsideClick);
    //
    //     return () => {
    //         document.removeEventListener('mousedown', handleOutsideClick);
    //     }
    // }, [])

    let data = [
        {
            label: "Management Team",
            value: 10,
            color: "rgba(255, 255, 255, 0)",
            cutout: "50%",
            datalabels: {
                color: 'yellow'
            }
        },
        {
            label: "Management Team\n(Locked)",
            value: 2,
            color: "rgba(255, 255, 255, 0.08)",
            cutout: "50%",
        },
        {
            label: "Reserves",
            value: 8,
            color: "rgba(255, 255, 255, 0.16)",
            cutout: "30%",
        },
        {
            label: "Reserves\n(Locked)",
            value: 2,
            color: "rgba(255, 255, 255, 0.24)",
            cutout: '30%',
        },
        {
            label: "Community",
            value: 14,
            color: "rgba(255, 255, 255, 0.32)",
            cutout: "30%",
        },
        {
            label: "Ecosystem",
            value: 20,
            color: "rgba(255, 255, 255, 0.40)",
            cutout: "30%",
        },
        {
            label: "Marketing",
            value: 18,
            color: "rgba(255, 255, 255, 0.48)",
            cutout: "30%",
        },
        {
            label: "Partner",
            value: 6,
            color: "rgba(255, 255, 255, 0.56)",
            cutout: "30%",
        },
        {
            label: "Team/Advisor",
            value: 7,
            color: "rgba(255, 255, 255, 0.64)",
            cutout: "30%",
        },
        {
            label: "Development",
            value: 9,
            color: "rgba(255, 255, 255, 0.72)",
            cutout: "30%",
        },
        {
            label: "Auto-burn",
            value: 5,
            color: "rgba(255, 255, 255, 0.80)",
            cutout: "30%",
        },
        {
            label: "Pre-sale",
            value: 1,
            color: "rgba(255, 255, 255, 0.88)",
            cutout: "30%",
        },
    ]

    const options: any = {
        plugins: {
            datalabels: {
                formatter: () => '',
                labels : {
                  // title: {
                  //     formatter: function (value, context) {
                  //         return data[context.dataIndex].label
                  //     },
                  //     font: function(context) {
                  //       let avgSize = Math.round((context.chart.height + context.chart.width) / 2);
                  //       let size = Math.round(avgSize / 64);
                  //       size = size > 12 ? 12 : size;
                  //       return {
                  //           size: size
                  //       }
                  //     },
                  //     anchor: 'end'
                  // },
                  // index : {
                  //     formatter: function (value, context) {
                  //         return (context.dataIndex + 1);
                  //     },
                  //     anchor: 'end',
                  //     color: 'white',
                  //     padding: 4,
                  //     borderColor: 'white',
                  //     borderWidth: 1,
                  //     borderRadius: 8,
                  //     backgroundColor: 'rgba(0,0,0,1)'
                  //
                  // }
                },
                // color: "white",
                font: {
                    weight: 'bold',
                    size:10,
                    family: 'poppins',
                },
                anchor: 'end'
            },
            tooltip: {
                // intersect: false,
                backgroundColor: '#000',
                borderColor: 'rgba(255,255,255,0.8)',
                borderWidth: 1,
                padding: 16,
                displayColors: false,
                zIndex: 300,
                callbacks: {
                    label: (datapoint : any) => {return ` ${datapoint.raw}%`}
                },
            },
            legend: {
                display: false,
            },
        },
        events: ['click', 'mousemove'],
        onHover: (event : any, chartElement : any) => {
          if (chartElement.length > 0) {
              let index = chartElement[0].index
              setCurrentIdx(index);
              finalData.datasets[0].backgroundColor[index] = '#1DFCFF';
              finalData.datasets[0].offset[index] = 32;
          } else {
              finalData.datasets[0].backgroundColor = data.map((item) => item.color);
              finalData.datasets[0].offset = new Array(data.length).fill(0);
          }

        },
        // onClick: (event, chartElement) => {
        //     if (chartElement.length > 0) {
        //         let index = chartElement[0].index
        //         setCurrentIdx(index);
        //     }
        // },
        cutout: data.map((item) => item.cutout),
        layout: {
            padding: 16
        },
        animation : {
            animateScale: true
        },
        hoverOffset: 32,
    };

// Now create your finalData with the correct type
    const finalData : any = {
        labels: data.map((item) => item.label),
        datasets: [{
            data: data.map((item) => Math.round(item.value)),
            backgroundColor: data.map((item) => item.color),
            //borderColor: data.map((item) => item.color),
            borderColor: 'rgba(255,255,255,0.8)',
            borderWidth: 1,
            dataVisibility: new Array(data.length).fill(true),
            spacing: 16,
            hoverBackgroundColor: '#1DFCFF',
            datalabels: {color: 'white', text: ""},
            offset : new Array(data.length).fill(0),

        }],
    };

    return (
        <div ref={chartRef} className={styles.chart}>
            <Doughnut
                className={styles.doughnut}
                data={finalData}
                options={options}
            />
            <div ref={textRef} className={styles.centerText}>
                <div className={styles.labelText} ref={labelRef}></div>
                <div className={styles.valueText} ref={valueRef}></div>
            </div>
            <div ref={imgRef} className={styles.centerImg}>
                <Image
                    src={vobPic}
                    width={32}
                    height={49}
                    alt="vob image"
                />
            </div>
            <div className={styles.centerDiv} onClick={() => {setShowImg(true)}}></div>
        </div>
    )
}
