"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useSidebar } from "./SidebarContext";

function Icon({ name, size = 16, style }: { name: string; size?: number; style?: React.CSSProperties }) {
    return <span className="material-symbols-outlined" style={{ fontSize: size, ...style }}>{name}</span>;
}

const NAV = [
    {
        section: "Operations", items: [
            { icon: "dashboard", label: "Dashboard", href: "/dashboard/manager" },
            { icon: "account_tree", label: "Chain of Command", href: "/dashboard/hierarchy?view=manager" },
            { icon: "location_on", label: "Booth Monitor", href: "/dashboard/manager/booth-monitor" },
            { icon: "group", label: "Worker Tracker", href: "/dashboard/manager/worker-tracker" },
        ]
    },
    {
        section: "Intelligence", items: [
            { icon: "monitoring", label: "Voter Pulse", href: "/dashboard/manager/voter-pulse" },
            { icon: "search_insights", label: "Scheme Gaps", href: "/dashboard/manager/scheme-gaps" },
            { icon: "send", label: "Scheme Distribution", href: "/dashboard/manager/scheme-distribution" },
        ]
    },
    {
        section: "Admin", items: [
            { icon: "event", label: "Events & Rallies", href: "/dashboard/manager/events" },
            { icon: "summarize", label: "Reports & MIS", href: "/dashboard/manager/reports" },
        ]
    },
];

export default function ManagerSidebar({ isOpen: propIsOpen = false }: { isOpen?: boolean }) {
    const pathname = usePathname();
    const router = useRouter();
    const { isOpen: contextIsOpen, setIsOpen } = useSidebar();
    const isOpen = contextIsOpen !== undefined ? contextIsOpen : propIsOpen;

    const isActive = (href: string) =>
        href === "/dashboard/manager" ? pathname === href : pathname.startsWith(href);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        document.cookie = "user_role=; path=/; max-age=0";
        router.push("/auth/login?role=manager");
    };

    return (
        <aside className={`absolute z-50 md:relative w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 h-screen transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} shadow-sm`}>
            {/* Brand */}
            <div className="p-5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-slate-900 shadow-md">
                        <Icon name="campaign" size={18} />
                    </div>
                    <div>
                        <h1 className="text-slate-900 text-sm font-bold tracking-tight leading-none">DISTRICT ADMIN</h1>
                        <span className="text-[9px] font-mono text-slate-500 tracking-[2px] uppercase font-bold">Lucknow</span>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto">
                {NAV.map(({ section, items }) => (
                    <div key={section} className="mb-2">
                        <p className="font-mono text-[9px] font-bold tracking-[2.5px] uppercase text-slate-400 px-3.5 pt-3 pb-1">{section}</p>
                        {items.map(item => {
                            const active = isActive(item.href);
                            return (
                                <Link key={item.href} href={item.href}
                                    onClick={() => setIsOpen?.(false)}
                                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded text-[12px] font-medium tracking-wide transition-all cursor-pointer select-none mx-2 my-0.5 ${
                                        active 
                                            ? "text-slate-900 bg-slate-100 font-bold shadow-sm" 
                                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                    }`}
                                >
                                    <Icon name={item.icon} size={18} />
                                    <span>{item.label}</span>
                                    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-slate-800" />}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* User */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-sm shadow-sm">RK</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-slate-900 text-xs font-bold truncate">Rajesh Kumar</p>
                        <p className="text-slate-500 text-[9px] font-mono truncate font-medium">District Manager</p>
                    </div>
                    <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors"><Icon name="logout" size={18} /></button>
                </div>
            </div>
        </aside>
    );
}
