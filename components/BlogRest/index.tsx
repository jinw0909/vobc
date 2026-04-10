// "use client";
//
// import { useEffect, useMemo, useState } from "react";
// import styles from "./styles.module.css";
// import Image from "next/image";
// import { NavigationLink } from "@/ui/NavigationLink";
//
// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
//
// interface PostTag {
//     sortOrder: number;
//     tagName: string;
//     primaryTag: boolean;
// }
//
// interface PostItem {
//     id: number;
//     title: string;
//     content: string;
//     author: string;
//     summary: string;
//     releaseDate: string | null;
//     thumbnail: string | null;
//     postTags: PostTag[];
// }
//
// interface PagedResponse<T> {
//     content: T[];
//     number: number;
//     size: number;
//     totalElements: number;
//     totalPages: number;
// }
//
// type Props = {
//     lang: string;
//     excludeId: number | null;
//     pageSize?: number; // default 3
// };

// export default function BlogRest({ lang, excludeId, pageSize = 3 }: Props) {
//     const [items, setItems] = useState<PostItem[]>([]);
//     const [pageToLoad, setPageToLoad] = useState(0); // 다음에 로드할 page (0-based)
//     const [totalElements, setTotalElements] = useState<number | null>(null);
//
//     const [loading, setLoading] = useState(false);
//     const [errorMsg, setErrorMsg] = useState<string | null>(null);
//
//     const hasMore = useMemo(() => {
//         if (totalElements == null) return true;
//         return items.length < totalElements;
//     }, [items.length, totalElements]);
//
//     async function load(nextPage: number) {
//         if (loading) return;
//         setLoading(true);
//         setErrorMsg(null);
//
//         const qs = new URLSearchParams();
//         qs.set("lang", lang);
//         qs.set("page", String(nextPage));
//         qs.set("size", String(pageSize));
//         if (excludeId != null) qs.set("featuredId", String(excludeId));
//
//         try {
//             const res = await fetch(`${API_BASE}/api/post/query/rest?${qs.toString()}`, {
//                 cache: "no-store",
//             });
//             if (!res.ok) throw new Error(`Failed to load posts (${res.status})`);
//
//             const data: PagedResponse<PostItem> = await res.json();
//             const newItems = data.content ?? [];
//
//             setTotalElements(data.totalElements);
//
//             setItems((prev) => (nextPage === 0 ? newItems : [...prev, ...newItems]));
//             setPageToLoad(data.number + 1); // 다음 page
//         } catch (e: any) {
//             setErrorMsg(e?.message ?? "Failed to load posts");
//         } finally {
//             setLoading(false);
//         }
//     }
//
//     // 최초 로드 / lang, excludeId 바뀌면 리셋 후 0페이지 로드
//     useEffect(() => {
//         setItems([]);
//         setPageToLoad(0);
//         setTotalElements(null);
//         setErrorMsg(null);
//
//         load(0);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [lang, excludeId, pageSize]);
//
//     return (
//         <>
//             {/* 상단 카운트 */}
//             <div className={styles.countBar}>
//                 {totalElements != null ? (
//                     <p>
//                         Showing <b>{items.length}</b> of <b>{totalElements}</b> posts
//                     </p>
//                 ) : (
//                     <p>
//                         Showing <b>{items.length}</b> posts
//                     </p>
//                 )}
//             </div>
//
//             {items.length === 0 && !loading && !errorMsg && (
//                 <div className={styles.blogWrapper}>
//                     <p>No posts yet.</p>
//                 </div>
//             )}
//
//             {errorMsg && (
//                 <div style={{ padding: 12 }}>
//                     <p>{errorMsg}</p>
//                     <button onClick={() => load(items.length === 0 ? 0 : pageToLoad)} disabled={loading}>
//                         Retry
//                     </button>
//                 </div>
//             )}
//
//             <ul className={styles.blogList}>
//                 {items.map((post) => {
//                     const title = post.title;
//                     const date = post.releaseDate ?? "";
//                     const summary = post.summary;
//                     const author = post.author;
//                     const tags = post.postTags ?? [];
//
//                     return (
//                         <li key={post.id}>
//                             <div className={styles.blogItemInner}>
//                                 <NavigationLink className={styles.blogTitle} href={`/blog/${post.id}`} scroll={true}>
//                                     <p className={styles.inline}>{title}</p>
//                                 </NavigationLink>
//
//                                 <div className={styles.blogThumbnail}>
//                                     <NavigationLink href={`/blog/${post.id}`} scroll={true}>
//                                         <div className={styles.imageElem}>
//                                             {post.thumbnail && (
//                                                 <Image src={post.thumbnail} alt={title} style={{ objectFit: "cover" }} fill unoptimized/>
//                                             )}
//                                         </div>
//                                     </NavigationLink>
//                                 </div>
//
//                                 <p className={styles.blogSummary}>{summary}</p>
//                                 <p className={styles.blogAuthor}>
//                                     {author} | {date}
//                                 </p>
//
//                                 {tags.length > 0 && (
//                                     <div className={styles.tagRow}>
//                                         {tags.map((tag, index) => (
//                                             <span key={index} className={styles.tag}>
//                                                 <NavigationLink className={styles.tagSpan} href={`/blog/tag/${tag.tagName}`}>
//                                                   #{tag.tagName}
//                                                 </NavigationLink>
//                                             </span>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                         </li>
//                     );
//                 })}
//             </ul>
//
//             {/* 마지막 페이지면 버튼 숨김 (No more 문구 없음) */}
//             {hasMore && (
//                 <div className={styles.moreButtonWrapper}>
//                     <div className={styles.moreButton} onClick={() => load(pageToLoad)} >
//                         <button disabled={loading}>
//                             {loading ? "Loading..." : "Load More"}
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }


"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import { NavigationLink } from "@/ui/NavigationLink";
import arrowUpWhite from "@/public/icons/arrow-up-white.png"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

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

interface PagedResponse<T> {
    content: T[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

type Props = {
    lang: string;
    excludeId: number | null;
    pageSize?: number;
};

type FilterTab = "blogType" | "contributor";

const BLOG_TYPES = ["Review", "Feature", "Interview"];

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const DUMMY_PUBLISHERS: Record<string, string[]> = {
    A: ["Ars Technica", "Axios", "Android Authority"],
    B: ["Bloomberg", "Business Insider", "BBC"],
    C: ["CNBC", "CNET", "CoinDesk"],
    D: ["Daily Beast", "Digital Trends"],
    E: ["Engadget", "ESPN"],
    F: ["Forbes", "Fortune"],
    G: ["Gizmodo", "GameSpot"],
    H: ["HuffPost"],
    I: ["Insider Intelligence"],
    J: ["Japan Times"],
    K: ["Kedglobal", "Korea Herald"],
    L: ["Los Angeles Times"],
    M: ["Mashable", "MIT Technology Review"],
    N: ["New York Times", "Nikkei Asia"],
    O: ["Observer"],
    P: ["Polygon"],
    Q: ["Quartz"],
    R: ["Reuters", "Rolling Stone"],
    S: ["Statista", "The Straits Times"],
    T: ["TechCrunch", "The Verge", "The Guardian"],
    U: ["USA Today"],
    V: ["Variety", "VentureBeat"],
    W: ["WIRED", "Wall Street Journal"],
    X: ["XDA Developers"],
    Y: ["Yahoo Finance"],
    Z: ["ZDNET"],
};

export default function BlogRest({ lang, excludeId, pageSize = 3 }: Props) {
    const [items, setItems] = useState<PostItem[]>([]);
    const [pageToLoad, setPageToLoad] = useState(0);
    const [totalElements, setTotalElements] = useState<number | null>(null);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // UI state
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<FilterTab>("blogType");
    const [selectedAlphabet, setSelectedAlphabet] = useState<string | null>(null);

    const [selectedBlogType, setSelectedBlogType] = useState<string | null>(null);
    const [selectedContributor, setSelectedContributor] = useState<string | null>(null);

    const hasMore = useMemo(() => {
        if (totalElements == null) return true;
        return items.length < totalElements;
    }, [items.length, totalElements]);

    async function load(nextPage: number) {
        if (loading) return;
        setLoading(true);
        setErrorMsg(null);

        const qs = new URLSearchParams();
        qs.set("lang", lang);
        qs.set("page", String(nextPage));
        qs.set("size", String(pageSize));
        if (excludeId != null) qs.set("featuredId", String(excludeId));

        try {
            const res = await fetch(`${API_BASE}/api/post/query/rest?${qs.toString()}`, {
                cache: "no-store",
            });
            if (!res.ok) throw new Error(`Failed to load posts (${res.status})`);

            const data: PagedResponse<PostItem> = await res.json();
            const newItems = data.content ?? [];

            setTotalElements(data.totalElements);
            setItems((prev) => (nextPage === 0 ? newItems : [...prev, ...newItems]));
            setPageToLoad(data.number + 1);
        } catch (e: any) {
            setErrorMsg(e?.message ?? "Failed to load posts");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setItems([]);
        setPageToLoad(0);
        setTotalElements(null);
        setErrorMsg(null);
        load(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lang, excludeId, pageSize]);

    const handleToggleFilter = () => {
        if (isFilterOpen) {
            resetFilterSteps();
            return;
        }

        setIsFilterOpen(true);
        setActiveTab("blogType");
    };

    const handleTabClick = (tab: FilterTab) => {
        setIsFilterOpen(true);
        setActiveTab(tab);
    };

    const resetFilterSteps = () => {
        setIsFilterOpen(false);
        setActiveTab("blogType");
        setSelectedAlphabet(null);
        setSelectedBlogType(null);
        setSelectedContributor(null);
    };

    const showFilterArrow = isFilterOpen;

    return (
        <>
            <div className={`${styles.countBar} ${isFilterOpen ? styles.countBarExpanded : ""}`}>
                <div className={styles.countBarTopRow}>
                    <div className={styles.filterLeftGroup}>
                        <button
                            type="button"
                            className={styles.filterButton}
                            onClick={handleToggleFilter}
                        >
                            Filter by
                        </button>

                        {showFilterArrow && (
                            <button
                                type="button"
                                className={styles.filterArrowButton}
                                onClick={resetFilterSteps}
                                aria-label="Close filter"
                            >
                                <Image
                                    src={arrowUpWhite}
                                    alt="Close filter"
                                    width={20}
                                    height={20}
                                />
                            </button>
                        )}

                        <button
                            type="button"
                            className={`${styles.filterTab} ${activeTab === "blogType" ? styles.filterTabActive : ""}`}
                            onClick={() => handleTabClick("blogType")}
                        >
                            Blog Type
                        </button>

                        <button
                            type="button"
                            className={`${styles.filterTab} ${activeTab === "contributor" ? styles.filterTabActive : ""}`}
                            onClick={() => handleTabClick("contributor")}
                        >
                            Contributor
                        </button>
                    </div>

                    <div className={styles.countRightText}>
                        {totalElements != null ? (
                            <p>
                                Showing <b>{items.length}</b> of <b>{totalElements}</b> posts
                            </p>
                        ) : (
                            <p>
                                Showing <b>{items.length}</b> posts
                            </p>
                        )}
                    </div>
                </div>

                <div
                    className={`${styles.filterPanelWrap} ${
                        isFilterOpen ? styles.filterPanelWrapOpen : ""
                    }`}
                >
                    <div className={styles.filterPanel}>
                        {activeTab === "blogType" && (
                            <div className={styles.optionRow}>
                                {BLOG_TYPES.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        className={`${styles.textFilterButton} ${
                                            selectedBlogType === type ? styles.textButtonActive : ""
                                        }`}
                                        onClick={() => setSelectedBlogType(type)}
                                    >
                                        #{type}
                                    </button>
                                ))}
                            </div>
                        )}

                        {activeTab === "contributor" && (
                            <div className={styles.contributorPanel}>
                                <div className={styles.alphabetRow}>
                                    {ALPHABETS.map((alphabet) => (
                                        <button
                                            key={alphabet}
                                            type="button"
                                            className={`${styles.alphaTextButton} ${
                                                selectedAlphabet === alphabet ? styles.textButtonActive : ""
                                            }`}
                                            onClick={() => setSelectedAlphabet(alphabet)}
                                        >
                                            {alphabet}
                                        </button>
                                    ))}
                                </div>

                                <div
                                    className={`${styles.publisherWrap} ${
                                        selectedAlphabet ? styles.publisherWrapOpen : ""
                                    }`}
                                >
                                    {selectedAlphabet && (
                                        <div className={styles.publisherRow}>
                                            {(DUMMY_PUBLISHERS[selectedAlphabet] ?? []).map((publisher) => (
                                                <button
                                                    key={publisher}
                                                    type="button"
                                                    className={`${styles.textFilterButton} ${
                                                        selectedContributor === publisher ? styles.textButtonActive : ""
                                                    }`}
                                                    onClick={() => setSelectedContributor(publisher)}
                                                >
                                                    {publisher}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {items.length === 0 && !loading && !errorMsg && (
                <div className={styles.blogWrapper}>
                    <p>No posts yet.</p>
                </div>
            )}

            {errorMsg && (
                <div style={{ padding: 12 }}>
                    <p>{errorMsg}</p>
                    <button onClick={() => load(items.length === 0 ? 0 : pageToLoad)} disabled={loading}>
                        Retry
                    </button>
                </div>
            )}

            <ul className={styles.blogList}>
                {items.map((post) => {
                    const title = post.title;
                    const date = post.releaseDate ?? "";
                    const summary = post.summary;
                    const author = post.author;
                    const tags = post.postTags ?? [];

                    return (
                        <li key={post.id}>
                            <div className={styles.blogItemInner}>
                                <NavigationLink className={styles.blogTitle} href={`/blog/${post.id}`} scroll={true}>
                                    <p className={styles.inline}>{title}</p>
                                </NavigationLink>

                                <div className={styles.blogThumbnail}>
                                    <NavigationLink href={`/blog/${post.id}`} scroll={true}>
                                        <div className={styles.imageElem}>
                                            {post.thumbnail && (
                                                <Image
                                                    src={post.thumbnail}
                                                    alt={title}
                                                    style={{ objectFit: "cover" }}
                                                    fill
                                                    unoptimized
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
                        <NavigationLink className={styles.tagSpan} href={`/blog/tag/${tag.tagName}`}>
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

            {hasMore && (
                <div className={styles.moreButtonWrapper}>
                    <div className={styles.moreButton} onClick={() => load(pageToLoad)}>
                        <button disabled={loading}>
                            {loading ? "Loading..." : "Load More"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}