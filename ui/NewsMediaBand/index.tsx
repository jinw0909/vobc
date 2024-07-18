import styles from './styles.module.css';
import Image from "next/image";
import rightArrow from "@/public/icons/right-arrow-white.png";
import {NavigationLink} from "@/ui/NavigationLink";
import {getTranslations} from "next-intl/server";
export async function NewsMediaBand({ data, imgSrc, index } : { data: any, imgSrc: any, index: number}) {

    const t = await getTranslations('media');

    return (
        <ul className={styles.mediaElementWrapper}>
            {
                data.map((a:any, i:number) => {

                    let typeText = "";
                    switch (a.type) {
                        case 'editorial':
                            typeText = t('type.editorial');
                            break;
                        case 'interview':
                            typeText = t('type.interview');
                            break;
                        case 'event':
                            typeText = t('type.event');
                            break;
                        default:
                            typeText = a.type;
                    }

                    return (
                        <li key={i} className={styles.mediaElement}>
                            <p className={styles.mediaElemType}>{typeText}</p>
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
                                    <span className={styles.viewBtn}>{t('read')}</span>
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