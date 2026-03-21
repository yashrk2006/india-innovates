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
        <main className="flex-1 overflow-y-auto relative w-full">
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button className="md:hidden text-slate-700" onClick={() => setIsOpen(!isOpen)}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>menu</span>
                    </button>
                    <h2 className="text-slate-900 text-base sm:text-lg font-bold">{title}</h2>
                    {badge && (
                        <span className="font-mono text-[9px] tracking-[1.5px] uppercase px-2 py-0.5 rounded border font-bold"
                            style={{ color: badgeColor, background: badgeColor + "12", borderColor: badgeColor + "30" }}>{badge}</span>
                    )}
                </div>
                {actions}
            </header>
            <motion.div key={title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
                className="p-4 sm:p-6 space-y-6">{children}</motion.div>
        </main>
    );
}

/* ── Reusable Card ── */
export function MgrCard({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay, duration: 0.3 }}
            className="bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden">{children}</motion.div>
    );
}

/* ── Section Header ── */
export function MgrSection({ title, icon, action }: { title: string; icon: string; action?: ReactNode }) {
    return (
        <div className="bg-slate-50/80 px-5 py-3 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-mono text-[9px] tracking-[2.5px] font-bold uppercase text-slate-600 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500" style={{ fontSize: 13 }}>{icon}</span> {title}
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
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay, duration: 0.3 }}
            className="bg-white border border-slate-200 rounded-lg p-4 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-mono text-[9px] tracking-[2.5px] font-bold uppercase text-slate-400 mb-2">{label}</p>
                    <p className="text-[28px] font-extrabold text-slate-900 leading-none tracking-tight">{value}</p>
                    {sub && <p className="font-mono text-[10px] mt-2 font-medium" style={{ color }}>{sub}</p>}
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: color + "12", border: `1px solid ${color}20` }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 15, color }}>{icon}</span>
                </div>
            </div>
        </motion.div>
    );
}

/* ── Progress Bar ── */
export function MgrBar({ pct, color = "#475569", h = 4 }: { pct: number; color?: string; h?: number }) {
    return (
        <div className="bg-slate-100 rounded-sm overflow-hidden" style={{ height: h }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }}
                className="rounded-sm" style={{ background: color, height: h }} />
        </div>
    );
}
