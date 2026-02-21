"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import ECISidebar from "@/components/eci/ECISidebar";

function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;
}

interface ECILayoutProps {
    title: string;
    badge?: string;
    badgeColor?: string;
    children: ReactNode;
    actions?: ReactNode;
}

export default function ECIPageLayout({ title, badge, badgeColor = "#f87171", children, actions }: ECILayoutProps) {
    return (
        <div className="flex h-screen bg-[#06080e] text-white overflow-hidden">
            <ECISidebar />
            <main className="flex-1 overflow-y-auto">
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="sticky top-0 z-10 bg-[#06080e]/80 backdrop-blur-xl border-b border-white/[0.06] px-6 py-4 flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <h1 className="font-serif text-xl font-bold text-white tracking-tight">{title}</h1>
                        {badge && (
                            <motion.span
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-[10px] font-mono px-2.5 py-1 rounded-md border"
                                style={{ backgroundColor: badgeColor + "15", color: badgeColor, borderColor: badgeColor + "30" }}
                            >
                                {badge}
                            </motion.span>
                        )}
                    </div>
                    {actions && <div className="flex items-center gap-3">{actions}</div>}
                </motion.header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                    className="p-6"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}

/* ── Animated Card wrapper ── */
export function ECICard({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
            className={`bg-[#0d1018] rounded-xl border border-white/[0.06] overflow-hidden hover:border-red-500/15 transition-colors duration-300 ${className}`}
        >
            {children}
        </motion.div>
    );
}

/* ── Section Header ── */
export function ECISectionHeader({ title, icon, action }: { title: string; icon?: string; action?: ReactNode }) {
    return (
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04] bg-white/[0.01]">
            <h3 className="text-[10px] font-mono text-red-400 tracking-[2.5px] uppercase flex items-center gap-2">
                {icon && <Icon name={icon} size={13} />}
                {title}
            </h3>
            {action}
        </div>
    );
}

/* ── KPI Card ── */
export function ECIKPI({ icon, label, value, sub, color = "#f87171", delay = 0 }: { icon: string; label: string; value: string; sub?: string; color?: string; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
            className="bg-[#0d1018] rounded-xl border border-white/[0.06] p-5 relative overflow-hidden group hover:border-red-500/20 transition-all duration-300"
        >
            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-80" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex justify-between items-start">
                <div>
                    <p className="font-mono text-[9px] tracking-[2.5px] uppercase text-white/40 mb-2">{label}</p>
                    <p className="font-serif text-[32px] font-bold text-white leading-none">{value}</p>
                    {sub && <p className="font-mono text-[10px] mt-2 font-medium" style={{ color }}>{sub}</p>}
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: color + "15", border: `1px solid ${color}25` }}>
                    <Icon name={icon} size={18} style={{ color }} />
                </div>
            </div>
        </motion.div>
    );
}
