"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
        <div className="min-h-full pb-12">
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 py-5 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Voter Territory Intelligence</h1>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-black bg-orange-500/10 text-orange-600 px-2.5 py-1 rounded-full border border-orange-500/20">2,480 Voters Mapped</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Booth 142 Strategic Map</span>
                    </div>
                </div>
                <div className="flex items-center gap-6 bg-slate-100/50 p-2 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2 px-3">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Thermal Intel</span>
                        <button 
                            onClick={() => setShowHeatmap(!showHeatmap)} 
                            className={`relative w-10 h-5 rounded-full border-2 transition-all ${showHeatmap ? "bg-orange-500 border-orange-500" : "bg-slate-300 border-slate-300"}`}
                        >
                            <motion.span 
                                animate={{ x: showHeatmap ? 20 : 0 }}
                                className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow-sm" 
                            />
                        </button>
                    </div>
                </div>
            </header>

            <div className="p-8 flex gap-8">
                {/* Tactical Map Area */}
                <div className="flex-[2] space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-2 relative overflow-hidden"
                        style={{ minHeight: 600 }}
                    >
                        {/* Background Grid */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }} />

                        <div className="grid grid-cols-3 gap-4 p-6 relative z-10">
                            {sectors.map((s, idx) => (
                                <motion.button 
                                    key={s.name} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => setSelectedSector(s)} 
                                    className={`group relative p-6 rounded-3xl border-2 transition-all text-left ${
                                        selectedSector.name === s.name 
                                        ? "border-orange-500 bg-orange-500/5 shadow-xl shadow-orange-500/5" 
                                        : "border-slate-100 bg-white hover:border-orange-500/30 hover:bg-slate-50"
                                    }`} 
                                    style={{ minHeight: 180 }}
                                >
                                    {/* Abstract Voter Distribution */}
                                    <div className="grid grid-cols-5 gap-1.5 mb-6 opacity-40 group-hover:opacity-100 transition-opacity">
                                        {Array.from({ length: 15 }).map((_, i) => (
                                            <motion.div 
                                                key={i} 
                                                animate={showHeatmap ? { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] } : {}}
                                                transition={{ repeat: Infinity, duration: 2 + Math.random() * 2 }}
                                                className="size-2 rounded-full" 
                                                style={{
                                                    backgroundColor: i < Math.round(s.coverage / 100 * 15) ? "#10b981" : showHeatmap ? "#f97316" : "#e2e8f0"
                                                }} 
                                            />
                                        ))}
                                    </div>
                                    
                                    <div className="mt-auto">
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">{s.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.voters} Voters</p>
                                            <p className="text-[10px] font-black text-orange-500">{s.coverage}% Coverage</p>
                                        </div>
                                    </div>

                                    {selectedSector.name === s.name && (
                                        <motion.div 
                                            layoutId="map-selection"
                                            className="absolute inset-0 border-2 border-orange-500 rounded-3xl pointer-events-none"
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        {/* Tactical Legend */}
                        <div className="absolute bottom-6 left-6 flex items-center gap-6 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl border border-white/10">
                            <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Enlisted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Targeted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-slate-600" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Unreached</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Coverage Intelligence */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Saturation Analytics</h3>
                            <button className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Detailed Report</button>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            {sectors.slice(0, 4).map(s => (
                                <div key={s.name} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs font-black text-slate-700 uppercase">{s.name}</p>
                                        <p className="text-[10px] font-black text-orange-500">{s.coverage}%</p>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${s.coverage}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: s.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Intelligence Panel */}
                <div className="flex-1 space-y-6">
                    {/* Sector Intelligence */}
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={selectedSector.name}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Icon name="radar" size={120} />
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-[10px] font-black text-orange-500 tracking-[0.2em] uppercase mb-8">Sector Briefing</h3>
                                <h4 className="text-3xl font-black mb-2 tracking-tight">{selectedSector.name}</h4>
                                <div className="flex items-center gap-2 mb-8">
                                    <div className="size-2 rounded-full bg-emerald-500" />
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Strategic Priority: HIGH</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { label: "Total Voters", value: selectedSector.voters, icon: "groups" },
                                        { label: "Contacted", value: selectedSector.contacted, icon: "verified_user", color: "#10b981" },
                                        { label: "Pending Reach", value: selectedSector.pending, icon: "pending", color: "#f97316" },
                                        { label: "Signal Strength", value: `${selectedSector.coverage}%`, icon: "sensors", color: selectedSector.color },
                                    ].map((stat, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl">
                                            <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
                                                <Icon name={stat.icon} size={20} style={{ color: stat.color || "white" }} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">{stat.label}</p>
                                                <p className="text-lg font-black">{stat.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">Commanding Officer</p>
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-2xl bg-orange-500 text-slate-900 flex items-center justify-center font-black">
                                            {selectedSector.pp.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black">{selectedSector.pp}</p>
                                            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Senior Field Lead</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Quick Filters */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6">
                        <h3 className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-6">Tactical Filters</h3>
                        <div className="space-y-3">
                            {["Neutral Strongholds", "Supporter Territory", "Critical Swing Areas", "Unreached Zones"].map(f => (
                                <button key={f} className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-orange-500/50 transition-all group">
                                    <span className="text-[11px] font-bold text-slate-600">{f}</span>
                                    <div className="size-5 rounded-lg bg-orange-500 opacity-0 group-hover:opacity-10 transition-all" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
