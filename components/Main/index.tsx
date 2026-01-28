'use client';

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

    // ✅ Vision: 자리(slot) + 실제 보이는(inner)  (inner는 반드시 slot 안에!)
    // const visionSlotRef = useRef<HTMLDivElement | null>(null);
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
        // const slot = visionSlotRef.current;
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
        // 타임라인(0~1) (너 원본 유지)
        // ======================================================
        const Z1_END = 0.58;
        const WITH_START = 0.22;
        const WITH_END = 0.6;
        const APPEAR_RATIO = 0.25;
        const PHASE3_START = WITH_START + (WITH_END - WITH_START) * APPEAR_RATIO;


        // fixed에서 목표 top(12rem)을 px로 고정 계산
        const getRem = () => {
            const fs = parseFloat(getComputedStyle(document.documentElement).fontSize || '16');
            return Number.isFinite(fs) ? fs : 16;
        };

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

        const easeInQuint = (tt: number) => Math.pow(tt, 5);
        // const accel2 = (tt: number) => {
        //     const t = clamp01(tt);
        //     const k = 0.45;
        //     if (t < k) {
        //         const a = t / k;
        //         return 0.22 * easeInQuint(a);
        //     } else {
        //         const b = (t - k) / (1 - k);
        //         return 0.22 + 0.78 * easeOutCubic(b);
        //
        //     }
        // };
        const accel2 = (tt: number) => {
            const t = clamp01(tt);
            return Math.pow(easeOutCubic(t), 1.45); // ✅ 더 느리게 (1.2~1.8 사이로 조절)
        };

        // “초반 진짜 느리게 → 점점 가속 → 마지막엔 일반속도처럼”

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
            console.log('canvas rect', canvas.getBoundingClientRect());
            console.log('canvas size', canvas.width, canvas.height);

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
// ✅ Vision Phase4 (slot 없이) : fixed → absolute 전환 + heroSection 겹침 방지(padding-bottom 보정)
// ======================================================

// rem → px
        const getRemPx = () => {
            const fs = parseFloat(getComputedStyle(document.documentElement).fontSize || '16');
            return Number.isFinite(fs) ? fs : 16;
        };

        const isMobileNow = () => window.innerWidth < 769;

// ✅ 목표 fixed top: PC 12rem / 모바일 6rem
        const FIXED_TOP_PX = () => (isMobileNow() ? 6 : 12) * getRemPx();

// ✅ 겹침 방지 여유: +2rem
        const EXTRA_GAP_PX = () => 2 * getRemPx();

// 상태
        let pinned = false;
        let pinnedTopInSection = 0;

// ✅ heroSection 겹침 방지: margin-bottom 계산
        const setHeroMarginBottom = (px: number) => {
            section.style.marginBottom = `${Math.ceil(Math.max(0, px))}px`;
        };

        const resetHeroMarginBottom = () => {
            section.style.marginBottom = '0px';
        };

// ✅ "Vision이 fixed top(12rem/6rem)에 있는 상태"에서 필요한 margin-bottom 계산
        const computeNeededMarginBottom = () => {
            // heroSection 문서상 bottom
            const heroBottomDoc = window.scrollY + section.getBoundingClientRect().bottom;

            // vision bottom은 "fixed 위치" 기준으로 계산하는 게 제일 안정적임
            // (= absolute 전환 후 rect가 흔들리지 않게)
            const innerRect = inner.getBoundingClientRect();
            const visionBottomDoc = window.scrollY + innerRect.bottom;

            const extra = visionBottomDoc - heroBottomDoc + EXTRA_GAP_PX();
            return Math.max(0, extra);
        };


        const applyFixed = (yPx: number, opacity: number) => {
            // fixed 상태에서는 문서 흐름에 참여 안 하므로, 겹침 보정은 꺼둠
            pinned = false;
            resetHeroMarginBottom();

            inner.style.position = 'fixed';
            inner.style.left = '50%';
            inner.style.top = `${FIXED_TOP_PX()}px`;
            inner.style.transform = `translateX(-50%) translateY(${yPx}px)`;
            inner.style.opacity = String(opacity);
            inner.style.pointerEvents = opacity > 0.98 ? 'auto' : 'none';
        };

// ✅ fixed(현재 화면상 위치) → section 기준 absolute top으로 "그대로" 옮김 (튐 방지)
        const pinAbsoluteAtCurrentVisualPos = () => {
            const secRect = section.getBoundingClientRect();
            const innerRect = inner.getBoundingClientRect();

            const secDocTop = window.scrollY + secRect.top;
            const innerDocTop = window.scrollY + innerRect.top;

            pinnedTopInSection = innerDocTop - secDocTop;
            pinned = true;

            inner.style.position = 'absolute';
            inner.style.left = '50%';
            inner.style.top = `${pinnedTopInSection}px`;
            inner.style.transform = `translateX(-50%) translateY(0px)`;
            inner.style.opacity = '1';
            inner.style.pointerEvents = 'auto';

            // ✅ 여기서 margin-bottom 확정 (1프레임 뒤에 측정)
            requestAnimationFrame(() => {
                const mb = computeNeededMarginBottom();
                setHeroMarginBottom(mb);
            });
        };

        // ✅ pinned 상태에서 레이아웃 변화/리사이즈에도 겹침 방지 재계산
        const refreshPinnedLayout = () => {
            if (!pinned) return;
            // absolute top은 고정하되, padding-bottom은 계속 최신화
            const mb = computeNeededMarginBottom();
            setHeroMarginBottom(mb);
        };

        // ======================================================
        // ✅ Phase4 타이밍/움직임 파라미터
        // ======================================================
        const SHOW_START = 0.30; // 필요하면 조절
        const MOVE_END = 0.992;
        const START_VH = 65;     // 시작이 너무 아래면 55~65 추천

        // “초반 진짜 느리게 → 점점 가속”
        // 느리게 시작 → 점점 가속
        const slowToFast = (t: number) => {
            t = clamp01(t);
            return Math.pow(t, 5); // ← 이게 딱 기본형
        };



        // ======================================================
        // ✅ updateVision (onScroll/onResize에서 호출)
        // ======================================================
        const updateVision = () => {
            const p = latestP;

            // Phase4 시작 전: 아래에서 대기(완전 숨김)
            if (p < SHOW_START) {
                applyFixed((START_VH / 100) * window.innerHeight, 0);
                return;
            }

            // Phase4 종료: absolute로 고정 + padding-bottom 보정 유지
            if (p >= MOVE_END) {
                if (!pinned) pinAbsoluteAtCurrentVisualPos();
                else refreshPinnedLayout();
                return;
            }

            // Phase4 진행 중: fixed로 천천히 올라오다가 가속
            const END_REACH = 1;

            const t01 = clamp01((p - SHOW_START) / (MOVE_END - SHOW_START));
            const eased = END_REACH * slowToFast(t01);

            const startPx = (START_VH / 100) * window.innerHeight;
            const yPx = startPx * (1 - eased);

            // opacity는 너무 늦으면 안 보이니 적당히 빠르게
            const op = clamp01(Math.pow(t01, 2.2) * 1.15);

            applyFixed(yPx, op);
        };


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

        const onScroll = () => {
            updateProgress();
            updateVision();
        };

        const onResize = () => {
            setCanvasSize();
            updateProgress();
            updateVision();
            draw(animP, time, latestP);
            refreshPinnedLayout();

        };

        const onVhResize = () => {
            setCanvasSize();
            updateProgress();
            updateVision();
            draw(animP, time, latestP);
            refreshPinnedLayout();

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

            {/* ✅ 문서 흐름 자리(레이아웃 공간). inner는 반드시 이 안에 들어가야 absolute가 정상 */}
            <div ref={visionInnerRef} className={styles.vision}>
                <Vision />
            </div>
        </section>
    );
};
