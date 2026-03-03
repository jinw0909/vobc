import styles from './styles.module.css'
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay} from "swiper/modules";
import {Whitepaper} from "@/components/Whitepaper";
import {DevsMain} from "@/components/DevsMain";
import {SmartContract} from "@/components/SmartContract";

export function Technology() {
    return (
        <>
            <Swiper
                modules={[Autoplay]}
                loop
                speed={1000} // autoplay 이동 시간
                autoplay={{
                    delay: 1500,                // ✅ 이 멈춤 시간 동안만 드래그 허용
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                freeMode={false}              // ✅ 추천(필수는 아님). 튐/꼬임 크게 줄어듦
                allowTouchMove={true}         // 기본은 true
                spaceBetween={24}
                breakpoints={{
                    0: { slidesPerView: 1 },
                    576: { slidesPerView: 2 },
                    1028: { slidesPerView: 3 },
                }}
                onSwiper={(sw) => {
                    // 시작 상태: 드래그 허용(=delay 구간이라고 가정)
                    sw.allowTouchMove = true
                }}

                // ✅ autoplay가 슬라이드 "이동" 시작할 때 잠금
                onSlideChangeTransitionStart={(sw) => {
                    sw.allowTouchMove = false
                }}

                // ✅ 이동이 끝나면(=delay 구간) 다시 허용
                onSlideChangeTransitionEnd={(sw) => {
                    sw.allowTouchMove = true
                }}

                // ✅ 사용자가 눌렀는데(터치 시작) 만약 아직 잠금 상태면 바로 막기
                onTouchStart={(sw) => {
                    if (!sw.allowTouchMove) return
                }}
                className={styles.introSwiper}
            >
                <SwiperSlide className={styles.slide}><Whitepaper /></SwiperSlide>
                <SwiperSlide className={styles.slide}><DevsMain /></SwiperSlide>
                <SwiperSlide className={styles.slide}><SmartContract /></SwiperSlide>
            </Swiper>
        </>
    )
}