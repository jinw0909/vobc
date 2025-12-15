'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';

export default function BottomReachedHint() {
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const [active, setActive] = useState(false);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const io = new IntersectionObserver(
            ([entry]) => setActive(entry.isIntersecting),
            { threshold: 0 }
        );

        io.observe(sentinel);
        return () => io.disconnect();
    }, []);

    return (
        <>
            <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
            <div className={`${styles.bottomHint} ${active ? styles.active : ''}`}></div>
            {/*<Image*/}
            {/*    className={`${styles.bottomHint} ${active ? styles.active : ''}`}*/}
            {/*    src="/blockchain_white.png"*/}
            {/*    alt=""*/}
            {/*    aria-hidden="true"*/}
            {/*    width={1200}*/}
            {/*    height={200}*/}
            {/*    priority*/}
            {/*    unoptimized*/}
            {/*/>*/}
        </>
    );
}
