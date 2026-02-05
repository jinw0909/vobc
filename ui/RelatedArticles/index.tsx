// components/RelatedArticles/RelatedArticles.tsx
'use client';

import styles from './styles.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel } from 'swiper/modules';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export type RelatedArticle = {
    id: number;
    title: string;
    thumbnail?: string | null;
    releaseDate?: string | null;
    publisherName?: string | null;
};

type Props = {
    items: RelatedArticle[];
};

export function RelatedArticles({ items }: Props) {
    if (!items || items.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className={styles.headerRow}>
                <h3 className={styles.title}>Related Articles</h3>
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
                    // 1024: { slidesPerView: 3, spaceBetween: 16 },
                }}
            >
                {items.map((r) => (
                    <SwiperSlide key={r.id} className={styles.slide}>
                        <a href={`/news/${r.id}`} className={styles.card}>
                            <div className={styles.cardWrapper}>
                                <div>
                                    <div className={styles.cardTitle}>
                                        <p className={styles.cardTitleText}>
                                            {r.title}
                                        </p>
                                    </div>
                                </div>
                                {r.thumbnail && (
                                    <div
                                        className={styles.imgWrapper}
                                        style={{backgroundImage: `url(${r.thumbnail})`}}
                                    >
                                        {/*<Image*/}
                                        {/*    src={r.thumbnail}*/}
                                        {/*    alt={r.title}*/}
                                        {/*    className={styles.thumbnail}*/}
                                        {/*    loading="lazy"*/}
                                        {/*    unoptimized={true}*/}
                                        {/*/>*/}
                                    </div>
                                )}
                                <div className={styles.cardDesc}>
                                    <div className={styles.meta}>
                                        {r.publisherName}
                                        {r.releaseDate && ` · ${r.releaseDate}`}
                                    </div>


                                </div>
                            </div>
                        </a>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
