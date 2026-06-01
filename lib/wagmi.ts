import { createConfig, http } from 'wagmi'
import { base, bsc, mainnet } from 'wagmi/chains'
import {
    injected,
    walletConnect,
    coinbaseWallet,
} from 'wagmi/connectors'

export const config = createConfig({
    chains: [base, mainnet, bsc],

    ssr: true,

    /**
     * 브라우저에 설치된 지갑을 EIP-6963 기반으로 각각 감지한다.
     *
     * 예:
     * - io.metamask
     * - app.phantom
     * - com.okex.wallet
     */
    multiInjectedProviderDiscovery: true,

    connectors: [
        /**
         * window.ethereum 기반 fallback connector.
         *
         * MetaMask, Phantom, OKX처럼 EIP-6963으로 개별 감지되는 지갑은
         * Wagmi가 별도 connector로 추가한다.
         *
         * 이 generic connector는 특정 지갑을 가리키지 않으므로
         * UI 목록에서는 숨긴다.
         */
        injected({
            shimDisconnect: true,
            unstable_shimAsyncInject: 2_000,
        }),

        walletConnect({
            projectId:
                process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
            showQrModal: true,
            metadata: {
                name: 'VOB',
                description: 'VOB Wallet Login',
                url: 'https://www.vobc.io',
                icons: ['https://www.vobc.io/favicon.svg'],
            },
        }),

        /**
         * Base Account 버튼으로 사용할 Smart Wallet 전용 connector.
         *
         * 브라우저에 설치된 Coinbase Wallet 확장 프로그램과는
         * UI에서 별도 항목으로 노출하지 않는다.
         */
        coinbaseWallet({
            appName: 'VOB',
            appLogoUrl: 'https://www.vobc.io/favicon.svg',
            preference: {
                options: 'smartWalletOnly',
            },
        }),
    ],

    transports: {
        [base.id]: http(),
        [mainnet.id]: http(),
        [bsc.id]: http(),
    },
})