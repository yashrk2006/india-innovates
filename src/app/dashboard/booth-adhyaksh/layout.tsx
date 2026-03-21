"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;
}

function NavItem({ icon, label, href = "#", onClick }: { icon: string; label: string; href?: string; onClick?: () => void }) {
    const pathname = usePathname();
    const active = pathname === href;

    const content = (
        <>
            <Icon name={icon} size={16} />
            <span>{label}</span>
        </>
    );

    if (onClick) {
        return (
            <button onClick={onClick} className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded text-[11px] font-mono tracking-[0.5px] border-l-2 transition-all cursor-pointer select-none ${active ? "text-[#e8761a] bg-[#e8761a]/10 border-l-[#e8761a]" : "text-slate-700/25 border-l-transparent hover:text-slate-700/65 hover:bg-[#334155]/[0.03] hover:border-l-[#e8761a]/20"}`}>
                {content}
            </button>
        );
    }

    return (
        <Link href={href} className={`flex items-center gap-2.5 px-3.5 py-2 rounded text-[11px] font-mono tracking-[0.5px] border-l-2 transition-all cursor-pointer select-none ${active ? "text-[#e8761a] bg-[#e8761a]/10 border-l-[#e8761a]" : "text-slate-700/25 border-l-transparent hover:text-slate-700/65 hover:bg-[#334155]/[0.03] hover:border-l-[#e8761a]/20"}`}>
            {content}
        </Link>
    );
}

function NavLabel({ text }: { text: string }) {
    return <p className="font-mono text-[9px] tracking-[2.5px] uppercase text-slate-700/25 px-3.5 pt-3 pb-1">{text}</p>;
}

export default function BoothAdhyakshLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        document.cookie = "user_role=; path=/; max-age=0";
        router.push("/auth/login?role=booth-adhyaksh");
    };

    return (
        <div className="flex h-screen bg-stone-50 text-slate-700 overflow-hidden" style={{ fontFamily: "'Public Sans', 'Literata', serif" }}>
            {/* ─── Left Sidebar ─── */}
            <aside className="w-64 bg-[#0d0f1a] border-r border-slate-200 flex flex-col flex-shrink-0 transition-all duration-300">
                <div className="p-5 border-b border-slate-200">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-[#e8761a] flex items-center justify-center text-slate-900">
                            <Icon name="flag" size={18} />
                        </div>
                        <div>
                            <h1 className="text-slate-900 text-sm font-bold tracking-tight leading-none">BOOTH ADHYAKSH</h1>
                            <span className="text-[9px] font-mono text-[#e8761a] tracking-[2px] uppercase">Booth #142</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto custom-scrollbar">
                    <NavLabel text="Command Center" />
                    <NavItem icon="dashboard" label="Overview" href="/dashboard/booth-adhyaksh" />
                    <NavItem icon="groups" label="Worker Allocation" href="#" />
                    
                    <NavLabel text="Operations" />
                    <NavItem icon="checklist_rtl" label="Task Assignments" href="#" />
                    <NavItem icon="inventory_2" label="Material Distribution" href="#" />
                    <NavItem icon="campaign" label="Campaign Planning" href="#" />

                    <NavLabel text="Monitoring" />
                    <NavItem icon="ssid_chart" label="Voter Trends" href="#" />
                    <NavItem icon="how_to_reg" label="Registration Status" href="#" />
                    <NavItem icon="report_problem" label="Critical Issues" href="#" />
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white shadow-sm border border-[#e8761a]/30 flex items-center justify-center text-[#e8761a] font-serif font-bold text-sm">
                            SK
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-slate-900 text-xs font-medium truncate">Sanjay Kumar</p>
                            <p className="text-slate-700/25 text-[9px] font-mono truncate">President · Booth 142</p>
                        </div>
                        <button onClick={handleLogout} className="text-slate-700/25 hover:text-red-400 transition-colors">
                            <Icon name="logout" size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* ─── Main Content ─── */}
            <main className="flex-1 overflow-y-auto relative">
                {children}
            </main>
        </div>
    );
}
