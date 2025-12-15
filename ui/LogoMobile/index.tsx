import Image from 'next/image';
import logoPic from '@/public/vob_logo_2.png';
import styles from './styles.module.css'
import { Vollkorn } from 'next/font/google';
import {Kaisei_HarunoUmi} from "next/font/google";
// import Link from 'next/link';
import {NavigationLink} from "@/ui/NavigationLink";

const vollkorn = Vollkorn({
    subsets: ["latin"],
});
const kaisei = Kaisei_HarunoUmi({
    weight: ['400', '500', '700'],
    subsets: ["latin-ext"]
});


export const LogoMobile = ({onClick} : any) => {
    return (
        <NavigationLink href="/" onClick={onClick}>
            <div className={styles.logoWrapper}>
                <Image
                    alt="Mobile logoImage"
                    src={logoPic}
                    width={16}
                    height={35}
                    unoptimized={true}
                />
                <div className={`${styles.logoText} ${vollkorn.className}`}>VOB</div>
            </div>
        </NavigationLink>
    )
}