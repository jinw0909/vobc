import styles from './styles.module.css';
import {NewsMediaBand} from "@/ui/NewsMediaBand";
import newsImages from '@/newsImages'
import data from '@/json/news.json';
import {getTranslations} from "next-intl/server";
import {LogoPlain} from "@/ui/LogoPlain";
import { Noto_Sans_JP} from "next/font/google";

const notosansjp = Noto_Sans_JP({
    weight: ['200', '300', '400', '500', '600', '700', '900'],
    style : "normal",
    subsets: ['latin']
});

const data0 = data.slice(0, 7);
const data1 = data.slice(7, 18);
const data2 = data.slice(18, 23);
const image0 = newsImages.slice(0, 7).map((i:any) => i.image);
const image1 = newsImages.slice(7, 18).map((i:any) => i.image);
const image2 = newsImages.slice(18, 23).map((i:any) => i.image);
// const imgSrc25 = [newsImages[0].image, newsImages[1].image, newsImages[2].image]
// const imgSrc24 = [newsImages[3].image, newsImages[4].image, newsImages[5].image, newsImages[6].image];
// const imgSrc23 = [newsImages[7].image, newsImages[8].image, newsImages[9].image, newsImages[10].image, newsImages[11].image, newsImages[12].image]

export async function NewsMedia() {

    const t = await getTranslations('media');

    return (
        <div className={styles.mediaWrapper}>
            <div className={styles.header}>
                <div className={`${styles.headerTitle} ${styles.fadeInAnimation}`}>
                    <div>{t('title')}</div>
                    <div className={`${styles.logoPlain} ${styles.delayedAnimation}`}>
                        <LogoPlain></LogoPlain>
                    </div>
                    <div className={`${notosansjp.className} ${styles.hashTags} ${styles.delayedAnimation}`}>
                        <span>#Event</span>
                        <span>#Interview</span>
                        <span>#Article</span>
                    </div>
                </div>
            </div>
            <p className={`${styles.headerDesc} ${styles.textGradient} ${styles.moreDelayedAnimation}`}>
                {t('description')}
            </p>
            <div className={`${styles.main} ${styles.moreDelayedAnimation}`}>
                <div className={styles.yearWrapper}>
                    <h2 className={styles.year}>2025</h2>
                    <hr className={styles.horizontal}/>
                    <div>
                        <NewsMediaBand data={data0} imgSrc={image0} index={0}></NewsMediaBand>
                    </div>
                </div>
                <div className={styles.yearWrapper}>
                    <h2 className={styles.year}>2024</h2>
                    <hr className={styles.horizontal}/>
                    <div>
                        <NewsMediaBand data={data1} imgSrc={image1} index={7}></NewsMediaBand>
                    </div>
                </div>
                <div className={styles.yearWrapper}>
                    <h2 className={styles.year}>2023</h2>
                    <hr className={styles.horizontal}/>
                    <div>
                        <NewsMediaBand data={data2} imgSrc={image2} index={18}></NewsMediaBand>
                    </div>
                </div>
            </div>
            <div className={styles.about}>
                <div className={styles.mediaAbout}>{t('about')}</div>
                <div className={styles.mediaHeader}>
                    {t('title')}
                </div>
                <p className={`${styles.mediaDesc} ${styles.textGradient}`}>
                    {t('aboutDesc')}
                </p>
            </div>
        </div>
    )
}