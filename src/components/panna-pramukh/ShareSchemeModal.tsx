"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface ShareSchemeModalProps {
    isOpen: boolean;
    onClose: () => void;
    voter: {
        id: number;
        name: string;
    } | null;
    onSuccess: () => void;
}

export default function ShareSchemeModal({ isOpen, onClose, voter, onSuccess }: ShareSchemeModalProps) {
    const [schemes, setSchemes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [selectedScheme, setSelectedScheme] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchSchemes();
        }
    }, [isOpen]);

    const fetchSchemes = async () => {
        setFetching(true);
        const supabase = createClient();
        try {
            const { data, error } = await supabase
                .from("schemes")
                .select("*")
                .eq("active", true)
                .order("name");
            
            if (error) throw error;
            setSchemes(data || []);
        } catch (error: any) {
            console.error("Error fetching schemes:", error);
            toast.error("Failed to load schemes");
        } finally {
            setFetching(false);
        }
    };

    const handleShare = async () => {
        if (!voter || !selectedScheme) return;

        setLoading(true);
        const supabase = createClient();

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // 1. Update or Insert voter scheme status
            const { error: statusError } = await supabase
                .from("voter_scheme_status")
                .upsert({
                    voter_id: voter.id,
                    scheme_id: selectedScheme,
                    outreach_sent: true,
                    outreach_sent_at: new Date().toISOString(),
                    status: 'eligible' // Default status when sharing
                }, { onConflict: 'voter_id,scheme_id' });

            if (statusError) throw statusError;

            // 2. Log activity
            const { error: logError } = await supabase
                .from("worker_activity_log")
                .insert({
                    worker_id: user.id,
                    activity_type: "voter_contacted", // Reusing type or could add a new one if schema allowed
                    reference_id: voter.id,
                    notes: `Scheme info shared: ${schemes.find(s => s.id === selectedScheme)?.name}`,
                });

            if (logError) throw logError;

            toast.success(`Scheme information shared with ${voter.name}`);
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Error sharing scheme:", error);
            toast.error(error.message || "Failed to share scheme");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white shadow-sm border border-[rgba(30,41,59,0.2)] rounded-lg w-full max-w-md overflow-hidden shadow-2xl"
                >
                    <div className="p-5 border-b border-[rgba(30,41,59,0.1)] flex justify-between items-center bg-slate-50">
                        <div>
                            <h3 className="text-slate-900 font-serif font-bold text-lg">Share Govt Scheme</h3>
                            <p className="text-slate-700/40 text-[10px] font-mono uppercase tracking-wider">Voter: {voter?.name}</p>
                        </div>
                        <button onClick={onClose} className="text-slate-700/40 hover:text-slate-900 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="p-6 space-y-5">
                        <div className="space-y-3">
                            <label className="block font-mono text-[10px] uppercase tracking-[2px] text-[#1e293b]">Select Scheme to Share</label>
                            
                            {fetching ? (
                                <div className="flex justify-center py-8">
                                    <div className="w-6 h-6 border-2 border-[#1e293b]/20 border-t-[#1e293b] rounded-full animate-spin" />
                                </div>
                            ) : schemes.length === 0 ? (
                                <p className="text-slate-700/20 text-center py-4 text-xs italic font-mono">No active schemes found.</p>
                            ) : (
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {schemes.map((scheme) => (
                                        <button
                                            key={scheme.id}
                                            onClick={() => setSelectedScheme(scheme.id)}
                                            className={`w-full flex items-start gap-3 p-3 rounded border transition-all text-left ${selectedScheme === scheme.id 
                                                ? "bg-[#1e293b]/10 border-[#1e293b] text-slate-900" 
                                                : "bg-stone-50 border-white/5 text-slate-500 hover:border-slate-200"}`}
                                        >
                                            <span className="material-symbols-outlined mt-0.5" style={{ fontSize: 18 }}>{scheme.icon || "description"}</span>
                                            <div>
                                                <p className="text-xs font-bold leading-tight">{scheme.name}</p>
                                                <p className="text-[10px] text-slate-700/40 mt-1 line-clamp-2">{scheme.description}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 rounded border border-slate-200 text-slate-600 text-xs font-mono uppercase tracking-wider hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleShare}
                                disabled={loading || !selectedScheme}
                                className="flex-1 px-4 py-2.5 rounded bg-[#1e293b] text-[#f8fafc] text-xs font-bold uppercase tracking-wider hover:bg-[#1e293b]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-[#f8fafc]/30 border-t-[#f8fafc] rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>send</span>
                                        Share Details
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(30,41,59,0.1);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(30,41,59,0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(30,41,59,0.2);
                }
            `}</style>
        </AnimatePresence>
    );
}
