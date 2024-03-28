import Image from 'next/image';
import logoPic from '@/public/vob_logo_2.png';
import styles from './styles.module.css'
import { Vollkorn } from 'next/font/google';
import {Kaisei_HarunoUmi} from "next/font/google";

const vollkorn = Vollkorn({
    subsets: ["latin"],
});
const kaisei = Kaisei_HarunoUmi({
    weight: ['400', '500', '700'],
    subsets: ["latin-ext"]
});


export const LogoSub = async ({color, fontSize, position}) => {
    return (
        <div className={styles.logoWrapper}>
           <Image
               alt="logoImage"
               src={logoPic}
               width={15}
               height={45}
               quality={100}
           />
            <div className={`${styles.logoText} ${vollkorn.className}`}>VOB</div>
        </div>
    )
}