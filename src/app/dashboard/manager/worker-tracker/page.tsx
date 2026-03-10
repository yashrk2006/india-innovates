"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ManagerPageLayout, { MgrCard, MgrSection, MgrKPI, MgrBar } from "@/components/manager/ManagerPageLayout";
import { useApi } from "@/lib/hooks";
import { useToast } from "@/components/ui/Toast";

function Icon({ name, size = 16, className = "", style }: { name: string; size?: number; className?: string; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size, ...style }}>{name}</span>;
}

const workers = [
    { id: "W-001", name: "Rahul Verma", phone: "98xx-xx1234", ward: "Ward 12", booth: "B-001", doorsToday: 42, keyVoters: 3, hoursActive: 6.5, rating: 4.8, status: "ACTIVE", lastPing: "2 min ago", location: "Aminabad", streak: 14 },
    { id: "W-002", name: "Priya Singh", phone: "98xx-xx5678", ward: "Ward 14", booth: "B-004", doorsToday: 38, keyVoters: 5, hoursActive: 6, rating: 4.9, status: "ACTIVE", lastPing: "5 min ago", location: "Chowk", streak: 21 },
    { id: "W-003", name: "Amit Kumar", phone: "98xx-xx9012", ward: "Ward 16", booth: "B-007", doorsToday: 45, keyVoters: 4, hoursActive: 7, rating: 4.7, status: "ACTIVE", lastPing: "1 min ago", location: "Rajajipuram", streak: 18 },
    { id: "W-004", name: "Sita Devi", phone: "98xx-xx3456", ward: "Ward 20", booth: "B-010", doorsToday: 50, keyVoters: 6, hoursActive: 7.5, rating: 5.0, status: "ACTIVE", lastPing: "3 min ago", location: "Gomtinagar", streak: 28 },
    { id: "W-005", name: "Vijay Pal", phone: "98xx-xx7890", ward: "Ward 15", booth: "B-005", doorsToday: 28, keyVoters: 2, hoursActive: 5, rating: 4.2, status: "ACTIVE", lastPing: "12 min ago", location: "Hussainganj", streak: 7 },
    { id: "W-006", name: "Neha Gupta", phone: "98xx-xx2345", ward: "Ward 12", booth: "B-002", doorsToday: 35, keyVoters: 2, hoursActive: 5.5, rating: 4.5, status: "ACTIVE", lastPing: "8 min ago", location: "Aminabad", streak: 12 },
    { id: "W-007", name: "Ram Prasad", phone: "98xx-xx6789", ward: "Ward 14", booth: "B-003", doorsToday: 8, keyVoters: 0, hoursActive: 2, rating: 3.1, status: "IDLE", lastPing: "45 min ago", location: "Unknown", streak: 2 },
    { id: "W-008", name: "Sunita Kumari", phone: "98xx-xx0123", ward: "Ward 16", booth: "B-006", doorsToday: 0, keyVoters: 0, hoursActive: 0, rating: 3.8, status: "OFFLINE", lastPing: "3 hrs ago", location: "—", streak: 0 },
    { id: "W-009", name: "Deepak Sharma", phone: "98xx-xx4567", ward: "Ward 18", booth: "B-008", doorsToday: 22, keyVoters: 1, hoursActive: 4, rating: 4.0, status: "ACTIVE", lastPing: "6 min ago", location: "Aliganj", streak: 9 },
    { id: "W-010", name: "Kavita Yadav", phone: "98xx-xx8901", ward: "Ward 19", booth: "B-009", doorsToday: 5, keyVoters: 0, hoursActive: 1.5, rating: 3.5, status: "IDLE", lastPing: "1 hr ago", location: "Unknown", streak: 3 },
];

const statusColor: Record<string, string> = { ACTIVE: "#4ade80", IDLE: "#fbbf24", OFFLINE: "#f87171" };

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

    return (
        <ManagerPageLayout title="Worker Tracker" badge="👥 FIELD TEAM" badgeColor="#c9a84c">
            <div className="grid grid-cols-5 gap-3">
                <MgrKPI icon="group" label="Total Workers" value={workerStats?.total?.toString() || String(workers.length)} sub="In district" color="#c9a84c" delay={0} />
                <MgrKPI icon="sprint" label="Active Now" value={workerStats?.active?.toString() || String(workers.filter(w => w.status === "ACTIVE").length)} sub="In field" color="#4ade80" delay={0.05} />
                <MgrKPI icon="hourglass_empty" label="Idle" value={String(workers.filter(w => w.status === "IDLE").length)} sub="No recent activity" color="#fbbf24" delay={0.1} />
                <MgrKPI icon="wifi_off" label="Offline" value={String(workers.filter(w => w.status === "OFFLINE").length)} sub="Unreachable" color="#f87171" delay={0.15} />
                <MgrKPI icon="emoji_events" label="Top Performer" value={topPerformer.name.split(" ")[0]} sub={`${topPerformer.doorsToday} doors today`} color="#e8761a" delay={0.2} />
            </div>

            <div className="grid grid-cols-[1fr_300px] gap-5">
                <MgrCard delay={0.1}>
                    <MgrSection title="Worker Performance Leaderboard" icon="leaderboard" action={
                        <div className="flex gap-3 items-center">
                            <div className="flex gap-1">
                                {["ALL", "ACTIVE", "IDLE", "OFFLINE"].map(f => (
                                    <button key={f} onClick={() => setFilter(f)} className={`text-[8px] font-mono px-2 py-0.5 rounded ${filter === f ? "bg-[#c9a84c]/15 text-[#c9a84c]" : "text-white/20 hover:text-white/40"}`}>{f}</button>
                                ))}
                            </div>
                            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="bg-white/5 border border-white/[0.06] rounded px-2 py-0.5 text-[8px] font-mono text-white/40 outline-none">
                                <option value="doors">Sort: Doors</option><option value="rating">Sort: Rating</option><option value="hours">Sort: Hours</option>
                            </select>
                        </div>
                    } />
                    <div className="grid grid-cols-[40px_1fr_70px_60px_55px_50px_55px_60px] gap-2 px-4 py-2 border-b border-white/[0.04] text-[8px] font-mono text-white/15 uppercase tracking-wider">
                        <span>#</span><span>Worker</span><span>Ward</span><span>Doors</span><span>Key</span><span>Hrs</span><span>Rating</span><span>Status</span>
                    </div>
                    {sorted.map((w, i) => (
                        <motion.div key={w.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                            className="grid grid-cols-[40px_1fr_70px_60px_55px_50px_55px_60px] gap-2 px-4 py-3 border-b border-white/[0.02] hover:bg-white/[0.015] transition-colors items-center cursor-pointer">
                            <span className={`font-mono text-[11px] font-bold ${i < 3 ? "text-[#c9a84c]" : "text-white/20"}`}>{i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}</span>
                            <div>
                                <span className="text-[11px] text-white/80 font-medium block">{w.name}</span>
                                <span className="text-[8px] text-white/20 font-mono">{w.booth} · {w.lastPing}</span>
                            </div>
                            <span className="text-[10px] text-white/40">{w.ward}</span>
                            <span className="text-[11px] font-mono font-bold text-[#c9a84c]">{w.doorsToday}</span>
                            <span className="text-[10px] font-mono text-white/50">{w.keyVoters}</span>
                            <span className="text-[10px] font-mono text-white/40">{w.hoursActive}h</span>
                            <div className="flex items-center gap-0.5">
                                <Icon name="star" size={10} className="text-[#c9a84c]" />
                                <span className="text-[10px] font-mono text-[#c9a84c]">{w.rating}</span>
                            </div>
                            <span className="text-[7px] font-mono px-1.5 py-0.5 rounded text-center" style={{ color: statusColor[w.status], background: statusColor[w.status] + "12" }}>{w.status}</span>
                        </motion.div>
                    ))}
                </MgrCard>

                <div className="space-y-4">
                    <MgrCard delay={0.15}>
                        <MgrSection title="Team Summary" icon="analytics" />
                        <div className="p-4 space-y-3">
                            {[
                                { label: "Avg Doors/Worker", value: String(Math.round(workers.reduce((s, w) => s + w.doorsToday, 0) / workers.length)), color: "#c9a84c" },
                                { label: "Avg Hours Active", value: (workers.reduce((s, w) => s + w.hoursActive, 0) / workers.length).toFixed(1) + "h", color: "#60a5fa" },
                                { label: "Key Voters Found", value: String(workers.reduce((s, w) => s + w.keyVoters, 0)), color: "#4ade80" },
                                { label: "Avg Rating", value: (workers.reduce((s, w) => s + w.rating, 0) / workers.length).toFixed(1), color: "#e8761a" },
                            ].map(s => (
                                <div key={s.label} className="flex justify-between items-center py-2 border-b border-white/[0.03]">
                                    <span className="text-[10px] text-white/35">{s.label}</span>
                                    <span className="text-[14px] font-bold font-mono" style={{ color: s.color }}>{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </MgrCard>

                    <MgrCard delay={0.2}>
                        <MgrSection title="Streak Leaders 🔥" icon="local_fire_department" />
                        <div className="p-4 space-y-2">
                            {[...workers].sort((a, b) => b.streak - a.streak).slice(0, 5).map((w, i) => (
                                <motion.div key={w.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.04 }}
                                    className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] text-white/20 font-mono w-4">{i + 1}</span>
                                        <span className="text-[10px] text-white/60">{w.name}</span>
                                    </div>
                                    <span className="text-[11px] font-mono font-bold text-orange-400">{w.streak} days</span>
                                </motion.div>
                            ))}
                        </div>
                    </MgrCard>

                    <MgrCard delay={0.25}>
                        <div className="p-4">
                            <button onClick={async () => {
                                try {
                                    const res = await fetch("/api/campaigns", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ name: "Field Team Broadcast", channel: "sms", message: "Daily update: complete pending door-to-door visits before 6 PM." }),
                                    });
                                    if (res.ok) toast("Broadcast sent to all active workers", "success");
                                    else toast("Failed to send broadcast", "error");
                                } catch { toast("Network error", "error"); }
                            }} className="w-full text-[10px] font-mono py-2.5 rounded-lg bg-[#c9a84c]/12 text-[#c9a84c] border border-[#c9a84c]/25 hover:bg-[#c9a84c]/20 transition-all flex items-center justify-center gap-1.5">
                                <Icon name="broadcast_on_personal" size={14} /> BROADCAST MESSAGE
                            </button>
                        </div>
                    </MgrCard>
                </div>
            </div>
        </ManagerPageLayout>
    );
}
