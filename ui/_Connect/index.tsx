'use client'

import styles from './styles.module.css'
import Login from "@/ui/_Login";
import {useState} from "react";
import Image from "next/image";

type WalletConnection = {
    address: string;
    icon: string;
    name: string;
}

type UserConnection = {
    walletAddress: string;
    profileImageUrl?: string;
    nickname?: string;
}
export default function Connect() {

    const [show, setShow] = useState(false);

    const [walletConnection, setWalletConnection] = useState<WalletConnection | null>(null);
    const [userConnection, setUserConnection] = useState<UserConnection | null>(null);

    const toggle = () => {
        setShow(!show);
    }

    const shorten = (addr: string) => {
        return addr.slice(0, 6) + '...' + addr.slice(-4);
    }

    const handleLoginSuccess = (userConnection: UserConnection) => {
        setUserConnection(userConnection);
        // setShow(false);
    }

    const handleConnectionSuccess = (walletConnection: WalletConnection) => {
        setWalletConnection(walletConnection);
        // setShow(false)
    }

    const handleDisconnect = () => {
        setUserConnection(null);
        setWalletConnection(null);
        // setShow(false);
    };

    const handleLogout = () => {
        setUserConnection(null);
        // setShow(false);
    };

    return (
        <div className={styles.connect}>
            <div className={styles.connectButtonWrapper}>
                <div className={styles.connectButton} onClick={toggle}>
                    {/* 1. disconnected */}
                    {!walletConnection && "Connect"}

                    {/* 2. connected */}
                    {walletConnection && !userConnection && (
                        <div className={styles.walletInfo}>
                            <img src={walletConnection.icon} alt={walletConnection.name} className={styles.walletIcon}/>
                            <span>{shorten(walletConnection.address)}</span>
                        </div>
                    )}

                    {/* 3. authenticated  */}
                    { userConnection && (
                        <div className={styles.userInfo}>
                            {userConnection.profileImageUrl ? (
                                <img src={userConnection.profileImageUrl} alt="profile image" className={styles.profileIcon}/>
                            ) : (
                                <div className={styles.fallbackIcon}>{userConnection.nickname?.[0]|| "U"}</div>
                            )}
                            <span>{userConnection.nickname || shorten(userConnection.walletAddress)}</span>
                        </div>
                    )}

                </div>
            </div>
            <div className={`${styles.connectModal} ${show ? styles.showModal : ''}`}>
                <Login
                    onLoginSuccess={handleLoginSuccess}
                    onConnectSuccess={handleConnectionSuccess}
                    onLogout={handleLogout}
                    onDisconnect={handleDisconnect}
                />
            </div>
        </div>
    )
}