'use client';

import Login from '@/components/Login';
import { useUi } from '@/providers/UiProvider';
import styles from './styles.module.css';

export default function ConnectModalHost() {
    const { isConnectModalOpen, closeConnectModal } = useUi();

    return (
        <div
            className={`${styles.connectModal} ${
                isConnectModalOpen ? styles.showModal : ''
            }`}
        >
            <Login onClose={closeConnectModal} />
        </div>
    );
}