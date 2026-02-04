'use client';

console.log('Main module loaded');

import { useTranslations } from 'next-intl';
import styles from './styles.module.css';
import Image from 'next/image';
import vobPic from '@/public/vob_crop.png';
import { NavigationLink } from '@/ui/NavigationLink';

import { NewsAcc } from '@/ui/NewsAcc';
import type { NewsItem } from '@/newsMapper';

const BG = 'rgba(30, 30, 30, 1)';

type NewsBundle = {
    data: NewsItem[];
    imgSrc: string[];
    index: number;
};

export const Main = ({ locale, newsBundles }: { locale: string; newsBundles: NewsBundle[] }) => {
    const t = useTranslations('hero');

    return (
        <section className={styles.heroSection} style={{ background: BG }}>
            {/* 1) VISION */}
            <div className={styles.vision}>
                <div className={styles.visionWrapper}>
                    <div className={styles.visionContent}>
                        <div className={styles.visionElem}>
                            <div>
                                {newsBundles[0] && (
                                    <NewsAcc
                                        data={newsBundles[0].data}
                                        imgSrc={newsBundles[0].imgSrc}
                                        index={newsBundles[0].index}
                                    />
                                )}
                            </div>

                            <div className={styles.visionMainText}>
                                <div className={styles.visionHeader}>
                                    <Image className={styles.vobImg} src={vobPic} height={32} alt="vob icon" />
                                    <p className={styles.headerText}>The Vision of Blockchain</p>
                                </div>
                                <p className={`${styles.visionText} ${styles.detailText}`}>{t('vision')}</p>
                                <p className={`${styles.visionText} ${styles.detailText}`}>{t('vision_down')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2) ABOUT 섹션 */}
            <div className={styles.aboutSection}>
                <NavigationLink href="/about">
                    <button className={styles.about}>{t('about')}</button>
                </NavigationLink>
            </div>
        </section>
    );
};
