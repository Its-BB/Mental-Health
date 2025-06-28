'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, provider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

interface JournalLoginContextType {
    user: User | null;
    isGuest: boolean;
    isAnonymous: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    continueAsGuest: () => void;
    toggleAnonymity: () => void;
}

const JournalLoginContext = createContext<JournalLoginContextType | undefined>(undefined);

export function useJournalLogin() {
    const ctx = useContext(JournalLoginContext);
    if (!ctx) throw new Error('useJournalLogin must be used within JournalLoginProvider');
    return ctx;
}

export const JournalLoginProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isGuest, setIsGuest] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    useEffect(() => {
        const guest = localStorage.getItem('mindbloom-guest');
        setIsGuest(guest === 'true');
        const anon = localStorage.getItem('mindbloom-anonymous');
        setIsAnonymous(anon === 'true');
    }, []);

    const loginWithGoogle = async () => {
        await signInWithPopup(auth, provider);
        setIsGuest(false);
    };
    const logout = async () => {
        await signOut(auth);
        setIsGuest(false);
    };
    const continueAsGuest = () => {
        setIsGuest(true);
        localStorage.setItem('mindbloom-guest', 'true');
    };
    const toggleAnonymity = () => {
        setIsAnonymous((prev) => {
            localStorage.setItem('mindbloom-anonymous', String(!prev));
            return !prev;
        });
    };

    return (
        <JournalLoginContext.Provider value={{ user, isGuest, isAnonymous, loginWithGoogle, logout, continueAsGuest, toggleAnonymity }}>
            {children}
        </JournalLoginContext.Provider>
    );
}; 