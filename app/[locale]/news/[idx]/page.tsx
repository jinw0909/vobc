import styles from './styles.module.css'
import { NewsDetail } from "@/components/NewsDetail";
import {setRequestLocale, unstable_setRequestLocale} from "next-intl/server";
export default async function Page({params} : { params : {idx : string, locale: string}}) {
    setRequestLocale(params.locale);

    return (
        <div className={styles.detailWrapper}>
            <NewsDetail idx={params.idx}/>
        </div>
    )
}