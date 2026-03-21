"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "./SidebarContext";

/* ── SVG ICONS ─────────────────────────────────────────────── */
const I = ({ n, s = 14, c = "currentColor", className = "" }: { n: string; s?: number; c?: string; className?: string }) => {
    const d: Record<string, string> = {
        dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
        activity: "M22 12h-4l-3 9L9 3l-3 9H2",
        users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
        shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
        alert: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
        lock: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4",
        search: "M11 17a6 6 0 100-12 6 6 0 000 12z M21 21l-4.35-4.35",
        power: "M18.36 6.64a9 9 0 11-12.73 0 M12 2v10",
        file: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
        send: "M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z",
        globe: "M12 2a10 10 0 110 20A10 10 0 0112 2z M2 12h20 M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
        chevron_right: "M9 18l6-6-6-6",
        menu: "M3 12h18 M3 6h18 M3 18h18",
    };
    return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            {d[n]?.split(" M").map((seg, i) => <path key={i} d={i === 0 ? seg : "M" + seg} />)}
        </svg>
    );
};

/* ══════════════════════════════════════════════════════════════
   SIDEBAR NAV DATA
   ══════════════════════════════════════════════════════════════ */
const NAV = [
    { section: "OVERVIEW", items: [{ id: "dashboard", icon: "dashboard", label: "System Dashboard", href: "/dashboard/super-admin" }, { id: "activity", icon: "activity", label: "Live Activity", href: "/dashboard/super-admin?page=activity" }] },
    { section: "MANAGEMENT", items: [{ id: "users", icon: "users", label: "User Management", href: "/dashboard/super-admin/user-management" }, { id: "campaigns", icon: "send", label: "Campaign Monitor", href: "/dashboard/super-admin?page=campaigns" }] },
    { section: "MONITORING", items: [{ id: "anomalies", icon: "alert", label: "Anomaly Detection", href: "/dashboard/super-admin/anomaly-detection" }, { id: "audit", icon: "file", label: "Audit Log Archive", href: "/dashboard/super-admin?page=audit" }] },
    { section: "SECURITY", items: [{ id: "freeze", icon: "power", label: "Platform Freeze", href: "/dashboard/super-admin?page=freeze" }, { id: "access", icon: "lock", label: "Access Control", href: "/dashboard/super-admin?page=access" }] },
];

export function SuperAdminSidebar() {
    const { isOpen, setIsOpen } = useSidebar();
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    return (
        <>
            {/* ── SIDEBAR OVERLAY FOR MOBILE ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* ── SIDEBAR ── */}
            <motion.aside
                animate={{ width: collapsed ? 64 : 240 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`bg-white shadow-sm border-r border-slate-200 flex flex-col flex-shrink-0 z-50 fixed md:relative h-full transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
            >
                {/* Logo */}
                <div className="p-5 border-b border-slate-200 flex-shrink-0 h-16 flex items-center">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
                        <div className="w-8 h-8 rounded bg-slate-800/10 border border-slate-800 flex items-center justify-center flex-shrink-0">
                            <I n="globe" s={16} c="#1e293b" />
                        </div>
                        {!collapsed && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
                                <div className="font-serif text-lg font-bold text-slate-800 whitespace-nowrap">BoothIQ</div>
                                <div className="px-1.5 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-[9px] font-mono font-bold text-red-400 tracking-wider w-fit mt-0.5">SUPER ADMIN</div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Nav */}
                <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
                    {NAV.map(({ section, items }) => (
                        <div key={section}>
                            {!collapsed && <div className="px-3 mb-2 font-mono text-[9px] tracking-[2px] uppercase text-slate-500">{section}</div>}
                            {items.map(item => {
                                const isActive = pathname === item.href || (pathname === "/dashboard/super-admin" && item.href === "/dashboard/super-admin");
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => {
                                            router.push(item.href);
                                            setIsOpen(false);
                                        }}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all duration-200 group ${isActive ? "bg-slate-800/10 text-slate-800" : "text-slate-500 hover:bg-white/5 hover:text-slate-900"}`}
                                        title={collapsed ? item.label : ""}
                                    >
                                        <I n={item.icon} s={16} c="currentColor" />
                                        {!collapsed && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex justify-between items-center text-[11px] font-medium tracking-wide">
                                                <span>{item.label}</span>
                                                {isActive && <I n="chevron_right" s={12} />}
                                            </motion.div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* User Footer */}
                {!collapsed && (
                    <div className="p-4 border-t border-slate-200 bg-black/20 mt-auto">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(74,222,128,0.5)]" />
                            <span className="font-mono text-[9px] text-green-400">Systems Online</span>
                        </div>
                        <div className="font-mono text-[8px] text-slate-500">v2.4.0 · STABLE</div>
                    </div>
                )}
            </motion.aside>
        </>
    );
}
