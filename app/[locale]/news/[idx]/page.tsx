import styles from './styles.module.css'
import { NewsDetail } from "@/components/NewsDetail";
import {setRequestLocale} from "next-intl/server";
export default async function Page({params} : any) {
    const {idx, locale} = await params;
    setRequestLocale(locale);

    return (
        <div className={styles.detailWrapper}>
            <NewsDetail idx={idx}/>
        </div>
    )
}