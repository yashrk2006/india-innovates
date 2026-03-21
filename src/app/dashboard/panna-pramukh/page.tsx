"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";
import LogContactModal from "@/components/panna-pramukh/LogContactModal";
import IssueModal from "@/components/panna-pramukh/IssueModal";
import ShareSchemeModal from "@/components/panna-pramukh/ShareSchemeModal";

/* ── Icon helper ── */
function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;
}

/* ── KPI Card ── */
function KPI({ icon, label, value, sub, color = "var(--gold)" }: { icon: string; label: string; value: string; sub?: string; color?: string }) {
    return (
        <div className="bg-white shadow-sm border border-slate-200 rounded p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-mono text-[9px] tracking-[2.5px] uppercase text-slate-700/25 mb-2">{label}</p>
                    <p className="font-serif text-[28px] font-bold text-slate-700 leading-none">{value}</p>
                    {sub && <p className="font-mono text-[9px] mt-1.5" style={{ color }}>{sub}</p>}
                </div>
                <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: color + "18", border: `1px solid ${color}30` }}>
                    <Icon name={icon} size={14} className="text-[#1e293b]" />
                </div>
            </div>
        </div>
    );
}

/* ── Progress Bar ── */
function Bar({ pct, color = "var(--gold)", h = 4 }: { pct: number; color?: string; h?: number }) {
    return (
        <div className="bg-[rgba(30,41,59,0.1)] rounded-sm overflow-hidden" style={{ height: h }}>
            <div className="rounded-sm transition-all duration-1000 ease-out" style={{ width: `${pct}%`, background: color, height: h }} />
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

            // Fetch Profile
            const { data: profileData } = await supabase
                .from("profiles")
                .select("*, booths(name, booth_number)")
                .eq("id", user.id)
                .single();
            
            setProfile(profileData);

            // Fetch Voters for the booth
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
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);



    const sentimentColor: Record<string, string> = { 
        supportive: "#10b981", 
        neutral: "#1e293b", 
        opposed: "#ef4444", 
        uncontacted: "#6b7280" 
    };

    const contacted = voterList.filter(v => v.voter_sentiment !== 'uncontacted').length;
    const total = voterList.length;
    const supportive = voterList.filter(v => v.voter_sentiment === 'supportive').length;

    if (loading) {
        return (
            <div className="flex h-screen bg-stone-50 items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#1e293b]/20 border-t-[#1e293b] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <>
                <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-sm border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-slate-900 text-lg font-serif font-bold">My Voter Pages</h2>
                        <span className="font-mono text-[9px] text-[#10b981] tracking-[1.5px] uppercase bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/20">
                            Booth {profile?.booths?.booth_number} · {contacted}/{total} contacted
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-slate-200">
                            <Icon name="search" size={14} className="text-slate-700/40" />
                            <input 
                                type="text" 
                                placeholder="Search by name or EPIC..." 
                                className="bg-transparent border-none outline-none text-[11px] w-48 font-mono placeholder:text-slate-700/20"
                            />
                        </div>
                    </div>
                </header>

                <div className="p-6 space-y-6">
                    {/* ── KPI Row ── */}
                    <div className="grid grid-cols-4 gap-4">
                        <KPI icon="people" label="Assigned Voters" value={total.toString()} sub={`Booth ${profile?.booths?.booth_number}`} />
                        <KPI icon="call" label="Contacted" value={contacted.toString()} sub={`${total > 0 ? Math.round((contacted / total) * 100) : 0}% complete`} color="#10b981" />
                        <KPI icon="thumb_up" label="Favourable" value={supportive.toString()} sub="Verified Support" color="#1e293b" />
                        <KPI icon="warning" label="Issues Logged" value="0" sub="Needs Attention" color="#ef4444" />
                    </div>

                    {/* ── Main Grid ── */}
                    <div className="grid grid-cols-[1.5fr_1fr] gap-6">
                        {/* Voter List Table */}
                        <div className="bg-white shadow-sm border border-slate-200 rounded overflow-hidden shadow-lg">
                            <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-200">
                                <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#1e293b] flex items-center gap-2">
                                    <Icon name="list_alt" size={12} /> Voter Contact List
                                </h3>
                                <span className="font-mono text-[9px] text-slate-700/25">{contacted}/{total} done</span>
                            </div>
                            <div className="grid grid-cols-[50px_1fr_60px_40px_120px_100px_120px] gap-2 px-4 py-2.5 bg-black/20 border-b border-slate-200 font-mono text-[9px] tracking-[1px] uppercase text-slate-700/25">
                                <span>SR#</span>
                                <span>Name</span>
                                <span>Age/Gen</span>
                                <span className="text-center">St</span>
                                <span>EPIC No.</span>
                                <span>Sentiment</span>
                                <span>Actions</span>
                            </div>
                            <div className="divide-y divide-[rgba(30,41,59,0.1)] overflow-y-auto max-h-[600px]">
                                {voterList.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <Icon name="person_off" size={32} className="text-slate-700/10 mb-2" />
                                        <p className="text-slate-700/20 font-mono text-xs italic">
                                            No voters assigned to this booth yet.
                                        </p>
                                    </div>
                                ) : (
                                    voterList.map((v) => (
                                        <div key={v.id} className={`grid grid-cols-[50px_1fr_60px_40px_120px_100px_120px] gap-2 px-4 py-3 hover:bg-[#334155]/[0.03] transition-colors items-center ${v.voter_sentiment !== 'uncontacted' ? "bg-white/[0.01]" : ""}`}>
                                            <span className="font-mono text-[10px] text-[#1e293b]">{v.voters_eci?.serial_number}</span>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] text-slate-500 font-medium truncate">{v.voters_eci?.name}</span>
                                                <span className="text-[8px] font-mono text-slate-700/30 truncate">{v.voters_eci?.phone || "No Phone"}</span>
                                            </div>
                                            <span className="font-mono text-[10px] text-slate-700/40">45 / {v.voters_eci?.gender}</span>
                                            <div className="flex items-center justify-center">
                                                <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] shadow-current ${v.voter_sentiment !== 'uncontacted' ? "bg-[#10b981]" : "bg-[#334155]/10 text-transparent"}`} />
                                            </div>
                                            <span className="font-mono text-[10px] text-slate-700/30 tracking-wider truncate">{v.voters_eci?.epic_number}</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-mono text-[8px] uppercase tracking-wider font-bold" style={{ color: sentimentColor[v.voter_sentiment] }}>
                                                    {v.voter_sentiment}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedVoter({
                                                            id: v.id,
                                                            name: v.voters_eci?.name,
                                                            epic_number: v.voters_eci?.epic_number
                                                        });
                                                        setIsLogModalOpen(true);
                                                    }}
                                                    className="w-8 h-8 rounded bg-white shadow-sm border border-white/5 hover:border-[#1e293b]/50 hover:bg-[#1e293b]/10 text-[#1e293b] flex items-center justify-center transition-all group"
                                                    title="Log Contact"
                                                >
                                                    <Icon name="phone_callback" size={16} className="group-hover:scale-110 transition-transform" />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedVoter({
                                                            id: v.id,
                                                            name: v.voters_eci?.name,
                                                            booth_id: v.voters_eci?.booth_id
                                                        });
                                                        setIsIssueModalOpen(true);
                                                    }}
                                                    className="w-8 h-8 rounded bg-white shadow-sm border border-white/5 hover:border-red-400/50 hover:bg-red-400/10 text-red-400 flex items-center justify-center transition-all group"
                                                    title="Record Issue"
                                                >
                                                    <Icon name="report_problem" size={16} className="group-hover:scale-110 transition-transform" />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedVoter({
                                                            id: v.id,
                                                            name: v.voters_eci?.name
                                                        });
                                                        setIsShareModalOpen(true);
                                                    }}
                                                    className="w-8 h-8 rounded bg-white shadow-sm border border-white/5 hover:border-[#10b981]/50 hover:bg-[#10b981]/10 text-[#10b981] flex items-center justify-center transition-all group"
                                                    title="Share Scheme"
                                                >
                                                    <Icon name="verified_user" size={16} className="group-hover:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent Activity Sidebar */}
                        <div className="space-y-6">
                            {/* Contact Progress */}
                            <div className="bg-white shadow-sm border border-slate-200 rounded overflow-hidden shadow-lg">
                                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                                    <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#10b981] flex items-center gap-2">
                                        <Icon name="pie_chart" size={12} /> Contact Progress
                                    </h3>
                                    <span className="font-mono text-[9px] text-[#10b981]">{contacted}/{total}</span>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-6 mb-4">
                                        <div className="relative w-24 h-24">
                                            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                                <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(30,41,59,0.1)" strokeWidth="3" />
                                                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#10b981" strokeWidth="3"
                                                    strokeDasharray={`${total > 0 ? (contacted / total) * 97.4 : 0} 97.4`} strokeLinecap="round" />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="font-mono text-lg font-bold text-slate-900">
                                                    {total > 0 ? Math.round((contacted / total) * 100) : 0}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-slate-700/40 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#10b981]" /> Contacted</span>
                                                <span className="font-mono text-[12px] text-[#10b981] font-bold">{contacted}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-slate-700/40 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-white/10" /> Pending</span>
                                                <span className="font-mono text-[12px] text-slate-700/50">{total - contacted}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Bar pct={total > 0 ? (contacted / total) * 100 : 0} color="#10b981" h={6} />
                                </div>
                            </div>

                            {/* Resource Shortcuts */}
                            <div className="bg-white shadow-sm border border-slate-200 rounded p-4">
                                <h3 className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#1e293b] mb-4">Quick Resources</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="flex flex-col items-center gap-2 p-3 bg-black/20 border border-white/5 rounded hover:border-[#1e293b]/30 hover:bg-[#1e293b]/5 transition-all">
                                        <Icon name="verified_user" size={20} className="text-[#1e293b]" />
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600">Scheme Info</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-2 p-3 bg-black/20 border border-white/5 rounded hover:border-[#1e293b]/30 hover:bg-[#1e293b]/5 transition-all">
                                        <Icon name="location_on" size={20} className="text-[#1e293b]" />
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600">Booth Map</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            {/* Modals */}
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
        </>
    );
}
