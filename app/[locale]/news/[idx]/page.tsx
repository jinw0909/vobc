import styles from './styles.module.css'
import { NewsDetail } from "@/components/NewsDetail";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type PageParams = { locale: string; idx: string };
type PageProps = { params: Promise<PageParams> };

type SpringArticleResponse = {
    id: number;
    title: string;
    content: string;
    summary?: string | null;
    author?: string | null;
    description?: string | null;
    thumbnail?: string | null;
    link?: string | null;
    publisherName?: string | null;
    publisherIntroduction?: string | null;
    releaseDate?: string | null;
};

type NewsArticle = {
    id: string;
    title: string;
    subtitle: string;
    content: string;
    date: string;
    author: string;
    press: string;
    desc: string;
    pressdesc: string;
    link: string;
    thumbnail: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
const SITE_URL = process.env.SITE_URL ?? "https://www.vobc.io";

async function fetchArticleById(id: string, locale: string): Promise<SpringArticleResponse | null> {
    const res = await fetch(
        `${API_BASE}/api/article/${encodeURIComponent(id)}?lang=${encodeURIComponent(locale)}`,
        {
            next: { revalidate: 10 },
            // cache: "no-store",
            headers: { Accept: "application/json" }
        }
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
    return (await res.json()) as SpringArticleResponse;
}

function mapSpringToNewsArticle(a: SpringArticleResponse): NewsArticle {
    return {
        id: String(a.id),
        title: a.title ?? "",
        subtitle: a.summary ?? "",
        content: a.content ?? "",
        date: a.releaseDate ?? "",
        author: a.author ?? "",
        press: a.publisherName ?? "",
        desc: a.description ?? a.summary ?? "",
        pressdesc: a.publisherIntroduction ?? "",
        link: a.link ?? "#",
        thumbnail: a.thumbnail ?? "", // ✅ newsImages 대신 thumbnail
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { idx, locale } = await params;
    const article = await fetchArticleById(idx, locale);
    // console.log("API article.thumbnail =", article?.thumbnail);
    // console.log("API raw =", article);
    if (!article) notFound();

    const summary =
        (article.summary && `${article.title} – ${article.summary}`) ||
        article.description ||
        article.title;

    return {
        title: article.title,
        description: summary,
        openGraph: {
            title: article.title,
            description: summary,
            url: `${SITE_URL}/news/media/${idx}`,
            images: article.thumbnail
                ? [
                    {
                        url: article.thumbnail.startsWith("http") ? article.thumbnail : `${SITE_URL}${article.thumbnail}`,
                        width: 1200,
                        height: 630,
                        alt: article.title,
                    },
                ]
                : undefined,
        },
    };
}

export default async function Page({ params }: any) {
    const { idx, locale } = await params;
    setRequestLocale(locale);

    const article = await fetchArticleById(idx, locale);
    if (!article) notFound();

    const mapped = mapSpringToNewsArticle(article);

    return (
        <div className={styles.detailWrapper}>
            <NewsDetail article={mapped} />
        </div>
    );
}
