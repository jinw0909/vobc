'use client';

import { Link } from '@/i18n/navigation';
import { useUi } from '@/providers/UiProvider';
import styles from './styles.module.css';

type LoginRequiredProps = {
    title?: string;
    description?: string;
    loginButtonText?: string;
    homeButtonText?: string;
    showHomeButton?: boolean;
    homeHref?: string;
};

export default function LoginRequired({
                                          title = 'Login Required',
                                          description = 'You need to connect your wallet and log in to view this page.',
                                          loginButtonText = 'Login',
                                          homeButtonText = 'Home',
                                          showHomeButton = true,
                                          homeHref = '/',
                                      }: LoginRequiredProps) {
    const { openConnectModal } = useUi();

    return (
        <section className={styles.loginRequired}>
            <div className={styles.iconBox}>
                <span className={styles.icon}>🔒</span>
            </div>

            <h2 className={styles.title}>{title}</h2>

            <p className={styles.description}>{description}</p>

            <div className={styles.actionRow}>
                <button
                    type="button"
                    onClick={openConnectModal}
                    className={styles.loginButton}
                >
                    {loginButtonText}
                </button>

                {showHomeButton && (
                    <Link href={homeHref} className={styles.homeButton}>
                        {homeButtonText}
                    </Link>
                )}
            </div>
        </section>
    );
}