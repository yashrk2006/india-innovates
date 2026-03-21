"use client";

import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

/* ── Icon helper ── */
function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;
}

/* ── KPI Card ── */
function KPI({ icon, label, value, sub, color = "var(--gold)" }: { icon: string; label: string; value: string; sub?: string; color?: string }) {
    return (
        <div className="bg-white shadow-sm border border-slate-200 rounded p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-mono text-[9px] tracking-[2.5px] uppercase text-slate-700/25 mb-2">{label}</p>
                    <p className="font-serif text-[28px] font-bold text-slate-700 leading-none">{value}</p>
                    {sub && <p className="font-mono text-[9px] mt-1.5" style={{ color }}>{sub}</p>}
                </div>
                <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: color + "18", border: `1px solid ${color}30` }}>
                    <Icon name={icon} size={14} className="text-[#1e293b]" />
                </div>
            </div>
        </div>
    );
}

/* ── Progress Bar ── */
function Bar({ pct, color = "var(--gold)", h = 4 }: { pct: number; color?: string; h?: number }) {
    return (
        <div className="bg-[rgba(30,41,59,0.1)] rounded-sm overflow-hidden" style={{ height: h }}>
            <div className="rounded-sm transition-all duration-1000 ease-out" style={{ width: `${pct}%`, background: color, height: h }} />
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
        { task: "Complete voter contact for Page 11-15", priority: "HIGH", assigned: "Mohan Lal", due: "5:00 PM", done: false },
        { task: "Distribute scheme pamphlets – Ward 4", priority: "MEDIUM", assigned: "All Workers", due: "3:00 PM", done: true },
        { task: "Verify new registrations (12 pending)", priority: "HIGH", assigned: "Self", due: "6:00 PM", done: false },
        { task: "Submit daily worker report", priority: "LOW", assigned: "Self", due: "8:00 PM", done: false },
        { task: "Organize booth-level meeting", priority: "MEDIUM", assigned: "Self", due: "7:00 PM", done: false },
    ];

    const recentFeedback = [
        { voter: "Voter #1042", sentiment: "Positive", issue: "Road repair done", time: "2:30 PM" },
        { voter: "Voter #1089", sentiment: "Negative", issue: "Water supply irregular", time: "1:45 PM" },
        { voter: "Voter #1105", sentiment: "Neutral", issue: "Awaiting Ayushman card", time: "12:20 PM" },
        { voter: "Voter #1023", sentiment: "Positive", issue: "Scholarship received", time: "11:15 AM" },
    ];

    const sentimentColor: Record<string, string> = { Positive: "#10b981", Negative: "#ef4444", Neutral: "#1e293b" };
    const priorityColor: Record<string, string> = { HIGH: "#ef4444", MEDIUM: "#f59e0b", LOW: "#6b7280" };
    const statusColor: Record<string, string> = { ACTIVE: "#10b981", DELAYED: "#ef4444", COMPLETED: "#1e293b" };

    return (
        <>
                <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-sm border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-slate-900 text-lg font-serif font-bold">Booth Operations Hub</h2>
                        <span className="font-mono text-[9px] text-[#10b981] tracking-[1.5px] uppercase bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/20">
                            ● BOOTH ACTIVE
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-slate-700/40">Ward 12 · Booth 142</span>
                        <button className="font-mono text-[10px] tracking-[1px] uppercase bg-[#e8761a] hover:bg-[#e8761a]/90 text-slate-900 px-4 py-1.5 rounded transition-all">
                            Submit Report
                        </button>
                    </div>
                </header>

                <div className="p-6 space-y-6">
                    {/* ── KPI Row ── */}
                    <div className="grid grid-cols-5 gap-4">
                        <KPI icon="people" label="Total Voters" value="1,248" sub="Booth 142" />
                        <KPI icon="phone_in_talk" label="Contacted" value="735" sub="58.8% complete" color="#10b981" />
                        <KPI icon="groups" label="Active Workers" value="6" sub="2 delayed" color="#e8761a" />
                        <KPI icon="star" label="Favourability" value="72%" sub="↑ 4% this week" color="#1e293b" />
                        <KPI icon="warning" label="Pending Issues" value="8" sub="3 critical" color="#ef4444" />
                    </div>

                    {/* ── Main Grid ── */}
                    <div className="grid grid-cols-[1.4fr_1fr] gap-6">
                        {/* Workers Table */}
                        <div className="bg-white shadow-sm border border-slate-200 rounded overflow-hidden">
                            <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-200">
                                <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#1e293b] flex items-center gap-2">
                                    <Icon name="groups" size={12} /> Worker Performance
                                </h3>
                            </div>
                            <div className="grid grid-cols-[1fr_90px_80px_120px_80px] gap-2 px-4 py-2.5 border-b border-slate-200 font-mono text-[9px] tracking-[1px] uppercase text-slate-700/25">
                                <span>Worker</span>
                                <span>Role</span>
                                <span>Area</span>
                                <span>Progress</span>
                                <span>Status</span>
                            </div>
                            {workers.map((w) => (
                                <div key={w.name} className="grid grid-cols-[1fr_90px_80px_120px_80px] gap-2 px-4 py-3 border-b border-[rgba(30,41,59,0.1)] hover:bg-[#334155]/[0.02] transition-colors cursor-pointer items-center">
                                    <span className="text-[11px] text-slate-700 font-medium">{w.name}</span>
                                    <span className="font-mono text-[10px] text-slate-700/40">{w.role}</span>
                                    <span className="font-mono text-[10px] text-slate-700/40">{w.area}</span>
                                    <div className="flex items-center gap-2">
                                        <Bar pct={(w.contacted / w.target) * 100} color={w.contacted / w.target > 0.8 ? "#10b981" : w.contacted / w.target > 0.5 ? "#1e293b" : "#ef4444"} h={4} />
                                        <span className="font-mono text-[9px] text-slate-700/30 w-12 text-right">{w.contacted}/{w.target}</span>
                                    </div>
                                    <span className="font-mono text-[9px] tracking-[0.5px] px-1.5 py-0.5 rounded text-center" style={{ color: statusColor[w.status], background: statusColor[w.status] + "15", border: `1px solid ${statusColor[w.status]}30` }}>
                                        {w.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Today's Tasks */}
                        <div className="bg-white shadow-sm border border-slate-200 rounded overflow-hidden">
                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                                <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#e8761a] flex items-center gap-2">
                                    <Icon name="checklist" size={12} /> Today&apos;s Tasks
                                </h3>
                            </div>
                            <div className="divide-y divide-[rgba(30,41,59,0.1)]">
                                {todayTasks.map((t, i) => (
                                    <div key={i} className="px-4 py-3 hover:bg-[#334155]/[0.02] transition-colors cursor-pointer">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className={`w-4 h-4 rounded-sm border flex items-center justify-center text-[10px] ${t.done ? "bg-[#10b981]/20 border-[#10b981]/50 text-[#10b981]" : "border-[#334155]/15"}`}>
                                                {t.done && "✓"}
                                            </div>
                                            <span className={`text-[11px] flex-1 ${t.done ? "text-slate-700/30 line-through" : "text-slate-700"}`}>{t.task}</span>
                                            <span className="font-mono text-[8px] px-1.5 py-0.5 rounded" style={{ color: priorityColor[t.priority], background: priorityColor[t.priority] + "15" }}>
                                                {t.priority}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 pl-6 text-[9px] text-slate-700/25 font-mono">
                                            <span>{t.assigned}</span>
                                            <span className="ml-auto">Due: {t.due}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Bottom: Voter Feedback Feed ── */}
                    <div className="bg-white shadow-sm border border-slate-200 rounded overflow-hidden">
                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                            <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#1e293b] flex items-center gap-2">
                                <Icon name="chat_bubble" size={12} /> Recent Voter Feedback
                            </h3>
                        </div>
                        <div className="grid grid-cols-4 divide-x divide-[rgba(30,41,59,0.1)]">
                            {recentFeedback.map((f, i) => (
                                <div key={i} className="px-4 py-3">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="font-mono text-[10px] text-slate-700/40">{f.voter}</span>
                                        <span className="font-mono text-[8px]" style={{ color: sentimentColor[f.sentiment] }}>{f.sentiment}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 mb-1">{f.issue}</p>
                                    <span className="font-mono text-[8px] text-slate-700/20">{f.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
        </>
    );
}
