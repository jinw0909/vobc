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

            // rect.top == vh(바닥) => progress 0
            // rect.top == vh*fullVisibleAt(절반) => progress 1
            const startTop = vh;
            const endTop = vh * fullVisibleAt;

            const t = (startTop - rect.top) / Math.max(1, (startTop - endTop));
            const progress = clamp01(t);

            // ✅ 1) opacity
            el.style.opacity = progress.toFixed(4);

            // ✅ 2) bottom line length (0 -> 1)
            el.style.setProperty('--line', progress.toFixed(4));

            // 선택: 살짝 올라오는 느낌(원치 않으면 삭제)
            el.style.transform = `translateY(${(1 - progress) * 8}px)`;
        };

        const onScroll = () => {
            if (rafRef.current == null) rafRef.current = requestAnimationFrame(update);
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
            className={styles.commonHeader}
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