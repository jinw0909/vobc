import styles from './styles.module.css'
import Image from 'next/image';
import vobLogo from '@/public/bullet.svg';

export default function Guide() {
    return (
        <main className={styles.guide}>
            <section className={styles.hero}>
                <p className={styles.eyebrow}>Wallet Guide</p>


                <h1 className={styles.title}>
                    Connect your wallet to access VOB
                </h1>

                <p className={styles.description}>
                    Your Web3 wallet works like your account for VOB.
                    By connecting and signing with your wallet, you can verify
                    ownership and access profile, balance, and member features.
                </p>
            </section>

            <section className={styles.section}>
                <h2>
                    <span className={styles.vobLogo}>
                        <Image src={vobLogo} alt={"vob logo"} objectFit={"contain"}/>
                    </span>
                    What is a Web3 wallet?
                </h2>
                <p>
                    A Web3 wallet is a digital wallet that lets you manage your
                    blockchain address and interact with Web3 services. Instead
                    of creating a password, you can use your wallet to prove
                    that you own a specific address.
                </p>
            </section>

            <section className={styles.section}>
                <h2>
                    <span className={styles.vobLogo}>
                        <Image src={vobLogo} alt={"vob logo"} objectFit={"contain"}/>
                    </span>
                    Why do I need to sign?
                </h2>
                <p>
                    Signing is used to verify that you are the owner of the
                    connected wallet. This does not transfer tokens, approve
                    spending, or create a blockchain transaction. It is only used
                    for login verification.
                </p>
            </section>

            <section className={styles.section}>
                <h2>
                    <span className={styles.vobLogo}>
                        <Image src={vobLogo} alt={"vob logo"} objectFit={"contain"}/>
                    </span>
                    Is it safe?
                </h2>
                <p>
                    VOB will never ask for your private key or seed phrase.
                    Never share your recovery phrase with anyone. If a website
                    asks for your seed phrase, leave immediately.
                </p>
            </section>

            <section className={styles.section}>
                <h2>What can I do after connecting?</h2>
                <ul className={styles.list}>
                    <li>Access your VOB profile</li>
                    <li>Check your VOB balance</li>
                    <li>Use wallet-based member features</li>
                    <li>Manage future Web3 services linked to your address</li>
                </ul>
            </section>

            <section className={styles.notice}>
                <h2>Important reminder</h2>
                <p>
                    Connecting a wallet is not the same as making a payment.
                    Always check the message shown in your wallet before signing.
                </p>
            </section>
        </main>
    )
}