// 'use client';
//
// import { useEffect, useRef, useState } from 'react';
// import { UniversalConnector } from '@reown/appkit-universal-connector';
// import { defineChain } from '@reown/appkit/networks';
//
// type Status =
//     | 'idle'
//     | 'initializing'
//     | 'connecting'
//     | 'connected'
//     | 'rejected'
//     | 'pending'
//     | 'failed';
//
// type WCProvider = {
//     session?: any;
//     request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>;
//     on?: (event: string, listener: (...args: any[]) => void) => void;
//     removeListener?: (event: string, listener: (...args: any[]) => void) => void;
// };
//
// type InjectedProvider = {
//     request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>;
//     on?: (event: string, listener: (...args: any[]) => void) => void;
//     removeListener?: (event: string, listener: (...args: any[]) => void) => void;
// };
//
// type WalletOption = {
//     id: string;
//     name: string;
//     icon: string;
//     type: 'injected' | 'walletconnect';
//     provider?: InjectedProvider;
//     detected?: boolean;
// };
//
// type Eip6963ProviderInfo = {
//     uuid?: string;
//     name: string;
//     icon: string;
//     rdns?: string;
// };
//
// type Eip6963AnnounceDetail = {
//     info: Eip6963ProviderInfo;
//     provider: InjectedProvider;
// };
//
// const ethereumMainnet = defineChain({
//     id: 1,
//     caipNetworkId: 'eip155:1',
//     chainNamespace: 'eip155',
//     name: 'Ethereum',
//     nativeCurrency: {
//         decimals: 18,
//         name: 'Ether',
//         symbol: 'ETH',
//     },
//     rpcUrls: {
//         default: {
//             http: ['https://cloudflare-eth.com'],
//         },
//     },
//     blockExplorers: {
//         default: {
//             name: 'Etherscan',
//             url: 'https://etherscan.io',
//         },
//     },
// });
//
// const ALLOWED_CHAIN_IDS = ['0x1'];
// const ALLOWED_CHAIN_IDS_DECIMAL = new Set([1]);
//
// const WALLETCONNECT_OPTION: WalletOption = {
//     id: 'walletconnect',
//     name: 'WalletConnect',
//     icon: '/walletconnect.svg',
//     type: 'walletconnect',
//     detected: false,
// };
//
// function isValidEvmAddress(value: string): boolean {
//     return /^0x[a-fA-F0-9]{40}$/.test(value);
// }
//
// function normalizeHexChainId(chainId: string | number): string {
//     if (typeof chainId === 'number') {
//         return `0x${chainId.toString(16)}`;
//     }
//
//     if (typeof chainId === 'string') {
//         if (chainId.startsWith('0x')) {
//             return chainId.toLowerCase();
//         }
//
//         const parsed = Number(chainId);
//         if (!Number.isNaN(parsed)) {
//             return `0x${parsed.toString(16)}`;
//         }
//     }
//
//     return '';
// }
//
// function getUserFriendlyEvmMessage(chainId?: string) {
//     if (!chainId) {
//         return '현재 선택된 계정은 EVM 계정이 아니거나 지원되지 않습니다. Ethereum 계정으로 전환해 주세요.';
//     }
//
//     return `현재 선택된 체인(${chainId})은 지원되지 않습니다. Ethereum Mainnet 계정으로 전환해 주세요.`;
// }
//
// function toHexUtf8(value: string): string {
//     return (
//         '0x' +
//         Array.from(new TextEncoder().encode(value))
//             .map((b) => b.toString(16).padStart(2, '0'))
//             .join('')
//     );
// }
//
// function getWalletOptionsWithWalletConnect(
//     discoveredMap: Map<string, WalletOption>
// ): WalletOption[] {
//     return [...Array.from(discoveredMap.values()), WALLETCONNECT_OPTION];
// }
//
// export default function LoginPage() {
//     const connectorRef = useRef<UniversalConnector | null>(null);
//     const discoveredWalletsRef = useRef<Map<string, WalletOption>>(new Map());
//
//     const [status, setStatus] = useState<Status>('idle');
//     const [message, setMessage] = useState('버튼을 눌러 지갑을 연결하세요.');
//     const [account, setAccount] = useState('');
//     const [chainId, setChainId] = useState('');
//     const [accessToken, setAccessToken] = useState('');
//     const [apiResult, setApiResult] = useState('');
//
//     const [walletOptions, setWalletOptions] = useState<WalletOption[]>([WALLETCONNECT_OPTION]);
//     const [showWalletOptions, setShowWalletOptions] = useState(false);
//     const [connectionType, setConnectionType] = useState<'walletconnect' | 'injected' | null>(null);
//     const [activeInjectedProvider, setActiveInjectedProvider] = useState<InjectedProvider | null>(null);
//
//     const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
//     const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';
//
//     const getWalletConnectProvider = (): WCProvider | null => {
//         return (connectorRef.current?.provider as WCProvider | undefined) ?? null;
//     };
//
//     const getActiveProvider = (): WCProvider | InjectedProvider | null => {
//         if (connectionType === 'walletconnect') {
//             return getWalletConnectProvider();
//         }
//
//         if (connectionType === 'injected') {
//             return activeInjectedProvider;
//         }
//
//         return null;
//     };
//
//     const getActiveSessionTopic = (): string => {
//         const provider = getWalletConnectProvider();
//         const topic = provider?.session?.topic;
//         return typeof topic === 'string' && topic.length > 0 ? topic : '';
//     };
//
//     const resetConnectionState = (nextMessage?: string) => {
//         setAccount('');
//         setChainId('');
//         setAccessToken('');
//         setConnectionType(null);
//         setActiveInjectedProvider(null);
//         setStatus('idle');
//         setMessage(nextMessage || '버튼을 눌러 지갑을 연결하세요.');
//     };
//
//     const disconnectConnector = async (nextMessage?: string) => {
//         try {
//             if (connectionType === 'walletconnect') {
//                 await connectorRef.current?.disconnect();
//             }
//         } catch {
//             // ignore
//         } finally {
//             resetConnectionState(nextMessage);
//         }
//     };
//
//     const validateEvmSelection = async (
//         nextAccount?: string,
//         nextChainId?: string
//     ): Promise<boolean> => {
//         if (!nextAccount || !isValidEvmAddress(nextAccount)) {
//             await disconnectConnector(
//                 '현재 선택된 계정은 EVM 계정이 아닙니다. MetaMask/Phantom/OKX Wallet 등의 EVM 계정으로 다시 연결해 주세요.'
//             );
//             return false;
//         }
//
//         const normalizedChainId = normalizeHexChainId(nextChainId || '');
//         const chainIdDecimal = Number.parseInt(normalizedChainId, 16);
//
//         if (
//             !normalizedChainId ||
//             !ALLOWED_CHAIN_IDS.includes(normalizedChainId) ||
//             !ALLOWED_CHAIN_IDS_DECIMAL.has(chainIdDecimal)
//         ) {
//             await disconnectConnector(
//                 getUserFriendlyEvmMessage(normalizedChainId || nextChainId)
//             );
//             return false;
//         }
//
//         return true;
//     };
//
//     const syncWalletConnectSession = async () => {
//         try {
//             const provider = getWalletConnectProvider();
//
//             console.log('[syncWalletConnectSession] provider', provider);
//             console.log('[syncWalletConnectSession] session', provider?.session);
//             console.log('[syncWalletConnectSession] topic', provider?.session?.topic);
//
//             if (!provider) {
//                 setStatus('idle');
//                 setMessage('WalletConnect provider가 아직 준비되지 않았습니다.');
//                 return;
//             }
//
//             if (!provider.session?.topic) {
//                 setStatus('idle');
//                 setMessage('버튼을 눌러 지갑을 연결하세요.');
//                 return;
//             }
//
//             const accounts = (await provider.request({
//                 method: 'eth_accounts',
//             })) as string[];
//
//             const currentChainId = (await provider.request({
//                 method: 'eth_chainId',
//             })) as string;
//
//             const selectedAccount = accounts?.[0] || '';
//
//             if (!selectedAccount) {
//                 resetConnectionState('연결된 계정이 없습니다.');
//                 return;
//             }
//
//             const isValid = await validateEvmSelection(selectedAccount, currentChainId);
//             if (!isValid) return;
//
//             setConnectionType('walletconnect');
//             setAccount(selectedAccount);
//             setChainId(normalizeHexChainId(currentChainId));
//             setStatus('connected');
//             setMessage(`연결 성공: ${selectedAccount} / chain ${normalizeHexChainId(currentChainId)}`);
//         } catch (error) {
//             console.error('[syncWalletConnectSession error]', error);
//             setStatus('idle');
//             setMessage('세션 확인 중 문제가 발생했습니다.');
//         }
//     };
//
//     const waitForSession = async (timeoutMs = 10000, intervalMs = 300) => {
//         const start = Date.now();
//
//         while (Date.now() - start < timeoutMs) {
//             const provider = getWalletConnectProvider();
//             if (provider?.session?.topic) {
//                 console.log('[waitForSession] ready topic', provider.session.topic);
//                 return true;
//             }
//             await new Promise((r) => setTimeout(r, intervalMs));
//         }
//
//         console.warn('[waitForSession] timeout');
//         return false;
//     };
//
//     useEffect(() => {
//         let mounted = true;
//         let provider: WCProvider | null = null;
//         let cleanupListeners: (() => void) | undefined;
//
//         const init = async () => {
//             try {
//                 if (!WALLETCONNECT_PROJECT_ID) {
//                     throw new Error(
//                         'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID가 없습니다. WalletConnect Dashboard에서 projectId를 발급받아 설정하세요.'
//                     );
//                 }
//
//                 setStatus('initializing');
//                 setMessage('WalletConnect 초기화 중...');
//
//                 const origin =
//                     typeof window !== 'undefined' ? window.location.origin : 'https://vobc.io';
//
//                 console.log('[WC origin]', origin);
//                 console.log('[WC projectId]', WALLETCONNECT_PROJECT_ID);
//
//                 const connector = await UniversalConnector.init({
//                     projectId: WALLETCONNECT_PROJECT_ID,
//                     metadata: {
//                         name: 'VOB Login Test',
//                         description: 'VOB Login with WalletConnect',
//                         url: origin,
//                         icons: [`${origin}/icon.png`],
//                     },
//                     networks: [
//                         {
//                             namespace: 'eip155',
//                             chains: [ethereumMainnet],
//                             methods: [
//                                 'eth_accounts',
//                                 'eth_requestAccounts',
//                                 'personal_sign',
//                                 'eth_signTypedData',
//                                 'eth_signTypedData_v4',
//                                 'eth_sendTransaction',
//                                 'wallet_switchEthereumChain',
//                             ],
//                             events: ['accountsChanged', 'chainChanged', 'disconnect'],
//                         },
//                     ],
//                 });
//
//                 if (!mounted) return;
//
//                 connectorRef.current = connector;
//                 provider = getWalletConnectProvider();
//
//                 console.log('[init] connector', connector);
//                 console.log('[init] provider', provider);
//                 console.log('[init] session', provider?.session);
//                 console.log('[init] topic', provider?.session?.topic);
//
//                 if (!provider) {
//                     setStatus('idle');
//                     setMessage('WalletConnect는 초기화됐지만 provider를 아직 찾지 못했습니다.');
//                     return;
//                 }
//
//                 provider.on?.('display_uri', (uri: string) => {
//                     console.log('[WC display_uri]', uri);
//                 });
//
//                 provider.on?.('connect', (...args: any[]) => {
//                     console.log('[WC connect]', args);
//                 });
//
//                 provider.on?.('session_event', (...args: any[]) => {
//                     console.log('[WC session_event]', args);
//                 });
//
//                 provider.on?.('disconnect', (...args: any[]) => {
//                     console.log('[WC disconnect]', args);
//                 });
//
//                 provider.on?.('session_delete', (...args: any[]) => {
//                     console.log('[WC session_delete]', args);
//                     resetConnectionState('지갑 세션이 종료되었습니다.');
//                 });
//
//                 const handleAccountsChanged = async (accounts: string[]) => {
//                     if (connectionType !== 'walletconnect') return;
//
//                     const nextAccount = accounts?.[0] || '';
//                     if (!nextAccount) {
//                         resetConnectionState('연결된 계정이 없습니다.');
//                         return;
//                     }
//
//                     const liveProvider = getWalletConnectProvider();
//                     let nextChainId = '';
//
//                     try {
//                         if (liveProvider?.session?.topic) {
//                             nextChainId = (await liveProvider.request({
//                                 method: 'eth_chainId',
//                             })) as string;
//                         }
//                     } catch (error) {
//                         console.error('[accountsChanged] eth_chainId error', error);
//                     }
//
//                     const isValid = await validateEvmSelection(nextAccount, nextChainId);
//                     if (!isValid) return;
//
//                     setAccount(nextAccount);
//                     setChainId(normalizeHexChainId(nextChainId));
//                     setStatus('connected');
//                     setMessage(`연결 성공: ${nextAccount}`);
//                 };
//
//                 const handleChainChanged = async (nextChainId: string) => {
//                     if (connectionType !== 'walletconnect') return;
//                     const normalized = normalizeHexChainId(nextChainId);
//                     setChainId(normalized);
//                 };
//
//                 const handleDisconnect = () => {
//                     if (connectionType !== 'walletconnect') return;
//                     resetConnectionState('지갑 연결이 해제되었습니다.');
//                 };
//
//                 provider.on?.('accountsChanged', handleAccountsChanged);
//                 provider.on?.('chainChanged', handleChainChanged);
//                 provider.on?.('disconnect', handleDisconnect);
//
//                 cleanupListeners = () => {
//                     provider?.removeListener?.('accountsChanged', handleAccountsChanged);
//                     provider?.removeListener?.('chainChanged', handleChainChanged);
//                     provider?.removeListener?.('disconnect', handleDisconnect);
//                 };
//
//                 if (provider?.session?.topic) {
//                     console.log('[init] existing session found', provider.session);
//                     await syncWalletConnectSession();
//                     return;
//                 }
//
//                 setStatus('idle');
//                 setMessage('버튼을 눌러 지갑을 연결하세요.');
//             } catch (error: any) {
//                 console.error('[init error]', error);
//                 if (!mounted) return;
//                 setStatus('failed');
//                 setMessage(error?.message || 'WalletConnect 초기화 실패');
//             }
//         };
//
//         init();
//
//         return () => {
//             mounted = false;
//             cleanupListeners?.();
//         };
//     }, [WALLETCONNECT_PROJECT_ID]);
//
//     useEffect(() => {
//         if (typeof window === 'undefined') return;
//
//         const handleAnnounceProvider = (event: Event) => {
//             const customEvent = event as CustomEvent<Eip6963AnnounceDetail>;
//             const detail = customEvent.detail;
//
//             if (!detail?.info || !detail?.provider) return;
//
//             const id =
//                 detail.info.rdns ||
//                 detail.info.uuid ||
//                 detail.info.name;
//
//             discoveredWalletsRef.current.set(id, {
//                 id,
//                 name: detail.info.name,
//                 icon: detail.info.icon,
//                 type: 'injected',
//                 provider: detail.provider,
//                 detected: true
//             });
//
//             setWalletOptions(
//                 getWalletOptionsWithWalletConnect(discoveredWalletsRef.current)
//             );
//         };
//
//         window.addEventListener(
//             'eip6963:announceProvider',
//             handleAnnounceProvider as EventListener
//         );
//
//         window.dispatchEvent(new Event('eip6963:requestProvider'));
//
//         setWalletOptions(getWalletOptionsWithWalletConnect(discoveredWalletsRef.current));
//
//         return () => {
//             window.removeEventListener(
//                 'eip6963:announceProvider',
//                 handleAnnounceProvider as EventListener
//             );
//         };
//     }, []);
//
//     useEffect(() => {
//         const handleResume = async () => {
//             if (document.visibilityState === 'visible' && connectionType === 'walletconnect') {
//                 console.log('[resume] syncing walletconnect session');
//                 await syncWalletConnectSession();
//             }
//         };
//
//         document.addEventListener('visibilitychange', handleResume);
//         window.addEventListener('focus', handleResume);
//
//         return () => {
//             document.removeEventListener('visibilitychange', handleResume);
//             window.removeEventListener('focus', handleResume);
//         };
//     }, [connectionType]);
//
//     useEffect(() => {
//         if (!activeInjectedProvider || connectionType !== 'injected') return;
//
//         const handleAccountsChanged = async (accounts: string[]) => {
//             const nextAccount = accounts?.[0] || '';
//             if (!nextAccount) {
//                 resetConnectionState('연결된 계정이 없습니다.');
//                 return;
//             }
//
//             try {
//                 const nextChainId = (await activeInjectedProvider.request({
//                     method: 'eth_chainId',
//                 })) as string;
//
//                 const isValid = await validateEvmSelection(nextAccount, nextChainId);
//                 if (!isValid) return;
//
//                 setAccount(nextAccount);
//                 setChainId(normalizeHexChainId(nextChainId));
//                 setStatus('connected');
//                 setMessage(`연결 성공: ${nextAccount}`);
//             } catch (error) {
//                 console.error('[injected accountsChanged] error', error);
//             }
//         };
//
//         const handleChainChanged = (nextChainId: string) => {
//             const normalized = normalizeHexChainId(nextChainId);
//             setChainId(normalized);
//         };
//
//         const handleDisconnect = () => {
//             resetConnectionState('지갑 연결이 해제되었습니다.');
//         };
//
//         activeInjectedProvider.on?.('accountsChanged', handleAccountsChanged);
//         activeInjectedProvider.on?.('chainChanged', handleChainChanged);
//         activeInjectedProvider.on?.('disconnect', handleDisconnect);
//
//         return () => {
//             activeInjectedProvider.removeListener?.('accountsChanged', handleAccountsChanged);
//             activeInjectedProvider.removeListener?.('chainChanged', handleChainChanged);
//             activeInjectedProvider.removeListener?.('disconnect', handleDisconnect);
//         };
//     }, [activeInjectedProvider, connectionType]);
//
//     const connectWalletConnect = async () => {
//         try {
//             const connector = connectorRef.current;
//             if (!connector) {
//                 setStatus('failed');
//                 setMessage('WalletConnect가 아직 초기화되지 않았습니다.');
//                 return;
//             }
//
//             console.log('[connectWalletConnect] start');
//             console.log('[connectWalletConnect] connector', connector);
//             console.log('[connectWalletConnect] provider before connect', getWalletConnectProvider());
//             console.log('[connectWalletConnect origin]', window.location.origin);
//
//             setStatus('connecting');
//             setMessage('WalletConnect 지갑 선택창 여는 중...');
//
//             const result = await connector.connect();
//
//             console.log('[connectWalletConnect] connect result', result);
//             console.log('[connectWalletConnect] provider after connect', getWalletConnectProvider());
//
//             const ready = await waitForSession();
//
//             if (!ready) {
//                 setStatus('failed');
//                 setMessage('세션이 준비되지 않았습니다. 다시 연결해주세요.');
//                 return;
//             }
//
//             setConnectionType('walletconnect');
//             setShowWalletOptions(false);
//             await syncWalletConnectSession();
//         } catch (error: any) {
//             console.error('[connectWalletConnect error]', error);
//
//             if (error?.code === 4001) {
//                 setStatus('rejected');
//                 setMessage('사용자가 연결 요청을 거절했습니다.');
//                 return;
//             }
//
//             setStatus('failed');
//             setMessage(error?.message || 'WalletConnect 연결에 실패했습니다.');
//         }
//     };
//
//     const connectInjectedWallet = async (provider: InjectedProvider) => {
//         try {
//             setStatus('connecting');
//             setMessage('브라우저 지갑 연결 중...');
//
//             const accounts = (await provider.request({
//                 method: 'eth_requestAccounts',
//             })) as string[];
//
//             const selectedAccount = accounts?.[0] || '';
//
//             if (!selectedAccount) {
//                 setStatus('failed');
//                 setMessage('연결된 계정이 없습니다.');
//                 return;
//             }
//
//             const currentChainId = (await provider.request({
//                 method: 'eth_chainId',
//             })) as string;
//
//             const isValid = await validateEvmSelection(selectedAccount, currentChainId);
//             if (!isValid) return;
//
//             setActiveInjectedProvider(provider);
//             setConnectionType('injected');
//             setAccount(selectedAccount);
//             setChainId(normalizeHexChainId(currentChainId));
//             setAccessToken('');
//             setStatus('connected');
//             setMessage(`연결 성공: ${selectedAccount} / chain ${normalizeHexChainId(currentChainId)}`);
//             setShowWalletOptions(false);
//         } catch (error: any) {
//             console.error('[connectInjectedWallet error]', error);
//
//             if (error?.code === 4001) {
//                 setStatus('rejected');
//                 setMessage('사용자가 연결 요청을 거절했습니다.');
//                 return;
//             }
//
//             setStatus('failed');
//             setMessage(error?.message || '브라우저 지갑 연결에 실패했습니다.');
//         }
//     };
//     const handleWalletOptionClick = async (option: WalletOption) => {
//         if (option.type === 'walletconnect') {
//             await connectWalletConnect();
//             return;
//         }
//
//         if (!option.provider) {
//             setStatus('failed');
//             setMessage('선택한 지갑 provider를 찾을 수 없습니다.');
//             return;
//         }
//
//         await connectInjectedWallet(option.provider);
//     };
//
//     const loginWithWeb3 = async () => {
//         try {
//             if (!account) {
//                 setApiResult('먼저 EVM 지갑을 연결하세요.');
//                 return;
//             }
//
//             const provider = getActiveProvider();
//             if (!provider) {
//                 setApiResult('연결된 provider를 찾을 수 없습니다.');
//                 return;
//             }
//
//             if (connectionType === 'walletconnect') {
//                 const topic = getActiveSessionTopic();
//                 const wcProvider = getWalletConnectProvider();
//
//                 console.log('[login] active topic', topic);
//                 console.log('[login] session', wcProvider?.session);
//
//                 if (!topic || !wcProvider?.session) {
//                     setStatus('idle');
//                     setApiResult('WalletConnect 세션이 만료되었거나 끊어졌습니다. 다시 연결해 주세요.');
//                     return;
//                 }
//             }
//
//             const currentChainId = (await provider.request({
//                 method: 'eth_chainId',
//             })) as string;
//
//             const isValid = await validateEvmSelection(account, currentChainId);
//             if (!isValid) {
//                 setApiResult('비 EVM 계정 또는 지원되지 않는 체인에서는 로그인할 수 없습니다.');
//                 return;
//             }
//
//             setApiResult('1) nonce 요청 중...');
//
//             const nonceRes = await fetch(`${API_BASE_URL}/web3/auth/nonce`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 credentials: 'include',
//                 body: JSON.stringify({
//                     address: account,
//                 }),
//             });
//
//             const nonceData = await nonceRes.json().catch(() => null);
//
//             if (!nonceRes.ok || !nonceData?.message) {
//                 setApiResult(
//                     `nonce 요청 실패 (${nonceRes.status}) ${
//                         nonceData ? JSON.stringify(nonceData, null, 2) : ''
//                     }`
//                 );
//                 return;
//             }
//
//             console.log('[nonceData]', nonceData);
//             const signMessage = nonceData.message;
//             const hexMessage = toHexUtf8(signMessage);
//
//             console.log('[signMessage raw]', signMessage);
//             console.log('[signMessage hex]', hexMessage);
//             console.log('[sign account]', account);
//
//             if (connectionType === 'walletconnect') {
//                 const wcProvider = getWalletConnectProvider();
//                 console.log('[provider session before sign]', wcProvider?.session);
//             }
//
//             setApiResult('2) 서명 요청 중...');
//
//             const signature = (await provider.request({
//                 method: 'personal_sign',
//                 params: [hexMessage, account, 'Sign in to VOB'],
//             })) as string;
//
//             setApiResult('3) verify 요청 중...');
//
//             const verifyRes = await fetch(`${API_BASE_URL}/web3/auth/verify`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 credentials: 'include',
//                 body: JSON.stringify({
//                     address: account,
//                     signature,
//                     nonce: nonceData.nonce
//                 }),
//             });
//
//             const verifyData = await verifyRes.json().catch(() => null);
//
//             if (!verifyRes.ok) {
//                 setApiResult(
//                     `verify 실패 (${verifyRes.status}) ${
//                         verifyData ? JSON.stringify(verifyData, null, 2) : ''
//                     }`
//                 );
//                 return;
//             }
//
//             const token = verifyData?.accessToken ?? '';
//             setAccessToken(token);
//
//             setApiResult(
//                 `로그인 성공\n\n${JSON.stringify(
//                     {
//                         nonceResponse: nonceData,
//                         verifyResponse: verifyData,
//                     },
//                     null,
//                     2
//                 )}`
//             );
//         } catch (error: any) {
//             console.error('[loginWithWeb3 error raw]', error);
//             console.error('[loginWithWeb3 error message]', error?.message);
//             console.error('[loginWithWeb3 error code]', error?.code);
//             console.error('[loginWithWeb3 error data]', error?.data);
//
//             const msg = String(error?.message || '');
//
//             if (error?.code === 4001) {
//                 setApiResult('사용자가 서명 요청을 거절했습니다.');
//                 return;
//             }
//
//             if (connectionType === 'walletconnect' && msg.includes("session topic doesn't exist")) {
//                 await disconnectConnector('세션이 끊어졌습니다. WalletConnect를 다시 연결해 주세요.');
//                 setApiResult('서명 중 WalletConnect 세션이 사라졌습니다. 다시 연결 후 시도해 주세요.');
//                 return;
//             }
//
//             setApiResult(
//                 `로그인 에러:
//                 message=${error?.message || 'unknown error'}
//                 code=${error?.code ?? 'unknown'}
//                 data=${JSON.stringify(error?.data ?? null, null, 2)}`
//             );
//         }
//     };
//
//     const logoutWeb3 = async () => {
//
//         try {
//             await fetch(`${API_BASE_URL}/web3/auth/logout`, {method: 'POST', credentials: 'include'})
//             setAccessToken('');
//             setApiResult('로그아웃됨. accessToken 제거 완료');
//         } catch (error: any) {
//             setApiResult(`로그아웃 에러: ${error?.message || 'unknown error'}`);
//         }
//     };
//
//     const requestWeb3Test = async () => {
//         try {
//             setApiResult('/web3/test 요청 중...');
//
//             const headers: Record<string, string> = {
//                 'Content-Type': 'application/json',
//             };
//
//             if (accessToken) {
//                 headers.Authorization = `Bearer ${accessToken}`;
//             }
//
//             const res = await fetch(`${API_BASE_URL}/web3/test`, {
//                 method: 'GET',
//                 headers,
//                 credentials: 'include',
//             });
//
//             const contentType = res.headers.get('content-type') || '';
//             const body = contentType.includes('application/json')
//                 ? JSON.stringify(await res.json(), null, 2)
//                 : await res.text();
//
//             setApiResult(`/web3/test 응답\nstatus: ${res.status}\n\n${body}`);
//         } catch (error: any) {
//             setApiResult(`/web3/test 요청 에러: ${error?.message || 'unknown error'}`);
//         }
//     };
//
//     const refreshTokenTest = async () => {
//         try {
//             setApiResult('refresh 요청 중...');
//
//             const res = await fetch(`${API_BASE_URL}/web3/auth/refresh`, {
//                 method: 'POST',
//                 credentials: 'include',
//             });
//
//             const data = await res.json().catch(() => null);
//
//             if (!res.ok) {
//                 setApiResult(
//                     `refresh 실패 (${res.status}) ${
//                         data ? JSON.stringify(data, null, 2) : ''
//                     }`
//                 );
//                 return;
//             }
//
//             const newAccessToken = data?.accessToken ?? '';
//
//             setAccessToken(newAccessToken);
//
//             setApiResult(`refresh 성공\n\n${JSON.stringify(data, null, 2)}`);
//         } catch (error: any) {
//             setApiResult(`refresh 에러: ${error?.message}`);
//         }
//     };
//
//     const isConnected = !!account && status === 'connected'
//
//     return (
//         <main style={styles.main}>
//             <div style={styles.card}>
//                 <h1 style={styles.title}>Web3 로그인 테스트</h1>
//                 <p style={styles.desc}>
//                     감지된 확장 지갑 또는 WalletConnect로 EVM 지갑을 연결한 뒤 Web3 로그인과 보호된 API 호출을 테스트할 수 있습니다.
//                 </p>
//
//                 <div style={styles.statusBox}>
//                     <div>
//                         <strong>Status:</strong> {status}
//                     </div>
//                     <div style={styles.message}>{message}</div>
//
//                     {account && (
//                         <div style={{ marginTop: 8, wordBreak: 'break-word' }}>
//                             <strong>Account:</strong> {account}
//                         </div>
//                     )}
//
//                     {chainId && (
//                         <div style={{ marginTop: 8, wordBreak: 'break-word' }}>
//                             <strong>Chain:</strong> {chainId}
//                         </div>
//                     )}
//
//                     {connectionType && (
//                         <div style={{ marginTop: 8 }}>
//                             <strong>Provider Type:</strong> {connectionType}
//                         </div>
//                     )}
//
//                     {accessToken && (
//                         <div style={{ marginTop: 8, wordBreak: 'break-all' }}>
//                             <strong>Access Token:</strong> {accessToken}
//                         </div>
//                     )}
//                 </div>
//
//                 {
//                     !isConnected && (
//                     <>
//                         <button
//                             onClick={() => setShowWalletOptions((prev) => !prev)}
//                             style={styles.button}
//                         >
//                             {showWalletOptions ? '지갑 선택창 닫기' : '지갑 연결'}
//                         </button>
//
//                         {showWalletOptions && (
//                             <div style={styles.walletOptionBox}>
//                                 {walletOptions.map((option) => (
//                                     <button
//                                         key={option.id}
//                                         onClick={() => handleWalletOptionClick(option)}
//                                         style={styles.walletOptionButton}
//                                     >
//                                         {option.icon ? (
//                                             <img
//                                                 src={option.icon}
//                                                 alt={option.name}
//                                                 style={styles.walletOptionIcon}
//                                             />
//                                         ) : (
//                                             <div style={styles.walletOptionIconFallback}>
//                                                 {option.name.slice(0, 1)}
//                                             </div>
//                                         )}
//                                         <span>{option.name}</span>
//                                         {option.detected && (
//                                             <span style={{ color: '#9ca3af', fontSize: '12px', marginLeft: 6 }}>
//                                                 (detected)
//                                             </span>
//                                         )}
//                                     </button>
//                                 ))}
//                             </div>
//                         )}
//                     </>
//                 )}
//
//                 <button
//                     onClick={() => disconnectConnector('지갑 연결을 직접 해제했습니다.')}
//                     style={styles.buttonSecondary}
//                 >
//                     지갑 연결 해제
//                 </button>
//
//                 <button onClick={loginWithWeb3} style={styles.buttonSecondary}>
//                     Web3 로그인 시도
//                 </button>
//
//                 <button onClick={requestWeb3Test} style={styles.buttonSecondary}>
//                     /web3/test 요청
//                 </button>
//
//                 <button onClick={logoutWeb3} style={styles.buttonSecondary}>
//                     Web3 로그아웃
//                 </button>
//
//                 <button onClick={refreshTokenTest} style={styles.buttonSecondary}>
//                     Refresh 테스트
//                 </button>
//
//                 <div style={styles.resultBox}>
//                     <strong>API Result</strong>
//                     <pre style={styles.resultText}>{apiResult || '아직 요청 없음'}</pre>
//                 </div>
//             </div>
//         </main>
//     );
// }
//
// const styles: Record<string, React.CSSProperties> = {
//     main: {
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: '24px',
//         background: '#111827',
//     },
//     card: {
//         width: '100%',
//         maxWidth: '560px',
//         background: '#1f2937',
//         color: '#fff',
//         borderRadius: '16px',
//         padding: '24px',
//         boxSizing: 'border-box',
//     },
//     title: {
//         margin: 0,
//         marginBottom: '12px',
//         fontSize: '24px',
//         fontWeight: 700,
//     },
//     desc: {
//         margin: 0,
//         marginBottom: '20px',
//         lineHeight: 1.6,
//         color: '#d1d5db',
//     },
//     statusBox: {
//         padding: '16px',
//         borderRadius: '12px',
//         background: '#374151',
//         lineHeight: 1.6,
//     },
//     message: {
//         marginTop: '8px',
//         color: '#e5e7eb',
//         wordBreak: 'break-word',
//     },
//     button: {
//         marginTop: '16px',
//         width: '100%',
//         padding: '12px 16px',
//         borderRadius: '10px',
//         border: 'none',
//         background: '#f97316',
//         color: '#fff',
//         fontWeight: 700,
//         cursor: 'pointer',
//     },
//     buttonSecondary: {
//         marginTop: '12px',
//         width: '100%',
//         padding: '12px 16px',
//         borderRadius: '10px',
//         border: '1px solid #6b7280',
//         background: '#111827',
//         color: '#fff',
//         fontWeight: 700,
//         cursor: 'pointer',
//     },
//     walletOptionBox: {
//         marginTop: '12px',
//         display: 'grid',
//         gap: '10px',
//     },
//     walletOptionButton: {
//         width: '100%',
//         display: 'flex',
//         alignItems: 'center',
//         gap: '12px',
//         padding: '12px 14px',
//         borderRadius: '12px',
//         border: '1px solid #4b5563',
//         background: '#111827',
//         color: '#fff',
//         cursor: 'pointer',
//         fontWeight: 700,
//     },
//     walletOptionIcon: {
//         width: '28px',
//         height: '28px',
//         borderRadius: '9999px',
//         objectFit: 'cover',
//         background: '#fff',
//     },
//     walletOptionIconFallback: {
//         width: '28px',
//         height: '28px',
//         borderRadius: '9999px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         background: '#374151',
//         color: '#fff',
//         fontSize: '12px',
//         fontWeight: 700,
//         flexShrink: 0,
//     },
//     resultBox: {
//         marginTop: '16px',
//         padding: '16px',
//         borderRadius: '12px',
//         background: '#111827',
//         border: '1px solid #374151',
//     },
//     resultText: {
//         marginTop: '12px',
//         whiteSpace: 'pre-wrap',
//         wordBreak: 'break-word',
//         color: '#d1d5db',
//         fontSize: '13px',
//         lineHeight: 1.5,
//     },
// };

export default async function Page() {
    return (
        <div>
            page
        </div>
    )
}