import Image from 'next/image';
import techPic from '@/public/devs_technology.png';
import styles from './styles.module.css'
import { DevsAcc } from "@/app/ui/DevsAcc";
import { DevsCaro } from "@/app/ui/DevsCaro";

export const Devs = async ({lang}) => {
    return (
        <div className={styles.devsWrapper}>
            <div className={styles.devsTitle}>「 GOYABOT AI 」 and the Big Data</div>
            <div className={styles.devsDesc}>
                <div className={styles.imageBox}>
                    <Image className={styles.imageStyle}
                        src={techPic} width={100} height={100} alt="image for devs page"/>
                </div>
                <div className={styles.textStyle}>
                    GOYABOT by VOB is an automated computer program designed to execute specific tasks with minimal human intervention. The number of users are increasing as we send out more efficient data. Meanwhile, VOB is building an ecosystem with technically advanced policies and the VOB token. Furthermore, we will ensure a more advanced platform by providing a stable Token Economy and opportunities to generate profits.
                </div>
            </div>
            <DevsAcc/>
            <div className={styles.devsSubtitle}>Security Architecture</div>
            <DevsCaro/>
        </div>
    )
}