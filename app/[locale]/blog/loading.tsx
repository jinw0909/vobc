// app/[locale]/blog/loading.tsx
import styles from './styles.module.css';

export default function Loading() {
    return (
        <div className={styles.blogWrapper}>
            <div className={styles.blogFirst}>
                <div className={styles.firstElem}>
                    <div className={styles.left}>
                        <div className={styles.leftTop}>
                            <p className={styles.blogDate}>Loading Blog…</p>
                            <div className={styles.blogTitle}>
                                <div className={styles.skeletonTitle} />
                            </div>
                        </div>
                        <div className={styles.leftDown}>
                            <div className={styles.skeletonText} />
                            <div className={styles.skeletonTextShort} />
                        </div>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.imageElem}>
                            <div className={styles.skeletonImage} />
                        </div>
                    </div>
                </div>
            </div>

            <ul className={styles.blogList}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <li key={i}>
                        <div className={styles.blogItemInner}>
                            <div className={styles.skeletonTitleSmall} />
                            <div className={styles.blogThumbnail}>
                                <div className={styles.imageElem}>
                                    <div className={styles.skeletonImage} />
                                </div>
                            </div>
                            <div className={styles.skeletonText} />
                            <div className={styles.skeletonTextShort} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}


