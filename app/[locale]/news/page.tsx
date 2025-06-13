import { News } from '@/components/News';
import styles from './styles.module.css'
import {setRequestLocale} from "next-intl/server";
export default async function news({params} : any) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className={styles.newsWrapper}>
            <News/>
        </div>
    )
}