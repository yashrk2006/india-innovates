"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;
}

const navSections = [
    {
        label: "OVERVIEW", items: [
            { icon: "dashboard", label: "Command Center", href: "/dashboard/eci-observer" },
            { icon: "map", label: "State Map", href: "/dashboard/eci-observer/state-map" },
            { icon: "how_to_vote", label: "Turnout Monitor", href: "/dashboard/eci-observer/turnout-monitor" },
        ]
    },
    {
        label: "COMPLIANCE", items: [
            { icon: "report", label: "Violation Tracker", href: "/dashboard/eci-observer/violation-tracker" },
            { icon: "videocam", label: "CCTV Feeds", href: "/dashboard/eci-observer/cctv-feeds" },
            { icon: "gavel", label: "Code Violations", href: "/dashboard/eci-observer/code-violations" },
        ]
    },
    {
        label: "REPORTS", items: [
            { icon: "description", label: "Interim Reports", href: "/dashboard/eci-observer/interim-reports" },
            { icon: "send", label: "Final Submissions", href: "/dashboard/eci-observer/final-submissions" },
        ]
    },
];

export default function ECISidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-60 bg-[#0a0c14] border-r border-red-500/10 flex flex-col shrink-0">
            {/* Brand */}
            <div className="p-5 border-b border-red-500/10">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/20">
                        <Icon name="shield" size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-white text-sm font-bold tracking-wide leading-none">ECI OBSERVER</h1>
                        <span className="text-[9px] font-mono text-red-400 tracking-[2px] uppercase">National Oversight</span>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
                {navSections.map(section => (
                    <div key={section.label}>
                        <p className="text-[8px] font-mono text-white/25 tracking-[3px] uppercase mb-2 px-3">{section.label}</p>
                        <div className="space-y-0.5">
                            {section.items.map(item => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link key={item.href} href={item.href}
                                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] font-medium transition-all duration-200 ${isActive
                                            ? "bg-red-500/12 text-red-400 shadow-sm shadow-red-500/5 border border-red-500/15"
                                            : "text-white/40 hover:text-white/80 hover:bg-white/[0.04] border border-transparent"
                                            }`}
                                    >
                                        <Icon name={item.icon} size={17} />
                                        <span>{item.label}</span>
                                        {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-400 shadow-lg shadow-red-400/50" />}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-red-500/10">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-900 to-red-800 border-2 border-red-500/30 flex items-center justify-center text-[10px] font-bold text-red-300">SR</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white/90 text-xs font-semibold truncate">S. Raghunath</p>
                        <p className="text-red-400/50 text-[9px] font-mono truncate">Gen. Observer · UP</p>
                    </div>
                    <button className="text-white/20 hover:text-red-400 transition-colors"><Icon name="logout" size={16} /></button>
                </div>
            </div>
        </aside>
    );
}
