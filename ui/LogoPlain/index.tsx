import styles from './styles.module.css'
import Image from 'next/image'
import vobLogo from '@/public/vob_logo_2.png';
// import {Vollkorn} from "next/font/google";
import localFont from "next/font/local";

// const vollkorn = Vollkorn({
//     subsets: ["latin"],
// });

const vollkorn = localFont({
    src: '../../public/fonts/Vollkorn/Vollkorn-VariableFont_wght.ttf',
    variable: '--font-vollkorn',
    display: 'block',
    preload: true
})
export function LogoPlain() {
    return (
        <div className={styles.logoWrapper}>
            <Image src={vobLogo} width={22} height={50} alt="v.o.b. logo"/>
            <div className={`${styles.logoText} ${vollkorn.className}`}>VOB</div>
        </div>
    )
}