"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useSidebar } from "./SidebarContext";

function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;
}

function NavItem({ icon, label, active = false, href = "#", onClick }: { icon: string; label: string; active?: boolean; href?: string; onClick?: () => void }) {
    return (
        <Link href={href} onClick={onClick} className={`flex items-center gap-2.5 px-3.5 py-2 rounded text-[11px] font-mono tracking-[0.5px] border-l-2 transition-all cursor-pointer select-none ${active ? "text-[#1e293b] bg-[rgba(30,41,59,0.2)] border-l-[#1e293b]" : "text-slate-700/25 border-l-transparent hover:text-slate-700/65 hover:bg-[#334155]/[0.03] hover:border-l-[rgba(30,41,59,0.2)]"}`}>
            <Icon name={icon} size={16} />
            <span>{label}</span>
        </Link>
    );
}

function NavLabel({ text }: { text: string }) {
    return <p className="font-mono text-[9px] tracking-[2.5px] uppercase text-slate-700/25 px-3.5 pt-3 pb-1">{text}</p>;
}

export default function DataAnalystSidebar({ isOpen: propIsOpen = false }: { isOpen?: boolean }) {
    const pathname = usePathname();
    const router = useRouter();
    const { isOpen: contextIsOpen, setIsOpen } = useSidebar();
    const isOpen = contextIsOpen !== undefined ? contextIsOpen : propIsOpen;

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        document.cookie = "user_role=; path=/; max-age=0";
        router.push("/auth/login?role=data-analyst");
    };

    const navItems = [
        { section: "Analysis", items: [
            { icon: "dashboard", label: "Overview", href: "/dashboard/data-analyst" },
            { icon: "bubble_chart", label: "Knowledge Graph", href: "/dashboard/data-analyst/knowledge-graph" },
            { icon: "group", label: "Voter Segments", href: "/dashboard/data-analyst/voter-segments" },
        ]},
        { section: "Intelligence", items: [
            { icon: "psychology", label: "Sentiment Engine", href: "/dashboard/data-analyst/sentiment" },
            { icon: "query_stats", label: "Predictive Model", href: "/dashboard/data-analyst/predictive" },
            { icon: "schema", label: "Network Map", href: "/dashboard/data-analyst/network" },
        ]},
        { section: "Reports", items: [
            { icon: "summarize", label: "Generate Report", href: "/dashboard/data-analyst/reports" },
            { icon: "download", label: "Data Export", href: "/dashboard/data-analyst/export" },
        ]},
    ];

    return (
        <aside className={`absolute z-50 md:relative w-64 h-full bg-[#0d0f1a] border-r border-slate-200 flex flex-col flex-shrink-0 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-cyan-500 flex items-center justify-center text-[#f8fafc]">
                        <Icon name="analytics" size={18} />
                    </div>
                    <div>
                        <h1 className="text-slate-900 text-sm font-bold tracking-tight leading-none">DATA ANALYST</h1>
                        <span className="text-[9px] font-mono text-cyan-400 tracking-[2px] uppercase">Intelligence</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto">
                {navItems.map((group) => (
                    <div key={group.section}>
                        <NavLabel text={group.section} />
                        {group.items.map((item) => (
                            <NavItem
                                key={item.href}
                                icon={item.icon}
                                label={item.label}
                                href={item.href}
                                active={pathname === item.href}
                                onClick={() => setIsOpen(false)}
                            />
                        ))}
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white shadow-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-serif font-bold text-sm">
                        AK
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-slate-900 text-xs font-medium truncate">Aarav Kapoor</p>
                        <p className="text-slate-700/25 text-[9px] font-mono truncate">Sr. Data Analyst</p>
                    </div>
                    <button onClick={handleLogout} className="text-slate-700/25 hover:text-red-400 transition-colors">
                        <Icon name="logout" size={16} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
