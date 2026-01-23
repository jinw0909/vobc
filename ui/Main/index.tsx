'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

const BG = 'rgba(30, 30, 30, 1)';
const FG = '#fff';
const SUB_FG = 'rgba(255, 255, 255, 0.78)';
const PADDING_X = 24;

// ✅ 더 따뜻한 옐로우 톤 (원하면 숫자만 더 노랗게 조정 가능)
const TINT_RGB = { r: 0xf2, g: 0xe9, b: 0x7a }; // soft warm yellow
const RING_RGB = { r: 0xd9, g: 0xd0, b: 0x52 }; // slightly deeper yellow for rings

export const Main = () => {
    const t = useTranslations('hero');
    const sectionRef = useRef<HTMLElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const s1 = t('line1');
    const s2 = t('line2');
    const s3 = t('line3');
    const s4 = t('line4');

    useEffect(() => {
        const section = sectionRef.current;
        const canvas = canvasRef.current;
        if (!section || !canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const FONT_FAMILY = `"Noto Serif KR","Noto Serif JP","Times New Roman",serif`;

        const header = 'VOB 1.0 Smart Trading';
        const line1 = 'Experience EmOtion-Free Trading';
        const withAI = 'with VOB';

        const O_FULL_AT = 0.6;

        const isMobile = () => window.innerWidth < 769;
        const getZoomMax = () => (isMobile() ? 52 : 70);

        const easeOutCubic = (tt: number) => 1 - Math.pow(1 - tt, 3);
        const getZoomEase = (tt: number) =>
            isMobile() ? Math.pow(easeOutCubic(tt), 2.2) : easeOutCubic(tt);

        const easeInOutCubic = (tt: number) =>
            tt < 0.5 ? 4 * tt * tt * tt : 1 - Math.pow(-2 * tt + 2, 3) / 2;

        const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
        const lerp = (a: number, b: number, tt: number) => a + (b - a) * tt;

        let dpr = window.devicePixelRatio || 1;

        let rafId: number | null = null;
        let lastT = 0;
        let time = 0;
        let latestP = 0;

        const setCanvasSize = () => {
            dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            const cw = Math.max(1, rect.width);
            const ch = Math.max(1, rect.height);

            canvas.width = Math.floor(cw * dpr);
            canvas.height = Math.floor(ch * dpr);

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

        /**
         * ✅ "따뜻한 옐로우 톤" 파동 배경 (노이즈 제거)
         * - 중심: O 위치
         * - 초반: 은은한 옐로우 안개 + 부드러운 링
         * - 끝: 정확히 BG로 수렴
         */
        const drawWarmRippleBackground = (
            w: number,
            h: number,
            p2: number,
            tSec: number,
            cx: number,
            cy: number
        ) => {
            const fade = clamp01(p2);

            // 끝에서는 정확한 BG
            if (fade >= 0.999) {
                ctx.fillStyle = BG;
                ctx.fillRect(0, 0, w, h);
                return;
            }

            // 1) base: 완전 단색 대신 "조금 더 밝은 차콜"로 시작 (칙칙함 완화)
            ctx.fillStyle = 'rgba(22,22,22,1)';
            ctx.fillRect(0, 0, w, h);

            // 2) 전체 따뜻한 톤 워시(초반 강, 후반 약)
            // 너무 노랗게 하면 촌스러워져서 alpha는 낮게
            const washA = 0.08 * Math.pow(1 - fade, 0.9);
            if (washA > 0.0005) {
                ctx.fillStyle = `rgba(${TINT_RGB.r},${TINT_RGB.g},${TINT_RGB.b},${washA})`;
                ctx.fillRect(0, 0, w, h);
            }

            const maxR = Math.hypot(w, h) * 0.78;

            const ringCount = isMobile() ? 8 : 12;
            const ringSpacing = maxR / ringCount;

            // 느리게, 부드럽게
            const speed = isMobile() ? 110 : 140;
            const travel = (tSec * speed) % ringSpacing;

            // 링 강도: 초반 강, 후반 약
            const intensity = lerp(0.85, 0.0, Math.pow(fade, 1.1));

            // 3) 중앙 글로우(옐로우 안개) — 텍스트 뒤에 은은하게
            if (intensity > 0.01) {
                const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.65);
                const a0 = 0.14 * intensity;
                glow.addColorStop(0, `rgba(${TINT_RGB.r},${TINT_RGB.g},${TINT_RGB.b},${a0})`);
                glow.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = glow;
                ctx.fillRect(0, 0, w, h);
            }

            // 4) 링: 선명한 선 대신 "부드러운 잔광" 느낌
            ctx.save();
            ctx.translate(cx, cy);

            for (let i = 0; i < ringCount; i++) {
                const r = i * ringSpacing + travel;

                // 너무 "기계적"이면 레이더 같으니 아주 약한 변조만
                const wave = 0.6 + 0.4 * Math.sin(tSec * 0.9 + i * 0.7);
                const alpha = intensity * lerp(0.05, 0.012, i / ringCount) * lerp(0.85, 1.15, wave);
                if (alpha <= 0.001) continue;

                const thickness = lerp(2.2, 1.0, i / ringCount) * (isMobile() ? 0.95 : 1.0);

                // 링을 2번 그려서 '잔광'처럼: 두꺼운 약한 선 + 얇은 조금 진한 선
                ctx.beginPath();
                ctx.arc(0, 0, r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${RING_RGB.r},${RING_RGB.g},${RING_RGB.b},${alpha * 0.55})`;
                ctx.lineWidth = thickness * 1.8;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(0, 0, r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${RING_RGB.r},${RING_RGB.g},${RING_RGB.b},${alpha})`;
                ctx.lineWidth = thickness;
                ctx.stroke();
            }

            ctx.restore();

            // 5) 끝으로 갈수록 BG로 덮어씌워 "완전 단색" 수렴
            ctx.fillStyle = `rgba(30,30,30,${fade})`;
            ctx.fillRect(0, 0, w, h);

            // 6) 비네팅은 끝에서 0으로 수렴 (끝이 더 어두워 보이는 문제 방지)
            const vignetteAlpha = lerp(0.18, 0.0, Math.pow(fade, 1.25));
            if (vignetteAlpha > 0.001) {
                const vignette = ctx.createRadialGradient(
                    w / 2,
                    h / 2,
                    h * 0.55,
                    w / 2,
                    h / 2,
                    h
                );
                vignette.addColorStop(0, 'rgba(0,0,0,0)');
                vignette.addColorStop(1, `rgba(0,0,0,${vignetteAlpha})`);
                ctx.fillStyle = vignette;
                ctx.fillRect(0, 0, w, h);
            }
        };

        const draw = (p: number, tSec: number) => {
            const rect = canvas.getBoundingClientRect();
            const w = Math.max(1, rect.width);
            const h = Math.max(1, rect.height);
            const maxTextWidth = Math.max(1, w - PADDING_X * 2);

            // phases
            const p1 = clamp01(p / O_FULL_AT);
            const scale = lerp(1, getZoomMax(), getZoomEase(p1));

            const p2 = clamp01((p - O_FULL_AT) / (1 - O_FULL_AT));
            const t2 = easeInOutCubic(p2);

            // fonts
            const headerSize = fitFontSize(header, Math.min(22, w * 0.04), maxTextWidth, 700);
            const line1Size = fitFontSize(line1, Math.min(56, w * 0.07), maxTextWidth, 800);
            // 아래 4줄 기본 폰트: PC에서만 더 크게
            const subBase = isMobile()
                ? Math.min(18, w * 0.03)
                : Math.min(24, w * 0.022); // PC: 상한 24px, 화면에 따라 자연 증가


            const s1Size = fitFontSize(s1, subBase, maxTextWidth, 600);
            const s2Size = fitFontSize(s2, subBase, maxTextWidth, 600);
            const s3Size = fitFontSize(s3, subBase, maxTextWidth, 600);
            const s4Size = fitFontSize(s4, subBase, maxTextWidth, 600);

            ctx.textBaseline = 'middle';

            // spacing
            const headerToLine1 = isMobile() ? h * 0.045 : h * 0.055;
            const line1ToSubs = isMobile() ? h * 0.06 : h * 0.095;
            const subGap = isMobile() ? h * 0.022 : h * 0.032;

            // Y
            const line1Y = h * 0.46;
            const headerY = line1Y - headerToLine1;

            const s1Y = line1Y + line1ToSubs;
            const s2Y = s1Y + subGap;
            const s3Y = s2Y + subGap * 1.6;
            const s4Y = s3Y + subGap;

            // centerX helper
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

            // O center
            ctx.font = `800 ${line1Size}px ${FONT_FAMILY}`;
            const beforeO = 'Experience Em';
            const oW = ctx.measureText('O').width;
            const oCenterX = line1X + ctx.measureText(beforeO).width + oW / 2;
            const oCenterY = line1Y;

            // background
            drawWarmRippleBackground(w, h, p2, tSec, oCenterX, oCenterY);

            // text group alpha
            const groupAlpha = p2 <= 0 ? 1 : lerp(1, 0, t2);

            // draw zoom block
            ctx.save();
            ctx.globalAlpha = groupAlpha;
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

            // with AI 오래 유지: 일찍 등장 + 계속 유지
            const appearStart = 0.12;
            const appearEnd = 0.45;
            const aiIn = clamp01((p2 - appearStart) / (appearEnd - appearStart));
            const aiAlpha = easeInOutCubic(aiIn);

            if (aiAlpha > 0.001) {
                const aiScale = lerp(0.98, 1.55, aiAlpha);
                const aiTargetPx = Math.max(18, w * 0.06) * aiScale;
                const aiSize = fitFontSize(withAI, aiTargetPx, maxTextWidth, 800);

                ctx.save();
                ctx.globalAlpha = aiAlpha;
                ctx.fillStyle = FG;
                ctx.font = `800 ${aiSize}px ${FONT_FAMILY}`;
                ctx.fillText(withAI, centerX(withAI, aiSize, 800), h * 0.62);
                ctx.restore();
            }
        };

        const updateProgress = () => {
            latestP = getProgressInSection();
        };

        const tick = (ms: number) => {
            if (!lastT) lastT = ms;
            const dt = Math.min(0.05, (ms - lastT) / 1000);
            lastT = ms;
            time += dt;

            draw(latestP, time);
            rafId = window.requestAnimationFrame(tick);
        };

        const onScroll = () => {
            updateProgress();
            draw(latestP, time);
        };

        const onResize = () => {
            setCanvasSize();
            updateProgress();
            draw(latestP, time);
        };

        const onVhResize = () => {
            setCanvasSize();
            updateProgress();
            draw(latestP, time);
        };

        const start = async () => {
            try {
                // @ts-ignore
                if (document?.fonts?.ready) await document.fonts.ready;
            } catch {}

            setCanvasSize();
            updateProgress();
            draw(latestP, time);

            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onResize);

            if (window.visualViewport) {
                window.visualViewport.addEventListener('resize', onVhResize);
                window.visualViewport.addEventListener('scroll', onVhResize);
            }

            rafId = window.requestAnimationFrame(tick);
        };

        start();

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);

            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', onVhResize);
                window.visualViewport.removeEventListener('scroll', onVhResize);
            }

            if (rafId) window.cancelAnimationFrame(rafId);
        };
    }, [s1, s2, s3, s4]);

    return (
        <section ref={sectionRef} style={{ height: '300vh', background: BG }}>
            <div style={{ position: 'sticky', top: 0, height: '100vh' }}>
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            </div>
        </section>
    );
};
