import styles from './styles.module.css'
import Image from 'next/image';
import {Kaisei_HarunoUmi, Vollkorn} from "next/font/google";
import {Noto_Serif_JP} from "next/font/google";
import {getTranslations} from "next-intl/server";
import vobPic from '@/public/vob_crop.png';
import blockPic from '@/public/blockchain_white.png';
import visionPic from '@/public/vision_white.png';
import {NavigationLink} from "@/ui/NavigationLink";
const notoserifjp = Noto_Serif_JP({
    weight: ['200', '300', '400', '500', '600', '700', '900'],
    style : "normal",
    subsets: ['latin']
});
const kaisei = Kaisei_HarunoUmi({
    weight: ['400', '500', '700'],
    subsets: ["latin"],
});

export const Vision = async () => {

    const t = await getTranslations('vision');

    return (
        <div className={`${styles.visionWrapper}`}>
            <div>
            <div className={styles.visionHeader}>
                <Image className={styles.visionImg} src={visionPic} height={32} alt="vision icon"></Image>
                <p className={styles.headerText}>The Vision</p>
            </div>
            </div>
            <p className={`${styles.visionText} ${styles.delayedAnimation}`}>
                {t('vision')}
            </p>
            <div className={styles.blockHeader}>
                <Image className={styles.blockImg} src={blockPic} height={32} alt="blockchain icon"></Image>
                <p className={styles.headerText}>The Blockchain</p>
            </div>
            <p className={`${styles.visionText} ${styles.blockText} ${styles.delayedAnimation}`}>
                {t('blockchain')}
            </p>
            <div className={styles.vobHeader}>
                <Image className={styles.vobImg} src={vobPic} height={32} alt="vob icon"></Image>
                <p className={styles.headerText}>The Vision of Blockchain</p>
            </div>
            <p className={`${styles.visionText} ${styles.delayedAnimation}`}>
                {t('vob')}
            </p>
            <div className={styles.btnContainer}>
                <NavigationLink href="/about">
                    <button className={styles.about}>{t('about')}</button>
                </NavigationLink>
            </div>
        </div>
    )
}