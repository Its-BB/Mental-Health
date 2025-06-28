'use client';
import React, { useState } from 'react';
import { useDarkMode } from '../DarkModeProvider';

const PRESET_OPTIONS = [
    'I feel anxious',
    'I feel sad',
    'I feel stressed',
    'I feel okay',
    'I need motivation',
];

export default function TherapistPage() {
    const { isDarkMode } = useDarkMode();
    const [messages, setMessages] = useState([
        { from: 'ai', text: 'Hello! I am your AI therapist. How are you feeling today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async (msg: string) => {
        setMessages((prev) => [...prev, { from: 'user', text: msg }]);
        setLoading(true);
        try {
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: `You are a mental health AI therapist. Respond empathetically and helpfully to: ${msg}` }),
            });
            const data = await res.json();
            setMessages((prev) => [...prev, { from: 'ai', text: data.response || 'Sorry, I am having trouble responding right now.' }]);
        } catch {
            setMessages((prev) => [...prev, { from: 'ai', text: 'Sorry, I am having trouble responding right now.' }]);
        }
        setLoading(false);
    };

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input.trim());
            setInput('');
        }
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">AI Therapist</h1>
            <div className={`max-w-2xl mx-auto rounded-3xl p-6 mb-8 ${isDarkMode ? 'bg-slate-900/80' : 'bg-white/80'} shadow-lg`}>
                <div className="flex flex-col gap-4 mb-4 max-h-[400px] overflow-y-auto">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${m.from === 'user' ? 'bg-purple-700 text-white' : 'bg-slate-800 text-purple-100'}`}>{m.text}</div>
                        </div>
                    ))}
                    {loading && <div className="text-center text-purple-300">AI is typing...</div>}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                    {PRESET_OPTIONS.map(opt => (
                        <button key={opt} onClick={() => sendMessage(opt)} className="px-4 py-2 rounded-full bg-purple-800 text-purple-100 text-sm hover:bg-purple-700 transition">{opt}</button>
                    ))}
                </div>
                <div className="flex gap-2 mt-2">
                    <input
                        className="flex-1 p-3 rounded-xl bg-slate-800 text-white border border-purple-700 focus:outline-none"
                        placeholder="Let's talk..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-pink-700 text-white font-semibold disabled:opacity-60"
                        disabled={loading || !input.trim()}
                    >Send</button>
                </div>
            </div>
        </div>
    );
} 