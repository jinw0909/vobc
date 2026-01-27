'use client';

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

    // ✅ Vision: slot(레이아웃 자리) + inner(fixed/relative 전환)
    const visionRef = useRef<HTMLDivElement | null>(null);

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

        const FONT_FAMILY = `
          "Noto Serif KR",
          "Noto Serif JP",
          "Noto Serif SC",
          "Noto Serif TC",
          "Times New Roman",
          serif
        `;

        const header = 'VOB 1.0 Smart Trading';
        const line1 = 'Experience EmOtion-Free Trading';
        const withVOB = 'with VOB';

        // ======================================================
        // 타임라인(0~1)
        // 1) Emotion O 줌: 0 ~ Z1_END
        // 2) withVOB 등장(오버랩) + 배경/파동 전환
        // 3) VOB의 O 줌: PHASE3_START ~ 1
        // ======================================================
        const Z1_END = 0.58;

        // ✅ withVOB 더 빨리
        const WITH_START = 0.22;
        // 전환 구간의 "총 길이"(배경/파동이 다 바뀌는 끝)
        const WITH_END = 0.6;

        // ✅ withVOB는 전환 구간의 일부(APPEAR_RATIO)만에 "최대치" 도달
        //    최대치 도달 순간 바로 Phase3(= O 줌) 시작
        const APPEAR_RATIO = 0.4;
        const PHASE3_START = WITH_START + (WITH_END - WITH_START) * APPEAR_RATIO;

        // ✅ (중요) Phase1 후반부터 "파란 배경이 스며들기" 시작하는 지점
        const CROSS_START = Z1_END - 0.12;



        const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
        const lerp = (a: number, b: number, tt: number) => a + (b - a) * tt;

        const isMobile = () => window.innerWidth < 769;
        const getZoomMax = () => (isMobile() ? 52 : 70);

        const easeOutCubic = (tt: number) => 1 - Math.pow(1 - tt, 3);
        const easeInOutCubic = (tt: number) =>
            tt < 0.5 ? 4 * tt * tt * tt : 1 - Math.pow(-2 * tt + 2, 3) / 2;

        // 초반 매우 느림 → 중반 이후 급가속 (Phase3 확대용)
        const easeInQuint = (tt: number) => Math.pow(tt, 5);
        const accel2 = (tt: number) => {
            const t = clamp01(tt);
            const k = 0.45; // 전환 지점 (낮출수록 더 빨리 가속)
            if (t < k) {
                const a = t / k;
                return 0.22 * easeInQuint(a);
            } else {
                const b = (t - k) / (1 - k);
                return 0.22 + 0.78 * easeOutCubic(b);
            }
        };

        const getZoomEase = (tt: number) =>
            isMobile() ? Math.pow(easeOutCubic(tt), 2.2) : easeOutCubic(tt);

        let dpr = window.devicePixelRatio || 1;

        let rafId: number | null = null;
        let lastT = 0;
        let time = 0;

        // 실제 스크롤 progress
        let latestP = 0;

        // ✅ 애니메이션 progress(느리게 따라감) - 캔버스용
        let animP = 0;

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

            const pA = p;              // ✅ 애니메이션(느리게 따라감): 텍스트 줌/알파용
            const pR = pReal ?? p;     // ✅ 실제 스크롤(즉시 반영): 배경/파동/컷용

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
            const WITH_MAX_SCALE = 1.22;
            const withMaxSize = fitFontSize(withVOB, withBasePx * WITH_MAX_SCALE, maxTextWidth, 800);

            const smoothstep = (a: number, b: number, x: number) => {
                const t = clamp01((x - a) / (b - a));
                return t * t * (3 - 2 * t);
            };
            const lerpInt = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

            // ===============================
            // ✅ 타임라인 (배경/파동은 pR 기준)
            // ===============================

            // 1) 노란 파동: 0 ~ WITH_START 동안만 서서히 감소, WITH_START부터 0 고정
            const tY = clamp01(pR / WITH_START); // 0~1
            const yellowMul = pR >= WITH_START ? 0 : Math.pow(1 - tY, 1.6);

            // 2) 배경(파란 기운): 0 ~ WITH_START 사이에 완료, phase3에서 다시 BG로 복귀
            const BLUE_START = 0.02; // 더 빨리 파랑 깔고 싶으면 0
            const blueIn = smoothstep(BLUE_START, WITH_START, pR); // 0->1
            const blueOut = smoothstep(PHASE3_START, 1, pR);       // 0->1
            const blueHold = blueIn * (1 - blueOut);               // 0->1->0

            // BG(30,30,30) ↔ BG2_BASE(14,22,26) 블렌딩(과하게 파랗게 안 보이게)
            const baseR = lerpInt(30, BG2_BASE.r, blueHold);
            const baseG = lerpInt(30, BG2_BASE.g, blueHold);
            const baseB = lerpInt(30, BG2_BASE.b, blueHold);

            // 3) 파란 파동: phase2(withVOB 등장 구간)에서 등장, phase3에서 소멸
            const cyanIn = smoothstep(WITH_START, PHASE3_START, pR);
            const cyanMul = cyanIn * (1 - blueOut);

            // withVOB 등장(알파/스케일): WITH_START~PHASE3_START
            const appearRaw = clamp01((pA - WITH_START) / (PHASE3_START - WITH_START));
            const appear = easeOutCubic(appearRaw);

            const appearScale = lerp(0.55, WITH_MAX_SCALE, appear);
            const withSize = fitFontSize(withVOB, withBasePx * appearScale, maxTextWidth, 800);

            // ✅ Phase3는 "등장 완료 순간"부터 시작
            const isPhase3 = pA >= PHASE3_START;

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

            // ✅ "기본 배경" 자체를 블렌딩해서 깔기 (phase1 끝에서 검정으로 떨어지는 느낌 방지)
            ctx.fillStyle = `rgba(${baseR},${baseG},${baseB},1)`;
            ctx.fillRect(0, 0, w, h);

            // ✅ phase2 시작(WITH_START) 전까지만 노란 파동을 그리고, 시작부터 점점 옅어짐
            if (pR < WITH_START && yellowMul > 0.001) {
                drawRipple({
                    w, h,
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

            // ✅ 파란 파동 (phase2에서 등장 → phase3에서 소멸)
            if (cyanMul > 0.0001) {
                if (withStartTime == null) withStartTime = tSec;
                const localT2 = tSec - withStartTime;

                const waveK = Math.pow(cyanMul, 1.6);

                drawRipple({
                    w, h,
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

            // ============== 텍스트 렌더 ==============
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

            // ============== Phase3: VOB의 O 줌 ==============
            if (isPhase3) {
                const z3A = clamp01((pA - PHASE3_START) / (1 - PHASE3_START)); // 줌/텍스트
                const z3R = clamp01((pR - PHASE3_START) / (1 - PHASE3_START)); // 배경/파동

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
                        w, h,
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

        const updateProgress = () => {
            latestP = getProgressInSection();
        };

        const updateVision = () => {
            const el = visionRef.current;
            const section = sectionRef.current;
            if (!el || !section) return;

            const rect = section.getBoundingClientRect();
            const vh = window.innerHeight;

            // hero 섹션 progress (0~1)
            const scrollable = rect.height - vh;
            const progress =
                scrollable <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / scrollable));

            // ===== opacity =====
            const FADE_START = 0.7;
            const FADE_END = 0.95;

            let opacity = 0;
            if (progress > FADE_START) {
                opacity = Math.min(1, (progress - FADE_START) / (FADE_END - FADE_START));
            }

            el.style.opacity = String(opacity);
            el.style.pointerEvents = opacity > 0.95 ? 'auto' : 'none';

            // ===== position switching =====
            const shouldUnfix = rect.bottom <= vh;

            // ============================
            // FIXED 상태
            // ============================
            if (!shouldUnfix) {

                const isMobile = window.innerWidth < 768;

                el.style.position = 'fixed';
                el.style.left = '50%';
                el.style.top = isMobile ? '8rem' : '12rem';
                el.style.transform = 'translateX(-50%)';
                el.style.right = '';
                el.style.bottom = '';

                // ✅ 중요: fixed 상태에서는 margin 제거
                section.style.marginBottom = '0px';

                return;
            }

            // ============================
            // ABSOLUTE 상태
            // ============================

            // 1️⃣ 현재 화면에서의 Vision 위치
            const elRect = el.getBoundingClientRect();

            // 2️⃣ heroSection의 문서 좌표
            const heroTop = window.scrollY + rect.top;

            // 3️⃣ Vision의 문서 좌표
            const visionTop = window.scrollY + elRect.top;

            // 4️⃣ section 기준 absolute top
            const topInSection = visionTop - heroTop;

            el.style.position = 'absolute';
            el.style.left = '50%';
            el.style.transform = 'translateX(-50%)';
            el.style.top = `${topInSection}px`;
            el.style.right = '';
            el.style.bottom = '';


            // ✅ 뷰포트 기준 겹침 계산 (안 튐)
            const overlap = elRect.bottom - rect.bottom; // 둘 다 viewport 기준
            const extra = Math.max(0, overlap + 32);
            section.style.marginBottom = `${extra}px`;
        };




        const tick = (ms: number) => {
            if (!lastT) lastT = ms;
            const dt = Math.min(0.05, (ms - lastT) / 1000);
            lastT = ms;
            time += dt;

            // ✅ 스크롤 진행도를 "느리게" 따라가는 애니메이션 progress (캔버스용)
            const FOLLOW = isMobile() ? 12 : 7;
            animP += (latestP - animP) * (1 - Math.exp(-FOLLOW * dt));

            draw(animP, time, latestP);
            rafId = window.requestAnimationFrame(tick);
        };

        const onScroll = () => {
            updateProgress();
            updateVision();
        }

        const onResize = () => {
            setCanvasSize();
            updateProgress();
            updateVision();
            draw(animP, time, latestP);
        };

        const onVhResize = () => {
            setCanvasSize();
            updateProgress();
            draw(animP, time, latestP);
        };

        const start = async () => {
            try {
                // @ts-ignore
                if (document?.fonts?.ready) await document.fonts.ready;
            } catch {}

            setCanvasSize();
            updateProgress();

            animP = latestP; // 시작 시점 점프 방지
            draw(animP, time, latestP);

            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onResize);

            if (window.visualViewport) {
                window.visualViewport.addEventListener('resize', onVhResize);
                window.visualViewport.addEventListener('scroll', onVhResize);
            }

            rafId = window.requestAnimationFrame(tick);
        };

        start();
        updateVision();

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
        <section ref={sectionRef} className={styles.heroSection} style={{ background: BG }}>
            <div style={{ position: 'sticky', top: 0, height: '100vh' }}>
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            </div>

            {/* ✅ Vision이 지나갈 자리(레이아웃 공간 확보) */}
            <div ref={visionRef} className={styles.vision}>
                <Vision />
            </div>
        </section>
    );
};
