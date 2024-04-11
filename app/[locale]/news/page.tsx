import { News } from '@/components/News';
import styles from './styles.module.css'
export default function news() {
    return (
        <div className={styles.newsWrapper}>
            <News/>
        </div>
    )
}