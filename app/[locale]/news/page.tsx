import { News } from '@/components/News';
import styles from './styles.module.css'
import {setRequestLocale} from "next-intl/server";
import type {Metadata} from "next";
import newsImages from "@/newsImages";
import {NewsMedia} from "@/components/NewsMedia";
import {Suspense} from "react";
import Loading from "@/app/[locale]/news/_components/loading";
//
// export async function generateMetadata({ params } : { params: Promise<{idx:number}> }) : Promise<Metadata> {
//
//     const desc = 'We aspire to offer opportunities to reconsider the contemporary cryptocurrency landscape and envision its future by supporting the token economy and its communities. VOB foundation catalyzes its long-standing partnerships with exchanges and communities around the world. As an extension of this work, we endeavor to expand access to the cryptocurrency while fostering enriched connections amongst our community of traders, marketers, technicians, analysts, celebrities, and global audiences.';
//
//     const firstSix = newsImages.slice(0, 6);
//
//     const urlArray = firstSix.map((img:any) => `${process.env.SITE_URL}${img.url}`);
//     // for (let i = 0; i < 5; i++) {
//     //     let newsImageElem = newsImages[i];
//     //     urlArray.push(`${process.env.SITE_URL}${newsImageElem.url}`);
//     // }
//
//     return {
//         description: desc,
//         openGraph: {
//             images: urlArray,
//             description: desc
//         }
//     }
// }


export default async function news({params} : any) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className={styles.newsWrapper}>
            <Suspense fallback={<Loading/>}>
                <News locale={locale}/>
            </Suspense>
            <Suspense fallback={<Loading/>}>
                <NewsMedia locale={locale}/>
            </Suspense>
        </div>
    )
}