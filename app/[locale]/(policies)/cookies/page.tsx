import styles from '../styles.module.css'
import {unstable_setRequestLocale} from "next-intl/server";
export default function Page({params : { locale }} : {params : {locale : string}}) {

    unstable_setRequestLocale(locale);

    return (
        <div className={styles.termsWrapper}>
            <div className={styles.termsTitle}>Cookies Policy</div>
            <div className={styles.termsContent}>
                <div>
                    <h2>Introduction</h2>
                    <p>Welcome to vobc.io Cookies Policy. This policy explains what cookies are, how we use them, and your choices regarding cookies when you visit our website.</p>
                </div>
                <div>
                    <h2>What are Cookies?</h2>
                    <p>Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the website or a third-party service to recognize you and make your next visit easier and more useful to you.</p>
                </div>
                <div>
                    <h2>How We Use Cookies</h2>
                    <p>We use cookies for various purposes, including:</p>
                    <ul>
                        <li>Essential cookies: These cookies are necessary for the website to function properly.</li>
                        <li>Analytics cookies: These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
                        <li>Advertising cookies: These cookies are used to personalize ads and measure their effectiveness.</li>
                    </ul>
                </div>
                <div>
                    <h2>Your Choices Regarding Cookies</h2>
                    <p>You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer. However, this may prevent you from taking full advantage of the website.</p>
                </div>
                <div>
                    <h2>More Information</h2>
                    <p>If you have any questions or concerns about our use of cookies, please contact us at [contact email or address].</p>
                </div>
                <div>
                    <h2>Changes to This Policy</h2>
                    <p>We reserve the right to update or modify this Cookies Policy at any time. Any changes will be effective immediately upon posting on this page. We encourage you to review this Cookies Policy periodically for any updates.</p>
                </div>
                <div>
                    <h2>Effective Date</h2>
                    <p>This Cookies Policy was last updated on [date].</p>
                </div>
            </div>
        </div>
    )
}