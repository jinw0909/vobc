'use client';
import Link from 'next/link';
import {Noto_Sans_JP} from "next/font/google";
import {Noto_Serif_JP} from "next/font/google";
import {allowedDisplayValues} from "next/dist/compiled/@next/font/dist/constants";
import styles from "./styles.module.css";
import Image from "next/image";
import { NavigationLink} from "@/ui/NavigationLink";
import {useSelectedLayoutSegments} from "next/navigation";
import homePic from '@/public/icons/home-icon.png';
import arrowPic from '@/public/icons/right-arrow-white.png'
import arrowUp from '@/public/icons/arrow-up-white.png';
import {useTranslations} from "next-intl";
import {useRouter} from "@/i18n/navigation"

const notosansjp = Noto_Sans_JP({
    weight: ['200', '300', '400', '500', '600', '700', '900'],
    style : "normal",
    subsets: ['latin']
});
export const Breadcrumbs = () => {

    const segments = useSelectedLayoutSegments();
    console.log("segments: ", segments);
    const t = useTranslations('nav');
    const router = useRouter();

    return (
        (segments.length > 0) && (
            <div className={`${notosansjp.className} ${styles.breadcrumbWrapper}`}>
                <div className={styles.breadcrumb}>
                    <span className={styles.homeImg}>
                        <NavigationLink href="/"><Image src={homePic} width={20} height={20}
                                                        alt="home icon"/></NavigationLink>
                    </span>
                    {
                        segments.map((segment, index) => {
                            if (segment === '(policies)') {
                                return null;
                            }
                            if (!isNaN(parseInt(segment))) {
                                return null;
                            }
                            return (
                                <div className={styles.breadCrumbElem} key={index}>
                                    <span className={styles.arrowImg}>
                                        <Image src={arrowPic} width={12} height={12} alt="arrow icon"/>
                                    </span>
                                    <NavigationLink href={`/${segment}`}>{t(segment)}</NavigationLink>
                                </div>
                            )
                        })
                    }
                </div>
                <div className={styles.history}>
                    <button
                        type="button"
                        className={styles.backButton}
                        onClick={() => router.back()}
                    >
                        <div className={styles.imageWrapper}>
                            <Image className={styles.backArrow} src={arrowUp} width={24} height={24}
                                   alt="back history arrow"/>
                        </div>
                    </button>
                    {/*<button*/}
                    {/*    type="button"*/}
                    {/*    className={styles.forwardButton}*/}
                    {/*    onClick={() => {window.history.forward()}}*/}
                    {/*>*/}
                    {/*    <div className={styles.imageWrapper}>*/}
                    {/*        <Image className={styles.forwardArrow} src={arrowUp} width={24} height={24}*/}
                    {/*               alt="forward history arrow"/>*/}
                    {/*    </div>*/}
                    {/*</button>*/}
                </div>
            </div>
        )

    )
}