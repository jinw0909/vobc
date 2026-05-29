import { createConfig, http } from 'wagmi'
import { base, bsc, mainnet } from 'wagmi/chains'
import {
    injected,
    walletConnect,
    baseAccount,
    coinbaseWallet,
} from 'wagmi/connectors'

export const config = createConfig({
    chains: [base, mainnet, bsc],
    ssr: true,
    multiInjectedProviderDiscovery: true,
    connectors: [
        // baseAccount({
        //     appName: 'VOB',
        //     appLogoUrl: 'https://www.vobc.io/favicon.png',
        // }),
        injected({
            shimDisconnect: true,
            unstable_shimAsyncInject: 2_000,
        }),
        walletConnect({
            projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
            showQrModal: true,
            metadata: {
                name: 'VOB',
                description: 'VOB Wallet Login',
                url: 'https://www.vobc.io',
                icons: ['https://www.vobc.io/favicon.svg'],
            },
        }),
        coinbaseWallet({
            appName: 'VOB',
            appLogoUrl: 'https://www.vobc.io/favicon.svg',
            preference: 'smartWalletOnly',
        }),
    ],
    transports: {
        [base.id]: http(),
        [mainnet.id]: http(),
        [bsc.id]: http(),
    },
})