// components/BlogDetail.tsx
import styles from './styles.module.css';
import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import parse, { DOMNode, Element } from 'html-react-parser';
import Image from 'next/image';
import {NavigationLink} from "@/ui/NavigationLink";

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

interface PostTag {
    id: number;
    name: string;
}

interface PostResponse {
    id: number;
    title: string;
    content: string;         // HTML string
    author: string;
    summary: string;
    releaseDate: string | null;
    thumbnail: string | null;
    requestedLanguage: string | null;
    effectiveLanguage: string | null;
    translated: boolean;
    createdAt: string;
    updatedAt: string;
    postTags: PostTag[];
}

interface BlogDetailProps {
    idx: string;
}

export default async function BlogDetail({ idx }: BlogDetailProps) {
    const locale = await getLocale();

    const lang =
        locale === 'en' ||
        locale === 'kr' ||
        locale === 'jp' ||
        locale === 'cn'
            ? locale
            : 'en';

    const res = await fetch(
        `${API_BASE}/api/post/query/${idx}?lang=${lang}`,
        {
            cache: 'no-store',
        }
    );

    if (!res.ok) {
        notFound();
    }

    const post = (await res.json()) as PostResponse || null;

    if (!post || !post.id || post.id !== Number(idx)) {
        notFound();
    }

    const formattedReleaseDate = post.releaseDate ?? '';

    // 🔴 여기서 HTML 문자열을 React 요소로 파싱하면서
    // <img> 태그를 Next.js <Image> 컴포넌트로 교체
    const parsedContent = post.content ? parse(post.content, {
        replace: (domNode: DOMNode) => {
            if (
                domNode.type === 'tag' && domNode.name === 'img'
            ) {
                const { src, alt, width, height } = domNode.attribs ?? {};

                if (!src) return domNode; // src 없으면 그대로 둠

                // width/height 없으면 기본값 설정 (레이아웃 깨지지 않게)
                const w = width ? Number(width) : 800;
                const h = height ? Number(height) : 450;

                return (
                    <Image
                        src={src}
                        alt={alt || ''}
                        width={w}
                        height={h}
                        className="content-inline-image"
                        // 필요하면 style이나 sizes 추가 가능
                    />
                );
            }
        },
    }) : null;

    return (
        <article className={styles.blogDetail}>
            <header className={styles.blogHeader}>
                <div className={styles.blogMeta}>
                    <div className={styles.blogFooter}>
                        <NavigationLink
                            href="/blog"
                            scroll={true}
                        >
                            Back to Index
                        </NavigationLink>
                    </div>

                    {formattedReleaseDate && (
                        <p className={styles.blogDate}>
                            {formattedReleaseDate}
                        </p>
                    )}

                    <h1 className={styles.blogTitle}>{post.title}</h1>
                    <p className={styles.blogAuthor}>By {post.author}</p>

                    {post.summary && (
                        <p className={styles.blogSummary}>{post.summary}</p>
                    )}

                    {post.postTags?.length > 0 && (
                        <div className={styles.tagRow}>
                            {post.postTags.map((tag) => (
                                <span key={tag.id} className={styles.tag}>
                                    <NavigationLink href={`/blog/tag/${tag.name}`} className={styles.colorWhite}>
                                        #{tag.name}
                                    </NavigationLink>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            <section className={styles.blogSection}>
                <div
                    className={`${styles.blogContent} content-scroll-box`}
                >
                    {parsedContent}
                </div>
            </section>
        </article>
    );
}

