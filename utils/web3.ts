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

export function getNetworkName(chainId?: string) {
    const normalized = normalizeHexChainId(chainId || '')

    switch (normalized) {
        case '0x1':
            return 'Ethereum Mainnet'
        case '0x38':
            return 'BNB Smart Chain'
        case '0x2105':
            return 'Base Mainnet'
        case '0x89':
            return 'Polygon Mainnet'
        case '0xa':
            return 'Optimism'
        case '0xa4b1':
            return 'Arbitrum One'
        default:
            return normalized || '-'
    }
}