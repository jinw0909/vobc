'use client'

import styles from './styles.module.css'
import Image from 'next/image';
import vobPic from '@/public/vob_crop.png';
import blockPic from '@/public/blockchain_white.png';
import visionPic from '@/public/vision_white.png';
import {NavigationLink} from "@/ui/NavigationLink";
import {useTranslations} from "next-intl";

export const Vision = () => {

    const t = useTranslations('vision');

    return (
        <div className={`${styles.visionWrapper}`}>
            <div className={styles.visionContent}>
                <div className={styles.visionElem}>
                    <div className={styles.visionHeader}>
                        <Image className={styles.visionImg} src={visionPic} height={32} alt="vision icon"></Image>
                        <p className={styles.headerText}>The Vision</p>
                    </div>
                    <p className={`${styles.visionText} ${styles.detailText} ${styles.delayedAnimation}`}>
                        {t('vision')}
                    </p>
                </div>
                <div className={`${styles.visionElem} ${styles.blockElem}`}>
                    <div className={styles.blockHeader}>
                        <Image className={styles.blockImg} src={blockPic} height={32} alt="blockchain icon"></Image>
                        <p className={styles.headerText}>The Blockchain</p>
                    </div>
                    <p className={`${styles.visionText} ${styles.detailText} ${styles.blockText} ${styles.delayedAnimation}`}>
                        {t('blockchain')}
                    </p>
                </div>
                <div className={`${styles.visionElem} ${styles.vobElem}`}>
                    <div className={styles.vobHeader}>
                        <Image className={styles.vobImg} src={vobPic} height={32} alt="vob icon"></Image>
                        <p className={styles.headerText}>The Vision of Blockchain</p>
                    </div>
                    <p className={`${styles.visionText} ${styles.detailText} ${styles.delayedAnimation}`}>
                        {t('vob')}
                    </p>
                </div>
            </div>
            <div className={styles.btnContainer}>
                <NavigationLink href="/about">
                    <button className={styles.about}>{t('about')}</button>
                </NavigationLink>
            </div>
        </div>
    )
}