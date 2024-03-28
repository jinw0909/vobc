import {inspect} from "util";
import styles from './styles.module.css';
import { Nav } from "@/app/ui/Nav";
import { LogoMain } from "@/app/ui/LogoMain";
import { Language } from "@/app/ui/Language";
import { getDictionary } from "@/app/[lang]/dictionaries";
export const Header = async ({lang}) => {
    const dict = await getDictionary(lang);
    return (
        <div className={styles.headerLayout}>
            <header className={styles.header}>
                <div className={styles.headerWrapper}>
                    <LogoMain lang={lang}>Logo</LogoMain>
                    <Nav dict={dict} lang={lang}/>
                </div>
                <Language lang={lang}/>
            </header>
        </div>
    )
}