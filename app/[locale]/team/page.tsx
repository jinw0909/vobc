import styles from './styles.module.css';
import { Team } from "@/components/Team";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Suspense } from "react";
import Loading from "@/app/[locale]/team/_components/loading";

async function fetchJSON<T>(url: string): Promise<T> {
    const res = await fetch(url, {
        // 팀/멤버는 관리페이지에서 바뀔 수 있으니 보통 no-store 또는 짧은 revalidate 추천
        cache: 'no-store',
        headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<T>;
}

type TeamApi = {
    id: number;
    name: string;
    description: string;
    icon: string | null;
    displayOrder: number;
};

type ResumeApi = { id: number; content: string; teamMemberId: number };
type MemberApi = {
    teamId: number;
    id: number;
    name: string;
    introduction: string | null;
    role: string | null;
    photo: string | null;
    rolePriority: number;
    resumes: ResumeApi[];
    teamRoleLabel?: string | null;
};

type MembersPageApi = {
    content: MemberApi[];
    totalElements: number;
    totalPages: number;
};

export default async function Page({ params }: any) {
    const { locale } = await params;
    setRequestLocale(locale);

    const messages = await getMessages();

    const teamsUrl = `https://vobc-back.com/api/team/all?lang=${locale}`;
    // 멤버는 paging이라 size 크게(예: 200) 한 번에 가져오기
    const membersUrl = `https://vobc-back.com/api/team/all-members?lang=${locale}&page=0&size=200`;

    const [teamsRaw, membersRaw] = await Promise.all([
        fetchJSON<TeamApi[]>(teamsUrl),
        fetchJSON<MembersPageApi>(membersUrl),
    ]);

    // displayOrder asc로 정렬
    const teams = [...teamsRaw].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || b.id - a.id);

    return (
        <div className={styles.teamWrapper}>
            {/*<NextIntlClientProvider messages={messages}>*/}
                <Suspense fallback={<Loading/>}>
                    <Team teams={teams} members={membersRaw.content} />
                </Suspense>
            {/*</NextIntlClientProvider>*/}
        </div>
    );
}
