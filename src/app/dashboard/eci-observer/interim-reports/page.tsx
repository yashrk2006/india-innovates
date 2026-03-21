"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ECIPageLayout, { ECICard, ECISectionHeader, ECIKPI } from "@/components/eci/ECIPageLayout";

function Icon({ name, size = 16, className = "", style }: { name: string; size?: number; className?: string; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size, ...style }}>{name}</span>;
}

function Bar({ pct, color = "#ef4444", h = 5 }: { pct: number; color?: string; h?: number }) {
    return (
        <div className="bg-white/5 rounded-full overflow-hidden" style={{ height: h }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }}
                className="rounded-full" style={{ background: color, height: h }} />
        </div>
    );
}

const reports = [
    {
        id: "IR-014", title: "Phase 2 Mid-Day Turnout", constituency: "Lucknow North", date: "Feb 21", status: "DRAFT", progress: 65, type: "Turnout",
        sections: [{ n: "Booth-wise Summary", done: true, req: true }, { n: "Hourly Analysis", done: true, req: true }, { n: "Gender-wise", done: true, req: false }, { n: "PwD Access", done: true, req: false }, { n: "Queue Mgmt", done: false, req: false }, { n: "EVM Status", done: false, req: false }, { n: "Incidents", done: false, req: false }, { n: "Recommendation", done: false, req: true }]
    },
    {
        id: "IR-013", title: "Booth Security Compliance", constituency: "Varanasi", date: "Feb 21", status: "SUBMITTED", progress: 100, type: "Security",
        sections: [{ n: "Force Deployment", done: true, req: true }, { n: "CRPF Map", done: true, req: false }, { n: "Critical Booths", done: true, req: true }, { n: "Arms Surrender", done: true, req: false }, { n: "Check Posts", done: true, req: false }, { n: "Certification", done: true, req: true }]
    },
    {
        id: "IR-012", title: "EVM Functionality Check", constituency: "Kanpur", date: "Feb 20", status: "APPROVED", progress: 100, type: "EVM",
        sections: [{ n: "Mock Poll", done: true, req: true }, { n: "Serial Verification", done: true, req: true }, { n: "VVPAT Check", done: true, req: true }, { n: "Replacement Log", done: true, req: false }, { n: "Seal Integrity", done: true, req: true }]
    },
    {
        id: "IR-011", title: "MCC Violation Summary", constituency: "All UP", date: "Feb 20", status: "SUBMITTED", progress: 100, type: "Violations",
        sections: [{ n: "Classification", done: true, req: true }, { n: "Party Breakdown", done: true, req: false }, { n: "Actions Taken", done: true, req: true }, { n: "Seizure Details", done: true, req: false }]
    },
];

const statusColor: Record<string, string> = { DRAFT: "#f59e0b", SUBMITTED: "#60a5fa", APPROVED: "#10b981" };
const typeIcon: Record<string, string> = { Turnout: "description", Security: "security", EVM: "ballot", Violations: "gavel" };

export default function InterimReportsPage() {
    const [filter, setFilter] = useState("ALL");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const filtered = filter === "ALL" ? reports : reports.filter(r => r.status === filter);

    return (
        <ECIPageLayout title="Interim Reports" badge="📋 ECI REPORTING" badgeColor="#60a5fa">
            <div className="grid grid-cols-5 gap-3 mb-6">
                <ECIKPI icon="description" label="Total Reports" value={String(reports.length)} sub="Phase 2" color="#60a5fa" delay={0} />
                <ECIKPI icon="edit_note" label="In Progress" value={String(reports.filter(r => r.status === "DRAFT").length)} sub="Due today" color="#f59e0b" delay={0.06} />
                <ECIKPI icon="send" label="Submitted" value={String(reports.filter(r => r.status === "SUBMITTED").length)} sub="Pending" color="#60a5fa" delay={0.12} />
                <ECIKPI icon="task_alt" label="Approved" value={String(reports.filter(r => r.status === "APPROVED").length)} sub="Filed" color="#10b981" delay={0.18} />
                <ECIKPI icon="timer" label="Next Deadline" value="3:00 PM" sub="Today" color="#ef4444" delay={0.24} />
            </div>

            <div className="grid grid-cols-[1fr_280px] gap-5">
                <div className="space-y-3">
                    <ECICard>
                        <div className="p-3 flex items-center justify-between">
                            <div className="flex gap-1.5">
                                {["ALL", "DRAFT", "SUBMITTED", "APPROVED"].map(f => (
                                    <button key={f} onClick={() => setFilter(f)} className={`text-[9px] font-mono px-2.5 py-1 rounded-lg transition-all ${filter === f ? "bg-red-500/15 text-red-400 border border-red-500/25" : "text-slate-400 hover:text-slate-500"}`}>{f}</button>
                                ))}
                            </div>
                            <button className="text-[9px] font-mono px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 border border-red-500/25 flex items-center gap-1"><Icon name="add" size={13} /> NEW REPORT</button>
                        </div>
                    </ECICard>

                    {filtered.map((r, i) => (
                        <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="bg-[#0d1018] rounded-xl border border-slate-200 overflow-hidden hover:border-slate-200 transition-all cursor-pointer"
                            onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                            <div className="p-5 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                                    <Icon name={typeIcon[r.type] || "description"} size={18} className="text-red-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-1">
                                        <h4 className="text-[13px] text-slate-500 font-semibold">{r.title}</h4>
                                        <span className="text-[7px] font-mono px-1.5 py-0.5 rounded ml-2 shrink-0" style={{ color: statusColor[r.status], background: statusColor[r.status] + "12" }}>{r.status}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[9px] text-slate-500 mb-2">
                                        <span>{r.id}</span><span>📍{r.constituency}</span><span>📅{r.date}</span><span>📄{r.sections.length} sections</span>
                                    </div>
                                    {r.status === "DRAFT" && (
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${r.progress}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-gradient-to-r from-red-500 to-fuchsia-500" />
                                            </div>
                                            <span className="text-[9px] font-mono text-fuchsia-400">{r.progress}%</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <AnimatePresence>
                                {expandedId === r.id && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                        <div className="border-t border-slate-200 px-5 py-4 bg-white/[0.01]">
                                            <div className="text-[8px] font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                                <Icon name="checklist" size={12} /> Mandatory Sections Checklist
                                            </div>
                                            <div className="space-y-1.5">
                                                {r.sections.map((s, idx) => (
                                                    <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
                                                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg ${s.done ? "bg-green-500/5" : "bg-white/[0.01]"} border border-slate-200`}>
                                                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${s.done ? "bg-green-500" : "border border-white/15"}`}>
                                                            {s.done && <Icon name="check" size={12} className="text-slate-900" />}
                                                        </div>
                                                        <span className={`text-[10px] flex-1 ${s.done ? "text-slate-600" : "text-slate-500"}`}>{s.n}</span>
                                                        {s.req && <span className="text-[7px] font-mono text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">MANDATORY</span>}
                                                    </motion.div>
                                                ))}
                                            </div>
                                            {r.status === "DRAFT" && (
                                                <div className="flex gap-2 mt-3">
                                                    <button className="text-[9px] font-mono px-3 py-1.5 rounded-lg bg-red-500/12 text-red-400 border border-red-500/20 flex-1">CONTINUE EDITING</button>
                                                    <button className="text-[9px] font-mono px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 flex-1">SUBMIT TO DEO</button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                <div className="space-y-4">
                    <ECICard delay={0.15}>
                        <ECISectionHeader title="ECI Form Templates" icon="article" />
                        <div className="p-4 space-y-2">
                            {[{ n: "Form 17C Part-I", d: "Account of Votes" }, { n: "Form 17C Part-II", d: "Counting Sheet" }, { n: "Form 45", d: "Return of Election" }, { n: "Observer Diary", d: "Daily Record" }, { n: "Expenditure Report", d: "Spending Monitor" }].map((f, i) => (
                                <motion.button key={f.n} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
                                    className="w-full flex items-center gap-2.5 p-3 rounded-lg text-left bg-white/[0.02] border border-slate-200 hover:bg-white/[0.04] transition-all">
                                    <div className="w-7 h-7 rounded-md bg-red-500/10 flex items-center justify-center shrink-0"><Icon name="article" size={14} className="text-red-400" /></div>
                                    <div><span className="text-[10px] text-slate-600 block">{f.n}</span><span className="text-[8px] text-slate-400 font-mono">{f.d}</span></div>
                                </motion.button>
                            ))}
                        </div>
                    </ECICard>

                    <ECICard delay={0.2}>
                        <ECISectionHeader title="Deadlines" icon="event" />
                        <div className="p-4 space-y-2">
                            {[{ l: "Phase 2 Mid-Day Report", t: "Today 3:00 PM", u: true }, { l: "Weekly MCC Summary", t: "Tomorrow 10 AM", u: false }, { l: "Final Report", t: "Feb 23", u: false }].map((d, i) => (
                                <div key={i} className={`p-3 rounded-lg border ${d.u ? "bg-red-500/5 border-red-500/15" : "bg-white/[0.02] border-slate-200"}`}>
                                    <p className={`text-[10px] font-medium ${d.u ? "text-red-400" : "text-slate-600"}`}>{d.l}</p>
                                    <p className="text-[8px] font-mono text-slate-400 mt-0.5">{d.t}</p>
                                </div>
                            ))}
                        </div>
                    </ECICard>

                    <ECICard delay={0.25}>
                        <ECISectionHeader title="Digital Signature" icon="draw" />
                        <div className="p-4 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 mx-auto mb-2 flex items-center justify-center">
                                <Icon name="draw" size={20} className="text-red-400" />
                            </div>
                            <p className="text-[10px] text-slate-600">ECI DSC Token Required</p>
                            <button className="mt-2 w-full text-[9px] font-mono py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">SIGN & SUBMIT</button>
                        </div>
                    </ECICard>
                </div>
            </div>
        </ECIPageLayout>
    );
}
