import styles from './styles.module.css';
import { Nav } from "@/ui/Nav";
import { LogoMain } from "@/ui/LogoMain";
import { Language } from "@/ui/Language";
// import {NextIntlClientProvider, useMessages} from "next-intl";
// import {notFound} from "next/navigation";
import { Suspense} from "react";
import {Breadcrumbs} from "@/ui/Breadcrumbs";
import {HeaderMeasure} from "@/components/Header/_components";

export const Header = ({lang} : {lang: string}) => {

    // let messages = useMessages();

    return (
        <HeaderMeasure>
            <div className={styles.headerLayout}>
                <header className={styles.header} data-header-root>
                    <div className={styles.headerWrapper}>
                        <LogoMain/>
                        <Nav />
                    </div>
                    <Breadcrumbs/>
                    <Suspense>
                        <Language lang={lang}/>
                    </Suspense>
                </header>
            </div>
        </HeaderMeasure>
    )
}