import styles from './styles.module.css'
import {Devs} from "@/components/Devs";
import {setRequestLocale, unstable_setRequestLocale} from "next-intl/server";

export default async function Page({params : { locale }} : {params : {locale : string}}) {
    setRequestLocale(locale);

    console.log("devlocale: ");
    return (
        <div className={styles.devsWrapper}>
            <Devs />
        </div>
    )
}