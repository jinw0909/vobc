'use client'

import styles from './styles.module.css'
import Login from '@/components/Login'
import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react'
import { useWeb3Auth } from '@/providers/Web3AuthProvider'
import { useUi } from '@/providers/UiProvider'
import Image from 'next/image'
import connectIcon from '@/public/icons/power-button-white.png'

export default function Connect() {
    const [dragY, setDragY] = useState(0)
    const [isDragging, setIsDragging] = useState(false)

    const modalRef = useRef<HTMLDivElement | null>(null)

    const dragStartYRef = useRef(0)
    const dragStartTranslateYRef = useRef(0)
    const dragYRef = useRef(0)
    const isDraggingRef = useRef(false)

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

    const isMobileSheet = () => {
        if (typeof window === 'undefined') return false
        return window.matchMedia('(max-width: 576px)').matches
    }

    const setSheetDragY = useCallback((nextY: number) => {
        dragYRef.current = nextY
        setDragY(nextY)
    }, [])

    const resetSheetPosition = useCallback(() => {
        isDraggingRef.current = false
        setIsDragging(false)
        setSheetDragY(0)
    }, [setSheetDragY])

    const toggle = () => {
        if (isConnectModalOpen) {
            resetSheetPosition()
            closeConnectModal()
        } else {
            openConnectModal()
        }
    }

    const close = () => {
        resetSheetPosition()
        closeConnectModal()
    }

    const shorten = (addr?: string) => {
        if (!addr) return ''
        return addr.slice(0, 6) + '...' + addr.slice(-4)
    }

    const getResistedY = (rawY: number) => {
        /**
         * rawY < 0: 위로 드래그
         * 많이 잡아당겨도 살짝만 올라가게 저항감 적용
         */
        if (rawY < 0) {
            const distance = Math.abs(rawY)
            const resisted = Math.min(24, distance * 0.16)
            return -resisted
        }

        /**
         * rawY > 0: 아래로 드래그
         * 아래쪽은 손가락을 비교적 잘 따라오게 둠
         */
        return rawY
    }

    const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isMobileSheet()) return

        isDraggingRef.current = true
        setIsDragging(true)

        dragStartYRef.current = e.clientY
        dragStartTranslateYRef.current = dragYRef.current

        e.currentTarget.setPointerCapture(e.pointerId)
    }

    const handleDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) return

        const diffY = e.clientY - dragStartYRef.current
        const rawNextY = dragStartTranslateYRef.current + diffY
        const nextY = getResistedY(rawNextY)

        setSheetDragY(nextY)
    }

    const handleDragEnd = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) return

        isDraggingRef.current = false
        setIsDragging(false)

        try {
            e.currentTarget.releasePointerCapture(e.pointerId)
        } catch {
            // 이미 capture가 풀린 경우 무시
        }

        if (!isMobileSheet()) {
            setSheetDragY(0)
            return
        }

        const currentY = dragYRef.current

        /**
         * 핵심 변경 부분:
         * 화면 높이 기준 30vh가 아니라,
         * 현재 모달 자신의 실제 높이 기준 35% 이상 내려가면 닫힘
         */
        const sheetHeight = modalRef.current?.offsetHeight ?? window.innerHeight
        const closeThreshold = sheetHeight * 0.35

        /**
         * 손 떼는 순간에만 close 판단.
         * 드래그 중에는 아무리 내려가도 닫히지 않음.
         */
        if (currentY >= closeThreshold) {
            close()
            return
        }

        /**
         * 기준 미만이면 원래 위치로 복귀.
         */
        setSheetDragY(0)
    }

    const handleDragCancel = () => {
        resetSheetPosition()
    }

    useEffect(() => {
        if (isConnectModalOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
            resetSheetPosition()
        }

        return () => {
            document.body.style.overflow = ''
        }
    }, [isConnectModalOpen, resetSheetPosition])

    const modalStyle = {
        '--drag-y': `${dragY}px`,
    } as CSSProperties

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
                    ref={modalRef}
                    className={`${styles.connectModal} ${
                        isConnectModalOpen ? styles.showModal : ''
                    } ${isDragging ? styles.draggingModal : ''}`}
                    style={modalStyle}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        className={styles.sheetHandleArea}
                        onPointerDown={handleDragStart}
                        onPointerMove={handleDragMove}
                        onPointerUp={handleDragEnd}
                        onPointerCancel={handleDragCancel}
                    >
                        <div className={styles.sheetHandle} />
                    </div>

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