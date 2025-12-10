import styles from './styles.module.css'
import {setRequestLocale} from "next-intl/server";
import Blog from "@/components/Blog";
import { Metadata } from "next";
import {Suspense} from "react";
import Loading from "./temp/loading";

export async function generateMetadata() : Promise<Metadata> {
    return {
        title: 'VOB BLOG',
        description: 'The blog posts published by VOB Foundation',
    };
}

export default async function Page( { params } : any) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className={styles.blogWrapper}>
            <Suspense fallback={<Loading/>}>
                <Blog/>
            </Suspense>
        </div>
    )
}