import styles from './styles.module.css'
import Image from 'next/image'
import vobLogo from '@/public/vob_logo_2.png';
import {Vollkorn} from "next/font/google";

const vollkorn = Vollkorn({
    subsets: ["latin"],
});
export function LogoPlain() {
    return (
        <div className={styles.logoWrapper}>
            <Image src={vobLogo} width={32} height={50} alt="v.o.b. logo"/>
            <div className={`${styles.logoText} ${vollkorn.className}`}>VOB</div>
        </div>
    )
}