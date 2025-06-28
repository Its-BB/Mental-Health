import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '../lib/utils';
import GlobalNavbar from './GlobalNavbar';
import { DarkModeProvider } from './DarkModeProvider';
import { JournalLoginProvider } from './JournalLoginContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'MindBloom – Mental Health & Well-being',
    description: 'Your safe space for mental wellness journey',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn(inter.className, "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-black dark:via-gray-800 dark:to-slate-900 min-h-screen transition-all duration-500")}>
                <JournalLoginProvider>
                    <DarkModeProvider>
                        <GlobalNavbar />
                        <main>{children}</main>
                    </DarkModeProvider>
                </JournalLoginProvider>
            </body>
        </html>
    );
}