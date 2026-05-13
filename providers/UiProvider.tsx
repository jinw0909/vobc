'use client';

import { createContext, useContext, useState } from 'react';

type UiContextValue = {
    isConnectModalOpen: boolean;
    openConnectModal: () => void;
    closeConnectModal: () => void;
};

const UiContext = createContext<UiContextValue | null>(null);

export function UiProvider({ children }: { children: React.ReactNode }) {
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

    const openConnectModal = () => setIsConnectModalOpen(true);
    const closeConnectModal = () => setIsConnectModalOpen(false);

    return (
        <UiContext.Provider
            value={{
                isConnectModalOpen,
                openConnectModal,
                closeConnectModal,
            }}
        >
            {children}
        </UiContext.Provider>
    );
}

export function useUi() {
    const context = useContext(UiContext);

    if (!context) {
        throw new Error('useUi must be used within UiProvider');
    }

    return context;
}