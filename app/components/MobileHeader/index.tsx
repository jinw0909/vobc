'use client';
import styles from './styles.module.css';
import { LogoMobile } from "@/app/ui/LogoMobile";
import { MenuBtn} from "@/app/ui/MenuBtn";
import {useState} from "react";
import {MobileNav} from "@/app/ui/MobileNav";

export const MobileHeader = ({lang}) => {
    const [clicked, setClicked] = useState(false);
    const handleClick = () => {
        setClicked(!clicked);
    }
    return (
        <header className={`${styles.header} ${clicked ? styles.clicked : ''}`}>
            <div className={styles.navigation}>
               <MenuBtn lang={lang} click={clicked} onClick={handleClick}/>
               <LogoMobile lang={lang}/>
            </div>
            <MobileNav lang={lang} click={clicked} onClick={handleClick}/>
        </header>
    )
}