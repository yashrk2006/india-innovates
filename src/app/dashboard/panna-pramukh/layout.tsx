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
            <button onClick={onClick} className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded text-[11px] font-mono tracking-[0.5px] border-l-2 transition-all cursor-pointer select-none ${active ? "text-[#1e293b] bg-[rgba(30,41,59,0.2)] border-l-[#1e293b]" : "text-slate-700/25 border-l-transparent hover:text-slate-700/65 hover:bg-[#334155]/[0.03] hover:border-l-[rgba(30,41,59,0.2)]"}`}>
                {content}
            </button>
        );
    }

    return (
        <Link href={href} className={`flex items-center gap-2.5 px-3.5 py-2 rounded text-[11px] font-mono tracking-[0.5px] border-l-2 transition-all cursor-pointer select-none ${active ? "text-[#1e293b] bg-[rgba(30,41,59,0.2)] border-l-[#1e293b]" : "text-slate-700/25 border-l-transparent hover:text-slate-700/65 hover:bg-[#334155]/[0.03] hover:border-l-[rgba(30,41,59,0.2)]"}`}>
            {content}
        </Link>
    );
}

function NavLabel({ text }: { text: string }) {
    return <p className="font-mono text-[9px] tracking-[2.5px] uppercase text-slate-700/25 px-3.5 pt-3 pb-1">{text}</p>;
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
        <div className="flex h-screen bg-stone-50 text-slate-700 overflow-hidden" style={{ fontFamily: "'Public Sans', 'Literata', serif" }}>
            {/* ─── Left Sidebar ─── */}
            <aside className="w-60 bg-white shadow-sm border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300">
                <div className="p-5 border-b border-slate-200">
                    <div className="flex items-center gap-2.5 mb-1.5">
                        <div className="w-8 h-8 rounded bg-[#10b981]/10 flex items-center justify-center border border-[#10b981]/20">
                            <Icon name="contacts" size={16} className="text-[#10b981]" />
                        </div>
                        <span className="font-serif text-sm font-bold tracking-wide text-slate-900">PANNA PRAMUKH</span>
                    </div>
                    <p className="text-[9px] text-slate-700/40 font-mono tracking-widest uppercase ml-10">Field Worker</p>
                </div>
                
                <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto custom-scrollbar">
                    <NavLabel text="My Pages" />
                    <NavItem icon="dashboard" label="Overview" href="/dashboard/panna-pramukh" />
                    <NavItem icon="list_alt" label="Voter List" href="/dashboard/panna-pramukh/voter-list" />
                    <NavItem icon="phone_in_talk" label="Call Queue" href="/dashboard/panna-pramukh/call-queue" />
                    
                    <div className="h-4" />
                    <NavLabel text="Actions" />
                    <NavItem icon="edit_note" label="Log Contact" href="/dashboard/panna-pramukh/log-contact" />
                    <NavItem icon="report_problem" label="Record Issue" href="#" />
                    <NavItem icon="share" label="Share Scheme" href="#" />
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white shadow-sm border border-[#10b981]/30 flex items-center justify-center text-[#10b981] font-serif font-bold text-sm">
                            {profile?.name?.charAt(0) || "W"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-slate-900 text-xs font-medium truncate">{profile?.name || "Field Worker"}</p>
                            <p className="text-slate-700/25 text-[9px] font-mono truncate">Booth {profile?.booths?.booth_number || "—"}</p>
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
