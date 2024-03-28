import Link from 'next/link';
import {Noto_Sans_JP} from "next/font/google";
import {Noto_Serif_JP} from "next/font/google";
import {allowedDisplayValues} from "next/dist/compiled/@next/font/dist/constants";
import styles from "./styles.module.css";
import arrowPic from "@/public/icons/arrow-right.png";
import Image from "next/image";

const notosansjp = Noto_Sans_JP({
    weight: ['200', '300', '400', '500', '600', '700', '900'],
    style : "normal",
    subsets: ['latin']
});
export const Breadcrumb = async ({previous, current}) => {
    return (
        <div className={`${notosansjp.className} ${styles.breadcrumb}`}>
            <Image src={arrowPic} width={20} height={20} alt="breadcrumb pointer"/>
            <Link href="/">
                <span className={`${styles.previous}`}>{previous}</span>
            </Link>
            <span>/</span>
            <span className={styles.current}>{current}</span>
        </div>
    )
}