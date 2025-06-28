'use client';
import React, { useEffect, useRef, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { useJournalLogin } from '../JournalLoginContext';
import { useDarkMode } from '../DarkModeProvider';
import { Filter } from 'bad-words';
import { v4 as uuidv4 } from 'uuid';

const REACTIONS = ['❤️', '✨'];

export default function ChatPage() {
    const { user, isAnonymous } = useJournalLogin();
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [replyTo, setReplyTo] = useState<string>('');
    const [ticker, setTicker] = useState("You're not alone! 💜");
    const chatRef = useRef<HTMLDivElement>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const myId = user?.uid || sessionId;

    useEffect(() => {
        const q = query(collection(db, 'publicChat'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, snap => {
            const all = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setMessages(all.slice(0, 10).reverse());
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const tickers = [
            "You're not alone! 💜",
            "Someone just sent a message!",
            "Stay positive, you matter!",
            "Sending good vibes to everyone!",
        ];
        let i = 0;
        const interval = setInterval(() => {
            setTicker(tickers[i % tickers.length]);
            i++;
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let id = localStorage.getItem('mindbloom-chat-session');
        if (!id) {
            id = uuidv4();
            localStorage.setItem('mindbloom-chat-session', id || '');
        }
        setSessionId(id);
    }, []);

    const sendMessage = async () => {
        if (!input.trim() || !myId) return;
        const filter = new Filter();
        const filtered = filter.clean(input.trim());
        await addDoc(collection(db, 'publicChat'), {
            text: filtered,
            createdAt: serverTimestamp(),
            reactions: {},
            anonymous: true,
            sender: myId,
            replyTo,
        });
        setInput('');
        setReplyTo('');
    };

    const addReaction = async (id: string, reaction: string) => {
        const msg = messages.find(m => m.id === id);
        if (!msg) return;
        const reactions = { ...msg.reactions, [reaction]: (msg.reactions?.[reaction] || 0) + 1 };
        await updateDoc(doc(db, 'publicChat', id), { reactions });
    };

    const handleReply = (msg: any) => {
        setReplyTo(msg.id || '');
        setInput(`@${msg.text.slice(0, 20)} `);
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Anonymous Public Chat</h1>
            <div className="mb-4 text-center text-purple-300 font-semibold animate-pulse">{ticker}</div>
            <div ref={chatRef} className="bg-slate-900/80 rounded-xl p-6 mb-4 max-h-[400px] overflow-y-auto shadow-inner">
                {messages.map(m => {
                    const isMine = m.sender === myId;
                    return (
                        <div key={m.id} className={`mb-4 flex ${isMine ? 'justify-end' : 'justify-start'} items-start gap-3`}>
                            {!isMine && <span className="rounded-full bg-purple-800 px-3 py-1 text-purple-200 text-xs">Anonymous</span>}
                            <div className={`bg-slate-800 px-4 py-2 rounded-lg shadow text-purple-100 flex-1 max-w-[70%] ${isMine ? 'ml-auto' : ''}`}>
                                {m.replyTo && <div className="text-xs text-purple-400 mb-1">Replying to...</div>}
                                {m.text}
                                <div className="flex gap-2 mt-1">
                                    <button onClick={() => handleReply(m)} className="text-xs text-blue-400 hover:underline">Reply</button>
                                    {REACTIONS.map(r => (
                                        <button key={r} onClick={() => addReaction(m.id, r)} className="text-lg hover:scale-125 transition">
                                            {r} <span className="text-xs">{m.reactions?.[r] || 0}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {isMine && <span className="rounded-full bg-pink-800 px-3 py-1 text-pink-200 text-xs">You</span>}
                        </div>
                    );
                })}
            </div>
            <div className="flex gap-2 mt-2">
                <input
                    className="flex-1 p-3 rounded-xl bg-slate-800 text-white border border-purple-700 focus:outline-none"
                    placeholder="Type your message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                />
                <button
                    onClick={sendMessage}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-pink-700 text-white font-semibold disabled:opacity-60"
                    disabled={!input.trim()}
                >Send</button>
            </div>
        </div>
    );
} 
