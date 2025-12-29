import styles from './styles.module.css'
import { NewsAcc } from "@/ui/NewsAcc";
import { getTranslations } from "next-intl/server";
import { mapSpringToNewsItem, type NewsItem } from "@/newsMapper"; // 위 매퍼를 파일로 빼도 되고 같은 파일에 둬도 됨

type PageResp<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
};

type SpringArticle = {
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

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

async function fetchArticles(locale: string): Promise<SpringArticle[]> {

    const res = await fetch(`${API_BASE}/api/article/page?lang=${encodeURIComponent(locale)}&size=6`, {
        // cache: "no-store",
        next: {revalidate: 60},
        headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
    const data: PageResp<SpringArticle> = await res.json();
    // console.log(data);
    return data.content ?? [];
}

export async function News({ locale }: { locale: string }) {
    const t = await getTranslations('news');
    console.log("locale: ", locale);
    const articles = await fetchArticles(locale);

    // 최신 6개
    const firstSix = articles.slice(0, 6);

    // ✅ NewsAcc가 기대하는 형태로 변환
    const firstSixData: NewsItem[] = firstSix.map(mapSpringToNewsItem);
    // console.log(firstSixData);

    // ✅ newsImages 대신 thumbnail 사용
    const firstSixImages = firstSix.map(a => a.thumbnail ?? "");

    const data1 = firstSixData.slice(0, 3);
    const imgSrc1 = firstSixImages.slice(0, 3);

    const data2 = firstSixData.slice(3, 6);
    const imgSrc2 = firstSixImages.slice(3, 6);

    return (
        <div className={styles.newsWrapper}>
            <NewsAcc data={data1} imgSrc={imgSrc1} index={0} />

            <div className={styles.middleContent}>
                {t('0')}
            </div>

            <NewsAcc data={data2} imgSrc={imgSrc2} index={3} />

            <div className={styles.middleContent}>
                {t('1')}
            </div>
        </div>
    )
}
