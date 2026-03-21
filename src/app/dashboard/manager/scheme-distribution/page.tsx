"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ManagerPageLayout, { MgrCard, MgrSection, MgrKPI } from "@/components/manager/ManagerPageLayout";
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
        <ManagerPageLayout title="Scheme Distribution" badge="SEND" badgeColor="#1e293b">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <MgrCard>
                    <div className="p-4">
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-2 tracking-wider">Step 1: Select Scheme</label>
                        <select 
                            value={selectedScheme || ""} 
                            onChange={e => setSelectedScheme(Number(e.target.value))}
                            className="w-full bg-white shadow-sm border border-slate-200 rounded px-3 py-2 text-xs text-slate-600 outline-none focus:border-[#1e293b]/40"
                        >
                            <option value="">Choose a scheme...</option>
                            {schemes.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </MgrCard>
                <MgrCard>
                    <div className="p-4">
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-2 tracking-wider">Step 2: Select Booth</label>
                        <select 
                            value={selectedBooth || ""} 
                            onChange={e => setSelectedBooth(Number(e.target.value))}
                            className="w-full bg-white shadow-sm border border-slate-200 rounded px-3 py-2 text-xs text-slate-600 outline-none focus:border-[#1e293b]/40"
                        >
                            <option value="">Choose a booth...</option>
                            {booths.map(b => (
                                <option key={b.id} value={b.id}>{b.booth_number} - {b.name}</option>
                            ))}
                        </select>
                    </div>
                </MgrCard>
            </div>

            {selectedBooth ? (
                <MgrCard>
                    <MgrSection title={`Voters in Booth ${selectedBooth}`} icon="people" />
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-white/5 text-slate-500 font-mono text-[9px] tracking-wider uppercase">
                                    <th className="p-4">Voter Name</th>
                                    <th className="p-4">Segment</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {voters.length > 0 ? voters.map((v, i) => (
                                    <tr key={v.id} className="border-b border-slate-200 hover:bg-slate-50">
                                        <td className="p-4 font-medium text-slate-500">
                                            {v.eci?.name || "Voter #" + v.id}
                                            {v.id === 1 && (
                                                <span className="ml-2 px-1.5 py-0.5 rounded bg-[#1e293b] text-[#f8fafc] text-[8px] font-bold animate-pulse">DEMO CITIZEN</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded text-[10px] uppercase font-mono border border-white/5">
                                                {v.segment || "other"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => handleSend(v.id)}
                                                disabled={sending.includes(v.id) || !selectedScheme}
                                                className={`px-4 py-1.5 rounded-lg font-mono text-[10px] transition-all ${
                                                    sending.includes(v.id) 
                                                    ? "bg-slate-50 text-slate-400 border border-white/5" 
                                                    : "bg-[#1e293b]/10 text-[#1e293b] border border-[#1e293b]/20 hover:bg-[#1e293b]/20"
                                                }`}
                                            >
                                                {sending.includes(v.id) ? "SENDING..." : "SEND SCHEME"}
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="p-8 text-center text-slate-400 font-mono text-[11px]">No voters found in this booth.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </MgrCard>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white shadow-sm rounded border border-dashed border-slate-200 opacity-30">
                    <Icon name="touch_app" size={48} className="mb-4" />
                    <p className="font-mono text-[11px] uppercase tracking-widest">Select a booth to start distributing schemes</p>
                </div>
            )}
        </ManagerPageLayout>
    );
}
