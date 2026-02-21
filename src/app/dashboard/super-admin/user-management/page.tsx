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
    Manager: "bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30",
    "Booth Adhyaksh": "bg-[#f97316]/10 text-[#f97316] border-[#f97316]/30",
    "Panna Pramukh": "bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/30",
    "Data Analyst": "bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/30",
    "ECI Observer": "bg-[#ec4899]/10 text-[#ec4899] border-[#ec4899]/30",
};
const statusColors: Record<string, string> = { Active: "text-[#4ade80]", Suspended: "text-red-400", Pending: "text-yellow-400" };

export default function UserManagementPage() {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [editUser, setEditUser] = useState<User | null>(null);

    const roles = ["All", ...Array.from(new Set(users.map(u => u.role)))];
    const filtered = users.filter(u => {
        const matchSearch = search === "" || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search);
        const matchRole = roleFilter === "All" || u.role === roleFilter;
        return matchSearch && matchRole;
    });

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
                    <NavItem icon="group" label="User Management" active href="/dashboard/super-admin/user-management" />
                    <p className="text-[8px] font-mono text-white/20 tracking-[3px] uppercase mb-2 mt-4 px-3">Security</p>
                    <NavItem icon="campaign" label="Campaign Monitor" />
                    <NavItem icon="psychology" label="Anomaly Detection" href="/dashboard/super-admin/anomaly-detection" />
                    <NavItem icon="history" label="Audit Log Archive" href="/dashboard/super-admin/audit-log" />
                    <p className="text-[8px] font-mono text-white/20 tracking-[3px] uppercase mb-2 mt-4 px-3">Control</p>
                    <NavItem icon="lock" label="Platform Freeze" />
                    <NavItem icon="vpn_key" label="Access Control" />
                </nav>
            </aside>

            <main className="flex-1 overflow-y-auto">
                <header className="sticky top-0 z-10 bg-[#08090f]/90 backdrop-blur-md border-b border-[rgba(201,168,76,0.08)] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="font-serif text-lg font-bold">User Management</h1>
                        <span className="text-[9px] font-mono bg-[#c9a84c]/10 text-[#c9a84c] px-2 py-0.5 rounded border border-[#c9a84c]/20">{users.length} users</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Icon name="search" size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
                            <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="bg-[#111520] border border-white/10 rounded pl-8 pr-3 py-1.5 text-xs w-48 focus:border-[#c9a84c]/40 outline-none" />
                        </div>
                        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="bg-[#111520] border border-white/10 rounded px-2 py-1.5 text-xs outline-none">{roles.map(r => <option key={r} value={r}>{r}</option>)}</select>
                        <button className="flex items-center gap-1.5 bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 px-3 py-1.5 rounded text-[11px] font-bold hover:bg-[#c9a84c]/20"><Icon name="add" size={14} /> Add User</button>
                    </div>
                </header>

                <div className="p-6 flex gap-6">
                    <div className={`${editUser ? "flex-[2]" : "flex-1"}`}>
                        <div className="bg-[#111520] rounded border border-[rgba(201,168,76,0.08)] overflow-hidden">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-white/5 text-white/30 font-mono text-[9px] tracking-wider uppercase">
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
                                        <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                            <td className="p-3"><div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-[#c9a84c]/10 flex items-center justify-center text-[9px] font-bold text-[#c9a84c]">{u.name.split(" ").map(n => n[0]).join("")}</div>
                                                <span className="font-medium">{u.name}</span>
                                            </div></td>
                                            <td className="p-3 text-white/40 font-mono">{u.email}</td>
                                            <td className="p-3"><span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${roleColors[u.role] || "bg-white/5 text-white/40"}`}>{u.role}</span></td>
                                            <td className="p-3"><span className={`text-[10px] font-bold ${statusColors[u.status]}`}>● {u.status}</span></td>
                                            <td className="p-3 text-white/30">{u.lastLogin}</td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => setEditUser(u)} className="p-1 rounded hover:bg-[#c9a84c]/10 text-white/30 hover:text-[#c9a84c]"><Icon name="edit" size={14} /></button>
                                                    <button className="p-1 rounded hover:bg-red-400/10 text-white/30 hover:text-red-400"><Icon name="block" size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Role Distribution */}
                        <div className="mt-4 bg-[#111520] rounded border border-[rgba(201,168,76,0.08)] p-4">
                            <h3 className="text-[10px] font-mono text-[#c9a84c] tracking-wider uppercase mb-3">Role Distribution</h3>
                            <div className="flex gap-2">
                                {Object.entries(users.reduce<Record<string, number>>((acc, u) => ({ ...acc, [u.role]: (acc[u.role] || 0) + 1 }), {})).map(([role, count]) => (
                                    <div key={role} className="flex-1 bg-white/[0.02] rounded p-2 text-center">
                                        <p className="font-serif text-lg font-bold">{count}</p>
                                        <p className="text-[8px] text-white/30 truncate">{role}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Edit Drawer */}
                    {editUser && (
                        <div className="w-80 bg-[#111520] rounded border border-[rgba(201,168,76,0.08)] p-5 shrink-0">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[11px] font-mono text-[#c9a84c] tracking-wider uppercase">Edit User</h3>
                                <button onClick={() => setEditUser(null)} className="text-white/30 hover:text-white/60"><Icon name="close" size={16} /></button>
                            </div>
                            <div className="space-y-4">
                                <div><label className="text-[9px] text-white/30 block mb-1">Name</label><input defaultValue={editUser.name} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs outline-none focus:border-[#c9a84c]/30" /></div>
                                <div><label className="text-[9px] text-white/30 block mb-1">Email</label><input defaultValue={editUser.email} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs outline-none focus:border-[#c9a84c]/30" /></div>
                                <div><label className="text-[9px] text-white/30 block mb-1">Role</label>
                                    <select defaultValue={editUser.role} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs outline-none">
                                        {roles.filter(r => r !== "All").map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[9px] text-white/30 block mb-2">Permissions</label>
                                    {["View", "Edit", "Admin", "Super"].map(p => (
                                        <label key={p} className="flex items-center gap-2 text-[11px] text-white/60 mb-1"><input type="checkbox" defaultChecked={p === "View"} className="accent-[#c9a84c]" />{p}</label>
                                    ))}
                                </div>
                                <button className="w-full mt-2 bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 rounded py-2 text-[11px] font-bold hover:bg-[#c9a84c]/20">Save Changes</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
