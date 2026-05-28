'use client'

import { UniversalConnector } from '@reown/appkit-universal-connector'
import { defineChain } from '@reown/appkit/networks'

const WALLETCONNECT_PROJECT_ID =
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

const ethereumMainnet = defineChain({
    id: 1,
    caipNetworkId: 'eip155:1',
    chainNamespace: 'eip155',
    name: 'Ethereum',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['https://cloudflare-eth.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Etherscan',
            url: 'https://etherscan.io',
        },
    },
})

const bscMainnet = defineChain({
    id: 56,
    caipNetworkId: 'eip155:56',
    chainNamespace: 'eip155',
    name: 'BNB Smart Chain',
    nativeCurrency: {
        decimals: 18,
        name: 'BNB',
        symbol: 'BNB',
    },
    rpcUrls: {
        default: {
            http: ['https://bsc-dataseed.binance.org'],
        },
    },
    blockExplorers: {
        default: {
            name: 'BscScan',
            url: 'https://bscscan.com',
        },
    },
})

let connectorInstance: UniversalConnector | null = null
let connectorPromise: Promise<UniversalConnector> | null = null

export async function getUniversalConnector() {
    if (connectorInstance) {
        return connectorInstance
    }

    if (connectorPromise) {
        return connectorPromise
    }

    if (!WALLETCONNECT_PROJECT_ID) {
        throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID not found')
    }

    const origin =
        typeof window !== 'undefined'
            ? window.location.origin
            : 'https://www.vobc.io'

    connectorPromise = UniversalConnector.init({
        projectId: WALLETCONNECT_PROJECT_ID,
        metadata: {
            name: 'VOBC.IO',
            description: 'VOB Login with WalletConnect',
            url: origin,
            icons: [`${origin}/favicon.svg`],
        },
        networks: [
            {
                namespace: 'eip155',
                chains: [bscMainnet, ethereumMainnet],
                methods: [
                    'eth_accounts',
                    'eth_requestAccounts',
                    'personal_sign',
                    'eth_signTypedData',
                    'eth_signTypedData_v4',
                    'eth_sendTransaction',
                    'wallet_switchEthereumChain',
                ],
                events: ['accountsChanged', 'chainChanged', 'disconnect'],
            },
        ],
    })
        .then((connector) => {
            connectorInstance = connector
            return connector
        })
        .catch((error) => {
            connectorPromise = null
            connectorInstance = null
            throw error
        })

    return connectorPromise
}

export function setUniversalConnector(connector: UniversalConnector | null) {
    connectorInstance = connector

    if (!connector) {
        connectorPromise = null
    }
}

export function getCurrentUniversalConnector() {
    return connectorInstance
}

export function resetUniversalConnectorSingleton() {
    connectorInstance = null
    connectorPromise = null
}