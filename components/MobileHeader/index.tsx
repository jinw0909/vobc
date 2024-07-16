'use client';
import styles from './styles.module.css';
import { LogoMobile } from "@/ui/LogoMobile";
import { MenuBtn} from "@/ui/MenuBtn";
import {useState, useEffect, useRef } from "react";
import {MobileNav} from "@/ui/MobileNav";

export const MobileHeader = () => {

    const [clicked, setClicked] = useState(false);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const handleClick = () => {
        setClicked(!clicked);
    }
    const closeNav = () => {
        setClicked(false);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const node = headerRef.current;
            if (node && !node.contains(event.target as Node)) {
                setClicked(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [headerRef]);

    return (
        <header ref={headerRef} className={`${styles.header} ${clicked ? styles.clicked : ''}`}>
            <div className={styles.navigation}>
               <MenuBtn click={clicked} onClick={handleClick}/>
               <LogoMobile onClick={closeNav}/>
            </div>
            <MobileNav click={clicked} onClick={closeNav}/>
        </header>
    )
}