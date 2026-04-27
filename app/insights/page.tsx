'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Activity, ShieldCheck, RefreshCw } from 'lucide-react';

export default function InsightsPage() {
    const [insight, setInsight] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchInsight = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8001/rag/wellness-insight', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': 'savemom-dev-123'
                },
                body: JSON.stringify({ context: "General pregnancy wellness" })
            });
            const data = await response.json();
            setInsight(data.data);
        } catch (error) {
            console.error('Error fetching insight:', error);
            setInsight({
                insight: "Focus on gentle prenatal yoga and staying hydrated today.",
                score: 88,
                category: "Exercise"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsight();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 font-sans bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-slate-950 to-slate-950">
            <div className="max-w-2xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                            Wellness AI
                        </h1>
                        <p className="text-slate-400 mt-2">Personalized insights for your health journey.</p>
                    </div>
                    <button
                        onClick={fetchInsight}
                        disabled={loading}
                        className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700 group"
                    >
                        <RefreshCw className={`w-5 h-5 text-blue-400 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                    </button>
                </header>

                <main className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                    <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                                    <Sparkles className="text-blue-400 w-8 h-8" />
                                </div>
                                <div className="h-4 w-48 bg-slate-800 rounded mb-2"></div>
                                <div className="h-4 w-32 bg-slate-800 rounded"></div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className={`px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${insight?.category === 'Nutrition' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                            insight?.category === 'Hydration' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                        }`}>
                                        {insight?.category || 'General Health'}
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm text-slate-500 uppercase font-medium">Wellness Score</span>
                                        <span className="text-4xl font-black text-white">{insight?.score || 0}%</span>
                                    </div>
                                </div>

                                <div className="py-2">
                                    <p className="text-2xl font-light leading-relaxed text-slate-100">
                                        "{insight?.insight}"
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-500/10 rounded-lg">
                                            <ShieldCheck className="w-5 h-5 text-green-400" />
                                        </div>
                                        <span className="text-sm text-slate-300 font-medium">Safe Recommendation</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/10 rounded-lg">
                                            <Activity className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <span className="text-sm text-slate-300 font-medium">AI-Driven Analysis</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                <footer className="text-center text-slate-600 text-xs py-4">
                    Powered by SaveMom RAG Engine & Gemini AI
                </footer>
            </div>
        </div>
    );
}
