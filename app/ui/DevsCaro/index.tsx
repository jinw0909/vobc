'use client';
import Image from 'next/image';
import firstPic from '@/public/devs_security_1.png';
import secondPic from '@/public/devs_security_2.png';
import styles from './styles.module.css'
import { useState, useEffect, useRef } from "react";

export const DevsCaro = () => {

    const [showModal, setShowModal] = useState(false);
    const [imgIdx, setImgIdx] = useState(0);
    const modalRef = useRef(null);

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            modalRef.current.style.opacity = 0;
            setTimeout(() => {
                setShowModal(false);
            }, 1000)
        }
    }
    const handleShowModal = (idx) => {
        setImgIdx(idx);
        setShowModal(true);

    }

    useEffect(() => {
        if (showModal) {
            if (modalRef.current) {
               modalRef.current.style.opacity = 1;
            }
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        //cleanup function
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showModal]);

    return (
        <div className={styles.caroWrapper}>
            <div className={styles.caroElem} onClick={() => handleShowModal(0)}>
                <Image
                    src={firstPic} width={200} height={200}
                    alt="describing security architecture one"
                    quality={100}
                />
            </div>
            <div className={`${styles.caroElem} self-stretch`} onClick={() => handleShowModal(1)}>
                <Image
                    src={secondPic} width={300} height={300}
                    alt="describing security architecture two"
                    quality={100}
                />
            </div>
            {   showModal &&
                <>
                <div className={styles.modalBg}></div>
                <div ref={modalRef} className={styles.caroModal}>
                    <Image className={styles.imgStyle}
                        src={firstPic}
                        fill={true}
                        style={{ display : imgIdx === 0 ? 'block' : 'none', objectFit: "contain"}}
                        alt="image introducing technology"
                    />
                    <Image
                        src={secondPic}
                        width={500}
                        height={500}
                        style={{ display : imgIdx === 1 ? 'block' : 'none' }}
                        alt="second image introducing technology"
                    />
                </div>
                </>
            }
        </div>
    )
}