'use client'

import {useLayoutEffect, useRef} from 'react'

export function HeaderMeasure({children}: {children: React.ReactNode}) {
    const headerRef = useRef<HTMLElement | null>(null);

    useLayoutEffect(() => {
        const el = headerRef.current;
        if (!el) {
            console.log("❌ headerRef null");
            return;
        }

        const apply = () => {
            const h = el.getBoundingClientRect().height;
            // console.log("📏 header height:", h);
            document.documentElement.style.setProperty('--header-h-measured', `${h}px`);
        }

        apply();
        const ro = new ResizeObserver(apply);
        ro.observe(el);
        return () => ro.disconnect()
    }, []);

    return (
        <div>
            {/* children 안에서 data-header-root를 찾아 ref 연결 */}
            <div
                ref={(node) => {
                    if (!node) return
                    headerRef.current = node.querySelector<HTMLElement>('[data-header-root]')
                }}
            >
                {children}
            </div>
        </div>
    )

}