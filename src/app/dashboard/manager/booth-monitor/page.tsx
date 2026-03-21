"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ManagerPageLayout, { MgrCard, MgrSection, MgrKPI, MgrBar } from "@/components/manager/ManagerPageLayout";
import { useApi } from "@/lib/hooks";
import { useToast } from "@/components/ui/Toast";

function Icon({ name, size = 16, className = "", style }: { name: string; size?: number; className?: string; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size, ...style }}>{name}</span>;
}

const booths = [
    { id: "B-001", name: "Govt. Primary School", ward: "Ward 12", address: "Gali No. 4, Aminabad", voters: 1280, visited: 82, workers: 4, ev: 2, vvpat: 2, ramp: true, water: true, electricity: true, toilet: true, shade: true, status: "ACTIVE", issues: ["1 EVM minor glitch – replaced"], lastUpdate: "14:42" },
    { id: "B-002", name: "Community Hall", ward: "Ward 12", address: "Near Hanuman Mandir", voters: 980, visited: 65, workers: 3, ev: 2, vvpat: 2, ramp: true, water: true, electricity: true, toilet: false, shade: true, status: "ACTIVE", issues: [], lastUpdate: "14:20" },
    { id: "B-003", name: "Govt. Inter College", ward: "Ward 14", address: "Station Road", voters: 1450, visited: 45, workers: 2, ev: 3, vvpat: 3, ramp: false, water: true, electricity: true, toilet: true, shade: false, status: "STALLED", issues: ["Worker shortage", "Ramp not available", "No shade for queue"], lastUpdate: "12:10" },
    { id: "B-004", name: "Panchayat Bhawan", ward: "Ward 14", address: "Chowk Bazaar", voters: 1100, visited: 91, workers: 4, ev: 2, vvpat: 2, ramp: true, water: true, electricity: true, toilet: true, shade: true, status: "ACTIVE", issues: [], lastUpdate: "14:38" },
    { id: "B-005", name: "Municipal Ward Office", ward: "Ward 15", address: "Hussainganj", voters: 1340, visited: 78, workers: 3, ev: 3, vvpat: 3, ramp: true, water: false, electricity: true, toilet: true, shade: true, status: "ACTIVE", issues: ["Water supply disrupted"], lastUpdate: "13:55" },
    { id: "B-006", name: "Anganwadi Centre", ward: "Ward 16", address: "Daliganj", voters: 640, visited: 12, workers: 1, ev: 1, vvpat: 1, ramp: false, water: false, electricity: false, toilet: false, shade: false, status: "OFFLINE", issues: ["Power cut since 8 AM", "No water", "Single worker assigned"], lastUpdate: "09:15" },
];

const statusColor: Record<string, string> = { ACTIVE: "#10b981", STALLED: "#f59e0b", OFFLINE: "#ef4444" };

export default function BoothMonitorPage() {
    const [selectedBooth, setSelectedBooth] = useState<string | null>(null);
    const [filter, setFilter] = useState("ALL");
    const selected = booths.find(b => b.id === selectedBooth);
    const filtered = filter === "ALL" ? booths : booths.filter(b => b.status === filter);
    const { toast } = useToast();

    // ── Live data from backend ──
    const { data: boothStats } = useApi<any>("/api/booths?stats=true", null);

    const handleDispatchWorker = async (boothId: string) => {
        try {
            const res = await fetch("/api/workers/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: `Dispatch to ${boothId}`,
                    description: `Urgent dispatch requested for booth ${boothId}`,
                    priority: "high",
                    booth_id: boothId,
                }),
            });
            if (res.ok) toast(`Worker dispatched to ${boothId}`, "success");
            else toast("Failed to dispatch — try again", "error");
        } catch { toast("Network error", "error"); }
    };

    const handleViewHistory = (boothId: string) => {
        toast(`Loading history for ${boothId}...`, "info");
        // In production, this would navigate to a detail page
    };

    return (
        <ManagerPageLayout title="Booth Monitor" badge="📍 REAL-TIME" badgeColor="#10b981">
            <div className="grid grid-cols-5 gap-3">
                <MgrKPI icon="location_on" label="Total Booths" value={boothStats?.total?.toString() || String(booths.length)} sub="In district" color="#1e293b" delay={0} />
                <MgrKPI icon="check_circle" label="Active" value={boothStats?.active?.toString() || String(booths.filter(b => b.status === "ACTIVE").length)} sub="Operational" color="#10b981" delay={0.05} />
                <MgrKPI icon="pause_circle" label="Stalled" value={String(booths.filter(b => b.status === "STALLED").length)} sub="Need attention" color="#f59e0b" delay={0.1} />
                <MgrKPI icon="error" label="Offline" value={boothStats?.offline?.toString() || String(booths.filter(b => b.status === "OFFLINE").length)} sub="Critical" color="#ef4444" delay={0.15} />
                <MgrKPI icon="accessible" label="PwD Ready" value={String(booths.filter(b => b.ramp).length)} sub={`of ${booths.length} booths`} color="#818cf8" delay={0.2} />
            </div>

            <div className="grid grid-cols-[1fr_380px] gap-5">
                <div className="space-y-3">
                    <MgrCard>
                        <div className="p-3 flex items-center gap-2">
                            <span className="text-[8px] font-mono text-slate-500 tracking-widest mr-1">FILTER:</span>
                            {["ALL", "ACTIVE", "STALLED", "OFFLINE"].map(f => (
                                <button key={f} onClick={() => setFilter(f)}
                                    className={`text-[9px] font-mono px-2.5 py-1 rounded transition-all ${filter === f ? "bg-[#1e293b]/15 text-[#1e293b] border border-[#1e293b]/25" : "text-slate-400 hover:text-slate-500"}`}>{f}</button>
                            ))}
                        </div>
                    </MgrCard>

                    {filtered.map((b, i) => (
                        <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                            className={`bg-white shadow-sm rounded-xl border cursor-pointer transition-all ${selectedBooth === b.id ? "border-[#1e293b]/40 ring-1 ring-[#1e293b]/20" : "border-slate-200 hover:border-slate-200"}`}
                            onClick={() => setSelectedBooth(selectedBooth === b.id ? null : b.id)}>
                            <div className="flex items-stretch">
                                <div className="w-1.5 shrink-0 rounded-l-xl" style={{ background: statusColor[b.status] }} />
                                <div className="flex-1 p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-mono text-[12px] text-[#1e293b] font-bold">{b.id}</span>
                                                <span className="text-[12px] text-slate-500 font-medium">{b.name}</span>
                                            </div>
                                            <div className="flex gap-3 text-[9px] text-slate-500">
                                                <span>📍 {b.ward}</span><span>{b.address}</span><span>🕐 {b.lastUpdate}</span>
                                            </div>
                                        </div>
                                        <span className="text-[7px] font-mono px-1.5 py-0.5 rounded" style={{ color: statusColor[b.status], background: statusColor[b.status] + "12" }}>{b.status}</span>
                                    </div>
                                    <div className="flex gap-4 text-[9px] mt-2">
                                        <span className="text-slate-500">Voters: <span className="text-slate-500 font-mono">{b.voters.toLocaleString()}</span></span>
                                        <span className="text-slate-500">Visited: <span className="text-[#1e293b] font-mono">{b.visited}%</span></span>
                                        <span className="text-slate-500">Workers: <span className="text-slate-500 font-mono">{b.workers}</span></span>
                                        <span className="text-slate-500">EVM: <span className="text-slate-500 font-mono">{b.ev}</span></span>
                                        {b.issues.length > 0 && <span className="text-red-400">⚠ {b.issues.length} issue{b.issues.length > 1 ? "s" : ""}</span>}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Detail Panel */}
                <div className="space-y-4">
                    <AnimatePresence mode="wait">
                        {selected ? (
                            <motion.div key={selected.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                <MgrCard>
                                    <div className="p-5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[20px] font-bold text-[#1e293b]" style={{ background: statusColor[selected.status] + "12", border: `1px solid ${statusColor[selected.status]}25` }}>{selected.id.slice(-3)}</div>
                                            <div>
                                                <h3 className="text-[15px] text-slate-500 font-bold">{selected.name}</h3>
                                                <p className="text-[9px] text-slate-500">{selected.address}, {selected.ward}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            {[
                                                { l: "Voters", v: selected.voters.toLocaleString(), c: "#1e293b" },
                                                { l: "Coverage", v: `${selected.visited}%`, c: selected.visited > 70 ? "#10b981" : "#f59e0b" },
                                                { l: "Workers", v: String(selected.workers), c: selected.workers > 2 ? "#10b981" : "#ef4444" },
                                                { l: "Last Update", v: selected.lastUpdate, c: "#60a5fa" },
                                            ].map(d => (
                                                <div key={d.l} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                                                    <span className="text-[8px] text-slate-400 block">{d.l}</span>
                                                    <span className="text-[16px] font-bold" style={{ color: d.c }}>{d.v}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="text-[8px] font-mono text-slate-400 uppercase tracking-wider mb-2">Infrastructure Checklist</div>
                                        <div className="grid grid-cols-3 gap-1.5 mb-4">
                                            {[
                                                { l: "Ramp", ok: selected.ramp }, { l: "Water", ok: selected.water }, { l: "Power", ok: selected.electricity },
                                                { l: "Toilet", ok: selected.toilet }, { l: "Shade", ok: selected.shade }, { l: "EVM", ok: true },
                                            ].map(f => (
                                                <div key={f.l} className={`text-[9px] px-2 py-1.5 rounded text-center ${f.ok ? "bg-green-500/10 text-green-400 border border-green-500/15" : "bg-red-500/10 text-red-400 border border-red-500/15"}`}>
                                                    {f.ok ? "✓" : "✗"} {f.l}
                                                </div>
                                            ))}
                                        </div>

                                        {selected.issues.length > 0 && (
                                            <div className="mb-4">
                                                <div className="text-[8px] font-mono text-red-400 uppercase tracking-wider mb-2">⚠ Issues ({selected.issues.length})</div>
                                                {selected.issues.map((iss, idx) => (
                                                    <div key={idx} className="text-[10px] text-slate-500 py-1.5 px-3 rounded bg-red-500/5 border border-red-500/10 mb-1">• {iss}</div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <button onClick={() => handleDispatchWorker(selected.id)} className="flex-1 text-[9px] font-mono py-2 rounded-lg bg-[#1e293b]/12 text-[#1e293b] border border-[#1e293b]/25 hover:bg-[#1e293b]/20 transition-all">DISPATCH WORKER</button>
                                            <button onClick={() => handleViewHistory(selected.id)} className="flex-1 text-[9px] font-mono py-2 rounded-lg bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-50 transition-all">VIEW HISTORY</button>
                                        </div>
                                    </div>
                                </MgrCard>
                            </motion.div>
                        ) : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <MgrCard><div className="p-10 text-center"><Icon name="touch_app" size={32} className="text-slate-500 mx-auto mb-2" /><p className="text-[11px] text-slate-400">Select a booth for details</p></div></MgrCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </ManagerPageLayout>
    );
}
