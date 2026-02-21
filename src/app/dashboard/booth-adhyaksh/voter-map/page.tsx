"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

function Icon({ name, className = "", size }: { name: string; className?: string; size?: number }) {
    return <span className={`material-symbols-outlined ${className}`} style={size ? { fontSize: size } : undefined}>{name}</span>;
}
function NavItem({ icon, label, active, href }: { icon: string; label: string; active?: boolean; href?: string }) {
    const router = useRouter();
    return (
        <button onClick={() => href && router.push(href)} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-[11px] font-medium transition-all ${active ? "bg-[rgba(201,168,76,0.12)] text-[#c9a84c]" : "text-[#f0ece3]/40 hover:text-[#f0ece3]/70 hover:bg-white/[0.03]"}`}>
            <Icon name={icon} size={16} /><span>{label}</span>
        </button>
    );
}

const sectors = [
    { name: "Mohalla Ganj", voters: 420, coverage: 78, contacted: 328, pending: 92, pp: "Ramesh Sharma", color: "#4ade80" },
    { name: "Ram Nagar", voters: 380, coverage: 62, contacted: 236, pending: 144, pp: "Sunil Verma", color: "#c9a84c" },
    { name: "Shanti Colony", voters: 290, coverage: 45, contacted: 131, pending: 159, pp: "Priya Gupta", color: "#f87171" },
    { name: "Gandhi Chowk", voters: 510, coverage: 84, contacted: 428, pending: 82, pp: "Amit Kumar", color: "#4ade80" },
    { name: "Nehru Market", voters: 350, coverage: 55, contacted: 193, pending: 157, pp: "Kavita Devi", color: "#c9a84c" },
    { name: "Subhash Marg", voters: 280, coverage: 91, contacted: 255, pending: 25, pp: "Deepak Singh", color: "#4ade80" },
    { name: "Patel Road", voters: 250, coverage: 38, contacted: 95, pending: 155, pp: "Unassigned", color: "#f87171" },
];

export default function VoterMapPage() {
    const [selectedSector, setSelectedSector] = useState(sectors[0]);
    const [showHeatmap, setShowHeatmap] = useState(false);

    return (
        <div className="flex h-screen bg-[#08090f] text-[#f0ece3] overflow-hidden">
            {/* Sidebar */}
            <aside className="w-56 bg-[#111520] border-r border-[rgba(201,168,76,0.08)] flex flex-col shrink-0">
                <div className="p-4 border-b border-[rgba(201,168,76,0.08)]">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded bg-[#c9a84c]/20 flex items-center justify-center"><Icon name="assured_workload" size={14} className="text-[#c9a84c]" /></div>
                        <span className="font-serif text-sm font-bold tracking-wide">BOOTH ADHYAKSH</span>
                    </div>
                    <p className="text-[9px] text-white/25 font-mono tracking-widest ml-9">BOOTH #142</p>
                </div>
                <nav className="flex-1 p-3 space-y-1">
                    <p className="text-[8px] font-mono text-white/20 tracking-[3px] uppercase mb-2 px-3">Operations</p>
                    <NavItem icon="dashboard" label="Dashboard" href="/dashboard/booth-adhyaksh" />
                    <NavItem icon="map" label="Voter Map" active href="/dashboard/booth-adhyaksh/voter-map" />
                    <NavItem icon="groups" label="Worker Status" href="/dashboard/booth-adhyaksh/worker-status" />
                    <p className="text-[8px] font-mono text-white/20 tracking-[3px] uppercase mb-2 mt-4 px-3">Management</p>
                    <NavItem icon="calendar_month" label="Day Planner" />
                    <NavItem icon="bug_report" label="Issue Tracker" href="/dashboard/booth-adhyaksh/issue-tracker" />
                    <NavItem icon="task_alt" label="Campaign Tasks" />
                </nav>
                <div className="p-4 border-t border-[rgba(201,168,76,0.08)]">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full border-2 border-[#c9a84c] bg-[#111520] flex items-center justify-center text-[10px] font-bold">AK</div>
                        <div><p className="text-[11px] font-bold">Arun Kumar</p><p className="text-[9px] text-white/30 font-mono">President · Booth #142</p></div>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto">
                <header className="sticky top-0 z-10 bg-[#08090f]/90 backdrop-blur-md border-b border-[rgba(201,168,76,0.08)] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="font-serif text-lg font-bold">Booth #142 Voter Map</h1>
                        <span className="text-[9px] font-mono bg-[#c9a84c]/10 text-[#c9a84c] px-2 py-0.5 rounded border border-[#c9a84c]/20">2,480 voters mapped</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-white/40">Heatmap</span>
                        <button onClick={() => setShowHeatmap(!showHeatmap)} className={`relative w-10 h-5 rounded-full transition-colors ${showHeatmap ? "bg-[#c9a84c]" : "bg-white/10"}`}>
                            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${showHeatmap ? "translate-x-5" : "translate-x-0.5"}`} />
                        </button>
                    </div>
                </header>

                <div className="p-6 flex gap-6">
                    {/* Map Area */}
                    <div className="flex-[2]">
                        <div className="bg-[#111520] rounded border border-[rgba(201,168,76,0.08)] p-1 relative" style={{ minHeight: 500 }}>
                            {/* Grid-based ward visualization */}
                            <div className="grid grid-cols-3 gap-2 p-4">
                                {sectors.map(s => (
                                    <button key={s.name} onClick={() => setSelectedSector(s)} className={`relative p-4 rounded-lg border transition-all ${selectedSector.name === s.name ? "border-[#c9a84c] bg-[#c9a84c]/5" : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"}`} style={{ minHeight: 120 }}>
                                        {/* Voter dots */}
                                        <div className="absolute inset-4 overflow-hidden">
                                            {Array.from({ length: Math.min(30, Math.round(s.voters / 15)) }).map((_, i) => (
                                                <span key={i} className="inline-block w-1.5 h-1.5 rounded-full m-0.5" style={{
                                                    backgroundColor: i < Math.round(s.coverage / 100 * 30) ? "#4ade80" : showHeatmap ? `rgba(249,115,22,${0.3 + Math.random() * 0.5})` : "rgba(255,255,255,0.1)",
                                                    opacity: showHeatmap ? 0.3 + (s.coverage / 100) * 0.7 : 1,
                                                }} />
                                            ))}
                                        </div>
                                        <div className="absolute bottom-2 left-3 right-3">
                                            <p className="text-[10px] font-bold truncate">{s.name}</p>
                                            <p className="text-[8px] font-mono text-white/30">{s.voters} voters · {s.coverage}%</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Legend */}
                            <div className="absolute bottom-3 left-4 flex items-center gap-4 bg-[#08090f]/80 backdrop-blur px-3 py-1.5 rounded">
                                <span className="flex items-center gap-1.5 text-[9px] text-white/50"><span className="w-2 h-2 rounded-full bg-[#4ade80]" />Contacted</span>
                                <span className="flex items-center gap-1.5 text-[9px] text-white/50"><span className="w-2 h-2 rounded-full bg-orange-400" />Pending</span>
                                <span className="flex items-center gap-1.5 text-[9px] text-white/50"><span className="w-2 h-2 rounded-full bg-[#f87171]" />Not Reached</span>
                                <span className="flex items-center gap-1.5 text-[9px] text-[#c9a84c]"><Icon name="star" size={10} />Key Voter</span>
                            </div>
                        </div>

                        {/* Coverage Bars */}
                        <div className="mt-4 bg-[#111520] rounded border border-[rgba(201,168,76,0.08)] p-4">
                            <h3 className="text-[10px] font-mono text-[#c9a84c] tracking-wider uppercase mb-3">Ward Coverage Summary</h3>
                            <div className="space-y-2">
                                {sectors.map(s => (
                                    <div key={s.name} className="flex items-center gap-3">
                                        <span className="text-[10px] w-28 text-white/50 truncate">{s.name}</span>
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
                        <div className="bg-[#111520] rounded border border-[rgba(201,168,76,0.08)] p-4">
                            <h3 className="text-[10px] font-mono text-[#c9a84c] tracking-wider uppercase mb-3">Filters</h3>
                            <div className="space-y-2">
                                {["Contacted", "Pending", "Key Voters"].map(f => (
                                    <label key={f} className="flex items-center gap-2 text-[11px] text-white/60 cursor-pointer">
                                        <input type="checkbox" defaultChecked className="accent-[#c9a84c]" />{f}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Selected Area Info */}
                        <div className="bg-[#111520] rounded border border-[rgba(201,168,76,0.08)] p-4">
                            <h3 className="text-[10px] font-mono text-[#c9a84c] tracking-wider uppercase mb-3">Selected Area</h3>
                            <h4 className="font-bold text-sm mb-2">{selectedSector.name}</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px]"><span className="text-white/40">Total Voters</span><span className="font-mono">{selectedSector.voters}</span></div>
                                <div className="flex justify-between text-[11px]"><span className="text-white/40">Contacted</span><span className="font-mono text-[#4ade80]">{selectedSector.contacted}</span></div>
                                <div className="flex justify-between text-[11px]"><span className="text-white/40">Pending</span><span className="font-mono text-orange-400">{selectedSector.pending}</span></div>
                                <div className="flex justify-between text-[11px]"><span className="text-white/40">Coverage</span><span className="font-mono font-bold" style={{ color: selectedSector.color }}>{selectedSector.coverage}%</span></div>
                                <div className="pt-2 border-t border-white/5">
                                    <p className="text-[9px] text-white/30 mb-1">Assigned PP</p>
                                    <p className="text-[11px] font-bold">{selectedSector.pp}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
