import styles from './styles.module.css'
import {Devs} from "@/components/Devs";

export default async function Page() {
    console.log("devlocale: ");
    return (
        <div className={styles.devsWrapper}>
            <Devs />
        </div>
    )
}