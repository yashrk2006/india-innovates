"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface LogContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    voter: {
        id: number;
        name: string;
        epic_number: string;
    } | null;
    onSuccess: () => void;
}

export default function LogContactModal({ isOpen, onClose, voter, onSuccess }: LogContactModalProps) {
    const [sentiment, setSentiment] = useState<string>("neutral");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!voter) return;

        setLoading(true);
        const supabase = createClient();

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // 1. Update voter sentiment and last contacted
            const { error: voterError } = await supabase
                .from("voters")
                .update({
                    voter_sentiment: sentiment,
                    last_contacted_at: new Date().toISOString(),
                })
                .eq("id", voter.id);

            if (voterError) throw voterError;

            // 2. Log activity
            const { error: logError } = await supabase
                .from("worker_activity_log")
                .insert({
                    worker_id: user.id,
                    activity_type: "voter_contacted",
                    reference_id: voter.id,
                    notes: `Sentiment: ${sentiment}. Notes: ${notes}`,
                });

            if (logError) throw logError;

            toast.success(`Contact logged for ${voter.name}`);
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Error logging contact:", error);
            toast.error(error.message || "Failed to log contact");
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
                            <h3 className="text-slate-900 font-serif font-bold text-lg">Log Voter Contact</h3>
                            <p className="text-slate-700/40 text-[10px] font-mono uppercase tracking-wider">Voter: {voter?.name} ({voter?.epic_number})</p>
                        </div>
                        <button onClick={onClose} className="text-slate-700/40 hover:text-slate-900 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="space-y-3">
                            <label className="block font-mono text-[10px] uppercase tracking-[2px] text-[#1e293b]">Voter Sentiment</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: "supportive", label: "Supportive", icon: "thumb_up", color: "#10b981" },
                                    { id: "neutral", label: "Neutral", icon: "emergency_home", color: "#1e293b" },
                                    { id: "opposed", label: "Opposed", icon: "thumb_down", color: "#ef4444" },
                                    { id: "uncontacted", label: "Not Met", icon: "person_off", color: "#6b7280" }
                                ].map((opt) => (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => setSentiment(opt.id)}
                                        className={`flex items-center gap-2 px-3 py-2.5 rounded border transition-all ${sentiment === opt.id 
                                            ? "bg-[#1e293b]/10 border-[#1e293b] text-slate-900" 
                                            : "bg-stone-50 border-white/5 text-slate-500 hover:border-slate-200"}`}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: sentiment === opt.id ? opt.color : "inherit" }}>{opt.icon}</span>
                                        <span className="text-xs font-medium">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block font-mono text-[10px] uppercase tracking-[2px] text-[#1e293b]">Interaction Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any specific feedback or observations..."
                                className="w-full bg-stone-50 border border-slate-200 rounded p-3 text-sm text-slate-700 focus:outline-none focus:border-[#1e293b] h-24 resize-none transition-colors"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 rounded border border-slate-200 text-slate-600 text-xs font-mono uppercase tracking-wider hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 rounded bg-[#1e293b] text-[#f8fafc] text-xs font-bold uppercase tracking-wider hover:bg-[#1e293b]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-[#f8fafc]/30 border-t-[#f8fafc] rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
                                        Confirm Log
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
