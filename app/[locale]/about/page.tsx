import styles from './styles.module.css';
import { About } from "@/components/About";
import {setRequestLocale, unstable_setRequestLocale} from "next-intl/server";

export default function Page({params : { locale }} : {params : {locale : string}}) {
    setRequestLocale(locale);
    return (
        <>
            <div className={styles.aboutWrapper}>
                <About/>
            </div>
        </>
    )
}