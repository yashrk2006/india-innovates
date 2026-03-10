"use client";
import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import ManagerSidebar from "./ManagerSidebar";

/* ── Shared Layout ── */
export default function ManagerPageLayout({ title, badge, badgeColor = "#c9a84c", actions, children }: {
    title: string; badge?: string; badgeColor?: string; actions?: ReactNode; children: ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#08090f] text-[#f0ece3] overflow-hidden" style={{ fontFamily: "'Public Sans', 'Literata', serif" }}>
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <ManagerSidebar isOpen={isSidebarOpen} />
            <main className="flex-1 overflow-y-auto">
                <header className="sticky top-0 z-40 bg-[#08090f]/95 backdrop-blur-sm border-b border-[rgba(255,255,255,0.05)] px-4 sm:px-6 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button className="md:hidden text-white" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>menu</span>
                        </button>
                        <h2 className="text-white text-base sm:text-lg font-bold">{title}</h2>
                        {badge && (
                            <span className="font-mono text-[9px] tracking-[1.5px] uppercase px-2 py-0.5 rounded border"
                                style={{ color: badgeColor, background: badgeColor + "12", borderColor: badgeColor + "30" }}>{badge}</span>
                        )}
                    </div>
                    {actions}
                </header>
                <motion.div key={title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
                    className="p-4 sm:p-6 space-y-6">{children}</motion.div>
            </main>
        </div>
    );
}

/* ── Reusable Card ── */
export function MgrCard({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay, duration: 0.3 }}
            className="bg-[#111520] border border-[rgba(201,168,76,0.14)] rounded-lg overflow-hidden">{children}</motion.div>
    );
}

/* ── Section Header ── */
export function MgrSection({ title, icon, action }: { title: string; icon: string; action?: ReactNode }) {
    return (
        <div className="bg-[#161b28] px-5 py-3 flex items-center justify-between border-b border-[rgba(255,255,255,0.05)]">
            <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#c9a84c] flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>{icon}</span> {title}
            </h3>
            {action}
        </div>
    );
}

/* ── KPI Card ── */
export function MgrKPI({ icon, label, value, sub, color = "#c9a84c", delay = 0 }: {
    icon: string; label: string; value: string; sub?: string; color?: string; delay?: number;
}) {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay, duration: 0.3 }}
            className="bg-[#111520] border border-[rgba(201,168,76,0.14)] rounded-lg p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#f0ece3]/30 mb-2">{label}</p>
                    <p className="text-[28px] font-bold text-white/90 leading-none">{value}</p>
                    {sub && <p className="font-mono text-[9px] mt-1.5" style={{ color }}>{sub}</p>}
                </div>
                <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: color + "18", border: `1px solid ${color}30` }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color }}>{icon}</span>
                </div>
            </div>
        </motion.div>
    );
}

/* ── Progress Bar ── */
export function MgrBar({ pct, color = "#c9a84c", h = 4 }: { pct: number; color?: string; h?: number }) {
    return (
        <div className="bg-[rgba(255,255,255,0.05)] rounded-sm overflow-hidden" style={{ height: h }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }}
                className="rounded-sm" style={{ background: color, height: h }} />
        </div>
    );
}
