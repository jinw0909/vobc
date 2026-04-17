import Image from 'next/image';
import logoPic from '@/public/vob_logo_2.png';
import styles from './styles.module.css'
import localFont from 'next/font/local';
import {NavigationLink} from "@/ui/NavigationLink";

const vollkorn = localFont({
    src: '../../public/fonts/Vollkorn/Vollkorn-VariableFont_wght.ttf',
    variable: '--font-vollkorn',
    display: 'block',
    preload: true
});

export const LogoSub = async () => {
    return (
        <NavigationLink href="/">
            <div className={styles.logoWrapper}>
               <Image
                   alt="logoImage"
                   src={logoPic}
                   width={15}
                   height={45}
               />
                <div className={`${styles.logoText} ${vollkorn.className}`}>VOB</div>
            </div>
        </NavigationLink>
    )
}