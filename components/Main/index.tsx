'use client';

console.log('Main module loaded');

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './styles.module.css';
import Image from 'next/image';
import visionPic from '@/public/vision_white.png';
import blockPic from '@/public/blockchain_white.png';
import vobPic from '@/public/vob_crop.png';
import { NavigationLink } from '@/ui/NavigationLink';

import { NewsAcc } from '@/ui/NewsAcc';
import type { NewsItem } from '@/newsMapper';

const BG = 'rgba(30, 30, 30, 1)';
const FG = '#fff';
const SUB_FG = 'rgba(255, 255, 255, 0.78)';
const PADDING_X = 24;

type NewsBundle = {
    data: NewsItem[];
    imgSrc: string[];
    index: number;
};

export const Main = ({ locale, newsBundles }: { locale: string; newsBundles: NewsBundle[] }) => {
    const t = useTranslations('hero');

    const visionRef = useRef<HTMLDivElement | null>(null);
    const canvasSectionRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // about 버튼 opacity를 React state로 주면 리렌더가 생겨서,
    // style 직접 업데이트 방식(=DOM)으로 처리하는게 깜빡임이 적음.
    const aboutBtnRef = useRef<HTMLDivElement | null>(null);

    const s1 = t('line1');
    const s2 = t('line2');
    const s3 = t('line3');
    const s4 = t('line4');

    useEffect(() => {
        const canvas = canvasRef.current;
        const canvasSection = canvasSectionRef.current;
        const aboutLayer = aboutBtnRef.current;
        if (!canvas || !canvasSection || !aboutLayer) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // ======================================================
        // Timeline (Phase1~3 only)
        // ======================================================
        const Z1_END = 0.58;
        const WITH_START = 0.22;
        const WITH_END = 0.6;
        const APPEAR_RATIO = 0.25;
        const PHASE3_START = WITH_START + (WITH_END - WITH_START) * APPEAR_RATIO;

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

        const smoothstep = (a: number, b: number, x: number) => {
            const t = clamp01((x - a) / (b - a));
            return t * t * (3 - 2 * t);
        };
        const lerpInt = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

        const isMobile = () => window.innerWidth < 769;
        const getZoomMax = () => (isMobile() ? 52 : 70);
        const getZoomEase = (tt: number) => (isMobile() ? Math.pow(easeOutCubic(tt), 2.2) : easeOutCubic(tt));

        // ======================================================
        // Canvas sizing (viewport 기준이 가장 안정적)
        // ======================================================
        let dpr = window.devicePixelRatio || 1;

        const setCanvasSize = () => {
            dpr = window.devicePixelRatio || 1;

            // sticky 컨테이너는 항상 viewport를 차지하므로
            const cw = Math.max(1, window.innerWidth);
            const ch = Math.max(1, window.innerHeight);

            canvas.width = Math.floor(cw * dpr);
            canvas.height = Math.floor(ch * dpr);

            canvas.style.width = '100%';
            canvas.style.height = '100%';

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        // ======================================================
        // Progress model
        // - canvas 섹션 top이 0에 닿기 전: progress=0
        // - 닿은 순간부터: progress 0..1
        // ======================================================
        let latestP = 0;
        let animP = 0;

        const getCanvasProgress = () => {
            const rect = canvasSection.getBoundingClientRect();
            const vh = window.innerHeight;

            // canvas 섹션이 아직 화면 위에 붙지 않았으면 "스크롤 시작 전"
            if (rect.top > 0) return 0;

            // 섹션의 "sticky 구간"은 (섹션 height - vh) 만큼 스크롤 가능
            const scrollable = rect.height - vh;
            if (scrollable <= 1) return 1;

            // rect.top은 음수로 내려가며 진행됨
            return clamp01((-rect.top) / scrollable);
        };

        // ======================================================
        // draw (Phase1~3)
        // ======================================================
        const FONT_FAMILY = `"Noto Serif KR","Noto Serif JP","Noto Serif SC","Noto Serif TC","Times New Roman",serif`;
        const header = 'VOB 1.0 Smart Trading';
        const line1 = 'Experience EmOtion-Free Trading';
        const withVOB = 'with VOB';

        const fitFontSize = (text: string, targetPx: number, maxWidth: number, weight = 800) => {
            ctx.font = `${weight} ${targetPx}px ${FONT_FAMILY}`;
            const w = ctx.measureText(text).width;
            if (w <= maxWidth) return targetPx;
            return Math.max(11, Math.floor(targetPx * (maxWidth / w)));
        };

        const PEAK_GRAY = 95;

        const draw = (p: number) => {
            const w = Math.max(1, window.innerWidth);
            const h = Math.max(1, window.innerHeight);
            const maxTextWidth = Math.max(1, w - PADDING_X * 2);

            const pA = p;

            // ---- sizes ----
            const headerSize = fitFontSize(header, Math.min(22, w * 0.04), maxTextWidth, 700);
            const line1Size = fitFontSize(line1, Math.min(56, w * 0.07), maxTextWidth, 800);

            const vhTight2 = clamp01((680 - h) / 240);
            const subTightK = 1 - 0.18 * vhTight2;

            const subBaseRaw = isMobile() ? Math.min(18, w * 0.03) : Math.min(24, w * 0.022);
            const subBase = subBaseRaw * subTightK;

            const ss1 = s1;
            const ss2 = s2;
            const ss3 = s3;
            const ss4 = s4;

            const s1Size = fitFontSize(ss1, subBase, maxTextWidth, 600);
            const s2Size = fitFontSize(ss2, subBase, maxTextWidth, 600);
            const s3Size = fitFontSize(ss3, subBase, maxTextWidth, 600);
            const s4Size = fitFontSize(ss4, subBase, maxTextWidth, 600);

            const cx = (text: string, size: number, weight: number) => {
                ctx.font = `${weight} ${size}px ${FONT_FAMILY}`;
                return (w - ctx.measureText(text).width) / 2;
            };

            ctx.textBaseline = 'middle';

            // ---- spacing ----
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
            const s1X = cx(ss1, s1Size, 400);
            const s2X = cx(ss2, s2Size, 400);
            const s3X = cx(ss3, s3Size, 400);
            const s4X = cx(ss4, s4Size, 400);

            // O anchor
            ctx.font = `800 ${line1Size}px ${FONT_FAMILY}`;
            const beforeO1 = 'Experience Em';
            const oW1 = ctx.measureText('O').width;
            const oCenterX1 = line1X + ctx.measureText(beforeO1).width + oW1 / 2;
            const oCenterY1 = line1Y;

            // withVOB sizes
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

            // background grayscale (Phase1~3)
            let bgGray = 30;
            if (pA < WITH_START) {
                bgGray = lerpInt(30, PEAK_GRAY, smoothstep(0.02, WITH_START, pA));
            } else if (pA < PHASE3_START) {
                bgGray = PEAK_GRAY;
            } else {
                bgGray = lerpInt(PEAK_GRAY, 30, smoothstep(PHASE3_START, 1.0, pA));
            }

            ctx.fillStyle = `rgba(${bgGray},${bgGray},${bgGray},1)`;
            ctx.fillRect(0, 0, w, h);

            // ✅ 캔버스 섹션이 top에 붙은 이후부터만 문구가 "들어오게" 하고 싶으면 gate 적용
            // (progress=0일 땐 거의 안 보임)
            const gate = smoothstep(0.0, 0.08, pA);

            // Phase1 zoom + fade
            // Phase1 zoom을 너무 빨리 시작하지 않도록 앞에 여유 구간을 둠
            const Z1_DELAY = 0.06;   // ✅ 여유(진짜로 "가만히" 있는 구간) - 0.04~0.10 사이 추천
            const Z1_ACTIVE = Z1_END; // 기존 종료점 유지

// pA가 Z1_DELAY 전까진 z1=0, 이후에만 0..1로 진행
            const z1 = clamp01((pA - Z1_DELAY) / (Z1_ACTIVE - Z1_DELAY));

            const z1Ease = Math.pow(getZoomEase(z1), 1.35); // 1.15~1.6 추천
            const scale1 = lerp(1, getZoomMax(), z1Ease);

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
                ctx.fillText(ss1, s1X, s1Y);
                ctx.font = `500 ${s2Size}px ${FONT_FAMILY}`;
                ctx.fillText(ss2, s2X, s2Y);
                ctx.font = `500 ${s3Size}px ${FONT_FAMILY}`;
                ctx.fillText(ss3, s3X, s3Y);
                ctx.font = `500 ${s4Size}px ${FONT_FAMILY}`;
                ctx.fillText(ss4, s4X, s4Y);

                ctx.restore();
                ctx.globalAlpha = 1;
            }

            // Phase2 withVOB appear
            if (pA >= WITH_START && pA < PHASE3_START) {
                ctx.save();
                ctx.globalAlpha = appear;
                ctx.fillStyle = FG;
                ctx.font = `800 ${withSize}px ${FONT_FAMILY}`;
                ctx.fillText(withVOB, withX, withY);
                ctx.restore();
            }

            // Phase3 withVOB zoom + fade
            if (isPhase3) {
                const z3A = clamp01((pA - PHASE3_START) / (1 - PHASE3_START));

                const SCALE_END = 0.78;
                const zScale = clamp01(z3A / SCALE_END);
                const zFade = clamp01((z3A - SCALE_END) / (1 - SCALE_END));

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
        // About opacity control (canvas progress 기반)
        // - fixed, opacity 0
        // - canvas 끝나갈 때 fade in
        // - 끝나면 유지
        // ======================================================
        const updateAboutOpacity = (p: number) => {
            const FADE_IN_START = 0.86; // 취향대로
            const FADE_IN_END = 1.0;

            const a = smoothstep(FADE_IN_START, FADE_IN_END, p);

            aboutLayer.style.opacity = String(a);
            aboutLayer.style.pointerEvents = a > 0.01 ? 'auto' : 'none';
            aboutLayer.style.transform = `translate(-50%,-50%) scale(${lerp(0.98, 1.0, a)})`;
        };

        // ======================================================
        // raf loop
        // ======================================================
        let rafId: number | null = null;
        let lastT = 0;

        const updateProgress = () => {
            latestP = getCanvasProgress();
            updateAboutOpacity(latestP);
        };

        const tick = (ms: number) => {
            if (!lastT) lastT = ms;
            const dt = Math.min(0.05, (ms - lastT) / 1000);
            lastT = ms;

            const FOLLOW = isMobile() ? 12 : 7;
            animP += (latestP - animP) * (1 - Math.exp(-FOLLOW * dt));

            draw(animP);
            rafId = window.requestAnimationFrame(tick);
        };

        let pending = false;
        const onScroll = () => {
            if (pending) return;
            pending = true;
            requestAnimationFrame(() => {
                pending = false;
                updateProgress();
            });
        };

        const onResize = () => {
            setCanvasSize();
            updateProgress();
            draw(animP);
        };

        const start = async () => {
            try {
                // @ts-ignore
                if (document?.fonts?.ready) await document.fonts.ready;
            } catch {}

            setCanvasSize();
            updateProgress();

            animP = latestP;
            draw(animP);

            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onResize);

            rafId = window.requestAnimationFrame(tick);
        };

        start();

        return () => {
            window.removeEventListener('scroll', onScroll as any);
            window.removeEventListener('resize', onResize as any);
            if (rafId) window.cancelAnimationFrame(rafId);
        };
    }, [s1, s2, s3, s4]);

    // ======================================================
    // ✅ Layout: vision -> canvas -> about (같은 heroSection 안에서)
    // ======================================================
    return (
        <section className={styles.heroSection} style={{ background: BG }}>
            {/* 1) VISION (자연 스크롤 블록) */}
            <div ref={visionRef} className={styles.vision}>
                <div className={styles.visionWrapper}>
                    <div className={styles.visionContent}>
                        <div className={styles.visionElem}>
                            <div>
                                {newsBundles[0] && (
                                    <NewsAcc data={newsBundles[0].data} imgSrc={newsBundles[0].imgSrc} index={newsBundles[0].index} />
                                )}
                            </div>
                            <div className={styles.visionMainText}>
                                <div className={styles.visionHeader}>
                                    <Image className={styles.vobImg} src={vobPic} height={32} alt="vob icon" />
                                    <p className={styles.headerText}>The Vision of Blockchain</p>
                                </div>
                                <p className={`${styles.visionText} ${styles.detailText}`}>{t('vision')}</p>
                                <p className={`${styles.visionText} ${styles.detailText}`}>{t('vision_down')}</p>
                            </div>
                        </div>

                        {/*<div className={styles.visionElem}>*/}
                        {/*    <div className={styles.blockHeader}>*/}
                        {/*        <Image className={styles.blockImg} src={blockPic} height={32} alt="blockchain icon" />*/}
                        {/*        <p className={styles.headerText}>The Blockchain</p>*/}
                        {/*    </div>*/}
                        {/*    <p className={`${styles.visionText} ${styles.detailText} ${styles.blockText}`}>{t('blockchain')}</p>*/}
                        {/*    <div>*/}
                        {/*        {newsBundles[1] && (*/}
                        {/*            <NewsAcc data={newsBundles[1].data} imgSrc={newsBundles[1].imgSrc} index={newsBundles[1].index} />*/}
                        {/*        )}*/}
                        {/*    </div>*/}
                        {/*    <p className={`${styles.visionText} ${styles.detailText}`}>{t('blockchain_down')}</p>*/}
                        {/*</div>*/}

                        {/*<div className={styles.visionElem}>*/}
                        {/*    <div className={styles.vobHeader}>*/}
                        {/*        <Image className={styles.vobImg} src={vobPic} height={32} alt="vob icon" />*/}
                        {/*        <p className={styles.headerText}>The Vision of Blockchain</p>*/}
                        {/*    </div>*/}
                        {/*    <p className={`${styles.visionText} ${styles.detailText}`}>{t('vob')}</p>*/}
                        {/*    <div>*/}
                        {/*        {newsBundles[2] && (*/}
                        {/*            <NewsAcc data={newsBundles[2].data} imgSrc={newsBundles[2].imgSrc} index={newsBundles[2].index} />*/}
                        {/*        )}*/}
                        {/*    </div>*/}
                        {/*    <p className={`${styles.visionText} ${styles.detailText}`}>{t('vob_down')}</p>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>

            {/* 2) CANVAS 섹션
          - 처음엔 블록으로 내려오다가
          - top=0 닿으면 sticky로 "고정" (네가 말한 fixed 시작 타이밍과 동일)
          - 이 섹션 높이가 길수록 애니메이션이 천천히 진행됨
            */}
            <div
                className={styles.canvas}
                ref={canvasSectionRef}
                style={{
                    position: 'relative',
                    height: '1080vh', // ✅ 스크롤 길이(=애니메이션 길이). 취향대로
                }}
            >
                <div
                    style={{
                        position: 'sticky',
                        top: 0,
                        height: '100svh', // ✅ 모바일 안정용 (주소창 신경 안쓴다 했지만 sticky엔 이게 제일 덜 흔들림)
                    }}
                >
                    <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
                </div>
            </div>

            {/* 3) ABOUT 섹션
          - 구조상 heroSection 안에서 canvas 다음에 붙어있음
          - 버튼은 fixed 중앙, opacity는 JS가 canvas progress로 제어
          - canvas 끝나면 보이고 계속 남음
            */}
            <div style={{ position: 'relative', height: '120vh' }}>
                <div
                    ref={aboutBtnRef}
                    style={{
                        position: 'fixed',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%,-50%)',
                        opacity: 0,
                        pointerEvents: 'none',
                        zIndex: 50,
                        willChange: 'opacity, transform',
                    }}
                >
                    <NavigationLink href="/about">
                        <button className={styles.about}>{t('about')}</button>
                    </NavigationLink>
                </div>
            </div>
        </section>
    );
};
