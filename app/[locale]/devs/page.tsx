import styles from './styles.module.css'
import {Devs} from "@/components/Devs";
import {setRequestLocale} from "next-intl/server";

export default async function Page( { params } : any) {
    const { locale } = await params;
    setRequestLocale(locale);

    console.log("devlocale: ");
    return (
        <div className={styles.devsWrapper}>
            <Devs />
        </div>
    )
}