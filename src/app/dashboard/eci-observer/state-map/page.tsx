"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ECIPageLayout, { ECICard, ECISectionHeader, ECIKPI } from "@/components/eci/ECIPageLayout";

function Icon({ name, size = 16, className = "" }: { name: string; size?: number; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size }}>{name}</span>;
}
function Bar({ pct, color = "#f87171", h = 5 }: { pct: number; color?: string; h?: number }) {
    return (
        <div className="bg-white/5 rounded-full overflow-hidden" style={{ height: h }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} className="rounded-full" style={{ background: color, height: h }} />
        </div>
    );
}

const states = [
    { name: "Uttar Pradesh", abbr: "UP", turnout: 62, booths: 1240, violations: 34, evmOk: 99.8, observers: 186, forces: "CRPF + PAC", criticalBooths: 24, status: "HIGH ALERT" },
    { name: "Maharashtra", abbr: "MH", turnout: 58, booths: 890, violations: 12, evmOk: 100, observers: 134, forces: "CRPF + SRP", criticalBooths: 8, status: "NORMAL" },
    { name: "West Bengal", abbr: "WB", turnout: 71, booths: 670, violations: 8, evmOk: 100, observers: 101, forces: "CRPF + BSF", criticalBooths: 12, status: "NORMAL" },
    { name: "Tamil Nadu", abbr: "TN", turnout: 68, booths: 590, violations: 5, evmOk: 99.8, observers: 89, forces: "CRPF + TNSP", criticalBooths: 4, status: "NORMAL" },
    { name: "Bihar", abbr: "BR", turnout: 55, booths: 720, violations: 28, evmOk: 99.7, observers: 108, forces: "CRPF + SSB", criticalBooths: 32, status: "CAUTION" },
    { name: "Rajasthan", abbr: "RJ", turnout: 51, booths: 460, violations: 19, evmOk: 99.8, observers: 69, forces: "CRPF + RAC", criticalBooths: 14, status: "CAUTION" },
    { name: "Karnataka", abbr: "KA", turnout: 64, booths: 510, violations: 6, evmOk: 100, observers: 77, forces: "CRPF + KSRP", criticalBooths: 5, status: "NORMAL" },
    { name: "Delhi", abbr: "DL", turnout: 54, booths: 142, violations: 9, evmOk: 100, observers: 21, forces: "CRPF + DLP", criticalBooths: 6, status: "CAUTION" },
    { name: "Gujarat", abbr: "GJ", turnout: 61, booths: 480, violations: 7, evmOk: 100, observers: 72, forces: "CRPF + GSP", criticalBooths: 3, status: "NORMAL" },
    { name: "Madhya Pradesh", abbr: "MP", turnout: 63, booths: 530, violations: 11, evmOk: 99.9, observers: 80, forces: "CRPF + SAF", criticalBooths: 9, status: "NORMAL" },
    { name: "Andhra Pradesh", abbr: "AP", turnout: 66, booths: 420, violations: 4, evmOk: 100, observers: 63, forces: "CRPF + APSP", criticalBooths: 2, status: "NORMAL" },
    { name: "Jharkhand", abbr: "JH", turnout: 57, booths: 380, violations: 15, evmOk: 99.7, observers: 57, forces: "CRPF + JAP", criticalBooths: 18, status: "CAUTION" },
];

const statusColor: Record<string, string> = { "HIGH ALERT": "#f87171", CAUTION: "#fbbf24", NORMAL: "#4ade80" };
const overlayOptions = ["Turnout", "Violations", "EVM", "Observers", "Forces"];

export default function StateMapPage() {
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [overlay, setOverlay] = useState("Turnout");
    const selected = states.find(s => s.name === selectedState);

    const getOverlayColor = (s: typeof states[0]) => {
        if (overlay === "Turnout") return s.turnout > 65 ? "#4ade80" : s.turnout > 55 ? "#fbbf24" : "#f87171";
        if (overlay === "Violations") return s.violations > 20 ? "#f87171" : s.violations > 10 ? "#fbbf24" : "#4ade80";
        if (overlay === "EVM") return s.evmOk === 100 ? "#4ade80" : s.evmOk > 99.5 ? "#fbbf24" : "#f87171";
        if (overlay === "Observers") return "#818cf8";
        return "#60a5fa";
    };

    const getOverlayValue = (s: typeof states[0]) => {
        if (overlay === "Turnout") return `${s.turnout}%`;
        if (overlay === "Violations") return String(s.violations);
        if (overlay === "EVM") return `${s.evmOk}%`;
        if (overlay === "Observers") return String(s.observers);
        return s.forces.split(" + ")[0];
    };

    return (
        <ECIPageLayout title="State-wise Election Map" badge="🗺 28 STATES + 8 UTs" badgeColor="#60a5fa"
            actions={
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono text-white/20 mr-1">OVERLAY:</span>
                    {overlayOptions.map(o => (
                        <button key={o} onClick={() => setOverlay(o)}
                            className={`text-[9px] font-mono px-2.5 py-1 rounded-lg transition-all ${overlay === o ? "bg-red-500/15 text-red-400 border border-red-500/25" : "text-white/25 hover:text-white/50"}`}>{o}</button>
                    ))}
                </div>
            }
        >
            <div className="grid grid-cols-5 gap-3 mb-6">
                <ECIKPI icon="map" label="States Active" value="12" sub="Phase 2" color="#60a5fa" delay={0} />
                <ECIKPI icon="how_to_vote" label="Avg Turnout" value="60.8%" sub="National" color="#4ade80" delay={0.06} />
                <ECIKPI icon="warning" label="Alert Zones" value="4" sub="Require attention" color="#f87171" delay={0.12} />
                <ECIKPI icon="ballot" label="EVM Health" value="99.9%" sub="18.4K machines" color="#818cf8" delay={0.18} />
                <ECIKPI icon="groups" label="Observers" value="1,057" sub="All categories" color="#fbbf24" delay={0.24} />
            </div>

            <div className="grid grid-cols-[1fr_360px] gap-5">
                {/* State Grid */}
                <ECICard>
                    <ECISectionHeader title="Interactive State Grid" icon="grid_view"
                        action={<span className="text-[8px] font-mono text-white/20">Click state for details</span>} />
                    <div className="p-5 grid grid-cols-4 gap-3">
                        {states.map((s, i) => {
                            const hlColor = getOverlayColor(s);
                            return (
                                <motion.div key={s.abbr}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.04 }}
                                    onClick={() => setSelectedState(selectedState === s.name ? null : s.name)}
                                    className={`relative p-4 rounded-xl border cursor-pointer transition-all group ${selectedState === s.name ? "ring-1 ring-red-500/40 scale-[1.02]" : "hover:scale-[1.01]"}`}
                                    style={{ background: hlColor + "08", borderColor: hlColor + "20" }}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[18px] font-bold text-white/85">{s.abbr}</span>
                                        <span className="text-[7px] font-mono px-1.5 py-0.5 rounded" style={{ color: statusColor[s.status], background: statusColor[s.status] + "15" }}>{s.status}</span>
                                    </div>
                                    <Bar pct={overlay === "Turnout" ? s.turnout : overlay === "EVM" ? s.evmOk : (100 - s.violations)} color={hlColor} h={4} />
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-[9px] text-white/40 truncate">{s.name}</span>
                                        <span className="text-[11px] font-mono font-bold" style={{ color: hlColor }}>{getOverlayValue(s)}</span>
                                    </div>
                                    <div className="flex gap-2 mt-1.5 text-[8px] font-mono text-white/20">
                                        <span>{s.booths} booths</span>
                                        <span>·</span>
                                        <span>{s.observers} obs.</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </ECICard>

                {/* Details Panel */}
                <div className="space-y-4">
                    <AnimatePresence mode="wait">
                        {selected ? (
                            <motion.div key={selected.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                <ECICard>
                                    <div className="p-5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[22px] font-bold text-white/90" style={{ background: statusColor[selected.status] + "15", border: `1px solid ${statusColor[selected.status]}30` }}>{selected.abbr}</div>
                                            <div>
                                                <h3 className="text-[16px] text-white/90 font-semibold">{selected.name}</h3>
                                                <span className="text-[8px] font-mono" style={{ color: statusColor[selected.status] }}>{selected.status}</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            {[
                                                { l: "Turnout", v: `${selected.turnout}%`, c: selected.turnout > 60 ? "#4ade80" : "#fbbf24", i: "how_to_vote" },
                                                { l: "Violations", v: String(selected.violations), c: selected.violations > 20 ? "#f87171" : "#4ade80", i: "warning" },
                                                { l: "EVM Health", v: `${selected.evmOk}%`, c: selected.evmOk === 100 ? "#4ade80" : "#fbbf24", i: "ballot" },
                                                { l: "Observers", v: String(selected.observers), c: "#818cf8", i: "visibility" },
                                            ].map(d => (
                                                <div key={d.l} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                                                    <div className="flex items-center gap-1 mb-0.5"><Icon name={d.i} size={12} style={{ color: d.c }} /><span className="text-[8px] text-white/30">{d.l}</span></div>
                                                    <span className="text-[18px] font-bold" style={{ color: d.c }}>{d.v}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-2 text-[10px]">
                                            <div className="flex justify-between py-1.5 border-b border-white/[0.03]"><span className="text-white/35">Total Booths</span><span className="text-white/70 font-mono">{selected.booths.toLocaleString()}</span></div>
                                            <div className="flex justify-between py-1.5 border-b border-white/[0.03]"><span className="text-white/35">Critical Booths</span><span className="text-red-400 font-mono">{selected.criticalBooths}</span></div>
                                            <div className="flex justify-between py-1.5 border-b border-white/[0.03]"><span className="text-white/35">Security Forces</span><span className="text-white/70 font-mono">{selected.forces}</span></div>
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            <button className="flex-1 text-[9px] font-mono px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">VIEW BOOTHS</button>
                                            <button className="flex-1 text-[9px] font-mono px-3 py-2 rounded-lg bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 transition-all">VIEW REPORTS</button>
                                        </div>
                                    </div>
                                </ECICard>
                            </motion.div>
                        ) : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <ECICard>
                                    <div className="p-8 text-center">
                                        <Icon name="touch_app" size={32} className="text-white/10 mx-auto mb-2" />
                                        <p className="text-[11px] text-white/25">Click a state tile to view details</p>
                                    </div>
                                </ECICard>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <ECICard delay={0.2}>
                        <ECISectionHeader title="Alert Zones" icon="crisis_alert" />
                        <div className="p-4 space-y-2">
                            {states.filter(s => s.status !== "NORMAL").map((s, i) => (
                                <motion.div key={s.abbr} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05 }}
                                    className="p-3 rounded-lg border cursor-pointer hover:scale-[1.01] transition-all"
                                    style={{ background: statusColor[s.status] + "08", borderColor: statusColor[s.status] + "15" }}
                                    onClick={() => setSelectedState(s.name)}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[11px] text-white/75 font-medium">{s.name}</span>
                                        <span className="text-[7px] font-mono px-1.5 py-0.5 rounded" style={{ color: statusColor[s.status], background: statusColor[s.status] + "15" }}>{s.status}</span>
                                    </div>
                                    <div className="flex gap-3 text-[8px] font-mono text-white/25">
                                        <span>⚠ {s.violations} violations</span>
                                        <span>🏫 {s.criticalBooths} critical booths</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </ECICard>

                    <ECICard delay={0.25}>
                        <ECISectionHeader title="Force Deployment" icon="military_tech" />
                        <div className="p-4 space-y-2">
                            {[{ force: "CRPF", companies: 48, deployed: "All states", color: "#f87171" }, { force: "BSF", companies: 12, deployed: "Border states", color: "#fbbf24" }, { force: "State Police", companies: 180, deployed: "All states", color: "#60a5fa" }, { force: "Home Guard", companies: 95, deployed: "Urban areas", color: "#818cf8" }].map((f, i) => (
                                <div key={f.force} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: f.color }} /><span className="text-[10px] text-white/60">{f.force}</span></div>
                                    <span className="text-[9px] font-mono text-white/40">{f.companies} coy</span>
                                </div>
                            ))}
                        </div>
                    </ECICard>
                </div>
            </div>
        </ECIPageLayout>
    );
}
