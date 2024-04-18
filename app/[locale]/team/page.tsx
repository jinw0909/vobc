import styles from './styles.module.css';
import iconManagement from '@/public/teams/teams_management.png';
import iconBusiness from '@/public/teams/teams_business.png';
import iconEngineering from '@/public/teams/teams_engineering.png';
import iconStrategy from '@/public/teams/teams_strategy.png';
import iconTrading from '@/public/teams/teams_trading.png';
import Image from 'next/image';

export default async function Page() {
    return (
        <div className={styles.teamWrapper}>
            <div className={styles.headbandWrapper}>
                <div className={styles.container}>
                    <div className={styles.headband}>
                        <ul className={styles.list}>
                            <li className={styles.elem}>
                                <div className={styles.teamIcon}>
                                <Image src={iconManagement} fill={true} alt="management icon"/>
                                </div>
                                <div className={styles.iconDesc}>Management<br/>Team</div>
                            </li>
                            <li className={styles.elem}>
                                <div className={styles.teamIcon}>
                                <Image src={iconEngineering} fill={true} alt="engineering icon"/>
                                </div>
                                <div className={styles.iconDesc}>Engineering<br/>Team</div>
                            </li>
                            <li className={styles.elem}>
                                <div className={styles.teamIcon}>
                                <Image src={iconStrategy} fill={true} alt="strategy icon"/>
                                </div>
                                <div className={styles.iconDesc}>Strategy<br/>Team</div>
                            </li>
                            <li className={styles.elem}>
                                <div className={styles.teamIcon}>
                                <Image src={iconBusiness} fill={true} alt="business icon"/>
                                </div>
                                <div className={styles.iconDesc}>Business<br/>Team</div>
                            </li>
                            <li className={styles.elem}>
                                <div className={styles.teamIcon}>
                                <Image src={iconTrading} fill={true} alt="trading icon"/>
                                </div>
                                <div className={styles.iconDesc}>Trading<br/>Team</div>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
            <div className={styles.itemBandWrapper}>
                <div className={styles.itemContainer}>
                    <div className={styles.itemBand}>
                        <ul className={styles.itemList}>
                            <li className={styles.item}></li>
                            <li className={styles.item}></li>
                            <li className={styles.item}></li>
                            <li className={styles.item}></li>
                            <li className={styles.item}></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}