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

const alerts = [
    { id: 1, title: "Unusual Login Pattern", desc: "User admin_rk logged in from 3 different IPs (Delhi, Mumbai, Kolkata) within 10 minutes", risk: 94, type: "Security", color: "#f87171", icon: "shield", time: "3 min ago" },
    { id: 2, title: "Data Export Spike", desc: "340% increase in voter data exports from Booth #207 region. Normal baseline: 50/day, Current: 220/day", risk: 78, type: "Data", color: "#f97316", icon: "download", time: "15 min ago" },
    { id: 3, title: "API Rate Anomaly", desc: "/api/voters endpoint called 12,000 times in 1 hour. Normal rate: 200/hr. Source IP: 192.168.X.X", risk: 65, type: "Performance", color: "#eab308", icon: "api", time: "42 min ago" },
];

const events = [
    { day: "Mon", security: 2, data: 1, performance: 3, system: 0 },
    { day: "Tue", security: 1, data: 0, performance: 2, system: 1 },
    { day: "Wed", security: 0, data: 2, performance: 1, system: 0 },
    { day: "Thu", security: 3, data: 1, performance: 0, system: 2 },
    { day: "Fri", security: 1, data: 0, performance: 4, system: 0 },
    { day: "Sat", security: 0, data: 1, performance: 1, system: 1 },
    { day: "Today", security: 3, data: 1, performance: 1, system: 0 },
];

export default function AnomalyDetectionPage() {
    const [autoLock, setAutoLock] = useState(true);
    const [smsAlert, setSmsAlert] = useState(true);
    const [freezeExports, setFreezeExports] = useState(false);

    return (
        <div className="flex h-screen bg-[#08090f] text-[#f0ece3] overflow-hidden">
            <aside className="w-56 bg-[#111520] border-r border-[rgba(201,168,76,0.08)] flex flex-col shrink-0">
                <div className="p-4 border-b border-[rgba(201,168,76,0.08)]">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded bg-red-400/20 flex items-center justify-center"><Icon name="admin_panel_settings" size={14} className="text-red-400" /></div>
                        <span className="font-serif text-sm font-bold tracking-wide">SUPER ADMIN</span>
                    </div>
                    <p className="text-[9px] text-white/25 font-mono tracking-widest ml-9">SYSTEM CONTROL</p>
                </div>
                <nav className="flex-1 p-3 space-y-1">
                    <p className="text-[8px] font-mono text-white/20 tracking-[3px] uppercase mb-2 px-3">System</p>
                    <NavItem icon="dashboard" label="System Dashboard" href="/dashboard/super-admin" />
                    <NavItem icon="stream" label="Live Activity" />
                    <NavItem icon="group" label="User Management" href="/dashboard/super-admin/user-management" />
                    <p className="text-[8px] font-mono text-white/20 tracking-[3px] uppercase mb-2 mt-4 px-3">Security</p>
                    <NavItem icon="campaign" label="Campaign Monitor" />
                    <NavItem icon="psychology" label="Anomaly Detection" active href="/dashboard/super-admin/anomaly-detection" />
                    <NavItem icon="history" label="Audit Log Archive" href="/dashboard/super-admin/audit-log" />
                    <p className="text-[8px] font-mono text-white/20 tracking-[3px] uppercase mb-2 mt-4 px-3">Control</p>
                    <NavItem icon="lock" label="Platform Freeze" />
                    <NavItem icon="vpn_key" label="Access Control" />
                </nav>
            </aside>

            <main className="flex-1 overflow-y-auto">
                <header className="sticky top-0 z-10 bg-[#08090f]/90 backdrop-blur-md border-b border-[rgba(201,168,76,0.08)] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="font-serif text-lg font-bold">Anomaly Detection</h1>
                        <span className="text-[9px] font-mono bg-[#c9a84c]/10 text-[#c9a84c] px-2 py-0.5 rounded border border-[#c9a84c]/20 flex items-center gap-1"><Icon name="auto_awesome" size={10} />AI-Powered</span>
                        <span className="text-[9px] font-mono bg-red-400/10 text-red-400 px-2 py-0.5 rounded border border-red-400/20">{alerts.length} Active Alerts</span>
                    </div>
                </header>

                <div className="p-6">
                    {/* Alert Cards */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {alerts.map(a => (
                            <div key={a.id} className="bg-[#111520] rounded border-[2px] p-5" style={{ borderColor: a.color + "40" }}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: a.color + "15" }}>
                                        <Icon name={a.icon} size={20} style={{ color: a.color }} />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] text-white/25 font-mono">{a.time}</p>
                                        <p className="text-[8px] font-mono px-1.5 py-0.5 rounded mt-1" style={{ backgroundColor: a.color + "15", color: a.color }}>{a.type}</p>
                                    </div>
                                </div>
                                <h3 className="font-bold text-sm mb-1">{a.title}</h3>
                                <p className="text-[10px] text-white/40 mb-4 leading-relaxed">{a.desc}</p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[8px] text-white/25 mb-0.5">Risk Score</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${a.risk}%`, backgroundColor: a.color }} />
                                            </div>
                                            <span className="font-mono text-sm font-bold" style={{ color: a.color }}>{a.risk}/100</span>
                                        </div>
                                    </div>
                                    <button className="text-[11px] font-bold px-3 py-1.5 rounded border hover:opacity-80 transition-opacity" style={{ backgroundColor: a.color + "15", color: a.color, borderColor: a.color + "30" }}>
                                        {a.risk >= 90 ? "Investigate" : a.risk >= 70 ? "Review" : "Monitor"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-6">
                        {/* Timeline Chart */}
                        <div className="flex-[2] bg-[#111520] rounded border border-[rgba(201,168,76,0.08)] p-5">
                            <h3 className="text-[10px] font-mono text-[#c9a84c] tracking-wider uppercase mb-4">7-Day Anomaly Timeline</h3>
                            <div className="flex items-end gap-3 h-40">
                                {events.map((e, i) => {
                                    const total = e.security + e.data + e.performance + e.system;
                                    const maxH = 128;
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center">
                                            <div className="w-full flex flex-col-reverse gap-0.5" style={{ height: maxH }}>
                                                {e.security > 0 && <div className="rounded-sm" style={{ height: (e.security / 7) * maxH, backgroundColor: "#f87171" }} />}
                                                {e.data > 0 && <div className="rounded-sm" style={{ height: (e.data / 7) * maxH, backgroundColor: "#f97316" }} />}
                                                {e.performance > 0 && <div className="rounded-sm" style={{ height: (e.performance / 7) * maxH, backgroundColor: "#eab308" }} />}
                                                {e.system > 0 && <div className="rounded-sm" style={{ height: (e.system / 7) * maxH, backgroundColor: "#6b7280" }} />}
                                            </div>
                                            <span className="text-[8px] text-white/25 mt-2 font-mono">{e.day}</span>
                                            <span className="text-[8px] font-mono text-white/40">{total}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex items-center gap-4 mt-4 justify-center">
                                {[{ label: "Security", color: "#f87171" }, { label: "Data", color: "#f97316" }, { label: "Performance", color: "#eab308" }, { label: "System", color: "#6b7280" }].map(l => (
                                    <span key={l.label} className="flex items-center gap-1 text-[9px] text-white/30"><span className="w-2 h-2 rounded-sm" style={{ backgroundColor: l.color }} />{l.label}</span>
                                ))}
                            </div>
                        </div>

                        {/* Right Panel */}
                        <div className="flex-1 space-y-4">
                            {/* AI Model Status */}
                            <div className="bg-[#111520] rounded border border-[rgba(201,168,76,0.08)] p-4">
                                <h3 className="text-[10px] font-mono text-[#c9a84c] tracking-wider uppercase mb-3">AI Model Status</h3>
                                <div className="space-y-2 text-[11px]">
                                    <div className="flex justify-between"><span className="text-white/40">Last Trained</span><span className="font-mono text-[#4ade80]">2h ago</span></div>
                                    <div className="flex justify-between"><span className="text-white/40">Accuracy</span><span className="font-mono font-bold text-[#4ade80]">96.4%</span></div>
                                    <div className="flex justify-between"><span className="text-white/40">False Positive</span><span className="font-mono text-[#c9a84c]">3.2%</span></div>
                                    <div className="flex justify-between"><span className="text-white/40">Events/hr</span><span className="font-mono">1,247</span></div>
                                </div>
                            </div>

                            {/* Auto-Response Rules */}
                            <div className="bg-[#111520] rounded border border-[rgba(201,168,76,0.08)] p-4">
                                <h3 className="text-[10px] font-mono text-[#c9a84c] tracking-wider uppercase mb-3">Auto-Response Rules</h3>
                                <div className="space-y-3">
                                    {[
                                        { label: "Auto-lock on Critical", value: autoLock, toggle: () => setAutoLock(!autoLock) },
                                        { label: "Alert via SMS", value: smsAlert, toggle: () => setSmsAlert(!smsAlert) },
                                        { label: "Freeze exports on spike", value: freezeExports, toggle: () => setFreezeExports(!freezeExports) },
                                    ].map(r => (
                                        <div key={r.label} className="flex items-center justify-between">
                                            <span className="text-[11px] text-white/60">{r.label}</span>
                                            <button onClick={r.toggle} className={`relative w-9 h-5 rounded-full transition-colors ${r.value ? "bg-[#4ade80]" : "bg-white/10"}`}>
                                                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${r.value ? "translate-x-4" : "translate-x-0.5"}`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
