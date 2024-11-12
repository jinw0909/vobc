import styles from '../styles.module.css'
import {setRequestLocale, unstable_setRequestLocale} from "next-intl/server";
export default function Page({params : { locale }} : {params : {locale : string}}) {

    setRequestLocale(locale);

    return (
        <div className={styles.termsWrapper}>
            <div className={styles.termsTitle}>Privacy Policy</div>
            <div className={styles.termsContent}>
                <div>
                    <h2>Introduction</h2>
                    <p>
                        Welcome to vobc.io! These Terms of Service govern your use of our website and services. By accessing or using our website, you agree to be bound by these terms. Please read them carefully before using our services.
                    </p>
                </div>
                <div>
                    <h2>Acceptance of Terms</h2>
                    <p>
                        By accessing or using vobc.io, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, you may not access or use the website.
                    </p>
                </div>
                <div>
                    <h2>Description of Services</h2>
                    <p>
                        vobc.io provides an online platform for the VOB foundation. These services are provided &quot;as is&quot; and are subject to change without notice.
                    </p>
                </div>
                <div>
                    <h2>User Accounts</h2>
                    <p>
                        In order to access certain features of vobc.io, you may be required to create a user account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                    </p>
                </div>

                <div>
                    <h2>User Conduct</h2>
                    <div>
                        <p>You agree to use vobc.io in accordance with all applicable laws and regulations. Prohibited activities include, but are not limited to:</p>
                        <ul>
                            <li>Uploading or transmitting any harmful, unlawful, or inappropriate content</li>
                            <li>Attempting to gain unauthorized access to other user accounts or to vobc.io systems or networks</li>
                            <li>Interfering with the proper functioning of vobc.io or disrupting other users use of the website</li>
                        </ul>
                    </div>
                </div>

                <div>
                    <h2>Intellectual Property Rights</h2>
                    <p>
                        All content and materials on vobc.io, including text, graphics, logos, and images, are the property of vobc.io or its licensors and are protected by copyright and other intellectual property laws.
                    </p>
                </div>

                <div>
                    <h2>Privacy Policy</h2>
                    <p>
                        By using vobc.io, you agree to the terms of our Privacy Policy, which describes how we collect, use, and protect your personal information.
                    </p>
                </div>

                <div>
                    <h2>Payment and Billing</h2>
                    <p>
                        Certain features of vobc.io may require payment. By using these features, you agree to pay all applicable fees and charges.
                    </p>
                </div>

                <div>
                    <h2>Disclaimers</h2>
                    <p>
                        vobc.io is provided &quot;as is&quot; without any warranties, express or implied. We do not warrant that the website will be error-free, uninterrupted, or secure.
                    </p>
                </div>

                <div>
                    <h2>Indemnification</h2>
                    <p>
                        You agree to indemnify and hold vobc.io harmless from any claims, losses, or liabilities arising from your use of the website or your violation of these Terms of Service.
                    </p>
                </div>

                <div>
                    <h2>Governing Law</h2>
                    <p>
                        These Terms of Service are governed by the laws of jurisdiction, without regard to its conflict of laws principles. Any disputes arising out of or relating to these terms shall be resolved exclusively in the courts of jurisdiction.
                    </p>
                </div>

                <div>
                    <h2>Changes to Terms</h2>
                    <p>
                        We reserve the right to modify or update these Terms of Service at any time. Any changes will be effective immediately upon posting. You are responsible for reviewing the terms periodically for changes.
                    </p>
                </div>
                <div>
                    <h2>Effective Date</h2>
                    <p>
                        These Terms of Service were last updated on 11.07.2024.
                    </p>
                </div>

            </div>
        </div>
    )
}