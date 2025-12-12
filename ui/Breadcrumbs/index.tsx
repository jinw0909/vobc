// 'use client';
// import Link from 'next/link';
// import {Noto_Sans_JP} from "next/font/google";
// import {Noto_Serif_JP} from "next/font/google";
// import {allowedDisplayValues} from "next/dist/compiled/@next/font/dist/constants";
// import styles from "./styles.module.css";
// import Image from "next/image";
// import { NavigationLink} from "@/ui/NavigationLink";
// import {useSelectedLayoutSegments} from "next/navigation";
// import homePic from '@/public/icons/home-icon.png';
// import arrowPic from '@/public/icons/right-arrow-white.png'
// import arrowUp from '@/public/icons/arrow-up-white.png';
// import {useTranslations} from "next-intl";
// import {useRouter} from "@/i18n/navigation"
//
// const notosansjp = Noto_Sans_JP({
//     weight: ['200', '300', '400', '500', '600', '700', '900'],
//     style : "normal",
//     subsets: ['latin']
// });
// export const Breadcrumbs = () => {
//
//     const segments = useSelectedLayoutSegments();
//     console.log("segments: ", segments);
//     const t = useTranslations('nav');
//     const router = useRouter();
//
//     return (
//         (segments.length > 0) && (
//             // <div className={`${notosansjp.className} ${styles.breadcrumbWrapper}`}>
//             <div className={styles.breadcrumbWrapper}>
//                 <div className={styles.breadcrumb}>
//                     <span className={styles.homeImg}>
//                         <NavigationLink href="/"><Image src={homePic} width={20} height={20}
//                                                         alt="home icon"/></NavigationLink>
//                     </span>
//                     {
//                         segments.map((segment, index) => {
//                             if (segment === '(policies)') {
//                                 return null;
//                             }
//                             if (!isNaN(parseInt(segment))) {
//                                 return null;
//                             }
//                             return (
//                                 <div className={styles.breadCrumbElem} key={index}>
//                                     <span className={styles.arrowImg}>
//                                         <Image src={arrowPic} width={12} height={12} alt="arrow icon"/>
//                                     </span>
//                                     <NavigationLink
//                                         href={`/${segment}`}
//                                         matchMode={"exact"}
//                                     >
//                                         {t(segment)}
//                                     </NavigationLink>
//                                 </div>
//                             )
//                         })
//                     }
//                 </div>
//                 <div className={styles.history}>
//                     <button
//                         type="button"
//                         className={styles.backButton}
//                         onClick={() => router.back()}
//                     >
//                         <div className={styles.imageWrapper}>
//                             <Image className={styles.backArrow} src={arrowUp} width={24} height={24}
//                                    alt="back history arrow"/>
//                         </div>
//                     </button>
//                 </div>
//             </div>
//         )
//
//     )
// }

'use client';
import {useRouter, useSelectedLayoutSegments} from "next/navigation";
import {useTranslations} from "next-intl";
import {NavigationLink} from "@/ui/NavigationLink";
import homePic from '@/public/icons/home-icon.png';
import arrowPic from '@/public/icons/right-arrow-white.png'
import arrowUp from '@/public/icons/arrow-up-white.png';
import Image from "next/image";
import styles from "./styles.module.css";

const VISIBLE_SEGMENTS = ['blog', 'news', 'media', 'about']; // nav에서 번역 키로 쓰는 것들만

export const Breadcrumbs = () => {
    const segments = useSelectedLayoutSegments();
    const t = useTranslations('nav');
    const router = useRouter();

    if (segments.length === 0) return null;

    // 누적 경로 만들어주기 ( /blog , /blog/tag , /blog/tag/bitcoin ... )
    let accumulatedPath = '';

    return (
        <div className={styles.breadcrumbWrapper}>
            <div className={styles.breadcrumb}>
                <span className={styles.homeImg}>
                    <NavigationLink href="/">
                        <Image src={homePic} width={20} height={20} alt="home icon" />
                    </NavigationLink>
                </span>

                {segments.map((segment, index) => {
                    // 라우트 그룹은 무시
                    if (segment === '(policies)') return null;

                    // 경로 누적
                    accumulatedPath += `/${segment}`;

                    // 1) 숫자 id는 여전히 숨김 (blog/[idx])
                    if (!isNaN(Number(segment))) {
                        return null;
                    }

                    // 2) nav에서 관리하는 "정적" 세그먼트 (blog, tag, news ...)
                    let label: string | React.ReactNode;

                    if (VISIBLE_SEGMENTS.includes(segment)) {
                        label = t(segment);
                    }
                    // 3) 바로 앞이 'tag'인 세그먼트 = [name] (태그 이름)
                    else if (index > 0 && segments[index - 1] === 'tag') {
                        // 태그 이름 그대로 사용 (필요하면 # 붙이기)
                        label = `#${decodeURIComponent(segment)}`;
                    }
                    // 4) 그 외 세그먼트는 표시하지 않음 (원하면 여기서도 label = segment 로 보여줄 수 있음)
                    else {
                        return null;
                    }

                    return (
                        <div className={styles.breadCrumbElem} key={`${segment}-${index}`}>
                            <span className={styles.arrowImg}>
                                <Image src={arrowPic} width={12} height={12} alt="arrow icon" />
                            </span>
                            <NavigationLink
                                href={accumulatedPath}
                                matchMode="exact"
                            >
                                {label}
                            </NavigationLink>
                        </div>
                    );
                })}
            </div>

            <div className={styles.history}>
                <button
                    type="button"
                    className={styles.backButton}
                    onClick={() => router.back()}
                >
                    <div className={styles.imageWrapper}>
                        <Image className={styles.backArrow} src={arrowUp} width={24} height={24}
                               alt="back history arrow" />
                    </div>
                </button>
            </div>
        </div>
    );
};
