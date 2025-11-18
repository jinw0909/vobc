import Image from 'next/image';
import techPic from '@/public/devs_pic.png';
import styles from './styles.module.css'
import { DevsAcc } from "@/ui/DevsAcc";
import { DevsCaro } from "@/ui/DevsCaro";
import { useTranslations } from "next-intl";
import {useMessages, NextIntlClientProvider} from "next-intl";
export const Devs = () => {

    const t = useTranslations('devs');
    const messages = useMessages();

    return (
        <div className={styles.devsWrapper}>
            <div className={styles.devsTitle}>{t("devs_title")}</div>
            <div className={styles.devsDesc}>
                <div className={styles.imageBox}>
                    <Image className={styles.imageStyle}
                        src={techPic} width={100} height={100} alt="image for devs page"/>
                </div>
                <div className={styles.textStyle}>{t('devs_content')}</div>
            </div>
            <NextIntlClientProvider messages={messages}>
                <DevsAcc />
            </NextIntlClientProvider>
            <div className={styles.devsSubtitle}>{t("devs_subtitle")}</div>
            <DevsCaro />
        </div>
    )
}