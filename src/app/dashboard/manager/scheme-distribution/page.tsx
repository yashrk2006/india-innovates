"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ManagerPageLayout, { MgrCard, MgrSection, MgrKPI } from "@/components/features/manager/ManagerPageLayout";
import { useApi, useMutation } from "@/lib/hooks";
import { useToast } from "@/components/ui/Toast";

function Icon({ name, size = 16, className = "" }: { name: string; size?: number; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size }}>{name}</span>;
}

export default function SchemeDistributionPage() {
    const [selectedBooth, setSelectedBooth] = useState<number | null>(null);
    const [selectedScheme, setSelectedScheme] = useState<number | null>(null);
    const [sending, setSending] = useState<number[]>([]);
    const { toast } = useToast();

    const { data: booths } = useApi<any[]>("/api/booths", []);
    const { data: schemes } = useApi<any[]>("/api/schemes/distribution?type=schemes", []);
    const { data: voters, refetch: refetchVoters } = useApi<any[]>(
        selectedBooth ? `/api/schemes/distribution?booth_id=${selectedBooth}` : "", 
        []
    );

    const { mutate: sendScheme } = useMutation<any, any>("/api/schemes/distribution", "POST");

    const handleSend = async (voterId: number) => {
        if (!selectedScheme) {
            toast("Please select a scheme first", "warning");
            return;
        }

        setSending(prev => [...prev, voterId]);
        try {
            const result = await sendScheme({ voterId, schemeId: selectedScheme });
            
            if (result?.success) {
                toast("Scheme sent to citizen!", "success");
                refetchVoters();
            } else {
                toast("Failed to send scheme", "error");
            }
        } catch (err) {
            toast("Network error", "error");
        } finally {
            setSending(prev => prev.filter(id => id !== voterId));
        }
    };

    return (
        <ManagerPageLayout title="Benefit Dispatch Command" badge="LOGISTICS" badgeColor="#1e293b">
            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <MgrKPI label="Active Schemes" value={schemes.length.toString()} icon="description" color="#3b82f6" />
                <MgrKPI label="Booths Covered" value={booths.length.toString()} icon="location_on" color="#10b981" />
                <MgrKPI label="Pending Dispatch" value={voters.length.toString()} icon="hourglass_empty" color="#f59e0b" />
                <MgrKPI label="Units Delivered" value="1,240" icon="check_circle" color="#8b5cf6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <MgrCard>
                    <div className="p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded bg-[#1e293b]/5 flex items-center justify-center">
                                <Icon name="inventory_2" size={18} className="text-[#1e293b]" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-tight">Scheme Selection</h3>
                                <p className="text-[10px] text-slate-400 font-mono">STEP 01: SELECT TARGET BENEFIT</p>
                            </div>
                        </div>
                        <select 
                            value={selectedScheme || ""} 
                            onChange={e => setSelectedScheme(Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-600 outline-none focus:ring-2 focus:ring-[#1e293b]/10 focus:border-[#1e293b]/40 transition-all font-medium"
                        >
                            <option value="">Awaiting selection...</option>
                            {schemes.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </MgrCard>

                <MgrCard>
                    <div className="p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded bg-[#1e293b]/5 flex items-center justify-center">
                                <Icon name="sensors" size={18} className="text-[#1e293b]" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-tight">Sector Assignment</h3>
                                <p className="text-[10px] text-slate-400 font-mono">STEP 02: DEPLOY TO GRID</p>
                            </div>
                        </div>
                        <select 
                            value={selectedBooth || ""} 
                            onChange={e => setSelectedBooth(Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-600 outline-none focus:ring-2 focus:ring-[#1e293b]/10 focus:border-[#1e293b]/40 transition-all font-medium"
                        >
                            <option value="">Awaiting sector...</option>
                            {booths.map(b => (
                                <option key={b.id} value={b.id}>BOOTH #{b.booth_number} - {b.name}</option>
                            ))}
                        </select>
                    </div>
                </MgrCard>
            </div>

            <AnimatePresence mode="wait">
                {selectedBooth ? (
                    <motion.div
                        key="voter-list"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <MgrCard>
                            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex items-center gap-2">
                                    <Icon name="groups" size={20} className="text-[#1e293b]" />
                                    <h2 className="text-xs font-bold text-[#1e293b] uppercase tracking-wider">Beneficiary Manifest</h2>
                                </div>
                                <div className="px-3 py-1 bg-white border border-slate-200 rounded-full flex items-center gap-2 shadow-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-mono font-bold text-slate-600">{voters.length} CITIZENS DETECTED</span>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 text-slate-400 font-mono text-[9px] tracking-wider uppercase border-b border-slate-100">
                                            <th className="p-4 px-6">Identity</th>
                                            <th className="p-4">Segment / Trajectory</th>
                                            <th className="p-4 text-right px-6">Dispatch Control</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {voters.length > 0 ? voters.map((v, i) => (
                                            <motion.tr 
                                                key={v.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="hover:bg-slate-50/80 transition-colors group"
                                            >
                                                <td className="p-4 px-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-slate-700 group-hover:text-[#1e293b] transition-colors">
                                                            {v.eci?.name || "ANONYMOUS UNIT"}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">ID: 0X{v.id.toString(16).padStart(4, '0')}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
                                                            v.segment === 'favorable' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                            v.segment === 'neutral' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                            'bg-slate-50 text-slate-500 border-slate-200'
                                                        }`}>
                                                            {v.segment || "UNDETERMINED"}
                                                        </span>
                                                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                        <span className="text-[10px] text-slate-400 italic">Positive Trajectory</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right px-6">
                                                    <button 
                                                        onClick={() => handleSend(v.id)}
                                                        disabled={sending.includes(v.id) || !selectedScheme}
                                                        className={`group relative overflow-hidden px-5 py-2 rounded-lg font-mono text-[10px] font-bold tracking-wider transition-all shadow-sm ${
                                                            sending.includes(v.id) 
                                                            ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                                                            : !selectedScheme
                                                            ? "bg-slate-50 text-slate-300 cursor-not-allowed"
                                                            : "bg-[#1e293b] text-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                                                        }`}
                                                    >
                                                        {sending.includes(v.id) ? (
                                                            <span className="flex items-center gap-2">
                                                                <div className="w-2 h-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                                DISPATCHING...
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-2">
                                                                <Icon name="send" size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                                                TRANSMIT BENEFIT
                                                            </span>
                                                        )}
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={3} className="p-12 text-center text-slate-400 font-mono text-[11px] uppercase tracking-widest bg-slate-50/20">
                                                    <Icon name="search_off" size={32} className="block mx-auto mb-2 opacity-20" />
                                                    No units detected in current sector
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </MgrCard>
                    </motion.div>
                ) : (
                    <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-32 bg-white/50 border border-slate-200 border-dashed rounded-2xl"
                    >
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                            <Icon name="radar" size={32} className="text-slate-300 animate-pulse" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 text-center">Awaiting Sector Lock-on</h3>
                        <p className="text-[10px] text-slate-300 font-mono max-w-[240px] text-center">SELECT A BOOTH FROM THE SECTOR COMMAND PANEL TO INITIATE BENEFIT DISPATCH PROTOCOL</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </ManagerPageLayout>
    );
}
