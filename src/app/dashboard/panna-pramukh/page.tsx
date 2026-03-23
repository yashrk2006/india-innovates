"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";
import LogContactModal from "@/components/panna-pramukh/LogContactModal";
import IssueModal from "@/components/panna-pramukh/IssueModal";
import ShareSchemeModal from "@/components/panna-pramukh/ShareSchemeModal";

import { motion, AnimatePresence } from "framer-motion";

/* ── Icon helper ── */
function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;
}

/* ── KPI Card ── */
function KPI({ icon, label, value, sub, color = "#1e293b", delay = 0 }: { icon: string; label: string; value: string; sub?: string; color?: string; delay?: number }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="group relative bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-all">
                <Icon name={icon} size={80} style={{ color }} />
            </div>
            
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">{label}</p>
                    <div className="size-10 rounded-2xl flex items-center justify-center bg-slate-50 text-slate-900 border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                        <Icon name={icon} size={20} />
                    </div>
                </div>
                
                <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">{value}</h3>
                {sub && (
                    <div className="flex items-center gap-2">
                        <div className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
                        <p className="text-[11px] font-bold uppercase tracking-wide opacity-60" style={{ color }}>{sub}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

/* ── Progress Bar ── */
function Bar({ pct, color = "#1e293b", h = 6 }: { pct: number; color?: string; h?: number }) {
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

/* ══════════════════════════════════════════════════════════
   PANNA PRAMUKH – Field Worker Dashboard
   ══════════════════════════════════════════════════════════ */
export default function PannaPramukhDashboard() {
    const router = useRouter();
    const [voterList, setVoterList] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Modal States
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [selectedVoter, setSelectedVoter] = useState<any>(null);

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        const supabase = createClient();

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/auth/login?role=panna-pramukh");
                return;
            }

            const { data: profileData } = await supabase
                .from("profiles")
                .select("*, booths(name, booth_number)")
                .eq("id", user.id)
                .single();
            
            setProfile(profileData);

            if (profileData?.jurisdiction_id && profileData?.jurisdiction_type === 'booth') {
                const { data: votersData, error } = await supabase
                    .from("voters")
                    .select(`
                        id,
                        voter_sentiment,
                        last_contacted_at,
                        voters_eci (
                            id,
                            epic_number,
                            name,
                            gender,
                            serial_number,
                            phone,
                            booth_id
                        )
                    `)
                    .eq("voters_eci.booth_id", profileData.jurisdiction_id)
                    .order('voters_eci(serial_number)');

                if (error) throw error;
                setVoterList(votersData?.filter(v => v.voters_eci) || []);
            }
        } catch (error: any) {
            console.error("Error fetching panna data:", error);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const contacted = voterList.filter(v => v.voter_sentiment !== 'uncontacted').length;
    const total = voterList.length;
    const supportive = voterList.filter(v => v.voter_sentiment === 'supportive').length;

    const filteredVoters = voterList.filter(v => 
        v.voters_eci?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.voters_eci?.epic_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-screen bg-white items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-[#1e293b] rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Establishing Intel Link...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="px-3 py-1 rounded-full bg-[#1e293b]/5 border border-[#1e293b]/10 text-[#1e293b] text-[9px] font-black uppercase tracking-widest">
                            Field Tactical Hub
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Live Operations</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Voter Activation <span className="text-slate-400">Command</span></h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Booth #{profile?.booths?.booth_number || "---"} · {profile?.booths?.name || "LUCKNOW FIELD OPERATIONS"}</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1e293b] transition-colors" size={18} />
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="FIND VOTER OR EPIC ID..." 
                            className="w-72 pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-[#1e293b]/5 focus:border-[#1e293b]/40 transition-all text-[10px] font-black tracking-wider uppercase"
                        />
                    </div>
                    <button onClick={fetchDashboardData} className="size-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#1e293b] hover:border-[#1e293b]/30 hover:shadow-lg transition-all active:scale-95 shadow-sm">
                        <Icon name="refresh" size={20} />
                    </button>
                </div>
            </header>

            <div className="p-8 pb-20 space-y-10">
                {/* ── KPI Row ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPI icon="groups" label="Portfolio Size" value={total.toString()} sub="Assigned Citizens" color="#3b82f6" delay={0.1} />
                    <KPI icon="verified_user" label="Activation" value={`${contacted}`} sub={`${total > 0 ? Math.round((contacted / total) * 100) : 0}% Realization`} color="#10b981" delay={0.2} />
                    <KPI icon="heart_check" label="Core Support" value={supportive.toString()} sub="Verified Favorable" color="#f43f5e" delay={0.3} />
                    <KPI icon="warning" label="Alerts" value="06" sub="Critical Issues" color="#f59e0b" delay={0.4} />
                </div>

                {/* ── Main Operations Grid ── */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="xl:col-span-8 bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden flex flex-col"
                    >
                        <div className="p-10 pb-6 flex items-center justify-between border-b border-slate-50 bg-slate-50/30">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Citizen Manifest</h3>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Interactive Deployment Grid</p>
                            </div>
                            <div className="px-5 py-2.5 bg-white border border-slate-200 rounded-full flex items-center gap-3 shadow-sm">
                                <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.1em]">{contacted} / {total} TOTAL CONTACTS</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-400 font-mono text-[9px] tracking-widest uppercase border-b border-slate-50">
                                        <th className="p-6 px-10"># Serial</th>
                                        <th className="p-6">Voter Identity</th>
                                        <th className="p-6 text-center">Sentiment</th>
                                        <th className="p-6">ID Token</th>
                                        <th className="p-6 text-right px-10">Protocols</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredVoters.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-32 text-center bg-slate-50/20">
                                                <div className="flex flex-col items-center">
                                                    <div className="size-20 rounded-[2rem] bg-slate-100 flex items-center justify-center text-slate-300 mb-6">
                                                        <Icon name="search_off" size={40} />
                                                    </div>
                                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Zero Detections</h3>
                                                    <p className="text-[10px] text-slate-300 font-mono mt-2">Query found no matching units in current manifest</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredVoters.map((v, i) => (
                                            <motion.tr 
                                                key={v.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.03 }}
                                                className="group hover:bg-slate-50/80 transition-all duration-300"
                                            >
                                                <td className="p-6 px-10">
                                                    <span className="text-[12px] font-black font-mono text-slate-300 group-hover:text-[#1e293b] transition-colors">{v.voters_eci?.serial_number?.toString().padStart(3, '0')}</span>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="size-11 rounded-[1rem] bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#1e293b] group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-inner">
                                                            <Icon name="account_circle" size={24} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[13px] font-black text-slate-900 leading-tight mb-1 group-hover:translate-x-1 transition-transform">{v.voters_eci?.name}</p>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">{v.voters_eci?.gender} · 45Y</span>
                                                                <div className="size-1 rounded-full bg-slate-200" />
                                                                <span className="text-[9px] font-bold text-slate-300 uppercase italic">Ward 12</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <motion.div 
                                                            animate={{ 
                                                                scale: v.voter_sentiment !== 'uncontacted' ? [1, 1.25, 1] : 1,
                                                                opacity: v.voter_sentiment !== 'uncontacted' ? [0.7, 1, 0.7] : 0.2
                                                            }}
                                                            transition={{ repeat: Infinity, duration: 2.5 }}
                                                            className={`size-3 rounded-full shadow-[0_0_15px] shadow-current ${
                                                                v.voter_sentiment === 'supportive' ? "bg-emerald-500 text-emerald-400" :
                                                                v.voter_sentiment === 'neutral' ? "bg-blue-500 text-blue-400" :
                                                                v.voter_sentiment === 'opposed' ? "bg-rose-500 text-rose-400" :
                                                                "bg-slate-300 text-transparent"
                                                            }`} 
                                                        />
                                                        <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400 border-b border-slate-100">
                                                            {v.voter_sentiment}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-mono font-black text-slate-500 group-hover:bg-[#1e293b] group-hover:text-slate-200 transition-all">
                                                        {v.voters_eci?.epic_number}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-right px-10">
                                                    <div className="flex items-center justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedVoter({ id: v.id, name: v.voters_eci?.name, epic_number: v.voters_eci?.epic_number });
                                                                setIsLogModalOpen(true);
                                                            }}
                                                            className="size-10 rounded-[1rem] bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-500/10 transition-all active:scale-95"
                                                            title="Log Engagement"
                                                        >
                                                            <Icon name="chat_bubble" size={20} />
                                                        </button>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedVoter({ id: v.id, name: v.voters_eci?.name, booth_id: v.voters_eci?.booth_id });
                                                                setIsIssueModalOpen(true);
                                                            }}
                                                            className="size-10 rounded-[1rem] bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:shadow-xl hover:shadow-rose-500/10 transition-all active:scale-95"
                                                            title="Report Anomaly"
                                                        >
                                                            <Icon name="priority_high" size={20} />
                                                        </button>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedVoter({ id: v.id, name: v.voters_eci?.name });
                                                                setIsShareModalOpen(true);
                                                            }}
                                                            className="size-10 rounded-[1rem] bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all active:scale-95"
                                                            title="Dispatch Strategy"
                                                        >
                                                            <Icon name="rocket_launch" size={20} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Operational Sidebar */}
                    <div className="xl:col-span-4 space-y-10">
                        {/* Deployment Status */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-xl shadow-slate-200/20"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tighter">Activation Pulse</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time Coverage</p>
                                </div>
                                <div className="size-12 rounded-[1.2rem] bg-[#1e293b] text-white flex items-center justify-center shadow-lg shadow-[#1e293b]/20">
                                    <Icon name="analytics" size={24} />
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center py-6 mb-10 relative">
                                <svg viewBox="0 0 100 100" className="size-56 -rotate-90">
                                    <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-100" />
                                    <motion.circle 
                                        cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="10" 
                                        strokeDasharray="276"
                                        initial={{ strokeDashoffset: 276 }}
                                        animate={{ strokeDashoffset: 276 - (276 * (total > 0 ? contacted / total : 0)) }}
                                        transition={{ duration: 2, ease: "circOut" }}
                                        strokeLinecap="round"
                                        className="text-[#10b981]" 
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <h4 className="text-5xl font-black text-slate-900 tracking-tighter">
                                        {total > 0 ? Math.round((contacted / total) * 100) : 0}%
                                    </h4>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Field Realized</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="size-3 rounded-full bg-[#10b981]" />
                                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider">Contacted Units</span>
                                    </div>
                                    <span className="text-lg font-black text-slate-900 font-mono">{contacted}</span>
                                </div>
                                <div className="p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="size-3 rounded-full bg-slate-200" />
                                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider">Target Units</span>
                                    </div>
                                    <span className="text-lg font-black text-slate-900 font-mono">{total}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Tactical Action Grid */}
                        <div className="grid grid-cols-2 gap-6">
                            <motion.button 
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className="group flex flex-col items-center gap-4 p-8 bg-white border border-slate-200 rounded-[2.5rem] hover:border-[#1e293b] hover:shadow-2xl hover:shadow-slate-200 shadow-sm transition-all"
                            >
                                <div className="size-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#1e293b] group-hover:text-white transition-all shadow-inner">
                                    <Icon name="explore" size={28} />
                                </div>
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Strategy</span>
                            </motion.button>
                            <motion.button 
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className="group flex flex-col items-center gap-4 p-8 bg-white border border-slate-200 rounded-[2.5rem] hover:border-[#1e293b] hover:shadow-2xl hover:shadow-slate-200 shadow-sm transition-all"
                            >
                                <div className="size-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#1e293b] group-hover:text-white transition-all shadow-inner">
                                    <Icon name="map" size={28} />
                                </div>
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Sectors</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {/* Modals are already functional, just ensuring they render correctly */}
                {isLogModalOpen && (
                    <LogContactModal 
                        isOpen={isLogModalOpen} 
                        onClose={() => setIsLogModalOpen(false)} 
                        voter={selectedVoter} 
                        onSuccess={fetchDashboardData}
                    />
                )}
                {isIssueModalOpen && (
                    <IssueModal 
                        isOpen={isIssueModalOpen} 
                        onClose={() => setIsIssueModalOpen(false)} 
                        voter={selectedVoter} 
                        onSuccess={fetchDashboardData}
                    />
                )}
                {isShareModalOpen && (
                    <ShareSchemeModal 
                        isOpen={isShareModalOpen} 
                        onClose={() => setIsShareModalOpen(false)} 
                        voter={selectedVoter} 
                        onSuccess={fetchDashboardData}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
