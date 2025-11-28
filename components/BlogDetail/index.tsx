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
    // const lang = locale === 'en' ? 'en' : 'kr';
    const lang = 'en';

    const post = blogData.find((p) => p.id === id);

    if (!post) {
        notFound();
    }

    const title = post.title[lang] || post.title.kr;
    const author = post.author[lang] || post.author.kr;
    const rawContent = post.content[lang] || post.content.kr;

    // keep line breaks visually
    const htmlContent = rawContent.replace(/\n/g, '<br />');

    return (
        <div className={styles.detailWrapper}>
            <article className={styles.blogDetail}>
                <header className={styles.blogHeader}>
                    <div className={styles.blogMeta}>
                        <div className={styles.blogFooter}>
                            <Link href="/blog">Back to Index</Link>
                        </div>
                        <p className={styles.blogDate}>{post.date}</p>
                        <h1 className={styles.blogTitle}>{title}</h1>
                        <p className={styles.blogAuthor}>By {author}</p>
                        {post.tags?.length > 0 && (
                            <div className={styles.tagRow}>
                                {post.tags.map((tag: string) => (
                                    <span key={tag} className={styles.tag}>
                                      #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </header>

                <section className={styles.blogSection}>
                    <div
                        className={styles.blogContent}
                        dangerouslySetInnerHTML={{__html: htmlContent}}
                    ></div>
                </section>

            </article>
        </div>
    );
}
