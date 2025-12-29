import styles from './styles.module.css';
import Image from 'next/image';
import arrowUp from '@/public/icons/arrow-up-white.png';
import arrowRight from '@/public/icons/right-arrow-white.png';
import { NavigationLink } from "@/ui/NavigationLink";
import Link from "next/link";
import sanitizeHtml from "sanitize-html";

type NewsArticle = {
    id: string;
    title: string;
    subtitle: string;
    content: string;
    date: string;
    author: string;
    press: string;
    desc: string;
    pressdesc: string;
    link: string;
    thumbnail: string; // ✅ 추가
};

export function NewsDetail({ article }: { article: NewsArticle }) {
    // const contentArr = article.content ? article.content.split('\n') : [];

    const safeHtml = sanitizeHtml(article.content ?? "", {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            "img", "figure", "figcaption", "h1", "h2", "h3", "h4",
        ]),
        allowedAttributes: {
            a: ["href", "name", "target", "rel"],
            img: ["src", "alt", "title", "width", "height", "loading"],
            // "*": ["class", "style"],
        },
        allowedSchemes: ["http", "https", "data"],
        transformTags: {
            a: (tagName, attribs) => ({
                tagName,
                attribs: {
                    ...attribs,
                    target: "_blank",
                    rel: "noopener noreferrer",
                },
            }),
            // ✅ 혹시라도 남아있을 style을 확실히 제거
            p: (tagName, attribs) => ({ tagName, attribs: {} }),
            span: (tagName, attribs) => ({ tagName, attribs: {} }),
            div: (tagName, attribs) => ({ tagName, attribs: {} }),
        },
    });


    return (
        <div className={styles.detailWrapper}>
            <div className={styles.detailUp}>
                <div className={styles.left}>
                    <div className={styles.leftContent}>
                        <div className={styles.newsDate}>{article.date}</div>
                        <div className={styles.newsTitle}>{article.title}</div>
                        <div className={styles.newsAuthor}>
                            {`${article.author === '' ? article.press : `By ${article.author}, ${article.press}`}`}
                        </div>
                    </div>

                    <div className={styles.leftContentDown}>
                        <NavigationLink href="/news/media">
                            <div className={styles.backToMain}>
                                <Image className={styles.leftArrow} src={arrowRight} width={12} height={12} alt="left arrow" />
                                <span>To List</span>
                            </div>
                        </NavigationLink>
                    </div>
                </div>

                <div className={styles.right}>
                    <div className={styles.imageWrapper}>
                        <Image
                            src={article.thumbnail} // ✅ thumbnail로 대체 (fallback은 너 프로젝트에 맞게)
                            fill={true}
                            style={{ objectFit: 'cover' }}
                            alt={article.title}
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>

                    <span className={styles.imageDesc}>{article.desc}</span>

                    <div className={styles.mainContent}>
                        <p className={styles.subTitle}>{article.subtitle}</p>
                        <hr />
                        <div
                            className={styles.htmlContent}
                            dangerouslySetInnerHTML={{ __html: safeHtml }}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.detailDown}>
                <div className={styles.downLeft}>
                    <div className={styles.downLeftContent}>
                        <div className={styles.backToTop}>
                            <a href="#">Back to top</a>
                            <Image src={arrowUp} width={16} height={16} alt="arrow to top" />
                        </div>

                        <div className={styles.backToTop}>
                            <Link
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                locale={undefined}
                            >
                                To the original report
                            </Link>
                        </div>
                    </div>
                </div>

                <div className={styles.downRight}>
                    <div className={styles.downRightContent}>
                        <hr />
                        <span>About the Press</span>
                        <p>{article.pressdesc}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
