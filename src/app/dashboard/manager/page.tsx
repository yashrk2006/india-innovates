"use client";


import Link from "next/link";
import { useRouter } from "next/navigation";

/* ── Icon helper ── */
function Icon({ name, className = "", size }: { name: string; className?: string; size?: number }) {
    return <span className={`material-symbols-outlined ${className}`} style={size ? { fontSize: size } : undefined}>{name}</span>;
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

/* ── Nav Section Label ── */
function NavLabel({ text }: { text: string }) {
    return <p className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#f0ece3]/25 px-3.5 pt-3 pb-1">{text}</p>;
}

/* ══════════════════════════════════════════════════════════
   MANAGER DASHBOARD – District Operations Hub
   ══════════════════════════════════════════════════════════ */
export default function ManagerDashboard() {
    const router = useRouter();
    const activeNav = "dashboard";

    const handleLogout = () => {
        document.cookie = "user_role=; path=/; max-age=0";
        router.push("/auth?role=manager");
    };

    /* Mock Data */
    const boothData = [
        { id: "B-001", ward: "Ward 12", workers: 4, doorsKnocked: 82, keyVoters: 3, issues: 1, status: "ACTIVE" },
        { id: "B-002", ward: "Ward 12", workers: 3, doorsKnocked: 65, keyVoters: 2, issues: 0, status: "ACTIVE" },
        { id: "B-003", ward: "Ward 14", workers: 2, doorsKnocked: 45, keyVoters: 1, issues: 3, status: "STALLED" },
        { id: "B-004", ward: "Ward 14", workers: 4, doorsKnocked: 91, keyVoters: 5, issues: 0, status: "ACTIVE" },
        { id: "B-005", ward: "Ward 15", workers: 3, doorsKnocked: 78, keyVoters: 2, issues: 1, status: "ACTIVE" },
        { id: "B-006", ward: "Ward 16", workers: 1, doorsKnocked: 12, keyVoters: 0, issues: 2, status: "OFFLINE" },
        { id: "B-007", ward: "Ward 16", workers: 4, doorsKnocked: 88, keyVoters: 4, issues: 0, status: "ACTIVE" },
        { id: "B-008", ward: "Ward 18", workers: 3, doorsKnocked: 56, keyVoters: 1, issues: 1, status: "ACTIVE" },
        { id: "B-009", ward: "Ward 19", workers: 2, doorsKnocked: 34, keyVoters: 0, issues: 4, status: "STALLED" },
        { id: "B-010", ward: "Ward 20", workers: 4, doorsKnocked: 95, keyVoters: 6, issues: 0, status: "ACTIVE" },
    ];

    const workerReports = [
        { time: "14:42", worker: "Rahul Verma", booth: "B-001", note: "3 new beneficiaries identified for PM Kisan" },
        { time: "14:28", worker: "Priya Singh", booth: "B-004", note: "B-045 gate locked, revisit scheduled for evening" },
        { time: "14:15", worker: "Amit Kumar", booth: "B-007", note: "Key voter Shri Sharma confirmed support" },
        { time: "13:58", worker: "Sita Devi", booth: "B-010", note: "Distributed 45 voter slips in Gali no. 4" },
        { time: "13:42", worker: "Vijay Pal", booth: "B-005", note: "Water pipeline complaint noted, forwarded to DC" },
        { time: "13:30", worker: "Neha Gupta", booth: "B-002", note: "Youth segment meeting arranged at community hall" },
    ];

    const wardData = [
        { name: "Ward 12", coverage: 87 },
        { name: "Ward 14", coverage: 62 },
        { name: "Ward 15", coverage: 78 },
        { name: "Ward 16", coverage: 55 },
        { name: "Ward 18", coverage: 71 },
        { name: "Ward 19", coverage: 42 },
        { name: "Ward 20", coverage: 93 },
        { name: "Ward 22", coverage: 68 },
    ];

    const statusColor: Record<string, string> = {
        ACTIVE: "#4ade80",
        STALLED: "#fbbf24",
        OFFLINE: "#f87171",
    };

    const statusBg: Record<string, string> = {
        ACTIVE: "rgba(21,128,61,0.12)",
        STALLED: "rgba(217,119,6,0.12)",
        OFFLINE: "rgba(159,18,57,0.15)",
    };

    return (
        <div className="flex h-screen bg-[#08090f] text-[#f0ece3] overflow-hidden" style={{ fontFamily: "'Public Sans', 'Literata', serif" }}>
            {/* ─── Left Sidebar ─── */}
            <aside className="w-64 bg-[#0d0f1a] border-r border-[rgba(201,168,76,0.14)] flex flex-col flex-shrink-0">
                {/* Logo */}
                <div className="p-5 border-b border-[rgba(255,255,255,0.05)]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-[#c9a84c] flex items-center justify-center text-[#08090f]">
                            <Icon name="campaign" size={18} />
                        </div>
                        <div>
                            <h1 className="text-white text-sm font-bold tracking-tight leading-none">DISTRICT ADMIN</h1>
                            <span className="text-[9px] font-mono text-[#c9a84c] tracking-[2px] uppercase">Lucknow</span>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto">
                    <NavLabel text="Operations" />
                    <NavItem icon="dashboard" label="Dashboard" active={activeNav === "dashboard"} />
                    <NavItem icon="location_on" label="Booth Monitor" />
                    <NavItem icon="group" label="Worker Tracker" />

                    <NavLabel text="Intelligence" />
                    <NavItem icon="monitoring" label="Voter Pulse" />
                    <NavItem icon="search_insights" label="Scheme Gaps" />

                    <NavLabel text="Admin" />
                    <NavItem icon="event" label="Events" />
                    <NavItem icon="summarize" label="Reports" />
                    <NavItem icon="settings" label="Settings" />
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-[rgba(255,255,255,0.05)]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#111520] border border-[rgba(201,168,76,0.14)] flex items-center justify-center text-[#c9a84c] font-serif font-bold text-sm">
                            RK
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-medium truncate">Rajesh Kumar</p>
                            <p className="text-[#f0ece3]/25 text-[9px] font-mono truncate">District Manager</p>
                        </div>
                        <button onClick={handleLogout} className="text-[#f0ece3]/25 hover:text-red-400 transition-colors">
                            <Icon name="logout" size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* ─── Main Content ─── */}
            <main className="flex-1 overflow-y-auto">
                {/* Header Bar */}
                <header className="sticky top-0 z-40 bg-[#08090f]/95 backdrop-blur-sm border-b border-[rgba(255,255,255,0.05)] px-6 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-white text-lg font-serif font-bold">District Operations Hub</h2>
                        <span className="font-mono text-[9px] text-[#c9a84c] tracking-[1.5px] uppercase bg-[rgba(201,168,76,0.12)] px-2 py-0.5 rounded border border-[rgba(201,168,76,0.14)]">
                            LIVE
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <select className="bg-[#111520] border border-[rgba(255,255,255,0.05)] rounded px-3 py-1.5 text-[#f0ece3]/65 font-mono text-[11px] outline-none focus:border-[#c9a84c] transition-colors cursor-pointer">
                            <option>All Constituencies</option>
                            <option>Lucknow West</option>
                            <option>Lucknow East</option>
                            <option>Lucknow Central</option>
                        </select>
                        <button className="font-mono text-[10px] tracking-[1px] uppercase bg-[#e8761a] hover:bg-[#e8761a]/90 text-white px-4 py-1.5 rounded transition-all">
                            Sync Data
                        </button>
                    </div>
                </header>

                <div className="p-6 space-y-6">
                    {/* ── KPI Row ── */}
                    <div className="grid grid-cols-5 gap-4">
                        <KPI icon="check_circle" label="Mandals Covered" value="8/8" sub="100% — On Track" color="#4ade80" />
                        <KPI icon="location_on" label="Total Booths" value="312" sub="All Active" />
                        <KPI icon="group" label="Workers Active" value="847" sub="847/890 — 95%" color="#c9a84c" />
                        <KPI icon="door_front" label="Voter Visits Today" value="4,200" sub="↑ 12% vs Yesterday" color="#e8761a" />
                        <KPI icon="pending_actions" label="Pending Sign-offs" value="14" sub="3 Critical" color="#fbbf24" />
                    </div>

                    {/* ── Main Grid ── */}
                    <div className="grid grid-cols-[1fr_0.8fr] gap-6">
                        {/* Left: Booth Performance Matrix */}
                        <div className="bg-[#111520] border border-[rgba(201,168,76,0.14)] rounded overflow-hidden">
                            <div className="bg-[#161b28] px-4 py-3 flex items-center justify-between border-b border-[rgba(255,255,255,0.05)]">
                                <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#c9a84c] flex items-center gap-2">
                                    <Icon name="grid_view" size={12} /> Booth Performance Matrix
                                </h3>
                                <button className="font-mono text-[9px] tracking-[1px] uppercase text-[#f0ece3]/25 hover:text-[#c9a84c] border border-[rgba(255,255,255,0.05)] hover:border-[#c9a84c] px-3 py-1 rounded transition-all">
                                    Export
                                </button>
                            </div>
                            {/* Table Header */}
                            <div className="grid grid-cols-[70px_80px_60px_1fr_80px_60px_80px] gap-2 px-4 py-2.5 border-b border-[rgba(255,255,255,0.05)] font-mono text-[9px] tracking-[1px] uppercase text-[#f0ece3]/25">
                                <span>Booth</span>
                                <span>Ward</span>
                                <span>Staff</span>
                                <span>Doors Knocked</span>
                                <span>Key Voters</span>
                                <span>Issues</span>
                                <span>Status</span>
                            </div>
                            {/* Table Rows */}
                            {boothData.map((booth, i) => (
                                <div key={booth.id} className={`grid grid-cols-[70px_80px_60px_1fr_80px_60px_80px] gap-2 px-4 py-2.5 border-b border-[rgba(255,255,255,0.03)] hover:bg-[#f0ece3]/[0.02] transition-colors cursor-pointer items-center ${i % 2 === 0 ? "bg-transparent" : "bg-[#0d0f1a]/30"}`}>
                                    <span className="font-mono text-[11px] text-[#c9a84c]">{booth.id}</span>
                                    <span className="text-[11px] text-[#f0ece3]/65">{booth.ward}</span>
                                    <span className="text-[11px] text-[#f0ece3]/65">{booth.workers}</span>
                                    <div className="flex items-center gap-2">
                                        <Bar pct={booth.doorsKnocked} h={3} />
                                        <span className="font-mono text-[10px] text-[#f0ece3]/40 w-8 text-right">{booth.doorsKnocked}%</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {[...Array(Math.min(booth.keyVoters, 5))].map((_, j) => (
                                            <Icon key={j} name="star" size={10} className="text-[#c9a84c]" />
                                        ))}
                                        {booth.keyVoters === 0 && <span className="text-[10px] text-[#f0ece3]/20">—</span>}
                                    </div>
                                    <span className={`font-mono text-[10px] ${booth.issues > 2 ? "text-[#f87171]" : booth.issues > 0 ? "text-[#fbbf24]" : "text-[#f0ece3]/25"}`}>
                                        {booth.issues}
                                    </span>
                                    <span className="font-mono text-[9px] tracking-[1px] uppercase px-2 py-0.5 rounded text-center" style={{ background: statusBg[booth.status], color: statusColor[booth.status], border: `1px solid ${statusColor[booth.status]}30` }}>
                                        {booth.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-5">
                            {/* Worker Activity Heatmap */}
                            <div className="bg-[#111520] border border-[rgba(201,168,76,0.14)] rounded overflow-hidden">
                                <div className="bg-[#161b28] px-4 py-3 border-b border-[rgba(255,255,255,0.05)]">
                                    <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#c9a84c] flex items-center gap-2">
                                        <Icon name="local_fire_department" size={12} /> Worker Activity Heatmap
                                    </h3>
                                </div>
                                <div className="p-4">
                                    <div className="flex gap-1">
                                        <div className="w-12 flex flex-col gap-1 text-right pr-2">
                                            {["B-001", "B-002", "B-004", "B-007", "B-010"].map(b => (
                                                <div key={b} className="h-5 flex items-center justify-end font-mono text-[8px] text-[#f0ece3]/25">{b}</div>
                                            ))}
                                        </div>
                                        <div className="flex-1 grid grid-cols-12 gap-1">
                                            {["8", "9", "10", "11", "12", "1", "2", "3", "4", "5", "6", "7"].map(h => (
                                                <div key={h} className="text-center font-mono text-[7px] text-[#f0ece3]/20 mb-1">{h}</div>
                                            ))}
                                            {[
                                                [0.2, 0.4, 0.7, 0.9, 1.0, 0.8, 0.9, 1.0, 0.7, 0.5, 0.3, 0.1],
                                                [0.1, 0.3, 0.5, 0.7, 0.8, 0.6, 0.7, 0.8, 0.6, 0.4, 0.2, 0.1],
                                                [0.3, 0.6, 0.8, 1.0, 0.9, 0.8, 1.0, 0.9, 0.8, 0.6, 0.4, 0.2],
                                                [0.2, 0.5, 0.7, 0.8, 0.9, 0.7, 0.8, 0.9, 0.7, 0.5, 0.3, 0.1],
                                                [0.4, 0.7, 0.9, 1.0, 1.0, 0.9, 1.0, 1.0, 0.9, 0.7, 0.5, 0.3],
                                            ].map((row, ri) => row.map((v, ci) => (
                                                <div key={`${ri}-${ci}`} className="h-5 rounded-sm" style={{ background: `rgba(201,168,76,${v * 0.8})` }} title={`Activity: ${Math.round(v * 100)}%`} />
                                            )))}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-1 mt-2">
                                        <span className="font-mono text-[7px] text-[#f0ece3]/20">Low</span>
                                        {[0.1, 0.3, 0.5, 0.7, 0.9].map(v => (
                                            <div key={v} className="w-3 h-2 rounded-sm" style={{ background: `rgba(201,168,76,${v * 0.8})` }} />
                                        ))}
                                        <span className="font-mono text-[7px] text-[#f0ece3]/20">High</span>
                                    </div>
                                </div>
                            </div>

                            {/* Today's Achievements */}
                            <div className="bg-[#111520] border border-[rgba(201,168,76,0.14)] rounded overflow-hidden">
                                <div className="bg-[#161b28] px-4 py-3 border-b border-[rgba(255,255,255,0.05)]">
                                    <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#c9a84c] flex items-center gap-2">
                                        <Icon name="emoji_events" size={12} /> Today&apos;s Achievements
                                    </h3>
                                </div>
                                <div className="p-4 space-y-4">
                                    {[
                                        { label: "Doors Knocked", value: "4,200", target: "6,000", pct: 70, color: "#c9a84c" },
                                        { label: "Voter Slips Verified", value: "2,890", target: "3,500", pct: 83, color: "#4ade80" },
                                        { label: "Issues Resolved", value: "32", target: "38", pct: 84, color: "#e8761a" },
                                    ].map(item => (
                                        <div key={item.label}>
                                            <div className="flex justify-between mb-1.5">
                                                <span className="font-mono text-[9px] text-[#f0ece3]/40 uppercase tracking-[1px]">{item.label}</span>
                                                <span className="font-mono text-[10px] text-[#f0ece3]/65">{item.value} / <span className="text-[#f0ece3]/25">{item.target}</span></span>
                                            </div>
                                            <Bar pct={item.pct} color={item.color} h={5} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Bottom Row ── */}
                    <div className="grid grid-cols-[1fr_1fr] gap-6">
                        {/* Ward-wise Completion */}
                        <div className="bg-[#111520] border border-[rgba(201,168,76,0.14)] rounded overflow-hidden">
                            <div className="bg-[#161b28] px-4 py-3 border-b border-[rgba(255,255,255,0.05)]">
                                <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#c9a84c] flex items-center gap-2">
                                    <Icon name="radar" size={12} /> Ward-wise Coverage
                                </h3>
                            </div>
                            <div className="p-4 space-y-2.5">
                                {wardData.map(ward => (
                                    <div key={ward.name} className="flex items-center gap-3">
                                        <span className="w-16 text-[11px] text-[#f0ece3]/40 text-right font-mono">{ward.name}</span>
                                        <div className="flex-1">
                                            <Bar pct={ward.coverage} color={ward.coverage > 80 ? "#4ade80" : ward.coverage > 60 ? "#c9a84c" : "#fbbf24"} h={6} />
                                        </div>
                                        <span className={`font-mono text-[10px] w-8 text-right ${ward.coverage > 80 ? "text-[#4ade80]" : ward.coverage > 60 ? "text-[#c9a84c]" : "text-[#fbbf24]"}`}>
                                            {ward.coverage}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Worker Reports */}
                        <div className="bg-[#111520] border border-[rgba(201,168,76,0.14)] rounded overflow-hidden">
                            <div className="bg-[#161b28] px-4 py-3 border-b border-[rgba(255,255,255,0.05)]">
                                <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#c9a84c] flex items-center gap-2">
                                    <Icon name="description" size={12} /> Recent Worker Reports
                                </h3>
                            </div>
                            <div className="divide-y divide-[rgba(255,255,255,0.03)]">
                                {workerReports.map((report, i) => (
                                    <div key={i} className="px-4 py-3 hover:bg-[#f0ece3]/[0.02] transition-colors cursor-pointer">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-[9px] text-[#c9a84c]">[{report.time}]</span>
                                            <span className="text-[11px] text-white font-medium">{report.worker}</span>
                                            <span className="font-mono text-[9px] text-[#f0ece3]/25 bg-[#f0ece3]/[0.03] px-1.5 py-0.5 rounded">{report.booth}</span>
                                        </div>
                                        <p className="text-[11px] text-[#f0ece3]/50 pl-12">{report.note}</p>
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
