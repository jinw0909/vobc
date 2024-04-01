import Image from 'next/image';
import logoPic from '@/public/vob_logo_2.png';
import styles from './styles.module.css'
import { Vollkorn } from 'next/font/google';
import {Kaisei_HarunoUmi} from "next/font/google";
import Link from 'next/link';

const vollkorn = Vollkorn({
    subsets: ["latin"],
});
const kaisei = Kaisei_HarunoUmi({
    weight: ['400', '500', '700'],
    subsets: ["latin-ext"]
});


export const LogoMobile = ({lang} : {lang : string}) => {
    return (
        <Link href={`/${lang}`}>
            <div className={styles.logoWrapper}>
                <Image
                    alt="Mobile logoImage"
                    src={logoPic}
                    width={16}
                    height={35}
                    quality={100}
                />
                <div className={`${styles.logoText} ${vollkorn.className}`}>VOB</div>
            </div>
        </Link>
    )
}