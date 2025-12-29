import styles from './styles.module.css';
import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import Image from 'next/image';
import { NavigationLink } from '@/ui/NavigationLink';
import arrowRight from '@/public/icons/arrow-up-white.png';
import Pagination from "@/ui/Pagination";

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


export default async function Blog({searchParams}: { searchParams: {page?: string; size?: string; }}) {
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

    const page = Math.max(1, Number(searchParams.page ?? '1') || 1);
    const size = Math.min(
        30,
        Math.max(1, Number(searchParams.size) || 7)
    );

    const zeroBasedPage = page - 1;


    const res = await fetch(
        `${API_BASE}/api/post/query/page?lang=${lang}&page=${zeroBasedPage}&size=${size}`,
        {
            // 최신 글 보고 싶으면 no-store, 약간 캐싱하고 싶으면 revalidate 사용
            // cache: 'no-store',
            next: { revalidate: 10 },
        }
    );

    if (!res.ok) {
        // 아주 심플하게 에러 처리 (원하면 별도 컴포넌트로 뺄 수 있음)
        return (
            <div className={styles.blogWrapper}>
                <p>Failed to load posts.</p>
            </div>
        );
    }

    const data: PagedResponse<PostItem> = await res.json();
    const posts = data.content ?? [];

    const currentPage = data.number + 1;
    const totalPages = data.totalPages;

    if (posts.length === 0) {
        return (
            <div className={styles.blogWrapper}>
                <p>No posts yet.</p>
            </div>
        );
    }

    const firstPost = posts[0];
    const restPosts = posts.slice(1);

    const firstId = firstPost.postId;
    const firstTitle = firstPost.title;
    const firstDate = firstPost.releaseDate ?? '';
    const firstSummary = firstPost.summary;
    const firstAuthor = firstPost.author;
    const firstTags = firstPost.postTags ?? [];

    return (
        <div className={styles.blogWrapper}>
            {/* ---- 첫 번째(대표) 글 ---- */}
            <div className={styles.blogFirst}>
                <div key={firstId} className={styles.firstElem}>
                    <div className={styles.left}>
                        <div className={styles.leftTop}>
                            <p className={styles.blogDate}>{firstDate}</p>
                            <div className={styles.blogTitle}>
                                <NavigationLink href={`/blog/${firstId}`} scroll={true}>
                                    <p className={styles.inline}>{firstTitle}</p>
                                    <div className={styles.iconElem}>
                                        <Image
                                            alt="arrowRight"
                                            src={arrowRight}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className={styles.svgArrow}
                                        />
                                    </div>
                                </NavigationLink>
                            </div>
                        </div>
                        <div className={styles.leftDown}>
                            <p className={styles.blogSummary}>{firstSummary}</p>
                            <p className={styles.blogAuthor}>By {firstAuthor}</p>
                        </div>
                    </div>

                    <div className={styles.right}>
                        <div className={styles.tagElem}>
                            {firstTags.length > 0 && (
                                <div className={styles.tagRow}>
                                    {firstTags.map((tag, index: number) => (
                                        <span key={index} className={styles.tag}>
                                            <NavigationLink className={styles.tagSpan} href={`/blog/tag/${tag.tagName}`} key={index}>
                                                  #{tag.tagName}
                                            </NavigationLink>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <NavigationLink
                            className={styles.imageLink} href={`/blog/${firstId}`}
                            scroll={true}
                        >
                            <div className={styles.imageElem}>
                                {firstPost.thumbnail && (
                                    <Image
                                        src={firstPost.thumbnail}
                                        alt={firstTitle}
                                        style={{ objectFit: 'cover' }}
                                        fill
                                    />
                                )}
                            </div>
                        </NavigationLink>

                        <p className={styles.blogSummaryMobile}>{firstSummary}</p>

                        <div className={styles.tagElemMobile}>
                            {firstTags.length > 0 && (
                                <div className={styles.tagRow}>
                                    {firstTags.map((tag, index: number) => (
                                        <span key={index} className={styles.tag}>
                                            <NavigationLink className={styles.tagSpan} href={`/blog/tag/${tag.tagName}`} key={index}>
                                                  #{tag.tagName}
                                            </NavigationLink>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ---- (필요시) Filter Bar 유지 ---- */}
            <div className={styles.filterBar}>
                {/* 나중에 필터 기능 넣을 거면 여기에 */}
            </div>

            {/* ---- 나머지 글 리스트 ---- */}
            <ul className={styles.blogList}>
                {restPosts.map((post) => {
                    const title = post.title;
                    const date = post.releaseDate ?? '';
                    const summary = post.summary;
                    const author = post.author;
                    const tags = post.postTags ?? [];

                    return (
                        <li key={post.postId}>
                            <div className={styles.blogItemInner}>
                                <NavigationLink
                                    className={styles.blogTitle}
                                    href={`/blog/${post.postId}`}
                                    scroll={true}
                                >
                                    <p className={styles.inline}>{title}</p>
                                </NavigationLink>

                                <div className={styles.blogThumbnail}>
                                    <NavigationLink href={`/blog/${post.postId}`} scroll={true}>
                                        <div className={styles.imageElem}>
                                            {post.thumbnail && (
                                                <Image
                                                    src={post.thumbnail}
                                                    alt={title}
                                                    style={{ objectFit: 'cover' }}
                                                    fill
                                                />
                                            )}
                                        </div>
                                    </NavigationLink>
                                </div>

                                <p className={styles.blogSummary}>{summary}</p>
                                <p className={styles.blogAuthor}>
                                    {author} | {date}
                                </p>

                                {tags.length > 0 && (
                                    <div className={styles.tagRow}>
                                        {tags.map((tag, index) => (
                                            <span key={index} className={styles.tag}>
                                                <NavigationLink className={styles.tagSpan} href={`/blog/tag/${tag.tagName}`} key={index}>
                                                      #{tag.tagName}
                                                </NavigationLink>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>

            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                basePath={'/blog'}
                size={size}
            />
        </div>
    );
}
