import styles from '../styles.module.css'

export default function Index() {
    return (
        <div className={styles.loadingWrapper}>
            <div className={styles.spinner}></div>
            <p>Loading Posts</p>
        </div>
    )
}