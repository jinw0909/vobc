'use client';
import styles from './styles.module.css'
import {useState} from "react";
export const MenuBtn = ({click, onClick}) => {
    return (
        <div className={`${styles.menuWrapper} ${click ? styles.clicked : ''}`} onClick={onClick}>
            <span className={`${click ? styles.clicked : "hi"} ${styles.firstLine}`}></span>
            <span className={`${click ? styles.clicked : "hi"} ${styles.secondLine}`}></span>
            <span className={`${click ? styles.clicked : "hi"} ${styles.thirdLine}`}></span>
        </div>
    )
}