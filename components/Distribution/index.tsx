import styles from './styles.module.css';
import  { DoughnutChart } from '@/ui/DoughnutChart';
import {DistDetail} from "@/ui/DistDetail";
export const Distribution = () => {
    return (
        <div>
            <div className={styles.title}>VOB Token<br/>Distribution Model</div>
            <DoughnutChart />
            <DistDetail />
        </div>
    )
}