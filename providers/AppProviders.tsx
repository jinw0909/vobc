'use client'

import { useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { config } from '@/lib/wagmi'
import { Web3AuthProvider } from '@/providers/Web3AuthProvider'
import { UiProvider } from '@/providers/UiProvider'

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <WagmiProvider config={config} reconnectOnMount>
            <QueryClientProvider client={queryClient}>
                <Web3AuthProvider>
                    <UiProvider>
                        {children}
                    </UiProvider>
                </Web3AuthProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}