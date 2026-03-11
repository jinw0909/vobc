'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import styles from './styles.module.css'

import { Whitepaper } from '@/components/Whitepaper'
import { DevsMain } from '@/components/DevsMain'
import { SmartContract } from '@/components/SmartContract'

import 'swiper/css'
import 'swiper/css/effect-fade'

const slideContents = [
    <Whitepaper key="whitepaper" />,
    <DevsMain key="devs" />,
    <SmartContract key="contract" />,
]

export function Technology() {
    return (
        <section className={styles.techWrapper}>
            <div className={styles.pcOnly}>
                <TechnologyPc />
            </div>

            <div className={styles.tabletOnly}>
                <TechnologyTablet />
            </div>

            <div className={styles.mobileOnly}>
                <TechnologyMobile />
            </div>
        </section>
    )
}

function TechnologyPc() {
    return (
        <Swiper
            slidesPerView={3}
            spaceBetween={24}
            allowTouchMove={false}
            className={styles.introSwiper}
        >
            {slideContents.map((content, idx) => (
                <SwiperSlide className={styles.slide} key={`pc-${idx}`}>
                    {content}
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

function TechnologyTablet() {
    const slides = [
        <Whitepaper key="whitepaper" />,
        <DevsMain key="devs" />,
        <SmartContract key="contract" />,
    ]

    return (
        <Swiper
            slidesPerView={2.15}
            spaceBetween={24}
            speed={700}
            allowTouchMove
            grabCursor
            className={styles.tabletSwiper}
        >
            {slides.map((content, idx) => (
                <SwiperSlide key={idx} className={styles.tabletSlide}>
                    {content}
                </SwiperSlide>
            ))}
        </Swiper>
    )
}
function TechnologyMobile() {
    return (
        <div className={styles.mobileViewport}>
            <Swiper
                modules={[Autoplay, EffectFade]}
                loop
                speed={1200}
                slidesPerView={1}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                autoplay={{
                    delay: 2200,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                allowTouchMove={true}
                simulateTouch={true}
                onTouchStart={(sw) => {
                    sw.autoplay?.stop()
                }}
                onTouchEnd={(sw) => {
                    sw.autoplay?.start()
                }}
                className={`${styles.introSwiper} ${styles.mobileSwiper}`}
            >
                {slideContents.map((content, idx) => (
                    <SwiperSlide className={styles.slide} key={`mobile-${idx}`}>
                        {content}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}