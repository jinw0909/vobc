import styles from './styles.module.css'
import {Devs} from "@/app/components/Devs";
import {getDictionary, Locale} from "@/app/[lang]/dictionaries";
import {Breadcrumb} from "@/app/ui/Breadcrumb";

type Props = {
    params : {
        lang: Locale
    }
}
export default async function Page({params : { lang }}) {
    const dict = await getDictionary(lang);
    return (
        <div className={styles.devsWrapper}>
            <Breadcrumb previous={dict.nav.home} current={dict.nav.devs}/>
            <Devs />
        </div>
    )
}