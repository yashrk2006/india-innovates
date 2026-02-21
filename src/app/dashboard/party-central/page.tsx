"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

/* ──────────────────────────────────────────────────────────
   Icon Helper (Material Symbols)
   ────────────────────────────────────────────────────────── */
function Icon({
    name,
    className = "",
    size,
}: {
    name: string;
    className?: string;
    size?: number;
}) {
    return (
        <span
            className={`material-symbols-outlined ${className}`}
            style={size ? { fontSize: size } : undefined}
        >
            {name}
        </span>
    );
}

/* ──────────────────────────────────────────────────────────
   Main Dashboard Component
   ────────────────────────────────────────────────────────── */
export default function PartyCentralPage() {
    const [time, setTime] = useState("");
    const [kpis, setKpis] = useState({
        constituencies: 0,
        voters: 0,
        activeCampaigns: 0,
        avgSentiment: 0,
    });
    const [loadingKpis, setLoadingKpis] = useState(true);
    const [statePerformance, setStatePerformance] = useState<{ state: string; val: number; color: string; shadow: string }[]>([]);
    const [loadingStates, setLoadingStates] = useState(true);
    const [liveFeeds, setLiveFeeds] = useState<any[]>([]);
    const [loadingFeeds, setLoadingFeeds] = useState(true);
    const [signOffs, setSignOffs] = useState<any[]>([]);
    const [loadingSignOffs, setLoadingSignOffs] = useState(true);

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString("en-IN", { hour12: false }));
        };
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        async function fetchKpis() {
            try {
                // Fetch Constituencies count
                const { count: constituenciesCount, error: cError } = await supabase
                    .from("constituencies")
                    .select("*", { count: "exact", head: true });

                // Fetch Voters count
                const { count: votersCount, error: vError } = await supabase
                    .from("voters")
                    .select("*", { count: "exact", head: true });

                // Fetch Active Campaigns count (status = 'active')
                const { count: activeCampaignsCount, error: aError } = await supabase
                    .from("campaigns")
                    .select("*", { count: "exact", head: true })
                    .eq("status", "active");

                // Fetch Avg Sentiment
                const { data: sentiments, error: sError } = await supabase
                    .from("sentiment_records")
                    .select("score");

                let avgSentiment = 0;
                if (sentiments && sentiments.length > 0) {
                    const totalScore = sentiments.reduce((acc: number, curr: any) => acc + (curr.score || 0), 0);
                    avgSentiment = Math.round(totalScore / sentiments.length);
                }

                if (cError) console.error("Error fetching constituencies:", cError);
                if (vError) console.error("Error fetching voters:", vError);
                if (aError) console.error("Error fetching active campaigns:", aError);
                if (sError) console.error("Error fetching sentiments:", sError);

                setKpis({
                    constituencies: constituenciesCount || 0,
                    voters: votersCount || 0,
                    activeCampaigns: activeCampaignsCount || 0,
                    avgSentiment: avgSentiment || 0,
                });
            } catch (err) {
                console.error("Failed to fetch KPIs:", err);
            } finally {
                setLoadingKpis(false);
            }
        }

        async function fetchStatePerformance() {
            try {
                const { data: constituenciesData, error: cError } = await supabase
                    .from("constituencies")
                    .select("id, name, state");

                const { data: grievancesData, error: gError } = await supabase
                    .from("grievances")
                    .select("id, status, constituency_id");

                if (cError || gError) {
                    console.error("Error fetching data for state performance:", cError || gError);
                    return;
                }

                if (constituenciesData && grievancesData) {
                    // Aggregate by state
                    const stateStats: Record<string, { total: number; resolved: number }> = {};

                    // Ensure all states from constituencies are represented
                    constituenciesData.forEach((c: any) => {
                        if (!stateStats[c.state]) {
                            stateStats[c.state] = { total: 0, resolved: 0 };
                        }
                    });

                    // Add grievance data
                    grievancesData.forEach((g: any) => {
                        const constituency = constituenciesData.find((c: any) => c.id === g.constituency_id);
                        if (constituency) {
                            const state = constituency.state;
                            if (stateStats[state]) {
                                stateStats[state].total++;
                                if (g.status === "resolved") {
                                    stateStats[state].resolved++;
                                }
                            }
                        }
                    });

                    // Convert to performance score array
                    const performanceArray = Object.entries(stateStats).map(([state, stats]) => {
                        let score = 90;
                        if (stats.total > 0) {
                            score = Math.round((stats.resolved / stats.total) * 100);
                        }

                        return {
                            state,
                            val: score,
                            color: score >= 70 ? "bg-green-700" : score >= 40 ? "bg-amber-600" : "bg-red-800",
                            shadow: score >= 70 ? "shadow-green-700/50" : score >= 40 ? "shadow-amber-600/50" : "shadow-red-800/50",
                        };
                    });

                    // Sort descending by score
                    performanceArray.sort((a, b) => b.val - a.val);
                    setStatePerformance(performanceArray);
                }
            } catch (err) {
                console.error("Failed to calculate state performance:", err);
            } finally {
                setLoadingStates(false);
            }
        }

        async function fetchLiveFeeds() {
            try {
                const { data, error } = await supabase
                    .from("campaigns")
                    .select("id, name, type, status, created_at, constituencies(name, state)")
                    .order("created_at", { ascending: false })
                    .limit(5);

                if (error) throw error;
                if (data) setLiveFeeds(data);
            } catch (err) {
                console.error("Failed to fetch live feeds:", err);
            } finally {
                setLoadingFeeds(false);
            }
        }

        async function fetchSignOffs() {
            try {
                const { data, error } = await supabase
                    .from("campaigns")
                    .select("id, name, type, created_at")
                    .eq("status", "planned")
                    .order("created_at", { ascending: false })
                    .limit(3);

                if (error) throw error;
                if (data) setSignOffs(data);
            } catch (err) {
                console.error("Failed to fetch sign-offs:", err);
            } finally {
                setLoadingSignOffs(false);
            }
        }

        fetchKpis();
        fetchStatePerformance();
        fetchLiveFeeds();
        fetchSignOffs();
    }, []);

    // Format numbers easily (e.g., 14.2L or just raw numbers if small)
    const formatNumber = (num: number) => {
        if (num >= 100000) return (num / 100000).toFixed(1) + "L";
        if (num >= 1000) return (num / 1000).toFixed(1) + "K";
        return num.toString();
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-dark text-cream font-sans selection:bg-primary selection:text-background-dark">
            {/* ─── SIDEBAR ─── */}
            <aside className="w-64 bg-[#0d0f1a] border-r border-primary/20 flex flex-col shrink-0 z-20">
                <div className="h-20 flex items-center px-6 border-b border-white/10 bg-background-dark">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-primary/10 border border-primary flex items-center justify-center text-primary">
                            <Icon name="account_balance" size={20} />
                        </div>
                        <div>
                            <h1 className="font-serif font-bold text-lg leading-tight tracking-wide text-primary">
                                PARTY
                                <br />
                                CENTRAL
                            </h1>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8 custom-scrollbar">
                    {/* Group 1 */}
                    <div>
                        <div className="px-4 mb-3 font-mono text-[10px] uppercase tracking-[2px] text-white/25">
                            Command Center
                        </div>
                        <ul className="space-y-1">
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center gap-3 px-4 py-2.5 rounded bg-primary/15 border-l-2 border-primary text-primary font-medium transition-colors"
                                >
                                    <Icon name="dashboard" size={18} />
                                    <span>National Dashboard</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center gap-3 px-4 py-2.5 rounded text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent transition-colors"
                                >
                                    <Icon name="map" size={18} />
                                    <span>State Operations</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center gap-3 px-4 py-2.5 rounded text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent transition-colors"
                                >
                                    <Icon name="campaign" size={18} />
                                    <span>Campaigns</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Group 2 */}
                    <div>
                        <div className="px-4 mb-3 font-mono text-[10px] uppercase tracking-[2px] text-white/25">
                            Intelligence
                        </div>
                        <ul className="space-y-1">
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center gap-3 px-4 py-2.5 rounded text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent transition-colors"
                                >
                                    <Icon name="query_stats" size={18} />
                                    <span>Voter Analytics</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center gap-3 px-4 py-2.5 rounded text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent transition-colors"
                                >
                                    <Icon name="psychology" size={18} />
                                    <span>Sentiment Analysis</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center gap-3 px-4 py-2.5 rounded text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent transition-colors"
                                >
                                    <Icon name="crisis_alert" size={18} />
                                    <span>Crisis Alerts</span>
                                    <span className="ml-auto w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Group 3 */}
                    <div>
                        <div className="px-4 mb-3 font-mono text-[10px] uppercase tracking-[2px] text-white/25">
                            Admin
                        </div>
                        <ul className="space-y-1">
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center gap-3 px-4 py-2.5 rounded text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent transition-colors"
                                >
                                    <Icon name="group" size={18} />
                                    <span>Staff Management</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center gap-3 px-4 py-2.5 rounded text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent transition-colors"
                                >
                                    <Icon name="settings" size={18} />
                                    <span>Configuration</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>

                <div className="p-4 border-t border-white/10 bg-background-dark">
                    <div className="flex items-center gap-3">
                        {/* Using a placeholder div for the image to avoid domain allowlist issues for now, or just an img tag if it works */}
                        <img
                            alt="User"
                            className="w-9 h-9 rounded-full border border-primary"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTb-czSwdDFB4VRw9WepL26j2t8rDbVg5VaCyWzKwvN1Q2oX_7ztzZKPHUp9j9of5sAnglYkm04OrrJbPk4MEyhnwdBASRyckRGix7LNTgAMR8QznSf0nqUrF31RQAQ6_KbdA1RbGJsvBfgfm0uVDgrgkP7zVS4WCm-yL3OppxN_ZTeD1d9nPdq3qxCLIaHt3OxYZYqp95ZueNLSfb5h1YHNqWLIbKP-NmqzcLxtiFEJRJUg-Fn1qSuX86TgiIQTplVYNIv0uMuw"
                        />
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-cream truncate">
                                National Admin
                            </div>
                            <div className="text-xs text-white/60 truncate">
                                hq_ops@party.org
                            </div>
                        </div>
                        <button className="text-white/25 hover:text-primary transition-colors">
                            <Icon name="logout" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* ─── MAIN CONTENT ─── */}
            <main className="flex-1 flex flex-col min-w-0 bg-background-dark relative">
                {/* Background Grid Pattern */}
                <div
                    className="absolute inset-0 z-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* Header */}
                <header className="h-20 border-b border-white/10 bg-background-dark/90 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-10 sticky top-0">
                    <h2 className="font-serif text-2xl font-bold tracking-tight text-cream">
                        National Dashboard
                    </h2>
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors">
                                <Icon name="search" />
                            </span>
                            <input
                                className="bg-[#111520] border border-white/10 rounded-md pl-10 pr-4 py-2 w-80 text-sm text-cream placeholder-white/20 focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono outline-none"
                                placeholder="Search across states, leaders, campaigns..."
                                type="text"
                            />
                        </div>
                        <div className="flex flex-col items-end border-r border-white/10 pr-6 mr-2">
                            <div className="text-lg font-mono font-medium text-primary tracking-wider">
                                {time} IST
                            </div>
                            <div className="text-[10px] text-white/60 uppercase tracking-widest">
                                New Delhi HQ
                            </div>
                        </div>
                        <button className="bg-saffron hover:bg-[#d6650a] text-white px-5 py-2.5 rounded font-mono font-medium text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg hover:-translate-y-px active:translate-y-0">
                            <Icon name="add" size={18} />
                            Create Campaign
                        </button>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-8 z-10 custom-scrollbar">
                    {/* Top Stats Grid */}
                    <div className="grid grid-cols-4 gap-6 mb-8">
                        {/* KPI 1 */}
                        <div className="bg-[#111520] border border-primary/20 rounded p-5 relative overflow-hidden group hover:bg-[#161b28] transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div className="font-mono text-[10px] uppercase tracking-widest text-white/60">
                                    Constituencies
                                </div>
                                <Icon name="location_on" className="text-primary opacity-50" />
                            </div>
                            <div className="font-serif text-4xl font-bold text-cream mb-4">
                                {loadingKpis ? "..." : formatNumber(kpis.constituencies)}
                            </div>
                            <div className="h-8 w-full">
                                <svg
                                    className="w-full h-full text-primary"
                                    preserveAspectRatio="none"
                                    viewBox="0 0 100 30"
                                >
                                    <path
                                        d="M0,25 L10,22 L20,26 L30,15 L40,18 L50,12 L60,14 L70,8 L80,10 L90,5 L100,8"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        vectorEffect="non-scaling-stroke"
                                    ></path>
                                    <circle cx="100" cy="8" fill="currentColor" r="3"></circle>
                                </svg>
                            </div>
                        </div>

                        {/* KPI 2 */}
                        <div className="bg-[#111520] border border-primary/20 rounded p-5 relative overflow-hidden group hover:bg-[#161b28] transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div className="font-mono text-[10px] uppercase tracking-widest text-white/60">
                                    Voters Database
                                </div>
                                <Icon name="groups" className="text-primary opacity-50" />
                            </div>
                            <div className="font-serif text-4xl font-bold text-cream mb-4">
                                {loadingKpis ? "..." : formatNumber(kpis.voters)}
                            </div>
                            <div className="h-8 w-full">
                                <svg
                                    className="w-full h-full text-primary"
                                    preserveAspectRatio="none"
                                    viewBox="0 0 100 30"
                                >
                                    <path
                                        d="M0,28 L15,25 L30,20 L45,22 L60,15 L75,10 L90,5 L100,2"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        vectorEffect="non-scaling-stroke"
                                    ></path>
                                    <circle cx="100" cy="2" fill="currentColor" r="3"></circle>
                                </svg>
                            </div>
                        </div>

                        {/* KPI 3 */}
                        <div className="bg-[#111520] border border-primary/20 rounded p-5 relative overflow-hidden group hover:bg-[#161b28] transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div className="font-mono text-[10px] uppercase tracking-widest text-white/60">
                                    Active Campaigns
                                </div>
                                <Icon name="campaign" className="text-primary opacity-50" />
                            </div>
                            <div className="font-serif text-4xl font-bold text-cream mb-4">
                                {loadingKpis ? "..." : formatNumber(kpis.activeCampaigns)}
                            </div>
                            <div className="h-8 w-full">
                                <svg
                                    className="w-full h-full text-primary"
                                    preserveAspectRatio="none"
                                    viewBox="0 0 100 30"
                                >
                                    <path
                                        d="M0,15 L10,18 L20,12 L30,15 L40,10 L50,20 L60,15 L70,22 L80,15 L90,18 L100,12"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        vectorEffect="non-scaling-stroke"
                                    ></path>
                                    <circle cx="100" cy="12" fill="currentColor" r="3"></circle>
                                </svg>
                            </div>
                        </div>

                        {/* KPI 4: Sentiment */}
                        <div className="bg-[#111520] border border-primary/20 rounded p-5 relative overflow-hidden group hover:bg-[#161b28] transition-colors flex items-center justify-between">
                            <div>
                                <div className="font-mono text-[10px] uppercase tracking-widest text-white/60 mb-1">
                                    Natl. Sentiment
                                </div>
                                <div className="font-serif text-4xl font-bold text-cream">
                                    {loadingKpis ? "..." : kpis.avgSentiment}
                                    <span className="text-lg text-white/60 font-sans font-light">
                                        /100
                                    </span>
                                </div>
                                <div className="text-[10px] text-green-600 mt-1 flex items-center gap-1 font-mono">
                                    <Icon name="trending_up" size={12} />
                                    Live Average
                                </div>
                            </div>
                            <div className="relative w-20 h-20 flex items-center justify-center">
                                <svg
                                    className="w-full h-full -rotate-90"
                                    viewBox="0 0 36 36"
                                >
                                    <path
                                        className="text-[#161b28]"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeDasharray="100, 100"
                                        strokeWidth="3"
                                    ></path>
                                    <path
                                        className="text-primary drop-shadow-[0_0_8px_rgba(201,168,76,0.6)] transition-all duration-1000"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeDasharray={`${loadingKpis ? 0 : kpis.avgSentiment}, 100`}
                                        strokeWidth="3"
                                    ></path>
                                </svg>
                                <div className="absolute text-primary flex items-center justify-center">
                                    <Icon name="sentiment_satisfied" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid 1: State Performance & Live Feed */}
                    <div className="grid grid-cols-12 gap-6 mb-8 h-[500px]">
                        {/* State Performance */}
                        <div className="col-span-3 bg-[#111520] border border-white/10 rounded flex flex-col h-full overflow-hidden">
                            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#161b28]">
                                <h3 className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                                    State Performance
                                </h3>
                                <button className="text-white/60 hover:text-primary">
                                    <Icon name="more_horiz" size={18} />
                                </button>
                            </div>
                            <div className="overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                {loadingStates ? (
                                    <div className="text-white/40 text-xs flex justify-center py-4">Loading states...</div>
                                ) : statePerformance.length > 0 ? (
                                    statePerformance.map((item) => (
                                        <div key={item.state}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-cream font-serif font-bold tracking-wide">
                                                    {item.state}
                                                </span>
                                                <span className={`font-mono ${item.val >= 70 ? "text-green-600" : item.val >= 40 ? "text-amber-600" : "text-red-700"}`}>
                                                    {item.val}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-background-dark rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${item.color} rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                                                    style={{ width: `${item.val}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-white/40 text-[10px] text-center italic mt-10">No state data available</div>
                                )}
                            </div>
                        </div>

                        {/* Live Feed */}
                        <div className="col-span-5 bg-[#111520] border border-white/10 rounded flex flex-col h-full overflow-hidden relative">
                            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#161b28]">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                                    </span>
                                    <h3 className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                                        Live Feed
                                    </h3>
                                </div>
                                <div className="flex gap-2">
                                    <button className="text-white/60 text-[10px] uppercase font-mono border border-white/10 px-2 py-1 rounded hover:bg-background-dark">
                                        Pause
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-y-auto p-0 flex-1 custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-background-dark sticky top-0 z-10 text-white/25 font-mono text-[10px] uppercase tracking-wider">
                                        <tr>
                                            <th className="p-3 font-medium">Time</th>
                                            <th className="p-3 font-medium">Campaign</th>
                                            <th className="p-3 font-medium">Region</th>
                                            <th className="p-3 font-medium text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-xs divide-y divide-white/10">
                                        {loadingFeeds ? (
                                            <tr><td colSpan={4} className="p-4 text-center text-white/40">Loading feed...</td></tr>
                                        ) : liveFeeds.length > 0 ? (
                                            liveFeeds.map((feed) => {
                                                const createDate = new Date(feed.created_at);
                                                const timeStr = createDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
                                                // @ts-ignore
                                                const regionStr = feed.constituencies ? `${feed.constituencies.name}, ${feed.constituencies.state}` : "National";

                                                let statusColor = "bg-green-900/20 text-green-600 border-green-600/30";
                                                if (feed.status === "planned") statusColor = "bg-amber-900/20 text-amber-600 border-amber-600/30";
                                                if (feed.status === "completed") statusColor = "bg-primary/20 text-primary border-primary/30";

                                                return (
                                                    <tr key={feed.id} className="hover:bg-[#161b28] transition-colors cursor-pointer group">
                                                        <td className="p-3 font-mono text-white/60">{timeStr}</td>
                                                        <td className="p-3">
                                                            <div className="font-medium text-cream truncate max-w-[150px]">
                                                                {feed.name}
                                                            </div>
                                                            <div className="text-white/60 text-[10px] uppercase">
                                                                {feed.type?.replace("_", " ")}
                                                            </div>
                                                        </td>
                                                        <td className="p-3 text-white/60 truncate max-w-[120px]">{regionStr}</td>
                                                        <td className="p-3 text-right">
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border uppercase ${statusColor}`}>
                                                                {feed.status === "active" ? "LIVE" : feed.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr><td colSpan={4} className="p-4 text-center text-white/40">No campaigns found</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Right Column: Queue & Alerts */}
                        <div className="col-span-4 flex flex-col gap-6 h-full">
                            {/* Sign-off Queue */}
                            <div className="flex-1 bg-[#111520] border border-white/10 rounded flex flex-col overflow-hidden">
                                <div className="p-4 border-b border-white/10 bg-[#161b28] flex justify-between items-center">
                                    <h3 className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                                        Sign-off Queue
                                    </h3>
                                    <span className="bg-primary text-background-dark text-[10px] font-bold px-1.5 rounded">
                                        {loadingSignOffs ? "..." : signOffs.length}
                                    </span>
                                </div>
                                <div className="p-4 overflow-y-auto space-y-3 custom-scrollbar">
                                    {loadingSignOffs ? (
                                        <div className="text-white/40 text-xs text-center py-4">Loading queue...</div>
                                    ) : signOffs.length > 0 ? (
                                        signOffs.map((item) => {
                                            // Make relative time approximation
                                            const sec = Math.floor((new Date().getTime() - new Date(item.created_at).getTime()) / 1000);
                                            let timeStr = "just now";
                                            if (sec > 60) timeStr = `${Math.floor(sec / 60)}m ago`;
                                            if (sec > 3600) timeStr = `${Math.floor(sec / 3600)}h ago`;
                                            if (sec > 86400) timeStr = `${Math.floor(sec / 86400)}d ago`;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="bg-background-dark border border-white/10 p-3 rounded hover:border-primary transition-colors group"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-saffron font-serif font-bold text-sm truncate pr-2">
                                                            {item.name}
                                                        </span>
                                                        <span className="text-[10px] text-white/60 font-mono whitespace-nowrap">
                                                            {timeStr}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-white/60 mb-3 uppercase tracking-wider">
                                                        {item.type?.replace("_", " ")}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button className="flex-1 bg-primary/10 text-primary border border-primary/20 text-[10px] uppercase font-mono py-1.5 rounded hover:bg-primary hover:text-background-dark transition-colors">
                                                            Approve
                                                        </button>
                                                        <button className="px-3 border border-white/10 text-white/60 rounded hover:text-white hover:border-white/60">
                                                            <Icon name="visibility" size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-white/40 text-xs text-center italic py-4">All caught up</div>
                                    )}
                                </div>
                            </div>

                            {/* Priority Alerts */}
                            <div className="h-48 bg-[#111520] border border-white/10 rounded flex flex-col overflow-hidden">
                                <div className="p-3 border-b border-white/10 bg-[#161b28] flex justify-between items-center">
                                    <h3 className="font-mono text-xs uppercase tracking-widest text-red-600 font-bold flex items-center gap-2">
                                        <Icon name="warning" size={16} /> Priority Alerts
                                    </h3>
                                </div>
                                <div className="p-3 overflow-y-auto space-y-2 custom-scrollbar">
                                    <div className="flex gap-3 items-start p-2 rounded bg-red-600/10 border border-red-600/20">
                                        <Icon name="error" className="text-red-600 mt-0.5" size={18} />
                                        <div>
                                            <div className="text-xs font-bold text-cream">
                                                Opp. Viral Misinfo Detected
                                            </div>
                                            <div className="text-[10px] text-white/60 mt-0.5">
                                                High velocity spread in West Bengal region.
                                                Counter-narrative required immediately.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-start p-2 rounded bg-amber-600/10 border border-amber-600/20">
                                        <Icon name="schedule" className="text-amber-600 mt-0.5" size={18} />
                                        <div>
                                            <div className="text-xs font-bold text-cream">
                                                Server Load Warning
                                            </div>
                                            <div className="text-[10px] text-white/60 mt-0.5">
                                                Database latency at 85%. Scaling recommended before PM
                                                speech.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Grid: Trend & Matrix */}
                    <div className="grid grid-cols-3 gap-6 h-[300px]">
                        {/* National Sentiment Trend */}
                        <div className="col-span-2 bg-[#111520] border border-primary/20 rounded p-5 relative">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                                    30-Day National Sentiment Trend
                                </h3>
                                <div className="flex gap-2">
                                    <span className="flex items-center gap-1 text-[10px] font-mono text-white/60">
                                        <div className="w-2 h-2 rounded-full bg-primary"></div>{" "}
                                        POSITIVE
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] font-mono text-white/60">
                                        <div className="w-2 h-2 rounded-full bg-red-600"></div>{" "}
                                        NEGATIVE
                                    </span>
                                </div>
                            </div>
                            <div className="absolute inset-x-5 bottom-5 top-16 bg-gradient-to-b from-primary/10 to-transparent border-b border-l border-white/10">
                                <svg className="w-full h-full" preserveAspectRatio="none">
                                    <line stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" x1="0" x2="100%" y1="25%" y2="25%" vectorEffect="non-scaling-stroke"></line>
                                    <line stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" x1="0" x2="100%" y1="50%" y2="50%" vectorEffect="non-scaling-stroke"></line>
                                    <line stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" x1="0" x2="100%" y1="75%" y2="75%" vectorEffect="non-scaling-stroke"></line>
                                    <path
                                        d="M0,150 L0,80 Q50,90 100,60 T200,80 T300,50 T400,70 T500,40 T600,60 T700,30 T800,50 L800,150 Z"
                                        fill="rgba(201, 168, 76, 0.1)"
                                        stroke="none"
                                        vectorEffect="non-scaling-stroke"
                                    ></path>
                                    <path
                                        d="M0,80 Q50,90 100,60 T200,80 T300,50 T400,70 T500,40 T600,60 T700,30 T800,50"
                                        fill="none"
                                        stroke="#c9a74a"
                                        strokeWidth="2"
                                        vectorEffect="non-scaling-stroke"
                                    ></path>
                                    <path
                                        d="M0,120 Q50,130 100,110 T200,125 T300,115 T400,130 T500,110 T600,115 T700,130 T800,120"
                                        fill="none"
                                        opacity="0.6"
                                        stroke="#dc2626"
                                        strokeDasharray="4 2"
                                        strokeWidth="1.5"
                                        vectorEffect="non-scaling-stroke"
                                    ></path>
                                </svg>
                            </div>
                            <div className="absolute bottom-1 left-5 right-5 flex justify-between text-[9px] font-mono text-white/60 uppercase">
                                <span>Day 1</span>
                                <span>Day 7</span>
                                <span>Day 14</span>
                                <span>Day 21</span>
                                <span>Day 30</span>
                            </div>
                        </div>

                        {/* Radar Chart / Issues Matrix */}
                        <div
                            className="col-span-1 bg-[#111520] border border-white/10 rounded p-5 relative flex flex-col items-center justify-center"
                            style={{
                                backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
                                backgroundSize: "20px 20px"
                            }}
                        >
                            <h3 className="absolute top-4 left-4 font-mono text-xs uppercase tracking-widest text-primary font-bold">
                                Top Issues Matrix
                            </h3>
                            <div className="relative w-48 h-48 mt-4">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <line stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" x1="50" x2="50" y1="50" y2="5"></line>
                                    <line stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" x1="50" x2="90" y1="50" y2="28"></line>
                                    <line stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" x1="50" x2="90" y1="50" y2="72"></line>
                                    <line stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" x1="50" x2="50" y1="50" y2="95"></line>
                                    <line stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" x1="50" x2="10" y1="50" y2="72"></line>
                                    <line stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" x1="50" x2="10" y1="50" y2="28"></line>
                                    <polygon
                                        fill="none"
                                        points="50,15 80,32 80,68 50,85 20,68 20,32"
                                        stroke="rgba(255,255,255,0.1)"
                                        strokeWidth="0.5"
                                    ></polygon>
                                    <polygon
                                        fill="none"
                                        points="50,25 70,36 70,64 50,75 30,64 30,36"
                                        stroke="rgba(255,255,255,0.1)"
                                        strokeWidth="0.5"
                                    ></polygon>
                                    <polygon
                                        fill="rgba(201, 168, 76, 0.2)"
                                        points="50,10 85,32 60,68 50,75 35,68 15,32"
                                        stroke="#c9a74a"
                                        strokeWidth="1.5"
                                    ></polygon>
                                    <circle cx="50" cy="10" fill="#c9a74a" r="1.5"></circle>
                                    <circle cx="85" cy="32" fill="#c9a74a" r="1.5"></circle>
                                    <circle cx="60" cy="68" fill="#c9a74a" r="1.5"></circle>
                                    <circle cx="50" cy="75" fill="#c9a74a" r="1.5"></circle>
                                    <circle cx="35" cy="68" fill="#c9a74a" r="1.5"></circle>
                                    <circle cx="15" cy="32" fill="#c9a74a" r="1.5"></circle>
                                </svg>
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-cream bg-[#111520] px-1">
                                    Jobs
                                </span>
                                <span className="absolute top-[25%] -right-8 text-[9px] font-mono text-cream bg-[#111520] px-1">
                                    Economy
                                </span>
                                <span className="absolute bottom-[20%] -right-6 text-[9px] font-mono text-cream bg-[#111520] px-1">
                                    Infra
                                </span>
                                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-cream bg-[#111520] px-1">
                                    Welfare
                                </span>
                                <span className="absolute bottom-[20%] -left-8 text-[9px] font-mono text-cream bg-[#111520] px-1">
                                    Healthcare
                                </span>
                                <span className="absolute top-[25%] -left-8 text-[9px] font-mono text-cream bg-[#111520] px-1">
                                    Agri
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-[10px] text-white/25 font-mono uppercase tracking-widest">
                        Confidential • Internal Use Only • Party Central Command v2.4
                    </div>
                </div>
            </main>
        </div>
    );
}
