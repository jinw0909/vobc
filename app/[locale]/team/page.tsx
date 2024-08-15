import styles from './styles.module.css';
import { Team } from "@/components/Team";
import {getMessages, unstable_setRequestLocale} from "next-intl/server";
import {NextIntlClientProvider} from "next-intl";
export default async function Page({params : { locale }} : {params : {locale : string}}) {
    unstable_setRequestLocale(locale);
    const messages = await getMessages();

    return (
        <div className={styles.teamWrapper}>
            <NextIntlClientProvider messages={messages}>
                <Team/>
            </NextIntlClientProvider>
        </div>
    )
}