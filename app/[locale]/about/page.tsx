import styles from './styles.module.css';
import { About } from "@/components/About";
import {setRequestLocale} from "next-intl/server";

export default async function Page({ params } : any) {
    const { locale } = await params;
    setRequestLocale(locale);
    return (
        <>
            <div className={styles.aboutWrapper}>
                <About/>
            </div>
        </>
    )
}