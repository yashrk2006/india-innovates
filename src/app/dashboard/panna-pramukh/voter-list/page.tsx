"use client";
import { useState } from "react";

/* ── Icon ── */
function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;
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

const sentimentColor: Record<string, string> = { Positive: "text-green-400 bg-green-400/10", Neutral: "text-[#1e293b] bg-[#1e293b]/10", Negative: "text-red-400 bg-red-400/10", "—": "text-slate-400 bg-white/5" };

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
        <>
                {/* Header */}
                <header className="sticky top-0 z-10 bg-stone-50/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="font-serif text-lg font-bold">Voter List</h1>
                        <span className="text-[9px] font-mono bg-[#1e293b]/10 text-[#1e293b] px-2 py-0.5 rounded border border-[#1e293b]/20">{filtered.length} voters</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Icon name="search" size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input type="text" placeholder="Search name or ID..." value={search} onChange={e => setSearch(e.target.value)} className="bg-white shadow-sm border border-slate-200 rounded pl-8 pr-3 py-1.5 text-xs w-56 focus:border-[#1e293b]/40 outline-none" />
                        </div>
                        <select value={filterPage} onChange={e => setFilterPage(e.target.value)} className="bg-white shadow-sm border border-slate-200 rounded px-2 py-1.5 text-xs outline-none">
                            <option value="All">All Pages</option>
                            {[1, 2, 3, 4, 5].map(p => <option key={p} value={p}>Page {p}</option>)}
                        </select>
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-white shadow-sm border border-slate-200 rounded px-2 py-1.5 text-xs outline-none">
                            <option value="All">All Status</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Pending">Not Contacted</option>
                        </select>
                    </div>
                </header>

                <div className="p-6">
                    {/* Bulk Actions */}
                    <div className="flex items-center gap-3 mb-4">
                        <button onClick={toggleAll} className="text-[10px] font-mono text-[#1e293b] hover:underline">{selected.length === filtered.length ? "Deselect All" : "Select All"}</button>
                        {selected.length > 0 && (
                            <>
                                <span className="text-[10px] text-slate-500">|</span>
                                <button className="text-[10px] font-mono bg-[#10b981]/10 text-[#10b981] px-3 py-1 rounded border border-[#10b981]/20 hover:bg-[#10b981]/20">✓ Mark Contacted ({selected.length})</button>
                                <button className="text-[10px] font-mono bg-[#1e293b]/10 text-[#1e293b] px-3 py-1 rounded border border-[#1e293b]/20 hover:bg-[#1e293b]/20">Export CSV</button>
                            </>
                        )}
                    </div>

                    {/* Table */}
                    <div className="bg-white shadow-sm rounded border border-slate-200 overflow-hidden">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-white/5 text-slate-500 font-mono text-[9px] tracking-wider uppercase">
                                    <th className="text-left p-3 w-8"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-[#1e293b]" /></th>
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
                                    <tr key={v.id} className="border-b border-slate-200 hover:bg-white/[0.02] transition-colors">
                                        <td className="p-3"><input type="checkbox" checked={selected.includes(v.id)} onChange={() => toggleSelect(v.id)} className="accent-[#1e293b]" /></td>
                                        <td className="p-3 font-mono text-slate-500">#{v.id}</td>
                                        <td className="p-3 font-medium flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${v.contacted ? "bg-[#10b981]" : "bg-white/20"}`} />
                                            {v.name}
                                        </td>
                                        <td className="p-3 text-slate-500">{v.age}</td>
                                        <td className="p-3 text-slate-500">{v.gender}</td>
                                        <td className="p-3 font-mono text-slate-500">{v.phone}</td>
                                        <td className="p-3"><span className="bg-white/5 px-1.5 py-0.5 rounded text-slate-500">{v.page}</span></td>
                                        <td className="p-3">
                                            {v.contacted
                                                ? <span className="text-[#10b981] flex items-center gap-1"><Icon name="check_circle" size={12} /> Done</span>
                                                : <span className="text-red-400 flex items-center gap-1"><Icon name="close" size={12} /> Pending</span>}
                                        </td>
                                        <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sentimentColor[v.sentiment]}`}>{v.sentiment}</span></td>
                                        <td className="p-3 text-slate-500">{v.lastContact}</td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-1">
                                                <button className="p-1 rounded hover:bg-[#10b981]/10 text-slate-500 hover:text-[#10b981]"><Icon name="call" size={14} /></button>
                                                <button className="p-1 rounded hover:bg-[#1e293b]/10 text-slate-500 hover:text-[#1e293b]"><Icon name="edit" size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-between mt-4 text-[10px] text-slate-500 font-mono">
                        <span>Showing 1-{filtered.length} of {voters.length} voters</span>
                        <div className="flex gap-1">
                            <button className="px-2 py-1 rounded bg-[#1e293b]/10 text-[#1e293b] border border-[#1e293b]/20">1</button>
                            <button className="px-2 py-1 rounded bg-white/5 hover:bg-white/10">2</button>
                            <button className="px-2 py-1 rounded bg-white/5 hover:bg-white/10">→</button>
                        </div>
                    </div>
                </div>
        </>
    );
}
