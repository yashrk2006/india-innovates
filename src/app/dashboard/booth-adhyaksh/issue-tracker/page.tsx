"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;
}


type Issue = { id: string; title: string; category: string; icon: string; reporter: string; location: string; time: string; priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"; status: "NEW" | "IN_PROGRESS" | "ESCALATED" | "RESOLVED"; assignee?: string; notes?: string };

const issues: Issue[] = [
    { id: "ISS-001", title: "Water supply disrupted in Ward 4", category: "Water", icon: "water_drop", reporter: "Ramesh Sharma", location: "Mohalla Ganj", time: "2h ago", priority: "CRITICAL", status: "NEW" },
    { id: "ISS-002", title: "Road pothole near school", category: "Roads", icon: "add_road", reporter: "Sunil Verma", location: "Ram Nagar", time: "3h ago", priority: "HIGH", status: "NEW" },
    { id: "ISS-003", title: "Streetlight not working", category: "Power", icon: "lightbulb", reporter: "Priya Gupta", location: "Shanti Colony", time: "5h ago", priority: "LOW", status: "NEW" },
    { id: "ISS-004", title: "Garbage not collected for 3 days", category: "Waste", icon: "delete", reporter: "Amit Kumar", location: "Gandhi Chowk", time: "1h ago", priority: "HIGH", status: "IN_PROGRESS", assignee: "Ramesh Sharma", notes: "Contacted municipal office" },
    { id: "ISS-005", title: "Drainage overflow on main road", category: "Water", icon: "water_drop", reporter: "Kavita Devi", location: "Nehru Market", time: "4h ago", priority: "MEDIUM", status: "IN_PROGRESS", assignee: "Sunil Verma" },
    { id: "ISS-006", title: "Voter intimidation reported", category: "Security", icon: "shield", reporter: "Deepak Singh", location: "Patel Road", time: "6h ago", priority: "CRITICAL", status: "ESCALATED", notes: "Escalated to District Manager" },
    { id: "ISS-007", title: "Health camp postponed", category: "Health", icon: "medical_services", reporter: "Geeta Devi", location: "Subhash Marg", time: "1d ago", priority: "MEDIUM", status: "RESOLVED", notes: "Rescheduled to next week" },
    { id: "ISS-008", title: "Missing voter slips batch", category: "Admin", icon: "description", reporter: "Mohan Lal", location: "Mohalla Ganj", time: "1d ago", priority: "HIGH", status: "RESOLVED", notes: "Reprinted and distributed" },
    { id: "ISS-009", title: "WiFi down at booth office", category: "Tech", icon: "wifi_off", reporter: "Renu Bala", location: "Booth Office", time: "2d ago", priority: "LOW", status: "RESOLVED", notes: "ISP issue fixed" },
    { id: "ISS-010", title: "Water tanker delay", category: "Water", icon: "water_drop", reporter: "Suresh Kumar", location: "Patel Road", time: "2d ago", priority: "MEDIUM", status: "RESOLVED" },
];

const columns = [
    { key: "NEW" as const, label: "New", color: "#3b82f6", icon: "inbox" },
    { key: "IN_PROGRESS" as const, label: "In Progress", color: "#f97316", icon: "autorenew" },
    { key: "ESCALATED" as const, label: "Escalated", color: "#ef4444", icon: "arrow_upward" },
    { key: "RESOLVED" as const, label: "Resolved", color: "#10b981", icon: "check_circle" },
];
const priorityStyle: Record<string, { badge: string; border: string }> = {
    CRITICAL: { badge: "bg-red-400/10 text-red-400 border-red-400/30", border: "border-l-red-400" },
    HIGH: { badge: "bg-orange-400/10 text-orange-400 border-orange-400/30", border: "border-l-orange-400" },
    MEDIUM: { badge: "bg-[#1e293b]/10 text-[#1e293b] border-[#1e293b]/30", border: "border-l-[#1e293b]" },
    LOW: { badge: "bg-white/5 text-slate-500 border-slate-200", border: "border-l-white/20" },
};

export default function IssueTrackerPage() {
    const [filter, setFilter] = useState("All");
    const tabs = ["All", "Open", "Resolved", "Escalated"];

    return (
        <div className="min-h-full pb-12">
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 py-5 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Voter Issue Response</h1>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-black bg-red-500/10 text-red-600 px-2.5 py-1 rounded-full border border-red-500/20">{issues.filter(i => i.status !== "RESOLVED").length} Active Alarms</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Booth 142 Operational Grid</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                        {tabs.map(t => (
                            <button 
                                key={t} 
                                onClick={() => setFilter(t)} 
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                    filter === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
                        <Icon name="add" size={18} /> New Alert
                    </button>
                </div>
            </header>

            <div className="p-8">
                {/* Kanban Board */}
                <div className="grid grid-cols-4 gap-6">
                    {columns.map((col, colIdx) => {
                        const colIssues = issues.filter(i => i.status === col.key && (filter === "All" || (filter === "Open" && (i.status === "NEW" || i.status === "IN_PROGRESS")) || (filter === "Resolved" && i.status === "RESOLVED") || (filter === "Escalated" && i.status === "ESCALATED")));
                        
                        return (
                            <div key={col.key} className="flex flex-col h-full">
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: colIdx * 0.1 }}
                                    className="flex items-center justify-between mb-6 px-2"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${col.color}15` }}>
                                            <Icon name={col.icon} size={18} style={{ color: col.color }} />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-[0.15em] text-slate-900">{col.label}</span>
                                    </div>
                                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-lg border border-slate-200">{colIssues.length}</span>
                                </motion.div>

                                <div className="space-y-4 flex-1">
                                    <AnimatePresence>
                                        {colIssues.map((issue, idx) => {
                                            const ps = priorityStyle[issue.priority];
                                            return (
                                                <motion.div 
                                                    key={issue.id} 
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className={`group bg-white rounded-3xl border border-slate-200 border-l-4 ${ps.border} p-5 hover:shadow-2xl hover:shadow-slate-200/50 transition-all cursor-pointer relative overflow-hidden`}
                                                >
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="size-8 rounded-xl bg-slate-50 flex items-center justify-center">
                                                                <Icon name={issue.icon} size={16} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                                                            </div>
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{issue.id}</span>
                                                        </div>
                                                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border ${ps.badge} uppercase tracking-tight`}>{issue.priority}</span>
                                                    </div>

                                                    <h3 className="text-sm font-black text-slate-900 leading-tight mb-4 group-hover:text-orange-500 transition-colors line-clamp-2">{issue.title}</h3>
                                                    
                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                                            <Icon name="person" size={14} className="opacity-40" />
                                                            {issue.reporter}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                                            <Icon name="location_on" size={14} className="opacity-40" />
                                                            {issue.location}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 font-mono">
                                                            <Icon name="schedule" size={14} className="opacity-40" />
                                                            {issue.time}
                                                        </div>
                                                    </div>

                                                    {issue.assignee && (
                                                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="size-6 rounded-full bg-slate-900 flex items-center justify-center text-[10px] text-white font-black">
                                                                    {issue.assignee[0]}
                                                                </div>
                                                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{issue.assignee}</span>
                                                            </div>
                                                            <Icon name="chat_bubble" size={14} className="text-slate-300" />
                                                        </div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>

                                    {colIssues.length === 0 && (
                                        <div className="h-24 rounded-3xl border-2 border-dashed border-slate-100 flex items-center justify-center">
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Clear</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Response Analytics */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 bg-slate-900 rounded-[2.5rem] p-8 text-white flex items-center justify-between shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                    <div className="flex items-center gap-12 relative z-10">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Mean Response</p>
                            <p className="text-2xl font-black text-emerald-400">4.2 <span className="text-sm opacity-50">HRS</span></p>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Critical Success Rate</p>
                            <p className="text-2xl font-black text-orange-400">92 <span className="text-sm opacity-50">%</span></p>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Operational Pulse</p>
                            <div className="flex items-center gap-4">
                                <p className="text-2xl font-black">STABLE</p>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 2, 4, 3].map((h, i) => (
                                        <motion.div 
                                            key={i}
                                            animate={{ height: [8, 16, 8] }}
                                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                            className="w-1 bg-emerald-500 rounded-full"
                                            style={{ height: h * 4 }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 relative z-10">
                        {[{ cat: "Water", color: "#3b82f6" }, { cat: "Security", color: "#ef4444" }, { cat: "Power", color: "#eab308" }].map(c => (
                            <div key={c.cat} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest">
                                <span className="size-2 rounded-full" style={{ backgroundColor: c.color }} />
                                {c.cat}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
