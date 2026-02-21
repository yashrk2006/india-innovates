"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ECIPageLayout, { ECICard, ECISectionHeader, ECIKPI } from "@/components/eci/ECIPageLayout";

function Icon({ name, size = 16, className = "", style }: { name: string; size?: number; className?: string; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size, ...style }}>{name}</span>;
}

function Bar({ pct, color = "#f87171", h = 5 }: { pct: number; color?: string; h?: number }) {
    return (
        <div className="bg-white/5 rounded-full overflow-hidden" style={{ height: h }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }}
                className="rounded-full" style={{ background: color, height: h }} />
        </div>
    );
}

/* ══════════════════════════════ DATA ══════════════════════════════ */

const stateAlerts = [
    { state: "Uttar Pradesh", booths: 1240, violations: 34, turnout: 62, evmIssues: 3, observers: 186, status: "HIGH ALERT" },
    { state: "Maharashtra", booths: 890, violations: 12, turnout: 58, evmIssues: 0, observers: 134, status: "NORMAL" },
    { state: "Bihar", booths: 720, violations: 28, turnout: 55, evmIssues: 2, observers: 108, status: "CAUTION" },
    { state: "West Bengal", booths: 670, violations: 8, turnout: 71, evmIssues: 0, observers: 101, status: "NORMAL" },
    { state: "Tamil Nadu", booths: 590, violations: 5, turnout: 68, evmIssues: 1, observers: 89, status: "NORMAL" },
    { state: "Rajasthan", booths: 460, violations: 19, turnout: 51, evmIssues: 1, observers: 69, status: "CAUTION" },
];

const recentEvents = [
    { time: "5:12 PM", event: "EVM malfunction reported – Booth 87, Lucknow North", level: "CRITICAL", icon: "error", category: "EVM" },
    { time: "5:08 PM", event: "Voter intimidation report via cVIGIL – Ward 7, Varanasi", level: "HIGH", icon: "warning", category: "cVIGIL" },
    { time: "4:55 PM", event: "Phase 2 turnout crosses 60% — national milestone", level: "INFO", icon: "trending_up", category: "Turnout" },
    { time: "4:42 PM", event: "Bihar turnout below 55% threshold — auto alert dispatched", level: "HIGH", icon: "warning", category: "Turnout" },
    { time: "4:30 PM", event: "₹12L unaccounted cash seized near Kanpur booth by FST", level: "CRITICAL", icon: "error", category: "MCC" },
    { time: "4:15 PM", event: "UP Phase-2 polling completion tracking at 94%", level: "INFO", icon: "check_circle", category: "Status" },
    { time: "3:58 PM", event: "Meerut CCTV Feed #BTH-009 — AI flagged crowd anomaly", level: "MEDIUM", icon: "videocam", category: "CCTV" },
    { time: "3:42 PM", event: "cVIGIL #CVG-4421: Cash distribution video verified", level: "HIGH", icon: "verified", category: "cVIGIL" },
    { time: "3:30 PM", event: "VVPAT paper trail mismatch — Booth 56, Prayagraj", level: "CRITICAL", icon: "error", category: "EVM" },
];

const evmStatus = [
    { label: "Total EVMs Deployed", value: "18,420", icon: "ballot", color: "#60a5fa" },
    { label: "Functioning Normal", value: "18,391", icon: "check_circle", color: "#4ade80" },
    { label: "Replaced Today", value: "24", icon: "swap_horiz", color: "#fbbf24" },
    { label: "Under Investigation", value: "5", icon: "search", color: "#f87171" },
];

const vvpatStatus = { total: 18420, verified: 18398, mismatch: 3, pending: 19 };

const cvigilComplaints = [
    { id: "CVG-4425", type: "Cash Distribution", location: "Bareilly, Ward 3", time: "5:05 PM", status: "PENDING", media: "Video", gps: true },
    { id: "CVG-4424", type: "Intimidation", location: "Lucknow South", time: "4:52 PM", status: "ASSIGNED", media: "Photo + Audio", gps: true },
    { id: "CVG-4423", type: "Liquor Distribution", location: "Gorakhpur, Ward 8", time: "4:38 PM", status: "RESOLVED", media: "Video", gps: true },
    { id: "CVG-4422", type: "Campaigning in Silence", location: "Meerut", time: "4:21 PM", status: "ASSIGNED", media: "Photo", gps: true },
    { id: "CVG-4421", type: "Cash Distribution", location: "Kanpur South", time: "3:42 PM", status: "FIR FILED", media: "Video", gps: true },
];

const observerDeployment = [
    { role: "General Observer", deployed: 312, total: 320, color: "#60a5fa" },
    { role: "Expenditure Observer", deployed: 156, total: 160, color: "#fbbf24" },
    { role: "Police Observer", deployed: 155, total: 160, color: "#f87171" },
    { role: "Micro Observer", deployed: 189, total: 200, color: "#818cf8" },
];

const hourlyTurnout = [
    { hour: "7AM", pct: 3 }, { hour: "8AM", pct: 8 }, { hour: "9AM", pct: 16 },
    { hour: "10AM", pct: 26 }, { hour: "11AM", pct: 35 }, { hour: "12PM", pct: 42 },
    { hour: "1PM", pct: 47 }, { hour: "2PM", pct: 53 }, { hour: "3PM", pct: 58 },
    { hour: "4PM", pct: 63 }, { hour: "5PM", pct: 67 },
];

const expenditureAlerts = [
    { candidate: "Shri Ramesh Agarwal", constituency: "Lucknow North", spent: 42.3, limit: 75, flag: false },
    { candidate: "Smt. Priya Mishra", constituency: "Varanasi", spent: 68.1, limit: 75, flag: true },
    { candidate: "Shri Karan Singh", constituency: "Kanpur South", spent: 71.8, limit: 75, flag: true },
    { candidate: "Dr. Anita Das", constituency: "Gorakhpur", spent: 35.6, limit: 75, flag: false },
];

const levelColor: Record<string, string> = { CRITICAL: "#f87171", HIGH: "#fbbf24", MEDIUM: "#60a5fa", INFO: "#4ade80" };
const statusColor: Record<string, string> = { "HIGH ALERT": "#f87171", CAUTION: "#fbbf24", NORMAL: "#4ade80" };
const cvigilStatusColor: Record<string, string> = { PENDING: "#f87171", ASSIGNED: "#fbbf24", RESOLVED: "#4ade80", "FIR FILED": "#f87171" };

export default function ECICommandCenter() {
    const [clock, setClock] = useState("");
    const [eventFilter, setEventFilter] = useState("ALL");
    const [diaryEntry, setDiaryEntry] = useState("");
    const [diaryEntries, setDiaryEntries] = useState([
        { time: "4:00 PM", text: "Visited Booth 142, Ward 12. Polling proceeding smoothly. Voter queue ~15 min wait." },
        { time: "2:30 PM", text: "Sector magistrate briefing completed. All FSTs operational." },
        { time: "11:00 AM", text: "Mock poll completed successfully at all assigned booths. EVMs sealed." },
    ]);

    useEffect(() => {
        setClock(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        const t = setInterval(() => setClock(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })), 1000);
        return () => clearInterval(t);
    }, []);

    const filteredEvents = eventFilter === "ALL" ? recentEvents : recentEvents.filter(e => e.category === eventFilter);
    const maxPct = Math.max(...hourlyTurnout.map(h => h.pct));

    const addDiaryEntry = () => {
        if (!diaryEntry.trim()) return;
        setDiaryEntries([{ time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase(), text: diaryEntry }, ...diaryEntries]);
        setDiaryEntry("");
    };

    return (
        <ECIPageLayout title="National Command Center" badge="🟢 SYSTEM ONLINE" badgeColor="#4ade80"
            actions={
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-white/35 tracking-widest">Phase 2 · General Election 2026</span>
                    <span className="text-[13px] font-mono text-red-400 font-bold tabular-nums">{clock} IST</span>
                    <button className="text-[9px] font-mono px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all flex items-center gap-1.5 shadow-lg shadow-red-600/20">
                        <Icon name="emergency" size={14} /> EMERGENCY
                    </button>
                </div>
            }
        >
            {/* ── KPI Row ── */}
            <div className="grid grid-cols-6 gap-3 mb-6">
                <ECIKPI icon="how_to_vote" label="National Turnout" value="62.9%" sub="↑ 3.1% vs Phase 1" color="#4ade80" delay={0} />
                <ECIKPI icon="location_on" label="Active Booths" value="4,570" sub="28 states" color="#60a5fa" delay={0.05} />
                <ECIKPI icon="visibility" label="Observers" value="812" sub="97.1% deployed" color="#818cf8" delay={0.1} />
                <ECIKPI icon="warning" label="Violations" value="106" sub="34 critical" color="#f87171" delay={0.15} />
                <ECIKPI icon="ballot" label="EVM Issues" value="5" sub="99.97% healthy" color="#fbbf24" delay={0.2} />
                <ECIKPI icon="phone_in_talk" label="cVIGIL" value="24" sub="5 pending" color="#f472b6" delay={0.25} />
            </div>

            {/* ── ROW 1: Events + EVM/VVPAT ── */}
            <div className="grid grid-cols-[1.4fr_1fr] gap-5 mb-5">
                {/* Live Event Feed */}
                <ECICard>
                    <ECISectionHeader title="Live Event Feed" icon="rss_feed"
                        action={
                            <div className="flex items-center gap-2">
                                <span className="text-[8px] font-mono text-red-400 animate-pulse mr-2">● LIVE</span>
                                {["ALL", "EVM", "cVIGIL", "MCC", "Turnout"].map(f => (
                                    <button key={f} onClick={() => setEventFilter(f)}
                                        className={`text-[8px] font-mono px-2 py-0.5 rounded transition-all ${eventFilter === f ? "bg-red-500/15 text-red-400" : "text-white/25 hover:text-white/50"}`}
                                    >{f}</button>
                                ))}
                            </div>
                        }
                    />
                    <div className="divide-y divide-white/[0.03] max-h-[320px] overflow-y-auto">
                        <AnimatePresence>
                            {filteredEvents.map((e, i) => (
                                <motion.div key={e.time + e.event}
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 15 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="px-5 py-3 flex items-start gap-3 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                                >
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: levelColor[e.level] + "12" }}>
                                        <Icon name={e.icon} size={14} style={{ color: levelColor[e.level] }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] text-white/75 leading-relaxed group-hover:text-white/90 transition-colors">{e.event}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[7px] font-mono px-1.5 py-0.5 rounded" style={{ color: levelColor[e.level], background: levelColor[e.level] + "12" }}>{e.level}</span>
                                            <span className="text-[7px] font-mono text-white/20 bg-white/5 px-1.5 py-0.5 rounded">{e.category}</span>
                                            <span className="text-[7px] font-mono text-white/15">{e.time}</span>
                                        </div>
                                    </div>
                                    <button className="opacity-0 group-hover:opacity-100 text-[8px] font-mono text-red-400 px-2 py-1 rounded bg-red-500/10 transition-all shrink-0">ACTION</button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </ECICard>

                {/* EVM / VVPAT Status */}
                <div className="space-y-4">
                    <ECICard delay={0.1}>
                        <ECISectionHeader title="EVM / VVPAT Status" icon="ballot" />
                        <div className="p-4 grid grid-cols-2 gap-3">
                            {evmStatus.map((e, i) => (
                                <motion.div key={e.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.06 }}
                                    className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Icon name={e.icon} size={12} style={{ color: e.color }} />
                                        <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider">{e.label}</span>
                                    </div>
                                    <span className="text-[18px] font-bold text-white/90">{e.value}</span>
                                </motion.div>
                            ))}
                        </div>
                        {/* VVPAT Audit */}
                        <div className="px-4 pb-4">
                            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500/5 to-transparent border border-green-500/10">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[9px] font-mono text-green-400 tracking-wide">VVPAT VERIFICATION</span>
                                    <span className="text-[9px] font-mono text-green-400">{((vvpatStatus.verified / vvpatStatus.total) * 100).toFixed(1)}%</span>
                                </div>
                                <Bar pct={(vvpatStatus.verified / vvpatStatus.total) * 100} color="#4ade80" h={4} />
                                <div className="flex justify-between text-[8px] font-mono text-white/25 mt-1.5">
                                    <span>{vvpatStatus.verified.toLocaleString()} verified</span>
                                    <span className="text-red-400">{vvpatStatus.mismatch} mismatch</span>
                                    <span>{vvpatStatus.pending} pending</span>
                                </div>
                            </div>
                        </div>
                    </ECICard>

                    {/* Observer Deployment */}
                    <ECICard delay={0.15}>
                        <ECISectionHeader title="Observer Deployment" icon="groups" />
                        <div className="p-4 space-y-2.5">
                            {observerDeployment.map((o, i) => (
                                <motion.div key={o.role} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.06 }}
                                    className="flex items-center gap-3">
                                    <span className="text-[10px] text-white/50 w-36 shrink-0">{o.role}</span>
                                    <div className="flex-1"><Bar pct={(o.deployed / o.total) * 100} color={o.color} h={4} /></div>
                                    <span className="text-[10px] font-mono text-white/60 w-16 text-right">{o.deployed}/{o.total}</span>
                                </motion.div>
                            ))}
                        </div>
                    </ECICard>
                </div>
            </div>

            {/* ── ROW 2: cVIGIL + Turnout + Expenditure ── */}
            <div className="grid grid-cols-3 gap-5 mb-5">
                {/* cVIGIL Complaints */}
                <ECICard delay={0.2}>
                    <ECISectionHeader title="cVIGIL Complaints" icon="phone_in_talk"
                        action={<span className="text-[8px] font-mono text-fuchsia-400">{cvigilComplaints.filter(c => c.status === "PENDING").length} pending</span>} />
                    <div className="divide-y divide-white/[0.03] max-h-[260px] overflow-y-auto">
                        {cvigilComplaints.map((c, i) => (
                            <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 + i * 0.05 }}
                                className="px-4 py-3 hover:bg-white/[0.02] cursor-pointer transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[11px] text-white/80 font-medium">{c.type}</span>
                                    <span className="text-[7px] font-mono px-1.5 py-0.5 rounded" style={{ color: cvigilStatusColor[c.status], background: cvigilStatusColor[c.status] + "15" }}>{c.status}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[9px] text-white/30 font-mono">
                                    <span>{c.id}</span>
                                    <span>📍{c.location}</span>
                                    <span>🕐{c.time}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className="text-[8px] bg-white/5 text-white/35 px-1.5 py-0.5 rounded font-mono">📎 {c.media}</span>
                                    {c.gps && <span className="text-[8px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded font-mono">📍 GPS</span>}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </ECICard>

                {/* Hourly Turnout */}
                <ECICard delay={0.25}>
                    <ECISectionHeader title="Hourly Turnout" icon="show_chart" />
                    <div className="p-4">
                        <div className="flex items-end gap-1.5 h-36 mb-2">
                            {hourlyTurnout.map((d, i) => (
                                <div key={d.hour} className="flex-1 flex flex-col items-center gap-0.5">
                                    <span className="text-[7px] font-mono text-white/40">{d.pct}%</span>
                                    <motion.div initial={{ height: 0 }} animate={{ height: `${(d.pct / maxPct) * 100}%` }}
                                        transition={{ duration: 0.7, delay: 0.3 + i * 0.04 }}
                                        className="w-full rounded-t-sm"
                                        style={{ background: d.pct > 60 ? "linear-gradient(to top, #059669, #4ade80)" : d.pct > 40 ? "linear-gradient(to top, #d97706, #fbbf24)" : "linear-gradient(to top, #dc2626, #f87171)" }} />
                                    <span className="text-[6px] font-mono text-white/20">{d.hour}</span>
                                </div>
                            ))}
                        </div>
                        {/* Gender Split */}
                        <div className="border-t border-white/[0.04] pt-3 mt-2 space-y-1.5">
                            <div className="text-[8px] font-mono text-white/25 uppercase tracking-wider mb-1">Gender-wise Turnout</div>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] text-white/40 w-14">Male</span>
                                <div className="flex-1"><Bar pct={65} color="#60a5fa" h={4} /></div>
                                <span className="text-[9px] font-mono text-white/50 w-8">65%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] text-white/40 w-14">Female</span>
                                <div className="flex-1"><Bar pct={61} color="#f472b6" h={4} /></div>
                                <span className="text-[9px] font-mono text-white/50 w-8">61%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] text-white/40 w-14">Other</span>
                                <div className="flex-1"><Bar pct={43} color="#818cf8" h={4} /></div>
                                <span className="text-[9px] font-mono text-white/50 w-8">43%</span>
                            </div>
                        </div>
                    </div>
                </ECICard>

                {/* Expenditure Monitoring */}
                <ECICard delay={0.3}>
                    <ECISectionHeader title="Expenditure Monitor" icon="account_balance"
                        action={<span className="text-[8px] font-mono text-fuchsia-400">{expenditureAlerts.filter(e => e.flag).length} flagged</span>} />
                    <div className="p-4 space-y-3">
                        {expenditureAlerts.map((e, i) => (
                            <motion.div key={e.candidate} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.06 }}
                                className={`p-3 rounded-lg border transition-colors ${e.flag ? "bg-red-500/5 border-red-500/15" : "bg-white/[0.02] border-white/[0.05]"}`}>
                                <div className="flex justify-between items-start mb-1.5">
                                    <div>
                                        <span className="text-[11px] text-white/80 font-medium">{e.candidate}</span>
                                        <p className="text-[9px] text-white/30 font-mono">{e.constituency}</p>
                                    </div>
                                    {e.flag && <span className="text-[7px] font-mono bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded animate-pulse">⚠ NEARING LIMIT</span>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1"><Bar pct={(e.spent / e.limit) * 100} color={e.spent / e.limit > 0.85 ? "#f87171" : e.spent / e.limit > 0.6 ? "#fbbf24" : "#4ade80"} h={4} /></div>
                                    <span className="text-[9px] font-mono text-white/50">₹{e.spent}L / {e.limit}L</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </ECICard>
            </div>

            {/* ── ROW 3: State Table + Observer Diary ── */}
            <div className="grid grid-cols-[1.5fr_1fr] gap-5">
                {/* State Alert Table */}
                <ECICard delay={0.25}>
                    <ECISectionHeader title="State-wise Status" icon="map"
                        action={<button className="text-[8px] font-mono px-2.5 py-1 rounded-md bg-white/5 text-white/40 hover:text-white/60 border border-white/10 transition-all">EXPORT →</button>} />
                    <div>
                        <div className="grid grid-cols-[1fr_65px_70px_55px_120px_80px] gap-2 px-5 py-2.5 border-b border-white/[0.04] text-[8px] font-mono text-white/20 uppercase tracking-[1.5px]">
                            <span>State</span><span>Booths</span><span>Violations</span><span>EVM</span><span>Turnout</span><span>Status</span>
                        </div>
                        {stateAlerts.map((s, i) => (
                            <motion.div key={s.state}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.35 + i * 0.04 }}
                                className="grid grid-cols-[1fr_65px_70px_55px_120px_80px] gap-2 px-5 py-3 border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors cursor-pointer items-center"
                            >
                                <span className="text-[11px] text-white/80 font-medium">{s.state}</span>
                                <span className="text-[10px] text-white/45 font-mono">{s.booths.toLocaleString()}</span>
                                <span className="text-[10px] font-mono" style={{ color: s.violations > 20 ? "#f87171" : "#4ade80" }}>{s.violations}</span>
                                <span className="text-[10px] font-mono" style={{ color: s.evmIssues > 0 ? "#f87171" : "#4ade80" }}>{s.evmIssues}</span>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1"><Bar pct={s.turnout} color={s.turnout > 60 ? "#4ade80" : "#fbbf24"} h={4} /></div>
                                    <span className="text-[9px] text-white/45 font-mono w-7">{s.turnout}%</span>
                                </div>
                                <span className="text-[7px] font-mono px-1.5 py-0.5 rounded text-center" style={{ color: statusColor[s.status], background: statusColor[s.status] + "12" }}>{s.status}</span>
                            </motion.div>
                        ))}
                    </div>
                </ECICard>

                {/* Observer Diary */}
                <ECICard delay={0.3}>
                    <ECISectionHeader title="Observer Diary" icon="edit_note"
                        action={<span className="text-[8px] font-mono text-white/25">{diaryEntries.length} entries today</span>} />
                    <div className="p-4">
                        {/* Quick Add */}
                        <div className="flex gap-2 mb-4">
                            <input value={diaryEntry} onChange={e => setDiaryEntry(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && addDiaryEntry()}
                                placeholder="Quick diary entry..."
                                className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-[11px] text-white/80 placeholder-white/20 focus:border-red-500/30 focus:outline-none transition-colors"
                            />
                            <button onClick={addDiaryEntry}
                                className="px-3 py-2 rounded-lg bg-red-500/12 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-[10px] font-mono shrink-0">
                                <Icon name="add" size={16} />
                            </button>
                        </div>
                        {/* Entries */}
                        <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                            <AnimatePresence>
                                {diaryEntries.map((e, i) => (
                                    <motion.div key={i + e.time}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="relative pl-5 pb-2.5 border-l-2 border-white/[0.06]"
                                    >
                                        <div className="absolute left-[-4px] top-1 w-2 h-2 rounded-full bg-red-400/60 border border-red-400/30" />
                                        <p className="text-[9px] font-mono text-red-400/50 mb-0.5">{e.time}</p>
                                        <p className="text-[11px] text-white/60 leading-relaxed">{e.text}</p>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </ECICard>
            </div>
        </ECIPageLayout>
    );
}
