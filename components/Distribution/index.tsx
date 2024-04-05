import styles from './styles.module.css';
import  { DoughnutChart } from '@/ui/DoughnutChart';
export const Distribution = () => {
    return (
        <div>
            <div>Distribution Model</div>
            <DoughnutChart/>
            <div>Open Detail</div>
        </div>
    )
}