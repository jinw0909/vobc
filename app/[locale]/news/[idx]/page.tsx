import styles from './styles.module.css'
import { NewsDetail } from "@/components/NewsDetail";
import {setRequestLocale} from "next-intl/server";
import { Metadata, ResolvingMetadata } from "next";
import newsData from "@/json/news.json";
import newsImages from "@/newsImages";

export async function generateMetadata({ params } : { params: Promise<{idx:number}> }) : Promise<Metadata> {
    const {idx} = await params;

    const summary = newsData[idx].title + '\n'+  newsData[idx].subtitle;

    return {
        description: summary,
        openGraph: {
            images: `${process.env.SITE_URL}${newsImages[idx].url}`,
            description: summary
        }
    }
}

export default async function Page({params} : any) {
    const {idx, locale} = await params;
    setRequestLocale(locale);

    return (
        <div className={styles.detailWrapper}>
            <NewsDetail idx={idx}/>
        </div>
    )
}