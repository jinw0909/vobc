import styles from './styles.module.css'
import {NewsAcc} from "@/ui/NewsAcc";
import image0 from '@/public/news/herald.jpeg';
import image1 from '@/public/news/herald2.jpeg';
import image2 from '@/public/news/herald3.jpeg';
import image3 from '@/public/news/herald4.jpeg';
import image4 from '@/public/news/cointelegraphimage.png';
import image5 from '@/public/news/retriseminar.jpeg';
import data from '@/json/news.json';

const data1 = data.slice(0, 3);
const data2 = data.slice(3, 6);
const imgSrc1 = [image0, image1, image2, ];
const imgSrc2 = [image3, image4, image5]
export function News() {
    return (
        <div className={styles.newsWrapper}>
            <NewsAcc data={data1} imgSrc={imgSrc1}/>
            <div className={styles.middleContent}>
                For over a decade VOB foundation has deepend its partnerships with global cryptocurrency exchanges and buisness organizations, including L BANK, CoinTR pro, and multiple domestic exchanges.
                VOBs own token economy initiatives include the rising-X platform, a digital platfrom dedicated to crypto currency trading of the VOB community and the overall token ecosystem including the upcomming NFT project.
                Our collaborations and programs embrace the complexities of the crypto currency landscape by exploring new ideas and perspectives with individuals and organizations
                within and beyond the token ecosystem. The team steering these partnerships and initiatives is the VOB foundation. Our goal is to spark meaningful trading experience,
                cultivate the use of aritificial intelligence in trading, and facilitate NFT project that connects across boundaries by supporting the
                token economy that inspires us all.
            </div>
            <NewsAcc data={data2} imgSrc={imgSrc2}/>
        </div>
    )
}