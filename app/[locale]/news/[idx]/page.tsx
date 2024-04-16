import styles from './styles.module.css'
import { NewsDetail } from "@/components/NewsDetail";
export default async function Page({params} : { params : {idx : string}}) {
    return (
        <div className={styles.detailWrapper}>
            <NewsDetail idx={params.idx}/>
        </div>
    )
}