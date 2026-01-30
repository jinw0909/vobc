import { Main } from '@/components/Main';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { mapSpringToNewsItem, type NewsItem } from '@/newsMapper';

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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

async function fetchArticles(locale: string): Promise<SpringArticle[]> {
    const res = await fetch(
        `${API_BASE}/api/article/page?lang=${encodeURIComponent(locale)}&size=9`,
        {
            next: { revalidate: 60 },
            headers: { Accept: 'application/json' },
        }
    );

    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
    const data: PageResp<SpringArticle> = await res.json();
    return data.content ?? [];
}

type NewsBundle = {
    data: NewsItem[];
    imgSrc: string[];
    index: number; // NewsAcc index용
};

export default async function Page({params} : any) {
  const {locale} = await params;
  setRequestLocale(locale);

  const articles = await fetchArticles(locale);
  const firstNine = articles.slice(0, 9);

  const items: NewsItem[] = firstNine.map(mapSpringToNewsItem);
  const imgs: string[] = firstNine.map((a) => a.thumbnail ?? '');

  const newsBundles: NewsBundle[] = [
      { data: items.slice(0, 3), imgSrc: imgs.slice(0, 3), index: 0 },
      { data: items.slice(3, 6), imgSrc: imgs.slice(3, 6), index: 3 },
      { data: items.slice(6, 9), imgSrc: imgs.slice(6, 9), index: 6 },
  ]

  return (
       <>
          <Main locale={locale} newsBundles={newsBundles}/>
      </>
  );

}
