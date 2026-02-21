"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function Icon({ name, size = 16, style }: { name: string; size?: number; style?: React.CSSProperties }) {
    return <span className="material-symbols-outlined" style={{ fontSize: size, ...style }}>{name}</span>;
}

const NAV = [
    {
        section: "Operations", items: [
            { icon: "dashboard", label: "Dashboard", href: "/dashboard/manager" },
            { icon: "location_on", label: "Booth Monitor", href: "/dashboard/manager/booth-monitor" },
            { icon: "group", label: "Worker Tracker", href: "/dashboard/manager/worker-tracker" },
        ]
    },
    {
        section: "Intelligence", items: [
            { icon: "monitoring", label: "Voter Pulse", href: "/dashboard/manager/voter-pulse" },
            { icon: "search_insights", label: "Scheme Gaps", href: "/dashboard/manager/scheme-gaps" },
        ]
    },
    {
        section: "Admin", items: [
            { icon: "event", label: "Events & Rallies", href: "/dashboard/manager/events" },
            { icon: "summarize", label: "Reports & MIS", href: "/dashboard/manager/reports" },
        ]
    },
];

export default function ManagerSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (href: string) =>
        href === "/dashboard/manager" ? pathname === href : pathname.startsWith(href);

    const handleLogout = () => {
        document.cookie = "user_role=; path=/; max-age=0";
        router.push("/auth?role=manager");
    };

    return (
        <aside className="w-64 bg-[#0d0f1a] border-r border-[rgba(201,168,76,0.14)] flex flex-col flex-shrink-0 h-screen">
            {/* Brand */}
            <div className="p-5 border-b border-[rgba(255,255,255,0.05)]">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-[#c9a84c] flex items-center justify-center text-[#08090f]">
                        <Icon name="campaign" size={18} />
                    </div>
                    <div>
                        <h1 className="text-white text-sm font-bold tracking-tight leading-none">DISTRICT ADMIN</h1>
                        <span className="text-[9px] font-mono text-[#c9a84c] tracking-[2px] uppercase">Lucknow</span>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto">
                {NAV.map(({ section, items }) => (
                    <div key={section}>
                        <p className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#f0ece3]/25 px-3.5 pt-3 pb-1">{section}</p>
                        {items.map(item => {
                            const active = isActive(item.href);
                            return (
                                <Link key={item.href} href={item.href}
                                    className={`flex items-center gap-2.5 px-3.5 py-2 rounded text-[11px] font-mono tracking-[0.5px] border-l-2 transition-all cursor-pointer select-none mx-1 ${active ? "text-[#c9a84c] bg-[rgba(201,168,76,0.12)] border-l-[#c9a84c]" : "text-[#f0ece3]/25 border-l-transparent hover:text-[#f0ece3]/65 hover:bg-[#f0ece3]/[0.03] hover:border-l-[rgba(201,168,76,0.14)]"}`}
                                >
                                    <Icon name={item.icon} size={16} />
                                    <span>{item.label}</span>
                                    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* User */}
            <div className="p-4 border-t border-[rgba(255,255,255,0.05)]">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#111520] border border-[rgba(201,168,76,0.14)] flex items-center justify-center text-[#c9a84c] font-bold text-sm">RK</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium truncate">Rajesh Kumar</p>
                        <p className="text-[#f0ece3]/25 text-[9px] font-mono truncate">District Manager</p>
                    </div>
                    <button onClick={handleLogout} className="text-[#f0ece3]/25 hover:text-red-400 transition-colors"><Icon name="logout" size={16} /></button>
                </div>
            </div>
        </aside>
    );
}
