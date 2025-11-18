// 'use client';
// import Image from "next/image";
// import techPic from "@/public/devs_technology.png";
// import styles from "./styles.module.css"
// // import Link from "next/link";
// import {NavigationLink} from "@/ui/NavigationLink";
// import {getTranslations} from "next-intl/server";
// import {useEffect, useState} from "react";
// import {useTranslations} from "next-intl";
// import contractPic from "@/public/smartcontract.png";
// export const DevsMain = () => {
//
//     const t = useTranslations('devs_main');
//     // const t = await getTranslations('devs_main');
//     const [showDev, setShowDev] = useState(false)
//
//     const handleShowDev = () => {
//         if (showDev) {
//             setShowDev(false);
//         } else {
//             setShowDev(true);
//         }
//     }
//
//     return (
//         <div className={styles.devsWrapper}>
//             <div className={`${styles.devsInner} ${showDev ? styles.show : ''}`} onClick={() => {
//                 handleShowDev()
//             }}>
//                 <div className={styles.imgWrapper}>
//                     <Image src={techPic}
//                            fill={true}
//                            style={{objectFit: "contain"}}
//                            alt="main page devs image"
//                            className={styles.imgElem}
//                     />
//                 </div>
//                 <div className={`${styles.textWrapper}`}>
//                     <div className={`text-4xl mb-4 ${styles.devsMainTitle}`}>{t('title')}</div>
//                     <div className={`text-xl mb-4 ${styles.devsMainSubTitle}`}>{t('subtitle')}</div>
//                 </div>
//                 <div className={styles.descWrapper}>
//                     <div className={styles.textStyle}>
//                         {t('content')}
//                     </div>
//                     <NavigationLink href="/devs">
//                         <button className={styles.checkoutBtn}>{t('btn')}</button>
//                     </NavigationLink>
//                 </div>
//             </div>
//         </div>
//     )
// }

'use client';
import Image from "next/image";
import techPic from "@/public/devs_technology.png";
import styles from "./styles.module.css"
// import Link from "next/link";
import {NavigationLink} from "@/ui/NavigationLink";
import {getTranslations} from "next-intl/server";
import {useEffect, useState} from "react";
import {useTranslations} from "next-intl";
import contractPic from "@/public/smartcontract.png";
import { useRouter } from "@/i18n/navigation"
export const DevsMain = () => {

    const t = useTranslations('devs_main');
    // const t = await getTranslations('devs_main');
    const router = useRouter();
    const [showDev, setShowDev] = useState(true)

    const handleShowDev = () => {
        if (showDev) {
            setShowDev(false);
        } else {
            setShowDev(true);
        }
    }

    const handleClick = () => {
        // setShowDev(false);
        router.push('/devs');
        // setTimeout(() => {
        //     router.push('/devs');
        // }, 1000);
    }

    return (
        <div className={styles.devsWrapper}>
            <div className={`${styles.devsInner} ${showDev ? styles.show : ''}`}
                 // onClick={() => {handleShowDev()}}
            >
                <div className={styles.imgWrapper}>
                    <Image src={techPic}
                           fill={true}
                           style={{objectFit: "contain"}}
                           alt="main page devs image"
                           className={styles.imgElem}
                    />
                </div>
                <div className={`${styles.textWrapper}`}>
                    <div className={`text-4xl mb-4 ${styles.devsMainTitle}`}>{t('title')}</div>
                    <div className={`text-xl mb-4 ${styles.devsMainSubTitle}`}>{t('subtitle')}</div>
                </div>
                <div className={styles.descWrapper}>
                    <div className={styles.textStyle}>
                        {t('content')}
                    </div>
                    {/*<NavigationLink href="/devs">*/}
                        <button className={styles.checkoutBtn} onClick={handleClick}>{t('btn')}</button>
                    {/*</NavigationLink>*/}
                </div>
            </div>
        </div>
    )
}