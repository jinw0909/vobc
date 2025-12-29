import styles from './styles.module.css'
import {setRequestLocale} from "next-intl/server";
import Blog from "@/components/Blog";
import { Metadata } from "next";
import {Suspense} from "react";
import Loading from "@/app/[locale]/blog/_components/loading";

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
    size?: string;
}


export default async function Page( { params, searchParams } : {
    params: Promise<PageParams>,
    searchParams: Promise<PageSearchParams>
}) {
    const { locale, name } = await params;
    const resolvedSearchParams = await searchParams;

    setRequestLocale(locale);

    return (
        <div className={styles.blogWrapper}>
            <Suspense fallback={<Loading/>}>
                <Blog
                   // searchParams={resolvedSearchParams}
                />
            </Suspense>
        </div>
    )
}