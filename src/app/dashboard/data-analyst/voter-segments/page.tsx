"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

function Icon({ name, className = "", size }: { name: string; className?: string; size?: number }) {
    return <span className={`material-symbols-outlined ${className}`} style={size ? { fontSize: size } : undefined}>{name}</span>;
}
function NavItem({ icon, label, active, href }: { icon: string; label: string; active?: boolean; href?: string }) {
    const router = useRouter();
    return (
        <button onClick={() => href && router.push(href)} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-[11px] font-medium transition-all ${active ? "bg-[rgba(6,182,212,0.12)] text-[#06b6d4]" : "text-[#f0ece3]/40 hover:text-[#f0ece3]/70 hover:bg-white/[0.03]"}`}>
            <Icon name={icon} size={16} /><span>{label}</span>
        </button>
    );
}

const segments = [
    { name: "Youth (18-25)", size: "3.2L", pct: 24, sentiment: "+0.42", swing: "32%", issues: "Employment, Education", lean: "Swing", color: "#06b6d4" },
    { name: "Working Adults (25-45)", size: "4.8L", pct: 36, sentiment: "+0.18", swing: "18%", issues: "Roads, Health", lean: "Strong Base", color: "#4ade80" },
    { name: "Senior (45-60)", size: "2.9L", pct: 22, sentiment: "+0.31", swing: "12%", issues: "Health, Pensions", lean: "Strong Base", color: "#c9a84c" },
    { name: "Elderly (60+)", size: "1.1L", pct: 8, sentiment: "+0.55", swing: "8%", issues: "Health, Welfare", lean: "Strong Base", color: "#8b5cf6" },
    { name: "First-time Voters", size: "0.9L", pct: 7, sentiment: "+0.05", swing: "45%", issues: "Jobs, Digital", lean: "Undecided", color: "#f97316" },
    { name: "Women Voters", size: "6.2L", pct: 46, sentiment: "+0.28", swing: "22%", issues: "Safety, Water, Health", lean: "Moderate", color: "#ec4899" },
];
const leanStyle: Record<string, string> = { "Strong Base": "bg-[#4ade80]/10 text-[#4ade80]", Swing: "bg-[#06b6d4]/10 text-[#06b6d4]", Undecided: "bg-[#f97316]/10 text-[#f97316]", Moderate: "bg-[#c9a84c]/10 text-[#c9a84c]" };

const insights = [
    "Youth segment shows 23% increase in engagement after social media campaign launch in Week 12.",
    "Women voters in urban areas have 1.8x higher positive sentiment compared to rural counterparts.",
    "First-time voters show highest swing potential — targeted WhatsApp outreach recommended.",
];

export default function VoterSegmentsPage() {
    const [selectedSegment, setSelectedSegment] = useState(segments[0]);

    return (
        <div className="flex h-screen bg-[#08090f] text-[#f0ece3] overflow-hidden">
            <aside className="w-56 bg-[#111520] border-r border-[rgba(6,182,212,0.08)] flex flex-col shrink-0">
                <div className="p-4 border-b border-[rgba(6,182,212,0.08)]">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded bg-[#06b6d4]/20 flex items-center justify-center"><Icon name="analytics" size={14} className="text-[#06b6d4]" /></div>
                        <span className="font-serif text-sm font-bold tracking-wide">DATA ANALYST</span>
                    </div>
                    <p className="text-[9px] text-white/25 font-mono tracking-widest ml-9">INTELLIGENCE</p>
                </div>
                <nav className="flex-1 p-3 space-y-1">
                    <p className="text-[8px] font-mono text-white/20 tracking-[3px] uppercase mb-2 px-3">Analysis</p>
                    <NavItem icon="dashboard" label="Overview" href="/dashboard/data-analyst" />
                    <NavItem icon="hub" label="Knowledge Graph" />
                    <NavItem icon="donut_large" label="Voter Segments" active href="/dashboard/data-analyst/voter-segments" />
                    <NavItem icon="mood" label="Sentiment Engine" href="/dashboard/data-analyst/sentiment-engine" />
                    <p className="text-[8px] font-mono text-white/20 tracking-[3px] uppercase mb-2 mt-4 px-3">Models</p>
                    <NavItem icon="model_training" label="Predictive Model" />
                    <NavItem icon="share" label="Network Map" />
                    <p className="text-[8px] font-mono text-white/20 tracking-[3px] uppercase mb-2 mt-4 px-3">Export</p>
                    <NavItem icon="summarize" label="Generate Report" />
                    <NavItem icon="download" label="Data Export" />
                </nav>
            </aside>

            <main className="flex-1 overflow-y-auto">
                <header className="sticky top-0 z-10 bg-[#08090f]/90 backdrop-blur-md border-b border-[rgba(6,182,212,0.08)] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="font-serif text-lg font-bold">Voter Segments</h1>
                        <span className="text-[9px] font-mono bg-[#06b6d4]/10 text-[#06b6d4] px-2 py-0.5 rounded border border-[#06b6d4]/20">13.4L Voters Analyzed</span>
                    </div>
                </header>

                <div className="p-6 flex gap-6">
                    <div className="flex-[2]">
                        {/* Bubble chart */}
                        <div className="bg-[#111520] rounded border border-[rgba(6,182,212,0.08)] p-6 mb-4">
                            <h3 className="text-[10px] font-mono text-[#06b6d4] tracking-wider uppercase mb-4">Segment Distribution</h3>
                            <div className="flex items-end justify-center gap-6 h-48">
                                {segments.map(s => {
                                    const sz = 40 + s.pct * 2;
                                    return (
                                        <button key={s.name} onClick={() => setSelectedSegment(s)} className={`rounded-full flex items-center justify-center text-center transition-all hover:scale-110 ${selectedSegment.name === s.name ? "ring-2 ring-white/30" : ""}`} style={{ width: sz, height: sz, backgroundColor: s.color + "30", border: `2px solid ${s.color}60` }}>
                                            <div>
                                                <p className="text-[8px] font-mono font-bold" style={{ color: s.color }}>{s.pct}%</p>
                                                <p className="text-[6px] text-white/40 leading-tight">{s.name.split(" ")[0]}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-[#111520] rounded border border-[rgba(6,182,212,0.08)] overflow-hidden">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-white/5 text-white/30 font-mono text-[9px] tracking-wider uppercase">
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
                                        <tr key={s.name} onClick={() => setSelectedSegment(s)} className={`border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer transition-colors ${selectedSegment.name === s.name ? "bg-[#06b6d4]/5" : ""}`}>
                                            <td className="p-3 font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />{s.name}</td>
                                            <td className="p-3 font-mono">{s.size}</td>
                                            <td className="p-3 font-mono">{s.pct}%</td>
                                            <td className="p-3 font-mono text-[#4ade80]">{s.sentiment}</td>
                                            <td className="p-3 font-mono text-[#06b6d4]">{s.swing}</td>
                                            <td className="p-3 text-white/50">{s.issues}</td>
                                            <td className="p-3"><span className={`text-[9px] px-2 py-0.5 rounded ${leanStyle[s.lean]}`}>{s.lean}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        {/* Selected Detail */}
                        <div className="bg-[#111520] rounded border border-[rgba(6,182,212,0.08)] p-4">
                            <h3 className="text-[10px] font-mono text-[#06b6d4] tracking-wider uppercase mb-3">Selected Segment</h3>
                            <h4 className="font-bold text-sm mb-3" style={{ color: selectedSegment.color }}>{selectedSegment.name}</h4>
                            <div className="space-y-2 text-[11px]">
                                <div className="flex justify-between"><span className="text-white/40">Population</span><span className="font-mono">{selectedSegment.size}</span></div>
                                <div className="flex justify-between"><span className="text-white/40">Share</span><span className="font-mono">{selectedSegment.pct}%</span></div>
                                <div className="flex justify-between"><span className="text-white/40">Sentiment</span><span className="font-mono text-[#4ade80]">{selectedSegment.sentiment}</span></div>
                                <div className="flex justify-between"><span className="text-white/40">Swing %</span><span className="font-mono text-[#06b6d4]">{selectedSegment.swing}</span></div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-white/5">
                                <p className="text-[9px] text-white/30 mb-2">Income Distribution</p>
                                <div className="space-y-1">
                                    {[{ label: "< ₹2L", w: 30 }, { label: "₹2-5L", w: 45 }, { label: "₹5-10L", w: 18 }, { label: "> ₹10L", w: 7 }].map(i => (
                                        <div key={i.label} className="flex items-center gap-2">
                                            <span className="text-[8px] text-white/30 w-12">{i.label}</span>
                                            <div className="flex-1 h-1.5 bg-white/5 rounded-full"><div className="h-full rounded-full" style={{ width: `${i.w}%`, backgroundColor: selectedSegment.color }} /></div>
                                            <span className="text-[8px] font-mono text-white/30 w-6">{i.w}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* AI Insights */}
                        <div className="bg-[#111520] rounded border border-[rgba(6,182,212,0.08)] p-4">
                            <h3 className="text-[10px] font-mono text-[#06b6d4] tracking-wider uppercase mb-3 flex items-center gap-1.5"><Icon name="auto_awesome" size={12} className="text-[#06b6d4]" />AI Insights</h3>
                            <div className="space-y-3">
                                {insights.map((ins, i) => (
                                    <div key={i} className="flex gap-2">
                                        <span className="w-5 h-5 rounded-full bg-[#06b6d4]/10 flex items-center justify-center text-[8px] font-mono text-[#06b6d4] shrink-0">{i + 1}</span>
                                        <p className="text-[11px] text-white/60 leading-relaxed">{ins}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <button className="w-full text-[11px] py-2 rounded bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/20 hover:bg-[#06b6d4]/20 font-bold">Export Segment Data</button>
                            <button className="w-full text-[11px] py-2 rounded bg-white/5 text-white/50 border border-white/10 hover:bg-white/10">Create Custom Segment</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
