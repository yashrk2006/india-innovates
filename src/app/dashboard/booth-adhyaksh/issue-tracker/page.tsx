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

type Issue = { id: string; title: string; category: string; icon: string; reporter: string; location: string; time: string; priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"; status: "NEW" | "IN_PROGRESS" | "ESCALATED" | "RESOLVED"; assignee?: string; notes?: string };

const issues: Issue[] = [
    { id: "ISS-001", title: "Water supply disrupted in Ward 4", category: "Water", icon: "water_drop", reporter: "Ramesh Sharma", location: "Mohalla Ganj", time: "2h ago", priority: "CRITICAL", status: "NEW" },
    { id: "ISS-002", title: "Road pothole near school", category: "Roads", icon: "add_road", reporter: "Sunil Verma", location: "Ram Nagar", time: "3h ago", priority: "HIGH", status: "NEW" },
    { id: "ISS-003", title: "Streetlight not working", category: "Power", icon: "lightbulb", reporter: "Priya Gupta", location: "Shanti Colony", time: "5h ago", priority: "LOW", status: "NEW" },
    { id: "ISS-004", title: "Garbage not collected for 3 days", category: "Waste", icon: "delete", reporter: "Amit Kumar", location: "Gandhi Chowk", time: "1h ago", priority: "HIGH", status: "IN_PROGRESS", assignee: "Ramesh Sharma", notes: "Contacted municipal office" },
    { id: "ISS-005", title: "Drainage overflow on main road", category: "Water", icon: "water_drop", reporter: "Kavita Devi", location: "Nehru Market", time: "4h ago", priority: "MEDIUM", status: "IN_PROGRESS", assignee: "Sunil Verma" },
    { id: "ISS-006", title: "Voter intimidation reported", category: "Security", icon: "shield", reporter: "Deepak Singh", location: "Patel Road", time: "6h ago", priority: "CRITICAL", status: "ESCALATED", notes: "Escalated to District Manager" },
    { id: "ISS-007", title: "Health camp postponed", category: "Health", icon: "medical_services", reporter: "Geeta Devi", location: "Subhash Marg", time: "1d ago", priority: "MEDIUM", status: "RESOLVED", notes: "Rescheduled to next week" },
    { id: "ISS-008", title: "Missing voter slips batch", category: "Admin", icon: "description", reporter: "Mohan Lal", location: "Mohalla Ganj", time: "1d ago", priority: "HIGH", status: "RESOLVED", notes: "Reprinted and distributed" },
    { id: "ISS-009", title: "WiFi down at booth office", category: "Tech", icon: "wifi_off", reporter: "Renu Bala", location: "Booth Office", time: "2d ago", priority: "LOW", status: "RESOLVED", notes: "ISP issue fixed" },
    { id: "ISS-010", title: "Water tanker delay", category: "Water", icon: "water_drop", reporter: "Suresh Kumar", location: "Patel Road", time: "2d ago", priority: "MEDIUM", status: "RESOLVED" },
];

const columns = [
    { key: "NEW" as const, label: "New", color: "#3b82f6", icon: "inbox" },
    { key: "IN_PROGRESS" as const, label: "In Progress", color: "#f97316", icon: "autorenew" },
    { key: "ESCALATED" as const, label: "Escalated", color: "#f87171", icon: "arrow_upward" },
    { key: "RESOLVED" as const, label: "Resolved", color: "#4ade80", icon: "check_circle" },
];
const priorityStyle: Record<string, { badge: string; border: string }> = {
    CRITICAL: { badge: "bg-red-400/10 text-red-400 border-red-400/30", border: "border-l-red-400" },
    HIGH: { badge: "bg-orange-400/10 text-orange-400 border-orange-400/30", border: "border-l-orange-400" },
    MEDIUM: { badge: "bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30", border: "border-l-[#c9a84c]" },
    LOW: { badge: "bg-white/5 text-white/40 border-white/10", border: "border-l-white/20" },
};

export default function IssueTrackerPage() {
    const [filter, setFilter] = useState("All");
    const tabs = ["All", "Open", "Resolved", "Escalated"];

    const filteredIssues = (status: Issue["status"]) => issues.filter(i => i.status === status && (filter === "All" || (filter === "Open" && (i.status === "NEW" || i.status === "IN_PROGRESS")) || (filter === "Resolved" && i.status === "RESOLVED") || (filter === "Escalated" && i.status === "ESCALATED")));

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
                    <NavItem icon="groups" label="Worker Status" href="/dashboard/booth-adhyaksh/worker-status" />
                    <p className="text-[8px] font-mono text-white/20 tracking-[3px] uppercase mb-2 mt-4 px-3">Management</p>
                    <NavItem icon="calendar_month" label="Day Planner" />
                    <NavItem icon="bug_report" label="Issue Tracker" active href="/dashboard/booth-adhyaksh/issue-tracker" />
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
                        <h1 className="font-serif text-lg font-bold">Issue Tracker</h1>
                        <span className="text-[9px] font-mono bg-red-400/10 text-red-400 px-2 py-0.5 rounded border border-red-400/20">{issues.filter(i => i.status !== "RESOLVED").length} Open · {issues.filter(i => i.priority === "CRITICAL").length} Critical</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            {tabs.map(t => (
                                <button key={t} onClick={() => setFilter(t)} className={`px-3 py-1 rounded text-[10px] font-bold transition-colors ${filter === t ? "bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30" : "bg-white/5 text-white/40 border border-white/5 hover:bg-white/10"}`}>{t}</button>
                            ))}
                        </div>
                        <button className="flex items-center gap-1.5 bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 px-3 py-1.5 rounded text-[11px] font-bold hover:bg-[#c9a84c]/20">
                            <Icon name="add" size={14} /> Report Issue
                        </button>
                    </div>
                </header>

                <div className="p-6">
                    {/* Kanban Board */}
                    <div className="grid grid-cols-4 gap-4">
                        {columns.map(col => {
                            const colIssues = issues.filter(i => i.status === col.key);
                            return (
                                <div key={col.key}>
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor: col.color + "40" }}>
                                        <Icon name={col.icon} size={14} style={{ color: col.color }} />
                                        <span className="text-[11px] font-bold" style={{ color: col.color }}>{col.label}</span>
                                        <span className="text-[9px] font-mono bg-white/5 px-1.5 py-0.5 rounded text-white/30">{colIssues.length}</span>
                                    </div>
                                    <div className="space-y-2">
                                        {colIssues.map(issue => {
                                            const ps = priorityStyle[issue.priority];
                                            return (
                                                <div key={issue.id} className={`bg-[#111520] rounded border border-[rgba(201,168,76,0.08)] border-l-[3px] ${ps.border} p-3 hover:bg-white/[0.02] transition-colors cursor-pointer`}>
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex items-center gap-1.5">
                                                            <Icon name={issue.icon} size={14} className="text-white/30" />
                                                            <span className="text-[9px] font-mono text-white/25">{issue.id}</span>
                                                        </div>
                                                        <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${ps.badge}`}>{issue.priority}</span>
                                                    </div>
                                                    <p className="text-[11px] font-medium mb-1.5 line-clamp-2">{issue.title}</p>
                                                    <div className="flex items-center gap-2 text-[9px] text-white/25">
                                                        <span>{issue.reporter}</span>
                                                        <span>·</span>
                                                        <span>{issue.location}</span>
                                                        <span>·</span>
                                                        <span>{issue.time}</span>
                                                    </div>
                                                    {issue.assignee && <p className="text-[9px] text-[#c9a84c]/60 mt-2 flex items-center gap-1"><Icon name="person" size={10} />{issue.assignee}</p>}
                                                    {issue.notes && <p className="text-[9px] text-white/30 mt-1 italic">{issue.notes}</p>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Stats Bar */}
                    <div className="mt-6 bg-[#111520] rounded border border-[rgba(201,168,76,0.08)] p-4 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="text-[11px]"><span className="text-white/40">Avg Resolution:</span> <span className="font-mono text-[#4ade80]">4.2 hrs</span></div>
                            <div className="text-[11px]"><span className="text-white/40">Escalation Rate:</span> <span className="font-mono text-[#c9a84c]">14%</span></div>
                            <div className="text-[11px]"><span className="text-white/40">This Week:</span> <span className="font-mono">{issues.length} total</span></div>
                        </div>
                        <div className="flex items-center gap-2">
                            {[{ cat: "Water", count: 3, color: "#3b82f6" }, { cat: "Roads", count: 1, color: "#f97316" }, { cat: "Power", count: 1, color: "#eab308" }, { cat: "Other", count: 5, color: "#8b5cf6" }].map(c => (
                                <div key={c.cat} className="flex items-center gap-1 text-[9px]" style={{ color: c.color }}>
                                    <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: c.color }} />
                                    {c.cat} ({c.count})
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
