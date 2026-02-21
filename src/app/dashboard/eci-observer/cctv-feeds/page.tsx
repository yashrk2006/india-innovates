"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ECIPageLayout, { ECICard, ECISectionHeader, ECIKPI } from "@/components/eci/ECIPageLayout";

function Icon({ name, size = 16, className = "" }: { name: string; size?: number; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size }}>{name}</span>;
}

/* ══════════════════════════════ DATA ══════════════════════════════ */

const feeds = [
    { id: "BTH-001", location: "Booth 142, Ward 12, Lucknow", status: "LIVE", activity: "Normal", voters: 45, quality: "HD", aiAlerts: 0, lastMotion: "5:10 PM" },
    { id: "BTH-002", location: "Booth 87, Ward 8, Lucknow", status: "LIVE", activity: "High Traffic", voters: 78, quality: "HD", aiAlerts: 2, lastMotion: "5:12 PM" },
    { id: "BTH-003", location: "Booth 211, Ward 15, Kanpur", status: "LIVE", activity: "Normal", voters: 32, quality: "SD", aiAlerts: 0, lastMotion: "5:08 PM" },
    { id: "BTH-004", location: "Booth 56, Ward 3, Varanasi", status: "ALERT", activity: "Suspicious", voters: 12, quality: "HD", aiAlerts: 3, lastMotion: "5:11 PM" },
    { id: "BTH-005", location: "Booth 163, Ward 9, Agra", status: "LIVE", activity: "Normal", voters: 51, quality: "HD", aiAlerts: 0, lastMotion: "5:05 PM" },
    { id: "BTH-006", location: "Booth 94, Ward 6, Prayagraj", status: "OFFLINE", activity: "No Feed", voters: 0, quality: "-", aiAlerts: 0, lastMotion: "-" },
    { id: "BTH-007", location: "Booth 128, Ward 11, Meerut", status: "LIVE", activity: "Normal", voters: 39, quality: "HD", aiAlerts: 0, lastMotion: "5:09 PM" },
    { id: "BTH-008", location: "Booth 72, Ward 4, Gorakhpur", status: "LIVE", activity: "Queue", voters: 67, quality: "SD", aiAlerts: 1, lastMotion: "5:13 PM" },
    { id: "BTH-009", location: "Booth 45, Ward 2, Bareilly", status: "ALERT", activity: "Crowd", voters: 89, quality: "HD", aiAlerts: 4, lastMotion: "5:14 PM" },
];

const aiDetections = [
    { time: "5:14 PM", camera: "BTH-009", type: "CROWD ANOMALY", desc: "Unusual crowd gathering detected (89 people in frame)", severity: "CRITICAL", confidence: 94 },
    { time: "5:12 PM", camera: "BTH-002", type: "UNKNOWN VEHICLE", desc: "Unregistered vehicle parked within 100m restricted zone", severity: "HIGH", confidence: 87 },
    { time: "5:11 PM", camera: "BTH-004", type: "SUSPICIOUS BEHAVIOR", desc: "Individual photographing voting booth interior", severity: "HIGH", confidence: 82 },
    { time: "5:08 PM", camera: "BTH-002", type: "QUEUE LENGTH", desc: "Queue exceeding 30-minute wait threshold", severity: "MEDIUM", confidence: 91 },
    { time: "5:05 PM", camera: "BTH-008", type: "RESTRICTED ZONE", desc: "Person with campaign material in 200m zone", severity: "MEDIUM", confidence: 78 },
    { time: "4:55 PM", camera: "BTH-004", type: "LOITERING", desc: "Same individuals loitering near booth for >45 min", severity: "HIGH", confidence: 85 },
    { time: "4:42 PM", camera: "BTH-009", type: "CROWD ANOMALY", desc: "Rapid crowd increase detected (50→85 in 10 min)", severity: "CRITICAL", confidence: 96 },
];

const cvigilFromCCTV = [
    { id: "CVG-4426", from: "BTH-009", desc: "Crowd anomaly auto-reported via AI", status: "PENDING", time: "5:14 PM" },
    { id: "CVG-4424", from: "BTH-004", desc: "Suspicious photography auto-flagged", status: "ASSIGNED", time: "5:11 PM" },
    { id: "CVG-4420", from: "BTH-002", desc: "Unauthorized vehicle — Flying Squad dispatched", status: "RESOLVED", time: "5:12 PM" },
];

const statusColor: Record<string, string> = { LIVE: "#4ade80", ALERT: "#f87171", OFFLINE: "#6b7280" };
const actColor: Record<string, string> = { Normal: "#4ade80", "High Traffic": "#fbbf24", Suspicious: "#f87171", "No Feed": "#6b7280", Queue: "#60a5fa", Crowd: "#f87171" };
const sevColor: Record<string, string> = { CRITICAL: "#f87171", HIGH: "#fbbf24", MEDIUM: "#60a5fa" };
const cvigilColor: Record<string, string> = { PENDING: "#f87171", ASSIGNED: "#fbbf24", RESOLVED: "#4ade80" };

export default function CCTVFeedsPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [filter, setFilter] = useState("ALL");
    const [selectedFeed, setSelectedFeed] = useState<string | null>(null);
    const [showAI, setShowAI] = useState(true);

    const filtered = filter === "ALL" ? feeds : feeds.filter(f => f.status === filter);

    return (
        <ECIPageLayout title="CCTV Surveillance Grid" badge="📹 9 CAMERAS" badgeColor="#4ade80"
            actions={
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowAI(!showAI)}
                        className={`text-[9px] font-mono px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${showAI ? "bg-purple-500/15 text-purple-400 border border-purple-500/25" : "text-white/30 border border-white/[0.06]"}`}
                    >
                        <Icon name="smart_toy" size={14} /> AI Detection {showAI ? "ON" : "OFF"}
                    </button>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded ${viewMode === "grid" ? "bg-red-500/15 text-red-400" : "text-white/30"} transition-colors`}><Icon name="grid_view" size={16} /></button>
                        <button onClick={() => setViewMode("list")} className={`p-1.5 rounded ${viewMode === "list" ? "bg-red-500/15 text-red-400" : "text-white/30"} transition-colors`}><Icon name="view_list" size={16} /></button>
                    </div>
                </div>
            }
        >
            <div className="grid grid-cols-5 gap-3 mb-6">
                <ECIKPI icon="videocam" label="Total Cameras" value="9" sub="3 constituencies" color="#60a5fa" delay={0} />
                <ECIKPI icon="check_circle" label="Online" value="7" sub="77.8% uptime" color="#4ade80" delay={0.06} />
                <ECIKPI icon="warning" label="Alert Feeds" value="2" sub="Needs review" color="#f87171" delay={0.12} />
                <ECIKPI icon="smart_toy" label="AI Detections" value={String(aiDetections.length)} sub="4 critical today" color="#818cf8" delay={0.18} />
                <ECIKPI icon="phone_in_talk" label="cVIGIL Auto" value="3" sub="From AI pipeline" color="#f472b6" delay={0.24} />
            </div>

            {/* Filter bar */}
            <div className="flex gap-2 mb-5">
                {["ALL", "LIVE", "ALERT", "OFFLINE"].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`text-[10px] font-mono px-3 py-1.5 rounded-lg transition-all ${filter === f ? "bg-red-500/15 text-red-400 border border-red-500/25" : "text-white/30 hover:text-white/60 border border-white/[0.06]"}`}
                    >{f} {f !== "ALL" && `(${feeds.filter(x => x.status === f).length})`}</button>
                ))}
            </div>

            <div className="grid grid-cols-[1fr_340px] gap-5">
                {/* Camera Grid */}
                <div className={viewMode === "grid" ? "grid grid-cols-3 gap-3" : "space-y-3"}>
                    {filtered.map((feed, i) => (
                        <motion.div
                            key={feed.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.04 }}
                            onClick={() => setSelectedFeed(selectedFeed === feed.id ? null : feed.id)}
                            className={`bg-[#0d1018] rounded-xl border overflow-hidden group cursor-pointer transition-all duration-300 ${selectedFeed === feed.id ? "ring-1 ring-red-500/30" : ""} ${feed.status === "ALERT" ? "border-red-500/25 hover:border-red-500/40" : feed.status === "OFFLINE" ? "border-white/5 opacity-60" : "border-white/[0.06] hover:border-white/[0.12]"}`}
                        >
                            {/* Video */}
                            <div className="relative aspect-video bg-[#0a0c16] overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                                    {feed.status !== "OFFLINE" && (
                                        <>
                                            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.015)_2px,rgba(255,255,255,0.015)_4px)]" />
                                            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
                                            {/* AI detection overlay */}
                                            {showAI && feed.aiAlerts > 0 && (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                    className="absolute inset-4 border-2 border-red-500/40 rounded-lg flex items-center justify-center"
                                                    style={{ boxShadow: "inset 0 0 20px rgba(248,113,113,0.1)" }}
                                                >
                                                    <div className="bg-red-500/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-red-500/30">
                                                        <span className="text-[10px] font-mono text-red-400 animate-pulse">⚠ AI Alert: {feed.aiAlerts} detection{feed.aiAlerts > 1 ? "s" : ""}</span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </>
                                    )}
                                    {feed.status === "OFFLINE" && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center"><Icon name="videocam_off" size={28} className="text-white/15" /><p className="text-[9px] text-white/15 mt-1 font-mono">NO SIGNAL</p></div>
                                        </div>
                                    )}
                                </div>
                                {/* HUD */}
                                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                                    <div className={`w-2 h-2 rounded-full ${feed.status === "LIVE" ? "bg-green-500 animate-pulse" : feed.status === "ALERT" ? "bg-red-500 animate-pulse" : "bg-gray-500"}`} />
                                    <span className="text-[8px] font-mono text-white/80 bg-black/50 px-1.5 py-0.5 rounded">{feed.status}</span>
                                </div>
                                <div className="absolute top-2 right-2 flex items-center gap-1">
                                    <span className="text-[7px] font-mono text-white/50 bg-black/50 px-1.5 py-0.5 rounded">{feed.quality}</span>
                                    {showAI && <span className="text-[7px] font-mono bg-purple-500/30 text-purple-300 px-1.5 py-0.5 rounded">AI</span>}
                                </div>
                                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                                    <span className="text-[8px] font-mono text-white/70 bg-black/50 px-1.5 py-0.5 rounded">{feed.id}</span>
                                    {feed.voters > 0 && <span className="text-[8px] font-mono text-white/50 bg-black/50 px-1.5 py-0.5 rounded">👤 {feed.voters}</span>}
                                </div>
                            </div>
                            {/* Info */}
                            <div className="px-3 py-2.5">
                                <p className="text-[11px] text-white/80 font-medium mb-1 truncate">{feed.location}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-mono" style={{ color: actColor[feed.activity] }}>{feed.activity}</span>
                                    <div className="flex gap-0.5">
                                        <button className="p-1 rounded hover:bg-white/5 text-white/20 hover:text-white/60 transition-colors"><Icon name="fullscreen" size={13} /></button>
                                        <button className="p-1 rounded hover:bg-white/5 text-white/20 hover:text-white/60 transition-colors"><Icon name="photo_camera" size={13} /></button>
                                        <button className="p-1 rounded hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-colors"><Icon name="flag" size={13} /></button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Right Panel */}
                <div className="space-y-4">
                    {/* AI Detection Log */}
                    <ECICard delay={0.15}>
                        <ECISectionHeader title="AI Detection Log" icon="smart_toy"
                            action={<span className="text-[7px] font-mono text-purple-400">Powered by BoothIQ Vision</span>} />
                        <div className="divide-y divide-white/[0.03] max-h-[280px] overflow-y-auto">
                            {aiDetections.map((d, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.04 }}
                                    className="px-4 py-3 hover:bg-white/[0.02] cursor-pointer transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ color: sevColor[d.severity], background: sevColor[d.severity] + "12" }}>{d.severity}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[7px] font-mono text-white/20 bg-white/5 px-1 py-0.5 rounded">{d.camera}</span>
                                            <span className="text-[7px] font-mono text-white/15">{d.time}</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-white/70 font-medium mb-0.5">{d.type}</p>
                                    <p className="text-[9px] text-white/40 leading-relaxed">{d.desc}</p>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${d.confidence}%`, background: d.confidence > 90 ? "#4ade80" : d.confidence > 80 ? "#fbbf24" : "#f87171" }} />
                                        </div>
                                        <span className="text-[7px] font-mono text-white/30">{d.confidence}% conf.</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </ECICard>

                    {/* cVIGIL Auto Reports */}
                    <ECICard delay={0.25}>
                        <ECISectionHeader title="cVIGIL Auto-Reports" icon="phone_in_talk"
                            action={<span className="text-[7px] font-mono text-fuchsia-400">AI → cVIGIL pipeline</span>} />
                        <div className="p-4 space-y-2.5">
                            {cvigilFromCCTV.map((c, i) => (
                                <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.06 }}
                                    className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] text-white/75 font-medium">{c.desc}</span>
                                        <span className="text-[7px] font-mono px-1.5 py-0.5 rounded" style={{ color: cvigilColor[c.status], background: cvigilColor[c.status] + "12" }}>{c.status}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[8px] font-mono text-white/25">
                                        <span>{c.id}</span>
                                        <span>📹 {c.from}</span>
                                        <span>🕐 {c.time}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </ECICard>

                    {/* Quick Actions */}
                    <ECICard delay={0.3}>
                        <ECISectionHeader title="Camera Controls" icon="settings" />
                        <div className="p-4 space-y-2">
                            {[
                                { label: "Request Playback", icon: "replay", color: "#60a5fa" },
                                { label: "Export Snapshots", icon: "download", color: "#4ade80" },
                                { label: "File cVIGIL Report", icon: "report", color: "#f87171" },
                                { label: "Request Replacement Camera", icon: "swap_horiz", color: "#fbbf24" },
                            ].map((a, i) => (
                                <motion.button key={a.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.05 }}
                                    className="w-full flex items-center gap-2.5 p-3 rounded-lg text-[10px] font-medium text-white/50 bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:text-white/80 transition-all text-left"
                                >
                                    <Icon name={a.icon} size={15} style={{ color: a.color }} />
                                    {a.label}
                                </motion.button>
                            ))}
                        </div>
                    </ECICard>
                </div>
            </div>
        </ECIPageLayout>
    );
}
