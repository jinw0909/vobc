import Image from "next/image";
import techPic from "@/public/devs_technology.png";
import styles from "./styles.module.css"
// import Link from "next/link";
import {NavigationLink} from "@/ui/NavigationLink";
import {getTranslations} from "next-intl/server";
export const DevsMain = async () => {

    const t = await getTranslations('devs_main');

    return (
        <div className={styles.devsWrapper}>
            <div className={`flex-1 flex justify-center items-center`}>
                <Image
                    src={techPic}
                    width={200}
                    height={200}
                    quality={100}
                    alt="devs image for the main page"
                    className={styles.imgElem}
                />
            </div>
            <div className={`${styles.textElem} flex-1`}>
                <div className="text-4xl mb-4">{t('title')}</div>
                <div className="text-xl mb-4">{t('subtitle')}</div>
                <div className={`${styles.textStyle} mb-4`}>
                    {t('content')}
                </div>
                <NavigationLink href="/devs">
                    <button className={styles.checkoutBtn}>{t('btn')}</button>
                </NavigationLink>
            </div>
        </div>
    )
}