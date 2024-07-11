import styles from './styles.module.css'
export async function NewsMedia() {
    return (
        <div className={styles.mediaWrapper}>
            <div className={styles.main}>
                <div className={styles.yearWrapper}>
                    <h2 className={styles.year}>2024</h2>
                    <hr/>
                    <div>
                        <ul className={styles.itemWrapper}>
                            <li className={styles.mediaItem}>Content1</li>
                            <li className={styles.mediaItem}>Content2</li>
                            <li className={styles.mediaItem}>Content3</li>
                        </ul>
                    </div>
                </div>
                <div className={styles.yearWrapper}>
                    <h2 className={styles.year}>2023</h2>
                    <hr/>
                    <div>
                        <ul className={styles.itemWrapper}>
                            <li className={styles.mediaItem}>Content1</li>
                            <li className={styles.mediaItem}>Content2</li>
                            <li className={styles.mediaItem}>Content3</li>
                        </ul>
                    </div>
                </div>
                <div className={styles.yearWrapper}>
                    <h2 className={styles.year}>2022</h2>
                    <hr/>
                    <div>
                        <ul className={styles.itemWrapper}>
                            <li className={styles.mediaItem}>Content1</li>
                            <li className={styles.mediaItem}>Content2</li>
                            <li className={styles.mediaItem}>Content3</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className={styles.about}>
                <div className={styles.mediaAbout}>About the Media</div>
                <div className={styles.mediaHeader}>The Vision of Blockchain Media</div>
                <div className={`${styles.mediaDesc} ${styles.textGradient}`}>
                Launched in 2022, the Vision of Blockchain Media is a series of original medium that interpret the hybridity of VOB token ecosystem, each created in collaboration with contemporary cryptocurrency participants with diverse practices from around the world, including the media, artists, creators, marketers, developers, traders, exchanges, foundations, celebrities, government departments, and individuals. Vision of Blockchain Media is amplified across our global digital platforms, often published alongside an in-depth interview on renowned editorials. Guided by our commitment to experimentation and the boundless potential of cryptocurrency and NFT, the series embraces both recent incidents and established thoughts; articles and interviews alongside VOB-related events and developments. Vision of Blockchain looks beyond our partner network to forge new connections, further expanding our community.
                </div>
            </div>
        </div>
    )
}