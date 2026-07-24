import {setRequestLocale} from "next-intl/server";
import styles from './styles.module.css';
import EntryFeed from "@/app/[locale]/(authenticated)/entry/feed/EntryFeed";
export default async function Page({ params } : any) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className={styles.wrapper}>
            <EntryFeed/>
        </div>
    );
};