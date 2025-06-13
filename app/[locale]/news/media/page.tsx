import styles from './styles.module.css'
import { NewsMedia } from '@/components/NewsMedia';
import {setRequestLocale} from "next-intl/server";
export default async function Page({params} : any) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className={styles.mediaWrapper}>
            <NewsMedia />
        </div>
    )
}