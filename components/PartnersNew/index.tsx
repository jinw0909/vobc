'use client';
import {useEffect, useState} from 'react';
import styles from './styles.module.css';
import Link from "next/link";
import { useTranslations } from "next-intl";
import Image, { StaticImageData } from 'next/image';
import { LogoPlain } from "@/ui/LogoPlain";
import crossWhite from '@/public/icons/cross-white.png';
import lbankLogo from '@/public/exchange/lbank-logo-yellow.webp';
import cointrLogo from '@/public/exchange/cointrwhite-logo.png';
import deepcoinLogo from '@/public/exchange/deepcoinLogo.png';

export function PartnersNew() {
    const t = useTranslations('partners');

    const [clickedWrapperIndex, setClickedWrapperIndex] = useState<number | null>(null);
    const [clickedElementIndex, setClickedElementIndex] = useState<number | null>(null);
    const [elementsPerGroup, setElementsPerGroup] = useState(3); // Default to 3 items per group


    const partnersElems = [
        { id: 1, name: 'lbank', type: 'exchange', logo: 'lbankLogo', url: 'https://www.lbank.com/trade/vob_usdt', color: '#FFD800'},
        { id: 2, name: 'deepcoin', type: 'exchange', logo: 'deepcoinLogo', url: 'https://www.deepcoin.com', color: '#FE7701'},
        // { id: 3, name: 'cointrpro', type: 'exchange', logo: 'cointrLogo', url: '/', color: '#03D56F', desc: 'CoinTR.com is an integrated international Cryptocurrency platform founded in 2022. Powerful founders of traditional Turkish financial institutions and experienced team members from top crypto exchanges in London &amp; Istanbul, Turkey make us more competitive and trustworthy.', },
        // { id: 4, name: 'Partner 4', type: 'exchange', logo: 'lbankLogo', url: '/', color: '#FFD800', desc: 'jkl',  },
        // { id: 5, name: 'Partner 5', type: 'partner', logo: 'lbankLogo', url: '/', color: '#FE7701', desc: 'mno',  },
    ];

    // Map logo names to imported images
    const logoMap: { [key: string]: StaticImageData } = {
        lbankLogo,
        cointrLogo,
        deepcoinLogo
    };

    // Function to update elements per group based on viewport width
    const updateElementsPerGroup = () => {
        if (window.innerWidth < 768) {
            setElementsPerGroup(2); // 2 elements per group for smaller screens
        } else {
            setElementsPerGroup(3); // Default to 3 elements per group for larger screens
        }
    };
// Listen for resize events and update elements per group
    useEffect(() => {
        updateElementsPerGroup(); // Initial check
        window.addEventListener('resize', updateElementsPerGroup);
        return () => window.removeEventListener('resize', updateElementsPerGroup); // Cleanup on unmount
    }, []);

    // Group partners based on elementsPerGroup
    const groupedPartners = [];
    for (let i = 0; i < partnersElems.length; i += elementsPerGroup) {
        groupedPartners.push(partnersElems.slice(i, i + elementsPerGroup));
    }

    const handleClick = (wrapperIndex: number, elementIndex: number) => {
        if (clickedWrapperIndex === wrapperIndex && clickedElementIndex === elementIndex) {
            setClickedWrapperIndex(null);
            setClickedElementIndex(null);
        } else {
            setClickedWrapperIndex(wrapperIndex);
            setClickedElementIndex(elementIndex);
        }
    };

    // Reset all clicked and hidden states by setting indexes to null
    const resetSelection = () => {
        setClickedWrapperIndex(null);
        setClickedElementIndex(null);
    };

    // Get the description of the currently clicked element, if any
    const currentDescription =
        clickedWrapperIndex !== null && clickedElementIndex !== null
            ? t(groupedPartners[clickedWrapperIndex][clickedElementIndex].name)
            : '';

    return (
        <div className={styles.partnersNew}>
            <div className={styles.title}>{t('title')}</div>
            <div className={styles.desc}>{t('subtitle')}</div>
            {groupedPartners.map((group, groupIndex) => (
                <div
                    key={groupIndex}
                    className={`${styles.partnersWrapper} ${
                        clickedWrapperIndex !== null ? styles.noGap : ''
                    } ${clickedWrapperIndex !== null && clickedWrapperIndex !== groupIndex
                        ? styles.hideWrapper
                        : ''
                    }`}
                >
                    {group.map((partner, index) => (
                        <div
                            key={partner.id}
                            className={`${styles.partnersElem} ${
                                clickedElementIndex === index && clickedWrapperIndex === groupIndex
                                    ? styles.clicked
                                    : ''
                            } ${
                                clickedElementIndex !== null &&
                                (clickedWrapperIndex !== groupIndex || clickedElementIndex !== index)
                                    ? styles.hidden
                                    : ''
                            } ${styles[partner.type]}`} // Dynamically apply class based on 'type'
                            onClick={() => handleClick(groupIndex, index)}
                        >
                            {/* Conditionally render elements if partner.type is 'exchange' */}
                            {partner.type === 'exchange' && (
                                <div className={styles.elemContent}>
                                    <div className={styles.vobElem}><LogoPlain/></div>
                                    <div className={styles.startElem}>
                                        <Link href={partner.url} target="_blank" rel="noopener noreferrer"
                                              locale={false}>
                                            <button
                                                className={styles.startBtn}
                                                style={{border: `2px solid ${partner.color}`}} // Apply dynamic border color
                                            >
                                                <span>{t('startbtn')}</span>
                                            </button>
                                        </Link>
                                    </div>
                                    <div className={styles.logoElem}>
                                        <Image
                                            className="p-4"
                                            src={logoMap[partner.logo]}
                                            width={200}
                                            height={100}
                                            alt={`${partner.name} logo`}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className={styles.circleElem}>
                                <svg
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 102 102"
                                    className={styles.svgContainer}
                                >
                                    <rect
                                        className={styles.btnCircle}
                                        x="0.5"
                                        y="0.5"
                                        width="101"
                                        height="101"
                                        fill="none"
                                        stroke="#999"
                                        strokeWidth="0.25"
                                        rx="10"
                                        ry="10"
                                    ></rect>
                                    <rect
                                        className={styles.btnCircleProg}
                                        x="0.5"
                                        y="0.5"
                                        width="101"
                                        height="101"
                                        fill="none"
                                        stroke={partner.color} // Apply dynamic stroke color
                                        strokeWidth="1"
                                        strokeDasharray="0 400"
                                        strokeDashoffset="0"
                                        rx="10"
                                        ry="10"
                                    ></rect>
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
            <div className={styles.partnersDetail} onClick={resetSelection}>
                {currentDescription}
            </div>
        </div>
    );
}
