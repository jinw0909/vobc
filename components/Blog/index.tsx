import styles from "./styles.module.css";
import Image from "next/image";
import { getLocale } from "next-intl/server";
import { NavigationLink } from "@/ui/NavigationLink";
import arrowRight from "@/public/icons/arrow-up-white.png";
import BlogRest from "@/components/BlogRest";

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

interface PostTag {
    sortOrder: number;
    tagName: string;
    primaryTag: boolean;
}

interface PostItem {
    id: number;
    title: string;
    content: string;
    author: string;
    summary: string;
    releaseDate: string | null;
    thumbnail: string | null;
    postTags: PostTag[];
}



async function fetchFeatured(lang: string): Promise<PostItem | null> {
    const res = await fetch(`${API_BASE}/api/post/query/featured?lang=${lang}`, {
        next: { revalidate: 10 },
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function BlogPage() {
    const locale = await getLocale();
    const lang =
        locale === "en" || locale === "kr" || locale === "jp" || locale === "cn"
            ? locale
            : "en";

    const featured = await fetchFeatured(lang);

    if (!featured) {
        // featured가 없으면: REST가 알아서 "전체 최신 1개 제외" fallback 하도록 백엔드에서 처리할 거라
        // 여기선 featured UI만 숨기고 RestPosts만 보여주면 됨.
        return (
            <div className={styles.blogWrapper}>
                <BlogRest lang={lang} excludeId={null} pageSize={3} />
            </div>
        );
    }

    const firstId = featured.id;
    const firstTitle = featured.title;
    const firstDate = featured.releaseDate ?? "";
    const firstSummary = featured.summary;
    const firstAuthor = featured.author;
    const firstTags = featured.postTags ?? [];

    return (
        <div className={styles.blogWrapper}>
            {/* ---- Featured ---- */}
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
                                            style={{ objectFit: "cover" }}
                                            className={styles.svgArrow}
                                            unoptimized
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
                                    {firstTags.map((tag, index) => (
                                        <span key={index} className={styles.tag}>
                      <NavigationLink
                          className={styles.tagSpan}
                          href={`/blog/tag/${tag.tagName}`}
                      >
                        #{tag.tagName}
                      </NavigationLink>
                    </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <NavigationLink className={styles.imageLink} href={`/blog/${firstId}`} scroll={true}>
                            <div className={styles.imageElem}>
                                {featured.thumbnail && (
                                    <Image
                                        src={featured.thumbnail}
                                        alt={firstTitle}
                                        style={{ objectFit: "cover" }}
                                        fill
                                        unoptimized
                                    />
                                )}
                            </div>
                        </NavigationLink>

                        <p className={styles.blogSummaryMobile}>{firstSummary}</p>

                        <div className={styles.tagElemMobile}>
                            {firstTags.length > 0 && (
                                <div className={styles.tagRow}>
                                    {firstTags.map((tag, index) => (
                                        <span key={index} className={styles.tag}>
                          <NavigationLink
                              className={styles.tagSpan}
                              href={`/blog/tag/${tag.tagName}`}
                          >
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

            {/* ---- Filter Bar (그대로 유지) ---- */}
            <div className={styles.filterBar} />

            {/* ---- Rest (Load more) ---- */}
            <BlogRest lang={lang} excludeId={firstId} pageSize={3} />
        </div>
    );
}
