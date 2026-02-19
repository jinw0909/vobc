import Image from 'next/image';
import logoPic from '@/public/vob_logo_2.png';
import styles from './styles.module.css'
import { Vollkorn } from 'next/font/google';
import {Kaisei_HarunoUmi} from "next/font/google";
import Link from 'next/link';
import {NavigationLink} from "@/ui/NavigationLink";


const vollkorn = Vollkorn({
    subsets: ["latin"],
});
const kaisei = Kaisei_HarunoUmi({
    weight: ['400', '500', '700'],
    subsets: ["latin-ext"]
});

export const LogoMain = async () => {
    return (
            <div className={styles.logoWrapper}>
                <NavigationLink href="/">
                    <div className={styles.logoElem}>
                       <Image
                           alt="logoImage"
                           src={logoPic}
                           width={25}
                           height={45}
                       />
                        <div className={`${styles.logoText} ${vollkorn.className}`}>VOB</div>
                    </div>
                </NavigationLink>
            </div>
    )
}