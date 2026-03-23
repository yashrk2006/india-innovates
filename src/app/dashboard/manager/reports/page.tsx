"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import ManagerPageLayout, { MgrCard, MgrSection, MgrKPI, MgrBar } from "@/components/features/manager/ManagerPageLayout";
import { useApi } from "@/lib/hooks";
import { useToast } from "@/components/ui/Toast";

function Icon({ name, size = 16, className = "", style }: { name: string; size?: number; className?: string; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size, ...style }}>{name}</span>;
}

const reports = [
    { id: "RPT-001", title: "Weekly Booth Performance", type: "Auto", frequency: "Weekly", lastGenerated: "Feb 20", pages: 24, format: "PDF + Excel" },
    { id: "RPT-002", title: "Worker Attendance & Activity", type: "Auto", frequency: "Daily", lastGenerated: "Today", pages: 8, format: "PDF" },
    { id: "RPT-003", title: "Voter Sentiment Analysis", type: "AI", frequency: "Weekly", lastGenerated: "Feb 19", pages: 16, format: "PDF" },
    { id: "RPT-004", title: "Scheme Enrollment Gap Report", type: "Auto", frequency: "Bi-weekly", lastGenerated: "Feb 15", pages: 32, format: "PDF + Excel" },
    { id: "RPT-005", title: "Ward-wise Coverage Heatmap", type: "Auto", frequency: "Daily", lastGenerated: "Today", pages: 4, format: "PDF" },
    { id: "RPT-006", title: "Event ROI & Mobilization", type: "Manual", frequency: "Post-event", lastGenerated: "Feb 18", pages: 12, format: "PDF" },
    { id: "RPT-007", title: "Grievance Resolution Tracker", type: "Auto", frequency: "Weekly", lastGenerated: "Feb 20", pages: 18, format: "Excel" },
    { id: "RPT-008", title: "Key Voter Influence Map", type: "AI", frequency: "Monthly", lastGenerated: "Feb 1", pages: 28, format: "PDF" },
];

const misData = [
    { metric: "Overall Booth Coverage", value: "73%", trend: "+4%", period: "This Week", color: "#10b981" },
    { metric: "Worker Utilization", value: "89%", trend: "+2%", period: "Today", color: "#1e293b" },
    { metric: "Voter Contacts/Day", value: "4,200", trend: "+12%", period: "Today", color: "#e8761a" },
    { metric: "Scheme Enrollment Rate", value: "156/day", trend: "+23%", period: "This Week", color: "#818cf8" },
    { metric: "Grievance Resolution", value: "84%", trend: "+5%", period: "This Month", color: "#60a5fa" },
    { metric: "Event Mobilization", value: "72%", trend: "-3%", period: "Last Event", color: "#f59e0b" },
];

const typeColor: Record<string, string> = { Auto: "#10b981", AI: "#818cf8", Manual: "#f59e0b" };

export default function ReportsPage() {
    const [tab, setTab] = useState<"reports" | "mis">("reports");

    // ── Live data from backend ──
    const { data: stats } = useApi<any>("/api/stats", null);
    const { toast } = useToast();

    const handleGenerate = async (title: string) => {
        toast(`Generating "${title}"...`, "info");
        try {
            await fetch("/api/workers/activity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "report_generated", details: JSON.stringify({ report: title }) }),
            });
            setTimeout(() => toast(`"${title}" ready for download`, "success"), 1500);
        } catch { toast("Generation failed", "error"); }
    };

    return (
        <ManagerPageLayout title="Reports & MIS" badge="📊 ANALYTICS" badgeColor="#60a5fa">
            <div className="grid grid-cols-5 gap-3">
                <MgrKPI icon="description" label="Total Reports" value={String(reports.length)} sub="Available" color="#60a5fa" delay={0} />
                <MgrKPI icon="auto_awesome" label="AI-Generated" value={String(reports.filter(r => r.type === "AI").length)} sub="Insights" color="#818cf8" delay={0.05} />
                <MgrKPI icon="schedule" label="Auto Reports" value={String(reports.filter(r => r.type === "Auto").length)} sub="Scheduled" color="#10b981" delay={0.1} />
                <MgrKPI icon="download" label="Grievances" value={stats?.totalGrievances?.toString() || "342"} sub={`${stats?.unresolvedGrievances || 0} unresolved`} color="#1e293b" delay={0.15} />
                <MgrKPI icon="trending_up" label="Total Voters" value={stats?.totalVoters ? `${(stats.totalVoters / 1000).toFixed(1)}K` : "73%"} sub="In system" color="#10b981" delay={0.2} />
            </div>

            <div className="flex gap-2 mb-1">
                {(["reports", "mis"] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)} className={`text-[10px] font-mono px-4 py-2 rounded-lg capitalize transition-all flex items-center gap-1.5 ${tab === t ? "bg-[#1e293b]/15 text-[#1e293b] border border-[#1e293b]/25" : "text-slate-400 border border-slate-200 hover:text-slate-500"}`}>
                        <Icon name={t === "reports" ? "description" : "monitoring"} size={14} />{t === "mis" ? "MIS Dashboard" : "Reports Library"}
                    </button>
                ))}
            </div>

            {tab === "reports" && (
                <MgrCard delay={0.1}>
                    <MgrSection title="Available Reports" icon="folder" action={
                        <button onClick={() => toast("Custom report builder coming soon", "info")} className="text-[8px] font-mono px-3 py-1 rounded bg-[#1e293b]/12 text-[#1e293b] border border-[#1e293b]/20 flex items-center gap-1"><Icon name="add" size={11} /> Custom Report</button>
                    } />
                    {reports.map((r, i) => (
                        <motion.div key={r.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                            className="px-5 py-4 border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                                <Icon name={r.type === "AI" ? "auto_awesome" : r.type === "Auto" ? "schedule" : "edit_note"} size={18} style={{ color: typeColor[r.type] }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[12px] text-slate-700 font-medium">{r.title}</h4>
                                <div className="flex gap-3 text-[8px] text-slate-400 mt-0.5">
                                    <span className="font-mono" style={{ color: typeColor[r.type] }}>{r.type}</span>
                                    <span>📅 {r.frequency}</span><span>📄 {r.pages} pages</span><span>💾 {r.format}</span>
                                    <span>Last: {r.lastGenerated}</span>
                                </div>
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                                <button onClick={() => handleGenerate(r.title)} className="text-[8px] font-mono px-2.5 py-1 rounded bg-[#1e293b]/12 text-[#1e293b] border border-[#1e293b]/20 hover:bg-[#1e293b]/20 transition-all">GENERATE</button>
                                <button onClick={() => toast(`Downloading ${r.title} (${r.format})...`, "info")} className="text-[8px] font-mono px-2.5 py-1 rounded bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-50 transition-all">DOWNLOAD</button>
                            </div>
                        </motion.div>
                    ))}
                </MgrCard>
            )}

            {tab === "mis" && (
                <div className="grid grid-cols-3 gap-4">
                    {misData.map((m, i) => (
                        <motion.div key={m.metric} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                            <MgrCard>
                                <div className="p-5">
                                    <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-2">{m.metric}</p>
                                    <div className="flex items-end gap-2 mb-1">
                                        <span className="text-[32px] font-bold leading-none" style={{ color: m.color }}>{m.value}</span>
                                        <span className={`text-[11px] font-mono mb-1 ${m.trend.startsWith("+") ? "text-green-400" : "text-red-400"}`}>{m.trend}</span>
                                    </div>
                                    <p className="text-[8px] font-mono text-slate-400">{m.period}</p>
                                    <div className="mt-3 h-8 flex items-end gap-0.5">
                                        {[40, 55, 48, 62, 58, 72, 68, 75, 82, 78, 85, 73].map((v, idx) => (
                                            <motion.div key={idx} initial={{ height: 0 }} animate={{ height: `${v}%` }} transition={{ delay: 0.3 + idx * 0.03 }}
                                                className="flex-1 rounded-t-sm" style={{ background: m.color + "40" }} />
                                        ))}
                                    </div>
                                </div>
                            </MgrCard>
                        </motion.div>
                    ))}
                </div>
            )}
        </ManagerPageLayout>
    );
}
