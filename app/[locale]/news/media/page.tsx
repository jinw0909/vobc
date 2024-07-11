import styles from './styles.module.css'
import { NewsMedia } from '@/components/NewsMedia';
export default async function Page() {
    return (
        <div className={styles.allWrapper}>
            <NewsMedia />
        </div>
    )
}