"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ManagerPageLayout, { MgrCard, MgrSection, MgrKPI, MgrBar } from "@/components/features/manager/ManagerPageLayout";
import { useApi } from "@/lib/hooks";
import { useToast } from "@/components/ui/Toast";

function Icon({ name, size = 16, className = "", style }: { name: string; size?: number; className?: string; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size, ...style }}>{name}</span>;
}

const workers = [
    { id: "W-001", name: "Rahul Verma", phone: "98xx-xx1234", ward: "Ward 12", booth: "B-001", doorsToday: 42, keyVoters: 3, hoursActive: 6.5, rating: 4.8, status: "ACTIVE", lastPing: "2 MIN AGO", location: "Aminabad", streak: 14 },
    { id: "W-002", name: "Priya Singh", phone: "98xx-xx5678", ward: "Ward 14", booth: "B-004", doorsToday: 38, keyVoters: 5, hoursActive: 6, rating: 4.9, status: "ACTIVE", lastPing: "5 MIN AGO", location: "Chowk", streak: 21 },
    { id: "W-003", name: "Amit Kumar", phone: "98xx-xx9012", ward: "Ward 16", booth: "B-007", doorsToday: 45, keyVoters: 4, hoursActive: 7, rating: 4.7, status: "ACTIVE", lastPing: "1 MIN AGO", location: "Rajajipuram", streak: 18 },
    { id: "W-004", name: "Sita Devi", phone: "98xx-xx3456", ward: "Ward 20", booth: "B-010", doorsToday: 50, keyVoters: 6, hoursActive: 7.5, rating: 5.0, status: "ACTIVE", lastPing: "3 MIN AGO", location: "Gomtinagar", streak: 28 },
    { id: "W-005", name: "Vijay Pal", phone: "98xx-xx7890", ward: "Ward 15", booth: "B-005", doorsToday: 28, keyVoters: 2, hoursActive: 5, rating: 4.2, status: "ACTIVE", lastPing: "12 MIN AGO", location: "Hussainganj", streak: 7 },
    { id: "W-006", name: "Neha Gupta", phone: "98xx-xx2345", ward: "Ward 12", booth: "B-002", doorsToday: 35, keyVoters: 2, hoursActive: 5.5, rating: 4.5, status: "ACTIVE", lastPing: "8 MIN AGO", location: "Aminabad", streak: 12 },
    { id: "W-007", name: "Ram Prasad", phone: "98xx-xx6789", ward: "Ward 14", booth: "B-003", doorsToday: 8, keyVoters: 0, hoursActive: 2, rating: 3.1, status: "IDLE", lastPing: "45 MIN AGO", location: "UNKNOWN", streak: 2 },
    { id: "W-008", name: "Sunita Kumari", phone: "98xx-xx0123", ward: "Ward 16", booth: "B-006", doorsToday: 0, keyVoters: 0, hoursActive: 0, rating: 3.8, status: "OFFLINE", lastPing: "3 HRS AGO", location: "—", streak: 0 },
    { id: "W-009", name: "Deepak Sharma", phone: "98xx-xx4567", ward: "Ward 18", booth: "B-008", doorsToday: 22, keyVoters: 1, hoursActive: 4, rating: 4.0, status: "ACTIVE", lastPing: "6 MIN AGO", location: "Aliganj", streak: 9 },
    { id: "W-010", name: "Kavita Yadav", phone: "98xx-xx8901", ward: "Ward 19", booth: "B-009", doorsToday: 5, keyVoters: 0, hoursActive: 1.5, rating: 3.5, status: "IDLE", lastPing: "1 HR AGO", location: "UNKNOWN", streak: 3 },
];

const statusColor: Record<string, string> = { ACTIVE: "#10b981", IDLE: "#f59e0b", OFFLINE: "#ef4444" };

export default function WorkerTrackerPage() {
    const [sortBy, setSortBy] = useState<"doors" | "rating" | "hours">("doors");
    const [filter, setFilter] = useState("ALL");
    const { toast } = useToast();

    // ── Live data from backend ──
    const { data: workerStats } = useApi<any>("/api/workers?stats=true", null);

    const filtered = filter === "ALL" ? workers : workers.filter(w => w.status === filter);
    const sorted = [...filtered].sort((a, b) =>
        sortBy === "doors" ? b.doorsToday - a.doorsToday : sortBy === "rating" ? b.rating - a.rating : b.hoursActive - a.hoursActive
    );

    const topPerformer = [...workers].sort((a, b) => b.doorsToday - a.doorsToday)[0];

    const handleBroadcast = async () => {
        try {
            const res = await fetch("/api/campaigns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "Tactical Broadcast", channel: "sms", message: "Urgent deployment update: Prioritize High-Impact Booths before 18:00 IST." }),
            });
            if (res.ok) toast("Broadcast transmitted to field team", "success");
            else toast("Signal transmission failed", "error");
        } catch { toast("Network link severed", "error"); }
    };

    return (
        <ManagerPageLayout title="Field Force Intelligence" badge="TACTICAL UNIT" badgeColor="#1c1917">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                <MgrKPI icon="groups" label="Total Personnel" value={workerStats?.total?.toString() || String(workers.length)} sub="Active Roster" color="#1c1917" delay={0.1} />
                <MgrKPI icon="directions_run" label="In Field" value={workerStats?.active?.toString() || String(workers.filter(w => w.status === "ACTIVE").length)} sub="Live Operations" color="#10b981" delay={0.15} />
                <MgrKPI icon="timer" label="Idle Units" value={String(workers.filter(w => w.status === "IDLE").length)} sub="Ready for Tasking" color="#f59e0b" delay={0.2} />
                <MgrKPI icon="wifi_off" label="Offline" value={String(workers.filter(w => w.status === "OFFLINE").length)} sub="Signal Lost" color="#ef4444" delay={0.25} />
                <MgrKPI icon="military_tech" label="Prime Agent" value={topPerformer.name.split(" ")[0]} sub={`${topPerformer.doorsToday} Engagements`} color="#6366f1" delay={0.3} />
            </div>

            <div className="flex flex-col xl:grid xl:grid-cols-[1fr_360px] gap-8">
                <div className="max-w-full overflow-hidden">
                    <MgrCard>
                        <MgrSection title="Personnel Performance Index" icon="query_stats" action={
                            <div className="flex gap-4 items-center">
                                <div className="flex gap-1.5 bg-stone-100 p-1 rounded-xl">
                                    {["ALL", "ACTIVE", "IDLE"].map(f => (
                                        <button key={f} onClick={() => setFilter(f)} className={`text-[9px] font-black px-4 py-1.5 rounded-lg transition-all tracking-widest ${filter === f ? "bg-white text-stone-900 shadow-sm" : "text-stone-400 hover:text-stone-600 uppercase"}`}>{f}</button>
                                    ))}
                                </div>
                                <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="bg-white border-2 border-stone-100 rounded-xl px-4 py-1.5 text-[9px] font-black text-stone-500 uppercase tracking-widest outline-none focus:border-stone-900 transition-all cursor-pointer shadow-sm">
                                    <option value="doors">Engagements</option><option value="rating">Trust Score</option><option value="hours">Duty Hours</option>
                                </select>
                            </div>
                        } />
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b-2 border-stone-50 text-[10px] font-black text-stone-400 uppercase tracking-[0.15em]">
                                        <th className="px-8 py-5 w-20 text-center">rank</th>
                                        <th className="px-4 py-5">Personnel info</th>
                                        <th className="px-4 py-5">Assigned booth</th>
                                        <th className="px-4 py-5 text-right pr-8">Stats (Door/Hrs/Score)</th>
                                        <th className="px-4 py-5 text-center w-32">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-50">
                                    {sorted.map((w, i) => (
                                        <motion.tr 
                                            key={w.id} 
                                            initial={{ opacity: 0, x: -10 }} 
                                            animate={{ opacity: 1, x: 0 }} 
                                            transition={{ delay: 0.1 + i * 0.04 }}
                                            className="group hover:bg-stone-50/50 transition-all cursor-pointer"
                                        >
                                            <td className="px-8 py-6 text-center">
                                                <div className={`size-8 rounded-xl flex items-center justify-center text-[12px] font-black shadow-sm mx-auto ${i < 3 ? "bg-stone-900 text-white shadow-stone-200" : "bg-stone-50 text-stone-400 border border-stone-100"}`}>
                                                    {i + 1}
                                                </div>
                                            </td>
                                            <td className="px-4 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-10 rounded-2xl bg-stone-100 flex items-center justify-center text-[14px] font-black text-stone-500 border-2 border-white shadow-sm group-hover:bg-white group-hover:scale-110 transition-all">
                                                        {w.name.charAt(0)}
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <span className="text-[14px] text-stone-900 font-bold block leading-none">{w.name}</span>
                                                        <span className="text-[10px] text-stone-400 font-bold tracking-tight uppercase">{w.id} • {w.lastPing}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-6">
                                                <div className="space-y-1">
                                                    <span className="text-[11px] font-black text-stone-900 leading-none block">{w.booth}</span>
                                                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{w.ward}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-6 text-right pr-8">
                                                <div className="flex items-center justify-end gap-4">
                                                    <div className="text-right">
                                                        <span className="text-[15px] font-black text-stone-900 block leading-none">{w.doorsToday}</span>
                                                        <span className="text-[9px] font-black text-stone-300 uppercase leading-none">Doors</span>
                                                    </div>
                                                    <div className="size-px h-6 bg-stone-100" />
                                                    <div className="text-right">
                                                        <span className="text-[15px] font-black text-stone-900 block leading-none">{w.hoursActive}h</span>
                                                        <span className="text-[9px] font-black text-stone-300 uppercase leading-none">Duty</span>
                                                    </div>
                                                    <div className="size-px h-6 bg-stone-100" />
                                                    <div className="text-right">
                                                        <div className="flex items-center justify-end gap-1 mb-0.5">
                                                            <Icon name="star_rate" size={14} className="text-stone-900" />
                                                            <span className="text-[15px] font-black text-stone-900 leading-none">{w.rating}</span>
                                                        </div>
                                                        <span className="text-[9px] font-black text-stone-300 uppercase leading-none">Trust</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-6 text-center">
                                                <div className="flex justify-center">
                                                    <span className="text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm border border-stone-100" style={{ color: statusColor[w.status], background: `white` }}>
                                                        {w.status}
                                                    </span>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </MgrCard>
                </div>

                <div className="space-y-6">
                    <MgrCard>
                        <MgrSection title="Intelligence Ops" icon="insights" />
                        <div className="p-8 space-y-6">
                            {[
                                { label: "Engagement Velocity", value: String(Math.round(workers.reduce((s, w) => s + w.doorsToday, 0) / workers.length)), icon: "bolt", color: "#1c1917" },
                                { label: "Operational Hours", value: (workers.reduce((s, w) => s + w.hoursActive, 0) / workers.length).toFixed(1) + "h", icon: "schedule", color: "#10b981" },
                                { label: "High-Priority Intel", value: String(workers.reduce((s, w) => s + w.keyVoters, 0)), icon: "priority_high", color: "#6366f1" },
                                { label: "Collective Trust", value: (workers.reduce((s, w) => s + w.rating, 0) / workers.length).toFixed(1), icon: "verified", color: "#f59e0b" },
                            ].map(s => (
                                <div key={s.label} className="flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-300 border border-stone-100 group-hover:bg-white group-hover:border-stone-200 transition-all shadow-sm">
                                            <Icon name={s.icon} size={18} className="transition-colors group-hover:text-stone-900" />
                                        </div>
                                        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest leading-tight">{s.label}</span>
                                    </div>
                                    <span className="text-[18px] font-black text-stone-900 tracking-tight" style={{ color: s.color }}>{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </MgrCard>

                    <MgrCard>
                        <MgrSection title="Operational Resilience 🔥" icon="local_fire_department" />
                        <div className="p-6 space-y-3">
                            {[...workers].sort((a, b) => b.streak - a.streak).slice(0, 5).map((w, i) => (
                                <motion.div key={w.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                                    className="flex items-center justify-between p-4 rounded-[1.5rem] bg-white border border-stone-100 hover:border-stone-200 hover:shadow-lg hover:-translate-y-1 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-xl bg-stone-50 flex items-center justify-center text-[10px] font-black text-stone-400 border border-stone-100 group-hover:bg-stone-900 group-hover:text-white transition-all">
                                            {i + 1}
                                        </div>
                                        <span className="text-[12px] font-bold text-stone-600 truncate max-w-[120px]">{w.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100">
                                        <Icon name="fireplace" size={14} className="text-orange-500" />
                                        <span className="text-[11px] font-black text-orange-600">{w.streak}d</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </MgrCard>

                    <MgrCard>
                        <div className="p-4">
                            <button 
                                onClick={handleBroadcast} 
                                className="w-full py-6 rounded-[2rem] bg-stone-900 text-white font-black text-[12px] uppercase tracking-[0.25em] shadow-2xl shadow-stone-200 hover:bg-stone-800 transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                                <Icon name="campaign" size={20} />
                                Tactical Broadcast
                            </button>
                        </div>
                    </MgrCard>
                </div>
            </div>
        </ManagerPageLayout>
    );
}
