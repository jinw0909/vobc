'use client';
import styles from './styles.module.css';
import {useEffect, useState} from "react";
import data from '@/json/distribution.json';
export function DistDetail({handleIdx, index, isActive}: {handleIdx:any, index: any, isActive:any}) {
    const [highLight, setHighLight] = useState(isActive);

    useEffect(() => {
        setHighLight(isActive);
    }, [isActive])

    const handleClick = (idx:any) => {
        setHighLight(true);
        handleIdx(idx);
    }

    return (
        <div>
            <div className={styles.content}>
                <input className={styles.checkbox} type="checkbox" id="checkbox" hidden/>
                <div className={styles.title}>
                    <label htmlFor="checkbox" className={styles.closeBtn}>
                        <span className={styles.btnSpan}>Close Detail</span>
                    </label>
                    <label htmlFor="checkbox" className={styles.openBtn}>
                        <span className={styles.btnSpan}>Open Detail</span>
                    </label>
                </div>
                <div className={styles.tableWrapper}>
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
                            data.map((a, i) => {
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
                            <td className={styles.spanThree} colSpan={3}>Total</td>
                            <td>300M</td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    )
}