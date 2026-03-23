"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useSidebar } from "./SidebarContext";

/* ── Shared Layout ── */
export default function ManagerPageLayout({ title, badge, badgeColor = "#1e293b", actions, children }: {
    title: string; badge?: string; badgeColor?: string; actions?: ReactNode; children: ReactNode;
}) {
    const { isOpen, setIsOpen } = useSidebar();

    return (
        <main className="flex-1 overflow-y-auto relative w-full bg-slate-50/50">
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button className="md:hidden text-slate-700 hover:bg-slate-100 p-2 rounded-xl transition-colors" onClick={() => setIsOpen(!isOpen)}>
                        <span className="material-symbols-outlined" style={{ fontSize: 24 }}>menu</span>
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{title}</h2>
                        <div className="flex items-center gap-3 mt-2">
                             {badge && (
                                <span className="font-black text-[9px] tracking-widest uppercase px-3 py-1 rounded-full border"
                                    style={{ color: badgeColor, background: `${badgeColor}10`, borderColor: `${badgeColor}20` }}>{badge}</span>
                            )}
                            <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Lucknow Command Center</span>
                        </div>
                    </div>
                </div>
                {actions && (
                    <div className="flex items-center gap-4">
                        {actions}
                    </div>
                )}
            </header>
            <motion.div 
                key={title} 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="p-8 space-y-8"
            >
                {children}
            </motion.div>
        </main>
    );
}

/* ── Reusable Card ── */
export function MgrCard({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white border border-slate-200 shadow-sm rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all"
        >
            {children}
        </motion.div>
    );
}

/* ── Section Header ── */
export function MgrSection({ title, icon, action }: { title: string; icon: string; action?: ReactNode }) {
    return (
        <div className="px-8 py-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/30">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-3">
                <div className="size-8 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-orange-600" style={{ fontSize: 18 }}>{icon}</span>
                </div>
                {title}
            </h3>
            {action}
        </div>
    );
}

/* ── KPI Card ── */
export function MgrKPI({ icon, label, value, sub, color = "#475569", delay = 0 }: {
    icon: string; label: string; value: string; sub?: string; color?: string; delay?: number;
}) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay, duration: 0.5 }}
            className="bg-white border border-slate-200 rounded-[2.5rem] p-8 relative overflow-hidden shadow-sm group hover:shadow-xl transition-all"
        >
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined" style={{ fontSize: 80, color }}>{icon}</span>
            </div>
            
            <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">{label}</p>
                    <div className="size-10 rounded-2xl flex items-center justify-center bg-slate-50 text-slate-900 border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>
                    </div>
                </div>
                
                <div>
                    <h4 className="text-4xl font-black text-slate-900 tracking-tight">{value}</h4>
                    {sub && (
                        <div className="flex items-center gap-2 mt-2">
                            <div className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
                            <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color }}>{sub}</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

/* ── Progress Bar ── */
export function MgrBar({ pct, color = "#475569", h = 6 }: { pct: number; color?: string; h?: number }) {
    return (
        <div className="bg-slate-100 rounded-full overflow-hidden w-full relative" style={{ height: h }}>
            <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${pct}%` }} 
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full rounded-full" 
                style={{ backgroundColor: color }} 
            />
        </div>
    );
}
