'use client';

import { useEffect, useRef } from 'react';

const BG = 'rgba(30, 30, 30, 1)';
const FG = '#fff';
const SUB_FG = 'rgba(200, 200, 200, 0.78)';
const PADDING_X = 24;

export const Main = () => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const canvas = canvasRef.current;
        if (!section || !canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const FONT_FAMILY = `"Noto Serif KR","Noto Serif JP","Times New Roman",serif`;

        // ---- 문구 ----
        const header = 'VOB 1.0 Smart Trading';
        const line1 = 'Experience EmOtion-Free Trading';

        const s1 = 'Discover emotion-free and secure trading';
        const s2 = 'with our advanced AI technology';
        const s3 = 'Join us for global revenue opportunities';
        const s4 = 'and together build out a thriving ecosystem';

        const withAI = 'with AI';

        // ---- 스타일 ----



        // ---- 애니메이션 ----
        const O_FULL_AT = 0.6;

        const isMobile = () => window.innerWidth < 769;
        const getZoomMax = () => (isMobile() ? 52 : 70);
        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
        const getZoomEase = (t: number) =>
            isMobile() ? Math.pow(easeOutCubic(t), 2.2) : easeOutCubic(t);

        const easeInOutCubic = (t: number) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

        let dpr = window.devicePixelRatio || 1;

        const setCanvasSize = () => {
            dpr = window.devicePixelRatio || 1;
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const fitFontSize = (text: string, targetPx: number, maxWidth: number, weight = 800) => {
            ctx.font = `${weight} ${targetPx}px ${FONT_FAMILY}`;
            const w = ctx.measureText(text).width;
            if (w <= maxWidth) return targetPx;
            return Math.max(11, Math.floor(targetPx * (maxWidth / w)));
        };

        const getProgressInSection = () => {
            const rect = section.getBoundingClientRect();
            const vh = window.innerHeight;
            const scrollable = rect.height - vh;
            if (scrollable <= 0) return 1;
            return clamp01(-rect.top / scrollable);
        };

        const draw = (p: number) => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const maxTextWidth = Math.max(1, w - PADDING_X * 2);

            // BG
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.fillStyle = BG;
            ctx.fillRect(0, 0, w, h);

            // font sizes
            const headerSize = fitFontSize(header, Math.min(22, w * 0.04), maxTextWidth, 700);
            const line1Size = fitFontSize(line1, Math.min(56, w * 0.07), maxTextWidth, 800);
            const subBase = Math.min(18, w * 0.03);

            const s1Size = fitFontSize(s1, subBase, maxTextWidth, 600);
            const s2Size = fitFontSize(s2, subBase, maxTextWidth, 600);
            const s3Size = fitFontSize(s3, subBase, maxTextWidth, 600);
            const s4Size = fitFontSize(s4, subBase, maxTextWidth, 600);

            ctx.textBaseline = 'middle';

            /* =================================================
               🔥 간격 핵심 조정 영역
            ================================================= */

            const headerToLine1 = isMobile()
                ? h * 0.045
                : h * 0.055;   // ← 1줄 ↔ 2줄

            const line1ToSubs = isMobile()
                ? h * 0.055
                : h * 0.07;    // ← 2줄 ↔ 아래 설명 묶음

            const subGap = isMobile()
                ? h * 0.022
                : h * 0.018;   // ← 서브 줄 간격


            // 기준 Y (전체를 살짝 위로)
            const line1Y = h * 0.46;

            const headerY = line1Y - headerToLine1;

            const s1Y = line1Y + line1ToSubs;
            const s2Y = s1Y + subGap;
            const s3Y = s2Y + subGap * 1.6;
            const s4Y = s3Y + subGap;

            // X 계산
            const centerX = (text: string, size: number, weight: number) => {
                ctx.font = `${weight} ${size}px ${FONT_FAMILY}`;
                return (w - ctx.measureText(text).width) / 2;
            };

            const headerX = centerX(header, headerSize, 700);
            const line1X = centerX(line1, line1Size, 800);
            const s1X = centerX(s1, s1Size, 600);
            const s2X = centerX(s2, s2Size, 600);
            const s3X = centerX(s3, s3Size, 600);
            const s4X = centerX(s4, s4Size, 600);

            // O 기준점
            ctx.font = `800 ${line1Size}px ${FONT_FAMILY}`;
            const beforeO = 'Experience Em';
            const oW = ctx.measureText('O').width;
            const oCenterX = line1X + ctx.measureText(beforeO).width + oW / 2;
            const oCenterY = line1Y;

            // phases
            const p1 = clamp01(p / O_FULL_AT);
            const scale = lerp(1, getZoomMax(), getZoomEase(p1));
            const p2 = clamp01((p - O_FULL_AT) / (1 - O_FULL_AT));
            const t2 = easeInOutCubic(p2);
            const bgAlpha = p2 <= 0 ? 1 : lerp(1, 0, t2);

            // draw zoom block
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

            ctx.fillStyle = SUB_FG;
            ctx.font = `600 ${s1Size}px ${FONT_FAMILY}`;
            ctx.fillText(s1, s1X, s1Y);

            ctx.font = `600 ${s2Size}px ${FONT_FAMILY}`;
            ctx.fillText(s2, s2X, s2Y);

            ctx.font = `600 ${s3Size}px ${FONT_FAMILY}`;
            ctx.fillText(s3, s3X, s3Y);

            ctx.font = `600 ${s4Size}px ${FONT_FAMILY}`;
            ctx.fillText(s4, s4X, s4Y);

            ctx.restore();
            ctx.globalAlpha = 1;

            // with AI
            if (p2 > 0) {
                const aiSize = fitFontSize(withAI, w * 0.06 * lerp(0.6, 3.0, t2), maxTextWidth, 800);
                ctx.globalAlpha = lerp(0, 1, t2);
                ctx.fillStyle = FG;
                ctx.font = `800 ${aiSize}px ${FONT_FAMILY}`;
                ctx.fillText(withAI, centerX(withAI, aiSize, 800), h * 0.62);
                ctx.globalAlpha = 1;
            }
        };

        const onScroll = () => draw(getProgressInSection());

        const start = async () => {
            try {
                // @ts-ignore
                if (document?.fonts?.ready) await document.fonts.ready;
            } catch {}

            setCanvasSize();
            onScroll();

            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', () => {
                setCanvasSize();
                onScroll();
            });
        };

        start();
    }, []);

    return (
        <>
            <section ref={sectionRef} style={{ height: '300vh', background: BG }}>
                <div style={{ position: 'sticky', top: 0, height: '100vh' }}>
                    <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
                </div>
            </section>
        </>
    );
};
