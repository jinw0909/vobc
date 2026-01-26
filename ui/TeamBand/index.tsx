// 'use client'
//
// import styles from './styles.module.css'
// import Image from 'next/image'
// import { useTranslations } from 'next-intl'
// import { useEffect, useMemo, useRef, useState } from 'react'
// import useEmblaCarousel from 'embla-carousel-react'
//
// type TeamBandProps = {
//     selected: any
//     profile: any[]
//     order: number
//     registerRef: (order: number, el: HTMLDivElement | null) => void
//     data: any
// }
//
// export function TeamBand({ selected, profile, order, registerRef, data }: TeamBandProps) {
//     const t = useTranslations('team')
//
//     // ✅ profile 길이가 바뀌면 expanded도 리셋
//     const [expanded, setExpanded] = useState<boolean[]>(() => new Array(profile.length).fill(false))
//     useEffect(() => {
//         setExpanded(new Array(profile.length).fill(false))
//     }, [profile.length])
//
//     const toggleItem = (index: number) => {
//         setExpanded((prev) => {
//             const next = [...prev]
//             next[index] = !next[index]
//             return next
//         })
//     }
//
//     const bandRef = useRef<HTMLDivElement | null>(null)
//     useEffect(() => {
//         registerRef(order, bandRef.current)
//     }, [order, registerRef])
//
//     // ✅ 모바일 모드(슬라이더) 판별
//     const [isMobile, setIsMobile] = useState(false)
//     useEffect(() => {
//         const update = () => setIsMobile(window.innerWidth <= 768)
//         update()
//         window.addEventListener('resize', update)
//         return () => window.removeEventListener('resize', update)
//     }, [])
//
//     // ✅ Embla (모바일에서만 ref를 붙여 활성화)
//     const [emblaRef, emblaApi] = useEmblaCarousel({
//         align: 'start',
//         dragFree: true,
//         containScroll: 'trimSnaps',
//         skipSnaps: true,
//     })
//
//
//     // (선택) 모바일에서 아이템 클릭 시 해당 슬라이드로 스크롤
//     const scrollTo = (idx: number) => {
//         if (!isMobile) return
//         emblaApi?.scrollTo(idx)
//     }
//
//     const isWideBand = order === 6
//
//     return (
//         <div ref={bandRef} className={styles.itemBandWrapper}>
//             <div className={styles.itemContainer}>
//                 <div className={styles.itemBand}>
//                     <h2 className={selected ? styles.selectedTitle : ''}>{t(`${order}.title`)}</h2>
//
//                     {/* ✅ 모바일일 때만 Embla viewport로 동작 */}
//                     <div
//                         ref={isMobile ? emblaRef : undefined}
//                         className={`${styles.bandViewport} ${isMobile ? styles.isMobile : styles.isDesktop}`}
//                     >
//                         <ul
//                             className={`
//                                 ${styles.itemList}
//                                 ${isMobile ? styles.emblaContainer : ''}
//                                 ${isWideBand ? styles.wideList : ''}
//                               `}
//                         >
//                             {profile.map((_, i: number) => {
//                                 const img = profile[i]
//                                 const isFallback =
//                                     typeof img === 'object'
//                                         ? String(img?.src ?? '').includes('fallback')
//                                         : String(img).includes('fallback')
//
//                                 // wide band(order 6)는 카드 확장/이미지 없는 텍스트 카드로 유지
//                                 if (isWideBand) {
//                                     return (
//                                         <li
//                                             key={i}
//                                             className={`${styles.item} ${styles.wide} ${isMobile ? styles.emblaSlide : ''}`}
//                                             onClick={() => scrollTo(i)}
//                                             role="button"
//                                             tabIndex={0}
//                                             onKeyDown={(e) => {
//                                                 if (e.key === 'Enter' || e.key === ' ') scrollTo(i)
//                                             }}
//                                         >
//                                             <div className={styles.itemInner}>
//                                                 <div className={`${styles.profileDesc} ${styles.wideDesc}`}>
//                                                     {data?.[order]?.[i] && (
//                                                         <>
//                                                             <span className={styles.profileName}>{data[order][i].name}</span>
//                                                             <p className={styles.wideP}>
//                                                                 {data[order][i].desc?.map((line: string, j: number) => (
//                                                                     <span key={j}>{line}</span>
//                                                                 ))}
//                                                             </p>
//                                                         </>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </li>
//                                     )
//                                 }
//
//                                 // normal band
//                                 return (
//                                     <li
//                                         key={i}
//                                         className={`${styles.item} ${expanded[i] ? styles.show : ''} ${isMobile ? styles.emblaSlide : ''}`}
//                                         onClick={() => {
//                                             toggleItem(i)
//                                             scrollTo(i)
//                                         }}
//                                         role="button"
//                                         tabIndex={0}
//                                         onKeyDown={(e) => {
//                                             if (e.key === 'Enter' || e.key === ' ') {
//                                                 toggleItem(i)
//                                                 scrollTo(i)
//                                             }
//                                         }}
//                                     >
//                                         <div className={styles.itemInner}>
//                                             <div className={styles.profilePic}>
//                                                 <div className={`${styles.imgContainer} ${isFallback ? styles.fallback : ''}`}>
//                                                     <Image
//                                                         src={img}
//                                                         alt="profile"
//                                                         fill
//                                                         sizes="128px"
//                                                         style={{ objectFit: 'cover' }}
//                                                         draggable={false}
//                                                     />
//                                                 </div>
//
//                                                 {data?.[order]?.[i] && (
//                                                     <span className={styles.profileName}>{data[order][i].name}</span>
//                                                 )}
//                                             </div>
//
//                                             <div className={styles.profileDesc}>
//                                                 {data?.[order]?.[i] && (
//                                                     <>
//                                                         <span className={styles.profileStatus}>{data[order][i].status}</span>
//                                                         <p className={`${styles.descP} ${expanded[i] ? styles.descShow : ''}`}>
//                                                             {data[order][i].desc?.map((line: string, j: number) => (
//                                                                 <span key={j}>{line}</span>
//                                                             ))}
//                                                         </p>
//                                                     </>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </li>
//                                 )
//                             })}
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

'use client';

import styles from './styles.module.css';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import fallbackImg from '@/public/teams/fallback.png';

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

type TeamBandProps = {
    selected: boolean;
    order: number;
    registerRef: (order: number, el: HTMLDivElement | null) => void;
    team: TeamApi;
    members: MemberApi[];
};

function norm(s: string) {
    return (s ?? '').trim().toLowerCase();
}

export function TeamBand({ selected, order, registerRef, team, members }: TeamBandProps) {
    // 카드 펼침/접힘: 멤버 수에 맞춰
    const [expanded, setExpanded] = useState<boolean[]>(() => new Array(members.length).fill(false));
    useEffect(() => {
        setExpanded(new Array(members.length).fill(false));
    }, [members.length]);

    const toggleItem = (index: number) => {
        setExpanded((prev) => {
            const next = [...prev];
            next[index] = !next[index];
            return next;
        });
    };

    const bandRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        registerRef(order, bandRef.current);
    }, [order, registerRef]);

    // 모바일 판별
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const update = () => setIsMobile(window.innerWidth <= 768);
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
        skipSnaps: true,
    });

    const scrollTo = (idx: number) => {
        if (!isMobile) return;
        emblaApi?.scrollTo(idx);
    };

    // 팀별 특수 룰
    const LAW_TEAM_ID = 7;
    const ADVISOR_TEAM_ID = 6;

    const isLawTeam = team.id === LAW_TEAM_ID;
    const isAdvisorsTeam = team.id === ADVISOR_TEAM_ID;

    const canToggle = !isLawTeam;

    return (
        <div ref={bandRef} className={styles.itemBandWrapper}>
            <div className={styles.itemContainer}>
                <div className={styles.itemBand}>
                    <h2 className={selected ? styles.selectedTitle : ''}>{team.name}</h2>

                    <div
                        ref={isMobile ? emblaRef : undefined}
                        className={`${styles.bandViewport} ${isMobile ? styles.isMobile : styles.isDesktop}`}
                    >
                        <ul className={`${styles.itemList} ${isMobile ? styles.emblaContainer : ''}`}>
                            {members.map((m, i) => {
                                const photoSrc = m.photo ? m.photo : fallbackImg;

                                // ✅ 법률팀 = wide 카드 스타일 적용 (예전처럼)
                                if (isLawTeam) {
                                    return (
                                        <li
                                            key={m.id}
                                            className={`${styles.item} ${styles.wide} ${isMobile ? styles.emblaSlide : ''}`}
                                            onClick={() => scrollTo(i)} // 와이드는 스크롤만
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') scrollTo(i);
                                            }}
                                        >
                                            <div className={styles.itemInner}>
                                                <div className={`${styles.profileDesc} ${styles.wideDesc}`}>
                                                    <span className={styles.profileName}>{m.name}</span>
                                                    <p className={styles.wideP}>
                                                        {m.introduction && <span>{m.introduction}</span>}
                                                        {(m.resumes ?? []).map((r) => (
                                                            <span key={r.id}>{r.content}</span>
                                                        ))}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                }

                                // ✅ 일반팀 (자문팀은 toggle 없이)
                                const onClick = () => {
                                    if (canToggle) toggleItem(i);
                                    scrollTo(i);
                                };

                                return (
                                    <li
                                        key={m.id}
                                        className={`${styles.item} ${canToggle && expanded[i] ? styles.show : ''} ${isMobile ? styles.emblaSlide : ''}`}
                                        onClick={onClick}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') onClick();
                                        }}
                                    >
                                        <div className={styles.itemInner}>
                                            <div className={styles.profilePic}>
                                                <div className={styles.imgContainer}>
                                                    <Image
                                                        src={photoSrc}
                                                        alt={m.name}
                                                        fill
                                                        sizes="128px"
                                                        style={{ objectFit: 'cover' }}
                                                        draggable={false}
                                                    />
                                                </div>
                                                <span className={styles.profileName}>{m.name}</span>
                                            </div>

                                            <div className={styles.profileDesc}>
                                                <span className={styles.profileStatus}>
                                                  {m.teamRoleLabel ?? m.role ?? ''}
                                                </span>
                                                {/* ✅ 자문팀은 expanded에 따라 클래스 토글하지 않게 */}
                                                <p className={`
                                                    ${styles.descP} 
                                                    ${canToggle && expanded[i] ? styles.descShow : ''}
                                                    ${isAdvisorsTeam && expanded[i] ? styles.advisorScroll : ''}
                                                `}>
                                                    {/*{m.introduction && <span>{m.introduction}</span>}*/}
                                                    {(m.resumes ?? []).map((r) => (
                                                        <span key={r.id}>{r.content}</span>
                                                    ))}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}

                            {members.length === 0 && (
                                <li className={styles.item}>
                                    <div className={styles.itemInner}>
                                        <div className={styles.profileDesc}>
                                            <span className={styles.profileStatus}>No members</span>
                                            <p className={styles.descP}>
                                                <span>Coming soon.</span>
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
