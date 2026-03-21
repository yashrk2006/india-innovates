"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/super-admin/SidebarContext";

function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;
}

type User = { id: number; name: string; email: string; role: string; status: "Active" | "Suspended" | "Pending"; lastLogin: string; created: string };

const users: User[] = [
    { id: 1, name: "Rajesh Kumar", email: "rajesh@boothiq.in", role: "Super Admin", status: "Active", lastLogin: "2 min ago", created: "Jan 2026" },
    { id: 2, name: "Priya Sharma", email: "priya@boothiq.in", role: "Party Central", status: "Active", lastLogin: "1h ago", created: "Jan 2026" },
    { id: 3, name: "Amit Verma", email: "amit@boothiq.in", role: "Manager", status: "Active", lastLogin: "30 min ago", created: "Feb 2026" },
    { id: 4, name: "Sunita Devi", email: "sunita@boothiq.in", role: "Booth Adhyaksh", status: "Active", lastLogin: "15 min ago", created: "Feb 2026" },
    { id: 5, name: "Ramesh Yadav", email: "ramesh@boothiq.in", role: "Panna Pramukh", status: "Active", lastLogin: "5 min ago", created: "Feb 2026" },
    { id: 6, name: "Kavita Gupta", email: "kavita@boothiq.in", role: "Data Analyst", status: "Active", lastLogin: "1h ago", created: "Feb 2026" },
    { id: 7, name: "Sunil Mehta", email: "sunil@boothiq.in", role: "ECI Observer", status: "Active", lastLogin: "3h ago", created: "Feb 2026" },
    { id: 8, name: "Deepak Tiwari", email: "deepak@boothiq.in", role: "Panna Pramukh", status: "Suspended", lastLogin: "2d ago", created: "Feb 2026" },
    { id: 9, name: "Geeta Rani", email: "geeta@boothiq.in", role: "Booth Adhyaksh", status: "Active", lastLogin: "45 min ago", created: "Feb 2026" },
    { id: 10, name: "Mohan Lal", email: "mohan@boothiq.in", role: "Panna Pramukh", status: "Pending", lastLogin: "—", created: "Feb 2026" },
    { id: 11, name: "Anita Kumari", email: "anita@boothiq.in", role: "Manager", status: "Active", lastLogin: "20 min ago", created: "Feb 2026" },
    { id: 12, name: "Vijay Singh", email: "vijay@boothiq.in", role: "Panna Pramukh", status: "Active", lastLogin: "10 min ago", created: "Feb 2026" },
];

const roleColors: Record<string, string> = {
    "Super Admin": "bg-red-400/10 text-red-400 border-red-400/30",
    "Party Central": "bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/30",
    Manager: "bg-[#1e293b]/10 text-[#1e293b] border-[#1e293b]/30",
    "Booth Adhyaksh": "bg-[#f97316]/10 text-[#f97316] border-[#f97316]/30",
    "Panna Pramukh": "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30",
    "Data Analyst": "bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/30",
    "ECI Observer": "bg-[#ec4899]/10 text-[#ec4899] border-[#ec4899]/30",
};
const statusColors: Record<string, string> = { Active: "text-[#10b981]", Suspended: "text-red-400", Pending: "text-yellow-400" };

export default function UserManagementPage() {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [editUser, setEditUser] = useState<User | null>(null);
    const { isOpen, setIsOpen } = useSidebar();

    const roles = ["All", ...Array.from(new Set(users.map(u => u.role)))];
    const filtered = users.filter(u => {
        const matchSearch = search === "" || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search);
        const matchRole = roleFilter === "All" || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    return (
        <>
            <main className="flex-1 overflow-y-auto relative z-10 text-slate-700 w-full h-full">
                <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button className="md:hidden text-slate-900" onClick={() => setIsOpen(!isOpen)}>
                            <Icon name="menu" />
                        </button>
                        <h1 className="font-serif text-lg font-bold">User Management</h1>
                        <span className="text-[9px] font-mono bg-[#1e293b]/10 text-[#1e293b] px-2 py-0.5 rounded border border-[#1e293b]/20 hidden sm:inline-block">{users.length} users</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Icon name="search" size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="bg-white shadow-sm border border-slate-200 rounded pl-8 pr-3 py-1.5 text-xs w-48 focus:border-[#1e293b]/40 outline-none" />
                        </div>
                        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="bg-white shadow-sm border border-slate-200 rounded px-2 py-1.5 text-xs outline-none">{roles.map(r => <option key={r} value={r}>{r}</option>)}</select>
                        <button className="flex items-center gap-1.5 bg-[#1e293b]/10 text-[#1e293b] border border-[#1e293b]/20 px-3 py-1.5 rounded text-[11px] font-bold hover:bg-[#1e293b]/20"><Icon name="add" size={14} /> Add User</button>
                    </div>
                </header>

                <div className="p-6 flex gap-6">
                    <div className={`${editUser ? "flex-[2]" : "flex-1"}`}>
                        <div className="bg-white shadow-sm rounded border border-slate-200 overflow-hidden">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-white/5 text-slate-500 font-mono text-[9px] tracking-wider uppercase">
                                        <th className="text-left p-3">User</th>
                                        <th className="text-left p-3">Email</th>
                                        <th className="text-left p-3">Role</th>
                                        <th className="text-left p-3">Status</th>
                                        <th className="text-left p-3">Last Login</th>
                                        <th className="text-left p-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(u => (
                                        <tr key={u.id} className="border-b border-slate-200 hover:bg-white/[0.02] transition-colors">
                                            <td className="p-3"><div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-[#1e293b]/10 flex items-center justify-center text-[9px] font-bold text-[#1e293b]">{u.name.split(" ").map(n => n[0]).join("")}</div>
                                                <span className="font-medium">{u.name}</span>
                                            </div></td>
                                            <td className="p-3 text-slate-500 font-mono">{u.email}</td>
                                            <td className="p-3"><span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${roleColors[u.role] || "bg-white/5 text-slate-500"}`}>{u.role}</span></td>
                                            <td className="p-3"><span className={`text-[10px] font-bold ${statusColors[u.status]}`}>● {u.status}</span></td>
                                            <td className="p-3 text-slate-500">{u.lastLogin}</td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => setEditUser(u)} className="p-1 rounded hover:bg-[#1e293b]/10 text-slate-500 hover:text-[#1e293b]"><Icon name="edit" size={14} /></button>
                                                    <button className="p-1 rounded hover:bg-red-400/10 text-slate-500 hover:text-red-400"><Icon name="block" size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Role Distribution */}
                        <div className="mt-4 bg-white shadow-sm rounded border border-slate-200 p-4">
                            <h3 className="text-[10px] font-mono text-[#1e293b] tracking-wider uppercase mb-3">Role Distribution</h3>
                            <div className="flex gap-2">
                                {Object.entries(users.reduce<Record<string, number>>((acc, u) => ({ ...acc, [u.role]: (acc[u.role] || 0) + 1 }), {})).map(([role, count]) => (
                                    <div key={role} className="flex-1 bg-white/[0.02] rounded p-2 text-center">
                                        <p className="font-serif text-lg font-bold">{count}</p>
                                        <p className="text-[8px] text-slate-500 truncate">{role}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Edit Drawer */}
                    {editUser && (
                        <div className="w-80 bg-white shadow-sm rounded border border-slate-200 p-5 shrink-0">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[11px] font-mono text-[#1e293b] tracking-wider uppercase">Edit User</h3>
                                <button onClick={() => setEditUser(null)} className="text-slate-500 hover:text-slate-600"><Icon name="close" size={16} /></button>
                            </div>
                            <div className="space-y-4">
                                <div><label className="text-[9px] text-slate-500 block mb-1">Name</label><input defaultValue={editUser.name} className="w-full bg-white/5 border border-slate-200 rounded px-3 py-2 text-xs outline-none focus:border-[#1e293b]/30" /></div>
                                <div><label className="text-[9px] text-slate-500 block mb-1">Email</label><input defaultValue={editUser.email} className="w-full bg-white/5 border border-slate-200 rounded px-3 py-2 text-xs outline-none focus:border-[#1e293b]/30" /></div>
                                <div><label className="text-[9px] text-slate-500 block mb-1">Role</label>
                                    <select defaultValue={editUser.role} className="w-full bg-white/5 border border-slate-200 rounded px-3 py-2 text-xs outline-none">
                                        {roles.filter(r => r !== "All").map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[9px] text-slate-500 block mb-2">Permissions</label>
                                    {["View", "Edit", "Admin", "Super"].map(p => (
                                        <label key={p} className="flex items-center gap-2 text-[11px] text-slate-600 mb-1"><input type="checkbox" defaultChecked={p === "View"} className="accent-[#1e293b]" />{p}</label>
                                    ))}
                                </div>
                                <button className="w-full mt-2 bg-[#1e293b]/10 text-[#1e293b] border border-[#1e293b]/20 rounded py-2 text-[11px] font-bold hover:bg-[#1e293b]/20">Save Changes</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
