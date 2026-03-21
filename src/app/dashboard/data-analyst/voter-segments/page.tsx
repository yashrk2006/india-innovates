"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useSidebar } from "@/components/data-analyst/SidebarContext";

function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;
}

const segments = [
    { name: "Youth (18-25)", size: "3.2L", pct: 24, sentiment: "+0.42", swing: "32%", issues: "Employment, Education", lean: "Swing", color: "#06b6d4" },
    { name: "Working Adults (25-45)", size: "4.8L", pct: 36, sentiment: "+0.18", swing: "18%", issues: "Roads, Health", lean: "Strong Base", color: "#10b981" },
    { name: "Senior (45-60)", size: "2.9L", pct: 22, sentiment: "+0.31", swing: "12%", issues: "Health, Pensions", lean: "Strong Base", color: "#1e293b" },
    { name: "Elderly (60+)", size: "1.1L", pct: 8, sentiment: "+0.55", swing: "8%", issues: "Health, Welfare", lean: "Strong Base", color: "#8b5cf6" },
    { name: "First-time Voters", size: "0.9L", pct: 7, sentiment: "+0.05", swing: "45%", issues: "Jobs, Digital", lean: "Undecided", color: "#f97316" },
    { name: "Women Voters", size: "6.2L", pct: 46, sentiment: "+0.28", swing: "22%", issues: "Safety, Water, Health", lean: "Moderate", color: "#ec4899" },
];
const leanStyle: Record<string, string> = { "Strong Base": "bg-[#10b981]/10 text-[#10b981]", Swing: "bg-[#06b6d4]/10 text-[#06b6d4]", Undecided: "bg-[#f97316]/10 text-[#f97316]", Moderate: "bg-[#1e293b]/10 text-[#1e293b]" };

const insights = [
    "Youth segment shows 23% increase in engagement after social media campaign launch in Week 12.",
    "Women voters in urban areas have 1.8x higher positive sentiment compared to rural counterparts.",
    "First-time voters show highest swing potential — targeted WhatsApp outreach recommended.",
];

export default function VoterSegmentsPage() {
    const [selectedSegment, setSelectedSegment] = useState(segments[0]);
    const { isOpen, setIsOpen } = useSidebar();

    return (
        <main className="flex-1 overflow-y-auto relative w-full h-full">
            <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-sm border-b border-[rgba(6,182,212,0.08)] px-4 sm:px-6 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button className="md:hidden text-slate-900" onClick={() => setIsOpen(!isOpen)}>
                        <Icon name="menu" />
                    </button>
                    <h1 className="font-serif text-lg font-bold">Voter Segments</h1>
                        <span className="text-[9px] font-mono bg-[#06b6d4]/10 text-[#06b6d4] px-2 py-0.5 rounded border border-[#06b6d4]/20">13.4L Voters Analyzed</span>
                    </div>
                </header>

                <div className="p-6 flex gap-6">
                    <div className="flex-[2]">
                        {/* Bubble chart */}
                        <div className="bg-white shadow-sm rounded border border-[rgba(6,182,212,0.08)] p-6 mb-4">
                            <h3 className="text-[10px] font-mono text-[#06b6d4] tracking-wider uppercase mb-4">Segment Distribution</h3>
                            <div className="flex items-end justify-center gap-6 h-48">
                                {segments.map(s => {
                                    const sz = 40 + s.pct * 2;
                                    return (
                                        <button key={s.name} onClick={() => setSelectedSegment(s)} className={`rounded-full flex items-center justify-center text-center transition-all hover:scale-110 ${selectedSegment.name === s.name ? "ring-2 ring-white/30" : ""}`} style={{ width: sz, height: sz, backgroundColor: s.color + "30", border: `2px solid ${s.color}60` }}>
                                            <div>
                                                <p className="text-[8px] font-mono font-bold" style={{ color: s.color }}>{s.pct}%</p>
                                                <p className="text-[6px] text-slate-500 leading-tight">{s.name.split(" ")[0]}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white shadow-sm rounded border border-[rgba(6,182,212,0.08)] overflow-hidden">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-white/5 text-slate-500 font-mono text-[9px] tracking-wider uppercase">
                                        <th className="text-left p-3">Segment</th>
                                        <th className="text-left p-3">Size</th>
                                        <th className="text-left p-3">%</th>
                                        <th className="text-left p-3">Sentiment</th>
                                        <th className="text-left p-3">Swing</th>
                                        <th className="text-left p-3">Top Issues</th>
                                        <th className="text-left p-3">Lean</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {segments.map(s => (
                                        <tr key={s.name} onClick={() => setSelectedSegment(s)} className={`border-b border-slate-200 hover:bg-white/[0.02] cursor-pointer transition-colors ${selectedSegment.name === s.name ? "bg-[#06b6d4]/5" : ""}`}>
                                            <td className="p-3 font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />{s.name}</td>
                                            <td className="p-3 font-mono">{s.size}</td>
                                            <td className="p-3 font-mono">{s.pct}%</td>
                                            <td className="p-3 font-mono text-[#10b981]">{s.sentiment}</td>
                                            <td className="p-3 font-mono text-[#06b6d4]">{s.swing}</td>
                                            <td className="p-3 text-slate-500">{s.issues}</td>
                                            <td className="p-3"><span className={`text-[9px] px-2 py-0.5 rounded ${leanStyle[s.lean]}`}>{s.lean}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        {/* Selected Detail */}
                        <div className="bg-white shadow-sm rounded border border-[rgba(6,182,212,0.08)] p-4">
                            <h3 className="text-[10px] font-mono text-[#06b6d4] tracking-wider uppercase mb-3">Selected Segment</h3>
                            <h4 className="font-bold text-sm mb-3" style={{ color: selectedSegment.color }}>{selectedSegment.name}</h4>
                            <div className="space-y-2 text-[11px]">
                                <div className="flex justify-between"><span className="text-slate-500">Population</span><span className="font-mono">{selectedSegment.size}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Share</span><span className="font-mono">{selectedSegment.pct}%</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Sentiment</span><span className="font-mono text-[#10b981]">{selectedSegment.sentiment}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Swing %</span><span className="font-mono text-[#06b6d4]">{selectedSegment.swing}</span></div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-white/5">
                                <p className="text-[9px] text-slate-500 mb-2">Income Distribution</p>
                                <div className="space-y-1">
                                    {[{ label: "< ₹2L", w: 30 }, { label: "₹2-5L", w: 45 }, { label: "₹5-10L", w: 18 }, { label: "> ₹10L", w: 7 }].map(i => (
                                        <div key={i.label} className="flex items-center gap-2">
                                            <span className="text-[8px] text-slate-500 w-12">{i.label}</span>
                                            <div className="flex-1 h-1.5 bg-white/5 rounded-full"><div className="h-full rounded-full" style={{ width: `${i.w}%`, backgroundColor: selectedSegment.color }} /></div>
                                            <span className="text-[8px] font-mono text-slate-500 w-6">{i.w}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* AI Insights */}
                        <div className="bg-white shadow-sm rounded border border-[rgba(6,182,212,0.08)] p-4">
                            <h3 className="text-[10px] font-mono text-[#06b6d4] tracking-wider uppercase mb-3 flex items-center gap-1.5"><Icon name="auto_awesome" size={12} className="text-[#06b6d4]" />AI Insights</h3>
                            <div className="space-y-3">
                                {insights.map((ins, i) => (
                                    <div key={i} className="flex gap-2">
                                        <span className="w-5 h-5 rounded-full bg-[#06b6d4]/10 flex items-center justify-center text-[8px] font-mono text-[#06b6d4] shrink-0">{i + 1}</span>
                                        <p className="text-[11px] text-slate-600 leading-relaxed">{ins}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <button className="w-full text-[11px] py-2 rounded bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/20 hover:bg-[#06b6d4]/20 font-bold">Export Segment Data</button>
                            <button className="w-full text-[11px] py-2 rounded bg-white/5 text-slate-500 border border-slate-200 hover:bg-white/10">Create Custom Segment</button>
                        </div>
                    </div>
                </div>
            </main>
    );
}
