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
    return (
        <div className={styles.mediaWrapper}>
            <div className={styles.header}>
                <div className={styles.headerTitle}>
                    <div>The Vision of Blockchain Media</div>
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
                The VOB foundation engaged with the theme of Public Relations as well as larger questions about the intersection of communities and the VOB foundation through the launch of Vision of Blockchain Media. The series of public materials bring together a variety of publics to engage with inspiring and impactful experiences. The media is based on the idea of exploring and examining the vast potentials of idea-technology convergence and offers a sequence of materials including conversations and talks, editorial articles, interviews, VOB related promotions and events.
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
                <div className={styles.mediaAbout}>About the Media</div>
                <div className={styles.mediaHeader}>The Vision of Blockchain Media</div>
                <p className={`${styles.mediaDesc} ${styles.textGradient}`}>
                Launched in 2022, the Vision of Blockchain Media is a series of original medium that interpret the hybridity of VOB token ecosystem, each created in collaboration with contemporary cryptocurrency participants with diverse practices from around the world.
                </p>
            </div>
        </div>
    )
}