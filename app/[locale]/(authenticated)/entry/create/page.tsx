import {setRequestLocale} from "next-intl/server";
import styles from './styles.module.css';
import EntryEditor from "@/app/[locale]/(authenticated)/entry/create/EntryEditor";
export default async function Page({ params } : any) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className={styles.wrapper}>
            <EntryEditor/>
        </div>
    );
};