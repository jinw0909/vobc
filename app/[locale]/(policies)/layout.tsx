import styles from './styles.module.css';
import {setRequestLocale} from "next-intl/server";
export default async function Layout({
    children,
    params
} :
   any
) {
    const { locale } = await params;
    setRequestLocale(locale)

    return (
        <div>
            {children}
        </div>
    )
}