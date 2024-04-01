import styles from './styles.module.css';
import { Nav } from "@/ui/Nav";
import { LogoMain } from "@/ui/LogoMain";
import { Language } from "@/ui/Language";
import {NextIntlClientProvider, useMessages} from "next-intl";
import {notFound} from "next/navigation";


export const Header = ({lang} : {lang: string}) => {

    // let messages;
    // try {
    //     messages = (await import(`@/messages/${lang}.json`)).default;
    //     console.log("messages: ", messages);
    // } catch (error) {
    //     console.error('Failed to load messages: ', error);
    //     notFound();
    // }
    let messages = useMessages();

    return (
        <div className={styles.headerLayout}>
            <header className={styles.header}>
                <div className={styles.headerWrapper}>
                    <LogoMain/>
                    {/*<NextIntlClientProvider messages={messages}>*/}
                        <Nav lang={lang}/>
                    {/*</NextIntlClientProvider>*/}
                </div>
                <Language lang={lang}/>
            </header>
        </div>
    )
}