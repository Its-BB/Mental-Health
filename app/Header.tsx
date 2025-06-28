'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { auth, provider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

export default function Header() {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);
    const handleLogin = async () => {
        await signInWithPopup(auth, provider);
    };
    const handleLogout = async () => {
        await signOut(auth);
    };
    return (
        <header className="w-full py-4 px-6 flex items-center justify-between bg-white/30 dark:bg-black/60 border-b border-purple-200/30 dark:border-gray-600/30">
            <div className="flex items-center space-x-4">
                <Link href="/" className="text-2xl font-bold text-purple-700 dark:text-gray-100">MindBloom</Link>
                <nav className="flex space-x-4">
                    <Link href="/journal" className="hover:underline text-slate-700 dark:text-gray-200">Journal</Link>
                    <Link href="/chat" className="hover:underline text-slate-700 dark:text-gray-200">Chat</Link>
                    <Link href="/therapist" className="hover:underline text-slate-700 dark:text-gray-200">Therapist</Link>
                    <Link href="/settings" className="hover:underline text-slate-700 dark:text-gray-200">Settings</Link>
                </nav>
            </div>
            <div className="flex items-center gap-4">
                {!user ? (
                    <button
                        onClick={handleLogin}
                        className="px-6 py-2 rounded-lg bg-accent text-white font-bold shadow-lg hover:bg-accent/80 transition text-base"
                    >
                        Sign in with Google
                    </button>
                ) : (
                    <>
                        <img src={user.photoURL || '/default-avatar.png'} alt={user.displayName || 'avatar'} className="w-10 h-10 rounded-full border-2 border-accent shadow" />
                        <Link href="/profile" className="px-4 py-2 rounded-lg bg-glass/80 text-accent font-semibold hover:bg-accent/10 transition">Profile</Link>
                        <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-200 text-red-700 font-semibold">Sign Out</button>
                    </>
                )}
            </div>
        </header>
    );
} 