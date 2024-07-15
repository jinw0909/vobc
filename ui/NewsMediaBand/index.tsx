import styles from './styles.module.css';
import Image from "next/image";
import rightArrow from "@/public/icons/right-arrow-white.png";
import {NavigationLink} from "@/ui/NavigationLink";

export async function NewsMediaBand({ data, imgSrc, index } : { data: any, imgSrc: any, index: number}) {
    return (
        <ul className={styles.mediaElementWrapper}>
            {
                data.map((a:any, i:number) => {
                    return (
                        <li key={i} className={styles.mediaElement}>
                            <p className={styles.mediaElemType}>{a.type}</p>
                            <div>
                                <NavigationLink className={styles.white} href={`/news/${i + index}`}>
                                    <p className={styles.mediaElemTitle}>{a.title}</p>
                                </NavigationLink>
                            </div>
                            <div className={styles.mediaElemImg}>
                                <NavigationLink href={`/news/${i + index}`}>
                                <Image fill={true} className={styles.imgCss} src={imgSrc[i]} alt="media image"></Image>
                                </NavigationLink>
                            </div>
                            <div className={styles.mediaElemViewWrapper}>
                            <NavigationLink href={`/news/${i + index}`}>
                                <div className={styles.mediaElemView}>
                                    <span className={styles.viewBtn}>Read Now</span>
                                    <span className={styles.arrowPic}><Image src={rightArrow} width={10} alt="right arrow"></Image></span>
                                </div>
                            </NavigationLink>
                            </div>
                        </li>
                    )
                })
            }
        </ul>
    )
}