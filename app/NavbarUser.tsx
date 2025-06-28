"use client";
import React, { useEffect, useRef, useState } from 'react';
import { auth, provider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NavbarUser() {
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
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
            {!user ? (
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleLogin}
                    className="w-full sm:w-auto px-6 py-2 rounded-lg bg-accent text-white font-bold shadow-lg hover:bg-accent/80 transition text-base"
                >
                    Sign in with Google
                </motion.button>
            ) : (
                <>
                    <img src={user.photoURL || '/default-avatar.png'} alt={user.displayName || 'avatar'} className="w-10 h-10 rounded-full border-2 border-accent shadow mb-2 sm:mb-0" />
                    <Link
                        href="/profile"
                        className="w-full sm:w-auto px-4 py-2 rounded-lg bg-glass/80 text-accent font-semibold hover:bg-accent/10 transition text-center"
                    >
                        Profile
                    </Link>
                    <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-200 text-red-700 font-semibold">Sign Out</button>
                </>
            )}
        </div>
    );
} 