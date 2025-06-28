"use client";
import React, { useState } from 'react';
import { useJournalLogin } from '../JournalLoginContext';

export default function SettingsPage() {
    const { user, isGuest, isAnonymous, logout, loginWithGoogle } = useJournalLogin();
    const [showPrivacy, setShowPrivacy] = useState(false);

    const handleClearGuestData = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <div className="bg-slate-900/80 rounded-lg p-6 text-purple-100 mb-4">
                <div className="mb-4">
                    <div className="font-semibold mb-2">Account Info</div>
                    {user ? (
                        <div>Signed in as <span className="font-mono bg-purple-800 px-2 py-1 rounded text-purple-200">{user.email}</span></div>
                    ) : isGuest ? (
                        <div>Guest Mode <span className="ml-2 px-2 py-1 rounded bg-gray-700 text-gray-200 text-xs">Local only</span></div>
                    ) : isAnonymous ? (
                        <div>Anonymous Mode <span className="ml-2 px-2 py-1 rounded bg-yellow-700 text-yellow-200 text-xs">Anonymous</span></div>
                    ) : null}
                    {!user && (
                        <button onClick={loginWithGoogle} className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">Sign In with Google</button>
                    )}
                </div>
                <ul className="space-y-4">
                    <li className="flex items-center justify-between">
                        <span>Clear Guest Data</span>
                        <button onClick={handleClearGuestData} className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold">Clear</button>
                    </li>
                    <li className="flex items-center justify-between">
                        <span>Sign Out</span>
                        <button onClick={logout} className="px-4 py-2 rounded-full bg-red-200 text-red-700 font-semibold">Sign Out</button>
                    </li>
                    <li className="flex items-center justify-between">
                        <span>Privacy & Terms</span>
                        <button onClick={() => setShowPrivacy(true)} className="px-4 py-2 rounded-full bg-purple-700 text-white font-semibold">View</button>
                    </li>
                </ul>
            </div>
            <div className="bg-slate-900/80 rounded-lg p-6 text-purple-100 mb-4">
                <div className="font-semibold mb-2">Privacy & Security</div>
                <ul className="list-disc ml-6 space-y-2 text-purple-200">
                    <li>Your data is private unless you choose to share it.</li>
                    <li>Guest data never leaves your device.</li>
                    <li>Anonymous mode hides your identity everywhere.</li>
                    <li>All chat and journal data is encrypted in transit.</li>
                </ul>
            </div>
            {showPrivacy && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-slate-900 rounded-2xl p-8 max-w-lg w-full text-purple-100 relative">
                        <button onClick={() => setShowPrivacy(false)} className="absolute top-2 right-2 text-purple-300 hover:text-white">✕</button>
                        <h2 className="text-2xl font-bold mb-4">Privacy & Terms</h2>
                        <ul className="list-disc ml-6 space-y-2 text-purple-200 mb-4">
                            <li>Your data is private unless you choose to share it.</li>
                            <li>Guest data never leaves your device.</li>
                            <li>Anonymous mode hides your identity everywhere.</li>
                            <li>We do not sell or share your data with third parties.</li>
                            <li>All data is encrypted in transit.</li>
                            <li>You can clear your data at any time in settings.</li>
                        </ul>
                        <div className="text-xs text-purple-400">By using MindBloom, you agree to these terms and our commitment to your privacy and well-being.</div>
                    </div>
                </div>
            )}
        </div>
    );
} 