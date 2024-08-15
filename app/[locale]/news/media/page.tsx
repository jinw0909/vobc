import styles from './styles.module.css'
import { NewsMedia } from '@/components/NewsMedia';
import {unstable_setRequestLocale} from "next-intl/server";
export default async function Page({params : { locale }} : {params : {locale : string}}) {
    unstable_setRequestLocale(locale);

    return (
        <div className={styles.mediaWrapper}>
            <NewsMedia />
        </div>
    )
}