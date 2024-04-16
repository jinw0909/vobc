'use client';
import styles from './styles.module.css'
import {useEffect, useState} from "react";
import {handleRedirectResponse} from "next/dist/server/future/route-modules/helpers/response-handlers";
export function NewsContent({content}:{content:any}) {

    const [contentArr, setContentArr] = useState([]);
    const processContent = (content:any) => {
        const arr = content.split('\n');
        setContentArr(arr);
    }

    useEffect(() => {
        processContent(content);
    }, [content])

    return (
        <div className={styles.newsContent}>
            {
                contentArr.map((line, index) => {
                    return (
                        <>
                            <p key={index}>{line}</p>
                        </>
                    )
                })
            }
        </div>
    )
}