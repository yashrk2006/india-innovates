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
   PANNA PRAMUKH – Field Worker Dashboard
   ══════════════════════════════════════════════════════════ */
export default function PannaPramukhDashboard() {
    const router = useRouter();

    const handleLogout = () => {
        document.cookie = "user_role=; path=/; max-age=0";
        router.push("/auth?role=panna-pramukh");
    };

    /* Mock Data */
    const voterList = [
        { id: "#1001", name: "Rajesh Kumar", age: 42, gender: "M", phone: "98XX-XX42", contacted: true, sentiment: "Positive", lastContact: "Today" },
        { id: "#1002", name: "Meera Devi", age: 35, gender: "F", phone: "97XX-XX89", contacted: true, sentiment: "Neutral", lastContact: "Yesterday" },
        { id: "#1003", name: "Suresh Pal", age: 58, gender: "M", phone: "96XX-XX15", contacted: false, sentiment: "—", lastContact: "Never" },
        { id: "#1004", name: "Anita Sharma", age: 29, gender: "F", phone: "98XX-XX67", contacted: true, sentiment: "Positive", lastContact: "2 days" },
        { id: "#1005", name: "Dinesh Verma", age: 45, gender: "M", phone: "95XX-XX23", contacted: false, sentiment: "—", lastContact: "Never" },
        { id: "#1006", name: "Pooja Gupta", age: 32, gender: "F", phone: "99XX-XX78", contacted: true, sentiment: "Negative", lastContact: "Today" },
        { id: "#1007", name: "Lakshman Singh", age: 67, gender: "M", phone: "94XX-XX56", contacted: true, sentiment: "Positive", lastContact: "Yesterday" },
        { id: "#1008", name: "Rekha Yadav", age: 41, gender: "F", phone: "98XX-XX34", contacted: false, sentiment: "—", lastContact: "Never" },
    ];

    const dailyUpdates = [
        { update: "Page 3: Voter #1006 raised water supply issue", time: "2:45 PM", type: "issue" },
        { update: "Page 1: 5 voters confirmed scheme enrollment", time: "1:30 PM", type: "success" },
        { update: "Page 2: 3 new voter contacts added today", time: "12:15 PM", type: "info" },
        { update: "Page 4: Elderly voter needs accessibility help for polling", time: "11:00 AM", type: "alert" },
    ];

    const sentimentColor: Record<string, string> = { Positive: "#4ade80", Negative: "#f87171", Neutral: "#c9a84c", "—": "#6b7280" };
    const updateIcon: Record<string, string> = { issue: "report_problem", success: "check_circle", info: "info", alert: "notifications_active" };
    const updateColor: Record<string, string> = { issue: "#fbbf24", success: "#4ade80", info: "#60a5fa", alert: "#f87171" };

    const contacted = voterList.filter(v => v.contacted).length;
    const total = voterList.length;

    return (
        <div className="flex h-screen bg-[#08090f] text-[#f0ece3] overflow-hidden" style={{ fontFamily: "'Public Sans', 'Literata', serif" }}>
            {/* ─── Left Sidebar ─── */}
            <aside className="w-64 bg-[#0d0f1a] border-r border-[rgba(201,168,76,0.14)] flex flex-col flex-shrink-0">
                <div className="p-5 border-b border-[rgba(255,255,255,0.05)]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-[#4ade80] flex items-center justify-center text-[#08090f]">
                            <Icon name="assignment_ind" size={18} />
                        </div>
                        <div>
                            <h1 className="text-white text-sm font-bold tracking-tight leading-none">PANNA PRAMUKH</h1>
                            <span className="text-[9px] font-mono text-[#4ade80] tracking-[2px] uppercase">Field Worker</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto">
                    <NavLabel text="My Pages" />
                    <NavItem icon="dashboard" label="Overview" active />
                    <NavItem icon="list_alt" label="Voter List" />
                    <NavItem icon="phone_callback" label="Call Queue" />

                    <NavLabel text="Actions" />
                    <NavItem icon="add_circle" label="Log Contact" />
                    <NavItem icon="feedback" label="Record Issue" />
                    <NavItem icon="campaign" label="Share Scheme" />

                    <NavLabel text="Reports" />
                    <NavItem icon="upload_file" label="Daily Update" />
                </nav>

                <div className="p-4 border-t border-[rgba(255,255,255,0.05)]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#111520] border border-[#4ade80]/30 flex items-center justify-center text-[#4ade80] font-serif font-bold text-sm">
                            RS
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-medium truncate">Ramesh Sharma</p>
                            <p className="text-[#f0ece3]/25 text-[9px] font-mono truncate">Pages 1-5 · Booth 142</p>
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
                        <h2 className="text-white text-lg font-serif font-bold">My Voter Pages</h2>
                        <span className="font-mono text-[9px] text-[#4ade80] tracking-[1.5px] uppercase bg-[#4ade80]/10 px-2 py-0.5 rounded border border-[#4ade80]/20">
                            Pages 1-5 · {contacted}/{total} contacted
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="font-mono text-[10px] tracking-[1px] uppercase bg-[#c9a84c] hover:bg-[#c9a84c]/90 text-[#08090f] font-bold px-4 py-1.5 rounded transition-all">
                            + Log Contact
                        </button>
                    </div>
                </header>

                <div className="p-6 space-y-6">
                    {/* ── KPI Row ── */}
                    <div className="grid grid-cols-4 gap-4">
                        <KPI icon="people" label="Assigned Voters" value={total.toString()} sub="Pages 1-5" />
                        <KPI icon="call" label="Contacted" value={contacted.toString()} sub={`${Math.round((contacted / total) * 100)}% complete`} color="#4ade80" />
                        <KPI icon="thumb_up" label="Favourable" value="4" sub="of 5 contacted" color="#c9a84c" />
                        <KPI icon="warning" label="Issues Logged" value="2" sub="1 pending action" color="#f87171" />
                    </div>

                    {/* ── Main Grid ── */}
                    <div className="grid grid-cols-[1.5fr_1fr] gap-6">
                        {/* Voter List Table */}
                        <div className="bg-[#111520] border border-[rgba(201,168,76,0.14)] rounded overflow-hidden">
                            <div className="bg-[#161b28] px-4 py-3 flex items-center justify-between border-b border-[rgba(255,255,255,0.05)]">
                                <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#c9a84c] flex items-center gap-2">
                                    <Icon name="list_alt" size={12} /> Voter Contact List
                                </h3>
                                <span className="font-mono text-[9px] text-[#f0ece3]/25">{contacted}/{total} done</span>
                            </div>
                            <div className="grid grid-cols-[50px_1fr_40px_35px_80px_80px_70px] gap-2 px-4 py-2.5 border-b border-[rgba(255,255,255,0.05)] font-mono text-[9px] tracking-[1px] uppercase text-[#f0ece3]/25">
                                <span>ID</span>
                                <span>Name</span>
                                <span>Age</span>
                                <span>G</span>
                                <span>Phone</span>
                                <span>Sentiment</span>
                                <span>Last</span>
                            </div>
                            {voterList.map((v) => (
                                <div key={v.id} className={`grid grid-cols-[50px_1fr_40px_35px_80px_80px_70px] gap-2 px-4 py-2.5 border-b border-[rgba(255,255,255,0.03)] hover:bg-[#f0ece3]/[0.02] transition-colors cursor-pointer items-center ${v.contacted ? "" : "opacity-60"}`}>
                                    <span className="font-mono text-[10px] text-[#c9a84c]">{v.id}</span>
                                    <div className="flex items-center gap-2">
                                        {v.contacted && <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />}
                                        {!v.contacted && <div className="w-1.5 h-1.5 rounded-full bg-[#f0ece3]/15" />}
                                        <span className="text-[11px] text-white/80">{v.name}</span>
                                    </div>
                                    <span className="font-mono text-[10px] text-[#f0ece3]/40">{v.age}</span>
                                    <span className="font-mono text-[10px] text-[#f0ece3]/40">{v.gender}</span>
                                    <span className="font-mono text-[10px] text-[#f0ece3]/30">{v.phone}</span>
                                    <span className="font-mono text-[9px]" style={{ color: sentimentColor[v.sentiment] }}>{v.sentiment}</span>
                                    <span className="font-mono text-[9px] text-[#f0ece3]/25">{v.lastContact}</span>
                                </div>
                            ))}
                        </div>

                        {/* Daily Updates */}
                        <div className="space-y-5">
                            {/* Contact Progress */}
                            <div className="bg-[#111520] border border-[rgba(201,168,76,0.14)] rounded overflow-hidden">
                                <div className="bg-[#161b28] px-4 py-3 border-b border-[rgba(255,255,255,0.05)]">
                                    <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#4ade80] flex items-center gap-2">
                                        <Icon name="pie_chart" size={12} /> Contact Progress
                                    </h3>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="relative w-20 h-20">
                                            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                                <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                                                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#4ade80" strokeWidth="3"
                                                    strokeDasharray={`${(contacted / total) * 97.4} 97.4`} strokeLinecap="round" />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="font-mono text-sm font-bold text-[#4ade80]">{Math.round((contacted / total) * 100)}%</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-[#f0ece3]/40 flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-[#4ade80]" /> Contacted</span>
                                                <span className="font-mono text-[11px] text-[#4ade80] font-bold">{contacted}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-[#f0ece3]/40 flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-[#f0ece3]/10" /> Pending</span>
                                                <span className="font-mono text-[11px] text-[#f0ece3]/50">{total - contacted}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Bar pct={(contacted / total) * 100} color="#4ade80" h={4} />
                                </div>
                            </div>

                            {/* Daily Updates Feed */}
                            <div className="bg-[#111520] border border-[rgba(201,168,76,0.14)] rounded overflow-hidden">
                                <div className="bg-[#161b28] px-4 py-3 border-b border-[rgba(255,255,255,0.05)]">
                                    <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#c9a84c] flex items-center gap-2">
                                        <Icon name="update" size={12} /> Today&apos;s Activity
                                    </h3>
                                </div>
                                <div className="divide-y divide-[rgba(255,255,255,0.03)]">
                                    {dailyUpdates.map((u, i) => (
                                        <div key={i} className="px-4 py-3 hover:bg-[#f0ece3]/[0.02] transition-colors">
                                            <div className="flex items-start gap-2">
                                                <Icon name={updateIcon[u.type]} size={14} style={{ color: updateColor[u.type] }} />
                                                <div className="flex-1">
                                                    <p className="text-[11px] text-white/70">{u.update}</p>
                                                    <span className="font-mono text-[8px] text-[#f0ece3]/20">{u.time}</span>
                                                </div>
                                            </div>
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
