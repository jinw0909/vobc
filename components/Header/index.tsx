import styles from './styles.module.css';
import { Nav } from "@/ui/Nav";
import { LogoMain } from "@/ui/LogoMain";
import { Language } from "@/ui/Language";
// import {NextIntlClientProvider, useMessages} from "next-intl";
// import {notFound} from "next/navigation";
import { Suspense} from "react";

export const Header = ({lang} : {lang: string}) => {

    // let messages = useMessages();

    return (
        <div className={styles.headerLayout}>
            <header className={styles.header}>
                <div className={styles.headerWrapper}>
                    <LogoMain/>
                    <Nav />
                </div>
                <Suspense>
                    <Language lang={lang}/>
                </Suspense>
            </header>
        </div>
    )
}