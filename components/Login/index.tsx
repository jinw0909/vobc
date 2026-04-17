'use client'
import styles from './styles.module.css';

import { Whitepaper } from '@/components/Whitepaper';
import { SmartContract } from '@/components/SmartContract';
import { DevsMain } from '@/components/DevsMain';
import { Roadmap } from '@/components/Roadmap';
import { Distribution } from '@/components/Distribution';
import { PartnersNew } from '@/components/PartnersNew';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Mousewheel } from 'swiper/modules';

// Swiper CSS (전역 1회만 import 해도 됨)
import 'swiper/css';
import {Technology} from "@/ui/Technology";
import {CommonHeader} from "@/ui/CommonHeader";

export function Login() {


    return (
        <>
            <div>
                Login Page
            </div>
        </>
    );
}