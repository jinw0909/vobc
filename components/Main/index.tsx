'use client';

import { layouts } from 'chart.js';

console.log('Main module loaded');

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import styles from './styles.module.css';
import { Vision } from '@/components/Vision';

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

    const visionInnerRef = useRef<HTMLDivElement | null>(null);

    const s1 = t('line1');
    const s2 = t('line2');
    const s3 = t('line3');
    const s4 = t('line4');

    useEffect(() => {
        console.log('effect entered');
        console.log('refs', {
            section: !!sectionRef.current,
            canvas: !!canvasRef.current,
            inner: !!visionInnerRef.current,
        });

        const section = sectionRef.current;
        const canvas = canvasRef.current;
        const inner = visionInnerRef.current;
        if (!section || !canvas || !inner) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const FONT_FAMILY = `
          "Noto Serif KR","Noto Serif JP","Noto Serif SC","Noto Serif TC","Times New Roman",serif
        `;

        const header = 'VOB 1.0 Smart Trading';
        const line1 = 'Experience EmOtion-Free Trading';
        const withVOB = 'with VOB';

        // ======================================================
        // 타임라인(0~1) (원본 유지)
        // ======================================================
        const Z1_END = 0.58;
        const WITH_START = 0.22;
        const WITH_END = 0.6;
        const APPEAR_RATIO = 0.25;
        const PHASE3_START = WITH_START + (WITH_END - WITH_START) * APPEAR_RATIO;

        // ======================================================
        // 공통 유틸
        // ======================================================
        const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
        const lerp = (a: number, b: number, tt: number) => a + (b - a) * tt;

        const isMobile = () => window.innerWidth < 769;
        const getZoomMax = () => (isMobile() ? 52 : 70);

        const easeOutCubic = (tt: number) => 1 - Math.pow(1 - tt, 3);
        const easeInOutCubic = (tt: number) =>
            tt < 0.5 ? 4 * tt * tt * tt : 1 - Math.pow(-2 * tt + 2, 3) / 2;

        const accel2 = (tt: number) => {
            const t = clamp01(tt);
            return Math.pow(easeOutCubic(t), 1.45);
        };

        const getZoomEase = (tt: number) =>
            isMobile() ? Math.pow(easeOutCubic(tt), 2.2) : easeOutCubic(tt);

        // ======================================================
        // Canvas state
        // ======================================================
        let dpr = window.devicePixelRatio || 1;

        let rafId: number | null = null;
        let lastT = 0;
        let time = 0;

        let latestP = 0;
        let animP = 0;
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
                const alpha = intensity * lerp(0.055, 0.012, i / ringCount) * lerp(0.85, 1.15, wave);
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

        const draw = (p: number, tSec: number, pReal?: number) => {
            const rect = canvas.getBoundingClientRect();
            const w = Math.max(1, rect.width);
            const h = Math.max(1, rect.height);
            const maxTextWidth = Math.max(1, w - PADDING_X * 2);

            const pA = p;
            const pR = pReal ?? p;

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

            ctx.font = `800 ${line1Size}px ${FONT_FAMILY}`;
            const beforeO1 = 'Experience Em';
            const oW1 = ctx.measureText('O').width;
            const oCenterX1 = line1X + ctx.measureText(beforeO1).width + oW1 / 2;
            const oCenterY1 = line1Y;

            const withBasePx = Math.max(18, w * 0.06);
            const WITH_MAX_SCALE = 1.22;
            const withMaxSize = fitFontSize(withVOB, withBasePx * WITH_MAX_SCALE, maxTextWidth, 800);

            const smoothstep = (a: number, b: number, x: number) => {
                const t = clamp01((x - a) / (b - a));
                return t * t * (3 - 2 * t);
            };
            const lerpInt = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

            const tY = clamp01(pR / WITH_START);
            const yellowMul = pR >= WITH_START ? 0 : Math.pow(1 - tY, 1.6);

            const BLUE_START = 0.02;
            const blueIn = smoothstep(BLUE_START, WITH_START, pR);
            const blueOut = smoothstep(PHASE3_START, 1, pR);
            const blueHold = blueIn * (1 - blueOut);

            const baseR = lerpInt(30, BG2_BASE.r, blueHold);
            const baseG = lerpInt(30, BG2_BASE.g, blueHold);
            const baseB = lerpInt(30, BG2_BASE.b, blueHold);

            const cyanIn = smoothstep(WITH_START, PHASE3_START, pR);
            const cyanMul = cyanIn * (1 - blueOut);

            const appearRaw = clamp01((pA - WITH_START) / (PHASE3_START - WITH_START));
            const appear = easeOutCubic(appearRaw);

            const appearScale = lerp(0.55, WITH_MAX_SCALE, appear);
            const withSize = fitFontSize(withVOB, withBasePx * appearScale, maxTextWidth, 800);

            const isPhase3 = pA >= PHASE3_START;

            ctx.font = `800 ${withSize}px ${FONT_FAMILY}`;
            const withW = ctx.measureText(withVOB).width;
            const withX = oCenterX1 - withW / 2;
            const withY = oCenterY1;

            const beforeO2 = 'with V';
            const oW2 = ctx.measureText('O').width;
            const oCenterX2 = withX + ctx.measureText(beforeO2).width + oW2 / 2;
            const oCenterY2 = withY;

            ctx.fillStyle = `rgba(${baseR},${baseG},${baseB},1)`;
            ctx.fillRect(0, 0, w, h);

            if (pR < WITH_START && yellowMul > 0.001) {
                drawRipple({
                    w,
                    h,
                    fade: 0.0,
                    localT: tSec,
                    cx: oCenterX1,
                    cy: oCenterY1,
                    baseColor: 'transparent',
                    tint: TINT1_RGB,
                    ring: RING1_RGB,
                    settleToBG: false,
                    intensityMul: yellowMul,
                });
            }

            if (cyanMul > 0.0001) {
                if (withStartTime == null) withStartTime = tSec;
                const localT2 = tSec - withStartTime;
                const waveK = Math.pow(cyanMul, 1.6);

                drawRipple({
                    w,
                    h,
                    fade: lerp(0.0, 0.12, cyanMul),
                    localT: localT2,
                    cx: oCenterX2,
                    cy: oCenterY2,
                    baseColor: 'transparent',
                    tint: TINT2_RGB,
                    ring: RING2_RGB,
                    settleToBG: false,
                    intensityMul: waveK,
                });
            } else {
                withStartTime = null;
            }

            const z1 = clamp01(pA / Z1_END);
            const scale1 = lerp(1, getZoomMax(), getZoomEase(z1));

            let groupAlpha = lerp(1, 0, easeInOutCubic(z1));
            if (pA >= WITH_START) groupAlpha *= 1 - appear;

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

            if (pA >= WITH_START && pA < PHASE3_START) {
                ctx.save();
                ctx.globalAlpha = appear;
                ctx.fillStyle = FG;
                ctx.font = `800 ${withSize}px ${FONT_FAMILY}`;
                ctx.fillText(withVOB, withX, withY);
                ctx.restore();
            }

            if (isPhase3) {
                const z3A = clamp01((pA - PHASE3_START) / (1 - PHASE3_START));
                const z3R = clamp01((pR - PHASE3_START) / (1 - PHASE3_START));

                const SCALE_END = 0.78;
                const zScale = clamp01(z3A / SCALE_END);
                const zFade = clamp01((z3R - SCALE_END) / (1 - SCALE_END));

                const scale2 = lerp(1, getZoomMax(), accel2(zScale));
                const textAlpha = 1 - easeInOutCubic(zFade);

                const bgFade = easeInOutCubic(clamp01(z3R / 0.7));
                ctx.fillStyle = `rgba(30,30,30,${bgFade})`;
                ctx.fillRect(0, 0, w, h);

                ctx.font = `800 ${withMaxSize}px ${FONT_FAMILY}`;
                const withWMax = ctx.measureText(withVOB).width;
                const withXMax = oCenterX1 - withWMax / 2;
                const withYMax = oCenterY1;

                const beforeO2b = 'with V';
                const oW2b = ctx.measureText('O').width;
                const oCenterX2b = withXMax + ctx.measureText(beforeO2b).width + oW2b / 2;
                const oCenterY2b = withYMax;

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

                const f = easeInOutCubic(zFade);
                if (f > 0.001) {
                    ctx.fillStyle = `rgba(30,30,30,${f})`;
                    ctx.fillRect(0, 0, w, h);
                }
            }
        };

        // ======================================================
        // ✅ Vision Phase4 — margin 관련만 “안 튀게” 개선
        //    - pinned(absolute)일 때만 overflow 기반 marginBottom 계산
        //    - unpin(absolute→fixed) 순간 marginBottom을 바로 줄이지 않고
        //      이전 pinned margin을 잠깐 유지했다가(hold) 안전 구간에서 32px로 복귀
        // ======================================================

        const getRemPx = () => {
            const fs = parseFloat(getComputedStyle(document.documentElement).fontSize || '16');
            return Number.isFinite(fs) ? fs : 16;
        };
        const isMobileNow = () => window.innerWidth < 769;

        // ✅ 모바일 8rem / PC 12rem (너 요구 반영)
        const FIXED_TOP_PX = () => (isMobileNow() ? 0 : 0) * getRemPx();

        const START_VH = 70;
        const START_PX = () => (START_VH / 100) * window.innerHeight;

        const SHOW_START = 0.5;
        const SHOW_END = 1.0;

        let pinned = false;

        const EXTRA_PX = 32;

        // ✅ marginBottom 튐 방지용 상태
        let lastPinnedMB = EXTRA_PX;
        let holdMargin = false;


        const applyHeroMarginBottom = () => {
            if (!pinned) {
                // ✅ fixed(또는 pinned 아님)일 때는 margin을 0으로
                section.style.marginBottom = `0px`;
                return;
            }

            // ✅ pinned(absolute)일 때만: (vision.bottom - section.bottom) + 32
            const secRect = section.getBoundingClientRect();
            const innerRect = inner.getBoundingClientRect();
            const overflow = Math.max(0, innerRect.bottom - secRect.bottom);

            section.style.marginBottom = `${Math.ceil(overflow + EXTRA_PX)}px`;
        };


        const applyFixed = (yPx: number, opacity: number) => {
            inner.style.removeProperty('bottom');
            inner.style.removeProperty('right');

            inner.style.position = 'fixed';
            inner.style.left = '50%';
            inner.style.top = `${FIXED_TOP_PX()}px`;
            inner.style.transform = `translateX(-50%) translateY(${yPx}px)`;
            inner.style.opacity = String(opacity);
            inner.style.pointerEvents = opacity > 0.98 ? 'auto' : 'none';
        };

        const pinAbsolute = () => {
            if (pinned) return;
            pinned = true;

            const secRect = section.getBoundingClientRect();
            const innerRect = inner.getBoundingClientRect();
            const topInSection = innerRect.top - secRect.top;

            inner.style.removeProperty('position');
            inner.style.removeProperty('top');
            inner.style.removeProperty('left');
            inner.style.removeProperty('transform');

            inner.style.position = 'absolute';
            inner.style.left = '50%';
            inner.style.top = `${Math.round(topInSection)}px`;
            inner.style.transform = 'translateX(-50%)';
            inner.style.opacity = '1';
            inner.style.pointerEvents = 'auto';

            applyHeroMarginBottom(); // ✅ pinned 계산
        };

        const easeInCubic = (t: number) => t * t * t;

        let skipFixedOnce = false;

        const updateVision = () => {
            const rect = section.getBoundingClientRect();
            const vh = window.innerHeight;

            const scrollable = rect.height - vh;
            if (scrollable <= 0) return;

            const p = clamp01(-rect.top / scrollable);

            // ✅ pinned(absolute) 상태에서: 실제 top 기준으로 unpin
            if (pinned) {
                const targetTop = FIXED_TOP_PX();
                const nowTop = inner.getBoundingClientRect().top;

                const EPS = 2;
                const shouldUnpin = nowTop >= targetTop + EPS;

                if (shouldUnpin) {
                    pinned = false;

                    // ✅ unpin 순간 margin을 바로 줄이지 않고 “잠깐 유지”
                    holdMargin = true;

                    inner.style.removeProperty('bottom');
                    inner.style.removeProperty('right');

                    inner.style.position = 'fixed';
                    inner.style.left = '50%';
                    inner.style.top = `${targetTop}px`;
                    inner.style.transform = `translateX(-50%) translateY(${nowTop - targetTop}px)`;
                    inner.style.opacity = '1';
                    inner.style.pointerEvents = 'auto';

                    applyHeroMarginBottom(); // ✅ holdMargin이라 lastPinnedMB 유지
                    skipFixedOnce = true;
                }

                return;
            }

            // ✅ unpin 직후 1회는 applyFixed로 덮어쓰지 않게
            if (skipFixedOnce) {
                skipFixedOnce = false;
                return;
            }

            if (p < SHOW_START) {
                applyFixed(START_PX(), 0);
                // ✅ 이 구간은 항상 32px만
                holdMargin = false;
                applyHeroMarginBottom();
                return;
            }

            const t01 = clamp01((p - SHOW_START) / (SHOW_END - SHOW_START));

            // ✅ 조금만 위로 올라오면(=fixed 구간 진입) margin을 32px로 복귀
            if (holdMargin && t01 < 0.92) {
                holdMargin = false;
                applyHeroMarginBottom();
            }

            const eased = easeInCubic(t01);
            const yPx = START_PX() * (1 - eased);
            const op = easeOutCubic(t01);

            applyFixed(yPx, op);
            if (!holdMargin) applyHeroMarginBottom(); // ✅ hold 중에는 건드리지 않음

            // ✅ 내려갈 때 absolute 전환 (기존 방식 유지)
            const reached = t01 >= 0.999 && op > 0.98;
            if (reached) {
                applyFixed(0, 1);
                requestAnimationFrame(() => {
                    pinAbsolute();
                    // pinAbsolute 내부에서 margin 계산함
                });
            }
        };

        // 초기 1회
        applyHeroMarginBottom();
        updateVision();

        // ======================================================
        // raf + events
        // ======================================================
        const updateProgress = () => {
            latestP = getProgressInSection();
        };

        const tick = (ms: number) => {
            if (!lastT) lastT = ms;
            const dt = Math.min(0.05, (ms - lastT) / 1000);
            lastT = ms;
            time += dt;

            const FOLLOW = isMobile() ? 12 : 7;
            animP += (latestP - animP) * (1 - Math.exp(-FOLLOW * dt));

            draw(animP, time, latestP);
            rafId = window.requestAnimationFrame(tick);
        };

        let pendingVision = false;
        const onScroll = () => {
            updateProgress();
            if (!pendingVision) {
                pendingVision = true;
                requestAnimationFrame(() => {
                    pendingVision = false;
                    updateVision();
                });
            }
        };

        const onResize = () => {
            setCanvasSize();
            updateProgress();
            updateVision();
            draw(animP, time, latestP);
        };

        const onVhResize = () => {
            setCanvasSize();
            updateProgress();
            updateVision();
            draw(animP, time, latestP);
        };

        const start = async () => {
            try {
                // @ts-ignore
                if (document?.fonts?.ready) await document.fonts.ready;
            } catch {}

            setCanvasSize();
            updateProgress();

            animP = latestP;
            draw(animP, time, latestP);

            updateVision();

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
            window.removeEventListener('scroll', onScroll as any);
            window.removeEventListener('resize', onResize as any);

            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', onVhResize as any);
                window.visualViewport.removeEventListener('scroll', onVhResize as any);
            }

            if (rafId) window.cancelAnimationFrame(rafId);
        };
    }, [s1, s2, s3, s4]);

    return (
        <section ref={sectionRef} className={styles.heroSection} style={{ background: BG }}>
            <div style={{ position: 'sticky', top: 0, height: '100vh' }}>
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            </div>

            <div ref={visionInnerRef} className={styles.vision}>
                <Vision />
            </div>
        </section>
    );
};
