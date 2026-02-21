"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ECIPageLayout, { ECICard, ECISectionHeader, ECIKPI } from "@/components/eci/ECIPageLayout";

function Icon({ name, size = 16, className = "" }: { name: string; size?: number; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size }}>{name}</span>;
}
function Bar({ pct, color = "#f87171", h = 5 }: { pct: number; color?: string; h?: number }) {
    return (
        <div className="bg-white/5 rounded-full overflow-hidden" style={{ height: h }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} className="rounded-full" style={{ background: color, height: h }} />
        </div>
    );
}

const pending = [
    {
        id: "FS-008", title: "Phase 2 Consolidated Turnout Report", constituency: "All UP", sections: [
            { n: "State-wise Summary", pct: 100 }, { n: "EVM/VVPAT Report", pct: 100 }, { n: "Violations Summary", pct: 85 },
            { n: "Expenditure Audit", pct: 70 }, { n: "Observer Diary", pct: 90 }, { n: "Security Assessment", pct: 100 },
            { n: "Recommendations", pct: 40 }, { n: "Annexures & Evidence", pct: 60 },
        ], overall: 81, dueDate: "Feb 23, 6:00 PM", assignee: "Chief Observer, UP"
    },
    {
        id: "FS-007", title: "Lucknow North – Final Observer Report", constituency: "Lucknow North", sections: [
            { n: "Form 17C Part-I", pct: 100 }, { n: "Form 17C Part-II", pct: 100 }, { n: "Voter Turnout", pct: 100 },
            { n: "Violations", pct: 100 }, { n: "EVM Certification", pct: 100 }, { n: "Digital Signature", pct: 0 },
        ], overall: 83, dueDate: "Feb 22, 12:00 PM", assignee: "Gen. Observer, Lucknow"
    },
];

const completed = [
    { id: "FS-006", title: "Phase 1 Final Report", constituency: "All States", submitted: "Feb 14", accepted: "Feb 15", receipt: "ECI/2026/P1/FINAL-001", signedBy: "Shri A. K. Sharma, IAS", sections: 12, pages: 148, status: "ACCEPTED" },
    { id: "FS-005", title: "Pre-Poll Readiness Assessment", constituency: "UP", submitted: "Feb 10", accepted: "Feb 11", receipt: "ECI/2026/PRE/UP-001", signedBy: "Smt. R. Devi, IAS", sections: 8, pages: 64, status: "ACCEPTED" },
    { id: "FS-004", title: "EVM Distribution Certificate", constituency: "All UP", submitted: "Feb 8", accepted: "Feb 9", receipt: "ECI/2026/EVM/CERT-001", signedBy: "Shri P. Kumar, IAS", sections: 5, pages: 32, status: "ACCEPTED" },
    { id: "FS-003", title: "Security Deployment Plan", constituency: "UP", submitted: "Feb 5", accepted: "Feb 6", receipt: "ECI/2026/SEC/UP-001", signedBy: "Shri M. Singh, IPS", sections: 6, pages: 45, status: "ACCEPTED" },
];

export default function FinalSubmissionsPage() {
    const [tab, setTab] = useState<"pending" | "completed">("pending");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    return (
        <ECIPageLayout title="Final Submissions" badge="📁 ECI ARCHIVE" badgeColor="#4ade80">
            <div className="grid grid-cols-5 gap-3 mb-6">
                <ECIKPI icon="pending_actions" label="Pending" value={String(pending.length)} sub="In progress" color="#fbbf24" delay={0} />
                <ECIKPI icon="task_alt" label="Accepted" value={String(completed.length)} sub="Filed with ECI" color="#4ade80" delay={0.06} />
                <ECIKPI icon="receipt_long" label="Receipts" value={String(completed.length)} sub="ECI acknowledged" color="#60a5fa" delay={0.12} />
                <ECIKPI icon="draw" label="Signed" value={String(completed.length)} sub="DSC verified" color="#818cf8" delay={0.18} />
                <ECIKPI icon="timer" label="Next Due" value="Feb 22" sub="Lucknow report" color="#f87171" delay={0.24} />
            </div>

            <div className="flex gap-2 mb-5">
                {(["pending", "completed"] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`text-[10px] font-mono px-4 py-2 rounded-lg capitalize flex items-center gap-1.5 transition-all ${tab === t ? "bg-red-500/15 text-red-400 border border-red-500/25" : "text-white/30 border border-white/[0.06] hover:text-white/60"}`}>
                        <Icon name={t === "pending" ? "pending_actions" : "task_alt"} size={14} />
                        {t} ({t === "pending" ? pending.length : completed.length})
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {tab === "pending" ? (
                    <motion.div key="p" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                        {pending.map((r, i) => (
                            <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="bg-[#0d1018] rounded-xl border border-white/[0.06] overflow-hidden">
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="text-[14px] text-white/90 font-semibold mb-1">{r.title}</h4>
                                            <div className="flex gap-3 text-[9px] text-white/30">
                                                <span>{r.id}</span><span>📍{r.constituency}</span><span>⏰Due: {r.dueDate}</span><span>👤{r.assignee}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[20px] font-bold text-fuchsia-400">{r.overall}%</span>
                                        </div>
                                    </div>
                                    <Bar pct={r.overall} color="linear-gradient(to right, #f87171, #a855f7)" h={6} />
                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                        {r.sections.map((s, idx) => (
                                            <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + idx * 0.03 }}
                                                className={`p-3 rounded-lg border ${s.pct === 100 ? "bg-green-500/5 border-green-500/10" : s.pct === 0 ? "bg-red-500/5 border-red-500/10" : "bg-white/[0.02] border-white/[0.05]"}`}>
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <span className="text-[10px] text-white/60">{s.n}</span>
                                                    <span className="text-[9px] font-mono font-medium" style={{ color: s.pct === 100 ? "#4ade80" : s.pct > 50 ? "#fbbf24" : "#f87171" }}>{s.pct}%</span>
                                                </div>
                                                <Bar pct={s.pct} color={s.pct === 100 ? "#4ade80" : s.pct > 50 ? "#fbbf24" : "#f87171"} h={3} />
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 mt-4 pt-3 border-t border-white/[0.04]">
                                        <button className="text-[9px] font-mono px-4 py-2 rounded-lg bg-red-500/12 text-red-400 border border-red-500/20 hover:bg-red-500/20 flex items-center gap-1 transition-all"><Icon name="edit" size={13} /> CONTINUE EDITING</button>
                                        <button className="text-[9px] font-mono px-4 py-2 rounded-lg bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 flex items-center gap-1 transition-all"><Icon name="preview" size={13} /> PREVIEW PDF</button>
                                        <button className="text-[9px] font-mono px-4 py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 flex items-center gap-1 ml-auto transition-all"><Icon name="draw" size={13} /> SIGN & SUBMIT</button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div key="c" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                        {completed.map((r, i) => (
                            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="bg-[#0d1018] rounded-xl border border-green-500/10 overflow-hidden cursor-pointer hover:border-green-500/20 transition-all"
                                onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                                <div className="p-5 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                                        <Icon name="check_circle" size={20} className="text-green-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[13px] text-white/85 font-semibold">{r.title}</h4>
                                        <div className="flex items-center gap-3 text-[9px] text-white/30 mt-0.5">
                                            <span>{r.id}</span><span>📍{r.constituency}</span><span>📤{r.submitted}</span><span>✅{r.accepted}</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className="text-[7px] font-mono bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded">{r.status}</span>
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {expandedId === r.id && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                            <div className="border-t border-white/[0.04] px-5 py-4 bg-white/[0.01]">
                                                <div className="grid grid-cols-2 gap-3 mb-3">
                                                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                                        <span className="text-[8px] font-mono text-white/20 uppercase">ECI Receipt Number</span>
                                                        <p className="text-[11px] text-green-400 font-mono font-medium mt-0.5">{r.receipt}</p>
                                                    </div>
                                                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                                        <span className="text-[8px] font-mono text-white/20 uppercase">Digitally Signed By</span>
                                                        <p className="text-[11px] text-white/60 font-medium mt-0.5">{r.signedBy}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 text-[9px] text-white/30 mb-3">
                                                    <span>📄 {r.sections} sections</span><span>📝 {r.pages} pages</span>
                                                    <span>📤 Submitted: {r.submitted}</span><span>✅ Accepted: {r.accepted}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="text-[9px] font-mono px-3 py-1.5 rounded-lg bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-1"><Icon name="download" size={13} /> DOWNLOAD PDF</button>
                                                    <button className="text-[9px] font-mono px-3 py-1.5 rounded-lg bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-1"><Icon name="receipt" size={13} /> VIEW RECEIPT</button>
                                                    <button className="text-[9px] font-mono px-3 py-1.5 rounded-lg bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-1"><Icon name="verified" size={13} /> VERIFY SIGNATURE</button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </ECIPageLayout>
    );
}
