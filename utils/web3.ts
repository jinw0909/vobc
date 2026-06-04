export function shortenAddress(address?: string) {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function normalizeOptionalString(value: unknown) {
    return typeof value === 'string' && value.trim().length > 0
        ? value.trim()
        : undefined
}

export function normalizeHexChainId(chainId: string | number): string {
    if (typeof chainId === 'number') {
        return `0x${chainId.toString(16)}`
    }

    if (typeof chainId === 'string') {
        if (chainId.startsWith('0x')) {
            return chainId.toLowerCase()
        }

        const parsed = Number(chainId)
        if (!Number.isNaN(parsed)) {
            return `0x${parsed.toString(16)}`
        }
    }

    return ''
}

export function isValidEvmAddress(value: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(value)
}


export function toHexUtf8(value: string): string {
    return (
        '0x' +
        Array.from(new TextEncoder().encode(value))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')
    )
}

export type ChainInfo = {
    id: number | null
    name: string
    icon: string | null
}

function normalizeChainId(
    chainId?: string | number | null,
): number | null {
    if (typeof chainId === 'number') {
        return Number.isNaN(chainId)
            ? null
            : chainId
    }

    if (!chainId) {
        return null
    }

    const parsed = chainId.startsWith('0x')
        ? Number.parseInt(chainId, 16)
        : Number.parseInt(chainId, 10)

    return Number.isNaN(parsed)
        ? null
        : parsed
}

export function getChainInfo(
    chainId?: string | number | null,
): ChainInfo {
    const numericChainId =
        normalizeChainId(chainId)

    switch (numericChainId) {
        case 1:
            return {
                id: 1,
                name: 'Ethereum Mainnet',
                icon: '/chains/ethereum.svg',
            }

        case 8453:
            return {
                id: 8453,
                name: 'Base Mainnet',
                icon: '/chains/base.svg',
            }

        case 56:
            return {
                id: 56,
                name: 'BNB Smart Chain',
                icon: '/chains/bsc.svg',
            }

        default:
            return {
                id: numericChainId,
                name: numericChainId
                    ? `Chain ${numericChainId}`
                    : 'Unknown Chain',
                icon: null,
            }
    }
}

export function getNetworkName(
    chainId?: string | number | null,
) {
    return getChainInfo(chainId).name
}

// export function getNetworkName(chainId?: string) {
//     const normalized = normalizeHexChainId(chainId || '')
//
//     switch (normalized) {
//         case '0x1':
//             return 'Ethereum Mainnet'
//         case '0x38':
//             return 'BNB Smart Chain'
//         case '0x2105':
//             return 'Base Mainnet'
//         case '0x89':
//             return 'Polygon Mainnet'
//         case '0xa':
//             return 'Optimism'
//         case '0xa4b1':
//             return 'Arbitrum One'
//         default:
//             return normalized || '-'
//     }
// }