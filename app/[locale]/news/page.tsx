import { News } from '@/components/News';
import styles from './styles.module.css'
import {unstable_setRequestLocale} from "next-intl/server";
export default function news({params : { locale }} : {params : {locale : string}}) {
    unstable_setRequestLocale(locale);

    return (
        <div className={styles.newsWrapper}>
            <News/>
        </div>
    )
}