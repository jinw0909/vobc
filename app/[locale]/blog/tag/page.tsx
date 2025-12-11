import styles from './styles.module.css';
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import {Suspense} from "react";
import Loading from "../temp/loading";
import BlogTag from "@/components/BlogTag";


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
        <div className={styles.blogTagWrapper}>
            <Suspense fallback={<Loading/>}>
                <BlogTag/>
            </Suspense>
        </div>
    )
}