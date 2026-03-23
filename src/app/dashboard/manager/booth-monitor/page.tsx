"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ManagerPageLayout, { MgrCard, MgrSection, MgrKPI, MgrBar } from "@/components/features/manager/ManagerPageLayout";
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
                    title: `Tactical Deployment: ${boothId}`,
                    description: `Urgent mobilization requested for booth ${boothId} to address field reports.`,
                    priority: "high",
                    booth_id: boothId,
                }),
            });
            if (res.ok) toast(`Personnel dispatched to ${boothId}`, "success");
            else toast("Dispatch sequence failed — retry required", "error");
        } catch { toast("Communication link error", "error"); }
    };

    const handleViewHistory = (boothId: string) => {
        toast(`Accessing historical logs for ${boothId}...`, "info");
    };

    return (
        <ManagerPageLayout title="Booth Monitoring Matrix" badge="LIVE SENSORS" badgeColor="#10b981">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                <MgrKPI icon="hub" label="Total Assets" value={boothStats?.total?.toString() || String(booths.length)} sub="District Coverage" color="#1e293b" delay={0.1} />
                <MgrKPI icon="check_circle" label="Operational" value={boothStats?.active?.toString() || String(booths.filter(b => b.status === "ACTIVE").length)} sub="Standard Status" color="#10b981" delay={0.15} />
                <MgrKPI icon="pause_circle" label="Stalled" value={String(booths.filter(b => b.status === "STALLED").length)} sub="Intervention Needed" color="#f59e0b" delay={0.2} />
                <MgrKPI icon="error" label="Critical" value={boothStats?.offline?.toString() || String(booths.filter(b => b.status === "OFFLINE").length)} sub="Immediate Action" color="#ef4444" delay={0.25} />
                <MgrKPI icon="accessible" label="Accessibility" value={String(booths.filter(b => b.ramp).length)} sub={`of ${booths.length} Validated`} color="#6366f1" delay={0.3} />
            </div>

            <div className="flex flex-col xl:grid xl:grid-cols-[1fr_420px] gap-8">
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-2 bg-stone-100/50 p-1.5 rounded-2xl border border-stone-200 shadow-sm backdrop-blur-sm">
                            {["ALL", "ACTIVE", "STALLED", "OFFLINE"].map(f => (
                                <button key={f} onClick={() => setFilter(f)}
                                    className={`text-[10px] font-black px-5 py-2 rounded-xl transition-all tracking-widest ${filter === f ? "bg-white text-stone-900 shadow-sm border border-stone-100" : "text-stone-400 hover:text-stone-600 uppercase"}`}>{f}</button>
                            ))}
                        </div>
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Showing {filtered.length} Locations</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {filtered.map((b, i) => (
                            <motion.div 
                                key={b.id} 
                                initial={{ opacity: 0, scale: 0.95 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                transition={{ delay: 0.1 + i * 0.05 }}
                                className={`group bg-white rounded-[2.5rem] border-2 cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-1 ${selectedBooth === b.id ? "border-stone-900 ring-4 ring-stone-900/5 bg-stone-50/50" : "border-stone-100"}`}
                                onClick={() => setSelectedBooth(selectedBooth === b.id ? null : b.id)}
                            >
                                <div className="p-7">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-3">
                                                <span className="font-black text-[20px] text-stone-900 tracking-tight leading-none">{b.id}</span>
                                                <div className="size-2.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.1)]" style={{ backgroundColor: statusColor[b.status] }} />
                                            </div>
                                            <h4 className="text-[14px] font-bold text-stone-500 truncate max-w-[180px]">{b.name}</h4>
                                        </div>
                                        <span className="text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm" style={{ color: statusColor[b.status], background: `white`, border: `1px solid ${statusColor[b.status]}30` }}>{b.status}</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-6 mb-8">
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest">Saturation</p>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1"><MgrBar pct={b.visited} h={10} color="#1c1917" /></div>
                                                <span className="text-[12px] font-black text-stone-900">{b.visited}%</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest">Reports</p>
                                            <div className="flex items-center gap-2">
                                                <Icon name="history" size={16} className="text-stone-300" />
                                                <span className="text-[12px] font-black text-stone-900 uppercase tracking-tight">{b.lastUpdate} IST</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-stone-50">
                                        <div className="flex -space-x-3">
                                            {[...Array(Math.min(b.workers, 4))].map((_, idx) => (
                                                <div key={idx} className="size-8 rounded-full bg-stone-100 border-4 border-white flex items-center justify-center text-[10px] font-black text-stone-500 shadow-sm">
                                                    W
                                                </div>
                                            ))}
                                            {b.workers > 4 && <div className="size-8 rounded-full bg-stone-900 border-4 border-white flex items-center justify-center text-[10px] font-black text-white shadow-sm">+{b.workers - 4}</div>}
                                        </div>
                                        <div className="flex gap-2.5">
                                            {b.issues.length > 0 && (
                                                <div className="size-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center animate-bounce shadow-sm">
                                                    <Icon name="warning" size={16} />
                                                </div>
                                            )}
                                            <div className="size-8 rounded-xl bg-stone-50 text-stone-400 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all shadow-sm">
                                                <Icon name="chevron_right" size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Tactical Detail Panel */}
                <div className="sticky top-24 h-fit">
                    <AnimatePresence mode="wait">
                        {selected ? (
                            <motion.div 
                                key={selected.id} 
                                initial={{ opacity: 0, x: 40, filter: "blur(10px)" }} 
                                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} 
                                exit={{ opacity: 0, x: 40, filter: "blur(10px)" }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <MgrCard>
                                    <div className="p-10 space-y-10">
                                        <div className="flex items-center gap-6">
                                            <div className="size-24 rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-white shadow-2xl rotate-3 shrink-0" style={{ background: `linear-gradient(135deg, #1c1917, ${statusColor[selected.status]})` }}>
                                                {selected.id.slice(-2)}
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-black text-stone-900 tracking-tight leading-tight">{selected.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl bg-stone-900 text-white shadow-sm">{selected.id}</span>
                                                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">{selected.ward}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { label: "Voter Volume", val: selected.voters.toLocaleString(), icon: "groups", color: "#1c1917" },
                                                { label: "Target Coverage", val: `${selected.visited}%`, icon: "my_location", color: selected.visited > 70 ? "#10b981" : "#f59e0b" },
                                                { label: "Field Agents", val: String(selected.workers), icon: "person", color: selected.workers > 2 ? "#6366f1" : "#ef4444" },
                                                { label: "Last Sync", val: selected.lastUpdate, icon: "sync", color: "#78716c" },
                                            ].map(d => (
                                                <div key={d.label} className="p-6 rounded-[2rem] bg-stone-50/50 border border-stone-100 hover:border-stone-200 transition-all hover:-translate-y-1 group">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest leading-none">{d.label}</span>
                                                        <Icon name={d.icon} size={16} className="text-stone-200 group-hover:text-stone-900 transition-colors" />
                                                    </div>
                                                    <span className="text-[22px] font-black tracking-tight" style={{ color: d.color }}>{d.val}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-5">
                                            <p className="text-[11px] font-black text-stone-400 uppercase tracking-widest">Infrastructure Integrity</p>
                                            <div className="grid grid-cols-3 gap-3">
                                                {[
                                                    { l: "RAMP", ok: selected.ramp }, { l: "WATER", ok: selected.water }, { l: "POWER", ok: selected.electricity },
                                                    { l: "TOILET", ok: selected.toilet }, { l: "SHADE", ok: selected.shade }, { l: "EVM LINK", ok: true },
                                                ].map(f => (
                                                    <div key={f.l} className={`p-4 rounded-3xl flex flex-col items-center gap-2 border transition-all shadow-sm ${f.ok ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-red-50 border-red-100 text-red-600"}`}>
                                                        <Icon name={f.ok ? "check_circle" : "cancel"} size={18} />
                                                        <span className="text-[10px] font-black tracking-widest">{f.l}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {selected.issues.length > 0 && (
                                            <div className="space-y-4">
                                                <p className="text-[11px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Icon name="report" size={16} /> Active Alerts ({selected.issues.length})
                                                </p>
                                                <div className="space-y-2.5">
                                                    {selected.issues.map((iss, idx) => (
                                                        <motion.div 
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            key={idx} 
                                                            className="text-[12px] text-red-700 font-bold py-4 px-6 rounded-[1.5rem] bg-red-50 border border-red-100 shadow-sm"
                                                        >
                                                            {iss}
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-4 pt-6">
                                            <button 
                                                onClick={() => handleDispatchWorker(selected.id)} 
                                                className="w-full py-6 rounded-[2rem] bg-stone-900 text-white font-black text-[13px] uppercase tracking-[0.25em] shadow-2xl shadow-stone-200 hover:bg-stone-800 transition-all active:scale-95 flex items-center justify-center gap-3"
                                            >
                                                <Icon name="send" size={18} />
                                                Activate Deployment
                                            </button>
                                            <button 
                                                onClick={() => handleViewHistory(selected.id)} 
                                                className="w-full py-5 rounded-[2.5rem] bg-white text-stone-500 border-2 border-stone-100 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-stone-50 transition-all active:scale-95"
                                            >
                                                View Historical Logs
                                            </button>
                                        </div>
                                    </div>
                                </MgrCard>
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col"
                            >
                                <MgrCard>
                                    <div className="p-32 text-center space-y-6">
                                        <div className="size-24 rounded-[3rem] bg-stone-50 flex items-center justify-center mx-auto shadow-inner border border-stone-100/50">
                                            <Icon name="near_me" size={48} className="text-stone-200 animate-pulse" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[16px] font-black text-stone-900 uppercase tracking-widest">Awaiting Command</p>
                                            <p className="text-[12px] text-stone-400 font-bold max-w-[240px] mx-auto leading-relaxed">Select a tactical asset from the matrix below to initialize the command view and field data.</p>
                                        </div>
                                    </div>
                                </MgrCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </ManagerPageLayout>
    );
}
