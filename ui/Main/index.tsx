'use client';

import { useEffect, useRef } from 'react';

export const Main = () => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const canvas = canvasRef.current;
        if (!section || !canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // ✅ 명조체
        const FONT_FAMILY = `"Noto Serif KR","Noto Serif JP","Times New Roman",serif`;

        // ---- 문구 ----
        const header = 'VOB 1.0 Smart Trading';
        const line1 = 'Experience EmOtion-Free Trading'; // O 기준
        const line2 = 'with AI';

        // ---- 타이밍 ----
        const O_FULL_AT = 0.55; // 여기까지는 줌인(배경 텍스트)
        const O_SCALE_MAX = 70;

        // ✅ 배경색: rgba(30, 30, 30, 1)
        const BG = 'rgba(30, 30, 30, 1)';
        const FG = '#fff';
        const PADDING_X = 24;

        let dpr = window.devicePixelRatio || 1;

        const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
        const easeInOutCubic = (t: number) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const setCanvasSize = () => {
            dpr = window.devicePixelRatio || 1;
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        // ✅ 모바일 overflow 방지
        const fitFontSize = (text: string, targetPx: number, maxWidth: number, weight = 800) => {
            ctx.font = `${weight} ${targetPx}px ${FONT_FAMILY}`;
            const w = ctx.measureText(text).width;
            if (w <= maxWidth) return targetPx;
            return Math.max(12, Math.floor(targetPx * (maxWidth / w)));
        };

        // ✅ 섹션 내부 진행도(0~1)
        const getProgressInSection = () => {
            const rect = section.getBoundingClientRect();
            const vh = window.innerHeight;
            const scrollable = rect.height - vh;
            if (scrollable <= 0) return 1;
            const scrolled = -rect.top;
            return clamp01(scrolled / scrollable);
        };

        const draw = (p: number) => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const maxTextWidth = Math.max(1, w - PADDING_X * 2);

            // 배경
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.fillStyle = BG;
            ctx.fillRect(0, 0, w, h);

            // 폰트(반응형 + 폭 맞춤)
            const headerBase = Math.max(14, Math.min(22, w * 0.04));
            const line1Base = Math.max(20, Math.min(56, w * 0.07));

            const headerSize = fitFontSize(header, headerBase, maxTextWidth, 700);
            const line1Size = fitFontSize(line1, line1Base, maxTextWidth, 800);

            // 블록 위치(가운데)
            const gap = Math.max(10, Math.floor(h * 0.02));
            const blockCenterY = h * 0.5;

            ctx.textBaseline = 'middle';

            // 각 줄 기본 좌표
            ctx.font = `700 ${headerSize}px ${FONT_FAMILY}`;
            const headerW = ctx.measureText(header).width;
            const headerX = (w - headerW) / 2;
            const headerY = blockCenterY - gap;

            ctx.font = `800 ${line1Size}px ${FONT_FAMILY}`;
            const line1W = ctx.measureText(line1).width;
            const line1X = (w - line1W) / 2;
            const line1Y = blockCenterY + gap;

            // O 기준점
            const beforeO = 'Experience Em';
            const oChar = 'O';
            const beforeW = ctx.measureText(beforeO).width;
            const oW = ctx.measureText(oChar).width;

            const oCenterX = line1X + beforeW + oW * 0.5;
            const oCenterY = line1Y;

            // Phase 1: 배경(두 줄) 줌인
            const p1 = clamp01(p / O_FULL_AT);
            const zoomT = easeOutCubic(p1);
            const scale = lerp(1, O_SCALE_MAX, zoomT);

            // Phase 2: with AI 등장 구간(0~1)
            const p2 = clamp01((p - O_FULL_AT) / (1 - O_FULL_AT));
            const t2 = easeInOutCubic(p2);

            // ✅ 핵심: with AI가 나오기 시작하면 배경 텍스트를 서서히 지워서 O가 완전히 사라지게
            // - 초반엔 그대로, 중반부터 급격히 사라지게 하고 싶으면 curve를 조절하면 됨
            const bgAlpha = p2 <= 0 ? 1 : lerp(1, 0, t2);

            // 배경 텍스트(확대 + 페이드아웃)
            ctx.save();
            ctx.globalAlpha = bgAlpha;

            ctx.translate(oCenterX, oCenterY);
            ctx.scale(scale, scale);
            ctx.translate(-oCenterX, -oCenterY);

            ctx.fillStyle = FG;

            ctx.font = `700 ${headerSize}px ${FONT_FAMILY}`;
            ctx.fillText(header, headerX, headerY);

            ctx.font = `800 ${line1Size}px ${FONT_FAMILY}`;
            ctx.fillText(line1, line1X, line1Y);

            ctx.restore();
            ctx.globalAlpha = 1;

            // Phase 2: with AI (페이드+확대) — 이건 화면 중앙 고정 오버레이처럼
            if (p2 > 0) {
                const aiBase = Math.max(18, Math.min(52, w * 0.06));
                // ✅ with AI가 “나오면서 추가로 확대” (원하면 끝값 더 키우면 됨)
                const aiScale = lerp(0.6, 3.2, t2);
                const aiAlpha = lerp(0, 1, t2);

                const aiSize = fitFontSize(line2, aiBase * aiScale, maxTextWidth, 800);

                ctx.globalAlpha = aiAlpha;
                ctx.fillStyle = FG;
                ctx.font = `800 ${aiSize}px ${FONT_FAMILY}`;

                const aiW2 = ctx.measureText(line2).width;
                ctx.fillText(line2, (w - aiW2) / 2, h * 0.55);

                ctx.globalAlpha = 1;
            }
        };

        const onScroll = () => draw(getProgressInSection());

        const start = async () => {
            try {
                // 폰트 로딩 대기(가능한 브라우저에서)
                // @ts-ignore
                if (document?.fonts?.ready) {
                    // @ts-ignore
                    await document.fonts.ready;
                }
            } catch {
                // ignore
            }

            setCanvasSize();
            onScroll();

            const onResize = () => {
                setCanvasSize();
                onScroll();
            };

            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onResize);

            return () => {
                window.removeEventListener('scroll', onScroll);
                window.removeEventListener('resize', onResize);
            };
        };

        let cleanup: (() => void) | undefined;
        start().then((fn) => (cleanup = fn));

        return () => cleanup?.();
    }, []);

    return (
        <>
            {/* ✅ 이 섹션에서만 sticky 고정, 끝나면 자동으로 풀림 */}
            <section ref={sectionRef} style={{ height: '260vh', background: 'rgba(30, 30, 30, 1)' }}>
                <div
                    style={{
                        position: 'sticky',
                        top: 0,
                        height: '100vh',
                        overflow: 'hidden',
                    }}
                >
                    <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
                </div>
            </section>

        </>
    );
};
