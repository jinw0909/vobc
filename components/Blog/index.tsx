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

    const firstPost = blogData[0];
    const restPosts = blogData.slice(1);

    const firstId = firstPost.id;
    const firstTitle = firstPost.title[lang] || firstPost.title.kr;
    const firstDate = firstPost.date;
    const firstSummary = firstPost.summary[lang] || firstPost.summary.kr;
    const firstAuthor = firstPost.author[lang] || firstPost.author.kr;
    const firstTags = firstPost.tags;

    return (
        <div className={styles.blogWrapper}>
            <div className={styles.blogFirst}>
                <div key={firstId} className={`${styles.firstElem}`}>
                    <div className={styles.left}>
                        <div className={styles.leftTop}>
                            <p className={styles.blogDate}>{firstDate}</p>
                            <NavigationLink className={styles.blogTitle} href={`/blog/${firstId}`}>
                                <p className={styles.inline}>{firstTitle}</p>
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
                        <div className={styles.leftDown}>
                            <p className={styles.blogSummary}>{firstSummary}</p>
                            <p className={styles.blogAuthor}>By {firstAuthor}</p>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.tagElem}>
                            {firstTags?.length > 0 && (
                                <div className={styles.tagRow}>
                                    {firstTags.map((tag: string) => (
                                        <span key={tag} className={styles.tag}>
                                        #{tag}
                                    </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className={styles.imageElem}>
                            <Link href={`/blog/${firstId}`}>
                                <Image
                                    src={blogImages[0].image}
                                    alt={firstTitle}
                                    style={{objectFit: 'contain'}}
                                    fill={true}
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.filterBar}>
                <span>Filter by</span>
                <span>Article Type</span>
                <span>Contributor</span>
            </div>
            <ul className={styles.blogList}>
                {restPosts.map((post, index) => {
                    const title = post.title[lang] || post.title.kr; // fallback to kr
                    const date = post.date
                    const summary = post.summary[lang] || post.summary.kr;
                    const author = post.author[lang] || post.author.kr;

                    return (
                        <li key={post.id} className={`${styles.blogItem}`}>
                            <div>
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
                                <div>
                                    <div className={styles.imageElem}>
                                        <Link href={`/blog/${post.id}`}>
                                            <Image
                                                src={blogImages[0].image}
                                                alt={post.title[lang] || post.title.kr}
                                                style={{objectFit: 'contain'}}
                                                fill={true}
                                            />
                                        </Link>
                                    </div>
                                </div>
                                <p className={styles.blogSummary}>{summary}</p>
                                <p className={styles.blogAuthor}>{author} | {date}</p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
