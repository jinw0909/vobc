import styles from './styles.module.css'
import {setRequestLocale} from "next-intl/server";
import {NewsMedia} from "@/components/NewsMedia";
import {Suspense} from "react";
import Loading from "@/app/[locale]/news/_components/loading";


export default async function news({params} : any) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className={styles.newsWrapper}>
            <Suspense fallback={<Loading/>}>
                <NewsMedia locale={locale}/>
            </Suspense>
        </div>
    )
}