import styles from './styles.module.css';
import Image from 'next/image';
import arrowUp from '@/public/icons/arrow-up-white.png';
import arrowRight from '@/public/icons/right-arrow-white.png';
import {NavigationLink} from "@/ui/NavigationLink";
import data from '@/json/news.json';
import Link from "next/link";
import newsImages from '@/newsImages'
export async function NewsDetail({idx} : {idx : any}) {

    let contentArr: string[] = [];
    const content = data[idx].content;
    if (content) { contentArr = content.split('\n'); }
    // let contentArr = data[idx].content.split(`\n`);

    return (
        <div className={styles.detailWrapper}>
            <div className={styles.detailUp}>
                <div className={styles.left}>
                    <div className={styles.leftContent}>
                        <div className={styles.newsDate}>{data[idx].date}</div>
                        <div className={styles.newsTitle}>
                            {data[idx].title}
                        </div>
                        <div className={styles.newsAuthor}>
                            {`${data[idx].author == '' ? data[idx].press : `By ${data[idx].author}, ${data[idx].press}`}`}
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
                        <Image src={newsImages[idx].image} fill={true} style={{objectFit: 'cover'}} alt="image0"/>
                    </div>
                    <span className={styles.imageDesc}>
                        {data[idx].desc}
                    </span>
                    <div className={styles.mainContent}>
                        <p className={styles.subTitle}>
                            {data[idx].subtitle}
                        </p>
                        <hr/>
                        {/*<NewsContent content={data[idx].content}/>*/}
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
                            <Link href={data[idx].link as string}
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
                            {data[idx].pressdesc}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}