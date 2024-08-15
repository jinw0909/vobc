import styles from './styles.module.css'
import {Devs} from "@/components/Devs";
import {unstable_setRequestLocale} from "next-intl/server";

export default async function Page({params : { locale }} : {params : {locale : string}}) {
    unstable_setRequestLocale(locale);

    console.log("devlocale: ");
    return (
        <div className={styles.devsWrapper}>
            <Devs />
        </div>
    )
}