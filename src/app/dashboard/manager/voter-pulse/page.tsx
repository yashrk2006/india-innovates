"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import ManagerPageLayout, { MgrCard, MgrSection, MgrKPI, MgrBar } from "@/components/manager/ManagerPageLayout";
import { useApi } from "@/lib/hooks";

function Icon({ name, size = 16, className = "", style }: { name: string; size?: number; className?: string; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size, ...style }}>{name}</span>;
}

const wards = [
    { name: "Ward 12", favorable: 62, neutral: 21, opposed: 17, topIssues: ["Water", "Roads"], sentiment: 0.68 },
    { name: "Ward 14", favorable: 48, neutral: 28, opposed: 24, topIssues: ["Employment", "Sanitation"], sentiment: 0.48 },
    { name: "Ward 15", favorable: 55, neutral: 25, opposed: 20, topIssues: ["Health", "Roads"], sentiment: 0.58 },
    { name: "Ward 16", favorable: 42, neutral: 30, opposed: 28, topIssues: ["Crime", "Water"], sentiment: 0.38 },
    { name: "Ward 18", favorable: 58, neutral: 22, opposed: 20, topIssues: ["Education", "Power"], sentiment: 0.60 },
    { name: "Ward 19", favorable: 35, neutral: 25, opposed: 40, topIssues: ["Employment", "Crime"], sentiment: 0.30 },
    { name: "Ward 20", favorable: 72, neutral: 18, opposed: 10, topIssues: ["Infrastructure"], sentiment: 0.78 },
    { name: "Ward 22", favorable: 50, neutral: 28, opposed: 22, topIssues: ["Water", "Sanitation"], sentiment: 0.52 },
];

const demographics = [
    { segment: "Youth (18-25)", favorable: 58, size: 24000, trending: "up" },
    { segment: "Women", favorable: 62, size: 42000, trending: "up" },
    { segment: "Senior Citizens", favorable: 55, size: 18000, trending: "stable" },
    { segment: "First-time Voters", favorable: 64, size: 12000, trending: "up" },
    { segment: "Farmers", favorable: 48, size: 8000, trending: "down" },
    { segment: "Traders/Business", favorable: 52, size: 15000, trending: "stable" },
];

const trendColor: Record<string, string> = { up: "#10b981", down: "#ef4444", stable: "#f59e0b" };
const trendIcon: Record<string, string> = { up: "trending_up", down: "trending_down", stable: "trending_flat" };

const grievances = [
    { issue: "Water Supply", count: 342, ward: "Ward 16", priority: "HIGH", actionTaken: "DC notified, tanker deployed" },
    { issue: "Road Conditions", count: 278, ward: "Ward 14", priority: "HIGH", actionTaken: "PWD repair initiated" },
    { issue: "Unemployment", count: 245, ward: "Ward 19", priority: "CRITICAL", actionTaken: "Skill camp organized" },
    { issue: "Electricity Cuts", count: 189, ward: "Ward 18", priority: "MEDIUM", actionTaken: "UPPCL complaint raised" },
    { issue: "Sanitation", count: 156, ward: "Ward 22", priority: "MEDIUM", actionTaken: "SMC team dispatched" },
    { issue: "Crime/Safety", count: 134, ward: "Ward 16", priority: "HIGH", actionTaken: "SP briefed, extra patrol" },
];

const priColor: Record<string, string> = { CRITICAL: "#ef4444", HIGH: "#f59e0b", MEDIUM: "#60a5fa", LOW: "#10b981" };

export default function VoterPulsePage() {
    const [view, setView] = useState<"wards" | "demographics" | "grievances">("wards");
    const avgSentiment = Math.round(wards.reduce((s, w) => s + w.sentiment, 0) / wards.length * 100);

    // ── Live data from backend ──
    const { data: voterDemo } = useApi<any>("/api/voters?demographics=true", null);
    const { data: grievanceStats } = useApi<any>("/api/grievances?stats=true", null);

    return (
        <ManagerPageLayout title="Voter Pulse" badge="📊 INTELLIGENCE" badgeColor="#818cf8">
            <div className="grid grid-cols-5 gap-3">
                <MgrKPI icon="thumb_up" label="Overall Sentiment" value={`${avgSentiment}%`} sub="Favorable" color={avgSentiment > 55 ? "#10b981" : "#f59e0b"} delay={0} />
                <MgrKPI icon="record_voice_over" label="Voters Surveyed" value={voterDemo?.total?.toLocaleString() || "4,200"} sub="This week" color="#1e293b" delay={0.05} />
                <MgrKPI icon="report_problem" label="Top Grievance" value="Water" sub={`${grievanceStats?.total || 342} complaints`} color="#ef4444" delay={0.1} />
                <MgrKPI icon="trending_up" label="Sentiment Trend" value="↑ 3.2%" sub="vs last week" color="#10b981" delay={0.15} />
                <MgrKPI icon="groups" label="Key Segments" value={voterDemo?.segments ? Object.keys(voterDemo.segments).length.toString() : "6"} sub="Tracked" color="#818cf8" delay={0.2} />
            </div>

            <div className="flex gap-2 mb-1">
                {(["wards", "demographics", "grievances"] as const).map(v => (
                    <button key={v} onClick={() => setView(v)} className={`text-[10px] font-mono px-4 py-2 rounded-lg capitalize transition-all flex items-center gap-1.5 ${view === v ? "bg-[#1e293b]/15 text-[#1e293b] border border-[#1e293b]/25" : "text-slate-400 border border-slate-200 hover:text-slate-500"}`}>
                        <Icon name={v === "wards" ? "map" : v === "demographics" ? "people" : "report"} size={14} />{v}
                    </button>
                ))}
            </div>

            {view === "wards" && (
                <div className="grid grid-cols-2 gap-4">
                    {wards.map((w, i) => (
                        <motion.div key={w.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                            <MgrCard>
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-[13px] text-slate-500 font-semibold">{w.name}</h4>
                                        <span className={`text-[18px] font-bold font-mono ${w.sentiment > 0.6 ? "text-green-400" : w.sentiment > 0.4 ? "text-yellow-400" : "text-red-400"}`}>{Math.round(w.sentiment * 100)}%</span>
                                    </div>
                                    <div className="flex gap-0.5 mb-3 h-3 rounded-full overflow-hidden">
                                        <div className="bg-green-500 rounded-l-full" style={{ width: `${w.favorable}%` }} />
                                        <div className="bg-gray-500" style={{ width: `${w.neutral}%` }} />
                                        <div className="bg-red-500 rounded-r-full" style={{ width: `${w.opposed}%` }} />
                                    </div>
                                    <div className="flex justify-between text-[8px] font-mono mb-2">
                                        <span className="text-green-400">Favorable {w.favorable}%</span>
                                        <span className="text-gray-400">Neutral {w.neutral}%</span>
                                        <span className="text-red-400">Opposed {w.opposed}%</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        {w.topIssues.map(iss => (
                                            <span key={iss} className="text-[8px] font-mono bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-200">{iss}</span>
                                        ))}
                                    </div>
                                </div>
                            </MgrCard>
                        </motion.div>
                    ))}
                </div>
            )}

            {view === "demographics" && (
                <MgrCard delay={0.1}>
                    <MgrSection title="Demographic Segments" icon="people" />
                    {demographics.map((d, i) => (
                        <motion.div key={d.segment} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                            className="px-5 py-3.5 border-b border-slate-200 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                            <span className="text-[12px] text-slate-600 font-medium w-36">{d.segment}</span>
                            <div className="flex-1"><MgrBar pct={d.favorable} color={d.favorable > 55 ? "#10b981" : d.favorable > 45 ? "#f59e0b" : "#ef4444"} h={6} /></div>
                            <span className="text-[12px] font-mono font-bold w-10 text-right" style={{ color: d.favorable > 55 ? "#10b981" : d.favorable > 45 ? "#f59e0b" : "#ef4444" }}>{d.favorable}%</span>
                            <span className="text-[9px] font-mono text-slate-400 w-14 text-right">{(d.size / 1000).toFixed(0)}K voters</span>
                            <Icon name={trendIcon[d.trending]} size={16} style={{ color: trendColor[d.trending] }} />
                        </motion.div>
                    ))}
                </MgrCard>
            )}

            {view === "grievances" && (
                <MgrCard delay={0.1}>
                    <MgrSection title="Voter Grievances" icon="report_problem" />
                    {grievances.map((g, i) => (
                        <motion.div key={g.issue} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                            className="px-5 py-4 border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] text-slate-500 font-semibold">{g.issue}</span>
                                    <span className="text-[7px] font-mono px-1.5 py-0.5 rounded" style={{ color: priColor[g.priority], background: priColor[g.priority] + "12" }}>{g.priority}</span>
                                </div>
                                <span className="text-[14px] font-mono font-bold text-[#1e293b]">{g.count}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[9px] text-slate-500">
                                <span>📍 {g.ward}</span><span>✅ {g.actionTaken}</span>
                            </div>
                        </motion.div>
                    ))}
                </MgrCard>
            )}
        </ManagerPageLayout>
    );
}
