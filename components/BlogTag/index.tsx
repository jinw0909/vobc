import styles from './styles.module.css'
import {getLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import Image from "next/image";
import {NavigationLink} from "@/ui/NavigationLink";

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

interface BlogTagProps {
    tagName: string,
    page : number
}


export default async function BlogTag({tagName , page}: BlogTagProps) {
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

    const zeroBasedPage = Math.max(page - 1, 0);

    const res = await fetch(
        `${API_BASE}/api/post/query/page?lang=${lang}&size=2&page=${zeroBasedPage}&tagName=${encodeURIComponent(tagName)}`,
        {
            cache: 'no-store',
        }
    );

    if (!res.ok) {
        notFound();
    }

    const data: PagedResponse<PostItem> = await res.json();
    const posts = data.content ?? [];

    const currentPage = data.number + 1;
    const totalPages = data.totalPages;

    return (
        <div className={styles.blogTagWrapper}>
            <div className={styles.tagName}>#{tagName}</div>
            <p className={styles.explanation}>Posts about #{tagName}</p>
            <ul>
                {posts.map((post) => (
                    <li key={post.postId} className={styles.post}>
                        <div className={styles.postThumbnail}>
                            <NavigationLink href={`/blog/${post.postId}`}>
                                <div>
                                    {post.thumbnail ? (
                                        <Image
                                            src={post.thumbnail}
                                            alt={post.title}
                                            fill={true}
                                            style={{objectFit: 'cover'}}
                                        />
                                    ) : (
                                        <div className={styles.postThumbnailPlaceholder}>
                                            {/* 썸네일 없는 경우 대체 UI */}
                                            No image
                                        </div>
                                    )}
                                </div>
                            </NavigationLink>
                        </div>
                        <div className={styles.postTitle}>
                            <NavigationLink className={styles.colorWhite} href={`/blog/${post.postId}`}>
                                {post.title}
                            </NavigationLink>
                        </div>
                        <div className={styles.postRight}>
                            <div className={styles.postSummary}>
                                {post.summary}
                            </div>
                            <div className={styles.postTags}>
                                {post.postTags.map((tag, index) => {
                                    return(
                                        <span className={styles.tag} key={index}>
                                            <NavigationLink href={`/blog/tag/${tag.tagName}`} className={styles.tagSpan}>
                                                #{tag.tagName}
                                            </NavigationLink>
                                        </span>
                                    )
                                })}
                            </div>
                        </div>

                    </li>
                ))}
            </ul>
            {/* 페이지네이션 영역 */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    {/* 이전 버튼 */}
                    {currentPage > 1 && (
                        <NavigationLink
                            href={`/blog/tag/${encodeURIComponent(tagName)}?page=${currentPage - 1}`}
                            className={styles.pageLink}
                        >
                            ‹ Prev
                        </NavigationLink>
                    )}

                    {/* 페이지 숫자들 */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <NavigationLink
                            key={p}
                            href={`/blog/tag/${encodeURIComponent(tagName)}?page=${p}`}
                            className={`${styles.pageLink} ${
                                p === currentPage ? styles.activePage : ''
                            }`}
                        >
                            {p}
                        </NavigationLink>
                    ))}

                    {/* 다음 버튼 */}
                    {currentPage < totalPages && (
                        <NavigationLink
                            href={`/blog/tag/${encodeURIComponent(tagName)}?page=${currentPage + 1}`}
                            className={styles.pageLink}
                        >
                            Next ›
                        </NavigationLink>
                    )}
                </div>
            )}
        </div>
    )
}