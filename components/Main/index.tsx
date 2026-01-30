'use client';

console.log('Main module loaded');

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import styles from './styles.module.css';
import Image from 'next/image';
import visionPic from '@/public/vision_white.png';
import blockPic from '@/public/blockchain_white.png';
import vobPic from '@/public/vob_crop.png';
import { NavigationLink } from '@/ui/NavigationLink';

const BG = 'rgba(30, 30, 30, 1)';
const FG = '#fff';
const SUB_FG = 'rgba(255, 255, 255, 0.78)';
const PADDING_X = 24;

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
        const section = sectionRef.current;
        const canvas = canvasRef.current;
        const inner = visionInnerRef.current;
        if (!section || !canvas || !inner) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const FONT_FAMILY = `"Noto Serif KR","Noto Serif JP","Noto Serif SC","Noto Serif TC","Times New Roman",serif`;

        const header = 'VOB 1.0 Smart Trading';
        const line1 = 'Experience EmOtion-Free Trading';
        const withVOB = 'with VOB';

        // ======================================================
        // Timeline
        // ======================================================
        const Z1_END = 0.58;
        const WITH_START = 0.22;
        const WITH_END = 0.6;
        const APPEAR_RATIO = 0.25;
        const PHASE3_START = WITH_START + (WITH_END - WITH_START) * APPEAR_RATIO;

        // Phase4 range (draw에서 배경을 P4_START 이전에 다크로 만들기 위해 사용)
        const P4_START = 0.5;
        const P4_END = 1.0;

        // ======================================================
        // Utils
        // ======================================================
        const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
        const lerp = (a: number, b: number, tt: number) => a + (b - a) * tt;

        const easeOutCubic = (tt: number) => 1 - Math.pow(1 - tt, 3);
        const easeInOutCubic = (tt: number) =>
            tt < 0.5 ? 4 * tt * tt * tt : 1 - Math.pow(-2 * tt + 2, 3) / 2;

        const accel2 = (tt: number) => {
            const t = clamp01(tt);
            return Math.pow(easeOutCubic(t), 1.45);
        };

        const isMobile = () => window.innerWidth < 769;
        const getZoomMax = () => (isMobile() ? 52 : 70);
        const getZoomEase = (tt: number) => (isMobile() ? Math.pow(easeOutCubic(tt), 2.2) : easeOutCubic(tt));

        const smoothstep = (a: number, b: number, x: number) => {
            const t = clamp01((x - a) / (b - a));
            return t * t * (3 - 2 * t);
        };
        const lerpInt = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

        const getRemPx = () => {
            const fs = parseFloat(getComputedStyle(document.documentElement).fontSize || '16');
            return Number.isFinite(fs) ? fs : 16;
        };

        // ======================================================
        // ✅ Mobile address bar safe viewport (stable VH)
        // - 주소창이 나오면 innerHeight가 줄어드는 걸 무시하고
        // - 한 번이라도 커졌던(주소창 숨김) 높이를 기준으로 margin 계산
        // ======================================================
        let stableVh = window.innerHeight;

        const refreshStableVh = () => {
            const vvH = window.visualViewport?.height ?? 0;
            stableVh = Math.max(stableVh, window.innerHeight, vvH);
        };

        const getStableVh = () => window.visualViewport?.height ?? window.innerHeight;

// ✅ Phase4 측정/스케줄 무효화
        const invalidateMeasurements = () => {
            scheduleReady = false;
            offsetsReady = false;
        };

// ✅ margin-bottom 계산(레이아웃 기준)
        const updateHeroMarginBottom = () => {
            const s = sectionRef.current;
            const v = visionInnerRef.current;
            if (!s || !v) return;

            const elems = v.querySelectorAll(`.${styles.visionElem}`);
            if (elems.length < 3) return;

            const third = elems[2] as HTMLElement;

            // ✅ 핵심: fixed/transform 영향 안 받는 레이아웃 기준 값
            const tailHeight = v.scrollHeight - third.offsetTop;

            const vh = getStableVh();
            const mb = tailHeight + FIXED_TOP_PX() - vh;

            s.style.marginBottom = `${mb}px`;
        };

// ✅ 레이아웃 모드에서 측정(중요)
// - inner가 fixed/transform 상태면 offsetTop/scrollHeight 측정이 흔들릴 수 있음
        const measureInLayoutMode = () => {
            const s = sectionRef.current;
            const v = visionInnerRef.current;
            if (!s || !v) return;

            // 현재 스타일 백업
            const prev = {
                position: inner.style.position,
                top: inner.style.top,
                left: inner.style.left,
                transform: inner.style.transform,
                pointerEvents: inner.style.pointerEvents,
                opacity: inner.style.opacity,
            };

            // ✅ 자연 레이아웃 상태로 잠깐 복귀
            inner.style.position = 'relative';
            inner.style.top = '0px';
            inner.style.left = '0px';
            inner.style.transform = 'none';
            inner.style.pointerEvents = 'none';

            // rAF 2번: 폰트/줄바꿈/레이아웃 반영 안정화
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    // offsets 다시 계산
                    measureVisionElems();        // 여기서 offsetsReady=true 되도록
                    // margin 다시 계산
                    updateHeroMarginBottom();

                    // 복구(phase 로직이 다음 tick/scroll에서 다시 잡아줌)
                    Object.assign(inner.style, prev);
                });
            });
        };

// ✅ 한 번에 처리하는 헬퍼
        const remeasureAll = () => {
            invalidateMeasurements();
            measureInLayoutMode();
        };
        // ======================================================
        // Canvas state
        // ======================================================
        let dpr = window.devicePixelRatio || 1;

        let rafId: number | null = null;
        let lastT = 0;
        let time = 0;

        let latestP = 0;
        let animP = 0;

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

        // ======================================================
        // ✅ Phase1~3 grayscale background only
        // ======================================================
        const PEAK_GRAY = 95;

        const draw = (p: number, _tSec: number, pReal?: number) => {
            const rect = canvas.getBoundingClientRect();
            const w = Math.max(1, rect.width);
            const h = Math.max(1, rect.height);
            const maxTextWidth = Math.max(1, w - PADDING_X * 2);

            const pA = p;
            const pR = pReal ?? p;

            // ---- sizes ----
            const headerSize = fitFontSize(header, Math.min(22, w * 0.04), maxTextWidth, 700);
            const line1Size = fitFontSize(line1, Math.min(56, w * 0.07), maxTextWidth, 800);

            // sub lines: 낮은 세로일 때만 살짝 축소
            const vhTight2 = clamp01((680 - h) / 240);
            const subTightK = 1 - 0.18 * vhTight2;

            const subBaseRaw = isMobile() ? Math.min(18, w * 0.03) : Math.min(24, w * 0.022);
            const subBase = subBaseRaw * subTightK;

            const s1Size = fitFontSize(s1, subBase, maxTextWidth, 600);
            const s2Size = fitFontSize(s2, subBase, maxTextWidth, 600);
            const s3Size = fitFontSize(s3, subBase, maxTextWidth, 600);
            const s4Size = fitFontSize(s4, subBase, maxTextWidth, 600);

            const cx = (text: string, size: number, weight: number) => {
                ctx.font = `${weight} ${size}px ${FONT_FAMILY}`;
                return (w - ctx.measureText(text).width) / 2;
            };

            ctx.textBaseline = 'middle';

            // ---- spacing / anti-overlap ----
            const vhTight = clamp01((700 - h) / 260);
            const tightK = 1 - 0.28 * vhTight;

            const headerToLine1Base = (isMobile() ? h * 0.045 : h * 0.055) * tightK;
            const line1ToSubsBase = (isMobile() ? h * 0.06 : h * 0.095) * tightK;
            const subGapBase = (isMobile() ? h * 0.022 : h * 0.032) * tightK;

            const headerToLine1 = Math.max(headerSize * 0.65, headerToLine1Base);
            const line1ToSubs = Math.max(line1Size * 0.75, line1ToSubsBase);
            const subGap = Math.max(Math.max(10, subBase * 0.55), subGapBase);

            const blockHeightEstimate = headerToLine1 + line1ToSubs + (subGap * 3 + subGap * 0.6);
            const overflow = Math.max(0, blockHeightEstimate - h * 0.62);
            const anchorShift = Math.min(h * 0.08, overflow * 0.25);

            const line1Y = h * 0.46 - anchorShift;
            const headerY = line1Y - headerToLine1;

            const s1Y = line1Y + line1ToSubs;
            const s2Y = s1Y + subGap;
            const s3Y = s2Y + subGap * 1.6;
            const s4Y = s3Y + subGap;

            const headerX = cx(header, headerSize, 700);
            const line1X = cx(line1, line1Size, 800);
            const s1X = cx(s1, s1Size, 400);
            const s2X = cx(s2, s2Size, 400);
            const s3X = cx(s3, s3Size, 400);
            const s4X = cx(s4, s4Size, 400);

            // O anchor (phase1 zoom center)
            ctx.font = `800 ${line1Size}px ${FONT_FAMILY}`;
            const beforeO1 = 'Experience Em';
            const oW1 = ctx.measureText('O').width;
            const oCenterX1 = line1X + ctx.measureText(beforeO1).width + oW1 / 2;
            const oCenterY1 = line1Y;

            // withVOB positioning
            const withBasePx = Math.max(18, w * 0.06);
            const WITH_MAX_SCALE = 1.22;
            const withMaxSize = fitFontSize(withVOB, withBasePx * WITH_MAX_SCALE, maxTextWidth, 800);

            const appearRaw = clamp01((pA - WITH_START) / (PHASE3_START - WITH_START));
            const appear = easeOutCubic(appearRaw);

            const appearScale = lerp(0.55, WITH_MAX_SCALE, appear);
            const withSize = fitFontSize(withVOB, withBasePx * appearScale, maxTextWidth, 800);

            ctx.font = `800 ${withSize}px ${FONT_FAMILY}`;
            const withW = ctx.measureText(withVOB).width;
            const withX = oCenterX1 - withW / 2;
            const withY = oCenterY1;

            const isPhase3 = pA >= PHASE3_START;

            // ✅ grayscale bg (Phase4 시작 전에 이미 다크로)
            let bgGray = 30;

            if (pR >= P4_START) {
                bgGray = 30;
            } else if (pR < WITH_START) {
                bgGray = lerpInt(30, PEAK_GRAY, smoothstep(0.02, WITH_START, pR));
            } else if (pR < PHASE3_START) {
                bgGray = PEAK_GRAY;
            } else {
                bgGray = lerpInt(PEAK_GRAY, 30, smoothstep(PHASE3_START, P4_START, pR));
            }

            ctx.fillStyle = `rgba(${bgGray},${bgGray},${bgGray},1)`;
            ctx.fillRect(0, 0, w, h);

            // Phase1 zoom + fade (기존 흐름 유지)
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

            // Phase2: withVOB appear
            if (pA >= WITH_START && pA < PHASE3_START) {
                ctx.save();
                ctx.globalAlpha = appear;
                ctx.fillStyle = FG;
                ctx.font = `800 ${withSize}px ${FONT_FAMILY}`;
                ctx.fillText(withVOB, withX, withY);
                ctx.restore();
            }

            // Phase3: withVOB zoom + fade
            if (isPhase3) {
                const z3A = clamp01((pA - PHASE3_START) / (1 - PHASE3_START));
                const z3R = clamp01((pR - PHASE3_START) / (1 - PHASE3_START));

                const SCALE_END = 0.78;
                const zScale = clamp01(z3A / SCALE_END);
                const zFade = clamp01((z3R - SCALE_END) / (1 - SCALE_END));

                const scale2 = lerp(1, getZoomMax(), accel2(zScale));
                const textAlpha = 1 - easeInOutCubic(zFade);

                ctx.font = `800 ${withMaxSize}px ${FONT_FAMILY}`;
                const withWMax = ctx.measureText(withVOB).width;
                const withXMax = oCenterX1 - withWMax / 2;
                const withYMax = oCenterY1;

                ctx.save();
                ctx.translate(oCenterX1, oCenterY1);
                ctx.scale(scale2, scale2);
                ctx.translate(-oCenterX1, -oCenterY1);

                if (textAlpha > 0.001) {
                    ctx.globalAlpha = textAlpha;
                    ctx.fillStyle = FG;
                    ctx.font = `800 ${withMaxSize}px ${FONT_FAMILY}`;
                    ctx.fillText(withVOB, withXMax, withYMax);
                }

                ctx.restore();
                ctx.globalAlpha = 1;
            }
        };

        // ======================================================
        // ✅ Phase4: fixed/absolute swap (mobile 8rem, desktop 12rem)
        // ======================================================
        const isMobileNow = () => window.innerWidth < 769;

        const FIXED_TOP_PX = () => {
            const rem = getRemPx();
            return (isMobileNow() ? 8 : 12) * rem;
        };

        let visionElems: HTMLElement[] = [];
        let elemOffsets: number[] = [];
        let offsetsReady = false;

        const measureVisionElems = () => {
            const list = Array.from(inner.querySelectorAll(`.${styles.visionElem}`)) as HTMLElement[];
            visionElems = list.slice(0, 3);
            elemOffsets = visionElems.map((el) => el.offsetTop);
            offsetsReady = visionElems.length === 3;

            if (offsetsReady) {
                visionElems[0].style.opacity = '0';
                visionElems[1].style.opacity = '0';
                visionElems[2].style.opacity = '0';
            }
        };

        const setInnerFixedAtOffset = (targetOffsetTop: number) => {
            inner.style.position = 'fixed';
            inner.style.left = '50%';
            inner.style.top = `${FIXED_TOP_PX()}px`;
            inner.style.transform = `translateX(-50%) translateY(${-targetOffsetTop}px)`;
            inner.style.opacity = '1';
            inner.style.pointerEvents = 'auto';
        };

        const convertFixedToAbsoluteKeepPosition = () => {
            const secRect = section.getBoundingClientRect();
            const innerRect = inner.getBoundingClientRect();
            const topInSection = innerRect.top - secRect.top;

            inner.style.position = 'absolute';
            inner.style.left = '50%';
            inner.style.top = `${Math.round(topInSection)}px`;
            inner.style.transform = 'translateX(-50%)';
            inner.style.opacity = '1';
            inner.style.pointerEvents = 'auto';
        };

        const setElemOpacities = (o1: number, o2: number, o3: number) => {
            if (!offsetsReady) return;
            visionElems[0].style.opacity = String(o1);
            visionElems[1].style.opacity = String(o2);
            visionElems[2].style.opacity = String(o3);
        };

        type Seg =
            | { kind: 'F_1'; len: number }
            | { kind: 'A_1_2'; len: number }
            | { kind: 'F_2'; len: number }
            | { kind: 'A_2_3'; len: number }
            | { kind: 'F_3'; len: number };

        let scheduleReady = false;
        let segs: Seg[] = [];
        let segStarts: number[] = [];

        let releasedAfterEnd = false;

        let forcedSegIndex: number | null = null;
        let freezePhasePx: number | null = null;

        let prevRawP = 0;

        const buildSchedule = () => {
            if (!offsetsReady) return;

            const rect = section.getBoundingClientRect();
            const vh = window.innerHeight;
            const scrollable = rect.height - vh;
            if (scrollable <= 0) return;

            const phase4Scrollable = scrollable * (P4_END - P4_START);

            const abs12 = Math.max(1, elemOffsets[1] - elemOffsets[0]);
            const abs23 = Math.max(1, elemOffsets[2] - elemOffsets[1]);
            const totalAbs = abs12 + abs23;

            const remain = Math.max(0, phase4Scrollable - totalAbs);

            const w1 = 0.34;
            const w2 = 0.33;
            const w3 = 0.33;

            const f1 = Math.max(1, remain * w1);
            const f2 = Math.max(1, remain * w2);
            const f3 = Math.max(1, remain * w3);

            segs = [
                { kind: 'F_1', len: f1 },
                { kind: 'A_1_2', len: abs12 },

                { kind: 'F_2', len: f2 },
                { kind: 'A_2_3', len: abs23 },

                { kind: 'F_3', len: f3 },
            ];

            segStarts = [];
            let acc = 0;
            for (const s of segs) {
                segStarts.push(acc);
                acc += s.len;
            }

            scheduleReady = true;
        };

        const idxOf = (kind: Seg['kind']) => segs.findIndex((s) => s.kind === kind);

        const triggerToFixedIfHitTop = (elemIndex: 0 | 1 | 2, fixedKind: Seg['kind']) => {
            const el = visionElems[elemIndex];
            const elTop = el.getBoundingClientRect().top;
            const targetTop = FIXED_TOP_PX();
            const EPS = 1;

            if (elTop <= targetTop + EPS) {
                setInnerFixedAtOffset(elemOffsets[elemIndex]);

                const fi = idxOf(fixedKind);
                if (fi >= 0) {
                    forcedSegIndex = fi;
                    freezePhasePx = segStarts[fi];
                }
            }
        };

        const clearForceSnap = () => {
            forcedSegIndex = null;
            freezePhasePx = null;
        };

        const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
        //
        // // ✅ marginBottom 계산: address bar 영향 없는 stableVh 사용
        // const updateHeroMarginBottom = () => {
        //     const s = sectionRef.current;
        //     const v = visionInnerRef.current;
        //     if (!s || !v) return;
        //
        //     const elems = v.querySelectorAll(`.${styles.visionElem}`);
        //     if (elems.length < 3) return;
        //
        //     const thirdElem = elems[2] as HTMLElement;
        //
        //     const visionRect = v.getBoundingClientRect();
        //     const thirdRect = thirdElem.getBoundingClientRect();
        //
        //     // (3번째 elem 시작 → vision bottom)
        //     const tailHeight = visionRect.bottom - thirdRect.top;
        //
        //     const marginBottom = tailHeight + FIXED_TOP_PX() - getStableVh();
        //     s.style.marginBottom = `${marginBottom}px`;
        // };

        const updatePhase4 = () => {
            if (!offsetsReady) measureVisionElems();
            if (!offsetsReady) return;

            if (!scheduleReady) buildSchedule();
            if (!scheduleReady) return;

            const rect = section.getBoundingClientRect();
            const vh = window.innerHeight;
            const scrollable = rect.height - vh;
            if (scrollable <= 0) return;

            const rawP = -rect.top / scrollable;
            const directionDown = rawP >= prevRawP;
            prevRawP = rawP;

            if (rawP < P4_START) {
                releasedAfterEnd = false;
                clearForceSnap();

                inner.style.position = 'fixed';
                inner.style.left = '50%';
                inner.style.top = `${FIXED_TOP_PX()}px`;
                inner.style.transform = `translateX(-50%) translateY(${- (elemOffsets[0] || 0)}px)`;
                inner.style.opacity = '0';
                inner.style.pointerEvents = 'none';

                setElemOpacities(0, 0, 0);
                return;
            }

            if (rawP >= P4_END) {
                if (!releasedAfterEnd) {
                    releasedAfterEnd = true;
                    clearForceSnap();

                    if (inner.style.position !== 'absolute') convertFixedToAbsoluteKeepPosition();
                    setElemOpacities(1, 1, 1);
                }
                return;
            }

            releasedAfterEnd = false;

            const p = clamp01(rawP);
            const t = clamp01((p - P4_START) / (P4_END - P4_START));
            const phasePx = t * (scrollable * (P4_END - P4_START));
            const phasePxUsed = freezePhasePx != null ? freezePhasePx : phasePx;

            let idx = segs.length - 1;
            if (forcedSegIndex != null) {
                idx = forcedSegIndex;
            } else {
                for (let i = 0; i < segs.length; i++) {
                    const start = segStarts[i];
                    const end = start + segs[i].len;
                    if (phasePxUsed >= start && phasePxUsed < end) {
                        idx = i;
                        break;
                    }
                }
            }

            const seg = segs[idx];
            const start = segStarts[idx];
            const localT = seg.len <= 1 ? 1 : clamp01((phasePxUsed - start) / seg.len);

            switch (seg.kind) {
                case 'F_1': {
                    if (freezePhasePx != null && localT <= 0.001) clearForceSnap();

                    setInnerFixedAtOffset(elemOffsets[0]);
                    const e = easeInOut(localT);
                    setElemOpacities(lerp(0.0, 1.0, e), 0, 0);
                    break;
                }

                case 'A_1_2': {
                    if (inner.style.position !== 'absolute') convertFixedToAbsoluteKeepPosition();
                    setElemOpacities(1, 0, 0);
                    if (directionDown) triggerToFixedIfHitTop(1, 'F_2');
                    break;
                }

                case 'F_2': {
                    if (freezePhasePx != null && localT <= 0.001) clearForceSnap();

                    setInnerFixedAtOffset(elemOffsets[1]);
                    const e = easeInOut(localT);
                    setElemOpacities(1, lerp(0.0, 1.0, e), 0);
                    break;
                }

                case 'A_2_3': {
                    if (inner.style.position !== 'absolute') convertFixedToAbsoluteKeepPosition();
                    setElemOpacities(1, 1, 0);
                    if (directionDown) triggerToFixedIfHitTop(2, 'F_3');
                    break;
                }

                case 'F_3': {
                    if (freezePhasePx != null && localT <= 0.001) clearForceSnap();

                    setInnerFixedAtOffset(elemOffsets[2]);
                    const e = easeInOut(localT);
                    setElemOpacities(1, 1, lerp(0.0, 1.0, e));
                    break;
                }
            }
        };

        const updateVision = () => {
            updatePhase4();
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

            // ✅ 세로 줄임에서 깨지는 원인 제거
            remeasureAll();

            updateVision();
            draw(animP, time, latestP);
        };

        const onVhResize = () => {
            setCanvasSize();
            updateProgress();

            // ✅ 주소창/툴바 변화도 여기로 들어오므로 동일 처리
            remeasureAll();

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

            // ✅ 초기 측정도 동일 루틴으로
            remeasureAll();

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
            {/* ✅ 모바일 주소창 이슈 줄이려면 100vh 대신 100svh 추천 */}
            <div style={{ position: 'sticky', top: 0, height: '100svh' }}>
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            </div>

            <div ref={visionInnerRef} className={styles.vision}>
                <div className={styles.visionWrapper}>
                    <div className={styles.visionContent}>
                        <div className={styles.visionElem}>
                            <div className={styles.visionHeader}>
                                <Image className={styles.visionImg} src={visionPic} height={32} alt="vision icon" />
                                <p className={styles.headerText}>The Vision</p>
                            </div>
                            <p className={`${styles.visionText} ${styles.detailText} ${styles.delayedAnimation}`}>{t('vision')}</p>
                        </div>

                        <div className={styles.visionElem}>
                            <div className={styles.blockHeader}>
                                <Image className={styles.blockImg} src={blockPic} height={32} alt="blockchain icon" />
                                <p className={styles.headerText}>The Blockchain</p>
                            </div>
                            <p className={`${styles.visionText} ${styles.detailText} ${styles.blockText} ${styles.delayedAnimation}`}>
                                {t('blockchain')}
                            </p>
                        </div>

                        <div className={styles.visionElem}>
                            <div className={styles.vobHeader}>
                                <Image className={styles.vobImg} src={vobPic} height={32} alt="vob icon" />
                                <p className={styles.headerText}>The Vision of Blockchain</p>
                            </div>
                            <p className={`${styles.visionText} ${styles.detailText} ${styles.delayedAnimation}`}>{t('vob')}</p>
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
