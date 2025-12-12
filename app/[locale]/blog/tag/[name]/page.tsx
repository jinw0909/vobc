import styles from './styles.module.css';
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import {Suspense} from "react";
import Loading from "../../temp/loading";
import BlogTag from "@/components/BlogTag";


export async function generateMetadata() : Promise<Metadata> {
    return {
        title: 'VOB BLOG',
        description: 'The blog posts published by VOB Foundation',
    };
}

interface PageParams {
    locale: string;
    name: string;
}

interface PageSearchParams {
    page?: string;
}


export default async function Page( { params, searchParams } : {
    params: Promise<PageParams>,
    searchParams: Promise<PageSearchParams>
}) {
    const { locale, name } = await params;
    const { page: pageParam } = await searchParams;

    setRequestLocale(locale);

    const page = Number(pageParam ?? '1');

    return (
        <div className={styles.blogTagWrapper}>
            <Suspense fallback={<Loading/>}>
                <BlogTag
                    tagName={decodeURIComponent(name)}
                    page={page}
                />
            </Suspense>
        </div>
    )
}