"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import ManagerPageLayout, { MgrCard, MgrSection, MgrKPI, MgrBar } from "@/components/features/manager/ManagerPageLayout";
import { useApi } from "@/lib/hooks";
import { useToast } from "@/components/ui/Toast";

function Icon({ name, size = 16, className = "", style }: { name: string; size?: number; className?: string; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size, ...style }}>{name}</span>;
}

const schemes = [
    { name: "PM Kisan Samman Nidhi", abbr: "PM-KISAN", eligible: 8400, enrolled: 6720, gap: 1680, gapPct: 20, wards: ["Ward 19", "Ward 16"], targetDate: "Feb 28", priority: "HIGH", amount: "₹6,000/yr" },
    { name: "PMJAY – Ayushman Bharat", abbr: "PMJAY", eligible: 12000, enrolled: 9600, gap: 2400, gapPct: 20, wards: ["Ward 14", "Ward 19"], targetDate: "Mar 5", priority: "HIGH", amount: "₹5L cover" },
    { name: "PM Awas Yojana (Gramin)", abbr: "PMAY-G", eligible: 3200, enrolled: 2240, gap: 960, gapPct: 30, wards: ["Ward 16", "Ward 22"], targetDate: "Mar 15", priority: "CRITICAL", amount: "₹1.2L" },
    { name: "Ujjwala Yojana", abbr: "UJJWALA", eligible: 5600, enrolled: 5040, gap: 560, gapPct: 10, wards: ["Ward 18"], targetDate: "Feb 25", priority: "MEDIUM", amount: "Free LPG" },
    { name: "PM Vishwakarma", abbr: "PM-VK", eligible: 2800, enrolled: 980, gap: 1820, gapPct: 65, wards: ["Ward 14", "Ward 15", "Ward 19"], targetDate: "Mar 10", priority: "CRITICAL", amount: "₹3L loan" },
    { name: "Sukanya Samriddhi", abbr: "SSY", eligible: 4200, enrolled: 3360, gap: 840, gapPct: 20, wards: ["Ward 12", "Ward 22"], targetDate: "Mar 20", priority: "MEDIUM", amount: "8.2% ROI" },
    { name: "PM Jan Dhan Yojana", abbr: "PMJDY", eligible: 15000, enrolled: 13500, gap: 1500, gapPct: 10, wards: ["Ward 16"], targetDate: "Feb 22", priority: "LOW", amount: "Zero bal A/C" },
    { name: "Atal Pension Yojana", abbr: "APY", eligible: 6000, enrolled: 3000, gap: 3000, gapPct: 50, wards: ["Ward 14", "Ward 16", "Ward 19"], targetDate: "Mar 8", priority: "HIGH", amount: "₹5K/mo pension" },
];

const priColor: Record<string, string> = { CRITICAL: "#ef4444", HIGH: "#f59e0b", MEDIUM: "#60a5fa", LOW: "#10b981" };

export default function SchemeGapsPage() {
    const [sortBy, setSortBy] = useState<"gap" | "priority">("gap");
    const sorted = [...schemes].sort((a, b) => sortBy === "gap" ? b.gapPct - a.gapPct : (priColor[a.priority] === "#ef4444" ? -1 : 1));
    const totalGap = schemes.reduce((s, sc) => s + sc.gap, 0);

    // ── Live data from backend ──
    const { data: schemeGaps } = useApi<any[]>("/api/stats?type=scheme_gaps", []);
    const { data: stats } = useApi<any>("/api/stats", null);
    const { toast } = useToast();

    const handleAssignWorkers = async (schemeName: string) => {
        try {
            const res = await fetch("/api/workers/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: `Scheme enrollment: ${schemeName}`, description: `Assigned for ${schemeName} gap coverage`, priority: "high" }),
            });
            if (res.ok) toast(`Workers assigned for ${schemeName}`, "success");
            else toast("Assignment failed", "error");
        } catch { toast("Network error", "error"); }
    };

    return (
        <ManagerPageLayout title="Scheme Gap Analysis" badge="🔍 AI INSIGHTS" badgeColor="#818cf8">
            <div className="grid grid-cols-5 gap-3">
                <MgrKPI icon="policy" label="Schemes Tracked" value={schemeGaps.length > 0 ? String(schemeGaps.length) : String(schemes.length)} sub="Central + State" color="#818cf8" delay={0} />
                <MgrKPI icon="person_off" label="Total Gap" value={totalGap.toLocaleString()} sub="Eligible unenrolled" color="#ef4444" delay={0.05} />
                <MgrKPI icon="warning" label="Critical Gaps" value={String(schemes.filter(s => s.priority === "CRITICAL").length)} sub="Need urgent push" color="#ef4444" delay={0.1} />
                <MgrKPI icon="location_on" label="Worst Ward" value="Ward 19" sub="Most underserved" color="#f59e0b" delay={0.15} />
                <MgrKPI icon="trending_up" label="Enrolled Today" value={stats?.totalSchemeEnrollments?.toString() || "156"} sub="↑ 23% vs yesterday" color="#10b981" delay={0.2} />
            </div>

            <div className="flex justify-end">
                <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-[9px] font-mono text-slate-500 outline-none">
                    <option value="gap">Sort by Gap %</option><option value="priority">Sort by Priority</option>
                </select>
            </div>

            <div className="space-y-3">
                {sorted.map((sc, i) => (
                    <motion.div key={sc.abbr} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <MgrCard>
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h4 className="text-[13px] text-slate-500 font-semibold">{sc.name}</h4>
                                            <span className="text-[8px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{sc.abbr}</span>
                                            <span className="text-[7px] font-mono px-1.5 py-0.5 rounded" style={{ color: priColor[sc.priority], background: priColor[sc.priority] + "12" }}>{sc.priority}</span>
                                        </div>
                                        <div className="flex gap-3 text-[9px] text-slate-500 mt-0.5">
                                            <span>💰 {sc.amount}</span><span>📅 Target: {sc.targetDate}</span>
                                            <span>📍 {sc.wards.join(", ")}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[24px] font-bold" style={{ color: sc.gapPct > 40 ? "#ef4444" : sc.gapPct > 20 ? "#f59e0b" : "#10b981" }}>{sc.gapPct}%</span>
                                        <p className="text-[8px] font-mono text-slate-400">gap</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex-1"><MgrBar pct={100 - sc.gapPct} color={sc.gapPct > 40 ? "#ef4444" : sc.gapPct > 20 ? "#f59e0b" : "#10b981"} h={6} /></div>
                                </div>
                                <div className="flex justify-between text-[9px] font-mono">
                                    <span className="text-green-400">Enrolled: {sc.enrolled.toLocaleString()}</span>
                                    <span className="text-slate-400">Eligible: {sc.eligible.toLocaleString()}</span>
                                    <span className="text-red-400">Gap: {sc.gap.toLocaleString()}</span>
                                </div>
                                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200">
                                    <button onClick={() => handleAssignWorkers(sc.name)} className="text-[9px] font-mono px-3 py-1.5 rounded-lg bg-[#1e293b]/12 text-[#1e293b] border border-[#1e293b]/25 hover:bg-[#1e293b]/20 transition-all">ASSIGN WORKERS</button>
                                    <button onClick={() => toast(`Ward map for ${sc.wards.join(", ")} — opening...`, "info")} className="text-[9px] font-mono px-3 py-1.5 rounded-lg bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-50 transition-all">VIEW WARD MAP</button>
                                    <button onClick={() => toast(`Downloading ${sc.gap.toLocaleString()} unenrolled voters list...`, "info")} className="text-[9px] font-mono px-3 py-1.5 rounded-lg bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-50 transition-all">DOWNLOAD LIST</button>
                                </div>
                            </div>
                        </MgrCard>
                    </motion.div>
                ))}
            </div>
        </ManagerPageLayout>
    );
}
