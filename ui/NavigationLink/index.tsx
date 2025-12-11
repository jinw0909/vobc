'use client';

import {ComponentProps} from "react";
import { Link } from "@/i18n/navigation";
import { useSelectedLayoutSegments} from "next/navigation";
import styles from './styles.module.css';
import {LinkProps} from "next/link";

interface NavigationLinkProps extends ComponentProps<typeof Link> {
    pseudo? : string;
    disabled?: boolean;
    matchMode?: 'section' | 'exact';
    mainSegments?: string[];
}

const DEFAULT_MAIN_SEGMENTS = ['home', 'about', 'blog', 'devs', 'team', 'news', 'media', 'tag'];

export const NavigationLink = ({
    href,
    pseudo,
    matchMode = 'section',
    mainSegments = DEFAULT_MAIN_SEGMENTS,
    ...rest
} : NavigationLinkProps)  => {
    const segments = useSelectedLayoutSegments();      // 예: ['/news/media/1234'] → ['news','media','1234']

    const hrefString = typeof href === "string" ? href : href.pathname ?? "/";

    // /news        → ['news']          → baseSegment = 'news'
    // /news/media  → ['news','media']  → baseSegment = 'media'
    const hrefParts = hrefString.replace(/^\/+/, "").split("/").filter(Boolean);
    const baseSegment = hrefParts[hrefParts.length - 1] ?? "";

    // 의미 있는 세그먼트만 필터링 (news, media 등)
    const meaningfulSegments = segments.filter(seg => mainSegments.includes(seg));
    const lastMeaningful = meaningfulSegments[meaningfulSegments.length - 1] ?? null;

    let isActive = false;

    if (!baseSegment) {
        // 홈('/') 링크
        isActive = segments.length === 0;   // 루트일 때만 active
    } else {
        if (matchMode === 'exact') {
            // ✨ breadcrumb 용: 마지막 의미 있는 세그먼트와 정확히 일치해야 active
            isActive = baseSegment === lastMeaningful;
        } else {
            // ✨ 상단 nav 용: 이 섹션 안에 들어오기만 해도 active
            isActive = meaningfulSegments.includes(baseSegment);
        }
    }

    const isPseudo = pseudo === "true";


    return (
        <Link
            aria-current = { isActive ? 'page' : undefined }
            href={href}
            className={`
                ${isActive ? styles.isActive : ''} 
                ${isPseudo ? styles.pseudo : ''} 
                ${styles.linkBtn}`}
            {...rest}
        />
    )
}