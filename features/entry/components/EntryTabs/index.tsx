'use client'

import styles from './styles.module.css'
import { usePathname } from '@/i18n/navigation'
import { NavigationLink } from '@/ui/NavigationLink'

const tabs = [
    { href: '/entry/feed', label: 'Feed' },
    { href: '/entry/following', label: 'Following' },
    { href: '/entry/my', label: 'My Entries' },
]

export default function EntryTabs() {
    const pathname = usePathname()

    return (
        <nav className={styles.tabs}>
            {tabs.map((tab) => {
                const active = pathname.endsWith(tab.href)

                return (
                    <NavigationLink
                        key={tab.href}
                        href={tab.href}
                        className={`${styles.tab} ${active ? styles.active : ''}`}
                    >
                        {tab.label}
                    </NavigationLink>
                )
            })}
        </nav>
    )
}