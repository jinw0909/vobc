import styles from './styles.module.css'
import { NewsMedia } from '@/components/NewsMedia';
import {setRequestLocale, unstable_setRequestLocale} from "next-intl/server";
export default async function Page({params : { locale }} : {params : {locale : string}}) {
    setRequestLocale(locale);

    return (
        <div className={styles.mediaWrapper}>
            <NewsMedia />
        </div>
    )
}