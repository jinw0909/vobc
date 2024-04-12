import styles from './styles.module.css'
export function CloseBtn() {
    return (
        <div className={styles.closeBtn}>
            <span className={`${styles.lineOne} ${styles.line}`}></span>
            <span className={`${styles.lineTwo} ${styles.line}`}></span>
        </div>
    )
}