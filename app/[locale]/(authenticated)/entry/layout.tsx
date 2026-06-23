import styles from './styles.module.css'
import { NavigationLink } from '@/ui/NavigationLink'
import EntryTabs from "@/features/entry/components/EntryTabs";

export default function EntryLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <div>
                    <p className={styles.label}>VOB Community</p>
                    <h1 className={styles.title}>Entries</h1>
                </div>

                <NavigationLink href="/entry/create" className={styles.writeButton}>
                    Write
                </NavigationLink>
            </header>

            <EntryTabs/>

            <main className={styles.content}>
                {children}
            </main>
        </div>
    )
}