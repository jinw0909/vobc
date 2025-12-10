// import styles from './styles.module.css';
// import Link from 'next/link';
// import blogData from '@/json/blog.json';
// import {getLocale} from 'next-intl/server';
// import Image from 'next/image';
// import blogImages from "@/blogImages";
// import {NavigationLink} from "@/ui/NavigationLink";
// import arrowRight from '@/public/icons/arrow-up-white.png';
//
//
// export default async function Blog() {
//     const locale = await getLocale();             // e.g. 'ko', 'en', 'ja'
//     // const lang = locale === 'en' ? 'en' : 'kr';   // simple mapping
//     const lang = 'en';
//
//     const firstPost = blogData[0];
//     const restPosts = blogData.slice(1);
//
//     const firstId = firstPost.id;
//     const firstTitle = firstPost.title[lang] || firstPost.title.kr;
//     const firstDate = firstPost.date;
//     const firstSummary = firstPost.summary[lang] || firstPost.summary.kr;
//     const firstAuthor = firstPost.author[lang] || firstPost.author.kr;
//     const firstTags = firstPost.tags;
//
//     return (
//         <div className={styles.blogWrapper}>
//             <div className={styles.blogFirst}>
//                 <div key={firstId} className={`${styles.firstElem}`}>
//                     <div className={styles.left}>
//                         <div className={styles.leftTop}>
//                             <p className={styles.blogDate}>{firstDate}</p>
//                             <div className={styles.blogTitle} >
//                                 <NavigationLink href={`/blog/${firstId}`}>
//                                     <p className={styles.inline}>{firstTitle}</p>
//                                     <div className={styles.iconElem}>
//                                         <Image
//                                             alt={"arrowRight"}
//                                             src={arrowRight}
//                                             fill={true}
//                                             style={{objectFit: 'cover'}}
//                                             className={styles.svgArrow}
//                                         ></Image>
//                                     </div>
//                                 </NavigationLink>
//                             </div>
//                         </div>
//                         <div className={styles.leftDown}>
//                             <p className={styles.blogSummary}>{firstSummary}</p>
//                             <p className={styles.blogAuthor}>By {firstAuthor}</p>
//                         </div>
//                     </div>
//                     <div className={styles.right}>
//                         <div className={styles.tagElem}>
//                             {firstTags?.length > 0 && (
//                                 <div className={styles.tagRow}>
//                                     {firstTags.map((tag: string) => (
//                                         <span key={tag} className={styles.tag}>
//                                         #{tag}
//                                     </span>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                         <Link className={styles.imageLink} href={`/blog/${firstId}`}>
//                             <div className={styles.imageElem}>
//                                 <Image
//                                     src={blogImages[0].image}
//                                     alt={firstTitle}
//                                     style={{objectFit: 'cover'}}
//                                     fill={true}
//                                 />
//                             </div>
//                         </Link>
//                         <p className={styles.blogSummaryMobile}>{firstSummary}</p>
//                         <div className={styles.tagElemMobile}>
//                             {firstTags?.length > 0 && (
//                                 <div className={styles.tagRow}>
//                                     {firstTags.map((tag: string) => (
//                                         <span key={tag} className={styles.tag}>
//                                             #{tag}
//                                         </span>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className={styles.filterBar}>
//                 {/*<span>Filter by</span>*/}
//                 {/*<span>Article Type</span>*/}
//                 {/*<span>Contributor</span>*/}
//             </div>
//             <ul className={styles.blogList}>
//                 {restPosts.map((post, index) => {
//                     const title = post.title[lang] || post.title.kr; // fallback to kr
//                     const date = post.date
//                     const summary = post.summary[lang] || post.summary.kr;
//                     const author = post.author[lang] || post.author.kr;
//
//                     return (
//                         <li key={post.id}>
//                             <div className={styles.blogItemInner}>
//                                 <NavigationLink className={styles.blogTitle} href={`/blog/${post.id}`}>
//                                     <p className={styles.inline}>{title}</p>
//                                 </NavigationLink>
//                                 <div className={styles.blogThumbnail}>
//                                     <Link href={`/blog/${post.id}`}>
//                                         <div className={styles.imageElem}>
//                                             <Image
//                                                 src={blogImages[index + 1].image}
//                                                 alt={post.title[lang] || post.title.kr}
//                                                 style={{objectFit: 'cover'}}
//                                                 fill={true}
//                                             />
//                                         </div>
//                                     </Link>
//                                 </div>
//                                 <p className={styles.blogSummary}>{summary}</p>
//                                 <p className={styles.blogAuthor}>{author} | {date}</p>
//                             </div>
//                         </li>
//                     );
//                 })}
//             </ul>
//         </div>
//     );
// }


// app/[locale]/blog/page.tsx (또는 현재 Blog 컴포넌트 위치)
// 기존 파일 교체

import styles from './styles.module.css';
import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import Image from 'next/image';
import { NavigationLink } from '@/ui/NavigationLink';
import arrowRight from '@/public/icons/arrow-up-white.png';

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

interface Tag {
    id: number;
    name: string;
}

interface PostItem {
    id: number;
    title: string;
    content: string;
    author: string;
    summary: string;
    releaseDate: string | null;
    thumbnail: string | null;
    requestedLanguage: string | null;
    effectiveLanguage: string | null;
    translated: boolean;
    createdAt: string;
    updatedAt: string;
    tags: Tag[];
}

interface PagedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export default async function Blog() {
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
        `${API_BASE}/api/post/list?lang=${lang}&page=0&size=10`,
        {
            // 최신 글 보고 싶으면 no-store, 약간 캐싱하고 싶으면 revalidate 사용
            cache: 'no-store',
            // next: { revalidate: 60 },
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

    if (posts.length === 0) {
        return (
            <div className={styles.blogWrapper}>
                <p>No posts yet.</p>
            </div>
        );
    }

    const firstPost = posts[0];
    const restPosts = posts.slice(1);

    const firstId = firstPost.id;
    const firstTitle = firstPost.title;
    const firstDate = firstPost.releaseDate ?? '';
    const firstSummary = firstPost.summary;
    const firstAuthor = firstPost.author;
    const firstTags = firstPost.tags ?? [];

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
                                    {firstTags.map((tag) => (
                                        <span key={tag.id} className={styles.tag}>
                      #{tag.name}
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
                                    {firstTags.map((tag) => (
                                        <span key={tag.id} className={styles.tag}>
                      #{tag.name}
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
                    const tags = post.tags ?? [];

                    return (
                        <li key={post.id}>
                            <div className={styles.blogItemInner}>
                                <NavigationLink
                                    className={styles.blogTitle}
                                    href={`/blog/${post.id}`}
                                    scroll={true}
                                >
                                    <p className={styles.inline}>{title}</p>
                                </NavigationLink>

                                <div className={styles.blogThumbnail}>
                                    <NavigationLink href={`/blog/${post.id}`} scroll={true}>
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
                                        {tags.map((tag) => (
                                            <span key={tag.id} className={styles.tag}>
                        #{tag.name}
                      </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
