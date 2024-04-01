import styles from './styles.module.css';
import { About } from "@/components/About";

export default function Page() {
    return (
        <>
            <div className={styles.aboutWrapper}>
                <About/>
            </div>
        </>
    )
}