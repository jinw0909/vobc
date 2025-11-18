// import styles from './styles.module.css'
// import {NewsAcc} from "@/ui/NewsAcc";
// import data from '@/json/news.json';
// import {getTranslations} from "next-intl/server";
// import {NavigationLink} from "@/ui/NavigationLink";
// import newsImages from "@/newsImages";
// const data1 = data.slice(0, 3);
// const data2 = data.slice(3, 6);
// const imgSrc1 = [newsImages[0].image, newsImages[1].image, newsImages[2].image,];
// const imgSrc2 = [newsImages[3].image, newsImages[4].image, newsImages[5].image,]
//
// export async function News() {
//
//     const t = await getTranslations('news');
//
//     return (
//         <div className={styles.newsWrapper}>
//             <NewsAcc data={data1} imgSrc={imgSrc1} index={0}/>
//             <div className={styles.middleContent}>
//                 {t('0')}
//             </div>
//             <NewsAcc data={data2} imgSrc={imgSrc2} index={3}/>
//             <div className={styles.middleContent}>
//                 {t('1')}
//             </div>
//             <div className={styles.viewMore}>
//                 <NavigationLink href={'/news/media'}>
//                     <span className={styles.viewMoreBtn}>{t('more')}</span>
//                 </NavigationLink>
//             </div>
//         </div>
//     )
// }

import styles from './styles.module.css'
import { NewsAcc } from "@/ui/NewsAcc";
import data from '@/json/news.json';
import { getTranslations } from "next-intl/server";
import { NavigationLink } from "@/ui/NavigationLink";
import newsImages from "@/newsImages";

export async function News() {
    const t = await getTranslations('news');

    // Last 6 items
    const firstSixData = data.slice(0, 6);
    const firstSixImages = newsImages.slice(0, 6);

    // First 3 of last 6
    const data1 = firstSixData.slice(0, 3);
    const imgSrc1 = firstSixImages.slice(0, 3).map((img: any) => img.image);

    // Next 3 of last 6
    const data2 = firstSixData.slice(3, 6);
    const imgSrc2 = firstSixImages.slice(3, 6).map((img: any) => img.image);

    return (
        <div className={styles.newsWrapper}>
            <NewsAcc data={data1} imgSrc={imgSrc1} index={0}/>

            <div className={styles.middleContent}>
                {t('0')}
            </div>

            <NewsAcc data={data2} imgSrc={imgSrc2} index={3}/>

            <div className={styles.middleContent}>
                {t('1')}
            </div>

            <div className={styles.viewMore}>
                <NavigationLink href={'/news/media'}>
                    <span className={styles.viewMoreBtn}>{t('more')}</span>
                </NavigationLink>
            </div>
        </div>
    )
}
