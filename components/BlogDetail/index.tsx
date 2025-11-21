import styles from './styles.module.css';
import blogData from '@/json/blog.json';
import {getLocale} from 'next-intl/server';
import Link from 'next/link';
import {notFound} from "next/navigation";

interface PageProps {
    params: {
        idx: string;
    };
}

export default async function BlogDetail({idx} : {idx : any}) {
    const id = Number(idx);
    const locale = await getLocale();
    const lang = locale === 'en' ? 'en' : 'kr';

    const post = blogData.find((p) => p.id === id);

    if (!post) {
        notFound();
    }

    const title = post.title[lang] || post.title.kr;
    const rawContent = post.content[lang] || post.content.kr;

    // keep line breaks visually
    const htmlContent = rawContent.replace(/\n/g, '<br />');

    return (
        <div className={styles.blogWrapper}>
            <article className={styles.blogDetail}>
                <header className={styles.blogHeader}>
                    <h1>{title}</h1>
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
                </header>

                <section
                    className={styles.blogContent}
                    dangerouslySetInnerHTML={{__html: htmlContent}}
                />

                <footer className={styles.blogFooter}>
                    <Link href="/blog">← 블로그 목록으로</Link>
                </footer>
            </article>
        </div>
    );
}
