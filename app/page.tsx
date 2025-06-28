'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Moon, Sun, MessageCircle, BookOpen, Sparkles, Users, Calendar, Settings } from 'lucide-react';
import Link from 'next/link';
import { useDarkMode } from './DarkModeProvider';

const QUOTE_API = 'https://zenquotes.io/api/random';

export default function MindBloomHomepage() {
    const { isDarkMode } = useDarkMode();
    const [currentQuote, setCurrentQuote] = useState("Your mental health matters. Take it one day at a time.");
    const [currentAuthor, setCurrentAuthor] = useState("");
    const [favoriteQuotes, setFavoriteQuotes] = useState<{ quote: string, author: string }[]>([]);
    const [isGuest, setIsGuest] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);

    useEffect(() => {
        const guest = localStorage.getItem('mindbloom-guest');
        setIsGuest(guest === 'true');
        const anon = localStorage.getItem('mindbloom-anonymous');
        setIsAnonymous(anon === 'true');
    }, []);

    const [currentTime, setCurrentTime] = useState(new Date());

    const inspirationalQuotes = [
        "Your mental health matters. Take it one day at a time.",
        "Progress, not perfection. Every small step counts.",
        "You are stronger than you think, braver than you believe.",
        "Healing isn't linear. Be patient with yourself.",
        "It's okay to not be okay. Reaching out is a sign of strength.",
        "Your feelings are valid. You deserve peace and happiness.",
        "Mental health is not a destination, but a process.",
        "You are worthy of love, especially from yourself."
    ];

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const favs = localStorage.getItem('mindbloom-favorite-quotes');
        if (favs) setFavoriteQuotes(JSON.parse(favs));
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    const generateNewQuote = () => {
        const randomQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
        setCurrentQuote(randomQuote);
    };

    const handleGuestMode = () => {
        setIsGuest(true);
        localStorage.setItem('mindbloom-guest', 'true');
    };

    const handleToggleAnonymity = () => {
        setIsAnonymous((prev) => {
            localStorage.setItem('mindbloom-anonymous', String(!prev));
            return !prev;
        });
    };

    const fetchQuote = async () => {
        try {
            const res = await fetch('/api/quote');
            const data = await res.json();
            if (Array.isArray(data) && data[0]) {
                setCurrentQuote(data[0].q || "Stay positive!");
                setCurrentAuthor(data[0].a || "");
            } else {
                setCurrentQuote("Couldn't fetch a quote. Try again!");
                setCurrentAuthor("");
            }
        } catch {
            setCurrentQuote("Couldn't fetch a quote. Try again!");
            setCurrentAuthor("");
        }
    };

    const handleNewQuote = () => fetchQuote();

    const handleFavorite = () => {
        const newFav = { quote: currentQuote, author: currentAuthor };
        const updated = [...favoriteQuotes, newFav];
        setFavoriteQuotes(updated);
        localStorage.setItem('mindbloom-favorite-quotes', JSON.stringify(updated));
    };

    return (
        <div className={`min-h-screen transition-all duration-500 ${isDarkMode
            ? 'bg-gradient-to-br from-black via-gray-800 to-slate-900'
            : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
            }`}>
            {/* Floating Particles */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute rounded-full particle-float ${isDarkMode ? 'bg-gray-400 shadow-gray-500/50' : 'bg-purple-400'
                            }`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 10 + 5}px`,
                            height: `${Math.random() * 10 + 5}px`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 3 + 4}s`
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-12 relative z-10">
                {/* Welcome Section */}
                <div className="text-center mb-16">
                    <div className={`inline-block px-6 py-2 rounded-full mb-6 ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-200 border border-gray-600' : 'bg-purple-100 text-purple-700'
                        }`}>
                        {getGreeting()}, Welcome to Your Safe Space 🌸
                    </div>

                    <h2 className={`text-5xl md:text-6xl font-bold mb-8 ${isDarkMode ? 'text-gray-100' : 'text-slate-800'
                        }`}>
                        Your Mental Health
                        <span className={`block ${isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-100'
                            : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600'
                            }`}>
                            Matters
                        </span>
                    </h2>

                    <p className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-slate-600'
                        }`}>
                        A safe, supportive space for your mental wellness journey.
                        Connect, reflect, and grow at your own pace.
                    </p>
                </div>

                {/* Daily Quote Card */}
                <div className={`max-w-4xl mx-auto mb-16 p-8 rounded-3xl backdrop-blur-md border transition-all duration-300 hover:scale-[1.02] ${isDarkMode
                    ? 'bg-slate-800/40 border-purple-300/20'
                    : 'bg-white/40 border-purple-200/30'
                    }`}>
                    <div className="text-center">
                        <div className={`inline-flex items-center space-x-2 mb-6 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'
                            }`}>
                            <Sparkles className="w-5 h-5" />
                            <span className="font-semibold">Daily Inspiration</span>
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <blockquote className={`text-2xl md:text-3xl font-light italic mb-2 leading-relaxed ${isDarkMode ? 'text-white' : 'text-slate-800'
                            }`}>
                            "{currentQuote}"
                        </blockquote>
                        {currentAuthor && <div className={`mb-4 ${isDarkMode ? 'text-purple-200' : 'text-purple-700'}`}>— {currentAuthor}</div>}
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleNewQuote}
                                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg ${isDarkMode
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-400 hover:to-pink-400'
                                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                                    }`}
                            >
                                New Quote ✨
                            </button>
                            <button
                                onClick={handleFavorite}
                                className={`px-8 py-3 rounded-full font-semibold border-2 ${isDarkMode
                                    ? 'border-purple-400 text-purple-300 hover:bg-purple-500/20'
                                    : 'border-purple-600 text-purple-600 hover:bg-purple-100'
                                    }`}
                            >
                                Favorite ❤️
                            </button>
                        </div>
                        {favoriteQuotes.length > 0 && (
                            <div className="mt-8 text-left">
                                <h4 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-purple-200' : 'text-purple-700'}`}>Your Favorite Quotes</h4>
                                <ul className="space-y-2">
                                    {favoriteQuotes.map((fav, i) => (
                                        <li key={i} className={`p-3 rounded-lg flex items-center justify-between ${isDarkMode ? 'bg-slate-900/60 text-purple-100' : 'bg-purple-50 text-purple-700'}`}>
                                            <span>“{fav.quote}” <span className="block text-xs mt-1">{fav.author}</span></span>
                                            <button
                                                onClick={() => {
                                                    const updated = favoriteQuotes.filter((_, idx) => idx !== i);
                                                    setFavoriteQuotes(updated);
                                                    localStorage.setItem('mindbloom-favorite-quotes', JSON.stringify(updated));
                                                }}
                                                className="ml-4 px-2 py-1 rounded bg-pink-600 text-white text-xs hover:bg-pink-700 transition"
                                                title="Remove from favorites"
                                            >Unfav ✕</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {[
                        {
                            icon: BookOpen,
                            title: "Personal Journal",
                            description: "Write your thoughts, track your mood, and reflect on your journey.",
                            color: "from-blue-400 to-blue-600"
                        },
                        {
                            icon: MessageCircle,
                            title: "AI Therapist",
                            description: "Chat with our compassionate AI for support and guidance 24/7.",
                            color: "from-green-400 to-green-600"
                        },
                        {
                            icon: Users,
                            title: "Anonymous Community",
                            description: "Connect with others anonymously in a safe, supportive environment.",
                            color: "from-purple-400 to-purple-600"
                        },
                        {
                            icon: Calendar,
                            title: "Weekly Reflections",
                            description: "Guided prompts to help you process your week and set intentions.",
                            color: "from-pink-400 to-pink-600"
                        },
                        {
                            icon: Sparkles,
                            title: "Mood Analytics",
                            description: "Visualize your emotional patterns and celebrate your progress.",
                            color: "from-yellow-400 to-orange-500"
                        },
                        {
                            icon: Heart,
                            title: "Self-Care Reminders",
                            description: "Gentle nudges to practice mindfulness and self-compassion.",
                            color: "from-red-400 to-red-600"
                        }
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className={`p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${isDarkMode
                                ? 'bg-slate-800/40 border-purple-300/20 hover:bg-slate-800/60'
                                : 'bg-white/40 border-purple-200/30 hover:bg-white/60'
                                }`}
                        >
                            <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${feature.color} mb-4`}>
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-800'
                                }`}>
                                {feature.title}
                            </h3>
                            <p className={`${isDarkMode ? 'text-purple-100' : 'text-slate-600'
                                }`}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <div className={`max-w-2xl mx-auto p-8 rounded-3xl backdrop-blur-md border ${isDarkMode
                        ? 'bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-purple-300/20'
                        : 'bg-gradient-to-r from-purple-50/60 to-pink-50/60 border-purple-200/30'
                        }`}>
                        <h3 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'
                            }`}>
                            Ready to Begin Your Journey?
                        </h3>
                        <p className={`text-lg mb-8 ${isDarkMode ? 'text-purple-100' : 'text-slate-600'
                            }`}>
                            Take the first step towards better mental health today. You're not alone in this.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/journal">
                                <button className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg ${isDarkMode
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-400 hover:to-pink-400'
                                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                                    }`}>
                                    Start Journaling 📝
                                </button>
                            </Link>
                            <Link href="/therapist">
                                <button className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 border-2 ${isDarkMode
                                    ? 'border-purple-400 text-purple-300 hover:bg-purple-500/20'
                                    : 'border-purple-600 text-purple-600 hover:bg-purple-100'
                                    }`}>
                                    Chat with AI 🤖
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className={`mt-20 py-8 border-t ${isDarkMode
                ? 'border-purple-300/20 bg-slate-900/50'
                : 'border-purple-200/30 bg-white/20'
                }`}>
                <div className="container mx-auto px-6 text-center">
                    <p className={`${isDarkMode ? 'text-purple-200' : 'text-slate-600'
                        }`}>
                        © 2025 MindBloom. Your privacy and well-being are our priority. 💜
                    </p>
                </div>
            </footer>
        </div>
    );
}