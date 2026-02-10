'use client';

import styles from './styles.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Link} from "@/i18n/navigation";

export type RelatedPostTag = {
    tagId: number;
    tagName: string;
    sortOrder: number | null;
    postId: number;
    primaryTag: boolean;
};

export type RelatedPost = {
    id: number;
    title: string;
    summary: string;
    author: string;
    thumbnail?: string | null;
    releaseDate?: string | null;
    postTags?: RelatedPostTag[];
};

type Props = {
    items: RelatedPost[];
    locale: string;
};

export function RelatedPosts({ items, locale }: Props) {
    if (!items || items.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className={styles.headerRow}>
                <h3 className={styles.title}>Related Posts</h3>
            </div>

            <Swiper
                className={styles.swiper}
                modules={[Navigation, Pagination, Mousewheel]}
                mousewheel={{ forceToAxis: true, sensitivity: 1 }}
                navigation={false}
                pagination={false}
                spaceBetween={16}
                slidesPerView={1.15}
                centeredSlides={false}
                watchOverflow
                breakpoints={{
                    640: { slidesPerView: 2.15, spaceBetween: 16 },
                }}
            >
                {items.map((r) => {
                    const primary = r.postTags?.find((t) => t.primaryTag);
                    const tags = (r.postTags ?? []).slice(0, 3);

                    return (
                        <SwiperSlide key={r.id} className={styles.slide}>
                            <a href={`/${locale}/blog/${r.id}`} className={styles.card}>
                                <div className={styles.cardWrapper}>
                                    <div className={styles.cardTitle}>
                                        <p className={styles.cardTitleText}>{r.title}</p>
                                    </div>

                                    {r.thumbnail && (
                                        <div
                                            className={styles.imgWrapper}
                                            style={{ backgroundImage: `url(${r.thumbnail})` }}
                                        />
                                    )}

                                    <div className={styles.cardDesc}>
                                        {r.summary && (
                                            <p className={styles.summary}>{r.summary}</p>
                                        )}
                                        <div className={styles.meta}>
                                            {r.author}
                                            {r.releaseDate && ` · ${r.releaseDate}`}
                                        </div>
                                    </div>
                                </div>
                            </a>
                            {(r.postTags?.length ?? 0) > 0 && (
                                <div className={styles.tagRow}>
                                    {primary && (
                                        <Link
                                            href={`/blog/tag/${encodeURIComponent(primary.tagName)}`}
                                            className={`${styles.tag} ${styles.primaryTag}`}
                                        >
                                            #{primary.tagName}
                                        </Link>
                                    )}


                                    {tags
                                        .filter((t) => !t.primaryTag)
                                        .map((t) => (
                                            <Link
                                                key={t.tagId}
                                                href={`/blog/tag/${encodeURIComponent(t.tagName)}`}
                                                className={styles.tag}
                                            >
                                                #{t.tagName}
                                            </Link>
                                    ))}

                                </div>
                            )}
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </section>
    );
}
