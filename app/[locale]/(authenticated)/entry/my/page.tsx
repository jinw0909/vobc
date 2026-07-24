import {setRequestLocale} from "next-intl/server";
import styles from './styles.module.css';
import EntryMy from "@/app/[locale]/(authenticated)/entry/my/EntryMy";
export default async function Page({ params } : any) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className={styles.wrapper}>
            <EntryMy/>
        </div>
    );
};