import styles from './styles.module.css';
import { About } from "@/components/About";
import {setRequestLocale} from "next-intl/server";

export const metadata = {
    description: 'The VOB Token Economy is built upon its four major pillars. The payment economy, the global community, the NFT economy and the GOYABOT AI. The participants will be generating constant profits by leveraging the token economy’s unique features which is distinct from the rest.'
}

export default async function Page({ params } : any) {
    const { locale } = await params;
    setRequestLocale(locale);
    return (
        <>
            <div className={styles.aboutWrapper}>
                <About/>
            </div>
        </>
    )
}