import styles from './styles.module.css';
import Link from 'next/link';
import blogData from '@/json/blog.json';
import {getLocale} from 'next-intl/server';
import Image from 'next/image';
import blogImages from "@/blogImages";
import {NavigationLink} from "@/ui/NavigationLink";
import arrowRight from '@/public/icons/arrow-up-white.png';


export default async function Blog() {
    const locale = await getLocale();             // e.g. 'ko', 'en', 'ja'
    const lang = locale === 'en' ? 'en' : 'kr';   // simple mapping

    return (
        <div className={styles.blogWrapper}>
            <h1>블로그 목록</h1>

            <ul className={styles.blogList}>
                {blogData.map((post, index) => {
                    const title = post.title[lang] || post.title.kr; // fallback to kr
                    const date = post.date
                    const summary = post.summary[lang] || post.summary.kr;
                    const author = post.author[lang] || post.author.kr;
                    const isFirst = index === 0;

                    return (
                        <li key={post.id} className={`${styles.blogItem} ${isFirst ? styles.firstElem : ''}`}>
                            <div className={styles.left}>
                                <div>
                                    <p className={styles.blogDate}>{date}</p>
                                    <NavigationLink className={styles.blogTitle} href={`/blog/${post.id}`}>
                                        <p className={styles.inline}>{title}</p>
                                        <div className={styles.iconElem}>
                                            <Image
                                                alt={"arrowRight"}
                                                src={arrowRight}
                                                fill={true}
                                                style={{objectFit: 'contain'}}
                                                className={styles.svgArrow}
                                            ></Image>
                                        </div>
                                    </NavigationLink>
                                </div>
                                <div>
                                    <p className={styles.blogSummary}>{summary}</p>
                                    <p className={styles.blogAuthor}>{author}</p>
                                </div>
                            </div>
                            <div className={styles.right}>
                                <div className={styles.tagElem}>
                                    <Link href={`/blog/${post.id}`}>
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
                                </div>
                                <div className={styles.imageElem}>
                                    <Image
                                        src={blogImages[0].image}
                                        alt={post.title[lang] || post.title.kr}
                                        style={{objectFit: 'contain'}}
                                        fill={true}
                                    />
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
