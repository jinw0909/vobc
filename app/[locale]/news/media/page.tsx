import styles from './styles.module.css'
import { NewsMedia } from '@/components/NewsMedia';
import {setRequestLocale} from "next-intl/server";
import type {Metadata} from "next";
import newsImages from "@/newsImages";


export async function generateMetadata({ params } : { params: Promise<{idx:number}> }) : Promise<Metadata> {
    const desc = 'The VOB foundation engaged with the theme of Public Relations as well as larger questions about the intersection of communities and the VOB foundation through the launch of Vision of Blockchain Media. The series of public materials bring together a variety of publics to engage with inspiring and impactful experiences. The media is based on the idea of exploring and examining the vast potentials of idea-technology convergence and offers a sequence of materials including conversations and talks, editorial articles, interviews, VOB related promotions and events.';
    const urlArray = []
    for (let element of newsImages) {
        urlArray.push(`${process.env.SITE_URL}${element.url}`);
    }

    return {
        description: desc,
        openGraph: {
            images: urlArray,
            description: desc
        }
    }
}


export default async function Page({params} : any) {
    const {locale} = await params;
    setRequestLocale(locale);

    return (
        <div className={styles.mediaWrapper}>
            <NewsMedia/>
        </div>
    )
}