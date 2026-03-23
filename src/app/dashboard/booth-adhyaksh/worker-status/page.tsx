"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;
}


const workers = [
    { initials: "RS", name: "Ramesh Sharma", role: "PP-1", pages: "1-5", status: "Active", doors: 28, calls: 5, issues: 1, gps: "Near Mohalla Ganj Market", lastCheckin: "10:45 AM", target: 72, color: "#10b981" },
    { initials: "SV", name: "Sunil Verma", role: "PP-2", pages: "6-10", status: "Active", doors: 35, calls: 8, issues: 0, gps: "Ram Nagar Ward Office", lastCheckin: "11:02 AM", target: 88, color: "#10b981" },
    { initials: "PG", name: "Priya Gupta", role: "PP-3", pages: "11-15", status: "Idle", doors: 12, calls: 3, issues: 2, gps: "Shanti Colony Gate #2", lastCheckin: "09:30 AM", target: 45, color: "#eab308" },
    { initials: "DS", name: "Deepak Singh", role: "PP-4", pages: "16-20", status: "Active", doors: 41, calls: 12, issues: 0, gps: "Subhash Marg Temple", lastCheckin: "11:15 AM", target: 95, color: "#10b981" },
];

const statusColor: Record<string, string> = { Active: "bg-[#10b981]", Idle: "bg-yellow-400", Offline: "bg-white/30" };

const timeline = [
    { time: "11:15", user: "Deepak", action: "Completed Page 18 — all voters contacted", icon: "check_circle", color: "#10b981" },
    { time: "11:02", user: "Sunil", action: "Logged positive sentiment for Voter #1234", icon: "sentiment_satisfied", color: "#1e293b" },
    { time: "10:45", user: "Ramesh", action: "Reported water issue at Ward 4", icon: "report_problem", color: "#ef4444" },
    { time: "10:30", user: "Priya", action: "Started field visit in Shanti Colony", icon: "directions_walk", color: "#06b6d4" },
    { time: "09:30", user: "Priya", action: "Checked in — marked as Idle (break)", icon: "pause_circle", color: "#eab308" },
    { time: "09:15", user: "Deepak", action: "Called 5 voters from Page 17", icon: "call", color: "#10b981" },
];

export default function WorkerStatusPage() {
    return (
        <div className="min-h-full pb-12">
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 py-5 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Field Force Intelligence</h1>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-500/20">4/4 Agents Deployed</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Last Intel Sync: 2m ago</span>
                    </div>
                </div>
            </header>

            <div className="p-8 flex gap-8">
                {/* Agent Cards */}
                <div className="flex-[2] space-y-4">
                    {workers.map((w, idx) => (
                        <motion.div 
                            key={w.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-orange-500/5 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.05] transition-all">
                                <Icon name="engineering" size={80} />
                            </div>

                            <div className="flex items-start justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="size-14 rounded-2xl bg-slate-900 flex items-center justify-center text-lg font-black text-orange-500">
                                            {w.initials}
                                        </div>
                                        <motion.span 
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className={`absolute -top-1 -right-1 size-4 rounded-full border-4 border-white ${statusColor[w.status]}`} 
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-black text-slate-900">{w.name}</h3>
                                            <span className="text-[10px] font-black bg-slate-100 px-2 py-0.5 rounded-lg text-slate-500 uppercase tracking-widest">{w.role}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                                            <Icon name="map" size={12} /> Territory: {w.pages}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${w.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-orange-500/10 text-orange-600"}`}>
                                        {w.status} Signal
                                    </span>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-2 tracking-tighter">Check-in: {w.lastCheckin}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 mt-8 pb-6 border-b border-slate-100">
                                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Doors</p>
                                    <p className="text-xl font-black text-slate-900">{w.doors}</p>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Calls</p>
                                    <p className="text-xl font-black text-slate-900">{w.calls}</p>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Issues</p>
                                    <p className="text-xl font-black text-red-500">{w.issues}</p>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">GPS Fix</p>
                                    <p className="text-[10px] font-bold text-slate-700 truncate">{w.gps.split(' ').slice(-2).join(' ')}</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="flex justify-between items-end mb-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Territory Saturation</p>
                                    <p className="text-sm font-black text-slate-900">{w.target}%</p>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${w.target}%` }}
                                        transition={{ duration: 1, delay: idx * 0.1 }}
                                        className="h-full rounded-full shadow-sm"
                                        style={{ backgroundColor: w.color }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Logistics Panel */}
                <div className="flex-1 space-y-6">
                    {/* Performance Index */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl"
                    >
                        <h3 className="text-[10px] font-black text-orange-500 tracking-[0.2em] uppercase mb-6">Performance Index</h3>
                        <div className="space-y-4">
                            {[...workers].sort((a, b) => b.doors - a.doors).map((w, i) => (
                                <div key={w.name} className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                                    <span className={`size-8 rounded-xl flex items-center justify-center text-[11px] font-black ${i === 0 ? "bg-orange-500 text-slate-900" : "bg-white/10 text-white/40"}`}>{i + 1}</span>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold">{w.name}</p>
                                        <p className="text-[9px] text-white/30 font-black uppercase tracking-widest">{w.doors} Doors Reached</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-orange-500">{w.target}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Operational Stream */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-3xl border border-slate-200 p-6"
                    >
                        <h3 className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-6">Operational Stream</h3>
                        <div className="space-y-6 relative">
                            {/* Vertical line */}
                            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100" />
                            
                            {timeline.map((t, i) => (
                                <div key={i} className="flex gap-4 relative z-10">
                                    <div className="size-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                        <Icon name={t.icon} size={12} style={{ color: t.color }} />
                                    </div>
                                    <div className="flex-1 -mt-1">
                                        <p className="text-[11px] font-medium text-slate-700">
                                            <span className="font-black text-slate-900">{t.user}</span> {t.action}
                                        </p>
                                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">{t.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Strategy Controls */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
                        <h3 className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-4">Command Actions</h3>
                        <button className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] hover:bg-orange-500 transition-all shadow-lg hover:shadow-orange-500/20">
                            Broadcast Strategic Flash
                        </button>
                        <button className="w-full py-4 rounded-2xl bg-slate-100 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all">
                            Recalibrate Territories
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
