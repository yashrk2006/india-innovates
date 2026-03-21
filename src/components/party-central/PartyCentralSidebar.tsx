"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useSidebar } from "./SidebarContext";

function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;
}

function NavItem({ icon, label, active = false, badge, href = "#", onClick }: { icon: string; label: string; active?: boolean; badge?: string; href?: string; onClick?: () => void }) {
    return (
        <Link href={href} onClick={onClick} className={`w-full flex items-center justify-between px-3 py-2 rounded text-[11px] font-medium transition-all cursor-pointer ${active ? "bg-[rgba(139,92,246,0.12)] text-[#8b5cf6]" : "text-slate-700/40 hover:text-slate-700/70 hover:bg-white/[0.03]"}`}>
            <div className="flex items-center gap-3">
                <Icon name={icon} size={16} /><span>{label}</span>
            </div>
            {badge && <span className="text-[9px] font-mono bg-[#8b5cf6]/20 text-[#8b5cf6] px-1.5 py-0.5 rounded">{badge}</span>}
        </Link>
    );
}

export default function PartyCentralSidebar({ isOpen: propIsOpen = false }: { isOpen?: boolean }) {
    const pathname = usePathname();
    const router = useRouter();
    const { isOpen: contextIsOpen, setIsOpen } = useSidebar();
    const isOpen = contextIsOpen !== undefined ? contextIsOpen : propIsOpen;

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        document.cookie = "user_role=; path=/; max-age=0";
        router.push("/auth/login?role=party-central");
    };

    const navGroups = [
        { title: "Command", items: [
            { icon: "dashboard", label: "War Room", href: "/dashboard/party-central" },
            { icon: "map", label: "National Map", href: "/dashboard/party-central/map" },
            { icon: "campaign", label: "Campaigns", badge: "2 Active", href: "/dashboard/party-central/campaigns" },
        ]},
        { title: "Network", items: [
            { icon: "groups", label: "Hierarchy", href: "/dashboard/party-central/hierarchy" },
            { icon: "assignment_ind", label: "Appointments", href: "/dashboard/party-central/appointments" },
            { icon: "how_to_reg", label: "Voter Base", href: "/dashboard/party-central/voter-base" },
        ]},
        { title: "Intelligence", items: [
            { icon: "trending_up", label: "Sentiment", href: "/dashboard/party-central/sentiment" },
            { icon: "report", label: "Alerts", badge: "5 New", href: "/dashboard/party-central/alerts" },
        ]},
    ];

    return (
        <aside className={`absolute z-50 md:relative w-56 h-full bg-white shadow-sm border-r border-[rgba(139,92,246,0.08)] flex flex-col shrink-0 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
            <div className="p-4 border-b border-[rgba(139,92,246,0.08)]">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded bg-[#8b5cf6]/20 flex items-center justify-center">
                        <Icon name="castle" size={14} className="text-[#8b5cf6]" />
                    </div>
                    <span className="font-serif text-sm font-bold tracking-wide">PARTY CENTRAL</span>
                </div>
                <p className="text-[9px] text-slate-400 font-mono tracking-widest ml-9">HQ COMMAND</p>
            </div>
            <nav className="flex-1 p-3 space-y-4 overflow-y-auto w-full">
                {navGroups.map((group, i) => (
                    <div key={i}>
                        <p className="text-[8px] font-mono text-slate-400 tracking-[3px] uppercase mb-2 px-3">{group.title}</p>
                        <div className="space-y-1 w-full">
                            {group.items.map(item => (
                                <NavItem 
                                    key={item.href} 
                                    icon={item.icon} 
                                    label={item.label} 
                                    badge={item.badge} 
                                    active={pathname === item.href} 
                                    href={item.href} 
                                    onClick={() => setIsOpen(false)} 
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
            <div className="p-4 border-t border-[rgba(139,92,246,0.08)]">
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors text-xs font-bold">
                    <Icon name="logout" size={16} /> Logout HQ
                </button>
            </div>
        </aside>
    );
}
