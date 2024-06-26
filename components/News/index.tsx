import styles from './styles.module.css'
import {NewsAcc} from "@/ui/NewsAcc";
import image0 from '@/public/news/herald.jpeg';
import image1 from '@/public/news/herald2.jpeg';
import image2 from '@/public/news/herald3.jpeg';
import image3 from '@/public/news/herald4.jpeg';
import image4 from '@/public/news/cointelegraphimage.png';
import image5 from '@/public/news/retriseminar.jpeg';
import data from '@/json/news.json';
import {getTranslations} from "next-intl/server";

const data1 = data.slice(0, 3);
const data2 = data.slice(3, 6);
const imgSrc1 = [image0, image1, image2, ];
const imgSrc2 = [image3, image4, image5]
export async function News() {

    const t = await getTranslations();

    return (
        <div className={styles.newsWrapper}>
            <NewsAcc data={data1} imgSrc={imgSrc1} index={0}/>
            <div className={styles.middleContent}>
                {t('news.0')}
            </div>
            <NewsAcc data={data2} imgSrc={imgSrc2} index={3}/>
            <div className={styles.middleContent}>
                {t('news.1')}
            </div>
        </div>
    )
}