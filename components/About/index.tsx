import styles from './styles.module.css'
import Image from 'next/image';
import osakaPic from '@/public/about_osaka.jpg';
import tokyoPic from '@/public/about_tokyo.jpg';
import amaPic from '@/public/about_ama.png';
import localFont from "next/font/local";
import {getTranslations} from "next-intl/server";
import {CommonHeader} from "@/ui/CommonHeader";

const kaisei = localFont({
    src: [
        {
            path: '../../public/fonts/Kaisei_HarunoUmi/KaiseiHarunoUmi-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../public/fonts/Kaisei_HarunoUmi/KaiseiHarunoUmi-Medium.ttf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../../public/fonts/Kaisei_HarunoUmi/KaiseiHarunoUmi-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
    ],
    variable: '--font-kaisei',
    display: 'block',
    preload: true
});

export const About = async () => {

    const t = await getTranslations();

    return (
        <div className={styles.aboutWrapper}>
            <div className={`${kaisei.className} ${styles.mainTitle}`}>{t('about.main_title')}</div>
            <div className={styles.aboutInner}>
                <CommonHeader text={"About VOB"}/>
                <div className={`${styles.element}`}>
                    {/*<div className={`${styles.elementTitle} text-left`}>{t('about.title_0')}</div>*/}
                    <div className={`${styles.elementContent} ${styles.textGradient}`}>
                        <div className={`${styles.elementImage} float-right`}>
                            <Image className={styles.imageStyle}
                                   src={osakaPic}
                                   width={200}
                                   height={200}
                                   alt="about_page_first_image"
                            />
                        </div>
                        <div className={`${styles.elementText}`}>{t('about.content_0')}</div>
                    </div>
                </div>

                <div className={`${styles.element}`}>
                    {/*<div className={`${styles.elementTitle} text-left`}>{t('about.title_1')}</div>*/}
                    {/*<CommonHeader text={t('about.title_1')}/>*/}
                    <div className={`${styles.elementContent} ${styles.textGradient}`}>
                        <div className={`${styles.elementImage} float-left`}>
                            <Image className={styles.imageStyle}
                                src={tokyoPic}
                                width={200}
                                height={200}
                                alt="about_page_second_image"
                            />
                        </div>
                        <div className={styles.elementText}>{t('about.content_1')}</div>
                    </div>
                </div>

                <div className={`${styles.element}`}>
                    {/*<div className={`${styles.elementTitle} text-left`}>{t('about.title_2')}</div>*/}
                    {/*<CommonHeader text={t('about.title_2')}/>*/}
                    <div className={`${styles.elementContent} ${styles.textGradient}`}>
                        <div className={`${styles.elementImage} float-right`}>
                            <Image className={styles.imageStyle}
                                   src={amaPic}
                                   width={200}
                                   height={200}
                                   alt="about_page_third_image"
                            />
                        </div>
                        <div className={styles.elementText}>{t('about.content_2')}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}