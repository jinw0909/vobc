import styles from './styles.module.css';
import Image from 'next/image';
import arrowUp from '@/public/icons/arrow-up-white.png';
import arrowRight from '@/public/icons/right-arrow-white.png';
import {NavigationLink} from "@/ui/NavigationLink";
import data from '@/json/news.json';
import Link from "next/link";
import newsImages from '@/newsImages'
import {notFound} from "next/navigation";

export async function NewsDetail({idx} : {idx : any}) {

    const article = data.find(item => item.id === idx);

    if (!article) {
        notFound()
    }

    // 2) find numeric index for this article
    const index = data.findIndex(item => item.id === idx);
    if (index === -1 || !newsImages[index]) {
        // optional: fallback image or 404
        notFound();
    }

    let contentArr: string[] = [];
    if (article.content) { contentArr = article.content.split('\n'); }

    // const content = article.content;
    // if (content) { contentArr = content.split('\n'); }
    // // let contentArr = article.content.split(`\n`);

    return (
        <div className={styles.detailWrapper}>
            <div className={styles.detailUp}>
                <div className={styles.left}>
                    <div className={styles.leftContent}>
                        <div className={styles.newsDate}>{article.date}</div>
                        <div className={styles.newsTitle}>
                            {article.title}
                        </div>
                        <div className={styles.newsAuthor}>
                            {`${article.author == '' ? article.press : `By ${article.author}, ${article.press}`}`}
                        </div>
                    </div>
                    <div className={styles.leftContentDown}>
                        <NavigationLink href="/news/media">
                            <div className={styles.backToMain}>
                                <Image className={styles.leftArrow} src={arrowRight} width={12} height={12} alt="left arrow"/>
                                <span>To List</span>
                            </div>
                        </NavigationLink>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.imageWrapper}>
                        <Image src={newsImages[index].image} fill={true} style={{objectFit: 'cover'}} alt="image0"/>
                    </div>
                    <span className={styles.imageDesc}>
                        {article.desc}
                    </span>
                    <div className={styles.mainContent}>
                        <p className={styles.subTitle}>
                            {article.subtitle}
                        </p>
                        <hr/>
                        {/*<NewsContent content={article.content}/>*/}
                        {
                            contentArr.map((a, i) => {
                                return (
                                    <p key={i}>{a}</p>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div className={styles.detailDown}>
                <div className={styles.downLeft}>
                    <div className={styles.downLeftContent}>
                        <div className={styles.backToTop}>
                            {/*<Link href='#'>Back to top</Link>*/}
                            <a href="#">Back to top</a>
                            <Image src={arrowUp} width={16} height={16} alt="arrow to top" />
                        </div>
                        <div className={styles.backToTop}>
                            <Link href={article.link as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              locale={undefined}>
                                To the original report
                            </Link>
                            {/*<a href="#">To the original report</a>*/}
                        </div>
                    </div>
                </div>
                <div className={styles.downRight}>
                    <div className={styles.downRightContent}>
                        <hr/>
                        <span>About the Press</span>
                        <p>
                            {article.pressdesc}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}