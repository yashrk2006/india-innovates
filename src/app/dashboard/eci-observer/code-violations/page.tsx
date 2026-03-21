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

/* ══════════════════════════════ DATA ══════════════════════════════ */

const violations = [
    { id: "MCC-2026-001", type: "Paid News", party: "Party A", candidate: "Shri R. Agarwal", constituency: "Lucknow North", severity: "CRITICAL", status: "NOTICE ISSUED", reported: "Feb 19", description: "Unmarked party advertisement disguised as news on local channel 'Aaj Tak Lucknow'. 3-minute segment during prime time.", section: "Para 7(iii) MCC", action: "Show-cause notice to candidate + channel", expenditureImpact: 5.2, evidence: ["Broadcast recording", "Channel schedule", "Rate card"] },
    { id: "MCC-2026-002", type: "Cash Distribution", party: "Party A", candidate: "Shri R. Agarwal", constituency: "Lucknow North", severity: "CRITICAL", status: "FIR FILED", reported: "Feb 18", description: "₹12L unaccounted cash seized by SST near Booth 163. Cash packed in ₹500 bundles.", section: "Para 1 MCC + S.171B IPC", action: "FIR registered. Income Tax notified.", expenditureImpact: 12.0, evidence: ["Seizure memo", "Cash count video", "Vehicle docs"] },
    { id: "MCC-2026-003", type: "Hate Speech", party: "Party C", candidate: "Shri V. Rathore", constituency: "Meerut", severity: "CRITICAL", status: "EC HEARING", reported: "Feb 20", description: "Incendiary speech targeting religious groups at public meeting. Video viral on social media with 2M+ views.", section: "Para 1(1) MCC + S.153A IPC", action: "EC hearing scheduled. Campaign ban recommended.", expenditureImpact: 0, evidence: ["Full speech video (47 min)", "Social media screenshots", "Crowd estimate report"] },
    { id: "MCC-2026-004", type: "Govt. Machinery Misuse", party: "Incumbent", candidate: "Smt. P. Mishra", constituency: "Varanasi", severity: "HIGH", status: "UNDER REVIEW", reported: "Feb 17", description: "Use of government helicopter for campaign rally. Pilot log shows non-official route.", section: "Para 6(1) MCC", action: "Inquiry committee formed", expenditureImpact: 8.5, evidence: ["Pilot log book", "ATC records", "Rally photos"] },
    { id: "MCC-2026-005", type: "Social Media Violation", party: "Party C", candidate: "Dr. M. Khan", constituency: "Agra", severity: "MEDIUM", status: "CONTENT REMOVED", reported: "Feb 17", description: "Communal content shared via official party social media handles. Morphed image of opposition leader.", section: "Para 1(4) MCC + IT Act S.66", action: "Content takedown. Written warning.", expenditureImpact: 0.3, evidence: ["Screenshots", "Analytics data", "Platform report"] },
    { id: "MCC-2026-006", type: "Unauthorized Rally", party: "Party B", candidate: "Shri K. Singh", constituency: "Prayagraj", severity: "HIGH", status: "PENALTY IMPOSED", reported: "Feb 17", description: "Large rally (est. 8,000 people) conducted without permission during 48-hr silence period before polling.", section: "Para 6(2) MCC + S.188 IPC", action: "₹50,000 fine imposed. FIR under S.188 IPC.", expenditureImpact: 15.0, evidence: ["Drone footage", "Police report", "Permission records"] },
    { id: "MCC-2026-007", type: "Liquor Distribution", party: "Party A", candidate: "Shri R. Agarwal", constituency: "Lucknow North", severity: "HIGH", status: "SEIZED", reported: "Feb 16", description: "480 bottles of country liquor seized from warehouse linked to candidate's campaign office.", section: "Para 1 MCC + Excise Act", action: "Warehouse sealed. Candidate summoned.", expenditureImpact: 2.8, evidence: ["Seizure memo", "Warehouse photos", "Ownership docs"] },
    { id: "MCC-2026-008", type: "Defacement", party: "Party B", candidate: "Shri K. Singh", constituency: "Prayagraj", severity: "LOW", status: "RESOLVED", reported: "Feb 15", description: "Campaign posters on government hospital walls. 200+ posters in restricted zone.", section: "Para 2(iii) MCC", action: "Posters removed. Recovery of cleaning cost.", expenditureImpact: 0.1, evidence: ["Before/after photos"] },
];

const expenditureData = [
    { candidate: "Shri R. Agarwal", party: "Party A", constituency: "Lucknow North", declared: 42.3, estimated: 62.5, limit: 75, seizures: 14.8, violations: 3, status: "FLAGGED" },
    { candidate: "Smt. P. Mishra", party: "Incumbent", constituency: "Varanasi", declared: 68.1, estimated: 76.6, limit: 75, seizures: 0, violations: 1, status: "EXCEEDED" },
    { candidate: "Shri K. Singh", party: "Party B", constituency: "Prayagraj", declared: 55.8, estimated: 70.8, limit: 75, seizures: 0, violations: 2, status: "FLAGGED" },
    { candidate: "Dr. M. Khan", party: "Party C", constituency: "Agra", declared: 28.4, estimated: 28.7, limit: 75, seizures: 0, violations: 1, status: "NORMAL" },
    { candidate: "Shri V. Rathore", party: "Party C", constituency: "Meerut", declared: 31.2, estimated: 31.2, limit: 75, seizures: 0, violations: 1, status: "NORMAL" },
];

const partyWise = [
    { party: "Party A", violations: 3, seizures: "₹14.8L", candidates: 5, color: "#ef4444" },
    { party: "Party B", violations: 2, seizures: "₹0", candidates: 5, color: "#60a5fa" },
    { party: "Party C", violations: 2, seizures: "₹0", candidates: 5, color: "#10b981" },
    { party: "Incumbent", violations: 1, seizures: "₹0", candidates: 5, color: "#f59e0b" },
];

const severityColor: Record<string, string> = { CRITICAL: "#ef4444", HIGH: "#f59e0b", MEDIUM: "#60a5fa", LOW: "#6b7280" };
const statusColor: Record<string, string> = {
    "NOTICE ISSUED": "#f59e0b", "FIR FILED": "#ef4444", "EC HEARING": "#ef4444", "UNDER REVIEW": "#60a5fa",
    "CONTENT REMOVED": "#10b981", "PENALTY IMPOSED": "#f59e0b", SEIZED: "#ef4444", RESOLVED: "#10b981", EXCEEDED: "#ef4444", FLAGGED: "#f59e0b", NORMAL: "#10b981"
};

export default function CodeViolationsPage() {
    const [tab, setTab] = useState<"violations" | "expenditure">("violations");
    const [severityFilter, setSeverityFilter] = useState("ALL");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filtered = severityFilter === "ALL" ? violations : violations.filter(v => v.severity === severityFilter);

    return (
        <ECIPageLayout title="Model Code of Conduct" badge="⚖ MCC ENFORCEMENT" badgeColor="#f59e0b">
            <div className="grid grid-cols-6 gap-3 mb-6">
                <ECIKPI icon="gavel" label="MCC Violations" value={String(violations.length)} sub="This cycle" color="#ef4444" delay={0} />
                <ECIKPI icon="error" label="Critical" value={String(violations.filter(v => v.severity === "CRITICAL").length)} sub="Immediate action" color="#ef4444" delay={0.05} />
                <ECIKPI icon="currency_rupee" label="Cash Seized" value="₹12L" sub="1 operation" color="#10b981" delay={0.1} />
                <ECIKPI icon="local_bar" label="Liquor Seized" value="480 btl" sub="1 warehouse" color="#818cf8" delay={0.15} />
                <ECIKPI icon="description" label="FIRs Filed" value="3" sub="Under IPC" color="#f59e0b" delay={0.2} />
                <ECIKPI icon="account_balance" label="Fines Imposed" value="₹50K" sub="1 penalty" color="#60a5fa" delay={0.25} />
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 mb-5">
                <button onClick={() => setTab("violations")}
                    className={`text-[10px] font-mono px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${tab === "violations" ? "bg-red-500/15 text-red-400 border border-red-500/25" : "text-slate-500 border border-slate-200 hover:text-slate-600"}`}
                ><Icon name="gavel" size={14} /> MCC Violations ({violations.length})</button>
                <button onClick={() => setTab("expenditure")}
                    className={`text-[10px] font-mono px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${tab === "expenditure" ? "bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/25" : "text-slate-500 border border-slate-200 hover:text-slate-600"}`}
                ><Icon name="account_balance" size={14} /> Expenditure Monitor ({expenditureData.length})</button>
            </div>

            <AnimatePresence mode="wait">
                {tab === "violations" ? (
                    <motion.div key="vio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="grid grid-cols-[1fr_280px] gap-5">
                            <div className="space-y-3">
                                {/* Filters */}
                                <ECICard>
                                    <div className="p-3 flex items-center gap-2">
                                        <span className="text-[8px] font-mono text-slate-400 tracking-widest uppercase mr-1">FILTER:</span>
                                        {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map(s => (
                                            <button key={s} onClick={() => setSeverityFilter(s)}
                                                className={`text-[9px] font-mono px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${severityFilter === s ? "bg-red-500/15 text-red-400 border border-red-500/25" : "text-slate-400 border border-transparent hover:text-slate-500"}`}
                                            >
                                                {s !== "ALL" && <div className="w-1.5 h-1.5 rounded-full" style={{ background: severityColor[s] }} />}
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </ECICard>

                                {/* Violation Cards */}
                                {filtered.map((v, i) => (
                                    <motion.div key={v.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                                        className="bg-[#0d1018] rounded-xl border border-slate-200 overflow-hidden hover:border-red-500/12 transition-all cursor-pointer"
                                        onClick={() => setExpandedId(expandedId === v.id ? null : v.id)}
                                    >
                                        <div className="flex items-stretch">
                                            <div className="w-1.5 shrink-0" style={{ background: severityColor[v.severity] }} />
                                            <div className="flex-1 px-5 py-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="text-[13px] text-slate-500 font-semibold">{v.type}</h4>
                                                            <span className="text-[8px] font-mono text-slate-400">{v.id}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-[9px] text-slate-500">
                                                            <span>🏛 {v.party} · {v.candidate}</span>
                                                            <span>📍 {v.constituency}</span>
                                                            <span>📅 {v.reported}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <span className="text-[7px] font-mono px-1.5 py-0.5 rounded" style={{ color: severityColor[v.severity], background: severityColor[v.severity] + "12" }}>{v.severity}</span>
                                                        <span className="text-[7px] font-mono px-1.5 py-0.5 rounded" style={{ color: statusColor[v.status], background: statusColor[v.status] + "12" }}>{v.status}</span>
                                                    </div>
                                                </div>

                                                <AnimatePresence>
                                                    {expandedId === v.id && (
                                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                            <div className="mt-3 pt-3 border-t border-slate-200">
                                                                <p className="text-[11px] text-slate-600 leading-relaxed mb-3">{v.description}</p>
                                                                <div className="grid grid-cols-2 gap-3 mb-3 text-[9px]">
                                                                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-slate-200">
                                                                        <span className="text-slate-400">MCC Section: </span><span className="text-red-400 font-medium">{v.section}</span>
                                                                    </div>
                                                                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-slate-200">
                                                                        <span className="text-slate-400">Action: </span><span className="text-slate-600">{v.action}</span>
                                                                    </div>
                                                                </div>
                                                                {v.expenditureImpact > 0 && (
                                                                    <div className="p-2.5 rounded-lg bg-fuchsia-500/5 border border-fuchsia-500/10 mb-3 text-[9px]">
                                                                        <span className="text-fuchsia-400">💰 Expenditure Impact: ₹{v.expenditureImpact}L added to candidate's deemed expenditure</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex flex-wrap gap-1.5 mb-3">
                                                                    {v.evidence.map((e, idx) => (
                                                                        <span key={idx} className="text-[8px] bg-white/5 text-slate-500 px-2 py-1 rounded font-mono border border-slate-200 hover:bg-white/10 cursor-pointer transition-colors">📎 {e}</span>
                                                                    ))}
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <button className="text-[9px] font-mono px-3 py-1.5 rounded-lg bg-red-500/12 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">ESCALATE</button>
                                                                    <button className="text-[9px] font-mono px-3 py-1.5 rounded-lg bg-white/5 text-slate-500 border border-slate-200 hover:bg-white/10 transition-all">ADD EVIDENCE</button>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Party Sidebar */}
                            <div className="space-y-4">
                                <ECICard delay={0.15}>
                                    <ECISectionHeader title="Party-wise Violations" icon="groups" />
                                    <div className="p-4 space-y-3">
                                        {partyWise.map((p, i) => (
                                            <motion.div key={p.party} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
                                                className="p-3 rounded-lg bg-white/[0.02] border border-slate-200">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[11px] text-slate-700 font-medium">{p.party}</span>
                                                    <span className="text-[12px] font-bold" style={{ color: p.color }}>{p.violations}</span>
                                                </div>
                                                <div className="flex gap-3 text-[8px] font-mono text-slate-500">
                                                    <span>Seizures: {p.seizures}</span>
                                                    <span>{p.candidates} candidates</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </ECICard>

                                <ECICard delay={0.2}>
                                    <ECISectionHeader title="MCC Quick Ref" icon="menu_book" />
                                    <div className="p-4 space-y-2 text-[9px]">
                                        {[
                                            { code: "Para 1", label: "General Conduct", desc: "No appeal to communal feelings" },
                                            { code: "Para 2", label: "Meetings", desc: "Permission required, no loudspeakers after 10 PM" },
                                            { code: "Para 6", label: "Govt. Resources", desc: "No use of govt. machinery for campaigning" },
                                            { code: "Para 7", label: "Media", desc: "No paid news, equal opportunity" },
                                        ].map((r, i) => (
                                            <div key={r.code} className="p-2 rounded border border-slate-200 hover:bg-white/[0.02] cursor-pointer transition-colors">
                                                <span className="text-red-400 font-mono font-medium">{r.code}</span>
                                                <span className="text-slate-500"> — {r.label}</span>
                                                <p className="text-slate-400 mt-0.5">{r.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </ECICard>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="exp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <ECICard>
                            <ECISectionHeader title="Candidate Expenditure Monitoring" icon="account_balance"
                                action={<span className="text-[8px] font-mono text-slate-400">Limit: ₹75L per constituency (Lok Sabha)</span>} />
                            <div>
                                <div className="grid grid-cols-[1fr_80px_90px_90px_80px_70px_70px_80px] gap-2 px-5 py-2.5 border-b border-slate-200 text-[8px] font-mono text-slate-400 uppercase tracking-[1.5px]">
                                    <span>Candidate</span><span>Party</span><span>Declared</span><span>Estimated</span><span>Seized</span><span>Limit</span><span>Used</span><span>Status</span>
                                </div>
                                {expenditureData.map((e, i) => {
                                    const usedPct = (e.estimated / e.limit) * 100;
                                    return (
                                        <motion.div key={e.candidate} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                            className={`grid grid-cols-[1fr_80px_90px_90px_80px_70px_70px_80px] gap-2 px-5 py-3.5 border-b border-slate-200 items-center transition-colors ${e.status === "EXCEEDED" ? "bg-red-500/5" : "hover:bg-white/[0.015]"}`}
                                        >
                                            <div>
                                                <span className="text-[11px] text-slate-700 font-medium block">{e.candidate}</span>
                                                <span className="text-[8px] text-slate-400 font-mono">{e.constituency}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-500">{e.party}</span>
                                            <span className="text-[10px] font-mono text-slate-600">₹{e.declared}L</span>
                                            <span className="text-[10px] font-mono font-medium" style={{ color: e.estimated > e.limit ? "#ef4444" : "#10b981" }}>₹{e.estimated}L</span>
                                            <span className="text-[10px] font-mono" style={{ color: e.seizures > 0 ? "#ef4444" : "#10b981" }}>{e.seizures > 0 ? `₹${e.seizures}L` : "—"}</span>
                                            <span className="text-[10px] font-mono text-slate-500">₹{e.limit}L</span>
                                            <div className="flex items-center gap-1">
                                                <div className="w-10"><Bar pct={Math.min(usedPct, 100)} color={usedPct > 95 ? "#ef4444" : usedPct > 75 ? "#f59e0b" : "#10b981"} h={4} /></div>
                                                <span className="text-[8px] font-mono text-slate-500">{usedPct.toFixed(0)}%</span>
                                            </div>
                                            <span className="text-[7px] font-mono px-1.5 py-0.5 rounded text-center" style={{ color: statusColor[e.status], background: statusColor[e.status] + "12" }}>{e.status}</span>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </ECICard>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-3 gap-4 mt-5">
                            <ECICard delay={0.1}>
                                <div className="p-5">
                                    <div className="text-[8px] font-mono text-slate-400 uppercase tracking-wider mb-2">Total Seizures</div>
                                    <div className="text-[28px] font-bold text-red-400">₹14.8L</div>
                                    <p className="text-[9px] text-slate-500 mt-1">Cash ₹12L + Liquor ₹2.8L</p>
                                    <div className="mt-3 pt-3 border-t border-slate-200 space-y-1.5">
                                        <div className="flex justify-between text-[9px]"><span className="text-slate-500">SST Operations</span><span className="text-slate-600">4</span></div>
                                        <div className="flex justify-between text-[9px]"><span className="text-slate-500">FST Operations</span><span className="text-slate-600">6</span></div>
                                        <div className="flex justify-between text-[9px]"><span className="text-slate-500">Check Posts</span><span className="text-slate-600">12 active</span></div>
                                    </div>
                                </div>
                            </ECICard>
                            <ECICard delay={0.15}>
                                <div className="p-5">
                                    <div className="text-[8px] font-mono text-slate-400 uppercase tracking-wider mb-2">Expenditure Observers</div>
                                    <div className="text-[28px] font-bold text-fuchsia-400">8</div>
                                    <p className="text-[9px] text-slate-500 mt-1">Deployed across 5 constituencies</p>
                                    <div className="mt-3 pt-3 border-t border-slate-200 space-y-1.5">
                                        <div className="flex justify-between text-[9px]"><span className="text-slate-500">Shadow observations</span><span className="text-slate-600">34</span></div>
                                        <div className="flex justify-between text-[9px]"><span className="text-slate-500">Account reviews</span><span className="text-slate-600">12</span></div>
                                        <div className="flex justify-between text-[9px]"><span className="text-slate-500">Discrepancy reports</span><span className="text-slate-600">3</span></div>
                                    </div>
                                </div>
                            </ECICard>
                            <ECICard delay={0.2}>
                                <div className="p-5">
                                    <div className="text-[8px] font-mono text-slate-400 uppercase tracking-wider mb-2">Compliance Status</div>
                                    <div className="text-[28px] font-bold text-green-400">60%</div>
                                    <p className="text-[9px] text-slate-500 mt-1">3 of 5 candidates compliant</p>
                                    <div className="mt-3 pt-3 border-t border-slate-200 space-y-1.5">
                                        <div className="flex justify-between text-[9px]"><span className="text-slate-500">Compliant</span><span className="text-green-400">3</span></div>
                                        <div className="flex justify-between text-[9px]"><span className="text-slate-500">Flagged</span><span className="text-yellow-400">1</span></div>
                                        <div className="flex justify-between text-[9px]"><span className="text-slate-500">Exceeded</span><span className="text-red-400">1</span></div>
                                    </div>
                                </div>
                            </ECICard>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ECIPageLayout>
    );
}
