import styles from '../styles.module.css';
import data from '@/json/policy.json';
import {setRequestLocale, unstable_setRequestLocale} from "next-intl/server";

export default function Page({params : { locale }} : {params : {locale : string}}) {
    setRequestLocale(locale);

    const term = 'terms';
    return (
        <div className={styles.termsWrapper}>
            <div className={styles.termsTitle}>{data[term].title}</div>
            <div className={styles.termsContent}>
                {
                    data[term].content.map((a, i) => {
                        return (
                            <div key={i}>
                                <h2>{a.title}</h2>
                                <p>{a.content}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>

    )
}