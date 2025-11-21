import styles from './styles.module.css'
import {setRequestLocale} from "next-intl/server";
import { Metadata, ResolvingMetadata } from "next";
import blogData from "@/json/blog.json";
import BlogDetail from "@/components/BlogDetail";


interface GenerateMetadataProps {
    params: Promise<{
        idx: string;     // from URL /blog/[idx]
        locale: string;  // from /[locale]/blog/[idx] 구조라면
    }>;
}

export async function generateMetadata(
    { params }: GenerateMetadataProps
): Promise<Metadata> {
    const { idx, locale } = await params;
    const id = Number(idx);

    const post = blogData.find((p) => p.id === id);

    if (!post) {
        return {
            title: "Post not found",
            description: "The requested blog post does not exist."
        };
    }

    const lang = locale === "en" ? "en" : "kr";
    const title = post.title[lang] || post.title.kr;
    const content = post.content[lang] || post.content.kr;

    const summary = `${title}\n${content.slice(0, 160)}...`;

    return {
        title,
        description: summary,
        openGraph: {
            title,
            description: summary,
        },
    };
}

interface PageProps {
    params: Promise<{
        idx: string;
        locale: string;
    }>;
}

export default async function Page({ params }: PageProps) {
    const { idx, locale } = await params;
    setRequestLocale(locale);

    return (
        <div className={styles.detailWrapper}>
            <BlogDetail idx={idx} />
        </div>
    );
}