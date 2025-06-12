import styles from './styles.module.css';
import {NewsMediaBand} from "@/ui/NewsMediaBand";
import image0 from '@/public/news/deepcoin.png';
import image1 from '@/public/news/blockchaintoday.jpg';
import image2 from '@/public/news/koreatimes0.jpg';
import image3 from '@/public/news/herald6.jpg';
import image4 from '@/public/news/herald.jpeg'
import image5 from '@/public/news/herald2.jpeg';
import image6 from '@/public/news/herald3.jpeg';
import image7 from '@/public/news/herald4.jpeg';
import image8 from '@/public/news/cointelegraphimage.png';
import image9 from '@/public/news/retriseminar.jpeg';
import herald250401 from '@/public/news/herald250401.jpg';
import herald250103 from '@/public/news/herald250103.jpg';
import heraldbiz250610 from '@/public/news/heraldbiz250610.jpg';
import data from '@/json/news.json';
import {getTranslations} from "next-intl/server";
import {LogoPlain} from "@/ui/LogoPlain";
import { Noto_Sans_JP} from "next/font/google";

const notosansjp = Noto_Sans_JP({
    weight: ['200', '300', '400', '500', '600', '700', '900'],
    style : "normal",
    subsets: ['latin']
});

const data0 = data.slice(0, 3);
const data1 = data.slice(3, 7);
const data2 = data.slice(7, 13);
const imgSrc25 = [heraldbiz250610, herald250401, herald250103]
const imgSrc1 = [image0, image1, image2, image3];
const imgSrc2 = [image4, image5, image6, image7, image8, image9]

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
                        <NewsMediaBand data={data0} imgSrc={imgSrc25} index={0}></NewsMediaBand>
                    </div>
                </div>
                <div className={styles.yearWrapper}>
                    <h2 className={styles.year}>2024</h2>
                    <hr className={styles.horizontal}/>
                    <div>
                        <NewsMediaBand data={data1} imgSrc={imgSrc1} index={3}></NewsMediaBand>
                    </div>
                </div>
                <div className={styles.yearWrapper}>
                    <h2 className={styles.year}>2023</h2>
                    <hr className={styles.horizontal}/>
                    <div>
                        <NewsMediaBand data={data2} imgSrc={imgSrc2} index={7}></NewsMediaBand>
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