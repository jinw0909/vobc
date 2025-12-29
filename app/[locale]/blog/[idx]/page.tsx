import styles from './styles.module.css'
import {setRequestLocale} from "next-intl/server";
import { Metadata, ResolvingMetadata } from "next";
import BlogDetail from "@/components/BlogDetail";
import { Suspense } from "react";
import Loading from "@/app/[locale]/blog/[idx]/_components/loading"
import {notFound} from "next/navigation";

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

interface PostMetaResponse {
    id: number;
    title: string;
    summary: string;
    content: string;
    thumbnail: string | null;
    releaseDate: string | null;
    // 필요하면 tags 같은 것도 더…
}

interface RouteParams {
    idx: string;
    locale: string;
}

interface GenerateMetadataProps {
    params: Promise<RouteParams>;
}

export async function generateMetadata(
    { params }: GenerateMetadataProps
): Promise<Metadata> {
    const { idx, locale } = await params;

    // locale → backend languageCode 매핑 (너가 BlogDetail에서 쓰던 그대로)
    const lang =
        locale === 'en' ||
        locale === 'kr' ||
        locale === 'jp' ||
        locale === 'cn'
            ? locale
            : 'en';

    try {
        const res = await fetch(
            `${API_BASE}/api/post/query/${idx}?lang=${lang}`,
            {
                // 메타데이터용은 굳이 no-store까지는 안 해도 됨(원하면 써도 되고)
                // cache: 'force-cache',
                next: { revalidate: 60 },
            }
        );

        if (!res.ok) {
            notFound();
        }

        const post = (await res.json()) as PostMetaResponse;

        const title = post.title || 'VOB Blog';
        const description =
            post.summary ||
            (post.content ? post.content.replace(/<[^>]+>/g, '').slice(0, 160) + '…' : 'Blog post detail');
        const ogImage = post.thumbnail ?? undefined;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images: ogImage ? [{ url: ogImage }] : undefined,
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: ogImage ? [ogImage] : undefined,
            },
        };
    } catch (e) {
        // 백엔드 죽어있을 때 등
        return {
            title: 'VOB Blog',
            description: 'VOB blog post detail page.',
        };
    }
}




interface PageProps {
    params: Promise<{
        idx: string;
        locale: string;
    }>;
}

export default async function Page({ params }: PageProps) {
    const { idx, locale } = await params;
    setRequestLocale(locale);

    return (
        <div className={styles.detailWrapper}>
            <Suspense fallback={<Loading/>}>
                <BlogDetail idx={idx} />
            </Suspense>
        </div>
    );
}