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
   BOOTH ADHYAKSH – Booth Operations Dashboard
   ══════════════════════════════════════════════════════════ */
export default function BoothAdhyakshDashboard() {
    const router = useRouter();

    const handleLogout = () => {
        document.cookie = "user_role=; path=/; max-age=0";
        router.push("/auth?role=booth-adhyaksh");
    };

    /* Mock Data */
    const workers = [
        { name: "Ramesh Yadav", role: "Page Pramukh", area: "Page 1-5", contacted: 142, target: 200, status: "ACTIVE" },
        { name: "Sunita Devi", role: "Page Pramukh", area: "Page 6-10", contacted: 189, target: 200, status: "ACTIVE" },
        { name: "Mohan Lal", role: "Panna Pramukh", area: "Page 11-15", contacted: 67, target: 200, status: "DELAYED" },
        { name: "Priya Sharma", role: "Panna Pramukh", area: "Page 16-20", contacted: 198, target: 200, status: "COMPLETED" },
        { name: "Anil Kumar", role: "Volunteer", area: "Page 21-25", contacted: 94, target: 200, status: "ACTIVE" },
        { name: "Kavita Singh", role: "Volunteer", area: "Page 26-30", contacted: 45, target: 200, status: "DELAYED" },
    ];

    const todayTasks = [
        { task: "Complete voter contact for Page 11-15", priority: "HIGH", assigned: "Mohan Lal", due: "5:00 PM", done: false },
        { task: "Distribute scheme pamphlets – Ward 4", priority: "MEDIUM", assigned: "All Workers", due: "3:00 PM", done: true },
        { task: "Verify new registrations (12 pending)", priority: "HIGH", assigned: "Self", due: "6:00 PM", done: false },
        { task: "Submit daily worker report", priority: "LOW", assigned: "Self", due: "8:00 PM", done: false },
        { task: "Organize booth-level meeting", priority: "MEDIUM", assigned: "Self", due: "7:00 PM", done: false },
    ];

    const recentFeedback = [
        { voter: "Voter #1042", sentiment: "Positive", issue: "Road repair done", time: "2:30 PM" },
        { voter: "Voter #1089", sentiment: "Negative", issue: "Water supply irregular", time: "1:45 PM" },
        { voter: "Voter #1105", sentiment: "Neutral", issue: "Awaiting Ayushman card", time: "12:20 PM" },
        { voter: "Voter #1023", sentiment: "Positive", issue: "Scholarship received", time: "11:15 AM" },
    ];

    const sentimentColor: Record<string, string> = { Positive: "#4ade80", Negative: "#f87171", Neutral: "#c9a84c" };
    const priorityColor: Record<string, string> = { HIGH: "#f87171", MEDIUM: "#fbbf24", LOW: "#6b7280" };
    const statusColor: Record<string, string> = { ACTIVE: "#4ade80", DELAYED: "#f87171", COMPLETED: "#c9a84c" };

    return (
        <div className="flex h-screen bg-[#08090f] text-[#f0ece3] overflow-hidden" style={{ fontFamily: "'Public Sans', 'Literata', serif" }}>
            {/* ─── Left Sidebar ─── */}
            <aside className="w-64 bg-[#0d0f1a] border-r border-[rgba(201,168,76,0.14)] flex flex-col flex-shrink-0">
                <div className="p-5 border-b border-[rgba(255,255,255,0.05)]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-[#e8761a] flex items-center justify-center text-white">
                            <Icon name="flag" size={18} />
                        </div>
                        <div>
                            <h1 className="text-white text-sm font-bold tracking-tight leading-none">BOOTH ADHYAKSH</h1>
                            <span className="text-[9px] font-mono text-[#e8761a] tracking-[2px] uppercase">Booth #142</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto">
                    <NavLabel text="Operations" />
                    <NavItem icon="dashboard" label="Booth Overview" active />
                    <NavItem icon="groups" label="Worker Tracker" />
                    <NavItem icon="checklist" label="Today's Tasks" />

                    <NavLabel text="Voter Data" />
                    <NavItem icon="person_search" label="Voter List" />
                    <NavItem icon="how_to_vote" label="Contact Status" />
                    <NavItem icon="feedback" label="Voter Feedback" />

                    <NavLabel text="Reports" />
                    <NavItem icon="upload_file" label="Daily Report" />
                    <NavItem icon="history" label="Past Reports" />
                </nav>

                <div className="p-4 border-t border-[rgba(255,255,255,0.05)]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#111520] border border-[#e8761a]/30 flex items-center justify-center text-[#e8761a] font-serif font-bold text-sm">
                            VK
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-medium truncate">Vijay Kumar</p>
                            <p className="text-[#f0ece3]/25 text-[9px] font-mono truncate">Booth Adhyaksh</p>
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
                        <h2 className="text-white text-lg font-serif font-bold">Booth Operations Hub</h2>
                        <span className="font-mono text-[9px] text-[#4ade80] tracking-[1.5px] uppercase bg-[#4ade80]/10 px-2 py-0.5 rounded border border-[#4ade80]/20">
                            ● BOOTH ACTIVE
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-[#f0ece3]/40">Ward 12 · Booth 142</span>
                        <button className="font-mono text-[10px] tracking-[1px] uppercase bg-[#e8761a] hover:bg-[#e8761a]/90 text-white px-4 py-1.5 rounded transition-all">
                            Submit Report
                        </button>
                    </div>
                </header>

                <div className="p-6 space-y-6">
                    {/* ── KPI Row ── */}
                    <div className="grid grid-cols-5 gap-4">
                        <KPI icon="people" label="Total Voters" value="1,248" sub="Booth 142" />
                        <KPI icon="phone_in_talk" label="Contacted" value="735" sub="58.8% complete" color="#4ade80" />
                        <KPI icon="groups" label="Active Workers" value="6" sub="2 delayed" color="#e8761a" />
                        <KPI icon="star" label="Favourability" value="72%" sub="↑ 4% this week" color="#c9a84c" />
                        <KPI icon="warning" label="Pending Issues" value="8" sub="3 critical" color="#f87171" />
                    </div>

                    {/* ── Main Grid ── */}
                    <div className="grid grid-cols-[1.4fr_1fr] gap-6">
                        {/* Workers Table */}
                        <div className="bg-[#111520] border border-[rgba(201,168,76,0.14)] rounded overflow-hidden">
                            <div className="bg-[#161b28] px-4 py-3 flex items-center justify-between border-b border-[rgba(255,255,255,0.05)]">
                                <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#c9a84c] flex items-center gap-2">
                                    <Icon name="groups" size={12} /> Worker Performance
                                </h3>
                            </div>
                            <div className="grid grid-cols-[1fr_90px_80px_120px_80px] gap-2 px-4 py-2.5 border-b border-[rgba(255,255,255,0.05)] font-mono text-[9px] tracking-[1px] uppercase text-[#f0ece3]/25">
                                <span>Worker</span>
                                <span>Role</span>
                                <span>Area</span>
                                <span>Progress</span>
                                <span>Status</span>
                            </div>
                            {workers.map((w) => (
                                <div key={w.name} className="grid grid-cols-[1fr_90px_80px_120px_80px] gap-2 px-4 py-3 border-b border-[rgba(255,255,255,0.03)] hover:bg-[#f0ece3]/[0.02] transition-colors cursor-pointer items-center">
                                    <span className="text-[11px] text-white/80 font-medium">{w.name}</span>
                                    <span className="font-mono text-[10px] text-[#f0ece3]/40">{w.role}</span>
                                    <span className="font-mono text-[10px] text-[#f0ece3]/40">{w.area}</span>
                                    <div className="flex items-center gap-2">
                                        <Bar pct={(w.contacted / w.target) * 100} color={w.contacted / w.target > 0.8 ? "#4ade80" : w.contacted / w.target > 0.5 ? "#c9a84c" : "#f87171"} h={4} />
                                        <span className="font-mono text-[9px] text-[#f0ece3]/30 w-12 text-right">{w.contacted}/{w.target}</span>
                                    </div>
                                    <span className="font-mono text-[9px] tracking-[0.5px] px-1.5 py-0.5 rounded text-center" style={{ color: statusColor[w.status], background: statusColor[w.status] + "15", border: `1px solid ${statusColor[w.status]}30` }}>
                                        {w.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Today's Tasks */}
                        <div className="bg-[#111520] border border-[rgba(201,168,76,0.14)] rounded overflow-hidden">
                            <div className="bg-[#161b28] px-4 py-3 border-b border-[rgba(255,255,255,0.05)]">
                                <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#e8761a] flex items-center gap-2">
                                    <Icon name="checklist" size={12} /> Today&apos;s Tasks
                                </h3>
                            </div>
                            <div className="divide-y divide-[rgba(255,255,255,0.03)]">
                                {todayTasks.map((t, i) => (
                                    <div key={i} className="px-4 py-3 hover:bg-[#f0ece3]/[0.02] transition-colors cursor-pointer">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className={`w-4 h-4 rounded-sm border flex items-center justify-center text-[10px] ${t.done ? "bg-[#4ade80]/20 border-[#4ade80]/50 text-[#4ade80]" : "border-[#f0ece3]/15"}`}>
                                                {t.done && "✓"}
                                            </div>
                                            <span className={`text-[11px] flex-1 ${t.done ? "text-[#f0ece3]/30 line-through" : "text-white/80"}`}>{t.task}</span>
                                            <span className="font-mono text-[8px] px-1.5 py-0.5 rounded" style={{ color: priorityColor[t.priority], background: priorityColor[t.priority] + "15" }}>
                                                {t.priority}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 pl-6 text-[9px] text-[#f0ece3]/25 font-mono">
                                            <span>{t.assigned}</span>
                                            <span className="ml-auto">Due: {t.due}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Bottom: Voter Feedback Feed ── */}
                    <div className="bg-[#111520] border border-[rgba(201,168,76,0.14)] rounded overflow-hidden">
                        <div className="bg-[#161b28] px-4 py-3 border-b border-[rgba(255,255,255,0.05)]">
                            <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#c9a84c] flex items-center gap-2">
                                <Icon name="chat_bubble" size={12} /> Recent Voter Feedback
                            </h3>
                        </div>
                        <div className="grid grid-cols-4 divide-x divide-[rgba(255,255,255,0.03)]">
                            {recentFeedback.map((f, i) => (
                                <div key={i} className="px-4 py-3">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="font-mono text-[10px] text-[#f0ece3]/40">{f.voter}</span>
                                        <span className="font-mono text-[8px]" style={{ color: sentimentColor[f.sentiment] }}>{f.sentiment}</span>
                                    </div>
                                    <p className="text-[11px] text-white/70 mb-1">{f.issue}</p>
                                    <span className="font-mono text-[8px] text-[#f0ece3]/20">{f.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
