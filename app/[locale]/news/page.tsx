import { News } from '@/components/News';
import styles from './styles.module.css'
import {setRequestLocale, unstable_setRequestLocale} from "next-intl/server";
export default function news({params : { locale }} : {params : {locale : string}}) {
    setRequestLocale(locale);

    return (
        <div className={styles.newsWrapper}>
            <News/>
        </div>
    )
}