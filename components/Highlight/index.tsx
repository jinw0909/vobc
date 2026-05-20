import styles from './styles.module.css'

export default function Highlight() {
    return (
        <section className={styles.highlight}>
            <div className={styles.inner}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Project Highlights</h2>
                    <p className={styles.description}>
                        A look at the projects and solutions VOB has built.
                    </p>
                </div>

                <div className={styles.videoBox}>
                    <video
                        className={styles.video}
                        src="https://vobc-image-bucket.s3.ap-northeast-2.amazonaws.com/videos/vob_roadmap.mp4"
                        autoPlay
                        muted
                        loop
                        preload="metadata"
                        playsInline
                    />
                </div>
            </div>
        </section>
    )
}