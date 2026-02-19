'use client';

import React from 'react';
import { useRouter, useSelectedLayoutSegments } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { NavigationLink } from '@/ui/NavigationLink';
import homePic from '@/public/icons/home-icon.png';
import arrowPic from '@/public/icons/right-arrow-white.png';
import arrowUp from '@/public/icons/arrow-up-white.png';
import Image from 'next/image';
import styles from './styles.module.css';

const VISIBLE_SEGMENTS = [
    'blog',
    'news',
    'media',
    'about',
    'team',
    'devs',
    'tag',
    'use',
    'privacy',
    'cookies',
]; // nav에서 번역 키로 쓰는 것들만

type Crumb = {
    segment: string;
    label: string | React.ReactNode;
};

export const Breadcrumbs = () => {
    const segments = useSelectedLayoutSegments();
    const t = useTranslations('nav');
    const router = useRouter();

    if (segments.length === 0) return null;

    // 1) 실제로 렌더링할 breadcrumb만 먼저 추출 (null 제거)
    const crumbs: Crumb[] = segments
        .map((segment, index) => {
            // 라우트 그룹은 무시
            if (segment === '(policies)') return null;

            // 숫자 id는 숨김 (blog/[idx])
            if (!isNaN(Number(segment))) return null;

            // nav에서 관리하는 "정적" 세그먼트 (blog, tag, news ...)
            if (VISIBLE_SEGMENTS.includes(segment)) {
                return {
                    segment,
                    label: t(segment),
                } satisfies Crumb;
            }

            // 바로 앞이 'tag'인 세그먼트 = [name] (태그 이름)
            if (index > 0 && segments[index - 1] === 'tag') {
                // 태그 이름 그대로 보여주고 싶으면 아래 주석 해제
                // return { segment, label: `#${decodeURIComponent(segment)}` } satisfies Crumb;

                // 지금은 표시 안 함
                return null;
            }

            // 그 외 세그먼트는 표시하지 않음
            return null;
        })
        .filter(Boolean) as Crumb[];

    if (crumbs.length === 0) return null;

    // 2) 누적 경로 만들어주기 ( /blog , /blog/tag , /blog/tag/bitcoin ... )
    let accumulatedPath = '';

    return (
        <div className={styles.breadcrumbWrapper}>
            <div className={styles.breadcrumb}>
                {/* 홈 아이콘 쓰고 싶으면 주석 해제 */}
                {/*
                <span className={styles.homeImg}>
                  <NavigationLink href="/">
                    <Image src={homePic} width={20} height={20} alt="home icon" />
                  </NavigationLink>
                </span>
                */}

                {crumbs.map((crumb, index) => {
                    accumulatedPath += `/${crumb.segment}`;

                    return (
                        <div className={styles.breadCrumbElem} key={`${crumb.segment}-${index}`}>
                            {/* ✅ 두번째 요소부터만 arrowImg 추가 */}
                            {index > 0 && (
                                <span className={styles.arrowImg}>
                                  <Image src={arrowPic} width={12} height={12} alt="arrow icon" />
                                </span>
                            )}
                            <NavigationLink href={accumulatedPath} matchMode="exact">
                                {crumb.label}
                            </NavigationLink>
                        </div>
                    );
                })}
            </div>

            {/* history/back 버튼 쓰고 싶으면 주석 해제 */}
            {/*
              <div className={styles.history}>
                <button
                  type="button"
                  className={styles.backButton}
                  onClick={() => router.back()}
                >
                  <div className={styles.imageWrapper}>
                    <Image
                      className={styles.backArrow}
                      src={arrowUp}
                      width={24}
                      height={24}
                      alt="back history arrow"
                    />
                  </div>
                </button>
              </div>
             */}
        </div>
    );
};