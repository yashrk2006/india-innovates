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
            <div className={`size-8 rounded-lg flex items-center justify-center transition-all ${active ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600"}`}>
                <Icon name={icon} size={18} />
            </div>
            <span className="font-medium tracking-tight">{label}</span>
            {active && (
                <motion.div 
                    layoutId="active-nav"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                />
            )}
        </>
    );

    const baseClass = `relative w-full flex items-center gap-3 px-4 py-2 text-sm transition-all group select-none ${
        active 
        ? "text-slate-900 bg-slate-50/80" 
        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
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
    return <p className="text-[10px] font-black tracking-[0.15em] uppercase text-slate-400 px-4 pt-6 pb-2">{text}</p>;
}

export default function PannaPramukhLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profileData } = await supabase
                    .from("profiles")
                    .select("*, booths(name, booth_number)")
                    .eq("id", user.id)
                    .single();
                setProfile(profileData);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
    };

    return (
        <div className="flex h-screen bg-stone-50 text-slate-700 overflow-hidden">
            {/* ─── Left Sidebar ─── */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                            <Icon name="monitoring" size={24} />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase">Vibe</h1>
                            <p className="text-[10px] font-black text-primary tracking-widest uppercase opacity-80">Panna Pramukh</p>
                        </div>
                    </div>
                </div>
                
                <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
                    <NavLabel text="Operations" />
                    <NavItem icon="dashboard" label="Overview" href="/dashboard/panna-pramukh" />
                    <NavItem icon="group" label="My Voters" href="/dashboard/panna-pramukh/voter-list" />
                    <NavItem icon="phone_forwarded" label="Contact Queue" href="/dashboard/panna-pramukh/call-queue" />
                    
                    <NavLabel text="Quick Actions" />
                    <NavItem icon="add_reaction" label="Log Contact" onClick={() => {}} />
                    <NavItem icon="report_gmailerrorred" label="Record Issue" href="#" />
                    <NavItem icon="card_giftcard" label="Incentivize Support" href="#" />
                </nav>

                <div className="p-4 mt-auto">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 group hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="size-10 rounded-full bg-white shadow-sm border border-primary/20 flex items-center justify-center text-primary font-bold">
                                {profile?.name?.charAt(0) || "W"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-slate-900 text-xs font-bold truncate">{profile?.name || "Field Worker"}</p>
                                <p className="text-slate-400 text-[10px] font-medium truncate uppercase tracking-widest">Booth {profile?.booths?.booth_number || "—"}</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all"
                        >
                            <Icon name="logout" size={14} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* ─── Main Content ─── */}
            <main className="flex-1 overflow-y-auto bg-stone-50/50 relative">
                <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                <div className="relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
