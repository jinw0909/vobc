import styles from './styles.module.css'
export function DistDetail() {

    return (
        <div>
            <div className={styles.content}>
                <input className={styles.checkbox} type="checkbox" id="checkbox" hidden/>
                <div className={styles.title}>
                    <label htmlFor="checkbox" className={styles.closeBtn}>Close Detail</label>
                    <label htmlFor="checkbox" className={styles.openBtn}>Open Detail</label>
                </div>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.spanTwo} colSpan={2}>Distribution<br/>Model</th>
                            <th>Allocation<br/>(%)</th>
                            <th>Allocation<br/>(EA)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>01</td>
                            <td>Management Team</td>
                            <td>10%</td>
                            <td>24M</td>
                        </tr>
                        <tr>
                            <td>02</td>
                            <td>Management Team<br/>(5 years lock)</td>
                            <td>2%</td>
                            <td>24M</td>
                        </tr>
                        <tr>
                            <td>03</td>
                            <td>Reserves</td>
                            <td>8%</td>
                            <td>24M</td>
                        </tr>
                        <tr>
                            <td>04</td>
                            <td>Reserves <br/>(3 years lock)</td>
                            <td>2%</td>
                            <td>6M</td>
                        </tr>
                        <tr>
                            <td>05</td>
                            <td>Community</td>
                            <td>14%</td>
                            <td>42M</td>
                        </tr>
                        <tr>
                            <td>06</td>
                            <td>Ecosystem</td>
                            <td>20%</td>
                            <td>60M</td>
                        </tr>
                        <tr>
                            <td>07</td>
                            <td>Marketing</td>
                            <td>18%</td>
                            <td>54M</td>
                        </tr>
                        <tr>
                            <td>08</td>
                            <td>Partner<br/>(1 year lock)</td>
                            <td>8%</td>
                            <td>24M</td>
                            <td className={styles.reference}>Monthly linear vest with 4% unlock</td>
                        </tr>
                        <tr>
                            <td>09</td>
                            <td>Team/Advisor<br/>3 year lock</td>
                            <td>7%</td>
                            <td>21M</td>
                            <td className={styles.reference}>Monthly linear vest with 4% unlock</td>
                        </tr>
                        <tr>
                            <td>10</td>
                            <td>Development</td>
                            <td>9%</td>
                            <td>27M</td>
                        </tr>
                        <tr>
                            <td>11</td>
                            <td>Auto-burn</td>
                            <td>5%</td>
                            <td>15M</td>
                            <td className={styles.reference}>Percentage dependant on the liquidity pool</td>
                        </tr>
                        <tr>
                            <td>12</td>
                            <td>Pre-sale</td>
                            <td>1%</td>
                            <td>3M</td>
                            <td className={styles.reference}>Pre-sale at $0.12</td>
                        </tr>
                        <tr>
                            <td className={styles.spanThree} colSpan={3}>Total</td>
                            <td>300M</td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    )
}