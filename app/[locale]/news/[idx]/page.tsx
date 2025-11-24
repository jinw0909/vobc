import styles from './styles.module.css'
import { NewsDetail } from "@/components/NewsDetail";
import {setRequestLocale} from "next-intl/server";
import { Metadata, ResolvingMetadata } from "next";
import newsData from "@/json/news.json";
import newsImages from "@/newsImages";
import {notFound} from "next/navigation";

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
    const article = articles.find(a => a.id === idx);

    if (!article) {
        notFound();
    }

    const imageObj = newsImages.find((img : any) => img.id === idx);
    const summary =
        (article.subtitle && `${article.title} – ${article.subtitle}`) ||
        article.desc ||
        article.title;

    const baseUrl = process.env.SITE_URL ?? 'https://www.vobc.io';

    return {
        title: article.title,
        description: summary,
        openGraph: {
            title: article.title,
            description: summary,
            url: `${baseUrl}/news/media/${idx}`, // adjust path if your route differs
            images: imageObj
                ? [
                    {
                        url: `${baseUrl}${imageObj.url}`, // e.g. https://.../news/heraldbiz251020.png
                        width: 1200,
                        height: 630,
                        alt: article.title,
                    },
                ]
                : undefined,
        },
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