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
import {useTranslations} from "next-intl";

const notosansjp = Noto_Sans_JP({
    weight: ['200', '300', '400', '500', '600', '700', '900'],
    style : "normal",
    subsets: ['latin']
});
export const Breadcrumbs = () => {

    const segments = useSelectedLayoutSegments();
    const t = useTranslations('nav');

    return (
        (segments.length > 0) && (
            <div className={`${notosansjp.className} ${styles.breadcrumb}`}>
                    <span className={styles.homeImg}>
                        <NavigationLink href="/"><Image src={homePic} width={20} height={20} alt="home icon"/></NavigationLink>
                    </span>
                {
                    segments.map((segment, index) => (
                        <div className={styles.breadCrumbElem} key={index}>
                            <span className={styles.arrowImg}><Image src={arrowPic} width={12} height={12} alt="arrow icon"/></span>
                            <NavigationLink href={`/${segment}`} >{t(segment)}</NavigationLink>
                        </div>
                    ))
                }
            </div>
        )

    )
}