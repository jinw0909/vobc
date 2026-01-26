'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

const BG = 'rgba(30, 30, 30, 1)';
const FG = '#fff';
const SUB_FG = 'rgba(255, 255, 255, 0.78)';
const PADDING_X = 24;

// Emotion(옐로)
const TINT1_RGB = { r: 0xf2, g: 0xe9, b: 0x7a };
const RING1_RGB = { r: 0xd9, g: 0xd0, b: 0x52 };

// with VOB(시안)
const TINT2_RGB = { r: 0x7a, g: 0xe2, b: 0xf2 };
const RING2_RGB = { r: 0x52, g: 0xc8, b: 0xd9 };

// 전환 배경(시안 기운)
const BG2_BASE = { r: 14, g: 22, b: 26 };

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
        const withVOB = 'with VOB';

        // ======================================================
        // 타임라인(0~1)
        // 1) Emotion O 줌: 0 ~ Z1_END
        // 2) withVOB 등장(오버랩) + 배경/파동 전환: WITH_START ~ ...
        // 3) VOB의 O 줌: PHASE3_START ~ 1
        // ======================================================
        const Z1_END = 0.58;

        // ✅ withVOB 더 빨리
        const WITH_START = 0.22;
        // 전환 구간의 "총 길이"(배경/파동이 다 바뀌는 끝)
        const WITH_END = 0.60;

        // ✅ withVOB는 전환 구간의 일부(APPEAR_RATIO)만에 "최대치" 도달
        //    최대치 도달 순간 바로 Phase3(= O 줌) 시작
        const APPEAR_RATIO = 0.40;
        const PHASE3_START = WITH_START + (WITH_END - WITH_START) * APPEAR_RATIO;

        const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
        const lerp = (a: number, b: number, tt: number) => a + (b - a) * tt;

        const isMobile = () => window.innerWidth < 769;
        const getZoomMax = () => (isMobile() ? 52 : 70);

        const easeOutCubic = (tt: number) => 1 - Math.pow(1 - tt, 3);
        const easeInOutCubic = (tt: number) =>
            tt < 0.5 ? 4 * tt * tt * tt : 1 - Math.pow(-2 * tt + 2, 3) / 2;

        const getZoomEase = (tt: number) =>
            isMobile() ? Math.pow(easeOutCubic(tt), 2.2) : easeOutCubic(tt);

        let dpr = window.devicePixelRatio || 1;

        let rafId: number | null = null;
        let lastT = 0;
        let time = 0;
        let latestP = 0;

        // 전환 파동 time reset
        let withStartTime: number | null = null;

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

        const drawRipple = (args: {
            w: number;
            h: number;
            fade: number;
            localT: number;
            cx: number;
            cy: number;
            baseColor: string | 'transparent';
            tint: { r: number; g: number; b: number };
            ring: { r: number; g: number; b: number };
            settleToBG: boolean;
            intensityMul?: number;
        }) => {
            const { w, h, fade, localT, cx, cy, baseColor, tint, ring, settleToBG } = args;
            const f = clamp01(fade);
            const intensityMul = args.intensityMul ?? 1;

            if (baseColor !== 'transparent') {
                ctx.fillStyle = baseColor;
                ctx.fillRect(0, 0, w, h);
            }

            const washA = 0.08 * Math.pow(1 - f, 0.9) * intensityMul;
            if (washA > 0.0005) {
                ctx.fillStyle = `rgba(${tint.r},${tint.g},${tint.b},${washA})`;
                ctx.fillRect(0, 0, w, h);
            }

            const maxR = Math.hypot(w, h) * 0.78;
            const ringCount = isMobile() ? 8 : 12;
            const ringSpacing = maxR / ringCount;

            const speed = isMobile() ? 110 : 140;
            const travel = (localT * speed) % ringSpacing;

            const baseIntensity = lerp(0.88, 0.0, Math.pow(f, 1.05));
            const intensity = baseIntensity * intensityMul;

            if (intensity > 0.01) {
                const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.65);
                const a0 = 0.16 * intensity;
                glow.addColorStop(0, `rgba(${tint.r},${tint.g},${tint.b},${a0})`);
                glow.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = glow;
                ctx.fillRect(0, 0, w, h);
            }

            ctx.save();
            ctx.translate(cx, cy);

            for (let i = 0; i < ringCount; i++) {
                const r = i * ringSpacing + travel;
                const wave = 0.6 + 0.4 * Math.sin(localT * 0.9 + i * 0.7);
                const alpha =
                    intensity * lerp(0.055, 0.012, i / ringCount) * lerp(0.85, 1.15, wave);

                if (alpha <= 0.001) continue;

                const thickness = lerp(2.2, 1.0, i / ringCount) * (isMobile() ? 0.95 : 1.0);

                ctx.beginPath();
                ctx.arc(0, 0, r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${ring.r},${ring.g},${ring.b},${alpha * 0.55})`;
                ctx.lineWidth = thickness * 1.8;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(0, 0, r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${ring.r},${ring.g},${ring.b},${alpha})`;
                ctx.lineWidth = thickness;
                ctx.stroke();
            }

            ctx.restore();

            if (settleToBG) {
                ctx.fillStyle = `rgba(30,30,30,${f})`;
                ctx.fillRect(0, 0, w, h);
            }
        };

        const draw = (p: number, tSec: number) => {
            const rect = canvas.getBoundingClientRect();
            const w = Math.max(1, rect.width);
            const h = Math.max(1, rect.height);
            const maxTextWidth = Math.max(1, w - PADDING_X * 2);

            // -------- layout(원문 기준) --------
            const headerSize = fitFontSize(header, Math.min(22, w * 0.04), maxTextWidth, 700);
            const line1Size = fitFontSize(line1, Math.min(56, w * 0.07), maxTextWidth, 800);

            const subBase = isMobile() ? Math.min(18, w * 0.03) : Math.min(24, w * 0.022);
            const s1Size = fitFontSize(s1, subBase, maxTextWidth, 600);
            const s2Size = fitFontSize(s2, subBase, maxTextWidth, 600);
            const s3Size = fitFontSize(s3, subBase, maxTextWidth, 600);
            const s4Size = fitFontSize(s4, subBase, maxTextWidth, 600);

            ctx.textBaseline = 'middle';

            const headerToLine1 = isMobile() ? h * 0.045 : h * 0.055;
            const line1ToSubs = isMobile() ? h * 0.06 : h * 0.095;
            const subGap = isMobile() ? h * 0.022 : h * 0.032;

            const line1Y = h * 0.46;
            const headerY = line1Y - headerToLine1;

            const s1Y = line1Y + line1ToSubs;
            const s2Y = s1Y + subGap;
            const s3Y = s2Y + subGap * 1.6;
            const s4Y = s3Y + subGap;

            const cx = (text: string, size: number, weight: number) => {
                ctx.font = `${weight} ${size}px ${FONT_FAMILY}`;
                return (w - ctx.measureText(text).width) / 2;
            };

            const headerX = cx(header, headerSize, 700);
            const line1X = cx(line1, line1Size, 800);
            const s1X = cx(s1, s1Size, 400);
            const s2X = cx(s2, s2Size, 400);
            const s3X = cx(s3, s3Size, 400);
            const s4X = cx(s4, s4Size, 400);

            // -------- Emotion의 O 중심(첫 파동 중심) --------
            ctx.font = `800 ${line1Size}px ${FONT_FAMILY}`;
            const beforeO1 = 'Experience Em';
            const oW1 = ctx.measureText('O').width;
            const oCenterX1 = line1X + ctx.measureText(beforeO1).width + oW1 / 2;
            const oCenterY1 = line1Y;

            // -------- withVOB(최대 크기) 기준 --------
            const withBasePx = Math.max(18, w * 0.06);
            const WITH_MAX_SCALE = 1.22; // 조금 더 크게
            const withMaxSize = fitFontSize(withVOB, withBasePx * WITH_MAX_SCALE, maxTextWidth, 800);

            // Phase2 전환 진행도(배경/파동): WITH_START~WITH_END
            const crossRaw = clamp01((p - WITH_START) / (WITH_END - WITH_START));
            const cross = easeInOutCubic(crossRaw);

            // withVOB 등장(알파/스케일): WITH_START~PHASE3_START (더 빨리 끝)
            const appearRaw = clamp01((p - WITH_START) / (PHASE3_START - WITH_START));
            const appear = easeOutCubic(appearRaw);

            const appearScale = lerp(0.55, WITH_MAX_SCALE, appear);
            const withSize = fitFontSize(withVOB, withBasePx * appearScale, maxTextWidth, 800);

            // ✅ Phase3는 "등장 완료 순간"부터 시작
            const isPhase3 = p >= PHASE3_START;

            // ✅ with VOB는 “첫 파동 중심”에서 등장 & 확대만 (X/Y 고정)
            ctx.font = `800 ${withSize}px ${FONT_FAMILY}`;
            const withW = ctx.measureText(withVOB).width;
            const withX = oCenterX1 - withW / 2;
            const withY = oCenterY1;

            // withVOB의 O 중심(새 파동 중심)
            const beforeO2 = 'with V';
            const oW2 = ctx.measureText('O').width;
            const oCenterX2 = withX + ctx.measureText(beforeO2).width + oW2 / 2;
            const oCenterY2 = withY;

            // ============== 배경/파동 렌더 ==============
            // 1) 기본: 옐로 배경/파동 (등장/전환에 따라 점점 약화)
            drawRipple({
                w,
                h,
                fade: 0.0,
                localT: tSec,
                cx: oCenterX1,
                cy: oCenterY1,
                baseColor: 'rgba(22,22,22,1)',
                tint: TINT1_RGB,
                ring: RING1_RGB,
                settleToBG: true,
                intensityMul: lerp(1, 0, cross),
            });

            // 2) 전환: 시안 배경 오버레이(서서히)
            if (cross > 0.0001) {
                ctx.fillStyle = `rgba(${BG2_BASE.r},${BG2_BASE.g},${BG2_BASE.b},${0.92 * cross})`;
                ctx.fillRect(0, 0, w, h);
            }

            // 3) 새 시안 파동(등장 시점부터, cross로 강도 증가)
            if (p >= WITH_START) {
                if (withStartTime == null) withStartTime = tSec;
                const localT2 = tSec - withStartTime;

                drawRipple({
                    w,
                    h,
                    fade: lerp(0.0, 0.12, cross),
                    localT: localT2,
                    cx: oCenterX2,
                    cy: oCenterY2,
                    baseColor: 'transparent',
                    tint: TINT2_RGB,
                    ring: RING2_RGB,
                    settleToBG: false,
                    intensityMul: cross,
                });
            } else {
                withStartTime = null;
            }

            // ============== 텍스트 렌더 ==============
            // Phase1 텍스트 줌(Emotion O)
            const z1 = clamp01(p / Z1_END);
            const scale1 = lerp(1, getZoomMax(), getZoomEase(z1));

            // ✅ 기존 문구는 appear가 커질수록 빠르게 죽여서 withVOB가 "빨리 보이게"
            let groupAlpha = lerp(1, 0, easeInOutCubic(z1));
            if (p >= WITH_START) groupAlpha *= 1 - appear;

            // Phase1(원문) - Phase3 시작 전까지만 그리기
            if (!isPhase3) {
                ctx.save();
                ctx.globalAlpha = groupAlpha;

                ctx.translate(oCenterX1, oCenterY1);
                ctx.scale(scale1, scale1);
                ctx.translate(-oCenterX1, -oCenterY1);

                ctx.fillStyle = FG;
                ctx.font = `700 ${headerSize}px ${FONT_FAMILY}`;
                ctx.fillText(header, headerX, headerY);

                ctx.font = `800 ${line1Size}px ${FONT_FAMILY}`;
                ctx.fillText(line1, line1X, line1Y);

                ctx.fillStyle = SUB_FG;
                ctx.font = `500 ${s1Size}px ${FONT_FAMILY}`;
                ctx.fillText(s1, s1X, s1Y);
                ctx.font = `500 ${s2Size}px ${FONT_FAMILY}`;
                ctx.fillText(s2, s2X, s2Y);
                ctx.font = `500 ${s3Size}px ${FONT_FAMILY}`;
                ctx.fillText(s3, s3X, s3Y);
                ctx.font = `500 ${s4Size}px ${FONT_FAMILY}`;
                ctx.fillText(s4, s4X, s4Y);

                ctx.restore();
                ctx.globalAlpha = 1;
            }

            // withVOB 텍스트: 등장 구간에서만 (PHASE3_START까지)
            if (p >= WITH_START && p < PHASE3_START) {
                ctx.save();
                ctx.globalAlpha = appear;
                ctx.fillStyle = FG;
                ctx.font = `800 ${withSize}px ${FONT_FAMILY}`;
                ctx.fillText(withVOB, withX, withY);
                ctx.restore();
            }

            // ============== Phase3: VOB의 O 줌(등장 완료 즉시 시작) ==============
            if (isPhase3) {
                // Phase3 진행도: PHASE3_START ~ 1
                const z3 = clamp01((p - PHASE3_START) / (1 - PHASE3_START));

                // 줌은 앞에 몰고, 끝에 짧게 페이드
                const SCALE_END = 0.78;
                const zScale = clamp01(z3 / SCALE_END);
                const zFade = clamp01((z3 - SCALE_END) / (1 - SCALE_END));

                const scale2 = lerp(1, getZoomMax(), getZoomEase(zScale));
                const textAlpha = 1 - easeInOutCubic(zFade);

                // ✅ 배경은 "시안톤 유지" -> "BG"로 서서히 수렴
                ctx.fillStyle = `rgba(${BG2_BASE.r},${BG2_BASE.g},${BG2_BASE.b},0.92)`;
                ctx.fillRect(0, 0, w, h);

                const bgFade = easeInOutCubic(clamp01(z3 / 0.7));
                ctx.fillStyle = `rgba(30,30,30,${bgFade})`;
                ctx.fillRect(0, 0, w, h);

                // Phase3에서 기준 withVOB는 "최대치"로 고정 (점프 방지)
                ctx.font = `800 ${withMaxSize}px ${FONT_FAMILY}`;
                const withWMax = ctx.measureText(withVOB).width;
                const withXMax = oCenterX1 - withWMax / 2;
                const withYMax = oCenterY1;

                // O 중심(최대 사이즈 기준)
                const beforeO2b = 'with V';
                const oW2b = ctx.measureText('O').width;
                const oCenterX2b = withXMax + ctx.measureText(beforeO2b).width + oW2b / 2;
                const oCenterY2b = withYMax;

                // (선택) Phase3 초반엔 파동 잔광을 아주 약하게 남김
                const rippleKeep = 1 - bgFade;
                if (rippleKeep > 0.02) {
                    const localT2 = withStartTime == null ? 0 : tSec - withStartTime;
                    drawRipple({
                        w,
                        h,
                        fade: 0.08,
                        localT: localT2,
                        cx: oCenterX2b,
                        cy: oCenterY2b,
                        baseColor: 'transparent',
                        tint: TINT2_RGB,
                        ring: RING2_RGB,
                        settleToBG: false,
                        intensityMul: rippleKeep * 0.55,
                    });
                }

                // 줌(앵커=O 중심)
                ctx.save();
                ctx.translate(oCenterX2b, oCenterY2b);
                ctx.scale(scale2, scale2);
                ctx.translate(-oCenterX2b, -oCenterY2b);

                if (textAlpha > 0.001) {
                    ctx.globalAlpha = textAlpha;
                    ctx.fillStyle = FG;
                    ctx.font = `800 ${withMaxSize}px ${FONT_FAMILY}`;
                    ctx.fillText(withVOB, withXMax, withYMax);
                }

                ctx.restore();
                ctx.globalAlpha = 1;

                // 마지막에 O/텍스트가 사라지며 BG로 자연스럽게
                const f = easeInOutCubic(zFade);
                if (f > 0.001) {
                    ctx.fillStyle = `rgba(30,30,30,${f})`;
                    ctx.fillRect(0, 0, w, h);
                }
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
        <section ref={sectionRef} style={{ height: '980vh', background: BG }}>
            <div style={{ position: 'sticky', top: 0, height: '100vh' }}>
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            </div>
        </section>
    );
};
