import styles from './styles.module.css'
import Guide from "@/components/Guide";
export default async function Page () {
    return (
        <div className={styles.guideWrapper}>
            <Guide/>
        </div>
    )
}