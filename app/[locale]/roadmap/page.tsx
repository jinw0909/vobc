// Roadmap3x3.tsx
"use client";

import { useState } from "react";
import styles from "./Roadmap3x3.module.css";

type RoadmapItem = {
    id: number;
    title: string;
    desc: string;
};

const ROADMAP_ITEMS: RoadmapItem[] = [
    { id: 1, title: "VOB 1.0 출시", desc: "AI 기반 스마트 트레이딩 런칭" },      // center (가장 최근)
    { id: 2, title: "모바일 앱 베타", desc: "iOS · Android 베타 오픈" },           // 6시
    { id: 3, title: "백오피스 개선", desc: "관리자 대시보드 업그레이드" },         // 7시
    { id: 4, title: "글로벌 리서치", desc: "해외 파트너 리서치 진행" },             // 9시
    { id: 5, title: "브랜드 리뉴얼", desc: "웹/앱 디자인 리브랜딩" },              // 11시
    { id: 6, title: "파트너십 MOU", desc: "국내 거래소와 전략적 제휴" },           // 12시
    { id: 7, title: "온체인 분석 1.0", desc: "온체인 데이터 인사이트 카드" },      // 1시
    { id: 8, title: "카피트레이드 고도화", desc: "고급 필터와 전략 추가" },        // 3시
    { id: 9, title: "거래 수수료 최적화", desc: "수수료 구조 개선" },              // 5시
];

// 0~8 인덱스를 3×3 grid 위치로 매핑
const GRID_POSITIONS = [
    { row: 2, col: 2 }, // 0: center
    { row: 3, col: 2 }, // 1: 6시
    { row: 3, col: 1 }, // 2: 7시
    { row: 2, col: 1 }, // 3: 9시
    { row: 1, col: 1 }, // 4: 11시
    { row: 1, col: 2 }, // 5: 12시
    { row: 1, col: 3 }, // 6: 1시
    { row: 2, col: 3 }, // 7: 3시
    { row: 3, col: 3 }, // 8: 5시
];

export default function Roadmap3x3() {
    // 확대된 카드의 index (없으면 null)
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const hasActive = activeIndex !== null;

    return (
        <div className={styles.wrapper}>
            <div
                className={`${styles.grid} ${hasActive ? styles.gridActive : ""}`}
            >
                {ROADMAP_ITEMS.map((item, index) => {
                    const pos = GRID_POSITIONS[index];
                    const isActive = activeIndex === index;

                    // 색 진해지는 정도 (가장 최근이 가장 진하거나 반대로 하고 싶으면 뒤집어도 됨)
                    const intensity = 1 - index * 0.07; // 0 → 1.0, 8 → 0.44 정도

                    const style: React.CSSProperties = isActive
                        ? {} // 확대 상태일 땐 absolute로 처리 (CSS에서)
                        : {
                            gridRow: pos.row,
                            gridColumn: pos.col,
                            // 색 농도 조절용 CSS 변수
                            "--intensity": intensity,
                        } as React.CSSProperties;

                    return (
                        <button
                            key={item.id}
                            className={`${styles.card} ${
                                isActive ? styles.cardActive : ""
                            }`}
                            style={style}
                            onClick={() =>
                                setActiveIndex((prev) =>
                                    prev === index ? null : index
                                )
                            }
                        >
                            <div className={styles.cardInner}>
                                <h3 className={styles.title}>{item.title}</h3>
                                <p className={styles.desc}>{item.desc}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
