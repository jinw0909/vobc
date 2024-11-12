import styles from './styles.module.css';
import {setRequestLocale, unstable_setRequestLocale} from "next-intl/server";
export default function Layout({
    children,
    params: { locale }
} : {
    children: React.ReactNode;
    params: { locale: string }
}) {
    setRequestLocale(locale)

    return (
        <div>
            {children}
        </div>
    )
}