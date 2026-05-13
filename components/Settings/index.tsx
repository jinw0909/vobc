import styles from './styles.module.css'
import Connect from "@/ui/Connect";
import {Language} from "@/ui/Language";

export default function Settings() {
    return (
        <div className={styles.settings}>
            <Connect/>
            <Language lang="en"/>
        </div>
    )
}