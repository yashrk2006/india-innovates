"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

/* ── Icon ── */
function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;
}

/* ── Sidebar NavItem ── */
function NavItem({ icon, label, active, href }: { icon: string; label: string; active?: boolean; href?: string }) {
    const router = useRouter();
    return (
        <button onClick={() => href && router.push(href)} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-[11px] font-medium transition-all ${active ? "bg-[rgba(201,168,76,0.12)] text-[#c9a84c]" : "text-[#f0ece3]/40 hover:text-[#f0ece3]/70 hover:bg-white/[0.03]"}`}>
            <Icon name={icon} size={16} />
            <span>{label}</span>
        </button>
    );
}

const voters = [
    { id: 1001, name: "Ramesh Yadav", age: 45, gender: "M", phone: "98XXX-XX234", page: 1, contacted: true, sentiment: "Positive", lastContact: "Today" },
    { id: 1002, name: "Sunita Devi", age: 38, gender: "F", phone: "91XXX-XX891", page: 1, contacted: true, sentiment: "Neutral", lastContact: "Yesterday" },
    { id: 1003, name: "Amit Kumar", age: 29, gender: "M", phone: "70XXX-XX456", page: 1, contacted: false, sentiment: "—", lastContact: "—" },
    { id: 1004, name: "Priya Sharma", age: 52, gender: "F", phone: "88XXX-XX127", page: 2, contacted: true, sentiment: "Positive", lastContact: "2 days ago" },
    { id: 1005, name: "Vijay Pal Singh", age: 61, gender: "M", phone: "99XXX-XX890", page: 2, contacted: false, sentiment: "—", lastContact: "—" },
    { id: 1006, name: "Anita Gupta", age: 34, gender: "F", phone: "81XXX-XX345", page: 2, contacted: true, sentiment: "Negative", lastContact: "3 days ago" },
    { id: 1007, name: "Rajesh Meena", age: 47, gender: "M", phone: "93XXX-XX678", page: 3, contacted: true, sentiment: "Positive", lastContact: "Today" },
    { id: 1008, name: "Suman Kumari", age: 26, gender: "F", phone: "72XXX-XX901", page: 3, contacted: false, sentiment: "—", lastContact: "—" },
    { id: 1009, name: "Deepak Tiwari", age: 55, gender: "M", phone: "96XXX-XX234", page: 3, contacted: true, sentiment: "Neutral", lastContact: "Yesterday" },
    { id: 1010, name: "Kavita Rani", age: 41, gender: "F", phone: "85XXX-XX567", page: 4, contacted: false, sentiment: "—", lastContact: "—" },
    { id: 1011, name: "Mohan Lal", age: 63, gender: "M", phone: "97XXX-XX890", page: 4, contacted: true, sentiment: "Positive", lastContact: "Today" },
    { id: 1012, name: "Renu Bala", age: 33, gender: "F", phone: "74XXX-XX123", page: 4, contacted: true, sentiment: "Neutral", lastContact: "2 days ago" },
    { id: 1013, name: "Suresh Chandra", age: 50, gender: "M", phone: "90XXX-XX456", page: 5, contacted: false, sentiment: "—", lastContact: "—" },
    { id: 1014, name: "Geeta Devi", age: 44, gender: "F", phone: "82XXX-XX789", page: 5, contacted: true, sentiment: "Positive", lastContact: "Yesterday" },
    { id: 1015, name: "Prakash Verma", age: 37, gender: "M", phone: "95XXX-XX012", page: 5, contacted: false, sentiment: "—", lastContact: "—" },
];

const sentimentColor: Record<string, string> = { Positive: "text-green-400 bg-green-400/10", Neutral: "text-[#c9a84c] bg-[#c9a84c]/10", Negative: "text-red-400 bg-red-400/10", "—": "text-white/20 bg-white/5" };

export default function VoterListPage() {
    const [search, setSearch] = useState("");
    const [filterPage, setFilterPage] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [selected, setSelected] = useState<number[]>([]);

    const filtered = voters.filter(v => {
        const matchSearch = search === "" || v.name.toLowerCase().includes(search.toLowerCase()) || String(v.id).includes(search);
        const matchPage = filterPage === "All" || v.page === Number(filterPage);
        const matchStatus = filterStatus === "All" || (filterStatus === "Contacted" ? v.contacted : !v.contacted);
        return matchSearch && matchPage && matchStatus;
    });

    const toggleSelect = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(v => v.id));

    return (
        <div className="flex h-screen bg-[#08090f] text-[#f0ece3] overflow-hidden">
            {/* Sidebar */}
            <aside className="w-56 bg-[#111520] border-r border-[rgba(201,168,76,0.08)] flex flex-col shrink-0">
                <div className="p-4 border-b border-[rgba(201,168,76,0.08)]">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded bg-[#4ade80]/20 flex items-center justify-center"><Icon name="contacts" size={14} className="text-[#4ade80]" /></div>
                        <span className="font-serif text-sm font-bold tracking-wide">PANNA PRAMUKH</span>
                    </div>
                    <p className="text-[9px] text-white/25 font-mono tracking-widest ml-9">FIELD WORKER</p>
                </div>
                <nav className="flex-1 p-3 space-y-1">
                    <p className="text-[8px] font-mono text-white/20 tracking-[3px] uppercase mb-2 px-3">My Pages</p>
                    <NavItem icon="dashboard" label="Overview" href="/dashboard/panna-pramukh" />
                    <NavItem icon="list_alt" label="Voter List" active href="/dashboard/panna-pramukh/voter-list" />
                    <NavItem icon="phone_in_talk" label="Call Queue" href="/dashboard/panna-pramukh/call-queue" />
                    <p className="text-[8px] font-mono text-white/20 tracking-[3px] uppercase mb-2 mt-4 px-3">Actions</p>
                    <NavItem icon="edit_note" label="Log Contact" href="/dashboard/panna-pramukh/log-contact" />
                    <NavItem icon="report_problem" label="Record Issue" />
                    <NavItem icon="share" label="Share Scheme" />
                    <p className="text-[8px] font-mono text-white/20 tracking-[3px] uppercase mb-2 mt-4 px-3">Reports</p>
                    <NavItem icon="summarize" label="Daily Update" />
                </nav>
                <div className="p-4 border-t border-[rgba(201,168,76,0.08)]">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full border-2 border-[#4ade80] bg-[#111520] flex items-center justify-center text-[10px] font-bold">RS</div>
                        <div><p className="text-[11px] font-bold">Ramesh Sharma</p><p className="text-[9px] text-white/30 font-mono">Pages 1-5 · Booth 142</p></div>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="sticky top-0 z-10 bg-[#08090f]/90 backdrop-blur-md border-b border-[rgba(201,168,76,0.08)] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="font-serif text-lg font-bold">Voter List</h1>
                        <span className="text-[9px] font-mono bg-[#c9a84c]/10 text-[#c9a84c] px-2 py-0.5 rounded border border-[#c9a84c]/20">{filtered.length} voters</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Icon name="search" size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
                            <input type="text" placeholder="Search name or ID..." value={search} onChange={e => setSearch(e.target.value)} className="bg-[#111520] border border-white/10 rounded pl-8 pr-3 py-1.5 text-xs w-56 focus:border-[#c9a84c]/40 outline-none" />
                        </div>
                        <select value={filterPage} onChange={e => setFilterPage(e.target.value)} className="bg-[#111520] border border-white/10 rounded px-2 py-1.5 text-xs outline-none">
                            <option value="All">All Pages</option>
                            {[1, 2, 3, 4, 5].map(p => <option key={p} value={p}>Page {p}</option>)}
                        </select>
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-[#111520] border border-white/10 rounded px-2 py-1.5 text-xs outline-none">
                            <option value="All">All Status</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Pending">Not Contacted</option>
                        </select>
                    </div>
                </header>

                <div className="p-6">
                    {/* Bulk Actions */}
                    <div className="flex items-center gap-3 mb-4">
                        <button onClick={toggleAll} className="text-[10px] font-mono text-[#c9a84c] hover:underline">{selected.length === filtered.length ? "Deselect All" : "Select All"}</button>
                        {selected.length > 0 && (
                            <>
                                <span className="text-[10px] text-white/30">|</span>
                                <button className="text-[10px] font-mono bg-[#4ade80]/10 text-[#4ade80] px-3 py-1 rounded border border-[#4ade80]/20 hover:bg-[#4ade80]/20">✓ Mark Contacted ({selected.length})</button>
                                <button className="text-[10px] font-mono bg-[#c9a84c]/10 text-[#c9a84c] px-3 py-1 rounded border border-[#c9a84c]/20 hover:bg-[#c9a84c]/20">Export CSV</button>
                            </>
                        )}
                    </div>

                    {/* Table */}
                    <div className="bg-[#111520] rounded border border-[rgba(201,168,76,0.08)] overflow-hidden">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-white/5 text-white/30 font-mono text-[9px] tracking-wider uppercase">
                                    <th className="text-left p-3 w-8"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-[#c9a84c]" /></th>
                                    <th className="text-left p-3">ID</th>
                                    <th className="text-left p-3">Name</th>
                                    <th className="text-left p-3">Age</th>
                                    <th className="text-left p-3">Gender</th>
                                    <th className="text-left p-3">Phone</th>
                                    <th className="text-left p-3">Page</th>
                                    <th className="text-left p-3">Status</th>
                                    <th className="text-left p-3">Sentiment</th>
                                    <th className="text-left p-3">Last Contact</th>
                                    <th className="text-left p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(v => (
                                    <tr key={v.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                        <td className="p-3"><input type="checkbox" checked={selected.includes(v.id)} onChange={() => toggleSelect(v.id)} className="accent-[#c9a84c]" /></td>
                                        <td className="p-3 font-mono text-white/40">#{v.id}</td>
                                        <td className="p-3 font-medium flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${v.contacted ? "bg-[#4ade80]" : "bg-white/20"}`} />
                                            {v.name}
                                        </td>
                                        <td className="p-3 text-white/50">{v.age}</td>
                                        <td className="p-3 text-white/50">{v.gender}</td>
                                        <td className="p-3 font-mono text-white/40">{v.phone}</td>
                                        <td className="p-3"><span className="bg-white/5 px-1.5 py-0.5 rounded text-white/40">{v.page}</span></td>
                                        <td className="p-3">
                                            {v.contacted
                                                ? <span className="text-[#4ade80] flex items-center gap-1"><Icon name="check_circle" size={12} /> Done</span>
                                                : <span className="text-red-400 flex items-center gap-1"><Icon name="close" size={12} /> Pending</span>}
                                        </td>
                                        <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sentimentColor[v.sentiment]}`}>{v.sentiment}</span></td>
                                        <td className="p-3 text-white/30">{v.lastContact}</td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-1">
                                                <button className="p-1 rounded hover:bg-[#4ade80]/10 text-white/30 hover:text-[#4ade80]"><Icon name="call" size={14} /></button>
                                                <button className="p-1 rounded hover:bg-[#c9a84c]/10 text-white/30 hover:text-[#c9a84c]"><Icon name="edit" size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-between mt-4 text-[10px] text-white/30 font-mono">
                        <span>Showing 1-{filtered.length} of {voters.length} voters</span>
                        <div className="flex gap-1">
                            <button className="px-2 py-1 rounded bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20">1</button>
                            <button className="px-2 py-1 rounded bg-white/5 hover:bg-white/10">2</button>
                            <button className="px-2 py-1 rounded bg-white/5 hover:bg-white/10">→</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
