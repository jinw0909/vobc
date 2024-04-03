import styles from './styles.module.css';
export default function Layout({
    children,
    params: { locale }
} : {
    children: React.ReactNode;
    params: { locale: string }
}) {

    return (
        <div>
            {children}
        </div>
    )
}