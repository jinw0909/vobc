import Image from 'next/image';
import logoPic from '@/public/vob_logo_2.png';
import styles from './styles.module.css'
import localFont from "next/font/local";

import {NavigationLink} from "@/ui/NavigationLink";

const vollkorn = localFont({
    src: '../../public/fonts/Vollkorn/Vollkorn-VariableFont_wght.ttf',
    variable: '--font-vollkorn',
    display: 'block',
    preload: true
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