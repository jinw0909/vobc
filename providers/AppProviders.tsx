'use client'
import { Web3AuthProvider } from '@/providers/Web3AuthProvider'
import {UiProvider} from "@/providers/UiProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Web3AuthProvider>
            <UiProvider>
                {children}
            </UiProvider>
        </Web3AuthProvider>
    )
}