'use client';
import styles from './styles.module.css';
import { LogoMobile } from "@/ui/LogoMobile";
import { MenuBtn} from "@/ui/MenuBtn";
import {useState} from "react";
import {MobileNav} from "@/ui/MobileNav";

export const MobileHeader = ({lang} : {lang : string}) => {
    const [clicked, setClicked] = useState(false);
    const handleClick = () => {
        setClicked(!clicked);
    }
    return (
        <header className={`${styles.header} ${clicked ? styles.clicked : ''}`}>
            <div className={styles.navigation}>
               <MenuBtn click={clicked} onClick={handleClick}/>
               <LogoMobile lang={lang}/>
            </div>
            <MobileNav lang={lang} click={clicked} onClick={handleClick}/>
        </header>
    )
}