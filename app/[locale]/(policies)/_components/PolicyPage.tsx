import styles from '../styles.module.css';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

type TermResponse = {
    languageCode: string;
    id: number;
    termCode: string;
    title: string;
    content: string;     // HTML string
    proposeDate?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchTerm(code: string, lang: string): Promise<TermResponse> {
    const res = await fetch(
        `${API_BASE}/api/term?code=${encodeURIComponent(code)}&lang=${encodeURIComponent(lang)}`,
        {
            // cache: 'no-store',
            next: { revalidate: 60 },
        },
    );

    if (res.status === 404) notFound();
    if (!res.ok) throw new Error(`Failed to fetch term: ${res.status}`);

    return res.json();
}

export default async function PolicyPage({
                                             params,
                                             code,
                                         }: {
    params: Promise<{locale: string}>;
    code: 'cookies' | 'privacy' | 'use';
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    // await sleep(1500);
    const term = await fetchTerm(code, locale);

    return (
        <div className={styles.termsWrapper}>
            <div className={styles.termsTitle}>{term.title}</div>
            <div className={styles.termsContent}>
                <div dangerouslySetInnerHTML={{ __html: term.content }} />
            </div>
        </div>
    );
}
