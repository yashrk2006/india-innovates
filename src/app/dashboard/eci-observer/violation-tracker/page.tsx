"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ECIPageLayout, { ECICard, ECISectionHeader, ECIKPI } from "@/components/eci/ECIPageLayout";

function Icon({ name, size = 16, className = "", style }: { name: string; size?: number; className?: string; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size, ...style }}>{name}</span>;
}

/* ══════════════════════════════ DATA ══════════════════════════════ */

const violations = [
    {
        id: "VIO-2026-048", type: "EVM Tampering Allegation", location: "Booth 87, Ward 8, Lucknow",
        severity: "CRITICAL", reported: "5:12 PM", reporter: "Sector Observer", reporterDesig: "IAS",
        description: "Voter reports EVM button press not registering correctly. Machine #EVN-UP-214-087.",
        evidence: ["Video recording (2:34)", "Written complaint (Form-16)", "EVM serial photo"],
        assignedTo: "DEO Lucknow", fir: "FIR-2026-LKO-142",
        timeline: [
            { time: "5:12 PM", action: "Complaint received by Presiding Officer", by: "PO - Booth 87" },
            { time: "5:15 PM", action: "Sector officer notified via ECI Comm", by: "Auto-escalation" },
            { time: "5:18 PM", action: "EVM replaced with reserve unit #EVN-UP-214-R03", by: "Sector Technician" },
            { time: "5:22 PM", action: "Original EVM sealed (Tag #S-2026-087) for forensic audit", by: "Sector Officer" },
            { time: "5:30 PM", action: "Report filed to DEO. Polling resumed.", by: "Gen. Observer" },
        ],
        status: "INVESTIGATING",
    },
    {
        id: "VIO-2026-047", type: "Voter Intimidation", location: "Ward 7, Varanasi",
        severity: "CRITICAL", reported: "5:08 PM", reporter: "Booth Agent", reporterDesig: "Party Rep",
        description: "Armed individuals seen outside polling booth threatening voters from minority community.",
        evidence: ["CCTV footage (3 angles)", "3 witness statements", "cVIGIL #CVG-4419"],
        assignedTo: "SP Varanasi", fir: "FIR-2026-VNS-89",
        timeline: [
            { time: "5:08 PM", action: "cVIGIL complaint received with GPS-tagged video", by: "Citizen" },
            { time: "5:10 PM", action: "Auto-assigned to Flying Squad Team #FST-VNS-04", by: "cVIGIL System" },
            { time: "5:15 PM", action: "FST reaches location. 3 suspects detained.", by: "FST Commander" },
            { time: "5:20 PM", action: "FIR registered u/s 171C IPC", by: "SHO, PS Varanasi City" },
            { time: "5:25 PM", action: "Escalated to Observer + DEO. Polling unaffected.", by: "SP Varanasi" },
        ],
        status: "FIR FILED",
    },
    {
        id: "VIO-2026-046", type: "Cash Seizure", location: "Near Booth 163, Kanpur",
        severity: "HIGH", reported: "4:30 PM", reporter: "Flying Squad", reporterDesig: "SST",
        description: "₹12 Lakh in unaccounted cash seized from vehicle (UP-78-AB-1234) near polling station.",
        evidence: ["Seizure memo #SM-2026-KNP-34", "Cash count video", "Vehicle registration"],
        assignedTo: "DEO Kanpur", fir: "FIR-2026-KNP-56",
        timeline: [
            { time: "4:30 PM", action: "SST intercepts suspicious vehicle near Booth 163", by: "SST-KNP-02" },
            { time: "4:35 PM", action: "₹12L cash found. No valid documentation.", by: "SST Team Lead" },
            { time: "4:40 PM", action: "Seizure memo prepared. Cash counted on camera.", by: "SST-KNP-02" },
            { time: "4:50 PM", action: "Income Tax department notified", by: "DEO Kanpur" },
            { time: "5:00 PM", action: "Candidate Shri X's account flagged for expenditure audit", by: "Exp. Observer" },
        ],
        status: "SEIZED",
    },
    {
        id: "VIO-2026-045", type: "Booth Capture Attempt", location: "Booth 211, Gorakhpur",
        severity: "CRITICAL", reported: "3:45 PM", reporter: "CRPF Personnel", reporterDesig: "Commandant",
        description: "Group of 20+ individuals attempted to forcefully enter booth. Security forces intervened.",
        evidence: ["CCTV footage", "CRPF report", "14 arrests made"],
        assignedTo: "DEO Gorakhpur + ADM", fir: "FIR-2026-GKP-23",
        timeline: [
            { time: "3:45 PM", action: "Mob approaches booth. CRPF issues warning.", by: "CRPF Post #BG-211" },
            { time: "3:48 PM", action: "Tear gas deployed. Mob dispersed.", by: "CRPF Commandant" },
            { time: "3:55 PM", action: "14 individuals arrested. Arms recovered.", by: "Police" },
            { time: "4:10 PM", action: "Re-poll recommendation sent to DEO + ECI", by: "Gen. Observer" },
            { time: "4:30 PM", action: "ECI acknowledges. Polling suspended at Booth 211.", by: "ECI HQ" },
        ],
        status: "NEUTRALIZED",
    },
    {
        id: "VIO-2026-044", type: "Proxy Voting", location: "Booth 56, Prayagraj",
        severity: "HIGH", reported: "2:15 PM", reporter: "Presiding Officer", reporterDesig: "PO Grade-I",
        description: "3 cases of identity mismatch detected during voter verification using biometric + EPIC.",
        evidence: ["Biometric mismatch logs", "Voter ID photos", "Written record in Form 17A"],
        assignedTo: "Sector Officer", fir: null,
        timeline: [
            { time: "2:15 PM", action: "First identity mismatch detected at voter #342", by: "BLO" },
            { time: "2:20 PM", action: "Second mismatch at voter #567. PO alerts Sector Officer.", by: "PO" },
            { time: "2:30 PM", action: "Third mismatch. Challenge votes invoked per Rule 49P", by: "PO" },
            { time: "2:45 PM", action: "All 3 challengers tendered. Sector officer investigation.", by: "SO" },
        ],
        status: "CONFIRMED",
    },
    {
        id: "VIO-2026-043", type: "Silence Period Campaigning", location: "500m zone, Bareilly",
        severity: "MEDIUM", reported: "1:30 PM", reporter: "Observer", reporterDesig: "Gen. Observer",
        description: "Campaign posters and loudspeaker van operated within 500m restricted zone during polling.",
        evidence: ["GPS-tagged photographs", "Audio recording"],
        assignedTo: "RO Bareilly",
        timeline: [
            { time: "1:30 PM", action: "Observer notices loudspeaker van near polling booth", by: "Gen. Observer" },
            { time: "1:35 PM", action: "Notice issued to candidate's agent under MCC", by: "RO Bareilly" },
            { time: "1:45 PM", action: "Posters removed. Van impounded.", by: "Police" },
        ],
        status: "WARNING SENT",
    },
];

const severityColor: Record<string, string> = { CRITICAL: "#f87171", HIGH: "#fbbf24", MEDIUM: "#60a5fa", LOW: "#6b7280" };
const statusColor: Record<string, string> = {
    INVESTIGATING: "#60a5fa", "FIR FILED": "#f87171", SEIZED: "#fbbf24",
    NEUTRALIZED: "#4ade80", CONFIRMED: "#f87171", "WARNING SENT": "#fbbf24", RESOLVED: "#4ade80"
};

const escalationChain = [
    { role: "Presiding Officer", icon: "person", desc: "First responder at booth level" },
    { role: "Sector Officer", icon: "supervisor_account", desc: "Oversees 10-15 booths" },
    { role: "General Observer", icon: "visibility", desc: "IAS-level oversight" },
    { role: "DEO / Returning Officer", icon: "admin_panel_settings", desc: "District authority" },
    { role: "CEO (State)", icon: "account_balance", desc: "State-level escalation" },
    { role: "ECI HQ (New Delhi)", icon: "flag", desc: "Final authority" },
];

export default function ViolationTrackerPage() {
    const [severityFilter, setSeverityFilter] = useState("ALL");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [showTimeline, setShowTimeline] = useState<string | null>(null);

    const filtered = severityFilter === "ALL" ? violations : violations.filter(v => v.severity === severityFilter);

    return (
        <ECIPageLayout title="Violation Tracker" badge={`🚨 ${violations.length} ACTIVE VIOLATIONS`} badgeColor="#f87171">
            <div className="grid grid-cols-6 gap-3 mb-6">
                <ECIKPI icon="report" label="Total" value={String(violations.length)} sub="Today" color="#f87171" delay={0} />
                <ECIKPI icon="error" label="Critical" value={String(violations.filter(v => v.severity === "CRITICAL").length)} sub="Immediate" color="#f87171" delay={0.05} />
                <ECIKPI icon="description" label="FIRs Filed" value={String(violations.filter(v => v.fir).length)} sub="With police" color="#fbbf24" delay={0.1} />
                <ECIKPI icon="currency_rupee" label="Cash Seized" value="₹12L" sub="1 seizure" color="#4ade80" delay={0.15} />
                <ECIKPI icon="groups" label="Arrested" value="17" sub="2 incidents" color="#818cf8" delay={0.2} />
                <ECIKPI icon="timer" label="Avg Response" value="8 min" sub="Below 15 min SLA" color="#60a5fa" delay={0.25} />
            </div>

            <div className="grid grid-cols-[1fr_300px] gap-5">
                <div className="space-y-4">
                    {/* Filters */}
                    <ECICard>
                        <div className="p-3 flex items-center gap-2">
                            <span className="text-[8px] font-mono text-white/20 tracking-widest uppercase mr-1">SEVERITY:</span>
                            {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map(s => (
                                <button key={s} onClick={() => setSeverityFilter(s)}
                                    className={`text-[9px] font-mono px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${severityFilter === s ? "bg-red-500/15 text-red-400 border border-red-500/25" : "text-white/25 border border-transparent hover:text-white/50"}`}
                                >
                                    {s !== "ALL" && <div className="w-1.5 h-1.5 rounded-full" style={{ background: severityColor[s] }} />}
                                    {s}
                                </button>
                            ))}
                        </div>
                    </ECICard>

                    {/* Violation Cards */}
                    <AnimatePresence>
                        {filtered.map((v, i) => (
                            <motion.div
                                key={v.id}
                                layout
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: i * 0.04 }}
                                className="bg-[#0d1018] rounded-xl border border-white/[0.06] overflow-hidden hover:border-red-500/12 transition-all duration-200"
                            >
                                {/* Header */}
                                <div className="flex items-stretch cursor-pointer" onClick={() => setExpandedId(expandedId === v.id ? null : v.id)}>
                                    <div className="w-1.5 shrink-0" style={{ background: severityColor[v.severity] }} />
                                    <div className="flex-1 px-5 py-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-[13px] text-white/90 font-semibold">{v.type}</h4>
                                                    <span className="text-[8px] font-mono text-white/20">{v.id}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-[9px] text-white/35">
                                                    <span>📍 {v.location}</span>
                                                    <span>🕐 {v.reported}</span>
                                                    <span>👤 {v.reporter} ({v.reporterDesig})</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-[7px] font-mono px-1.5 py-0.5 rounded" style={{ color: severityColor[v.severity], background: severityColor[v.severity] + "12" }}>{v.severity}</span>
                                                <span className="text-[7px] font-mono px-1.5 py-0.5 rounded" style={{ color: statusColor[v.status], background: statusColor[v.status] + "12" }}>{v.status}</span>
                                                {v.fir && <span className="text-[7px] font-mono px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">FIR</span>}
                                                <Icon name={expandedId === v.id ? "expand_less" : "expand_more"} size={16} className="text-white/20" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded */}
                                <AnimatePresence>
                                    {expandedId === v.id && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                                            <div className="border-t border-white/[0.04] px-5 py-4 bg-white/[0.01] ml-1.5">
                                                <p className="text-[11px] text-white/60 leading-relaxed mb-3">{v.description}</p>

                                                {/* Evidence */}
                                                <div className="mb-3">
                                                    <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider">Evidence Attached:</span>
                                                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                        {v.evidence.map((e, idx) => (
                                                            <span key={idx} className="text-[9px] bg-white/5 text-white/50 px-2 py-1 rounded-md font-mono border border-white/[0.06] hover:bg-white/10 cursor-pointer transition-colors">
                                                                📎 {e}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Assignment + FIR */}
                                                <div className="flex gap-4 mb-3 text-[9px]">
                                                    <span className="text-white/30">Assigned: <span className="text-white/60 font-medium">{v.assignedTo}</span></span>
                                                    {v.fir && <span className="text-white/30">FIR: <span className="text-red-400 font-medium">{v.fir}</span></span>}
                                                </div>

                                                {/* Timeline Toggle */}
                                                <button onClick={(e) => { e.stopPropagation(); setShowTimeline(showTimeline === v.id ? null : v.id); }}
                                                    className="text-[9px] font-mono text-red-400 hover:text-red-300 mb-3 flex items-center gap-1 transition-colors"
                                                >
                                                    <Icon name={showTimeline === v.id ? "expand_less" : "timeline"} size={14} />
                                                    {showTimeline === v.id ? "Hide" : "Show"} Escalation Timeline ({v.timeline.length} steps)
                                                </button>

                                                <AnimatePresence>
                                                    {showTimeline === v.id && (
                                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                            <div className="space-y-0 ml-1 mb-3">
                                                                {v.timeline.map((t, idx) => (
                                                                    <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}
                                                                        className="flex items-start gap-3 relative"
                                                                    >
                                                                        <div className="flex flex-col items-center shrink-0">
                                                                            <div className={`w-3 h-3 rounded-full border-2 ${idx === v.timeline.length - 1 ? "bg-green-500 border-green-500" : "bg-transparent border-red-400/40"}`} />
                                                                            {idx < v.timeline.length - 1 && <div className="w-[2px] h-8 bg-white/[0.06]" />}
                                                                        </div>
                                                                        <div className="pb-3">
                                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                                <span className="text-[9px] font-mono text-red-400/60">{t.time}</span>
                                                                                <span className="text-[8px] font-mono text-white/20 bg-white/5 px-1.5 py-0.5 rounded">{t.by}</span>
                                                                            </div>
                                                                            <p className="text-[10px] text-white/60">{t.action}</p>
                                                                        </div>
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
                                                    <button className="text-[9px] font-mono px-3 py-1.5 rounded-lg bg-red-500/12 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">ESCALATE TO ECI</button>
                                                    <button className="text-[9px] font-mono px-3 py-1.5 rounded-lg bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 transition-all">ADD EVIDENCE</button>
                                                    <button className="text-[9px] font-mono px-3 py-1.5 rounded-lg bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 transition-all">FILE FIR</button>
                                                    <button className="text-[9px] font-mono px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all ml-auto">MARK RESOLVED</button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Escalation Chain */}
                    <ECICard delay={0.15}>
                        <ECISectionHeader title="ECI Escalation Chain" icon="account_tree" />
                        <div className="p-4 space-y-0">
                            {escalationChain.map((e, i) => (
                                <motion.div key={e.role} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
                                    className="flex items-center gap-3 relative"
                                >
                                    <div className="flex flex-col items-center shrink-0">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.03] border border-white/[0.08]">
                                            <Icon name={e.icon} size={14} className="text-red-400/60" />
                                        </div>
                                        {i < escalationChain.length - 1 && (
                                            <div className="w-[2px] h-4 bg-gradient-to-b from-white/10 to-transparent my-0.5" />
                                        )}
                                    </div>
                                    <div className="pb-4">
                                        <span className="text-[10px] text-white/70 font-medium">{e.role}</span>
                                        <p className="text-[8px] text-white/25 font-mono">{e.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </ECICard>

                    {/* Summary Stats */}
                    <ECICard delay={0.25}>
                        <ECISectionHeader title="Today's Summary" icon="summarize" />
                        <div className="p-4 space-y-2.5">
                            {[
                                { label: "Total Violations", value: "6", color: "#f87171" },
                                { label: "FIRs Registered", value: "4", color: "#fbbf24" },
                                { label: "Cash Seized", value: "₹12,00,000", color: "#4ade80" },
                                { label: "Arrests Made", value: "17", color: "#818cf8" },
                                { label: "EVMs Replaced", value: "1", color: "#60a5fa" },
                                { label: "Booths Affected", value: "5", color: "#f472b6" },
                                { label: "Re-poll Pending", value: "1", color: "#f87171" },
                            ].map((s, i) => (
                                <div key={s.label} className="flex justify-between items-center py-1.5 border-b border-white/[0.03]">
                                    <span className="text-[10px] text-white/40">{s.label}</span>
                                    <span className="text-[11px] font-mono font-semibold" style={{ color: s.color }}>{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </ECICard>

                    {/* Quick Actions */}
                    <ECICard delay={0.3}>
                        <ECISectionHeader title="Quick Actions" icon="bolt" />
                        <div className="p-4 space-y-2">
                            {[
                                { label: "New Violation Entry", icon: "add_circle", color: "#f87171" },
                                { label: "Generate MCC Report", icon: "summarize", color: "#60a5fa" },
                                { label: "Notify ECI Delhi", icon: "send", color: "#fbbf24" },
                                { label: "Request Re-poll", icon: "replay", color: "#f472b6" },
                            ].map((a, i) => (
                                <motion.button key={a.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.05 }}
                                    className="w-full flex items-center gap-2.5 p-2.5 rounded-lg text-[10px] font-medium text-white/50 bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:text-white/80 transition-all text-left"
                                >
                                    <Icon name={a.icon} size={15} style={{ color: a.color }} />
                                    {a.label}
                                </motion.button>
                            ))}
                        </div>
                    </ECICard>
                </div>
            </div>
        </ECIPageLayout>
    );
}
