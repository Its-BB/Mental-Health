'use client';
import React, { useState, useEffect } from 'react';
import { Heart, Moon, Sun, MessageCircle, BookOpen, Sparkles, Users, Calendar, Settings } from 'lucide-react';
import Link from 'next/link';
import { useDarkMode } from './DarkModeProvider';
import { useJournalLogin } from './JournalLoginContext';

export default function GlobalNavbar() {
    const { isDarkMode } = useDarkMode();
    const { user, isGuest, isAnonymous, loginWithGoogle, continueAsGuest, toggleAnonymity, logout } = useJournalLogin();
    const [homeLink, setHomeLink] = useState('https://example.com');
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setHomeLink(process.env.NEXT_PUBLIC_HOME_LINK || 'https://example.com');
        }
    }, []);
    return (
        <header className={`backdrop-blur-md border-b transition-all duration-300 ${isDarkMode
            ? 'bg-black/60 border-gray-600/30'
            : 'bg-white/30 border-purple-200/30'
            }`}>
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* Left: Back to Main Page Button */}
                <a
                    href={homeLink}
                    className={`text-[9px] px-1.5 py-0.5 rounded-full border font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-purple-400 ${isDarkMode ? 'bg-slate-800 text-purple-200 border-purple-700 hover:bg-slate-700' : 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200'} -ml-6`}
                    style={{ minWidth: 'fit-content' }}
                >
                    ← Back to Main Page
                </a>
                {/* Center/Right: Rest of Navbar */}
                <div className="flex items-center justify-between flex-1 ml-4">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full bg-gradient-to-r from-gray-700 to-gray-600`}>
                            <Heart className={`w-6 h-6 text-gray-300`} />
                        </div>
                        <Link href="/" className={`text-2xl font-bold text-gray-100`}>MindBloom</Link>
                    </div>
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/journal" className="flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 text-slate-600 hover:bg-purple-100 hover:text-purple-700 dark:text-gray-300 dark:hover:bg-gradient-to-r dark:hover:from-gray-700 dark:hover:to-gray-600 dark:hover:text-white"><BookOpen className="w-4 h-4" /><span className="font-medium">Journal</span></Link>
                        <Link href="/chat" className="flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 text-slate-600 hover:bg-purple-100 hover:text-purple-700 dark:text-gray-300 dark:hover:bg-gradient-to-r dark:hover:from-gray-700 dark:hover:to-gray-600 dark:hover:text-white"><MessageCircle className="w-4 h-4" /><span className="font-medium">Chat</span></Link>
                        <Link href="/therapist" className="flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 text-slate-600 hover:bg-purple-100 hover:text-purple-700 dark:text-gray-300 dark:hover:bg-gradient-to-r dark:hover:from-gray-700 dark:hover:to-gray-600 dark:hover:text-white"><Sparkles className="w-4 h-4" /><span className="font-medium">AI Therapist</span></Link>
                        <Link href="/reflection" className="flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 text-slate-600 hover:bg-purple-100 hover:text-purple-700 dark:text-gray-300 dark:hover:bg-gradient-to-r dark:hover:from-gray-700 dark:hover:to-gray-600 dark:hover:text-white"><Calendar className="w-4 h-4" /><span className="font-medium">Reflection</span></Link>
                        <Link href="/settings" className="flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 text-slate-600 hover:bg-purple-100 hover:text-purple-700 dark:text-gray-300 dark:hover:bg-gradient-to-r dark:hover:from-gray-700 dark:hover:to-gray-600 dark:hover:text-white"><Settings className="w-4 h-4" /><span className="font-medium">Settings</span></Link>
                    </nav>
                </div>
            </div>
        </header>
    );
} 