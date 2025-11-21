import styles from './styles.module.css'
import { NewsDetail } from "@/components/NewsDetail";
import {setRequestLocale} from "next-intl/server";
import { Metadata, ResolvingMetadata } from "next";
import newsData from "@/json/news.json";
import newsImages from "@/newsImages";


type NewsArticle = {
    id: string
    title: string
    subtitle: string
    content: string
    date: string
    author: string
    press: string
    desc: string
    pressdesc: string
    link: string
}

type PageParams = {
    locale: string,
    idx: string
};

type PageProps = {
    params: Promise<PageParams>
}

export async function generateMetadata({ params } : PageProps) : Promise<Metadata> {
    const {idx} = await params;

    const articles = newsData as NewsArticle[];
    const article = articles.find(article => article.id === idx);

    if (!article) {
        return {
            title: 'Not found',
            description: 'This article does not exist'
        }
    }

    // Find numeric index for image array
    const index = newsData.findIndex(item => item.id === idx);
    // const summary = newsData[idx].title + '\n'+  newsData[idx].subtitle;
    const summary = `${article.title}\n${article.subtitle}`;


    return {
        description: summary,
        openGraph: {
            images: `${process.env.SITE_URL}${newsImages[index].url}`,
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