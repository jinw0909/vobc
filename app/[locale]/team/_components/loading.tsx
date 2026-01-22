import styles from '../styles.module.css'

export default function Loading() {
    return (
        <div className={styles.loadingWrapper}>
            <div className={styles.spinner}></div>
            <p>Loading Team</p>
        </div>
    )
}