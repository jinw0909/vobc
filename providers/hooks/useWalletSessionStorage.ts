'use client'

import { useCallback } from 'react'
import type { SavedWalletSession } from '@/types/web3'

const WALLET_SESSION_KEYS = {
    type: 'vob.wallet.type',
    id: 'vob.wallet.id',
    name: 'vob.wallet.name',
    icon: 'vob.wallet.icon',
    account: 'vob.wallet.account',
    chainId: 'vob.wallet.chainId',
    topic: 'vob.wallet.topic',
} as const

export function useWalletSessionStorage() {
    const saveWalletSession = useCallback((session: SavedWalletSession) => {
        if (typeof window === 'undefined') return

        if (session.type) {
            sessionStorage.setItem(WALLET_SESSION_KEYS.type, session.type)
        }

        if (session.id) {
            sessionStorage.setItem(WALLET_SESSION_KEYS.id, session.id)
        }

        if (session.name) {
            sessionStorage.setItem(WALLET_SESSION_KEYS.name, session.name)
        }

        if (session.icon) {
            sessionStorage.setItem(WALLET_SESSION_KEYS.icon, session.icon)
        }

        if (session.account) {
            sessionStorage.setItem(WALLET_SESSION_KEYS.account, session.account)
        }

        if (session.chainId) {
            sessionStorage.setItem(WALLET_SESSION_KEYS.chainId, session.chainId)
        }

        if (session.topic) {
            sessionStorage.setItem(WALLET_SESSION_KEYS.topic, session.topic)
        }
    }, [])

    const getSavedWalletSession = useCallback((): SavedWalletSession => {
        if (typeof window === 'undefined') {
            return { type: null }
        }

        return {
            type: sessionStorage.getItem(WALLET_SESSION_KEYS.type) as SavedWalletSession['type'],
            id: sessionStorage.getItem(WALLET_SESSION_KEYS.id) || undefined,
            name: sessionStorage.getItem(WALLET_SESSION_KEYS.name) || undefined,
            icon: sessionStorage.getItem(WALLET_SESSION_KEYS.icon) || undefined,
            account: sessionStorage.getItem(WALLET_SESSION_KEYS.account) || undefined,
            chainId: sessionStorage.getItem(WALLET_SESSION_KEYS.chainId) || undefined,
            topic: sessionStorage.getItem(WALLET_SESSION_KEYS.topic) || undefined,
        }
    }, [])

    const clearSavedWalletSession = useCallback(() => {
        if (typeof window === 'undefined') return

        Object.values(WALLET_SESSION_KEYS).forEach((key) => {
            sessionStorage.removeItem(key)
        })
    }, [])

    return {
        saveWalletSession,
        getSavedWalletSession,
        clearSavedWalletSession,
    }
}