"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ManagerPageLayout, { MgrCard, MgrSection, MgrKPI, MgrBar } from "@/components/features/manager/ManagerPageLayout";
import { useApi } from "@/lib/hooks";

function Icon({ name, size = 16, className = "", style }: { name: string; size?: number; className?: string; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size, ...style }}>{name}</span>;
}

const wards = [
    { name: "Ward 12", favorable: 62, neutral: 21, opposed: 17, topIssues: ["Water", "Roads"], sentiment: 0.68 },
    { name: "Ward 14", favorable: 48, neutral: 28, opposed: 24, topIssues: ["Employment", "Sanitation"], sentiment: 0.48 },
    { name: "Ward 15", favorable: 55, neutral: 25, opposed: 20, topIssues: ["Health", "Roads"], sentiment: 0.58 },
    { name: "Ward 16", favorable: 42, neutral: 30, opposed: 28, topIssues: ["Crime", "Water"], sentiment: 0.38 },
    { name: "Ward 18", favorable: 58, neutral: 22, opposed: 20, topIssues: ["Education", "Power"], sentiment: 0.60 },
    { name: "Ward 19", favorable: 35, neutral: 25, opposed: 40, topIssues: ["Employment", "Crime"], sentiment: 0.30 },
    { name: "Ward 20", favorable: 72, neutral: 18, opposed: 10, topIssues: ["Infrastructure"], sentiment: 0.78 },
    { name: "Ward 22", favorable: 50, neutral: 28, opposed: 22, topIssues: ["Water", "Sanitation"], sentiment: 0.52 },
];

const demographics = [
    { segment: "Youth (18-25)", favorable: 58, size: 24000, trending: "up" },
    { segment: "Women", favorable: 62, size: 42000, trending: "up" },
    { segment: "Senior Citizens", favorable: 55, size: 18000, trending: "stable" },
    { segment: "First-time Voters", favorable: 64, size: 12000, trending: "up" },
    { segment: "Farmers", favorable: 48, size: 8000, trending: "down" },
    { segment: "Traders/Business", favorable: 52, size: 15000, trending: "stable" },
];

const trendColor: Record<string, string> = { up: "#10b981", down: "#ef4444", stable: "#f59e0b" };
const trendIcon: Record<string, string> = { up: "trending_up", down: "trending_down", stable: "trending_flat" };

const grievances = [
    { issue: "Water Supply", count: 342, ward: "Ward 16", priority: "HIGH", actionTaken: "DC notified, tanker deployed" },
    { issue: "Road Conditions", count: 278, ward: "Ward 14", priority: "HIGH", actionTaken: "PWD repair initiated" },
    { issue: "Unemployment", count: 245, ward: "Ward 19", priority: "CRITICAL", actionTaken: "Skill camp organized" },
    { issue: "Electricity Cuts", count: 189, ward: "Ward 18", priority: "MEDIUM", actionTaken: "UPPCL complaint raised" },
    { issue: "Sanitation", count: 156, ward: "Ward 22", priority: "MEDIUM", actionTaken: "SMC team dispatched" },
    { issue: "Crime/Safety", count: 134, ward: "Ward 16", priority: "HIGH", actionTaken: "SP briefed, extra patrol" },
];

const priColor: Record<string, string> = { CRITICAL: "#ef4444", HIGH: "#f59e0b", MEDIUM: "#60a5fa", LOW: "#10b981" };

export default function VoterPulsePage() {
    const [view, setView] = useState<"wards" | "demographics" | "grievances">("wards");
    const avgSentiment = Math.round(wards.reduce((s, w) => s + w.sentiment, 0) / wards.length * 100);

    // ── Live data from backend ──
    const { data: voterDemo } = useApi<any>("/api/voters?demographics=true", null);
    const { data: grievanceStats } = useApi<any>("/api/grievances?stats=true", null);

    return (
        <ManagerPageLayout title="Sentiment Analysis Matrix" badge="PSY-OPS INTEL" badgeColor="#1c1917">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                <MgrKPI icon="psychology" label="Net Sentiment" value={`${avgSentiment}%`} sub="Favorable Pulse" color={avgSentiment > 55 ? "#10b981" : "#f59e0b"} delay={0.1} />
                <MgrKPI icon="contact_emergency" label="Intel Gathered" value={voterDemo?.total?.toLocaleString() || "4,200"} sub="Voters Profiled" color="#1c1917" delay={0.15} />
                <MgrKPI icon="notification_important" label="Active Flashpoints" value="Water" sub={`${grievanceStats?.total || 342} Reports`} color="#ef4444" delay={0.2} />
                <MgrKPI icon="trending_up" label="Trajectory" value="↑ 3.2%" sub="Weekly Delta" color="#10b981" delay={0.25} />
                <MgrKPI icon="hub" label="Segments" value={voterDemo?.segments ? Object.keys(voterDemo.segments).length.toString() : "6"} sub="Identity Groups" color="#6366f1" delay={0.3} />
            </div>

            <div className="flex bg-stone-100 p-1.5 rounded-[2rem] w-fit mb-8 gap-1 shadow-inner">
                {(["wards", "demographics", "grievances"] as const).map(v => (
                    <button 
                        key={v} 
                        onClick={() => setView(v)} 
                        className={`text-[11px] font-black px-8 py-3 rounded-full uppercase tracking-[0.15em] transition-all flex items-center gap-3 ${view === v ? "bg-white text-stone-900 shadow-xl scale-105" : "text-stone-400 hover:text-stone-600"}`}
                    >
                        <Icon name={v === "wards" ? "location_on" : v === "demographics" ? "diversity_3" : "troubleshoot"} size={18} />
                        {v}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {view === "wards" && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.98 }}
                        key="wards"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {wards.map((w, i) => (
                            <motion.div key={w.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                <MgrCard>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="space-y-1">
                                                <h4 className="text-[14px] text-stone-900 font-black uppercase tracking-tight leading-none">{w.name}</h4>
                                                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Zone Sector Alpha</span>
                                            </div>
                                            <div className={`size-12 rounded-2xl flex items-center justify-center text-[18px] font-black shadow-lg border-2 border-white ${w.sentiment > 0.6 ? "bg-emerald-50 text-emerald-600" : w.sentiment > 0.4 ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"}`}>
                                                {Math.round(w.sentiment * 100)}%
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4 mb-6">
                                            <div className="flex gap-0.5 h-4 rounded-xl overflow-hidden shadow-inner bg-stone-100 p-0.5">
                                                <div className="bg-emerald-400 rounded-l-lg transition-all duration-1000" style={{ width: `${w.favorable}%` }} />
                                                <div className="bg-stone-300 transition-all duration-1000" style={{ width: `${w.neutral}%` }} />
                                                <div className="bg-rose-400 rounded-r-lg transition-all duration-1000" style={{ width: `${w.opposed}%` }} />
                                            </div>
                                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                                <span className="text-emerald-600">FAV {w.favorable}%</span>
                                                <span className="text-stone-400">NEU {w.neutral}%</span>
                                                <span className="text-rose-600">OPP {w.opposed}%</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-100">
                                            {w.topIssues.map(iss => (
                                                <span key={iss} className="text-[9px] font-black uppercase tracking-[0.1em] bg-stone-50 text-stone-500 px-3 py-1.5 rounded-lg border border-stone-100 hover:border-stone-300 transition-all cursor-default">{iss}</span>
                                            ))}
                                        </div>
                                    </div>
                                </MgrCard>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {view === "demographics" && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: -20 }}
                        key="demographics"
                    >
                        <MgrCard>
                            <MgrSection title="Identity Alignment Database" icon="account_tree" />
                            <div className="p-4 space-y-1">
                                {demographics.map((d, i) => (
                                    <motion.div key={d.segment} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                        className="px-8 py-6 rounded-3xl hover:bg-stone-50/50 transition-all flex items-center gap-8 group">
                                        <div className="size-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-900 font-black border-2 border-white shadow-sm group-hover:scale-110 transition-all">
                                            {d.segment.charAt(0)}
                                        </div>
                                        <div className="w-48 space-y-1">
                                            <span className="text-[14px] text-stone-900 font-black uppercase tracking-tight block leading-none">{d.segment}</span>
                                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.15em]">{(d.size / 1000).toFixed(1)}K Units</span>
                                        </div>
                                        <div className="flex-1 px-8">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Approval Rating</span>
                                                <span className="text-[10px] font-black text-stone-900 uppercase tracking-widest">{d.favorable}%</span>
                                            </div>
                                            <MgrBar pct={d.favorable} color={d.favorable > 55 ? "#10b981" : d.favorable > 45 ? "#f59e0b" : "#ef4444"} h={8} />
                                        </div>
                                        <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 border shadow-sm ${trendColor[d.trending] === "#10b981" ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100"}`}>
                                            <Icon name={trendIcon[d.trending]} size={18} style={{ color: trendColor[d.trending] }} />
                                            <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: trendColor[d.trending] }}>{d.trending}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </MgrCard>
                    </motion.div>
                )}

                {view === "grievances" && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -20 }}
                        key="grievances"
                    >
                        <MgrCard>
                            <MgrSection title="Response Command Center" icon="center_focus_strong" />
                            <div className="p-4 space-y-2">
                                {grievances.map((g, i) => (
                                    <motion.div key={g.issue} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                                        className="p-8 rounded-[2rem] bg-white border-2 border-stone-50 hover:border-stone-200 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-all duration-700" />
                                        
                                        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-sm" style={{ color: priColor[g.priority], background: priColor[g.priority] + "15", border: `1px solid ${priColor[g.priority]}30` }}>{g.priority}</span>
                                                    <span className="text-[11px] font-black text-stone-400 uppercase tracking-widest">📍 {g.ward}</span>
                                                </div>
                                                <h3 className="text-[24px] text-stone-900 font-black tracking-tighter leading-none">{g.issue}</h3>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-center gap-8">
                                                <div className="text-center px-8 border-x border-stone-100">
                                                    <span className="text-[32px] font-black text-stone-900 block leading-none mb-1">{g.count}</span>
                                                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block">Complaints</span>
                                                </div>
                                                <div className="max-w-md space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="size-2 rounded-full bg-stone-900 animate-pulse" />
                                                        <span className="text-[10px] font-black text-stone-900 uppercase tracking-[0.2em]">Live Status</span>
                                                    </div>
                                                    <p className="text-[13px] text-stone-500 font-medium italic border-l-4 border-stone-900 pl-4">{g.actionTaken}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </MgrCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </ManagerPageLayout>
    );
}
