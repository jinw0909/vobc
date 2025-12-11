import styles from './styles.module.css'
import {getLocale} from "next-intl/server";
import {notFound} from "next/navigation";


const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

interface PostTag {
    sortOrder: number;
    tagName: string;
    primaryTag: boolean;
}

interface PostItem {
    postId: number;
    title: string;
    content: string;
    author: string;
    summary: string;
    releaseDate: string | null;
    thumbnail: string | null;
    // requestedLanguage: string | null;
    // effectiveLanguage: string | null;
    // translated: boolean;
    // createdAt: string;
    // updatedAt: string;
    postTags: PostTag[];
}

interface PagedResponse<T> {
    content: T[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
}


export default async function BlogTag() {
    const locale = await getLocale();

    // 백엔드 LanguageCode(enum) 기준으로 매핑
    // 필요하면 jp, cn 등 추가
    const lang =
        locale === 'en' ||
        locale === 'kr' ||
        locale === 'jp' ||
        locale === 'cn'
            ? locale
            : 'en';

    const res = await fetch(
        `${API_BASE}/api/post/query/page?lang=${lang}&size=7`,
        {
            // 최신 글 보고 싶으면 no-store, 약간 캐싱하고 싶으면 revalidate 사용
            cache: 'no-store',
            // next: { revalidate: 60 },
        }
    );

    if (!res.ok) {
        notFound();
    }

    const data: PagedResponse<PostItem> = await res.json();
    const posts = data.content ?? [];


    return (
        <div className={styles.blogTagWrapper}>
            <ul>
                {posts.map((post) => (
                    <li key={post.postId} className={styles.post}>
                        <div>
                            {post.title}
                        </div>
                        <div>
                            <div>
                                {post.summary}
                            </div>
                            <div>
                                {post.postTags.map((tag, index) => {
                                    return(
                                        <span key={index}>#{tag.tagName}</span>
                                    )
                                })}
                            </div>
                        </div>

                    </li>
                ))}
            </ul>
        </div>
    )
}