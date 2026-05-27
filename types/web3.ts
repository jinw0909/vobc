export type ConnectionType = 'walletconnect' | 'injected' | 'coinbase-wallet' | null

export type SavedWalletSession = {
    type: ConnectionType
    id?: string
    name?: string
    icon?: string
    account?: string
    chainId?: string
    topic?: string
}

export type Web3Provider = {
    session?: any
    request: (args: {
        method: string
        params?: unknown[] | object
    }) => Promise<unknown>
    on?: (event: string, listener: (...args: any[]) => void) => void
    removeListener?: (event: string, listener: (...args: any[]) => void) => void
}

export type WalletOption = {
    id: string
    name: string
    icon: string
    type: 'injected' | 'walletconnect' | 'coinbase-wallet'
    provider?: Web3Provider
    detected?: boolean
}

export type ConnectedWallet = {
    address: string
    icon: string
    name: string
}