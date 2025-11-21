import styles from './styles.module.css'
import {setRequestLocale} from "next-intl/server";
import Blog from "@/components/Blog";



export const metadata = {
    description: 'GOYA AI by VOB is an automated computer program designed to execute specific tasks with minimal human intervention. The number of users are increasing as we send out more efficient data. Meanwhile, VOB is building an ecosystem with technically advanced policies and the VOB token. Furthermore, we will ensure a more advanced platform by providing a stable Token Economy and opportunities to generate profits.'
}

export default async function Page( { params } : any) {
    const { locale } = await params;
    setRequestLocale(locale);

    console.log("bloglocale: ");
    return (
        <div className={styles.devsWrapper}>
            <Blog/>
        </div>
    )
}