"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useSidebar } from "@/components/data-analyst/SidebarContext";

/* ── Icon helper ── */
function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;
}

/* ── KPI Card ── */
function KPI({ icon, label, value, sub, color = "var(--gold)" }: { icon: string; label: string; value: string; sub?: string; color?: string }) {
    return (
        <div className="bg-white shadow-sm border border-slate-200 rounded p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-mono text-[9px] tracking-[2.5px] uppercase text-slate-700/25 mb-2">{label}</p>
                    <p className="font-serif text-[28px] font-bold text-slate-700 leading-none">{value}</p>
                    {sub && <p className="font-mono text-[9px] mt-1.5" style={{ color }}>{sub}</p>}
                </div>
                <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: color + "18", border: `1px solid ${color}30` }}>
                    <Icon name={icon} size={14} className="text-[#1e293b]" />
                </div>
            </div>
        </div>
    );
}

/* ── Progress Bar ── */
function Bar({ pct, color = "var(--gold)", h = 4 }: { pct: number; color?: string; h?: number }) {
    return (
        <div className="bg-[rgba(30,41,59,0.1)] rounded-sm overflow-hidden" style={{ height: h }}>
            <div className="rounded-sm transition-all duration-1000 ease-out" style={{ width: `${pct}%`, background: color, height: h }} />
        </div>
    );
}

/* ── Sidebar Nav Item ── */
function NavItem({ icon, label, active = false, href = "#" }: { icon: string; label: string; active?: boolean; href?: string }) {
    return (
        <Link href={href} className={`flex items-center gap-2.5 px-3.5 py-2 rounded text-[11px] font-mono tracking-[0.5px] border-l-2 transition-all cursor-pointer select-none ${active ? "text-[#1e293b] bg-[rgba(30,41,59,0.2)] border-l-[#1e293b]" : "text-slate-700/25 border-l-transparent hover:text-slate-700/65 hover:bg-[#334155]/[0.03] hover:border-l-[rgba(30,41,59,0.2)]"}`}>
            <Icon name={icon} size={16} />
            <span>{label}</span>
        </Link>
    );
}

function NavLabel({ text }: { text: string }) {
    return <p className="font-mono text-[9px] tracking-[2.5px] uppercase text-slate-700/25 px-3.5 pt-3 pb-1">{text}</p>;
}

/* ══════════════════════════════════════════════════════════
   DATA ANALYST – Intelligence Dashboard
   ══════════════════════════════════════════════════════════ */
export default function DataAnalystDashboard() {
    const router = useRouter();
    const [activeSegment, setActiveSegment] = useState("demographics");
    const { isOpen, setIsOpen } = useSidebar();

    /* Mock Data */
    const voterSegments = [
        { segment: "Youth (18-25)", voters: "2.4L", swing: 32, lean: "Neutral", sentiment: 0.52, growth: "+8%" },
        { segment: "Working (26-45)", voters: "5.1L", swing: 18, lean: "Favourable", sentiment: 0.71, growth: "+3%" },
        { segment: "Senior (46-65)", voters: "3.8L", swing: 12, lean: "Strong Base", sentiment: 0.85, growth: "+1%" },
        { segment: "Elderly (65+)", voters: "1.9L", swing: 8, lean: "Loyal", sentiment: 0.92, growth: "-2%" },
        { segment: "First-time Voters", voters: "89K", swing: 45, lean: "Undecided", sentiment: 0.41, growth: "+15%" },
        { segment: "Women (all ages)", voters: "6.2L", swing: 22, lean: "Moderate", sentiment: 0.63, growth: "+5%" },
    ];

    const trendData = [
        { month: "Sep", approval: 62, opposition: 38 },
        { month: "Oct", approval: 58, opposition: 42 },
        { month: "Nov", approval: 55, opposition: 45 },
        { month: "Dec", approval: 61, opposition: 39 },
        { month: "Jan", approval: 64, opposition: 36 },
        { month: "Feb", approval: 67, opposition: 33 },
    ];

    const issueData = [
        { issue: "Employment", importance: 92, sentiment: -0.3 },
        { issue: "Infrastructure", importance: 85, sentiment: 0.4 },
        { issue: "Healthcare", importance: 78, sentiment: 0.1 },
        { issue: "Education", importance: 74, sentiment: 0.5 },
        { issue: "Water Supply", importance: 71, sentiment: -0.2 },
        { issue: "Public Safety", importance: 68, sentiment: 0.2 },
        { issue: "Corruption", importance: 65, sentiment: -0.5 },
        { issue: "Agriculture", importance: 60, sentiment: 0.3 },
    ];

    const predictions = [
        { constituency: "Lucknow West", win_prob: 78, margin: "+12K", trend: "UP" },
        { constituency: "Lucknow East", win_prob: 65, margin: "+6K", trend: "STABLE" },
        { constituency: "Lucknow Central", win_prob: 52, margin: "+2K", trend: "DOWN" },
        { constituency: "Lucknow North", win_prob: 71, margin: "+9K", trend: "UP" },
        { constituency: "Lucknow South", win_prob: 44, margin: "-3K", trend: "DOWN" },
    ];

    const sentimentColor = (v: number) => v > 0.7 ? "#10b981" : v > 0.5 ? "#1e293b" : v > 0.3 ? "#f59e0b" : "#ef4444";
    const trendColor: Record<string, string> = { UP: "#10b981", STABLE: "#1e293b", DOWN: "#ef4444" };
    const trendIcon: Record<string, string> = { UP: "trending_up", STABLE: "trending_flat", DOWN: "trending_down" };

    return (
        <main className="flex-1 overflow-y-auto relative w-full h-full">
            <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-sm border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button className="md:hidden text-slate-900" onClick={() => setIsOpen(!isOpen)}>
                        <Icon name="menu" />
                        </button>
                        <h2 className="text-slate-900 text-base sm:text-lg font-serif font-bold truncate max-w-[150px] sm:max-w-none">Intelligence Dashboard</h2>
                        <span className="hidden sm:inline-block font-mono text-[9px] text-cyan-400 tracking-[1.5px] uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                            LIVE ANALYTICS
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            {["demographics", "sentiment", "predictive"].map(tab => (
                                <button key={tab} onClick={() => setActiveSegment(tab)} className={`font-mono text-[9px] tracking-[1px] uppercase px-3 py-1.5 rounded transition-all ${activeSegment === tab ? "bg-[#1e293b] text-[#f8fafc] font-bold" : "text-slate-700/30 hover:text-slate-700/60 border border-slate-200"}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                <div className="p-4 sm:p-6 space-y-6">
                    {/* ── KPI Row ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        <KPI icon="people" label="Total Voters" value="13.4L" sub="Lucknow District" />
                        <KPI icon="trending_up" label="Approval Rating" value="67%" sub="↑ 6pts from Oct" color="#10b981" />
                        <KPI icon="swap_horiz" label="Swing Voters" value="22%" sub="~2.9L voters" color="#f59e0b" />
                        <KPI icon="thumb_up" label="Net Sentiment" value="+0.34" sub="Positive trend" color="#1e293b" />
                        <KPI icon="trophy" label="Win Probability" value="72%" sub="Avg. across 5 seats" color="#e8761a" />
                    </div>

                    {/* ── Main Grid ── */}
                    <div className="flex flex-col xl:grid xl:grid-cols-[1.3fr_1fr] gap-6">
                        {/* Left: Voter Segmentation Table */}
                        <div className="bg-white shadow-sm border border-slate-200 rounded overflow-hidden">
                            <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-200">
                                <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#1e293b] flex items-center gap-2">
                                    <Icon name="donut_large" size={12} /> Voter Segmentation Analysis
                                </h3>
                                <button className="font-mono text-[9px] tracking-[1px] uppercase text-slate-700/25 hover:text-[#1e293b] border border-slate-200 hover:border-[#1e293b] px-3 py-1 rounded transition-all">
                                    Export
                                </button>
                            </div>
                            <div className="overflow-x-auto custom-scrollbar">
                                <div className="min-w-[600px]">
                                    <div className="grid grid-cols-[1fr_70px_80px_90px_90px_60px] gap-2 px-4 py-2.5 border-b border-slate-200 font-mono text-[9px] tracking-[1px] uppercase text-slate-700/25">
                                        <span>Segment</span>
                                        <span>Voters</span>
                                        <span>Swing %</span>
                                        <span>Lean</span>
                                        <span>Sentiment</span>
                                        <span>Growth</span>
                                    </div>
                                    {voterSegments.map((seg, i) => (
                                        <div key={seg.segment} className={`grid grid-cols-[1fr_70px_80px_90px_90px_60px] gap-2 px-4 py-3 border-b border-[rgba(30,41,59,0.1)] hover:bg-[#334155]/[0.02] transition-colors cursor-pointer items-center ${i % 2 === 0 ? "" : "bg-[#0d0f1a]/30"}`}>
                                            <span className="text-[11px] text-slate-700 font-medium">{seg.segment}</span>
                                            <span className="font-mono text-[11px] text-slate-700/50">{seg.voters}</span>
                                            <div className="flex items-center gap-1">
                                                <Bar pct={seg.swing} color={seg.swing > 30 ? "#f59e0b" : "#1e293b"} h={3} />
                                                <span className="font-mono text-[9px] text-slate-700/30 w-8 text-right">{seg.swing}%</span>
                                            </div>
                                            <span className={`text-[10px] ${seg.lean === "Strong Base" || seg.lean === "Loyal" ? "text-[#10b981]" : seg.lean === "Favourable" ? "text-[#1e293b]" : seg.lean === "Undecided" ? "text-[#f59e0b]" : "text-slate-700/40"}`}>
                                                {seg.lean}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <div className="w-3 h-3 rounded-full" style={{ background: sentimentColor(seg.sentiment) }} />
                                                <span className="font-mono text-[10px] text-slate-700/50">{seg.sentiment.toFixed(2)}</span>
                                            </div>
                                            <span className={`font-mono text-[10px] ${seg.growth.startsWith("+") ? "text-[#10b981]" : "text-[#ef4444]"}`}>{seg.growth}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Constituency Predictions */}
                        <div className="space-y-5">
                            <div className="bg-white shadow-sm border border-slate-200 rounded overflow-hidden">
                                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                                    <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#e8761a] flex items-center gap-2">
                                        <Icon name="casino" size={12} /> Win Probability Forecast
                                    </h3>
                                </div>
                                <div className="divide-y divide-[rgba(30,41,59,0.1)]">
                                    {predictions.map(p => (
                                        <div key={p.constituency} className="px-4 py-3 hover:bg-[#334155]/[0.02] transition-colors cursor-pointer">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[11px] text-slate-700 font-medium">{p.constituency}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <Icon name={trendIcon[p.trend]} size={14} style={{ color: trendColor[p.trend] }} />
                                                    <span className="font-mono text-[10px]" style={{ color: trendColor[p.trend] }}>{p.margin}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Bar pct={p.win_prob} color={p.win_prob > 65 ? "#10b981" : p.win_prob > 50 ? "#1e293b" : "#ef4444"} h={5} />
                                                <span className={`font-mono text-[11px] font-bold w-10 text-right ${p.win_prob > 65 ? "text-[#10b981]" : p.win_prob > 50 ? "text-[#1e293b]" : "text-[#ef4444]"}`}>
                                                    {p.win_prob}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Approval Trend */}
                            <div className="bg-white shadow-sm border border-slate-200 rounded overflow-hidden">
                                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                                    <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#1e293b] flex items-center gap-2">
                                        <Icon name="show_chart" size={12} /> 6-Month Approval Trend
                                    </h3>
                                </div>
                                <div className="p-4 overflow-x-auto custom-scrollbar">
                                    <div className="min-w-[400px]">
                                        <div className="flex items-end gap-3 h-28">
                                            {trendData.map(d => (
                                                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                                                    <span className="font-mono text-[9px] text-[#10b981]">{d.approval}%</span>
                                                    <div className="w-full flex flex-col gap-0.5 flex-1 justify-end">
                                                        <div className="w-full rounded-t bg-[#10b981]/80 transition-all" style={{ height: `${d.approval}%` }} />
                                                        <div className="w-full rounded-b bg-[#ef4444]/40 transition-all" style={{ height: `${d.opposition}%` }} />
                                                    </div>
                                                    <span className="font-mono text-[8px] text-slate-700/25">{d.month}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-center gap-4 mt-3">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-sm bg-[#10b981]/80" />
                                                <span className="font-mono text-[8px] text-slate-700/30">Approval</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-sm bg-[#ef4444]/40" />
                                                <span className="font-mono text-[8px] text-slate-700/30">Opposition</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Bottom: Issue Importance Radar ── */}
                    <div className="bg-white shadow-sm border border-slate-200 rounded overflow-hidden">
                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                            <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#1e293b] flex items-center gap-2">
                                <Icon name="priority_high" size={12} /> Issue Importance vs Sentiment
                            </h3>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {issueData.map(issue => (
                                    <div key={issue.issue} className="bg-[#0d0f1a] border border-[rgba(30,41,59,0.1)] rounded p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[11px] text-slate-600 font-medium">{issue.issue}</span>
                                            <div className={`w-2 h-2 rounded-full ${issue.sentiment > 0 ? "bg-[#10b981]" : "bg-[#ef4444]"}`} />
                                        </div>
                                        <Bar pct={issue.importance} color={issue.sentiment > 0 ? "#1e293b" : "#ef4444"} h={4} />
                                        <div className="flex justify-between mt-1.5">
                                            <span className="font-mono text-[8px] text-slate-700/25">IMP: {issue.importance}%</span>
                                            <span className={`font-mono text-[8px] ${issue.sentiment > 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                                                {issue.sentiment > 0 ? "+" : ""}{issue.sentiment.toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
    );
}
