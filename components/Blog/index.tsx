import styles from './styles.module.css';
import Link from 'next/link';
import blogData from '@/json/blog.json';
import {getLocale} from 'next-intl/server';

export default async function Blog() {
    const locale = await getLocale();             // e.g. 'ko', 'en', 'ja'
    const lang = locale === 'en' ? 'en' : 'kr';   // simple mapping

    return (
        <div className={styles.blogWrapper}>
            <h1>블로그 목록</h1>

            <ul className={styles.blogList}>
                {blogData.map((post) => {
                    const title = post.title[lang] || post.title.kr; // fallback to kr

                    return (
                        <li key={post.id} className={styles.blogItem}>
                            <Link href={`/blog/${post.id}`}>
                                <h2 className={styles.blogTitle}>{title}</h2>
                                <p className={styles.blogMeta}>{post.date}</p>

                                {post.tags?.length > 0 && (
                                    <div className={styles.tagRow}>
                                        {post.tags.map((tag: string) => (
                                            <span key={tag} className={styles.tag}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
