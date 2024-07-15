import styles from './styles.module.css';
import {NewsMediaBand} from "@/ui/NewsMediaBand";
import image0 from '@/public/news/koreatimes0.jpg';
import image1 from '@/public/news/herald6.jpg';
import image2 from '@/public/news/herald.jpeg'
import image3 from '@/public/news/herald2.jpeg';
import image4 from '@/public/news/herald3.jpeg';
import image5 from '@/public/news/herald4.jpeg';
import image6 from '@/public/news/cointelegraphimage.png';
import image7 from '@/public/news/retriseminar.jpeg';
import data from '@/json/news.json';
import {getTranslations} from "next-intl/server";
import {LogoPlain} from "@/ui/LogoPlain";

const data1 = data.slice(0, 2);
const data2 = data.slice(2, 8);
const imgSrc1 = [image0, image1];
const imgSrc2 = [image2, image3, image4, image5, image6, image7]

export async function NewsMedia() {

    const t = await getTranslations('media');

    return (
        <div className={styles.mediaWrapper}>
            <div className={styles.header}>
                <div className={styles.headerTitle}>
                    <div>{t('title')}</div>
                    <div className={styles.logoPlain}>
                        <LogoPlain></LogoPlain>
                    </div>
                    <div className={styles.hashTags}>
                        <span>#Event</span>
                        <span>#Interview</span>
                        <span>#Article</span>
                    </div>
                </div>
            </div>
            <p className={`${styles.headerDesc} ${styles.textGradient}`}>
                {t('description')}
            </p>
            <div className={styles.main}>
                <div className={styles.yearWrapper}>
                    <h2 className={styles.year}>2024</h2>
                    <hr className={styles.horizontal} />
                    <div>
                        <NewsMediaBand data={data1} imgSrc={imgSrc1} index={0}></NewsMediaBand>
                    </div>
                </div>
                <div className={styles.yearWrapper}>
                    <h2 className={styles.year}>2023</h2>
                    <hr className={styles.horizontal} />
                    <div>
                        <NewsMediaBand data={data2} imgSrc={imgSrc2} index={2}></NewsMediaBand>
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