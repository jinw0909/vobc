'use client'

import styles from './styles.module.css'
import Login from '@/components/Login'
import { useEffect, useState } from 'react'
import { useWeb3Auth } from '@/providers/Web3AuthProvider'
import { useUi } from '@/providers/UiProvider'
import Image from 'next/image'
import connectIcon from '@/public/icons/power-button-white.png'

export default function Connect() {
    const [show, setShow] = useState(false)

    const {
        isConnectModalOpen,
        openConnectModal,
        closeConnectModal
    } = useUi()

    const {
        connectedWallet,
        userProfile,
        viewState,
        displayProfileImage,
        displayNickname,
        account,
    } = useWeb3Auth()

    // const toggle = () => setShow((prev) => !prev)
    const toggle = () => {
        if (isConnectModalOpen) {
            closeConnectModal()
        } else {
            openConnectModal()
        }
    }
    // const close = () => setShow(false)
    const close = () => {
        closeConnectModal()
    }
    const shorten = (addr: string) =>
        addr.slice(0, 6) + '...' + addr.slice(-4)


    useEffect(() => {
        if (isConnectModalOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }

        return () => {
            document.body.style.overflow = ''
        }
    }, [isConnectModalOpen])

    return (
        <div className={styles.connect}>
            <div className={styles.connectButtonWrapper}>
                <div className={styles.connectButton} onClick={toggle}>
                    {viewState === 'disconnected' && (
                        <>
                            <span className={styles.connectIcon}>
                                <Image
                                    src={connectIcon}
                                    alt="connect icon"
                                    style={{ objectFit: 'contain' }}
                                />
                            </span>
                            <span className={styles.connectText}>Connect</span>
                        </>
                    )}
                    {viewState === 'connected' && connectedWallet && (
                        <div className={styles.walletInfo}>
                            <img
                                className={styles.userProfileImage}
                                src={connectedWallet.icon}
                                alt={connectedWallet.name}
                            />
                            <span className={styles.userNickname}>
                                {shorten(connectedWallet.address)}
                            </span>
                        </div>
                    )}

                    {viewState === 'loggedIn' && (
                        <div className={styles.userInfo}>
                            <img
                                className={styles.userProfileImage}
                                src={displayProfileImage}
                                alt={displayNickname}
                            />
                            <span className={styles.userNickname}>
                                {displayNickname || shorten(userProfile?.walletAddress || account)}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div
                className={`${styles.connectOverlay} ${
                    isConnectModalOpen ? styles.showOverlay : ''
                }`}
                onClick={close}
            >
                <div
                    className={`${styles.connectModal} ${
                        isConnectModalOpen ? styles.showModal : ''
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.connectModalInner}>
                        <Login onClose={close} />

                        <div className={styles.closeBtnWrapper} onClick={close}>
                            <div className={styles.closeBtn}>
                                <div className={styles.lineOne}></div>
                                <div className={styles.lineTwo}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}