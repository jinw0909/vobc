import Link from 'next/link';
import { Locale, getDictionary } from "@/app/[lang]/dictionaries";
import styles from './styles.module.css';
import { About } from "@/app/components/About";
import {Breadcrumb} from "@/app/ui/Breadcrumb";

type Props = {
    params : {
        lang: Locale
    }
}
export default async function Page({params: { lang } }) {
    const dict = await getDictionary(lang);
    return (
        <>
            <div className={styles.aboutWrapper}>
                <Breadcrumb previous={dict.nav.home} current={dict.nav.about}/>
                <About lang={lang}/>
            </div>
        </>
    )
}