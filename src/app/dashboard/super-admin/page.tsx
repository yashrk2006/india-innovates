"use strict";
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── CONSTANTS & THEME TOKENS ─────────────────────────────────────────── */


/* ── SVG ICONS ─────────────────────────────────────────────── */
const I = ({ n, s = 14, c = "currentColor", className = "" }: { n: string; s?: number; c?: string; className?: string }) => {
    const d: Record<string, string> = {
        dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
        activity: "M22 12h-4l-3 9L9 3l-3 9H2",
        users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
        shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
        alert: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
        lock: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4",
        settings: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
        bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
        search: "M11 17a6 6 0 100-12 6 6 0 000 12z M21 21l-4.35-4.35",
        eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12a3 3 0 100-6 3 3 0 000 6",
        power: "M18.36 6.64a9 9 0 11-12.73 0 M12 2v10",
        download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
        list: "M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01",
        flag: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7",
        cpu: "M18 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2z M9 9h6v6H9z",
        database: "M12 2a9 3 0 110 6A9 3 0 0112 2z M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12 M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5",
        zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
        map: "M1 6l7-3 8 3 7-3v15l-7 3-8-3-7 3V6z M8 3v15 M16 6v15",
        check: "M20 6L9 17l-5-5",
        x: "M18 6L6 18 M6 6l12 12",
        chevron_right: "M9 18l6-6-6-6",
        chevron_down: "M6 9l6 6 6-6",
        filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
        plus: "M12 5v14 M5 12h14",
        more: "M12 13a1 1 0 100-2 1 1 0 000 2z M19 13a1 1 0 100-2 1 1 0 000 2z M5 13a1 1 0 100-2 1 1 0 000 2z",
        logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
        trending_up: "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
        file: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
        send: "M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z",
        refresh: "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0020.49 15",
        globe: "M12 2a10 10 0 110 20A10 10 0 0112 2z M2 12h20 M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
        key: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
        info: "M12 22a10 10 0 110-20 10 10 0 010 20z M12 8h.01 M12 12v4",
    };
    return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            {d[n]?.split(" M").map((seg, i) => <path key={i} d={i === 0 ? seg : "M" + seg} />)}
        </svg>
    );
};

/* ── MINI SPARKLINE ─────────────────────────────────────────── */
const Spark = ({ data, color = "#c9a84c", h = 32 }: { data: number[]; color?: string; h?: number }) => {
    const w = 80;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * (h - 4) - 2}`).join(" ");
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
            <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx={pts.split(" ").at(-1)?.split(",")[0]} cy={pts.split(" ").at(-1)?.split(",")[1]} r="2.5" fill={color} />
        </svg>
    );
};



/* ── KPI CARD ───────────────────────────────────────────────── */
interface KPIProps {
    icon: string;
    label: string;
    value: string;
    sub?: string;
    trend?: "up" | "down";
    spark?: number[];
    color?: string;
}

const KPI = ({ icon, label, value, sub, trend, spark, color = "#c9a84c" }: KPIProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-surface-dark border border-white/5 rounded-md p-4 relative overflow-hidden flex-1 min-w-[140px]`}
        >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-gold to-transparent opacity-50" />
            <div className="flex justify-between items-start">
                <div>
                    <div className="font-mono text-[9px] tracking-widest text-white/50 uppercase mb-2">{label}</div>
                    <div className="font-serif text-2xl font-bold text-white leading-none">{value}</div>
                    {sub && (
                        <div className="flex items-center gap-1 mt-1.5">
                            {trend && <I n={trend === "up" ? "trending_up" : "chevron_down"} s={10} c={trend === "up" ? "#4ade80" : "#f87171"} />}
                            <span className={`font-mono text-[9px] ${trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-white/50"}`}>{sub}</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                        <I n={icon} s={14} c={color} />
                    </div>
                    {spark && <Spark data={spark} color={color} />}
                </div>
            </div>
        </motion.div>
    );
};

/* ── SECTION WRAPPER ────────────────────────────────────────── */
interface SectionProps {
    title: string;
    children: React.ReactNode;
    action?: string;
    icon?: string;
}

const Section = ({ title, children, action, icon }: SectionProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-surface-dark border border-white/5 rounded-md p-4"
    >
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                {icon && <I n={icon} s={13} c="#c9a84c" />}
                <span className="font-mono text-[9px] tracking-[2.5px] uppercase text-accent-gold">{title}</span>
            </div>
            {action && (
                <button className="px-2 py-1 bg-transparent border border-white/20 text-white/50 text-[10px] font-mono tracking-wider uppercase rounded hover:border-accent-gold hover:text-accent-gold transition-colors">
                    {action}
                </button>
            )}
        </div>
        {children}
    </motion.div>
);

/* ══════════════════════════════════════════════════════════════
   PAGE: SYSTEM OVERVIEW
   ══════════════════════════════════════════════════════════════ */
const PageOverview = () => {
    // ... [Content ported from original file with updated styles]
    const services = [
        { name: "API Gateway", latency: "28ms", status: "ok" },
        { name: "Notification Queue", latency: "11ms", status: "ok" },
        { name: "AI Inference", latency: "420ms", status: "warn" },
    ];
    const events = [
        { time: "14:32:01", user: "CONST_UP14", action: "Campaign approved and dispatched", risk: "low" },
        { time: "14:28:44", user: "BTH_DL04", action: "ANOMALY — 50 change requests in 60 min", risk: "high" },
        { time: "14:21:19", user: "ST_MH", action: "New state admin account activated", risk: "low" },
    ];
    return (
        <div className="flex flex-col gap-5">
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KPI icon="users" label="Active Users" value="1,284" sub="+43 today" trend="up" spark={[900, 950, 1000, 980, 1100, 1200, 1284]} color="#c9a84c" />
                <KPI icon="zap" label="Live Campaigns" value="47" sub="8 states" spark={[30, 38, 42, 40, 45, 44, 47]} color="#f97316" />
                <KPI icon="activity" label="Uptime" value="99.8%" sub="30-day avg" trend="up" spark={[99, 100, 99.5, 100, 99.8, 100, 99.8]} color="#4ade80" />
                <KPI icon="alert" label="Critical Alerts" value="3" sub="Action required" trend="down" color="#ef4444" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Live Event Stream */}
                <div className="lg:col-span-2">
                    <Section title="Live System Events" icon="activity">
                        <div className="flex flex-col max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                            {events.map((e, i) => (
                                <div key={i} className="flex gap-3 py-2 border-b border-white/5 items-start">
                                    <div className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${e.risk === "high" ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]" : e.risk === "med" ? "bg-amber-500" : "bg-green-500"}`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-mono text-[10px] text-accent-gold mb-0.5">{e.user}</div>
                                        <div className="text-[11px] text-white/60 leading-tight">{e.action}</div>
                                    </div>
                                    <span className="font-mono text-[9px] text-white/40 flex-shrink-0">{e.time}</span>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>

                {/* Service Health */}
                <div>
                    <Section title="Service Health" icon="cpu">
                        <div className="space-y-2">
                            {services.map((s, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                    <div className="flex gap-2 items-center">
                                        <div className={`w-1.5 h-1.5 rounded-full ${s.status === "ok" ? "bg-green-500 shadow-[0_0_6px_rgba(74,222,128,0.5)]" : "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]"}`} />
                                        <span className="font-mono text-[10px] text-white/60">{s.name}</span>
                                    </div>
                                    <span className={`font-mono text-[10px] ${s.status === "warn" ? "text-amber-500" : "text-green-500"}`}>{s.latency}</span>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════
   SIDEBAR NAV DATA
   ══════════════════════════════════════════════════════════════ */
const NAV = [
    { section: "OVERVIEW", items: [{ id: "dashboard", icon: "dashboard", label: "System Dashboard" }, { id: "activity", icon: "activity", label: "Live Activity" }] },
    { section: "MANAGEMENT", items: [{ id: "users", icon: "users", label: "User Management" }, { id: "campaigns", icon: "send", label: "Campaign Monitor" }] },
    { section: "MONITORING", items: [{ id: "anomalies", icon: "alert", label: "Anomaly Detection" }, { id: "audit", icon: "file", label: "Audit Log Archive" }] },
    { section: "SECURITY", items: [{ id: "freeze", icon: "power", label: "Platform Freeze" }, { id: "access", icon: "lock", label: "Access Control" }] },
];

const PAGE_TITLES: Record<string, string> = {
    dashboard: "System Dashboard", activity: "Live Activity Feed",
    users: "User Management", campaigns: "Campaign Monitor",
    anomalies: "Anomaly Detection", audit: "Audit Log Archive",
    freeze: "Platform Freeze", access: "Access Control",
};

/* ══════════════════════════════════════════════════════════════
   MAIN APP SHELL
   ══════════════════════════════════════════════════════════════ */
export default function SuperAdminPage() {
    const [page, setPage] = useState("dashboard");
    const [collapsed, setCollapsed] = useState(false);
    const [clock, setClock] = useState("");

    useEffect(() => {
        setClock(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        const t = setInterval(() => setClock(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })), 1000);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="flex h-screen overflow-hidden bg-background-dark text-white font-sans selection:bg-accent-gold/20">
            {/* ── SIDEBAR ── */}
            <motion.div
                animate={{ width: collapsed ? 64 : 240 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-surface-dark border-r border-white/10 flex flex-col flex-shrink-0 relative z-20"
            >
                {/* Logo */}
                <div className="p-5 border-b border-white/10 flex-shrink-0">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
                        <div className="w-8 h-8 rounded bg-accent-gold/10 border border-accent-gold flex items-center justify-center flex-shrink-0">
                            <I n="globe" s={16} c="#c9a84c" />
                        </div>
                        {!collapsed && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
                                <div className="font-serif text-lg font-bold text-accent-gold whitespace-nowrap">BoothIQ</div>
                                <div className="px-1.5 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-[9px] font-mono font-bold text-red-400 tracking-wider">SUPER ADMIN</div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Nav */}
                <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
                    {NAV.map(({ section, items }) => (
                        <div key={section}>
                            {!collapsed && <div className="px-3 mb-2 font-mono text-[9px] tracking-[2px] uppercase text-white/30">{section}</div>}
                            {items.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => setPage(item.id)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all duration-200 group ${page === item.id ? "bg-accent-gold/10 text-accent-gold" : "text-white/50 hover:bg-white/5 hover:text-white"}`}
                                    title={collapsed ? item.label : ""}
                                >
                                    <I n={item.icon} s={16} c="currentColor" />
                                    {!collapsed && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex justify-between items-center text-[11px] font-medium tracking-wide">
                                            <span>{item.label}</span>
                                            {page === item.id && <I n="chevron_right" s={12} />}
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* User Footer */}
                {!collapsed && (
                    <div className="p-4 border-t border-white/10 bg-black/20">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(74,222,128,0.5)]" />
                            <span className="font-mono text-[9px] text-green-400">Systems Online</span>
                        </div>
                        <div className="font-mono text-[8px] text-white/30">v2.4.0 · STABLE</div>
                    </div>
                )}
            </motion.div>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 flex flex-col min-w-0 bg-background-dark relative">
                <div className="absolute inset-0 bg-[radial-gradient(#c9a84c_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

                {/* Header */}
                <div className="h-16 border-b border-white/10 bg-surface-dark/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
                    <h1 className="font-serif text-lg font-bold text-white tracking-tight">{PAGE_TITLES[page]}</h1>

                    <div className="flex items-center gap-6">
                        <span className="hidden md:block font-mono text-[11px] text-white/50 tracking-widest">{clock} IST</span>

                        <button className="relative w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                            <I n="bell" s={16} c="#fff" />
                            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 border border-surface-dark" />
                        </button>

                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 border border-white/20 flex items-center justify-center shadow-lg shadow-red-500/20">
                            <span className="font-mono text-[10px] font-bold text-white">SA</span>
                        </div>
                    </div>
                </div>

                {/* Page View */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative z-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={page}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {page === "dashboard" ? <PageOverview /> : (
                                <div className="flex flex-col items-center justify-center h-[60vh] text-center border border-dashed border-white/10 rounded-lg bg-white/5">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                        <I n="lock" s={24} c="#ffffff40" />
                                    </div>
                                    <h3 className="font-serif text-xl text-white/80 mb-2">{PAGE_TITLES[page]}</h3>
                                    <p className="font-mono text-xs text-white/40 max-w-sm">This module is currently locked or under maintenance. Please check back later.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
