import Image from 'next/image';
import logoPic from '@/public/vob_logo_2.png';
import styles from './styles.module.css'
import localFont from 'next/font/local';
import {NavigationLink} from "@/ui/NavigationLink";

const vollkorn = localFont({
    src: [
        {
            path: '../../public/fonts/Vollkorn/static/Vollkorn-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../public/fonts/Vollkorn/static/Vollkorn-Medium.ttf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../../public/fonts/Vollkorn/static/Vollkorn-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
    ],
    variable: '--font-vollkorn',
    display: 'swap',
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