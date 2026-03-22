"use client";

import { useState } from "react";

function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;
}


const sectors = [
    { name: "Mohalla Ganj", voters: 420, coverage: 78, contacted: 328, pending: 92, pp: "Ramesh Sharma", color: "#10b981" },
    { name: "Ram Nagar", voters: 380, coverage: 62, contacted: 236, pending: 144, pp: "Sunil Verma", color: "#1e293b" },
    { name: "Shanti Colony", voters: 290, coverage: 45, contacted: 131, pending: 159, pp: "Priya Gupta", color: "#ef4444" },
    { name: "Gandhi Chowk", voters: 510, coverage: 84, contacted: 428, pending: 82, pp: "Amit Kumar", color: "#10b981" },
    { name: "Nehru Market", voters: 350, coverage: 55, contacted: 193, pending: 157, pp: "Kavita Devi", color: "#1e293b" },
    { name: "Subhash Marg", voters: 280, coverage: 91, contacted: 255, pending: 25, pp: "Deepak Singh", color: "#10b981" },
    { name: "Patel Road", voters: 250, coverage: 38, contacted: 95, pending: 155, pp: "Unassigned", color: "#ef4444" },
];

export default function VoterMapPage() {
    const [selectedSector, setSelectedSector] = useState(sectors[0]);
    const [showHeatmap, setShowHeatmap] = useState(false);

    return (
        <>
                <header className="sticky top-0 z-10 bg-stone-50/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="font-serif text-lg font-bold">Booth #142 Voter Map</h1>
                        <span className="text-[9px] font-mono bg-[#1e293b]/10 text-[#1e293b] px-2 py-0.5 rounded border border-[#1e293b]/20">2,480 voters mapped</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-500">Heatmap</span>
                        <button onClick={() => setShowHeatmap(!showHeatmap)} className={`relative w-10 h-5 rounded-full transition-colors ${showHeatmap ? "bg-[#1e293b]" : "bg-white/10"}`}>
                            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${showHeatmap ? "translate-x-5" : "translate-x-0.5"}`} />
                        </button>
                    </div>
                </header>

                <div className="p-6 flex gap-6">
                    {/* Map Area */}
                    <div className="flex-[2]">
                        <div className="bg-white shadow-sm rounded border border-slate-200 p-1 relative" style={{ minHeight: 500 }}>
                            {/* Grid-based ward visualization */}
                            <div className="grid grid-cols-3 gap-2 p-4">
                                {sectors.map(s => (
                                    <button key={s.name} onClick={() => setSelectedSector(s)} className={`relative p-4 rounded-lg border transition-all ${selectedSector.name === s.name ? "border-[#1e293b] bg-[#1e293b]/5" : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"}`} style={{ minHeight: 120 }}>
                                        {/* Voter dots */}
                                        <div className="absolute inset-4 overflow-hidden">
                                            {Array.from({ length: Math.min(30, Math.round(s.voters / 15)) }).map((_, i) => (
                                                <span key={i} className="inline-block w-1.5 h-1.5 rounded-full m-0.5" style={{
                                                    backgroundColor: i < Math.round(s.coverage / 100 * 30) ? "#10b981" : showHeatmap ? `rgba(249,115,22,${0.3 + Math.random() * 0.5})` : "rgba(30,41,59,0.1)",
                                                    opacity: showHeatmap ? 0.3 + (s.coverage / 100) * 0.7 : 1,
                                                }} />
                                            ))}
                                        </div>
                                        <div className="absolute bottom-2 left-3 right-3">
                                            <p className="text-[10px] font-bold truncate">{s.name}</p>
                                            <p className="text-[8px] font-mono text-slate-500">{s.voters} voters · {s.coverage}%</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Legend */}
                            <div className="absolute bottom-3 left-4 flex items-center gap-4 bg-stone-50/80 backdrop-blur px-3 py-1.5 rounded">
                                <span className="flex items-center gap-1.5 text-[9px] text-slate-500"><span className="w-2 h-2 rounded-full bg-[#10b981]" />Contacted</span>
                                <span className="flex items-center gap-1.5 text-[9px] text-slate-500"><span className="w-2 h-2 rounded-full bg-orange-400" />Pending</span>
                                <span className="flex items-center gap-1.5 text-[9px] text-slate-500"><span className="w-2 h-2 rounded-full bg-[#ef4444]" />Not Reached</span>
                                <span className="flex items-center gap-1.5 text-[9px] text-[#1e293b]"><Icon name="star" size={10} />Key Voter</span>
                            </div>
                        </div>

                        {/* Coverage Bars */}
                        <div className="mt-4 bg-white shadow-sm rounded border border-slate-200 p-4">
                            <h3 className="text-[10px] font-mono text-[#1e293b] tracking-wider uppercase mb-3">Ward Coverage Summary</h3>
                            <div className="space-y-2">
                                {sectors.map(s => (
                                    <div key={s.name} className="flex items-center gap-3">
                                        <span className="text-[10px] w-28 text-slate-500 truncate">{s.name}</span>
                                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all" style={{ width: `${s.coverage}%`, backgroundColor: s.color }} />
                                        </div>
                                        <span className="text-[10px] font-mono w-10 text-right" style={{ color: s.color }}>{s.coverage}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="flex-1 space-y-4">
                        {/* Filters */}
                        <div className="bg-white shadow-sm rounded border border-slate-200 p-4">
                            <h3 className="text-[10px] font-mono text-[#1e293b] tracking-wider uppercase mb-3">Filters</h3>
                            <div className="space-y-2">
                                {["Contacted", "Pending", "Key Voters"].map(f => (
                                    <label key={f} className="flex items-center gap-2 text-[11px] text-slate-600 cursor-pointer">
                                        <input type="checkbox" defaultChecked className="accent-[#1e293b]" />{f}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Selected Area Info */}
                        <div className="bg-white shadow-sm rounded border border-slate-200 p-4">
                            <h3 className="text-[10px] font-mono text-[#1e293b] tracking-wider uppercase mb-3">Selected Area</h3>
                            <h4 className="font-bold text-sm mb-2">{selectedSector.name}</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px]"><span className="text-slate-500">Total Voters</span><span className="font-mono">{selectedSector.voters}</span></div>
                                <div className="flex justify-between text-[11px]"><span className="text-slate-500">Contacted</span><span className="font-mono text-[#10b981]">{selectedSector.contacted}</span></div>
                                <div className="flex justify-between text-[11px]"><span className="text-slate-500">Pending</span><span className="font-mono text-orange-400">{selectedSector.pending}</span></div>
                                <div className="flex justify-between text-[11px]"><span className="text-slate-500">Coverage</span><span className="font-mono font-bold" style={{ color: selectedSector.color }}>{selectedSector.coverage}%</span></div>
                                <div className="pt-2 border-t border-white/5">
                                    <p className="text-[9px] text-slate-500 mb-1">Assigned PP</p>
                                    <p className="text-[11px] font-bold">{selectedSector.pp}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    );
}
