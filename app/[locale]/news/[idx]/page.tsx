import styles from './styles.module.css'
export default async function Page({params} : { params : {idx : string}}) {
    return (
        <div>
            <div>{params.idx}</div>
        </div>
    )
}