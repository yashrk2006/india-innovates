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

const workers = [
    { initials: "RS", name: "Ramesh Sharma", role: "PP-1", pages: "1-5", status: "Active", doors: 28, calls: 5, issues: 1, gps: "Near Mohalla Ganj Market", lastCheckin: "10:45 AM", target: 72, color: "#4ade80" },
    { initials: "SV", name: "Sunil Verma", role: "PP-2", pages: "6-10", status: "Active", doors: 35, calls: 8, issues: 0, gps: "Ram Nagar Ward Office", lastCheckin: "11:02 AM", target: 88, color: "#4ade80" },
    { initials: "PG", name: "Priya Gupta", role: "PP-3", pages: "11-15", status: "Idle", doors: 12, calls: 3, issues: 2, gps: "Shanti Colony Gate #2", lastCheckin: "09:30 AM", target: 45, color: "#eab308" },
    { initials: "DS", name: "Deepak Singh", role: "PP-4", pages: "16-20", status: "Active", doors: 41, calls: 12, issues: 0, gps: "Subhash Marg Temple", lastCheckin: "11:15 AM", target: 95, color: "#4ade80" },
];

const statusColor: Record<string, string> = { Active: "bg-[#4ade80]", Idle: "bg-yellow-400", Offline: "bg-white/30" };

const timeline = [
    { time: "11:15", user: "Deepak", action: "Completed Page 18 — all voters contacted", icon: "check_circle", color: "#4ade80" },
    { time: "11:02", user: "Sunil", action: "Logged positive sentiment for Voter #1234", icon: "sentiment_satisfied", color: "#c9a84c" },
    { time: "10:45", user: "Ramesh", action: "Reported water issue at Ward 4", icon: "report_problem", color: "#f87171" },
    { time: "10:30", user: "Priya", action: "Started field visit in Shanti Colony", icon: "directions_walk", color: "#06b6d4" },
    { time: "09:30", user: "Priya", action: "Checked in — marked as Idle (break)", icon: "pause_circle", color: "#eab308" },
    { time: "09:15", user: "Deepak", action: "Called 5 voters from Page 17", icon: "call", color: "#4ade80" },
];

export default function WorkerStatusPage() {
    const [_] = useState(0);

    return (
        <div className="flex h-screen bg-[#08090f] text-[#f0ece3] overflow-hidden">
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
                    <NavItem icon="map" label="Voter Map" href="/dashboard/booth-adhyaksh/voter-map" />
                    <NavItem icon="groups" label="Worker Status" active href="/dashboard/booth-adhyaksh/worker-status" />
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

            <main className="flex-1 overflow-y-auto">
                <header className="sticky top-0 z-10 bg-[#08090f]/90 backdrop-blur-md border-b border-[rgba(201,168,76,0.08)] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="font-serif text-lg font-bold">Worker Status</h1>
                        <span className="text-[9px] font-mono bg-[#4ade80]/10 text-[#4ade80] px-2 py-0.5 rounded border border-[#4ade80]/20">4/4 Active</span>
                        <span className="text-[9px] text-white/25 font-mono">Last sync 2 min ago</span>
                    </div>
                </header>

                <div className="p-6 flex gap-6">
                    {/* Worker Cards */}
                    <div className="flex-[2] space-y-3">
                        {workers.map(w => (
                            <div key={w.name} className="bg-[#111520] rounded border border-[rgba(201,168,76,0.08)] p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 flex items-center justify-center text-sm font-bold text-[#c9a84c]">{w.initials}</div>
                                            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#111520] ${statusColor[w.status]}`} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm">{w.name}</span>
                                                <span className="text-[9px] font-mono bg-white/5 px-1.5 py-0.5 rounded text-white/40">{w.role}</span>
                                            </div>
                                            <p className="text-[10px] text-white/30 font-mono">Pages {w.pages}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${w.status === "Active" ? "bg-[#4ade80]/10 text-[#4ade80]" : w.status === "Idle" ? "bg-yellow-400/10 text-yellow-400" : "bg-white/5 text-white/30"}`}>{w.status}</span>
                                </div>

                                {/* Stats Row */}
                                <div className="flex items-center gap-6 mb-3">
                                    <div className="flex items-center gap-1.5 text-[11px]"><Icon name="door_front" size={14} className="text-white/30" /><span className="font-mono">{w.doors}</span><span className="text-white/25">doors</span></div>
                                    <div className="flex items-center gap-1.5 text-[11px]"><Icon name="call" size={14} className="text-white/30" /><span className="font-mono">{w.calls}</span><span className="text-white/25">calls</span></div>
                                    <div className="flex items-center gap-1.5 text-[11px]"><Icon name="flag" size={14} className="text-white/30" /><span className="font-mono">{w.issues}</span><span className="text-white/25">issues</span></div>
                                </div>

                                <div className="flex items-center gap-4 text-[10px] text-white/30 mb-3">
                                    <span className="flex items-center gap-1"><Icon name="location_on" size={12} />{w.gps}</span>
                                    <span className="flex items-center gap-1"><Icon name="schedule" size={12} />Last check-in: {w.lastCheckin}</span>
                                </div>

                                {/* Progress Bar */}
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all" style={{ width: `${w.target}%`, backgroundColor: w.color }} />
                                    </div>
                                    <span className="text-[10px] font-mono" style={{ color: w.color }}>{w.target}%</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Panel */}
                    <div className="flex-1 space-y-4">
                        {/* Leaderboard */}
                        <div className="bg-[#111520] rounded border border-[rgba(201,168,76,0.08)] p-4">
                            <h3 className="text-[10px] font-mono text-[#c9a84c] tracking-wider uppercase mb-3">Team Leaderboard</h3>
                            <div className="space-y-2">
                                {[...workers].sort((a, b) => b.doors - a.doors).map((w, i) => (
                                    <div key={w.name} className="flex items-center gap-3 p-2 rounded bg-white/[0.02]">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-[#c9a84c] text-black" : i === 1 ? "bg-gray-400 text-black" : i === 2 ? "bg-amber-700 text-white" : "bg-white/10 text-white/40"}`}>{i + 1}</span>
                                        <span className="text-[11px] font-medium flex-1">{w.name}</span>
                                        <span className="text-[11px] font-mono text-[#c9a84c]">{w.doors} doors</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Activity Timeline */}
                        <div className="bg-[#111520] rounded border border-[rgba(201,168,76,0.08)] p-4">
                            <h3 className="text-[10px] font-mono text-[#c9a84c] tracking-wider uppercase mb-3">Activity Timeline</h3>
                            <div className="space-y-3">
                                {timeline.map((t, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: t.color + "18" }}><Icon name={t.icon} size={12} style={{ color: t.color }} /></div>
                                            {i < timeline.length - 1 && <div className="w-px flex-1 bg-white/5 mt-1" />}
                                        </div>
                                        <div className="pb-3">
                                            <p className="text-[11px]"><span className="font-bold">{t.user}</span> <span className="text-white/50">{t.action}</span></p>
                                            <p className="text-[9px] text-white/25 font-mono">{t.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-[#111520] rounded border border-[rgba(201,168,76,0.08)] p-4 space-y-2">
                            <h3 className="text-[10px] font-mono text-[#c9a84c] tracking-wider uppercase mb-3">Quick Actions</h3>
                            <button className="w-full text-[11px] py-2 rounded bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 hover:bg-[#c9a84c]/20 font-bold">Send Reminder</button>
                            <button className="w-full text-[11px] py-2 rounded bg-white/5 text-white/50 border border-white/10 hover:bg-white/10">Reassign Pages</button>
                            <button className="w-full text-[11px] py-2 rounded bg-white/5 text-white/50 border border-white/10 hover:bg-white/10">Request Update</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
