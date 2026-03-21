"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ManagerPageLayout, { MgrCard, MgrSection, MgrKPI, MgrBar } from "@/components/manager/ManagerPageLayout";
import { useApi } from "@/lib/hooks";
import { useToast } from "@/components/ui/Toast";

function Icon({ name, size = 16, className = "", style }: { name: string; size?: number; className?: string; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size, ...style }}>{name}</span>;
}

const boothData = [
    { id: "B-001", ward: "Ward 12", workers: 4, doors: 82, keyVoters: 3, issues: 1, status: "ACTIVE" },
    { id: "B-002", ward: "Ward 12", workers: 3, doors: 65, keyVoters: 2, issues: 0, status: "ACTIVE" },
    { id: "B-003", ward: "Ward 14", workers: 2, doors: 45, keyVoters: 1, issues: 3, status: "STALLED" },
    { id: "B-004", ward: "Ward 14", workers: 4, doors: 91, keyVoters: 5, issues: 0, status: "ACTIVE" },
    { id: "B-005", ward: "Ward 15", workers: 3, doors: 78, keyVoters: 2, issues: 1, status: "ACTIVE" },
    { id: "B-006", ward: "Ward 16", workers: 1, doors: 12, keyVoters: 0, issues: 2, status: "OFFLINE" },
    { id: "B-007", ward: "Ward 16", workers: 4, doors: 88, keyVoters: 4, issues: 0, status: "ACTIVE" },
    { id: "B-008", ward: "Ward 18", workers: 3, doors: 56, keyVoters: 1, issues: 1, status: "ACTIVE" },
    { id: "B-009", ward: "Ward 19", workers: 2, doors: 34, keyVoters: 0, issues: 4, status: "STALLED" },
    { id: "B-010", ward: "Ward 20", workers: 4, doors: 95, keyVoters: 6, issues: 0, status: "ACTIVE" },
];
const workerReports = [
    { time: "14:42", worker: "Rahul Verma", booth: "B-001", note: "3 new beneficiaries identified for PM Kisan", type: "success" },
    { time: "14:28", worker: "Priya Singh", booth: "B-004", note: "B-045 gate locked, revisit scheduled for evening", type: "warning" },
    { time: "14:15", worker: "Amit Kumar", booth: "B-007", note: "Key voter Shri Sharma confirmed support", type: "success" },
    { time: "13:58", worker: "Sita Devi", booth: "B-010", note: "Distributed 45 voter slips in Gali no. 4", type: "info" },
    { time: "13:42", worker: "Vijay Pal", booth: "B-005", note: "Water pipeline complaint noted, forwarded to DC", type: "alert" },
    { time: "13:30", worker: "Neha Gupta", booth: "B-002", note: "Youth meeting at community hall – 40 attendees", type: "success" },
];
const wardData = [
    { name: "Ward 12", coverage: 87, voters: 3200 }, { name: "Ward 14", coverage: 62, voters: 2800 },
    { name: "Ward 15", coverage: 78, voters: 3100 }, { name: "Ward 16", coverage: 55, voters: 2600 },
    { name: "Ward 18", coverage: 71, voters: 2900 }, { name: "Ward 19", coverage: 42, voters: 2400 },
    { name: "Ward 20", coverage: 93, voters: 3400 }, { name: "Ward 22", coverage: 68, voters: 2700 },
];
const statusColor: Record<string, string> = { ACTIVE: "#10b981", STALLED: "#f59e0b", OFFLINE: "#ef4444" };
const typeColor: Record<string, string> = { success: "#10b981", warning: "#f59e0b", alert: "#ef4444", info: "#64748b" };

export default function ManagerDashboard() {
    const [boothFilter, setBoothFilter] = useState("ALL");
    const filteredBooths = boothFilter === "ALL" ? boothData : boothData.filter(b => b.status === boothFilter);
    const { toast } = useToast();

    // ── Live data from backend ──
    const { data: stats, refetch: refetchStats } = useApi<any>("/api/stats", null);
    const { data: grievanceStats, refetch: refetchGrievances } = useApi<any>("/api/grievances?stats=true", null);

    const handleSync = () => {
        refetchStats();
        refetchGrievances();
        toast("Data synchronized from all booths", "success");
    };

    return (
        <ManagerPageLayout title="District Operations Hub" badge="LIVE" badgeColor="#1e293b"
            actions={
                <div className="flex gap-2">
                    <select className="bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-700 font-mono text-[11px] outline-none shadow-sm focus:border-slate-500">
                        <option>All Constituencies</option><option>Lucknow West</option><option>Lucknow East</option>
                    </select>
                    <button onClick={handleSync} className="font-mono text-[10px] font-bold uppercase bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded transition-all shadow-sm">Sync Data</button>
                </div>
            }
        >
            {/* KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <MgrKPI icon="check_circle" label="Mandals" value="8/8" sub="100% — On Track" color="#10b981" delay={0} />
                <MgrKPI icon="location_on" label="Total Booths" value={stats?.totalBooths?.toString() || "312"} sub={`${stats?.totalBooths ? stats.totalBooths - 23 : 289} Active`} color="#0f172a" delay={0.05} />
                <MgrKPI icon="group" label="Workers Active" value={stats?.totalWorkers?.toString() || "847"} sub={`${stats?.totalWorkers || 847}/890 — ${Math.round(((stats?.totalWorkers || 847) / 890) * 100)}%`} color="#475569" delay={0.1} />
                <MgrKPI icon="door_front" label="Doors Today" value={stats?.totalVoters ? `${(stats.totalVoters / 1000).toFixed(1)}K` : "4,200"} sub="↑ 12% vs Yesterday" color="#0f172a" delay={0.15} />
                <MgrKPI icon="pending_actions" label="Pending Tasks" value={grievanceStats?.byStatus?.submitted?.toString() || "14"} sub={`${grievanceStats?.byStatus?.in_progress || 3} In Progress`} color="#f59e0b" delay={0.2} />
            </div>

            {/* Main Grid */}
            <div className="flex flex-col xl:grid xl:grid-cols-[1fr_0.8fr] gap-5">
                {/* Booth Matrix */}
                <MgrCard delay={0.1}>
                    <MgrSection title="Booth Performance Matrix" icon="grid_view" action={
                        <div className="flex gap-1.5">
                            {["ALL", "ACTIVE", "STALLED", "OFFLINE"].map(f => (
                                <button key={f} onClick={() => setBoothFilter(f)}
                                    className={`text-[8px] font-mono px-2 py-0.5 rounded transition-all ${boothFilter === f ? "bg-[#1e293b]/15 text-[#1e293b] border border-[#1e293b]/25" : "text-slate-400 hover:text-slate-500"}`}>{f}</button>
                            ))}
                        </div>
                    } />
                    <div className="overflow-x-auto custom-scrollbar">
                        <div className="min-w-[600px]">
                            <div className="grid grid-cols-[70px_70px_50px_1fr_60px_45px_70px] gap-2 px-4 py-2 border-b border-slate-100 font-mono text-[9px] font-bold uppercase text-slate-400 tracking-wider bg-slate-50/50">
                                <span>Booth</span><span>Ward</span><span>Staff</span><span>Doors</span><span>Key</span><span>Err</span><span>Status</span>
                            </div>
                            {filteredBooths.map((b, i) => (
                                <motion.div key={b.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                                    className={`grid grid-cols-[70px_70px_50px_1fr_60px_45px_70px] gap-2 px-4 py-2.5 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer items-center ${i % 2 ? "bg-slate-50/30" : ""}`}>
                                    <span className="font-mono font-bold text-[11px] text-slate-900">{b.id}</span>
                                    <span className="text-[10px] text-slate-500 font-medium">{b.ward}</span>
                                    <span className="text-[10px] text-slate-600 font-medium">{b.workers}</span>
                                    <div className="flex items-center gap-2"><MgrBar pct={b.doors} h={4} color="#0f172a" /><span className="font-mono font-bold text-[9px] text-slate-500 w-7 text-right">{b.doors}%</span></div>
                                    <div className="flex gap-0.5">{[...Array(Math.min(b.keyVoters, 5))].map((_, j) => <Icon key={j} name="star" size={10} className="text-slate-800" />)}{b.keyVoters === 0 && <span className="text-[9px] text-slate-300">—</span>}</div>
                                    <span className={`font-mono text-[10px] font-bold ${b.issues > 2 ? "text-red-500" : b.issues > 0 ? "text-amber-500" : "text-slate-300"}`}>{b.issues}</span>
                                    <span className="font-mono font-bold text-[8px] uppercase px-1.5 py-0.5 rounded text-center" style={{ color: statusColor[b.status], background: statusColor[b.status] + "15", border: `1px solid ${statusColor[b.status]}30` }}>{b.status}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </MgrCard>

                {/* Right Column */}
                <div className="space-y-5">
                    {/* Heatmap */}
                    <MgrCard delay={0.15}>
                        <MgrSection title="Worker Activity Heatmap" icon="local_fire_department" />
                        <div className="p-4 overflow-x-auto custom-scrollbar">
                            <div className="min-w-[300px]">
                                <div className="flex gap-1">
                                    <div className="w-12 flex flex-col gap-1 text-right pr-2">
                                        {["B-001", "B-004", "B-007", "B-010", "B-005"].map(b => (
                                            <div key={b} className="h-5 flex items-center justify-end font-mono text-[9px] font-bold text-slate-500">{b}</div>
                                        ))}
                                    </div>
                                    <div className="flex-1 grid grid-cols-12 gap-1">
                                        {["8", "9", "10", "11", "12", "1", "2", "3", "4", "5", "6", "7"].map(h => (
                                            <div key={h} className="text-center font-mono text-[8px] font-bold text-slate-400 mb-1">{h}</div>
                                        ))}
                                        {[[.2, .4, .7, .9, 1, .8, .9, 1, .7, .5, .3, .1], [.3, .6, .8, 1, .9, .8, 1, .9, .8, .6, .4, .2], [.2, .5, .7, .8, .9, .7, .8, .9, .7, .5, .3, .1], [.4, .7, .9, 1, 1, .9, 1, 1, .9, .7, .5, .3], [.1, .3, .5, .7, .6, .5, .6, .7, .6, .4, .2, .1]].map((row, ri) =>
                                            row.map((v, ci) => <div key={`${ri}-${ci}`} className="h-5 rounded-sm" style={{ background: `rgba(15,23,42,${v * 0.85})` }} />)
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-1 mt-2">
                                    <span className="font-mono text-[8px] font-bold text-slate-400">Low</span>
                                    {[.1, .3, .5, .7, .9].map(v => <div key={v} className="w-4 h-2.5 rounded-sm" style={{ background: `rgba(15,23,42,${v * 0.85})` }} />)}
                                    <span className="font-mono text-[8px] font-bold text-slate-400">High</span>
                                </div>
                            </div>
                        </div>
                    </MgrCard>

                    {/* Target Progress */}
                    <MgrCard delay={0.2}>
                        <MgrSection title="Today's Targets" icon="emoji_events" />
                        <div className="p-4 space-y-4">
                            {[
                                { label: "Doors Knocked", value: "4,200", target: "6,000", pct: 70, color: "#1e293b" },
                                { label: "Voter Slips Verified", value: "2,890", target: "3,500", pct: 83, color: "#10b981" },
                                { label: "Issues Resolved", value: "32", target: "38", pct: 84, color: "#f59e0b" },
                                { label: "Scheme Enrollments", value: "156", target: "200", pct: 78, color: "#6366f1" },
                            ].map(item => (
                                <div key={item.label}>
                                    <div className="flex justify-between mb-1.5">
                                        <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                                        <span className="font-mono text-[10px] font-bold text-slate-900">{item.value} <span className="text-slate-400">/ {item.target}</span></span>
                                    </div>
                                    <MgrBar pct={item.pct} color={item.color} h={5} />
                                </div>
                            ))}
                        </div>
                    </MgrCard>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-5">
                {/* Ward Coverage */}
                <MgrCard delay={0.25}>
                    <MgrSection title="Ward-wise Coverage" icon="radar" />
                    <div className="p-4 space-y-2">
                        {wardData.map((w, i) => (
                            <motion.div key={w.name} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.03 }}
                                className="flex items-center gap-3">
                                <span className="w-16 text-[11px] font-bold text-slate-600 text-right font-mono">{w.name}</span>
                                <div className="flex-1"><MgrBar pct={w.coverage} color={w.coverage > 80 ? "#10b981" : w.coverage > 60 ? "#0f172a" : "#f59e0b"} h={6} /></div>
                                <span className={`font-mono font-bold text-[10px] w-8 text-right ${w.coverage > 80 ? "text-emerald-600" : w.coverage > 60 ? "text-slate-800" : "text-amber-500"}`}>{w.coverage}%</span>
                                <span className="font-mono font-bold text-[9px] text-slate-400 w-12 text-right">{(w.voters / 1000).toFixed(1)}K</span>
                            </motion.div>
                        ))}
                    </div>
                </MgrCard>

                {/* Live Worker Feed */}
                <MgrCard delay={0.3}>
                    <MgrSection title="Live Field Reports" icon="description" action={
                        <span className="flex items-center gap-1.5 text-[9px] font-bold font-mono text-emerald-600"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> LIVE</span>
                    } />
                    <div className="divide-y divide-slate-100">
                        {workerReports.map((r, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.04 }}
                                className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: typeColor[r.type] }} />
                                    <span className="font-mono font-bold text-[10px] text-slate-400">[{r.time}]</span>
                                    <span className="text-[12px] text-slate-900 font-bold">{r.worker}</span>
                                    <span className="font-mono font-bold text-[9px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{r.booth}</span>
                                </div>
                                <p className="text-[11px] text-slate-600 font-medium pl-6">{r.note}</p>
                            </motion.div>
                        ))}
                    </div>
                </MgrCard>
            </div>
        </ManagerPageLayout>
    );
}
