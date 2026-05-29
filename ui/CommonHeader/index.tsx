// 'use client';
//
// import { useEffect, useRef } from 'react';
// import styles from './styles.module.css';
//
// type CommonHeaderProps = {
//     text: string;
//     fullVisibleAt?: number; // 0~1 (0.5 = viewport 절반)
//     className?: string;
// };
//
// const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
//
// export function CommonHeader({
//                                  text,
//                                  fullVisibleAt = 0.5,
//                                  className,
//                              }: CommonHeaderProps) {
//     const ref = useRef<HTMLDivElement | null>(null);
//     const rafRef = useRef<number | null>(null);
//
//     useEffect(() => {
//         const el = ref.current;
//         if (!el) return;
//
//         const update = () => {
//             rafRef.current = null;
//
//             const rect = el.getBoundingClientRect();
//             const vh = window.innerHeight || document.documentElement.clientHeight;
//
//             // -------------------------
//             // 1) 텍스트/after 라인 progress
//             // rect.top == vh            -> 0
//             // rect.top == vh*0.5       -> 1
//             // -------------------------
//             const startTop = vh;
//             const endTop = vh * fullVisibleAt;
//
//             const t = (startTop - rect.top) / Math.max(1, startTop - endTop);
//             const progress = clamp01(t);
//
//
//             el.style.opacity = progress.toFixed(4);
//             el.style.setProperty('--line', progress.toFixed(4));
//             el.style.transform = `translateY(${(1 - progress) * 8}px)`;
//
//             // -------------------------
//             // 2) before 배경 높이 progress
//             // rect.top == vh*0.5       -> 0
//             // rect.top == 0            -> 1
//             // 최종 height = 50vh * progress
//             // -------------------------
//             const bgStartTop = vh * 0.5;
//             const bgEndTop = 0;
//
//             const bgT = (bgStartTop - rect.top) / Math.max(1, bgStartTop - bgEndTop);
//             const bgProgress = clamp01(bgT);
//
//             el.style.setProperty('--bg-progress', bgProgress.toFixed(4));
//             el.style.setProperty('--text-progress', bgProgress.toFixed(4));
//
//             // 3) ✅ margin-bottom progress
//             // rect.top == 50vh -> 0
//             // rect.top == 25vh -> 1
//             const marginStartTop = vh * 0.5;
//             const marginEndTop = vh * 0.25;
//
//             const marginT =
//                 (marginStartTop - rect.top) /
//                 Math.max(1, marginStartTop - marginEndTop);
//
//             const marginProgress = clamp01(marginT);
//
//             el.style.setProperty('--margin-progress', marginProgress.toFixed(4));
//         };
//
//         const onScroll = () => {
//             if (rafRef.current == null) {
//                 rafRef.current = requestAnimationFrame(update);
//             }
//         };
//
//         window.addEventListener('scroll', onScroll, { passive: true });
//         window.addEventListener('resize', onScroll);
//         update();
//
//         return () => {
//             window.removeEventListener('scroll', onScroll);
//             window.removeEventListener('resize', onScroll);
//             if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
//         };
//     }, [fullVisibleAt]);
//
//     return (
//         <div
//             ref={ref}
//             className={`${styles.commonHeader} ${className ?? ''}`}
//             style={{
//                 opacity: 0,
//                 transform: 'translateY(8px)',
//                 transition: 'opacity 80ms linear, transform 80ms linear',
//                 willChange: 'opacity, transform',
//             }}
//         >
//             {text}
//         </div>
//     );
// }

'use client';

import { useEffect, useRef } from 'react';
import styles from './styles.module.css';

type CommonHeaderProps = {
    text: string;
    fullVisibleAt?: number;
    className?: string;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export function CommonHeader({
                                 text,
                                 fullVisibleAt = 0.5,
                                 className,
                             }: CommonHeaderProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const rafRef = useRef<number | null>(null);

    // ✅ 모바일 주소창 변화에 흔들리지 않는 기준 높이
    const stableVhRef = useRef<number | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const getCurrentVh = () =>
            window.innerHeight || document.documentElement.clientHeight;

        // ✅ 최초 진입 시점의 viewport 높이를 기준값으로 고정
        // 모바일에서는 주소창이 보이는 상태의 작은 높이가 보통 여기 잡힘
        if (stableVhRef.current == null) {
            stableVhRef.current = getCurrentVh();
        }

        const update = () => {
            rafRef.current = null;

            const rect = el.getBoundingClientRect();

            // ✅ 기존 window.innerHeight 대신 고정된 svh-like 값 사용
            const vh = stableVhRef.current ?? getCurrentVh();

            // -------------------------
            // 1) 텍스트/after 라인 progress
            // rect.top == vh      -> 0
            // rect.top == vh*0.5  -> 1
            // -------------------------
            const startTop = vh;
            const endTop = vh * fullVisibleAt;

            const t =
                (startTop - rect.top) /
                Math.max(1, startTop - endTop);

            const progress = clamp01(t);

            el.style.opacity = progress.toFixed(4);
            el.style.setProperty('--line', progress.toFixed(4));
            el.style.transform = `translateY(${(1 - progress) * 8}px)`;

            // -------------------------
            // 2) before 배경 높이 progress
            // rect.top == vh*0.5 -> 0
            // rect.top == 0      -> 1
            // -------------------------
            const bgStartTop = vh * 0.5;
            const bgEndTop = 0;

            const bgT =
                (bgStartTop - rect.top) /
                Math.max(1, bgStartTop - bgEndTop);

            const bgProgress = clamp01(bgT);

            el.style.setProperty('--bg-progress', bgProgress.toFixed(4));
            el.style.setProperty('--text-progress', bgProgress.toFixed(4));

            // -------------------------
            // 3) margin-bottom progress
            // rect.top == 50svh -> 0
            // rect.top == 25svh -> 1
            // -------------------------
            const marginStartTop = vh * 0.5;
            const marginEndTop = vh * 0.25;

            const marginT =
                (marginStartTop - rect.top) /
                Math.max(1, marginStartTop - marginEndTop);

            const marginProgress = clamp01(marginT);

            el.style.setProperty(
                '--margin-progress',
                marginProgress.toFixed(4)
            );
        };

        const onScroll = () => {
            if (rafRef.current == null) {
                rafRef.current = requestAnimationFrame(update);
            }
        };

        const onResize = () => {
            const currentVh = getCurrentVh();

            // ✅ 데스크탑/태블릿 회전/실제 리사이즈 대응
            // 모바일 주소창 정도의 작은 변화는 무시하고,
            // 큰 변화만 기준값 갱신
            const prevVh = stableVhRef.current ?? currentVh;
            const diff = Math.abs(currentVh - prevVh);

            if (diff > 120) {
                stableVhRef.current = currentVh;
            }

            onScroll();
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);

        update();

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);

            if (rafRef.current != null) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [fullVisibleAt]);

    return (
        <div
            ref={ref}
            className={`${styles.commonHeader} ${className ?? ''}`}
            style={{
                opacity: 0,
                transform: 'translateY(8px)',
                transition: 'opacity 80ms linear, transform 80ms linear',
                willChange: 'opacity, transform',
            }}
        >
            {text}
        </div>
    );
}