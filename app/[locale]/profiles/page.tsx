import styles from './styles.module.css'
import ProfileClient from "@/components/ProfileClient";
import {Metadata} from "next";

export const metadata : Metadata = {
    robots: {
        index: false,
        follow: false,
    }
}
export default async function Profile() {
    return <ProfileClient/>
}