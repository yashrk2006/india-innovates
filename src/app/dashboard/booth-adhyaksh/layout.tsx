"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";

function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;
}

function NavItem({ icon, label, href = "#", onClick }: { icon: string; label: string; href?: string; onClick?: () => void }) {
    const pathname = usePathname();
    const active = pathname === href;

    const content = (
        <>
            <div className={`size-8 rounded-lg flex items-center justify-center transition-all ${active ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-slate-800 text-slate-500 group-hover:bg-slate-700 group-hover:text-slate-300"}`}>
                <Icon name={icon} size={18} />
            </div>
            <span className="font-medium tracking-tight">{label}</span>
            {active && (
                <motion.div 
                    layoutId="active-nav-booth"
                    className="absolute left-0 w-1 h-6 bg-orange-500 rounded-r-full"
                />
            )}
        </>
    );

    const baseClass = `relative w-full flex items-center gap-3 px-4 py-2 text-sm transition-all group select-none ${
        active 
        ? "text-white bg-white/5" 
        : "text-slate-400 hover:text-white hover:bg-white/5"
    }`;

    if (onClick) {
        return (
            <button onClick={onClick} className={baseClass}>
                {content}
            </button>
        );
    }

    return (
        <Link href={href} className={baseClass}>
            {content}
        </Link>
    );
}

function NavLabel({ text }: { text: string }) {
    return <p className="text-[10px] font-black tracking-[0.15em] uppercase text-slate-500 px-4 pt-6 pb-2">{text}</p>;
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
        <div className="flex h-screen bg-stone-50 text-slate-700 overflow-hidden">
            {/* ─── Left Sidebar ─── */}
            <aside className="w-64 bg-[#0d0f1a] border-r border-white/5 flex flex-col shrink-0">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="size-10 rounded-xl bg-orange-500 text-slate-900 flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Icon name="military_tech" size={24} />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-white tracking-tight leading-none uppercase">Vibe</h1>
                            <p className="text-[10px] font-black text-orange-500 tracking-widest uppercase opacity-80">Booth Adhyaksh</p>
                        </div>
                    </div>
                </div>
                
                <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
                    <NavLabel text="Command Center" />
                    <NavItem icon="dashboard" label="Overview" href="/dashboard/booth-adhyaksh" />
                    <NavItem icon="groups" label="Worker Grid" href="/dashboard/booth-adhyaksh/worker-status" />
                    <NavItem icon="map" label="Voter Territory" href="/dashboard/booth-adhyaksh/voter-map" />
                    
                    <NavLabel text="Operations" />
                    <NavItem icon="assignment_turned_in" label="Task Central" href="/dashboard/booth-adhyaksh/issue-tracker" />
                    <NavItem icon="inventory_2" label="Supplies" href="#" />
                    <NavItem icon="campaign" label="War Room" href="#" />

                    <NavLabel text="Analytics" />
                    <NavItem icon="trending_up" label="Booth Trends" href="#" />
                    <NavItem icon="how_to_reg" label="Registration Hub" href="#" />
                    <NavItem icon="report_problem" label="Critical Alerts" href="#" />
                </nav>

                <div className="p-4 mt-auto">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 group hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="size-10 rounded-full bg-slate-800 shadow-sm border border-orange-500/20 flex items-center justify-center text-orange-500 font-bold">
                                SK
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-xs font-bold truncate">Sanjay Kumar</p>
                                <p className="text-slate-500 text-[10px] font-medium truncate uppercase tracking-widest">Booth 142 Leader</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-red-500 transition-all"
                        >
                            <Icon name="logout" size={14} />
                            Deploy Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* ─── Main Content ─── */}
            <main className="flex-1 overflow-y-auto bg-stone-50/50 relative">
                <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />
                <div className="relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
