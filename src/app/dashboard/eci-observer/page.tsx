"use client";


import Link from "next/link";
import { useRouter } from "next/navigation";

/* ── Icon helper ── */
function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;
}

/* ── KPI Card ── */
function KPI({ icon, label, value, sub, color = "var(--gold)" }: { icon: string; label: string; value: string; sub?: string; color?: string }) {
    return (
        <div className="bg-[#111520] border border-[rgba(201,168,76,0.14)] rounded p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#f0ece3]/25 mb-2">{label}</p>
                    <p className="font-serif text-[28px] font-bold text-[#f0ece3] leading-none">{value}</p>
                    {sub && <p className="font-mono text-[9px] mt-1.5" style={{ color }}>{sub}</p>}
                </div>
                <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: color + "18", border: `1px solid ${color}30` }}>
                    <Icon name={icon} size={14} className="text-[#c9a84c]" />
                </div>
            </div>
        </div>
    );
}

/* ── Progress Bar ── */
function Bar({ pct, color = "var(--gold)", h = 4 }: { pct: number; color?: string; h?: number }) {
    return (
        <div className="bg-[rgba(255,255,255,0.05)] rounded-sm overflow-hidden" style={{ height: h }}>
            <div className="rounded-sm transition-all duration-1000 ease-out" style={{ width: `${pct}%`, background: color, height: h }} />
        </div>
    );
}

/* ── Sidebar Nav Item ── */
function NavItem({ icon, label, active = false, href = "#" }: { icon: string; label: string; active?: boolean; href?: string }) {
    return (
        <Link href={href} className={`flex items-center gap-2.5 px-3.5 py-2 rounded text-[11px] font-mono tracking-[0.5px] border-l-2 transition-all cursor-pointer select-none ${active ? "text-[#c9a84c] bg-[rgba(201,168,76,0.12)] border-l-[#c9a84c]" : "text-[#f0ece3]/25 border-l-transparent hover:text-[#f0ece3]/65 hover:bg-[#f0ece3]/[0.03] hover:border-l-[rgba(201,168,76,0.14)]"}`}>
            <Icon name={icon} size={16} />
            <span>{label}</span>
        </Link>
    );
}

function NavLabel({ text }: { text: string }) {
    return <p className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#f0ece3]/25 px-3.5 pt-3 pb-1">{text}</p>;
}

/* ══════════════════════════════════════════════════════════
   ECI OBSERVER – National Oversight Dashboard
   ══════════════════════════════════════════════════════════ */
export default function ECIObserverDashboard() {
    const router = useRouter();

    const handleLogout = () => {
        document.cookie = "user_role=; path=/; max-age=0";
        router.push("/auth?role=eci-observer");
    };

    /* Mock Data */
    const stateData = [
        { state: "Uttar Pradesh", booths: "1,64,000", turnout: 62, violations: 14, status: "MONITORED" },
        { state: "Maharashtra", booths: "96,400", turnout: 58, violations: 8, status: "CLEAR" },
        { state: "Tamil Nadu", booths: "68,700", turnout: 71, violations: 3, status: "CLEAR" },
        { state: "West Bengal", booths: "78,300", turnout: 65, violations: 22, status: "ALERT" },
        { state: "Bihar", booths: "72,800", turnout: 54, violations: 18, status: "ALERT" },
        { state: "Rajasthan", booths: "52,100", turnout: 59, violations: 5, status: "CLEAR" },
        { state: "Karnataka", booths: "58,400", turnout: 63, violations: 9, status: "MONITORED" },
        { state: "Madhya Pradesh", booths: "54,600", turnout: 61, violations: 7, status: "CLEAR" },
    ];

    const violations = [
        { time: "14:58", type: "EVM Tamper Alert", loc: "Booth 142, WB", severity: "CRITICAL", icon: "error" },
        { time: "14:42", type: "Voter Intimidation", loc: "Ward 8, Bihar", severity: "HIGH", icon: "warning" },
        { time: "14:30", type: "Camera Offline", loc: "Booth 89, UP", severity: "MEDIUM", icon: "videocam_off" },
        { time: "14:18", type: "Booth Unattended", loc: "Booth 205, WB", severity: "HIGH", icon: "person_off" },
        { time: "14:05", type: "Polling Delay", loc: "Ward 3, Bihar", severity: "MEDIUM", icon: "schedule" },
        { time: "13:50", type: "ID Mismatch", loc: "Booth 67, UP", severity: "LOW", icon: "badge" },
    ];

    const severityColor: Record<string, string> = {
        CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: "#fbbf24", LOW: "#6b7280"
    };

    const statusColor: Record<string, string> = {
        CLEAR: "#4ade80", MONITORED: "#c9a84c", ALERT: "#f87171"
    };

    const statusBg: Record<string, string> = {
        CLEAR: "rgba(74,222,128,0.08)", MONITORED: "rgba(201,168,76,0.12)", ALERT: "rgba(248,113,113,0.08)"
    };

    /* Turnout Hourly Data */
    const hourlyTurnout = [
        { hour: "7AM", pct: 4 }, { hour: "8AM", pct: 12 }, { hour: "9AM", pct: 22 },
        { hour: "10AM", pct: 35 }, { hour: "11AM", pct: 44 }, { hour: "12PM", pct: 51 },
        { hour: "1PM", pct: 55 }, { hour: "2PM", pct: 60 }, { hour: "3PM", pct: 65 },
    ];

    return (
        <div className="flex h-screen bg-[#08090f] text-[#f0ece3] overflow-hidden" style={{ fontFamily: "'Public Sans', 'Literata', serif" }}>
            {/* ─── Left Sidebar ─── */}
            <aside className="w-64 bg-[#0d0f1a] border-r border-[rgba(201,168,76,0.14)] flex flex-col flex-shrink-0">
                <div className="p-5 border-b border-[rgba(255,255,255,0.05)]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-[#08090f]">
                            <Icon name="visibility" size={18} />
                        </div>
                        <div>
                            <h1 className="text-white text-sm font-bold tracking-tight leading-none">ECI OBSERVER</h1>
                            <span className="text-[9px] font-mono text-white/50 tracking-[2px] uppercase">Oversight Panel</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto">
                    <NavLabel text="Overview" />
                    <NavItem icon="dashboard" label="Command Center" active />
                    <NavItem icon="map" label="State Map" />
                    <NavItem icon="query_stats" label="Turnout Monitor" />

                    <NavLabel text="Compliance" />
                    <NavItem icon="shield" label="Violation Tracker" />
                    <NavItem icon="videocam" label="CCTV Feeds" />
                    <NavItem icon="gavel" label="Code Violations" />

                    <NavLabel text="Reports" />
                    <NavItem icon="assessment" label="Interim Reports" />
                    <NavItem icon="archive" label="Final Submissions" />
                </nav>

                <div className="p-4 border-t border-[rgba(255,255,255,0.05)]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#111520] border border-white/20 flex items-center justify-center text-white font-serif font-bold text-sm">
                            SR
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-medium truncate">S. Raghunath</p>
                            <p className="text-[#f0ece3]/25 text-[9px] font-mono truncate">Gen. Observer</p>
                        </div>
                        <button onClick={handleLogout} className="text-[#f0ece3]/25 hover:text-red-400 transition-colors">
                            <Icon name="logout" size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* ─── Main Content ─── */}
            <main className="flex-1 overflow-y-auto">
                <header className="sticky top-0 z-40 bg-[#08090f]/95 backdrop-blur-sm border-b border-[rgba(255,255,255,0.05)] px-6 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-white text-lg font-serif font-bold">National Oversight Command</h2>
                        <span className="font-mono text-[9px] text-[#f87171] tracking-[1.5px] uppercase bg-[rgba(248,113,113,0.08)] px-2 py-0.5 rounded border border-[rgba(248,113,113,0.2)]">
                            ● {violations.length} ACTIVE ALERTS
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-[#f0ece3]/40">Phase III · 15:02 IST</span>
                        <button className="font-mono text-[10px] tracking-[1px] uppercase bg-[#e8761a] hover:bg-[#e8761a]/90 text-white px-4 py-1.5 rounded transition-all">
                            File Report
                        </button>
                    </div>
                </header>

                <div className="p-6 space-y-6">
                    {/* ── KPI Row ── */}
                    <div className="grid grid-cols-6 gap-4">
                        <KPI icon="how_to_vote" label="Total Electors" value="96.8Cr" sub="2024 General" />
                        <KPI icon="ballot" label="National Turnout" value="60.2%" sub="↑ 2.1% from 2019" color="#4ade80" />
                        <KPI icon="location_on" label="Booths Active" value="10.5L" sub="of 10.6L total" color="#c9a84c" />
                        <KPI icon="error" label="Total Violations" value="86" sub="14 Critical" color="#f87171" />
                        <KPI icon="videocam" label="CCTV Active" value="98.7%" sub="1,342 offline" color="#e8761a" />
                        <KPI icon="verified_user" label="VVPAT Verified" value="99.4%" sub="All within margin" color="#4ade80" />
                    </div>

                    {/* ── Main Grid ── */}
                    <div className="grid grid-cols-[1.4fr_1fr] gap-6">
                        {/* Left: State-wise Table */}
                        <div className="bg-[#111520] border border-[rgba(201,168,76,0.14)] rounded overflow-hidden">
                            <div className="bg-[#161b28] px-4 py-3 flex items-center justify-between border-b border-[rgba(255,255,255,0.05)]">
                                <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#c9a84c] flex items-center gap-2">
                                    <Icon name="public" size={12} /> State-wise Election Monitor
                                </h3>
                                <button className="font-mono text-[9px] tracking-[1px] uppercase text-[#f0ece3]/25 hover:text-[#c9a84c] border border-[rgba(255,255,255,0.05)] hover:border-[#c9a84c] px-3 py-1 rounded transition-all">
                                    Download
                                </button>
                            </div>
                            <div className="grid grid-cols-[1fr_100px_120px_80px_100px] gap-2 px-4 py-2.5 border-b border-[rgba(255,255,255,0.05)] font-mono text-[9px] tracking-[1px] uppercase text-[#f0ece3]/25">
                                <span>State</span>
                                <span>Booths</span>
                                <span>Turnout %</span>
                                <span>Violations</span>
                                <span>Status</span>
                            </div>
                            {stateData.map((s, i) => (
                                <div key={s.state} className={`grid grid-cols-[1fr_100px_120px_80px_100px] gap-2 px-4 py-2.5 border-b border-[rgba(255,255,255,0.03)] hover:bg-[#f0ece3]/[0.02] transition-colors cursor-pointer items-center ${i % 2 === 0 ? "" : "bg-[#0d0f1a]/30"}`}>
                                    <span className="text-[11px] text-white/80 font-medium">{s.state}</span>
                                    <span className="font-mono text-[11px] text-[#f0ece3]/50">{s.booths}</span>
                                    <div className="flex items-center gap-2">
                                        <Bar pct={s.turnout} color={s.turnout > 65 ? "#4ade80" : s.turnout > 55 ? "#c9a84c" : "#fbbf24"} h={3} />
                                        <span className="font-mono text-[10px] text-[#f0ece3]/40 w-8 text-right">{s.turnout}%</span>
                                    </div>
                                    <span className={`font-mono text-[11px] ${s.violations > 15 ? "text-[#f87171] font-bold" : s.violations > 10 ? "text-[#fbbf24]" : "text-[#f0ece3]/40"}`}>
                                        {s.violations}
                                    </span>
                                    <span className="font-mono text-[9px] tracking-[1px] uppercase px-2 py-0.5 rounded text-center" style={{ background: statusBg[s.status], color: statusColor[s.status], border: `1px solid ${statusColor[s.status]}30` }}>
                                        {s.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Right: Violation Feed */}
                        <div className="bg-[#111520] border border-[rgba(201,168,76,0.14)] rounded overflow-hidden">
                            <div className="bg-[#161b28] px-4 py-3 flex items-center justify-between border-b border-[rgba(255,255,255,0.05)]">
                                <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#f87171] flex items-center gap-2">
                                    <Icon name="gpp_maybe" size={12} /> Live Violation Feed
                                </h3>
                                <span className="font-mono text-[9px] text-[#f0ece3]/25">Auto-refresh</span>
                            </div>
                            <div className="divide-y divide-[rgba(255,255,255,0.03)]">
                                {violations.map((v, i) => (
                                    <div key={i} className="px-4 py-3 hover:bg-[#f0ece3]/[0.02] transition-colors cursor-pointer">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <Icon name={v.icon} size={14} style={{ color: severityColor[v.severity] }} />
                                            <span className="text-[11px] text-white font-medium flex-1">{v.type}</span>
                                            <span className="font-mono text-[8px] tracking-[1px] px-1.5 py-0.5 rounded" style={{ background: severityColor[v.severity] + "15", color: severityColor[v.severity], border: `1px solid ${severityColor[v.severity]}30` }}>
                                                {v.severity}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-[#f0ece3]/35 pl-5">
                                            <Icon name="location_on" size={10} />
                                            <span>{v.loc}</span>
                                            <span className="ml-auto font-mono text-[9px]">{v.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Bottom Row ── */}
                    <div className="grid grid-cols-[1fr_1fr] gap-6">
                        {/* Turnout Trend */}
                        <div className="bg-[#111520] border border-[rgba(201,168,76,0.14)] rounded overflow-hidden">
                            <div className="bg-[#161b28] px-4 py-3 border-b border-[rgba(255,255,255,0.05)]">
                                <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#c9a84c] flex items-center gap-2">
                                    <Icon name="trending_up" size={12} /> National Turnout Trend (Today)
                                </h3>
                            </div>
                            <div className="p-4">
                                <div className="flex items-end gap-4 h-36">
                                    {hourlyTurnout.map(h => (
                                        <div key={h.hour} className="flex flex-col items-center gap-1 flex-1">
                                            <span className="font-mono text-[9px] text-[#c9a84c]">{h.pct}%</span>
                                            <div className="w-full bg-[rgba(255,255,255,0.05)] rounded-t overflow-hidden flex-1 flex items-end">
                                                <div className="w-full rounded-t transition-all duration-700" style={{ height: `${(h.pct / 70) * 100}%`, background: h.pct > 50 ? "#4ade80" : "#c9a84c" }} />
                                            </div>
                                            <span className="font-mono text-[8px] text-[#f0ece3]/25">{h.hour}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Phase Status */}
                        <div className="bg-[#111520] border border-[rgba(201,168,76,0.14)] rounded overflow-hidden">
                            <div className="bg-[#161b28] px-4 py-3 border-b border-[rgba(255,255,255,0.05)]">
                                <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#c9a84c] flex items-center gap-2">
                                    <Icon name="event_note" size={12} /> Election Phase Status
                                </h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {[
                                    { phase: "Phase I", date: "Feb 10", states: "UP·WB·GJ", status: "COMPLETED", pct: 100 },
                                    { phase: "Phase II", date: "Feb 15", states: "MH·TN·KA", status: "COMPLETED", pct: 100 },
                                    { phase: "Phase III", date: "Feb 20", states: "RJ·MP·BR", status: "IN PROGRESS", pct: 65 },
                                    { phase: "Phase IV", date: "Feb 25", states: "AP·KL·OR", status: "SCHEDULED", pct: 0 },
                                    { phase: "Phase V", date: "Mar 1", states: "AS·JH·HP", status: "SCHEDULED", pct: 0 },
                                ].map(p => (
                                    <div key={p.phase} className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${p.status === "COMPLETED" ? "bg-[#4ade80]" : p.status === "IN PROGRESS" ? "bg-[#c9a84c] animate-pulse" : "bg-[#f0ece3]/10"}`} />
                                        <span className="font-mono text-[10px] text-[#c9a84c] w-14">{p.phase}</span>
                                        <span className="font-mono text-[9px] text-[#f0ece3]/30 w-12">{p.date}</span>
                                        <span className="text-[10px] text-[#f0ece3]/40 w-20">{p.states}</span>
                                        <div className="flex-1">
                                            <Bar pct={p.pct} color={p.status === "COMPLETED" ? "#4ade80" : p.status === "IN PROGRESS" ? "#c9a84c" : "#f0ece3"} h={3} />
                                        </div>
                                        <span className={`font-mono text-[8px] tracking-[0.5px] w-16 text-right ${p.status === "COMPLETED" ? "text-[#4ade80]" : p.status === "IN PROGRESS" ? "text-[#c9a84c]" : "text-[#f0ece3]/20"}`}>
                                            {p.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
