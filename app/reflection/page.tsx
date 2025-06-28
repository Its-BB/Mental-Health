"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from "firebase/firestore";
import { useJournalLogin } from "../JournalLoginContext";
import { useDarkMode } from "../DarkModeProvider";

const PROMPTS = [
    "What was the highlight of your week?",
    "What challenged you this week, and how did you handle it?",
    "What is something you are grateful for right now?",
    "Describe a moment you felt proud of yourself this week.",
    "What is one thing you want to improve next week?",
    "How did you take care of your mental health this week?",
    "What is a lesson you learned recently?",
    "Who or what inspired you this week?",
    "What is something you want to let go of?",
    "What is a small win you can celebrate?",
];

function getCurrentSunday() {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day;
    const sunday = new Date(now.setDate(diff));
    sunday.setHours(0, 0, 0, 0);
    return sunday.toISOString().slice(0, 10);
}

function getPromptForWeek() {
    // Deterministic: pick prompt based on week number
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const week = Math.floor(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
    return PROMPTS[week % PROMPTS.length];
}

export default function ReflectionPage() {
    const { user, isGuest } = useJournalLogin();
    const { isDarkMode } = useDarkMode();
    const [reflection, setReflection] = useState("");
    const [past, setPast] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const prompt = getPromptForWeek();
    const sunday = getCurrentSunday();

    // Load past reflections
    useEffect(() => {
        if (isGuest) {
            const data = localStorage.getItem("mindbloom-reflections");
            setPast(data ? JSON.parse(data) : []);
            setLoading(false);
        } else if (user) {
            const q = query(
                collection(db, "reflections"),
                where("uid", "==", user.uid),
                orderBy("createdAt", "desc")
            );
            return onSnapshot(q, (snap) => {
                setPast(snap.docs.map((d) => ({ ...d.data(), id: d.id })));
                setLoading(false);
            });
        }
    }, [user, isGuest]);

    // Load this week's reflection if exists
    useEffect(() => {
        if (isGuest) {
            const data = localStorage.getItem("mindbloom-reflections");
            if (data) {
                const arr = JSON.parse(data);
                const found = arr.find((r: any) => r.sunday === sunday);
                if (found) setReflection(found.text);
            }
        } else if (user && past.length > 0) {
            const found = past.find((r) => r.sunday === sunday);
            if (found) setReflection(found.text);
        }
    }, [past, user, isGuest, sunday]);

    const handleSave = async () => {
        if (!reflection.trim()) return;
        if (isGuest) {
            let arr = past.filter((r: any) => r.sunday !== sunday);
            arr = [{ sunday, prompt, text: reflection, createdAt: new Date().toISOString() }, ...arr];
            localStorage.setItem("mindbloom-reflections", JSON.stringify(arr));
            setPast(arr);
        } else if (user) {
            await addDoc(collection(db, "reflections"), {
                uid: user.uid,
                sunday,
                prompt,
                text: reflection,
                createdAt: serverTimestamp(),
            });
        }
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Weekly Reflection</h1>
            <div className="max-w-2xl mx-auto bg-slate-900/80 rounded-3xl p-6 mb-8 shadow-lg">
                <div className="mb-4 text-purple-300 font-semibold text-lg">{prompt}</div>
                <textarea
                    className="w-full min-h-[120px] p-4 rounded-xl bg-slate-800 text-white border border-purple-700 focus:outline-none mb-4"
                    placeholder="Write your reflection for this week..."
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                />
                <button
                    onClick={handleSave}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-pink-700 text-white font-semibold disabled:opacity-60"
                    disabled={!reflection.trim()}
                >Save Reflection</button>
            </div>
            <div className="max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold mb-4 text-purple-200">Past Prompts & Reflections</h2>
                {loading ? (
                    <div className="text-purple-300">Loading...</div>
                ) : past.length === 0 ? (
                    <div className="bg-slate-800/80 rounded-lg p-4 text-purple-200">No past reflections yet.</div>
                ) : (
                    <ul className="space-y-4">
                        {past.map((r, i) => (
                            <li key={r.sunday || i} className="bg-slate-900/60 rounded-lg p-4 text-purple-100">
                                <div className="text-sm text-purple-400 mb-1">{r.prompt}</div>
                                <div className="mb-1">{r.text}</div>
                                <div className="text-xs text-purple-700">Week of {r.sunday}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
} 