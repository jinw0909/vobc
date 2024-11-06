import styles from './styles.module.css'

export const Wrapup = async () => {
    return (
        <div className={styles.wrapupMain}>
            <div className={styles.right}>
                <div className={styles.rightLeft}>And there are no friends at dusk</div>
                <div className={styles.rightRight}>
                    <div className={styles.rightRightTop}>1</div>
                    <div className={styles.rightRightBottom}>2</div>
                </div>
            </div>
            <div className={styles.left}>We live in a twilight world</div>
        </div>
    );
}