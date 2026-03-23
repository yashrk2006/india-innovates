"use client";

import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

/* ── Icon helper ── */
function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;
}

/* ── KPI Card ── */
function KPI({ icon, label, value, sub, color = "#1e293b", delay = 0 }: { icon: string; label: string; value: string; sub?: string; color?: string; delay?: number }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="group relative bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-all">
                <Icon name={icon} size={80} style={{ color }} />
            </div>
            
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">{label}</p>
                    <div className="size-10 rounded-2xl flex items-center justify-center bg-slate-50 text-slate-900 border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                        <Icon name={icon} size={20} />
                    </div>
                </div>
                
                <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">{value}</h3>
                {sub && (
                    <div className="flex items-center gap-2">
                        <div className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
                        <p className="text-[11px] font-bold uppercase tracking-wide opacity-60" style={{ color }}>{sub}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function Bar({ pct, color = "#1e293b" }: { pct: number; color?: string }) {
    return (
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
            />
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   BOOTH ADHYAKSH – Booth Operations Dashboard
   ══════════════════════════════════════════════════════════ */
export default function BoothAdhyakshDashboard() {

    /* Mock Data */
    const workers = [
        { name: "Ramesh Yadav", role: "Page Pramukh", area: "Page 1-5", contacted: 142, target: 200, status: "ACTIVE" },
        { name: "Sunita Devi", role: "Page Pramukh", area: "Page 6-10", contacted: 189, target: 200, status: "ACTIVE" },
        { name: "Mohan Lal", role: "Panna Pramukh", area: "Page 11-15", contacted: 67, target: 200, status: "DELAYED" },
        { name: "Priya Sharma", role: "Panna Pramukh", area: "Page 16-20", contacted: 198, target: 200, status: "COMPLETED" },
        { name: "Anil Kumar", role: "Volunteer", area: "Page 21-25", contacted: 94, target: 200, status: "ACTIVE" },
        { name: "Kavita Singh", role: "Volunteer", area: "Page 26-30", contacted: 45, target: 200, status: "DELAYED" },
    ];

    const todayTasks = [
        { task: "Complete voter contact for Page 11-15", priority: "HIGH", assigned: "Mohan Lal", due: "05:00 PM", done: false },
        { task: "Distribute scheme pamphlets – Ward 4", priority: "MEDIUM", assigned: "All Workers", due: "03:00 PM", done: true },
        { task: "Verify new registrations (12 pending)", priority: "HIGH", assigned: "Self", due: "06:00 PM", done: false },
        { task: "Submit daily worker report", priority: "LOW", assigned: "Self", due: "08:00 PM", done: false },
    ];

    const recentFeedback = [
        { voter: "Voter #1042", sentiment: "Positive", issue: "Infrastructure optimized", time: "14:30" },
        { voter: "Voter #1089", sentiment: "Negative", issue: "Resource depletion", time: "13:45" },
        { voter: "Voter #1105", sentiment: "Neutral", issue: "Awaiting registration", time: "12:20" },
        { voter: "Voter #1023", sentiment: "Positive", issue: "Unit support confirmed", time: "11:15" },
    ];

    const sentimentColor: Record<string, string> = { Positive: "#10b981", Negative: "#ef4444", Neutral: "#3b82f6" };
    const priorityColor: Record<string, string> = { HIGH: "#ef4444", MEDIUM: "#f59e0b", LOW: "#64748b" };
    const statusColor: Record<string, string> = { ACTIVE: "#10b981", DELAYED: "#ef4444", COMPLETED: "#1e293b" };

    return (
        <div className="min-h-screen bg-slate-50/50">
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="px-3 py-1 rounded-full bg-[#1e293b]/5 border border-[#1e293b]/10 text-[#1e293b] text-[9px] font-black uppercase tracking-widest">
                            Operations Command
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Live Sector Feed</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Booth <span className="text-slate-400">Intelligence</span> Matrix</h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Booth #142 · Ward 12 · Sector Alpha Command</p>
                </div>

                <div className="flex items-center gap-4">
                    <button className="h-12 px-8 bg-[#1e293b] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/20 transition-all active:scale-95">
                        Tactical Broadcast
                    </button>
                    <button className="size-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#1e293b] hover:border-[#1e293b]/30 hover:shadow-lg transition-all active:scale-95 shadow-sm">
                        <Icon name="settings" size={20} />
                    </button>
                </div>
            </header>

            <div className="p-8 pb-20 space-y-10">
                {/* ── KPI Row ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    <KPI icon="person_search" label="Voter Base" value="1,248" sub="Database Active" color="#3b82f6" delay={0.1} />
                    <KPI icon="verified_user" label="Coverage" value="735" sub="58.8% Realized" color="#10b981" delay={0.2} />
                    <KPI icon="engineering" label="Field Force" value="06" sub="Tactical Units" color="#f59e0b" delay={0.3} />
                    <KPI icon="trending_up" label="Trajectory" value="72%" sub="+4.2% Growth" color="#6366f1" delay={0.4} />
                    <KPI icon="priority_high" label="Alerts" value="08" sub="Critical Issues" color="#ef4444" delay={0.5} />
                </div>

                {/* ── Main Operations Grid ── */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="xl:col-span-8 bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden flex flex-col"
                    >
                        <div className="p-10 pb-6 flex items-center justify-between border-b border-slate-50 bg-slate-50/30">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Force Deployment</h3>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Operational Support Personnel</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Units: 06</span>
                                <div className="h-6 w-[1px] bg-slate-200" />
                                <button className="text-[10px] font-black text-[#1e293b] uppercase tracking-widest hover:underline">Full Manifest</button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-400 font-mono text-[9px] tracking-widest uppercase border-b border-slate-50">
                                        <th className="p-6 px-10">Unit Identity</th>
                                        <th className="p-6">Assigned Sector</th>
                                        <th className="p-6 text-center">Realization</th>
                                        <th className="p-6 text-right px-10">Protocol Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {workers.map((w, i) => (
                                        <motion.tr 
                                            key={w.name}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="group hover:bg-slate-50/80 transition-all duration-300"
                                        >
                                            <td className="p-6 px-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-11 rounded-[1.2rem] bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs shadow-inner group-hover:bg-[#1e293b] group-hover:text-white transition-all">
                                                        {w.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-black text-slate-900 leading-tight mb-1">{w.name}</p>
                                                        <p className="text-[9px] text-[#1e293b] font-bold uppercase tracking-widest opacity-60">{w.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2">
                                                    <Icon name="grid_view" size={14} className="text-slate-300" />
                                                    <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider font-mono">{w.area}</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="w-32 mx-auto">
                                                    <div className="flex justify-between items-end mb-1.5">
                                                        <span className="text-[10px] font-black text-slate-900 font-mono">{Math.round((w.contacted/w.target)*100)}%</span>
                                                        <span className="text-[8px] text-slate-400 font-black uppercase tracking-tighter">{w.contacted} / {w.target}</span>
                                                    </div>
                                                    <Bar pct={(w.contacted / w.target) * 100} color={statusColor[w.status]} />
                                                </div>
                                            </td>
                                            <td className="p-6 text-right px-10">
                                                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100" style={{ color: statusColor[w.status], backgroundColor: statusColor[w.status] + "08" }}>
                                                    <div className="size-1 rounded-full animate-pulse" style={{ backgroundColor: statusColor[w.status] }} />
                                                    {w.status}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Operational Objectives */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="xl:col-span-4 bg-[#1e293b] rounded-[3rem] p-10 border border-white/5 shadow-2xl shadow-slate-900/40 text-white"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-black tracking-tighter text-slate-100">Daily Directives</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3b82f6] mt-1">Strategic Objectives</p>
                            </div>
                            <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#3b82f6] shadow-inner">
                                <Icon name="bolt" size={28} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {todayTasks.map((t, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group flex items-start gap-4 p-5 rounded-[1.8rem] bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className={`mt-1 size-6 rounded-xl border-2 flex items-center justify-center transition-all ${t.done ? "bg-[#10b981] border-[#10b981]" : "border-white/10 group-hover:border-white/30"}`}>
                                        {t.done && <Icon name="check" size={14} className="text-[#1e293b] font-black" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-[13px] font-bold tracking-tight mb-2 ${t.done ? "text-white/20 line-through" : "text-white/90"}`}>{t.task}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white/30 font-mono">{t.due} IST</span>
                                                <div className="size-1 rounded-full bg-white/10" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-[#3b82f6]">{t.assigned}</span>
                                            </div>
                                            <span className="text-[8px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest bg-white/5 border border-white/10" style={{ color: priorityColor[t.priority] }}>
                                                {t.priority}
                                            </span>
                                        </div>
                                    </div>
                                    {t.done && <div className="absolute top-0 right-0 p-4 opacity-5"><Icon name="verified" size={40} /></div>}
                                </motion.div>
                            ))}
                        </div>

                        <button className="w-full mt-10 py-5 rounded-[2rem] bg-white text-[#1e293b] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-white/5 hover:scale-[1.02] active:scale-95 transition-all">
                            Initialize New Protocol
                        </button>
                    </motion.div>
                </div>

                {/* ── Intelligence Feed ── */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden"
                >
                    <div className="p-10 pb-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-[1.2rem] bg-slate-100 text-[#1e293b] flex items-center justify-center shadow-inner">
                                <Icon name="sensors" size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tighter">Live Intelligence Stream</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Aggregated Sector Signal Analytics</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-emerald-500 animate-ping" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Processing Signals...</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-50">
                        {recentFeedback.map((f, i) => (
                            <div key={i} className="p-10 group hover:bg-slate-50 transition-all duration-500 relative overflow-hidden">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-[10px] font-black text-slate-400 font-mono tracking-widest uppercase">{f.voter}</span>
                                    <div className="size-3 rounded-full shadow-[0_0_12px] shadow-current transition-all" style={{ color: sentimentColor[f.sentiment], backgroundColor: 'currentColor' }} />
                                </div>
                                <p className="text-[14px] font-bold text-slate-700 mb-8 leading-relaxed italic">“{f.issue}”</p>
                                <div className="flex items-center justify-between relative z-10">
                                    <span className="text-[10px] font-black uppercase tracking-widest border-b-2" style={{ borderBottomColor: sentimentColor[f.sentiment] + "40", color: sentimentColor[f.sentiment] }}>
                                        {f.sentiment} Signal
                                    </span>
                                    <span className="text-[9px] font-black text-slate-300 font-mono">{f.time} IST</span>
                                </div>
                                <div className="absolute -bottom-4 -right-4 size-20 opacity-[0.02] group-hover:opacity-[0.05] group-hover:scale-125 transition-all">
                                    <Icon name="psychology_alt" size={80} />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
