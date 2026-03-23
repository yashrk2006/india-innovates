"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Insight {
    text: string;
    impact: "HIGH" | "MEDIUM" | "LOW";
}

interface AIStrategicAdvisorProps {
    stats: any;
    activity: any[];
}

export default function AIStrategicAdvisor({ stats, activity }: AIStrategicAdvisorProps) {
    const [insights, setInsights] = useState<Insight[]>([
        { text: "Operational summary pending. Click refresh to prime the Tactical Engine with current field data.", impact: "LOW" }
    ]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const runAnalysis = async () => {
        setIsAnalyzing(true);
        try {
            const response = await fetch("/api/ai/analysis/strategic", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    stats,
                    recentActivity: activity.slice(0, 5),
                    voterSentiment: "Potentially rising due to recent infrastructure completion reports."
                })
            });
            const data = await response.json();
            if (data.analysis) {
                const formatted = data.analysis.map((text: string, i: number) => ({
                    text,
                    impact: i === 0 ? "HIGH" : i === 1 ? "MEDIUM" : "LOW"
                }));
                setInsights(formatted);
            }
        } catch (error) {
            console.error("Analysis Failed:", error);
        }
        setIsAnalyzing(false);
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-500/10 mb-8 p-1">
            <div className="bg-slate-950/50 rounded-[2.2rem] p-8 border border-white/5 relative">
                {/* AI Pulse Indicator */}
                <div className="absolute top-8 right-8 flex items-center gap-3">
                    <div className={`size-3 rounded-full ${isAnalyzing ? "bg-indigo-500 animate-ping" : "bg-emerald-500"}`} />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        {isAnalyzing ? "Processing Neural Engine..." : "Strategic Engine Live"}
                    </span>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-10">
                    <div className="shrink-0 lg:border-r border-white/10 lg:pr-10">
                        <h4 className="flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-widest mb-2">
                            <span className="material-symbols-outlined text-lg">psychology</span>
                            Tactical Advisor
                        </h4>
                        <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-4">
                            Operational Intelligence
                        </h2>
                        <button 
                            onClick={runAnalysis}
                            disabled={isAnalyzing}
                            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest px-8 py-3 rounded-2xl transition-all shadow-lg shadow-indigo-600/20"
                        >
                            {isAnalyzing ? "Analyzing Ecosystem..." : "Refresh Intelligence"}
                        </button>
                    </div>

                    <div className="flex-1 space-y-4">
                        <AnimatePresence mode="wait">
                            {isAnalyzing ? (
                                <motion.div 
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-24 flex items-center justify-center border border-white/5 border-dashed rounded-3xl"
                                >
                                    <div className="flex gap-2">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="size-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {insights.map((insight, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="bg-white/5 border border-white/10 p-5 rounded-3xl hover:bg-white/[0.08] transition-all cursor-pointer group"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                                                    insight.impact === 'HIGH' ? 'bg-rose-500 text-white' : 
                                                    insight.impact === 'MEDIUM' ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-300'
                                                }`}>
                                                    {insight.impact} EFFECT
                                                </div>
                                                <span className="material-symbols-outlined text-white/20 text-lg group-hover:text-indigo-400 transition-colors">trending_up</span>
                                            </div>
                                            <p className="text-[12px] text-slate-300 font-bold leading-relaxed">
                                                {insight.text}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
