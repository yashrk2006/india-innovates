"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface IssueModalProps {
    isOpen: boolean;
    onClose: () => void;
    voter: {
        id: number;
        name: string;
        booth_id: number | null;
    } | null;
    onSuccess: () => void;
}

export default function IssueModal({ isOpen, onClose, voter, onSuccess }: IssueModalProps) {
    const [category, setCategory] = useState<string>("other");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!voter) return;

        setLoading(true);
        const supabase = createClient();

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // 1. Log grievance
            const { error: grievanceError } = await supabase
                .from("grievances")
                .insert({
                    voter_id: voter.id,
                    booth_id: voter.booth_id,
                    category: category,
                    title: title || `${category.charAt(0).toUpperCase() + category.slice(1)} Issue`,
                    description: description,
                    status: "submitted",
                });

            if (grievanceError) throw grievanceError;

            // 2. Log activity
            const { error: logError } = await supabase
                .from("worker_activity_log")
                .insert({
                    worker_id: user.id,
                    activity_type: "grievance_logged",
                    reference_id: voter.id,
                    notes: `Category: ${category}. Grievance recorded.`,
                });

            if (logError) throw logError;

            toast.success(`Issue recorded for ${voter.name}`);
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Error recording issue:", error);
            toast.error(error.message || "Failed to record issue");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const categories = [
        { id: "road", label: "Road & Infra", icon: "construction" },
        { id: "water", label: "Water Supply", icon: "water_drop" },
        { id: "electricity", label: "Electricity", icon: "bolt" },
        { id: "sanitation", label: "Sanitation", icon: "cleaning_services" },
        { id: "healthcare", label: "Healthcare", icon: "medical_services" },
        { id: "education", label: "Education", icon: "school" },
        { id: "other", label: "Other / Misc", icon: "help" }
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white shadow-sm border border-[rgba(248,113,113,0.3)] rounded-lg w-full max-w-md overflow-hidden shadow-2xl"
                >
                    <div className="p-5 border-b border-[rgba(30,41,59,0.1)] flex justify-between items-center bg-[#1c1616]">
                        <div>
                            <h3 className="text-slate-900 font-serif font-bold text-lg">Record Voter Issue</h3>
                            <p className="text-slate-700/40 text-[10px] font-mono uppercase tracking-wider">Voter: {voter?.name}</p>
                        </div>
                        <button onClick={onClose} className="text-slate-700/40 hover:text-slate-900 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="space-y-3">
                            <label className="block font-mono text-[10px] uppercase tracking-[2px] text-[#ef4444]">Issue Category</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setCategory(cat.id)}
                                        className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded border transition-all ${category === cat.id 
                                            ? "bg-[#ef4444]/10 border-[#ef4444] text-slate-900" 
                                            : "bg-stone-50 border-white/5 text-slate-500 hover:border-slate-200"}`}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{cat.icon}</span>
                                        <span className="text-[10px] font-medium text-center">{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block font-mono text-[10px] uppercase tracking-[2px] text-[#ef4444]">Brief Summary</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Frequent power cuts at night"
                                className="w-full bg-stone-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-[#ef4444] transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block font-mono text-[10px] uppercase tracking-[2px] text-[#ef4444]">Detailed Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the issue in detail..."
                                className="w-full bg-stone-50 border border-slate-200 rounded p-3 text-sm text-slate-700 focus:outline-none focus:border-[#ef4444] h-24 resize-none transition-colors"
                                required
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
                                className="flex-1 px-4 py-2.5 rounded bg-[#ef4444] text-slate-900 text-xs font-bold uppercase tracking-wider hover:bg-[#ef4444]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>report_problem</span>
                                        Submit Grievance
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
