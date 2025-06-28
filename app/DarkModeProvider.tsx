'use client';
import React, { createContext, useContext } from 'react';

interface DarkModeContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function useDarkMode() {
    const ctx = useContext(DarkModeContext);
    if (!ctx) throw new Error('useDarkMode must be used within DarkModeProvider');
    return ctx;
}

export const DarkModeProvider = ({ children }: { children: React.ReactNode }) => {
    React.useEffect(() => {
        document.documentElement.classList.add('dark');
    }, []);

    const toggleDarkMode = () => { };

    return (
        <DarkModeContext.Provider value={{ isDarkMode: true, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
}; 