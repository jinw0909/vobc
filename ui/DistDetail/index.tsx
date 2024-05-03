'use client';
import styles from './styles.module.css';
import { useEffect, useState } from "react";
import data from '@/json/distribution_en.json';
import { useLocale } from "next-intl";
import {useTranslations} from "next-intl";
export function DistDetail({handleIdx, index, isActive}: {handleIdx:any, index: any, isActive:any}) {

    const locale = useLocale();
    const data = require(`@/json/distribution_${locale}.json`);
    const t = useTranslations('distribution');

    const [highLight, setHighLight] = useState(isActive);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setHighLight(isActive);
    }, [isActive])

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const response = await fetch('/distribution_jp.json');
    //         const jsonData = await response.json();
    //         setData(jsonData);
    //     };
    //
    //     fetchData();
    // }, []);
    // useEffect(() => {
    //     console.log(data);
    // }, [data])


    const handleClick = (idx:any) => {
        setHighLight(true);
        handleIdx(idx);
    }

    return (
        <div className={`${styles.content} ${isOpen ? styles.open : ''}`}>
                {/*<input className={styles.checkbox} type="checkbox" id="checkbox" hidden/>*/}
                <div className={`${styles.btnWrapper} ${isOpen ? styles.hide : ''}`}>
                    <label className={styles.openBtn} onClick={() => {setIsOpen(true)}}>
                        <span className={styles.btnSpan}>{t('opendetail')}</span>
                    </label>
                </div>
                <div className={`${styles.tableWrapper} ${isOpen ? styles.isOpen : ''}`}>
                    <table className={styles.table}>
                    {/*<thead>*/}
                    {/*    <tr>*/}
                    {/*        <th className={styles.spanTwo} colSpan={2}>Distribution<br/>Model</th>*/}
                    {/*        <th>Allocation<br/>(%)</th>*/}
                    {/*        <th>Allocation<br/>(EA)</th>*/}
                    {/*    </tr>*/}
                    {/*</thead>*/}
                    <tbody>
                        {
                            data.map((a:any, i:any) => {
                                if (a.desc == '') {
                                    return (
                                        <tr key={i}
                                            className={`${index == i && highLight ? styles.selected : ''}`}
                                            onClick={() => {handleClick(i)}}>
                                            <td>{i + 1}</td>
                                            <td>{a.label}</td>
                                            <td>{`${a.value}%`}</td>
                                            <td>{`${a.content}`}</td>
                                        </tr>
                                    )
                                } else {
                                    return (
                                        <tr key={i}
                                            className={`${index == i ? styles.selected : ''}`}
                                            onClick={() => {handleClick(i)}}>
                                            <td>{i + 1}</td>
                                            <td>{a.label}</td>
                                            <td>{`${a.value}%`}</td>
                                            <td>{`${a.content}`}</td>
                                            <td className={styles.reference}>{`${a.desc}`}</td>
                                        </tr>
                                    )
                                }

                            })
                        }
                        <tr>
                            <td className={styles.spanThree} colSpan={3}>{t('total')}</td>
                            <td>300M</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                <div className={`${styles.btnWrapper} ${isOpen ? '' : styles.hide}`}>
                    <label className={styles.closeBtn} onClick={() => {setIsOpen(false)}}>
                        <span className={styles.btnSpan}>{t('closedetail')}</span>
                    </label>
                </div>
            </div>
    )
}