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

const hourlyData = [
    { hour: "7:00", pct: 3, male: 3.2, female: 2.8, urban: 2.5, rural: 3.5, voters: 18420 },
    { hour: "8:00", pct: 8, male: 8.5, female: 7.4, urban: 7.2, rural: 8.8, voters: 49200 },
    { hour: "9:00", pct: 16, male: 17.1, female: 14.8, urban: 14.5, rural: 17.5, voters: 98400 },
    { hour: "10:00", pct: 26, male: 27.8, female: 24.1, urban: 23.8, rural: 28.2, voters: 159800 },
    { hour: "11:00", pct: 35, male: 37.2, female: 32.6, urban: 32.1, rural: 37.9, voters: 215250 },
    { hour: "12:00", pct: 42, male: 44.1, female: 39.8, urban: 38.5, rural: 45.5, voters: 258300 },
    { hour: "1:00", pct: 47, male: 49.3, female: 44.5, urban: 43.2, rural: 50.8, voters: 289050 },
    { hour: "2:00", pct: 53, male: 55.8, female: 50.1, urban: 48.9, rural: 57.1, voters: 325950 },
    { hour: "3:00", pct: 58, male: 60.9, female: 54.9, urban: 53.5, rural: 62.5, voters: 356700 },
    { hour: "4:00", pct: 63, male: 66.2, female: 59.6, urban: 58.1, rural: 67.9, voters: 387450 },
    { hour: "5:00", pct: 67, male: 70.3, female: 63.5, urban: 61.8, rural: 72.2, voters: 412050 },
];

const stateWise = [
    { state: "Uttar Pradesh", turnout: 62.4, male: 66.1, female: 58.5, total: 14800000, voted: 9235200, status: "ON TRACK", booths: 1240, evmIssues: 3 },
    { state: "Maharashtra", turnout: 58.1, male: 61.3, female: 54.7, total: 8900000, voted: 5170900, status: "BELOW AVG", booths: 890, evmIssues: 0 },
    { state: "West Bengal", turnout: 71.3, male: 73.8, female: 68.7, total: 6700000, voted: 4777100, status: "ABOVE AVG", booths: 670, evmIssues: 0 },
    { state: "Tamil Nadu", turnout: 68.9, male: 70.2, female: 67.5, total: 5900000, voted: 4065100, status: "ON TRACK", booths: 590, evmIssues: 1 },
    { state: "Bihar", turnout: 55.2, male: 60.1, female: 49.8, total: 7200000, voted: 3974400, status: "CRITICAL", booths: 720, evmIssues: 2 },
    { state: "Rajasthan", turnout: 51.8, male: 56.4, female: 46.9, total: 4600000, voted: 2382800, status: "CRITICAL", booths: 460, evmIssues: 1 },
    { state: "Karnataka", turnout: 64.1, male: 67.3, female: 60.7, total: 5100000, voted: 3269100, status: "ON TRACK", booths: 510, evmIssues: 0 },
    { state: "Delhi", turnout: 54.3, male: 58.2, female: 50.1, total: 1420000, voted: 771060, status: "BELOW AVG", booths: 142, evmIssues: 0 },
];

const boothLevel = [
    { id: "BTH-142", area: "Ward 12, Lucknow", voters: 1420, cast: 892, turnout: 62.8, queue: 12, status: "NORMAL" },
    { id: "BTH-087", area: "Ward 8, Lucknow", voters: 985, cast: 734, turnout: 74.5, queue: 28, status: "HIGH TRAFFIC" },
    { id: "BTH-211", area: "Ward 15, Kanpur", voters: 1100, cast: 561, turnout: 51.0, queue: 3, status: "LOW TURNOUT" },
    { id: "BTH-056", area: "Ward 3, Varanasi", voters: 1380, cast: 876, turnout: 63.5, queue: 8, status: "NORMAL" },
    { id: "BTH-163", area: "Ward 9, Agra", voters: 920, cast: 690, turnout: 75.0, queue: 19, status: "NORMAL" },
    { id: "BTH-094", area: "Ward 6, Prayagraj", voters: 1250, cast: 500, turnout: 40.0, queue: 0, status: "CRITICAL" },
    { id: "BTH-128", area: "Ward 11, Meerut", voters: 1080, cast: 756, turnout: 70.0, queue: 15, status: "NORMAL" },
    { id: "BTH-072", area: "Ward 4, Gorakhpur", voters: 1300, cast: 598, turnout: 46.0, queue: 35, status: "QUEUE BUILDUP" },
];

const specialVoters = [
    { category: "Persons with Disability (PwD)", registered: 48230, voted: 28938, turnout: 60.0, icon: "accessible", color: "#818cf8" },
    { category: "Senior Citizens (80+)", registered: 62140, voted: 39768, turnout: 64.0, icon: "elderly", color: "#f472b6" },
    { category: "First-time Voters (18-19)", registered: 185400, voted: 142458, turnout: 76.8, icon: "school", color: "#10b981" },
    { category: "Service Voters", registered: 12680, voted: 9764, turnout: 77.0, icon: "military_tech", color: "#f59e0b" },
    { category: "NRI Voters", registered: 3420, voted: 1539, turnout: 45.0, icon: "flight", color: "#60a5fa" },
    { category: "Third Gender", registered: 890, voted: 383, turnout: 43.0, icon: "diversity_3", color: "#ef4444" },
];

const statusColors: Record<string, string> = { "ON TRACK": "#10b981", "ABOVE AVG": "#60a5fa", "BELOW AVG": "#f59e0b", CRITICAL: "#ef4444" };
const boothStatusColor: Record<string, string> = { NORMAL: "#10b981", "HIGH TRAFFIC": "#f59e0b", "LOW TURNOUT": "#ef4444", CRITICAL: "#ef4444", "QUEUE BUILDUP": "#f59e0b" };

export default function TurnoutMonitorPage() {
    const [selectedState, setSelectedState] = useState("Uttar Pradesh");
    const [chartMode, setChartMode] = useState<"overall" | "gender" | "area">("overall");
    const [tab, setTab] = useState<"states" | "booths" | "demographics">("states");
    const maxPct = Math.max(...hourlyData.map(h => h.pct));

    return (
        <ECIPageLayout title="Voter Turnout Monitor" badge="⏱ LIVE TRACKING" badgeColor="#10b981"
            actions={
                <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">POLLING OPEN</span>
                    <span className="text-[9px] font-mono text-slate-500">Closes: 6:00 PM IST</span>
                </div>
            }
        >
            <div className="grid grid-cols-5 gap-3 mb-6">
                <ECIKPI icon="people" label="Total Eligible" value="6.15 Cr" sub="543 constituencies" color="#60a5fa" delay={0} />
                <ECIKPI icon="how_to_vote" label="Votes Cast" value="3.87 Cr" sub="62.9% turnout" color="#10b981" delay={0.06} />
                <ECIKPI icon="male" label="Male Turnout" value="65.2%" sub="↑ 2.3% gap" color="#60a5fa" delay={0.12} />
                <ECIKPI icon="female" label="Female Turnout" value="59.6%" sub="↑ 4.1% vs 2024" color="#f472b6" delay={0.18} />
                <ECIKPI icon="speed" label="Voting Rate" value="48K/hr" sub="↑ 12% vs last" color="#f59e0b" delay={0.24} />
            </div>

            <div className="grid grid-cols-[1fr_360px] gap-5 mb-5">
                {/* Main Chart */}
                <ECICard>
                    <ECISectionHeader title="Hourly Turnout Progression" icon="show_chart"
                        action={
                            <div className="flex gap-1">
                                {(["overall", "gender", "area"] as const).map(m => (
                                    <button key={m} onClick={() => setChartMode(m)}
                                        className={`text-[8px] font-mono px-2.5 py-1 rounded transition-all capitalize ${chartMode === m ? "bg-red-500/15 text-red-400" : "text-slate-400 hover:text-slate-500"}`}
                                    >{m}</button>
                                ))}
                            </div>
                        }
                    />
                    <div className="p-5">
                        <div className="flex items-end gap-2 h-52">
                            {hourlyData.map((d, i) => (
                                <div key={d.hour} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-[8px] font-mono text-slate-500 font-medium">{d.pct}%</span>
                                    {chartMode === "overall" && (
                                        <motion.div key="overall" initial={{ height: 0 }} animate={{ height: `${(d.pct / maxPct) * 100}%` }}
                                            transition={{ duration: 0.7, delay: i * 0.05 }}
                                            className="w-full rounded-t-md group relative cursor-crosshair"
                                            style={{ background: d.pct > 60 ? "linear-gradient(to top, #059669, #10b981)" : d.pct > 40 ? "linear-gradient(to top, #d97706, #f59e0b)" : "linear-gradient(to top, #dc2626, #ef4444)" }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a1f2e] px-2 py-1 rounded text-[7px] font-mono text-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-slate-200 z-10">
                                                {d.voters.toLocaleString()} votes
                                            </div>
                                        </motion.div>
                                    )}
                                    {chartMode === "gender" && (
                                        <div className="w-full flex gap-[1px] items-end h-full">
                                            <motion.div initial={{ height: 0 }} animate={{ height: `${(d.male / 75) * 100}%` }}
                                                transition={{ duration: 0.7, delay: i * 0.05 }}
                                                className="flex-1 rounded-t-sm bg-blue-400/80" />
                                            <motion.div initial={{ height: 0 }} animate={{ height: `${(d.female / 75) * 100}%` }}
                                                transition={{ duration: 0.7, delay: i * 0.05 + 0.1 }}
                                                className="flex-1 rounded-t-sm bg-pink-400/80" />
                                        </div>
                                    )}
                                    {chartMode === "area" && (
                                        <div className="w-full flex gap-[1px] items-end h-full">
                                            <motion.div initial={{ height: 0 }} animate={{ height: `${(d.urban / 75) * 100}%` }}
                                                transition={{ duration: 0.7, delay: i * 0.05 }}
                                                className="flex-1 rounded-t-sm bg-cyan-400/80" />
                                            <motion.div initial={{ height: 0 }} animate={{ height: `${(d.rural / 75) * 100}%` }}
                                                transition={{ duration: 0.7, delay: i * 0.05 + 0.1 }}
                                                className="flex-1 rounded-t-sm bg-amber-400/80" />
                                        </div>
                                    )}
                                    <span className="text-[7px] font-mono text-slate-400">{d.hour}</span>
                                </div>
                            ))}
                        </div>
                        {/* Legend */}
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-200">
                            {chartMode === "gender" && <>
                                <div className="flex items-center gap-1.5"><div className="w-3 h-2 bg-blue-400 rounded-sm" /><span className="text-[9px] text-slate-500">Male</span></div>
                                <div className="flex items-center gap-1.5"><div className="w-3 h-2 bg-pink-400 rounded-sm" /><span className="text-[9px] text-slate-500">Female</span></div>
                            </>}
                            {chartMode === "area" && <>
                                <div className="flex items-center gap-1.5"><div className="w-3 h-2 bg-cyan-400 rounded-sm" /><span className="text-[9px] text-slate-500">Urban</span></div>
                                <div className="flex items-center gap-1.5"><div className="w-3 h-2 bg-amber-400 rounded-sm" /><span className="text-[9px] text-slate-500">Rural</span></div>
                            </>}
                            <div className="flex-1" />
                            <span className="text-[8px] font-mono text-slate-400">Target: 67% by close · Previous: 65.8%</span>
                        </div>
                    </div>
                </ECICard>

                {/* Right Summary */}
                <div className="space-y-4">
                    <ECICard delay={0.15}>
                        <ECISectionHeader title="Urban vs Rural" icon="location_city" />
                        <div className="p-4 space-y-4">
                            {[
                                { label: "Urban Turnout", pct: 61.8, voters: "1.52 Cr", color: "#60a5fa", icon: "apartment" },
                                { label: "Rural Turnout", pct: 72.2, voters: "2.35 Cr", color: "#10b981", icon: "grass" },
                            ].map((d, i) => (
                                <motion.div key={d.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <div className="flex items-center gap-1.5"><Icon name={d.icon} size={14} style={{ color: d.color }} /><span className="text-[11px] text-slate-600">{d.label}</span></div>
                                        <span className="text-[14px] font-bold" style={{ color: d.color }}>{d.pct}%</span>
                                    </div>
                                    <Bar pct={d.pct} color={d.color} h={6} />
                                    <span className="text-[9px] font-mono text-slate-400 mt-1 block">{d.voters} votes cast</span>
                                </motion.div>
                            ))}
                        </div>
                    </ECICard>

                    <ECICard delay={0.2}>
                        <ECISectionHeader title="Historical Comparison" icon="history" />
                        <div className="p-4 space-y-3">
                            {[
                                { label: "Current 2026", pct: 62.9, color: "#ef4444", active: true },
                                { label: "2024 General", pct: 65.8, color: "#60a5fa" },
                                { label: "2019 General", pct: 67.4, color: "#818cf8" },
                                { label: "2014 General", pct: 66.4, color: "#6b7280" },
                            ].map((c, i) => (
                                <div key={c.label} className="space-y-1">
                                    <div className="flex justify-between text-[10px]">
                                        <span className={c.active ? "text-slate-700 font-medium" : "text-slate-500"}>{c.label}</span>
                                        <span className="font-mono font-medium" style={{ color: c.color }}>{c.pct}%</span>
                                    </div>
                                    <Bar pct={c.pct} color={c.color} h={c.active ? 6 : 4} />
                                </div>
                            ))}
                        </div>
                    </ECICard>

                    <ECICard delay={0.25}>
                        <ECISectionHeader title="Live Alerts" icon="notifications_active" />
                        <div className="p-3 space-y-2">
                            {[
                                { msg: "Bihar turnout below 55%", level: "HIGH", time: "4:42 PM" },
                                { msg: "Rajasthan Jaipur-South EVM issue", level: "CRITICAL", time: "4:38 PM" },
                                { msg: "Delhi urban queue buildup", level: "MEDIUM", time: "4:21 PM" },
                            ].map((a, i) => (
                                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.06 }}
                                    className="p-2.5 rounded-lg bg-white/[0.02] border border-slate-200">
                                    <div className="flex justify-between mb-0.5">
                                        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{
                                            color: a.level === "CRITICAL" ? "#ef4444" : a.level === "HIGH" ? "#f59e0b" : "#60a5fa",
                                            background: (a.level === "CRITICAL" ? "#ef4444" : a.level === "HIGH" ? "#f59e0b" : "#60a5fa") + "12",
                                        }}>{a.level}</span>
                                        <span className="text-[7px] font-mono text-slate-500">{a.time}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-600">{a.msg}</p>
                                </motion.div>
                            ))}
                        </div>
                    </ECICard>
                </div>
            </div>

            {/* ── Tab Switcher: States / Booths / Demographics ── */}
            <div className="flex gap-2 mb-4">
                {(["states", "booths", "demographics"] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`text-[10px] font-mono px-4 py-2 rounded-lg transition-all capitalize flex items-center gap-1.5 ${tab === t ? "bg-red-500/15 text-red-400 border border-red-500/25" : "text-slate-500 border border-slate-200 hover:text-slate-600"}`}
                    >
                        <Icon name={t === "states" ? "map" : t === "booths" ? "location_on" : "groups"} size={14} />
                        {t === "demographics" ? "Special Voters" : t}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {tab === "states" && (
                    <motion.div key="states" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <ECICard>
                            <div>
                                <div className="grid grid-cols-[1fr_65px_65px_65px_90px_85px_70px_80px] gap-2 px-5 py-2.5 border-b border-slate-200 text-[8px] font-mono text-slate-400 uppercase tracking-[1.5px]">
                                    <span>State</span><span>Turnout</span><span>Male</span><span>Female</span><span>Votes Cast</span><span>Eligible</span><span>EVM</span><span>Status</span>
                                </div>
                                {stateWise.map((s, i) => (
                                    <motion.div key={s.state} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                                        onClick={() => setSelectedState(s.state)}
                                        className={`grid grid-cols-[1fr_65px_65px_65px_90px_85px_70px_80px] gap-2 px-5 py-3 border-b border-slate-200 cursor-pointer transition-all duration-200 items-center ${selectedState === s.state ? "bg-red-500/5" : "hover:bg-white/[0.015]"}`}
                                    >
                                        <span className="text-[11px] text-slate-700 font-medium">{s.state}</span>
                                        <div className="flex items-center gap-1">
                                            <div className="w-8"><Bar pct={s.turnout} color={statusColors[s.status]} h={3} /></div>
                                            <span className="text-[10px] font-mono text-slate-600">{s.turnout}%</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-blue-400/60">{s.male}%</span>
                                        <span className="text-[10px] font-mono text-pink-400/60">{s.female}%</span>
                                        <span className="text-[10px] text-slate-500 font-mono">{(s.voted / 1000000).toFixed(1)}M</span>
                                        <span className="text-[10px] text-slate-500 font-mono">{(s.total / 1000000).toFixed(1)}M</span>
                                        <span className="text-[10px] font-mono" style={{ color: s.evmIssues > 0 ? "#ef4444" : "#10b981" }}>{s.evmIssues} issues</span>
                                        <span className="text-[7px] font-mono px-1.5 py-0.5 rounded text-center" style={{ color: statusColors[s.status], background: statusColors[s.status] + "12" }}>{s.status}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </ECICard>
                    </motion.div>
                )}

                {tab === "booths" && (
                    <motion.div key="booths" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <ECICard>
                            <ECISectionHeader title="Booth-Level Monitoring" icon="location_on"
                                action={<span className="text-[8px] font-mono text-slate-400">{boothLevel.length} booths in selected area</span>}
                            />
                            <div className="grid grid-cols-2 gap-3 p-4">
                                {boothLevel.map((b, i) => (
                                    <motion.div key={b.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                                        className={`p-4 rounded-lg border transition-all hover:scale-[1.01] cursor-pointer ${b.status === "CRITICAL" || b.status === "LOW TURNOUT" ? "bg-red-500/5 border-red-500/15" : b.status === "QUEUE BUILDUP" || b.status === "HIGH TRAFFIC" ? "bg-yellow-500/5 border-yellow-500/10" : "bg-white/[0.02] border-slate-200"}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="text-[12px] text-slate-500 font-semibold">{b.id}</span>
                                                <p className="text-[9px] text-slate-500 font-mono">{b.area}</p>
                                            </div>
                                            <span className="text-[7px] font-mono px-1.5 py-0.5 rounded" style={{ color: boothStatusColor[b.status], background: boothStatusColor[b.status] + "15" }}>{b.status}</span>
                                        </div>
                                        <div className="space-y-1.5 mb-2">
                                            <div className="flex justify-between text-[9px]">
                                                <span className="text-slate-500">Turnout</span>
                                                <span className="text-slate-600 font-mono font-medium">{b.turnout}%</span>
                                            </div>
                                            <Bar pct={b.turnout} color={b.turnout > 60 ? "#10b981" : b.turnout > 45 ? "#f59e0b" : "#ef4444"} h={5} />
                                        </div>
                                        <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                                            <span>{b.cast}/{b.voters} voted</span>
                                            <span className={b.queue > 20 ? "text-yellow-400" : "text-slate-500"}>🧍 Queue: {b.queue}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </ECICard>
                    </motion.div>
                )}

                {tab === "demographics" && (
                    <motion.div key="demo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <ECICard>
                            <ECISectionHeader title="Special Category Voter Turnout" icon="diversity_3"
                                action={<span className="text-[8px] font-mono text-slate-400">As per ECI Form 17C</span>}
                            />
                            <div className="grid grid-cols-3 gap-4 p-5">
                                {specialVoters.map((v, i) => (
                                    <motion.div key={v.category} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                                        className="p-4 rounded-xl bg-white/[0.02] border border-slate-200 hover:border-slate-200 transition-all group"
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: v.color + "12", border: `1px solid ${v.color}20` }}>
                                                <Icon name={v.icon} size={18} style={{ color: v.color }} />
                                            </div>
                                            <span className="text-[11px] text-slate-600 font-medium leading-tight">{v.category}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-[28px] font-bold text-slate-500">{v.turnout}%</span>
                                        </div>
                                        <Bar pct={v.turnout} color={v.color} h={5} />
                                        <div className="flex justify-between text-[8px] font-mono text-slate-400 mt-2">
                                            <span>{v.voted.toLocaleString()} voted</span>
                                            <span>{v.registered.toLocaleString()} regd.</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </ECICard>
                    </motion.div>
                )}
            </AnimatePresence>
        </ECIPageLayout>
    );
}
