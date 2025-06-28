'use client';
import React, { useState, useEffect } from 'react';
import { useJournalLogin } from '../JournalLoginContext';
import { useDarkMode } from '../DarkModeProvider';
import dynamic from 'next/dynamic';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

const MOODS = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '😠', label: 'Angry' },
    { emoji: '😨', label: 'Anxious' },
    { emoji: '😐', label: 'Neutral' },
];

export default function JournalPage() {
    const { user, isGuest, isAnonymous, loginWithGoogle, continueAsGuest, toggleAnonymity, logout } = useJournalLogin();
    const { isDarkMode } = useDarkMode();
    const [mood, setMood] = useState('');
    const [entry, setEntry] = useState('');
    const [entries, setEntries] = useState<any[]>([]);
    const [filterMood, setFilterMood] = useState('');
    const [filterDate, setFilterDate] = useState('');

    // Load entries from localStorage or Firestore
    useEffect(() => {
        async function fetchEntries() {
            if (isGuest || isAnonymous || !user) {
                const local = localStorage.getItem('mindbloom-journal-entries');
                setEntries(local ? JSON.parse(local) : []);
            } else {
                // Firestore integration for logged-in users
                const q = query(collection(db, 'journalEntries'), where('uid', '==', user.uid));
                const snap = await getDocs(q);
                setEntries(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
            }
        }
        fetchEntries();
    }, [user, isGuest, isAnonymous]);

    // Autosave entry
    useEffect(() => {
        if (entry) localStorage.setItem('mindbloom-journal-draft', entry);
    }, [entry]);

    useEffect(() => {
        const draft = localStorage.getItem('mindbloom-journal-draft');
        if (draft) setEntry(draft);
    }, []);

    const handleSave = async () => {
        const newEntry = {
            text: entry,
            mood,
            date: new Date().toISOString().slice(0, 10),
            uid: user?.uid || null,
        };
        let updated;
        if (isGuest || isAnonymous || !user) {
            updated = [newEntry, ...entries];
            setEntries(updated);
            localStorage.setItem('mindbloom-journal-entries', JSON.stringify(updated));
            localStorage.removeItem('mindbloom-journal-draft');
        } else {
            // Firestore integration for logged-in users
            const docRef = await addDoc(collection(db, 'journalEntries'), newEntry);
            updated = [{ ...newEntry, id: docRef.id }, ...entries];
            setEntries(updated);
        }
        setEntry('');
        setMood('');
    };

    const handleDelete = async (id: string) => {
        if (isGuest || isAnonymous || !user) {
            const updated = entries.filter(e => e.id !== id);
            setEntries(updated);
            localStorage.setItem('mindbloom-journal-entries', JSON.stringify(updated));
        } else {
            await deleteDoc(doc(db, 'journalEntries', id));
            setEntries(entries.filter(e => e.id !== id));
        }
    };

    const handleEdit = async (id: string, newText: string) => {
        if (isGuest || isAnonymous || !user) {
            const updated = entries.map(e => e.id === id ? { ...e, text: newText } : e);
            setEntries(updated);
            localStorage.setItem('mindbloom-journal-entries', JSON.stringify(updated));
        } else {
            await updateDoc(doc(db, 'journalEntries', id), { text: newText });
            setEntries(entries.map(e => e.id === id ? { ...e, text: newText } : e));
        }
    };

    const filteredEntries = entries.filter(e =>
        (!filterMood || e.mood === filterMood) &&
        (!filterDate || e.date === filterDate)
    );

    // --- Analytics ---
    // Mood graph data
    const moodCounts: Record<string, number> = {};
    entries.forEach(e => {
        if (e.mood) moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
    });
    const moodData = {
        labels: MOODS.map(m => m.label),
        datasets: [{
            label: 'Mood Frequency',
            data: MOODS.map(m => moodCounts[m.label] || 0),
            backgroundColor: 'rgba(168, 85, 247, 0.7)',
        }],
    };
    // Word cloud data
    function getWordCloud(entries: any[]) {
        const text = entries.map(e => e.text).join(' ').toLowerCase();
        const words = text.match(/\b\w{4,}\b/g) || [];
        const freq: Record<string, number> = {};
        words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
        return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 15);
    }
    const wordCloud = getWordCloud(entries);
    // Streak system
    function getStreak(entries: any[]) {
        const days = new Set(entries.map(e => e.date));
        const sorted = Array.from(days).sort().reverse();
        let streak = 0;
        let d = new Date();
        for (let i = 0; i < sorted.length; i++) {
            if (sorted[i] === d.toISOString().slice(0, 10)) {
                streak++;
                d.setDate(d.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    }
    const streak = getStreak(entries);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Journal / Diary</h1>
            {/* --- Analytics Section --- */}
            <div className="mb-8 grid md:grid-cols-3 gap-6">
                <div className="bg-slate-900/80 rounded-xl p-4 shadow text-purple-100">
                    <div className="font-semibold mb-2">Mood Graph</div>
                    <Bar data={moodData} options={{ plugins: { legend: { display: false } }, scales: { x: { grid: { color: '#a78bfa22' } }, y: { grid: { color: '#a78bfa22' }, beginAtZero: true } } }} height={180} />
                </div>
                <div className="bg-slate-900/80 rounded-xl p-4 shadow text-purple-100">
                    <div className="font-semibold mb-2">Word Cloud</div>
                    <div className="flex flex-wrap gap-2">
                        {wordCloud.length === 0 ? <span className="text-purple-300">No data</span> : wordCloud.map(([word, count]) => (
                            <span key={word} className="px-2 py-1 rounded bg-purple-800 text-purple-200 text-sm" style={{ fontSize: 12 + Math.min(count * 2, 24) }}>{word}</span>
                        ))}
                    </div>
                </div>
                <div className="bg-slate-900/80 rounded-xl p-4 shadow text-purple-100 flex flex-col items-center justify-center">
                    <div className="font-semibold mb-2">Streak</div>
                    <div className="text-4xl font-bold text-pink-400">{streak} <span className="text-lg text-purple-200">days</span></div>
                    {streak > 1 && <div className="text-purple-300 mt-1">Keep it up!</div>}
                </div>
            </div>
            {/* --- End Analytics Section --- */}
            <div className="mb-4">
                <span className="block text-lg mb-2">How are you feeling today?</span>
                <div className="flex space-x-2 mb-4">
                    {MOODS.map(m => (
                        <span
                            key={m.label}
                            className={`text-2xl cursor-pointer transition ring-offset-2 ${mood === m.label ? (isDarkMode ? 'ring-2 ring-purple-400 bg-slate-800/80' : 'ring-2 ring-purple-500 bg-purple-100') : (isDarkMode ? 'bg-slate-800/60 hover:bg-slate-800/80' : 'bg-purple-50 hover:bg-purple-100')} rounded-full p-2`}
                            onClick={() => setMood(m.label)}
                        >{m.emoji}</span>
                    ))}
                </div>
                <textarea
                    className={`w-full p-4 rounded-lg border min-h-[120px] mb-2 ${isDarkMode ? 'bg-slate-900/80 text-purple-100 border-purple-800 placeholder-purple-400' : 'bg-white/70 text-black border-purple-200 placeholder-purple-400'}`}
                    placeholder="Write your thoughts... (Markdown supported)"
                    value={entry}
                    onChange={e => setEntry(e.target.value)}
                />
                <button onClick={handleSave} className="mt-2 px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold">Save Entry</button>
            </div>
            <div className="flex gap-4 mb-6">
                <select value={filterMood} onChange={e => setFilterMood(e.target.value)} className={`rounded px-3 py-2 transition ${isDarkMode ? 'bg-slate-900/80 text-purple-100 border border-purple-800' : 'bg-purple-50 text-purple-700 border border-purple-200'}`}>
                    <option value="">All Moods</option>
                    {MOODS.map(m => <option key={m.label} value={m.label}>{m.label}</option>)}
                </select>
                <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className={`rounded px-3 py-2 transition ${isDarkMode ? 'bg-slate-900/80 text-purple-100 border border-purple-800' : 'bg-purple-50 text-purple-700 border border-purple-200'}`} />
            </div>
            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-2">Your Past Entries</h2>
                {filteredEntries.length === 0 && (
                    <div className="bg-white/60 dark:bg-slate-900/80 rounded-lg p-4 text-gray-700 dark:text-purple-200">
                        No entries found.
                        {(isGuest || isAnonymous) && (
                            <div className="mt-2 text-xs text-purple-400">Entries are saved locally in your browser in guest/anonymous mode.</div>
                        )}
                    </div>
                )}
                <ul className="space-y-4">
                    {filteredEntries.map((e, i) => (
                        <li key={e.id || i} className="bg-slate-900/60 rounded-lg p-4 text-purple-100">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">{MOODS.find(m => m.label === e.mood)?.emoji || '📝'}</span>
                                <span className="text-sm text-gray-400">{e.date}</span>
                                <span className="ml-2 text-xs px-2 py-1 rounded bg-purple-900 text-purple-200">{e.mood}</span>
                                <button onClick={() => handleDelete(e.id)} className="ml-auto px-2 py-1 rounded bg-red-700 text-white text-xs">Delete</button>
                            </div>
                            <div className="prose prose-purple max-w-none">
                                <ReactMarkdown>{e.text}</ReactMarkdown>
                            </div>
                            <button onClick={() => {
                                const newText = prompt('Edit your entry:', e.text);
                                if (newText !== null) handleEdit(e.id, newText);
                            }} className="mt-2 px-3 py-1 rounded bg-purple-700 text-white text-xs">Edit</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
} 