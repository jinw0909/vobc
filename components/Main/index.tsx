'use client';

import { layouts } from 'chart.js';

console.log('Main module loaded');

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import styles from './styles.module.css';
import { Vision } from '@/components/Vision';
import Image from "next/image";
import visionPic from "@/public/vision_white.png";
import blockPic from "@/public/blockchain_white.png";
import vobPic from "@/public/vob_crop.png";
import {NavigationLink} from "@/ui/NavigationLink";

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

    const visionSlotRef = useRef<HTMLDivElement | null>(null);
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
        // const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
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
// ✅ Vision Phase4 — fixed에서 "현재 elem" opacity 0.2→1
//    - pre/approach: opacity 0.2 유지
//    - fixed: stage elem이 스크롤로 0.2→1
//    - 1 되면 absolute(pin)로 풀고 자연 스크롤
//    - 다음 elem이 top12 닿으면 다시 fixed
//    - 역방향(올림)도 복귀
// ======================================================

        const getRemPx = () => {
            const fs = parseFloat(getComputedStyle(document.documentElement).fontSize || '16');
            return Number.isFinite(fs) ? fs : 16;
        };
        const isMobileNow = () => window.innerWidth < 769;
        const FIXED_TOP_PX = () => (isMobileNow() ? 8 : 12) * getRemPx();

// "처음 아래에서 보일 때" 기본 opacity
        const BASE_OPACITY = 0.2;

// 섹션 progress 기준
        const SHOW_START = 0.5;
        const SHOW_END = 1.0;

// approach는 그냥 "위로 올라오게"만, opacity는 고정(0.2)
        const APPROACH_PORTION = 0.18;
        const APPROACH_END = SHOW_START + (SHOW_END - SHOW_START) * APPROACH_PORTION;

        const START_VH = 80;
        const START_PX = () => (START_VH / 100) * window.innerHeight;

// pinned일 때 섹션 바닥 여유(필요시)
        const EXTRA_PX = 32;

// elems
        const elems = Array.from(inner.querySelectorAll(`.${styles.visionElem}`)) as HTMLElement[];
        const N = elems.length;

        const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// 상태
        let stage = 0;
        let mode: 'pre' | 'approach' | 'fixed' | 'pinned' = 'pre';

        let fadeAcc = 0; // fixed에서만 누적 (0..fadePx)
        let pinned = false;
        let pinnedStage: number | null = null;

        let lastY = window.scrollY;
        let skipOnce = false;

// ------------------------------------------------------
// stage당 fade 길이: phase4 스크롤 예산 기반 (90%를 fixed에)
// ------------------------------------------------------
        const FIXED_BUDGET_RATIO = 0.9;
        const getFadePx = () => {
            const rect = section.getBoundingClientRect();
            const vh = window.innerHeight;
            const scrollable = rect.height - vh;
            if (scrollable <= 0) return 400;

            // phase4는 SHOW_START~1 구간
            const phase4ScrollPx = scrollable * (1 - SHOW_START);

            const fixedBudgetPx = phase4ScrollPx * FIXED_BUDGET_RATIO;
            const perStage = fixedBudgetPx / Math.max(1, N);

            return Math.max(320, Math.round(perStage));
        };

// ------------------------------------------------------
// pinned일 때만 marginBottom 증가
// ------------------------------------------------------
        const applyHeroMarginBottom = () => {
            if (!pinned) {
                section.style.marginBottom = `0px`;
                return;
            }
            const secRect = section.getBoundingClientRect();
            const innerRect = inner.getBoundingClientRect();
            const overflow = Math.max(0, innerRect.bottom - secRect.bottom);
            section.style.marginBottom = `${Math.ceil(overflow + EXTRA_PX)}px`;
        };

// ------------------------------------------------------
// fixed에서 stage elem을 top12에 맞추기 위한 translateY 보정
// ------------------------------------------------------
        const getStageYOffsetFixed = (st: number) => {
            const el = elems[st];
            if (!el) return 0;
            const innerRect = inner.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();
            const offsetInInner = elRect.top - innerRect.top;
            return -offsetInInner;
        };

// ------------------------------------------------------
// opacity 정책 (핵심)
//  - i < stage : 1 유지
//  - i == stage: BASE_OPACITY + (1-BASE)*t01
//  - i > stage : 0
// ------------------------------------------------------
        const applyOpacity = (st: number, t01: number) => {
            const curOpacity = BASE_OPACITY + (1 - BASE_OPACITY) * clamp01(t01);

            for (let i = 0; i < N; i++) {
                if (i < st) elems[i].style.opacity = '1';
                else if (i === st) elems[i].style.opacity = String(curOpacity);
                else elems[i].style.opacity = '0';
            }
        };

// ------------------------------------------------------
// fixed 적용
// ------------------------------------------------------
        const applyFixed = (yPx: number, opacity: number, st: number) => {
            const stageYOffset = getStageYOffsetFixed(st);

            inner.style.removeProperty('bottom');
            inner.style.removeProperty('right');

            inner.style.position = 'fixed';
            inner.style.left = '50%';
            inner.style.top = `${FIXED_TOP_PX()}px`;

            // stageYOffset 포함(복귀 튐 방지)
            inner.style.transform = `translateX(-50%) translateY(${yPx + stageYOffset}px)`;

            inner.style.opacity = String(opacity);
            inner.style.pointerEvents = opacity > 0.98 ? 'auto' : 'none';
        };

// ------------------------------------------------------
// absolute pin: 현재 stage elem이 top12에 오도록 "한 번만" top 계산
// ------------------------------------------------------
        const pinAbsolute = (forStage: number) => {
            if (pinned) return;

            const el = elems[forStage];
            if (!el) return;

            pinned = true;
            pinnedStage = forStage;

            const secRect = section.getBoundingClientRect();
            const innerRect = inner.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();

            const elOffsetInInner = elRect.top - innerRect.top;
            const topInSection = Math.round((-secRect.top) + FIXED_TOP_PX() - elOffsetInInner);

            inner.style.removeProperty('bottom');
            inner.style.removeProperty('right');

            inner.style.position = 'absolute';
            inner.style.left = '50%';
            inner.style.top = `${topInSection}px`;
            inner.style.transform = 'translateX(-50%)';

            inner.style.opacity = '1';
            inner.style.pointerEvents = 'auto';

            applyHeroMarginBottom();
        };

// ------------------------------------------------------
// absolute -> fixed 복귀
// ------------------------------------------------------
        const unpinToFixed = (toStage: number) => {
            pinned = false;
            pinnedStage = null;

            inner.style.removeProperty('top');
            inner.style.removeProperty('bottom');
            inner.style.removeProperty('right');

            applyFixed(0, 1, toStage);
            applyHeroMarginBottom(); // pinned=false => 0

            skipOnce = true;
        };

// ------------------------------------------------------
// pinned 상태에서 다음 stage로 넘어갈 조건 체크
//  - ↓: 다음 elem이 top12 닿으면 fixed로(다음 stage 시작)
//  - ↑: pinnedStage elem이 top12에서 멀어지면 fixed로 복귀
// ------------------------------------------------------
        const checkPinnedTransitions = (dy: number) => {
            if (!pinned || pinnedStage == null) return;

            const topTarget = FIXED_TOP_PX();
            const EPS = 2;

            // ↓ 내려갈 때: 다음 elem이 top12 닿으면 다음 stage로 fixed 복귀
            if (dy > 0) {
                const next = pinnedStage + 1;
                if (next < N) {
                    const nextTop = elems[next].getBoundingClientRect().top;
                    if (nextTop <= topTarget + EPS) {
                        stage = next;
                        fadeAcc = 0;
                        mode = 'fixed';

                        unpinToFixed(stage);
                        applyOpacity(stage, 0); // 다음 stage는 0.2부터 다시 올라감
                    }
                }
                return;
            }

            // ↑ 올릴 때: pinnedStage elem이 top12에서 내려오기 시작하면 fixed 복귀
            if (dy < 0) {
                const curTop = elems[pinnedStage].getBoundingClientRect().top;

                // pinnedStage가 topTarget에서 충분히 멀어지면 fixed로 다시 잡는다
                if (curTop >= topTarget + 18) {
                    stage = pinnedStage;
                    fadeAcc = getFadePx(); // 이미 완전 노출(=t01=1) 상태로 복귀
                    mode = 'fixed';

                    unpinToFixed(stage);
                    applyOpacity(stage, 1);
                }
            }
        };

// ------------------------------------------------------
// main update
// ------------------------------------------------------
        const updateVision = () => {
            if (skipOnce) {
                skipOnce = false;
                return;
            }

            const rect = section.getBoundingClientRect();
            const vh = window.innerHeight;
            const scrollable = rect.height - vh;
            if (scrollable <= 0) return;

            const p = clamp01(-rect.top / scrollable);

            const curY = window.scrollY;
            const dy = curY - lastY;
            lastY = curY;

            // 섹션 밖 처리: fixed 잔상 방지
            if (p <= 0 || p >= 1) {
                // fixed 상태로 섹션을 벗어날 때는 absolute로 풀어두는 게 안전
                const isFixed = inner.style.position === 'fixed';
                if (!pinned && isFixed) {
                    pinAbsolute(stage);
                }

                // 섹션 밖에서는 보이지 않게
                if (!pinned) {
                    inner.style.opacity = '0';
                    inner.style.pointerEvents = 'none';
                }

                applyHeroMarginBottom();
                return;
            }

            // pinned면: 속도 불변 + 스냅 체크만
            if (pinned) {
                applyHeroMarginBottom();
                checkPinnedTransitions(dy);
                return;
            }

            // ---- pre ----
            if (p < SHOW_START) {
                mode = 'pre';
                stage = 0;
                fadeAcc = 0;

                applyFixed(START_PX(), BASE_OPACITY, 0);
                applyOpacity(0, 0);
                applyHeroMarginBottom();
                return;
            }

            // ---- approach: 위치만 위로, opacity는 BASE 유지 ----
            if (p < APPROACH_END) {
                mode = 'approach';
                stage = 0;
                fadeAcc = 0;

                const t01 = clamp01((p - SHOW_START) / (APPROACH_END - SHOW_START));
                applyFixed(START_PX() * (1 - t01), BASE_OPACITY, 0);

                applyOpacity(0, 0);
                applyHeroMarginBottom();
                return;
            }

            // ---- fixed stage ----
            mode = 'fixed';
            applyFixed(0, 1, stage);

            // fixed에서만 fade 진행(내릴 때 + 올릴 때)
            if (dy !== 0) {
                fadeAcc = Math.max(0, Math.min(getFadePx(), fadeAcc + dy));
            }
            const t01 = clamp01(fadeAcc / getFadePx());

            // ✅ 현재 stage elem이 0.2→1로 증가
            applyOpacity(stage, t01);
            applyHeroMarginBottom();

            // ✅ 1이 되면 absolute로 풀어준다 (마지막 stage 포함)
            if (t01 >= 0.999) {
                requestAnimationFrame(() => {
                    pinAbsolute(stage);
                    mode = 'pinned';
                });
                return;
            }

            // ↑ 올릴 때: t01이 0으로 내려가면 이전 stage로 복귀
            if (dy < 0 && fadeAcc <= 0.001 && stage > 0) {
                stage = stage - 1;
                fadeAcc = getFadePx(); // 이전 stage는 완전 노출 상태로 시작
                applyFixed(0, 1, stage);
                applyOpacity(stage, 1);
            }
        };

// 초기 실행
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
                    {/*<Vision />*/}
                    <div className={`${styles.visionWrapper}`}>
                        <div className={styles.visionContent}>
                            <div className={styles.visionElem}>
                                <div className={styles.visionHeader}>
                                    <Image className={styles.visionImg} src={visionPic} height={32} alt="vision icon"></Image>
                                    <p className={styles.headerText}>The Vision</p>
                                </div>
                                <p className={`${styles.visionText} ${styles.detailText} ${styles.delayedAnimation}`}>
                                    {t('vision')}
                                </p>
                            </div>
                            <div className={`${styles.visionElem} ${styles.blockElem}`}>
                                <div className={styles.blockHeader}>
                                    <Image className={styles.blockImg} src={blockPic} height={32} alt="blockchain icon"></Image>
                                    <p className={styles.headerText}>The Blockchain</p>
                                </div>
                                <p className={`${styles.visionText} ${styles.detailText} ${styles.blockText} ${styles.delayedAnimation}`}>
                                    {t('blockchain')}
                                </p>
                            </div>
                            <div className={`${styles.visionElem} ${styles.vobElem}`}>
                                <div className={styles.vobHeader}>
                                    <Image className={styles.vobImg} src={vobPic} height={32} alt="vob icon"></Image>
                                    <p className={styles.headerText}>The Vision of Blockchain</p>
                                </div>
                                <p className={`${styles.visionText} ${styles.detailText} ${styles.delayedAnimation}`}>
                                    {t('vob')}
                                </p>
                            </div>
                        </div>
                        <div className={styles.btnContainer}>
                            <NavigationLink href="/about">
                                <button className={styles.about}>{t('about')}</button>
                            </NavigationLink>
                        </div>
                    </div>
                </div>
        </section>
    );
};
