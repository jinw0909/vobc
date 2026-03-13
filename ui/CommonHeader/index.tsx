'use client';

import { useEffect, useRef } from 'react';
import styles from './styles.module.css';

type CommonHeaderProps = {
    text: string;
    fullVisibleAt?: number; // 0~1 (0.5 = viewport 절반)
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

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const update = () => {
            rafRef.current = null;

            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight || document.documentElement.clientHeight;

            // -------------------------
            // 1) 텍스트/after 라인 progress
            // rect.top == vh            -> 0
            // rect.top == vh*0.5       -> 1
            // -------------------------
            const startTop = vh;
            const endTop = vh * fullVisibleAt;

            const t = (startTop - rect.top) / Math.max(1, startTop - endTop);
            const progress = clamp01(t);


            el.style.opacity = progress.toFixed(4);
            el.style.setProperty('--line', progress.toFixed(4));
            el.style.transform = `translateY(${(1 - progress) * 8}px)`;

            // -------------------------
            // 2) before 배경 높이 progress
            // rect.top == vh*0.5       -> 0
            // rect.top == 0            -> 1
            // 최종 height = 50vh * progress
            // -------------------------
            const bgStartTop = vh * 0.5;
            const bgEndTop = 0;

            const bgT = (bgStartTop - rect.top) / Math.max(1, bgStartTop - bgEndTop);
            const bgProgress = clamp01(bgT);

            el.style.setProperty('--bg-progress', bgProgress.toFixed(4));
            el.style.setProperty('--text-progress', bgProgress.toFixed(4));

            // 3) ✅ margin-bottom progress
            // rect.top == 50vh -> 0
            // rect.top == 25vh -> 1
            const marginStartTop = vh * 0.5;
            const marginEndTop = vh * 0.25;

            const marginT =
                (marginStartTop - rect.top) /
                Math.max(1, marginStartTop - marginEndTop);

            const marginProgress = clamp01(marginT);

            el.style.setProperty('--margin-progress', marginProgress.toFixed(4));
        };

        const onScroll = () => {
            if (rafRef.current == null) {
                rafRef.current = requestAnimationFrame(update);
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        update();

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
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