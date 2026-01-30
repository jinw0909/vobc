'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';

import { Main } from '@/components/Main';
import { Whitepaper } from '@/components/Whitepaper';
import { SmartContract } from '@/components/SmartContract';
import { DevsMain } from '@/components/DevsMain';
import { Roadmap } from '@/components/Roadmap';
import { Distribution } from '@/components/Distribution';
import { PartnersNew } from '@/components/PartnersNew';

export async function Introduction() {

    return (
        <>
            <div className={styles.subWrapperPlus}>
                <Whitepaper />
                <SmartContract />
                <DevsMain />
            </div>

            <div className={styles.subWrapper}>
                <Roadmap />
            </div>

            <div className={styles.subWrapper}>
                <Distribution />
            </div>

            <div className={styles.subWrapper}>
                <PartnersNew />
            </div>
        </>
    );
}
