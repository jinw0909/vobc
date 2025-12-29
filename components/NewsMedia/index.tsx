// import styles from './styles.module.css';
// import {NewsMediaBand} from "@/ui/NewsMediaBand";
// import newsImages from '@/newsImages'
// import data from '@/json/news.json';
// import {getTranslations} from "next-intl/server";
// import {LogoPlain} from "@/ui/LogoPlain";
// import { Noto_Sans_JP} from "next/font/google";
//
// const notosansjp = Noto_Sans_JP({
//     weight: ['200', '300', '400', '500', '600', '700', '900'],
//     style : "normal",
//     subsets: ['latin']
// });
//
// const data0 = data.slice(0, 7);
// const data1 = data.slice(7, 18);
// const data2 = data.slice(18, 23);
// const image0 = newsImages.slice(0, 7).map((i:any) => i.image);
// const image1 = newsImages.slice(7, 18).map((i:any) => i.image);
// const image2 = newsImages.slice(18, 23).map((i:any) => i.image);
// // const imgSrc25 = [newsImages[0].image, newsImages[1].image, newsImages[2].image]
// // const imgSrc24 = [newsImages[3].image, newsImages[4].image, newsImages[5].image, newsImages[6].image];
// // const imgSrc23 = [newsImages[7].image, newsImages[8].image, newsImages[9].image, newsImages[10].image, newsImages[11].image, newsImages[12].image]
//
// type NewsMediaProps = {
//     className?: string;
// }
//
// export async function NewsMedia({ className } : NewsMediaProps) {
//
//     const t = await getTranslations('media');
//
//     return (
//         <div className={`${styles.mediaWrapper} ${className ?? ''}`}>
//             <div className={styles.header}>
//                 <div className={`${styles.headerTitle} ${styles.fadeInAnimation}`}>
//                     <div>{t('title')}</div>
//                     <div className={`${styles.logoPlain} ${styles.delayedAnimation}`}>
//                         <LogoPlain></LogoPlain>
//                     </div>
//                     <div className={`${notosansjp.className} ${styles.hashTags} ${styles.delayedAnimation}`}>
//                         <span>#Event</span>
//                         <span>#Interview</span>
//                         <span>#Article</span>
//                     </div>
//                 </div>
//             </div>
//             <p className={`${styles.headerDesc} ${styles.textGradient} ${styles.moreDelayedAnimation}`}>
//                 {t('description')}
//             </p>
//             <div className={`${styles.main} ${styles.moreDelayedAnimation}`}>
//                 <div className={styles.yearWrapper}>
//                     <h2 className={styles.year}>2025</h2>
//                     <hr className={styles.horizontal}/>
//                     <div>
//                         <NewsMediaBand data={data0} imgSrc={image0} index={0}></NewsMediaBand>
//                     </div>
//                 </div>
//                 <div className={styles.yearWrapper}>
//                     <h2 className={styles.year}>2024</h2>
//                     <hr className={styles.horizontal}/>
//                     <div>
//                         <NewsMediaBand data={data1} imgSrc={image1} index={7}></NewsMediaBand>
//                     </div>
//                 </div>
//                 <div className={styles.yearWrapper}>
//                     <h2 className={styles.year}>2023</h2>
//                     <hr className={styles.horizontal}/>
//                     <div>
//                         <NewsMediaBand data={data2} imgSrc={image2} index={18}></NewsMediaBand>
//                     </div>
//                 </div>
//             </div>
//             <div className={styles.about}>
//                 <div className={styles.mediaAbout}>{t('about')}</div>
//                 <div className={styles.mediaHeader}>
//                     {t('title')}
//                 </div>
//                 <p className={`${styles.mediaDesc} ${styles.textGradient}`}>
//                     {t('aboutDesc')}
//                 </p>
//             </div>
//         </div>
//     )
// }


import styles from './styles.module.css';
import { NewsMediaBand } from "@/ui/NewsMediaBand";
import { getTranslations } from "next-intl/server";
import { LogoPlain } from "@/ui/LogoPlain";
import { Noto_Sans_JP } from "next/font/google";
import { mapSpringToNewsItem, type NewsItem } from "@/newsMapper";

const notosansjp = Noto_Sans_JP({
    weight: ['200', '300', '400', '500', '600', '700', '900'],
    style: "normal",
    subsets: ['latin']
});

type NewsMediaProps = {
    className?: string;
    locale: string; // ✅ locale 받아서 fetch에 사용
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

type PageResp<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
};

function getYear(releaseDate?: string | null): number | null {
    if (!releaseDate) return null;
    const y = Number(releaseDate.slice(0, 4));
    return Number.isFinite(y) ? y : null;
}

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

async function fetchAllArticles(locale: string): Promise<SpringArticle[]> {
    const res = await fetch(
        `${API_BASE}/api/article/page?lang=${encodeURIComponent(locale)}&page=0&size=500`,
        {
            next: {revalidate: 60},
            headers: { Accept: "application/json" } }
    );
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
    const data: PageResp<SpringArticle> = await res.json();
    return data.content ?? [];
}

function sortByReleaseDateDesc(a: SpringArticle, b: SpringArticle) {
    return (b.releaseDate ?? "").localeCompare(a.releaseDate ?? "");
}

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

export async function NewsMedia({ className, locale }: NewsMediaProps) {
    const t = await getTranslations('media');

    const articles = (await fetchAllArticles(locale)).sort(sortByReleaseDateDesc);

    // ✅ 연도별로 분리
    const by2025 = articles.filter(a => getYear(a.releaseDate) === 2025);
    const by2024 = articles.filter(a => getYear(a.releaseDate) === 2024);
    const by2023 = articles.filter(a => getYear(a.releaseDate) === 2023);

    // ✅ NewsMediaBand가 받는 data/imgSrc로 변환 (길이/순서 동일하게)
    const data2025: NewsItem[] = by2025.map(mapSpringToNewsItem);
    const img2025: string[] = by2025.map(a => a.thumbnail ?? "");

    const data2024: NewsItem[] = by2024.map(mapSpringToNewsItem);
    const img2024: string[] = by2024.map(a => a.thumbnail ?? "");

    const data2023: NewsItem[] = by2023.map(mapSpringToNewsItem);
    const img2023: string[] = by2023.map(a => a.thumbnail ?? "");

    // ✅ index는 “전체 리스트에서의 오프셋”처럼 쓰는 거면 누적 계산
    const idx2025 = 0;
    const idx2024 = idx2025 + data2025.length;
    const idx2023 = idx2024 + data2024.length;

    return (
        <div className={`${styles.mediaWrapper} ${className ?? ''}`}>
            <div className={styles.header}>
                <div className={`${styles.headerTitle} ${styles.fadeInAnimation}`}>
                    <div>{t('title')}</div>
                    <div className={`${styles.logoPlain} ${styles.delayedAnimation}`}>
                        <LogoPlain />
                    </div>
                    <div className={`${notosansjp.className} ${styles.hashTags} ${styles.delayedAnimation}`}>
                        <span>#Event</span>
                        <span>#Interview</span>
                        <span>#Article</span>
                    </div>
                </div>
            </div>

            <p className={`${styles.headerDesc} ${styles.textGradient} ${styles.moreDelayedAnimation}`}>
                {t('description')}
            </p>

            <div className={`${styles.main} ${styles.moreDelayedAnimation}`}>
                <div className={styles.yearWrapper}>
                    <h2 className={styles.year}>2025</h2>
                    <hr className={styles.horizontal} />
                    <div>
                        <NewsMediaBand data={data2025} imgSrc={img2025} index={idx2025} />
                    </div>
                </div>

                <div className={styles.yearWrapper}>
                    <h2 className={styles.year}>2024</h2>
                    <hr className={styles.horizontal} />
                    <div>
                        <NewsMediaBand data={data2024} imgSrc={img2024} index={idx2024} />
                    </div>
                </div>

                <div className={styles.yearWrapper}>
                    <h2 className={styles.year}>2023</h2>
                    <hr className={styles.horizontal} />
                    <div>
                        <NewsMediaBand data={data2023} imgSrc={img2023} index={idx2023} />
                    </div>
                </div>
            </div>

            <div className={styles.about}>
                <div className={styles.mediaAbout}>{t('about')}</div>
                <div className={styles.mediaHeader}>{t('title')}</div>
                <p className={`${styles.mediaDesc} ${styles.textGradient}`}>
                    {t('aboutDesc')}
                </p>
            </div>
        </div>
    );
}
