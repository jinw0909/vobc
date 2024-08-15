import styles from './styles.module.css';
import {unstable_setRequestLocale} from "next-intl/server";
export default function Layout({
    children,
    params: { locale }
} : {
    children: React.ReactNode;
    params: { locale: string }
}) {
    unstable_setRequestLocale(locale)

    return (
        <div>
            {children}
        </div>
    )
}