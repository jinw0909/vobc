import styles from './styles.module.css'
import {getDictionary} from "@/app/[lang]/dictionaries";
import Image from 'next/image';
import visionPic from '@/public/about_vision_en.png';
import osakaPic from '@/public/about_osaka.jpg';
import tokyoPic from '@/public/about_tokyo.jpg';
import amaPic from '@/public/about_ama.png';
import tokenPic from '@/public/about_token.png';
import {Kaisei_HarunoUmi, Vollkorn} from "next/font/google";
import {Noto_Serif_JP} from "next/font/google";
const notoserifjp = Noto_Serif_JP({
    weight: ['200', '300', '400', '500', '600', '700', '900'],
    style : "normal",
    subsets: ['latin']
});
const kaisei = Kaisei_HarunoUmi({
    weight: ['400', '500', '700'],
    subsets: ["latin"],
});
export const About = async ({lang}) => {

    const dict = await getDictionary(lang);

    return (
        <div>
            <div className={`${kaisei.className} ${styles.mainTitle}`}>{dict.about.main_title}</div>
            <div>
                <div className={`${styles.element} ${styles.fadeInAnimation} opacity-0`}>
                    <div className={`${styles.elementTitle} ${notoserifjp.className} text-left`}>{dict.about.title_0}</div>
                    <div className={`${styles.elementContent} ${styles.textGradient}`}>
                        <div className={`${styles.elementImage} float-right`}>
                            <Image className={styles.imageStyle}
                                   src={osakaPic}
                                   width={200}
                                   height={200}
                                   alt="about_page_first_image"
                            />
                        </div>
                        <div className={`${styles.elementText} ${notoserifjp.className}`}>{dict.about.content_0}</div>
                    </div>
                </div>

                <div className={`${styles.element} ${styles.delayedAnimation} opacity-0`}>
                    <div className={`${styles.elementTitle} text-left`}>{dict.about.title_1}</div>
                    <div className={`${styles.elementContent} ${styles.textGradient}`}>
                        <div className={`${styles.elementImage} float-left`}>
                            <Image className={styles.imageStyle}
                                src={tokyoPic}
                                width={200}
                                height={200}
                                alt="about_page_second_image"
                            />
                        </div>
                        <div className={styles.elementText}>{dict.about.content_1}</div>
                    </div>
                </div>

                <div className={`${styles.element} ${styles.moreDelayedAnimation} opacity-0`}>
                    <div className={`${styles.elementTitle} text-left`}>{dict.about.title_2}</div>
                    <div className={`${styles.elementContent} ${styles.textGradient}`}>
                        <div className={`${styles.elementImage} float-right`}>
                            <Image className={styles.imageStyle}
                                   src={amaPic}
                                   width={200}
                                   height={200}
                                   alt="about_page_third_image"
                            />
                        </div>
                        <div className={styles.elementText}>{dict.about.content_2}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}