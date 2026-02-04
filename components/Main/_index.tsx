// 'use client';
//
// console.log('Main module loaded');
//
// import { useEffect, useRef } from 'react';
// import { useTranslations } from 'next-intl';
// import styles from './styles.module.css';
// import Image from 'next/image';
// import vobPic from '@/public/vob_crop.png';
// import { NavigationLink } from '@/ui/NavigationLink';
//
// import { NewsAcc } from '@/ui/NewsAcc';
// import type { NewsItem } from '@/newsMapper';
//
// const BG = 'rgba(30, 30, 30, 1)';
// const FG = '#fff';
// const PADDING_X = 24;
//
// type NewsBundle = {
//     data: NewsItem[];
//     imgSrc: string[];
//     index: number;
// };
//
// export const Main = ({ locale, newsBundles }: { locale: string; newsBundles: NewsBundle[] }) => {
//     const t = useTranslations('hero');
//
//     const visionRef = useRef<HTMLDivElement | null>(null);
//     const canvasSectionRef = useRef<HTMLDivElement | null>(null);
//     const canvasRef = useRef<HTMLCanvasElement | null>(null);
//     const aboutBtnRef = useRef<HTMLDivElement | null>(null);
//
//     const s1 = t('line1');
//     const s2 = t('line2');
//     const s3 = t('line3');
//     const s4 = t('line4');
//
//     useEffect(() => {
//         const canvas = canvasRef.current;
//         const canvasSection = canvasSectionRef.current;
//         const aboutLayer = aboutBtnRef.current;
//         if (!canvas || !canvasSection || !aboutLayer) return;
//
//         const ctx = canvas.getContext('2d');
//         if (!ctx) return;
//
//         // ======================================================
//         // ✅ 요구사항 핵심 상수
//         // ======================================================
//         const FIXED_TOP_PX = 192; // 12rem
//
//         // phase1 전체(텍스트 등장+소멸)가 끝나는 지점(0..1)
//         // phase2(with VOB)는 이 뒤에서만 시작 -> "겹치면 안됨" 해결
//         const TEXT_PHASE_END = 0.82;
//
//         // with VOB 타이밍(phase2 내부 진행)
//         const WITH_START = 0.18;
//         const WITH_END = 0.72;
//         const APPEAR_RATIO = 0.30;
//         const PHASE3_START = WITH_START + (WITH_END - WITH_START) * APPEAR_RATIO;
//
//         // ======================================================
//         // Utils
//         // ======================================================
//         const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
//         const lerp = (a: number, b: number, tt: number) => a + (b - a) * tt;
//
//         const easeOutCubic = (tt: number) => 1 - Math.pow(1 - tt, 3);
//         const easeInOutCubic = (tt: number) =>
//             tt < 0.5 ? 4 * tt * tt * tt : 1 - Math.pow(-2 * tt + 2, 3) / 2;
//
//         const accel2 = (tt: number) => {
//             const t = clamp01(tt);
//             return Math.pow(easeOutCubic(t), 1.45);
//         };
//
//         const smoothstep = (a: number, b: number, x: number) => {
//             const t = clamp01((x - a) / (b - a));
//             return t * t * (3 - 2 * t);
//         };
//
//         const lerpInt = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
//
//         const isMobile = () => window.innerWidth < 769;
//         const getZoomMax = () => (isMobile() ? 52 : 70);
//
//         // ======================================================
//         // Canvas sizing
//         // ======================================================
//         let dpr = window.devicePixelRatio || 1;
//
//         const setCanvasSize = () => {
//             dpr = window.devicePixelRatio || 1;
//
//             const cw = Math.max(1, window.innerWidth);
//             const ch = Math.max(1, window.innerHeight);
//
//             canvas.width = Math.floor(cw * dpr);
//             canvas.height = Math.floor(ch * dpr);
//
//             canvas.style.width = '100%';
//             canvas.style.height = '100%';
//
//             ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
//         };
//
//         // ======================================================
//         // ✅ Progress
//         // - pText: canvasSection top이 viewport bottom(vh) 닿을 때부터 0→1
//         // - pCanvas: sticky(=top 0) 이후 캔버스용 진행 (기존 로직 유지)
//         // ======================================================
//         let latestTextP = 0;
//         let latestCanvasP = 0;
//
//         let animTextP = 0;
//         let animCanvasP = 0;
//
//         const getTextProgress = () => {
//             const rect = canvasSection.getBoundingClientRect();
//             const vh = window.innerHeight;
//
//             // ✅ 2. phase1 시작: canvasSection top이 viewport bottom에 닿을 때부터
//             if (rect.top > vh) return 0;
//
//             const total = rect.height;
//             if (total <= 1) return 1;
//
//             // rect.top == vh => 0
//             // rect.top == -(height - vh) => 1
//             return clamp01((vh - rect.top) / total);
//         };
//
//         const getCanvasProgress = () => {
//             const rect = canvasSection.getBoundingClientRect();
//             const vh = window.innerHeight;
//
//             // sticky 시작 전: 0
//             if (rect.top > 0) return 0;
//
//             const scrollable = rect.height - vh;
//             if (scrollable <= 1) return 1;
//
//             return clamp01((-rect.top) / scrollable);
//         };
//
//         // ======================================================
//         // ✅ DOM refs (HTML 구조 변경 반영)
//         // ======================================================
//         const overlay = canvasSection.querySelector('#phase1Overlay') as HTMLDivElement | null;
//
//         const elHeader = canvasSection.querySelector('#p1_header') as HTMLParagraphElement | null;
//         const elLine1 = canvasSection.querySelector('#p1_line1') as HTMLParagraphElement | null;
//         const elS1 = canvasSection.querySelector('#p1_s1') as HTMLParagraphElement | null;
//         const elS2 = canvasSection.querySelector('#p1_s2') as HTMLParagraphElement | null;
//         const elS3 = canvasSection.querySelector('#p1_s3') as HTMLParagraphElement | null;
//         const elS4 = canvasSection.querySelector('#p1_s4') as HTMLParagraphElement | null;
//
//         const setLine = (el: HTMLElement | null, a: number) => {
//             if (!el) return;
//             const alpha = clamp01(a);
//             el.style.opacity = String(alpha);
//             el.style.transform = `translateY(${lerp(14, 0, alpha)}px)`;
//             el.style.filter = `blur(${lerp(2.2, 0, alpha)}px)`;
//         };
//
//         // ======================================================
//         // ✅ 3. overlay fixed 전환 규칙 (canvasSection 기준)
//         // - canvasSection top이 12rem에 닿는 순간: overlay만 fixed top 12rem
//         // - 나머지 구간: overlay는 absolute top 0 (섹션 최상단과 겹침)
//         // ======================================================
//         let overlayIsFixed = false;
//
//         const setOverlayAbsoluteTop0 = () => {
//             if (!overlay) return;
//             overlayIsFixed = false;
//
//             overlay.style.position = 'absolute';
//             overlay.style.top = '0px';
//             // overlay.style.left = '50%';
//             // overlay.style.transform = 'translateX(-50%)';
//             // overlay.style.width = 'min(980px, calc(100vw - 48px))';
//             overlay.style.zIndex = '40';
//             overlay.style.willChange = 'transform, opacity';
//         };
//
//         const setOverlayFixedTop12 = () => {
//             if (!overlay) return;
//             overlayIsFixed = true;
//
//             overlay.style.position = 'fixed';
//             overlay.style.top = `${FIXED_TOP_PX}px`;
//             // overlay.style.left = '50%';
//             // overlay.style.transform = 'translateX(-50%)';
//             // overlay.style.width = 'min(980px, calc(100vw - 48px))';
//             overlay.style.zIndex = '40';
//             overlay.style.willChange = 'transform, opacity';
//         };
//
//         const updateOverlayPin = () => {
//             if (!overlay) return;
//
//             const rect = canvasSection.getBoundingClientRect();
//             const vh = window.innerHeight;
//
//             // phase1 시작 전에는 absolute(top0) 유지
//             if (rect.top > vh) {
//                 if (overlayIsFixed) setOverlayAbsoluteTop0();
//                 else setOverlayAbsoluteTop0();
//                 return;
//             }
//
//             // ✅ canvasSection top이 12rem에 닿으면 overlay만 fixed
//             const shouldFix = rect.top <= FIXED_TOP_PX;
//
//             if (shouldFix && !overlayIsFixed) {
//                 setOverlayFixedTop12();
//             } else if (!shouldFix && overlayIsFixed) {
//                 setOverlayAbsoluteTop0();
//             } else {
//                 // 상태 유지(안정)
//                 if (overlayIsFixed) setOverlayFixedTop12();
//                 else setOverlayAbsoluteTop0();
//             }
//         };
//
//         // ======================================================
//         // ✅ 4. 텍스트 애니메이션은 phase1 전체(시작~끝) 동안 진행 (fixed 여부와 무관)
//         // ======================================================
//         const updatePhase1Text = (pText: number) => {
//             if (!overlay) return;
//
//             // phase1 끝나면 완전 숨김
//             if (pText >= TEXT_PHASE_END) {
//                 overlay.style.opacity = '0';
//                 overlay.style.visibility = 'hidden';
//
//                 setLine(elHeader, 0);
//                 setLine(elLine1, 0);
//                 setLine(elS1, 0);
//                 setLine(elS2, 0);
//                 setLine(elS3, 0);
//                 setLine(elS4, 0);
//                 return;
//             }
//
//             overlay.style.visibility = 'visible';
//
//             // phase1 0..TEXT_PHASE_END => 0..1
//             const q = clamp01(pText / TEXT_PHASE_END);
//
//             // ✅ overlay 전체 fade-out은 맨 끝에서만
//             const fadeOut = 1 - smoothstep(0.92, 1.0, q);
//             overlay.style.opacity = String(fadeOut);
//
//             // ✅ 핵심: header는 "등장 순간(q=0)"부터 바로 증가해야 함
//             // (딜레이 제거)
//             const hA = smoothstep(0.00, 0.18, q);
//
//             // line1도 거의 바로 따라오게(약간만 늦게)
//             const lA = smoothstep(0.08, 0.30, q);
//
//             // subs는 더 뒤에서 천천히
//             const sA1 = smoothstep(0.32, 0.52, q);
//             const sA2 = smoothstep(0.40, 0.62, q);
//             const sA3 = smoothstep(0.50, 0.74, q);
//             const sA4 = smoothstep(0.62, 0.86, q);
//
//             setLine(elHeader, hA);
//             setLine(elLine1, lA);
//             setLine(elS1, sA1);
//             setLine(elS2, sA2);
//             setLine(elS3, sA3);
//             setLine(elS4, sA4);
//         };
//
//
//         // ======================================================
//         // Canvas draw (phase2)
//         // - ✅ 1. phase1이랑 phase2는 겹치면 안됨 -> pText가 끝난 뒤에만 withVOB 등장
//         // ======================================================
//         const FONT_FAMILY = `"Noto Serif KR","Noto Serif JP","Noto Serif SC","Noto Serif TC","Times New Roman",serif`;
//         const withVOB = 'with VOB';
//
//         const fitFontSize = (text: string, targetPx: number, maxWidth: number, weight = 800) => {
//             ctx.font = `${weight} ${targetPx}px ${FONT_FAMILY}`;
//             const w = ctx.measureText(text).width;
//             if (w <= maxWidth) return targetPx;
//             return Math.max(11, Math.floor(targetPx * (maxWidth / w)));
//         };
//
//         const PEAK_GRAY = 95;
//         const EDGE = 0.06;
//         const bump01 = (x: number) => Math.sin(Math.PI * clamp01(x));
//
//         const calcBgGray = (p: number) => {
//             const x = clamp01(p);
//             if (x <= EDGE || x >= 1 - EDGE) return 30;
//             const tt = (x - EDGE) / (1 - 2 * EDGE);
//             return lerpInt(30, PEAK_GRAY, bump01(tt));
//         };
//
//         const PHASE2_START_CANVAS = 0.06; // phase2 시작점 (원하면 조절)
//
//         const draw = (pCanvas: number, pText: number) => {
//             const w = Math.max(1, window.innerWidth);
//             const h = Math.max(1, window.innerHeight);
//             const maxTextWidth = Math.max(1, w - PADDING_X * 2);
//
//             // 배경
//             const bgGray = calcBgGray(pCanvas);
//             ctx.fillStyle = `rgba(${bgGray},${bgGray},${bgGray},1)`;
//             ctx.fillRect(0, 0, w, h);
//
//             // ✅ sticky 시작 전엔 phase2 없음
//             if (pCanvas <= 0) return;
//
//             // ✅ phase2 시작점 (pCanvas로 제어)
//             if (pCanvas < PHASE2_START_CANVAS) return;
//
//             // ✅ phase2 내부 progress로 재매핑
//             const pA = clamp01((pCanvas - PHASE2_START_CANVAS) / (1 - PHASE2_START_CANVAS));
//
//             const anchorX = w / 2;
//             const anchorY = h / 2;
//
//             const withBasePx = Math.max(18, w * 0.06);
//             const WITH_MAX_SCALE = 1.22;
//             const withMaxSize = fitFontSize(withVOB, withBasePx * WITH_MAX_SCALE, maxTextWidth, 800);
//
//             const appearRaw = clamp01((pA - WITH_START) / (PHASE3_START - WITH_START));
//             const appear = easeOutCubic(appearRaw);
//
//             const appearScale = lerp(0.55, WITH_MAX_SCALE, appear);
//             const withSize = fitFontSize(withVOB, withBasePx * appearScale, maxTextWidth, 800);
//
//             ctx.textBaseline = 'middle';
//             ctx.font = `800 ${withSize}px ${FONT_FAMILY}`;
//             const withW = ctx.measureText(withVOB).width;
//             const withX = anchorX - withW / 2;
//             const withY = anchorY;
//
//             const isPhase3 = pA >= PHASE3_START;
//
//             if (pA >= WITH_START && pA < PHASE3_START) {
//                 ctx.save();
//                 ctx.globalAlpha = appear;
//                 ctx.fillStyle = FG;
//                 ctx.font = `800 ${withSize}px ${FONT_FAMILY}`;
//                 ctx.fillText(withVOB, withX, withY);
//                 ctx.restore();
//             }
//
//             if (isPhase3) {
//                 const z3A = clamp01((pA - PHASE3_START) / (1 - PHASE3_START));
//
//                 const SCALE_END = 0.78;
//                 const zScale = clamp01(z3A / SCALE_END);
//                 const zFade = clamp01((z3A - SCALE_END) / (1 - SCALE_END));
//
//                 const scale2 = lerp(1, getZoomMax(), accel2(zScale));
//                 const textAlpha = 1 - easeInOutCubic(zFade);
//
//                 ctx.font = `800 ${withMaxSize}px ${FONT_FAMILY}`;
//                 const withWMax = ctx.measureText(withVOB).width;
//                 const withXMax = anchorX - withWMax / 2;
//                 const withYMax = anchorY;
//
//                 ctx.save();
//                 ctx.translate(anchorX, anchorY);
//                 ctx.scale(scale2, scale2);
//                 ctx.translate(-anchorX, -anchorY);
//
//                 if (textAlpha > 0.001) {
//                     ctx.globalAlpha = textAlpha;
//                     ctx.fillStyle = FG;
//                     ctx.font = `800 ${withMaxSize}px ${FONT_FAMILY}`;
//                     ctx.fillText(withVOB, withXMax, withYMax);
//                 }
//
//                 ctx.restore();
//                 ctx.globalAlpha = 1;
//             }
//         };
//
//
//         // ======================================================
//         // About opacity (canvas 기준)
//         // ======================================================
//         const updateAboutOpacity = (pCanvas: number) => {
//             const FADE_IN_START = 0.90;
//             const FADE_IN_END = 1.0;
//
//             const a = smoothstep(FADE_IN_START, FADE_IN_END, pCanvas);
//
//             aboutLayer.style.opacity = String(a);
//             aboutLayer.style.pointerEvents = a > 0.01 ? 'auto' : 'none';
//             aboutLayer.style.transform = `translate(-50%,-50%) scale(${lerp(0.98, 1.0, a)})`;
//         };
//
//         // ======================================================
//         // RAF loop
//         // ======================================================
//         let rafId: number | null = null;
//         let lastT = 0;
//
//         const updateProgress = () => {
//             // ✅ 3. overlay 고정/해제는 canvasSection top 기준으로만
//             updateOverlayPin();
//
//             latestTextP = getTextProgress();
//             latestCanvasP = getCanvasProgress();
//
//             // ✅ 4. 텍스트 애니메이션은 phase1 전체에 걸쳐 진행 (fixed 무관)
//             updatePhase1Text(latestTextP);
//
//             updateAboutOpacity(latestCanvasP);
//         };
//
//         const tick = (ms: number) => {
//             if (!lastT) lastT = ms;
//             const dt = Math.min(0.05, (ms - lastT) / 1000);
//             lastT = ms;
//
//             const FOLLOW_TEXT = isMobile() ? 10 : 7;
//             animTextP += (latestTextP - animTextP) * (1 - Math.exp(-FOLLOW_TEXT * dt));
//
//             const FOLLOW_CANVAS = isMobile() ? 12 : 7;
//             animCanvasP += (latestCanvasP - animCanvasP) * (1 - Math.exp(-FOLLOW_CANVAS * dt));
//
//             // draw(animCanvasP, animTextP);
//             draw(animCanvasP, latestTextP);
//
//             rafId = window.requestAnimationFrame(tick);
//         };
//
//         let pending = false;
//         const onScroll = () => {
//             if (pending) return;
//             pending = true;
//             requestAnimationFrame(() => {
//                 pending = false;
//                 updateProgress();
//             });
//         };
//
//         const onResize = () => {
//             setCanvasSize();
//             updateProgress();
//             // draw(animCanvasP, animTextP);
//             draw(animCanvasP, latestTextP);
//         };
//
//         const start = async () => {
//             try {
//                 // @ts-ignore
//                 if (document?.fonts?.ready) await document.fonts.ready;
//             } catch {}
//
//             setCanvasSize();
//
//             // 초기 overlay 상태 강제(겹침 조건: 섹션 최상단과 overlay 최상단 동일)
//             if (overlay) setOverlayAbsoluteTop0();
//
//             updateProgress();
//
//             animTextP = latestTextP;
//             animCanvasP = latestCanvasP;
//
//             draw(animCanvasP, animTextP);
//
//             window.addEventListener('scroll', onScroll, { passive: true });
//             window.addEventListener('resize', onResize);
//
//             rafId = window.requestAnimationFrame(tick);
//         };
//
//         start();
//
//         return () => {
//             window.removeEventListener('scroll', onScroll as any);
//             window.removeEventListener('resize', onResize as any);
//             if (rafId) window.cancelAnimationFrame(rafId);
//         };
//     }, [s1, s2, s3, s4]);
//
//     return (
//         <section className={styles.heroSection} style={{ background: BG }}>
//             {/* 1) VISION */}
//             <div ref={visionRef} className={styles.vision}>
//                 <div className={styles.visionWrapper}>
//                     <div className={styles.visionContent}>
//                         <div className={styles.visionElem}>
//                             <div>
//                                 {newsBundles[0] && (
//                                     <NewsAcc
//                                         data={newsBundles[0].data}
//                                         imgSrc={newsBundles[0].imgSrc}
//                                         index={newsBundles[0].index}
//                                     />
//                                 )}
//                             </div>
//
//                             <div className={styles.visionMainText}>
//                                 <div className={styles.visionHeader}>
//                                     <Image className={styles.vobImg} src={vobPic} height={32} alt="vob icon" />
//                                     <p className={styles.headerText}>The Vision of Blockchain</p>
//                                 </div>
//                                 <p className={`${styles.visionText} ${styles.detailText}`}>{t('vision')}</p>
//                                 <p className={`${styles.visionText} ${styles.detailText}`}>{t('vision_down')}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//             {/* 2) CANVAS 섹션 */}
//             <div
//                 className={styles.canvas}
//                 ref={canvasSectionRef}
//                 style={{
//                     position: 'relative',
//                     height: '980vh',
//                 }}
//             >
//                 <div className={styles.stageInner}>
//                     <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
//                 </div>
//
//                 {/* ✅ 기본은 absolute (JS가 fixed/absolute 전환 담당) */}
//                 <div id="phase1Overlay" className={styles.phase1Overlay}>
//                     <p id="p1_header" className={styles.p1Header}>
//                         VOB 1.0 Smart Trading
//                     </p>
//                     <p id="p1_line1" className={styles.p1Line1}>
//                         Experience Emotion-Free Trading
//                     </p>
//
//                     <div className={styles.p1Divider} />
//
//                     <p id="p1_s1" className={styles.p1Sub}>
//                         {s1}
//                     </p>
//                     <p id="p1_s2" className={styles.p1Sub}>
//                         {s2}
//                     </p>
//                     <p id="p1_s3" className={styles.p1Sub}>
//                         {s3}
//                     </p>
//                     <p id="p1_s4" className={styles.p1Sub}>
//                         {s4}
//                     </p>
//                 </div>
//             </div>
//
//             {/* 3) ABOUT 섹션 */}
//             <div style={{ position: 'relative', height: '55vh' }}>
//                 <div
//                     ref={aboutBtnRef}
//                     style={{
//                         position: 'fixed',
//                         left: '50%',
//                         top: '50%',
//                         transform: 'translate(-50%,-50%)',
//                         opacity: 0,
//                         pointerEvents: 'none',
//                         zIndex: 50,
//                         willChange: 'opacity, transform',
//                     }}
//                 >
//                     <NavigationLink href="/about">
//                         <button className={styles.about}>{t('about')}</button>
//                     </NavigationLink>
//                 </div>
//             </div>
//         </section>
//     );
// };

'use client';

console.log('Main module loaded');

import { useTranslations } from 'next-intl';
import styles from './styles.module.css';
import Image from 'next/image';
import vobPic from '@/public/vob_crop.png';
import { NavigationLink } from '@/ui/NavigationLink';

import { NewsAcc } from '@/ui/NewsAcc';
import type { NewsItem } from '@/newsMapper';

const BG = 'rgba(30, 30, 30, 1)';

type NewsBundle = {
    data: NewsItem[];
    imgSrc: string[];
    index: number;
};

export const Main = ({ locale, newsBundles }: { locale: string; newsBundles: NewsBundle[] }) => {
    const t = useTranslations('hero');

    return (
        <section className={styles.heroSection} style={{ background: BG }}>
            {/* 1) VISION */}
            <div className={styles.vision}>
                <div className={styles.visionWrapper}>
                    <div className={styles.visionContent}>
                        <div className={styles.visionElem}>
                            <div>
                                {newsBundles[0] && (
                                    <NewsAcc
                                        data={newsBundles[0].data}
                                        imgSrc={newsBundles[0].imgSrc}
                                        index={newsBundles[0].index}
                                    />
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
                    </div>
                </div>
            </div>

            {/* 2) ABOUT 섹션 */}
            <div className={styles.aboutSection}>
                <NavigationLink href="/about">
                    <button className={styles.about}>{t('about')}</button>
                </NavigationLink>
            </div>
        </section>
    );
};
