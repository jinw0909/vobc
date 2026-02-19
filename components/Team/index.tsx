'use client';

import styles from './styles.module.css';
import { useEffect, useRef, useState } from "react";
import { TeamNav } from "@/ui/TeamNav";
import { TeamBand } from "@/ui/TeamBand";

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

export function Team({ teams, members }: { teams: TeamApi[]; members: MemberApi[] }) {
    // 팀 개수에 맞춰 selectedIdx 초기화
    const [selectedIdx, setSelectedIdx] = useState<boolean[]>(() => teams.map(() => true));

    // teams가 바뀌면(언어 변경 등) selectedIdx 길이 맞춰 리셋
    useEffect(() => {
        setSelectedIdx(teams.map(() => true));
    }, [teams]);

    const bandRefs = useRef<Array<HTMLElement | null>>([]);

    const handleIndex = (i: number) => {
        const copy = [...selectedIdx];

        const element = bandRefs.current[i] as HTMLElement | null;
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        copy[i] = !copy[i];
        setSelectedIdx(copy);
    };

    const registerRef = (index: number, ref: HTMLElement | null) => {
        bandRefs.current[index] = ref;
    };

    // 팀별 멤버 매핑
    const membersByTeamId = new Map<number, MemberApi[]>();
    for (const m of members) {
        const arr = membersByTeamId.get(m.teamId) ?? [];
        arr.push(m);
        membersByTeamId.set(m.teamId, arr);
    }
    // rolePriority 정렬(원하면)
    for (const [k, arr] of membersByTeamId.entries()) {
        arr.sort((a, b) => (a.rolePriority ?? 999) - (b.rolePriority ?? 999) || a.id - b.id);
        membersByTeamId.set(k, arr);
    }

    return (
        <div className={styles.teamWrapper}>
            <TeamNav
                teams={teams}
                handleIndex={handleIndex}
                selectedIdx={selectedIdx}
            />

            <div className={styles.mainContent}>
                {teams.map((team, i) => (
                    <TeamBand
                        key={team.id}
                        team={team}
                        members={membersByTeamId.get(team.id) ?? []}
                        selected={selectedIdx[i]}
                        order={i}
                        registerRef={registerRef}
                    />
                ))}
            </div>
        </div>
    );
}
