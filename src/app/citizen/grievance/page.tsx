"use client";

import { useState, useEffect, useRef } from "react";
import { getGrievances, createGrievance, uploadGrievancePhoto } from "@/lib/services";
import type { Grievance } from "@/lib/types";

const categories = [
    { id: "Roads", icon: "add_road", label: "Roads" },
    { id: "Water", icon: "water_drop", label: "Water" },
    { id: "Health", icon: "medical_services", label: "Health" },
    { id: "Waste", icon: "delete", label: "Waste" },
    { id: "Power", icon: "lightbulb", label: "Power" },
    { id: "Other", icon: "more_horiz", label: "Other" },
];

const statusTimeline: Record<string, { steps: string[]; done: number }> = {
    submitted: { steps: ["Submitted", "Assigned", "In Progress", "Resolved"], done: 1 },
    assigned: { steps: ["Submitted", "Assigned", "In Progress", "Resolved"], done: 2 },
    in_progress: { steps: ["Submitted", "Assigned", "In Progress", "Resolved"], done: 3 },
    resolved: { steps: ["Submitted", "Assigned", "In Progress", "Resolved"], done: 4 },
};

const statusColors: Record<string, string> = {
    submitted: "text-blue-600 bg-blue-50 border-blue-200",
    assigned: "text-purple-600 bg-purple-50 border-purple-200",
    in_progress: "text-orange-600 bg-orange-50 border-orange-200",
    resolved: "text-green-600 bg-green-50 border-green-200",
};

const statusLabels: Record<string, string> = {
    submitted: "Submitted",
    assigned: "Assigned",
    in_progress: "In Progress",
    resolved: "Resolved",
};

export default function GrievancePage() {
    const [category, setCategory] = useState("Roads");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [grievances, setGrievances] = useState<Grievance[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
    const [photoName, setPhotoName] = useState("");
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        getGrievances().then(data => {
            setGrievances(data);
            setLoading(false);
        });
        return () => {
            if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
        };
    }, []);

    const handleFileUpload = () => {
        fileRef.current?.click();
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoName(file.name);
            setPhotoFile(file);
        }
    };

    const handleSubmit = async () => {
        if (!description.trim()) return;
        setSubmitting(true);

        let photoUrl: string | undefined;
        if (photoFile) {
            const url = await uploadGrievancePhoto(photoFile);
            if (url) photoUrl = url;
        }

        const newGrievance = await createGrievance({
            category,
            description: description.trim(),
            location: location.trim() || undefined,
            photo_url: photoUrl,
        });

        setSubmitting(false);

        if (newGrievance) {
            setGrievances(prev => [newGrievance, ...prev]);
            setSubmitted(true);
            setDescription("");
            setLocation("");
            setPhotoName("");
            setPhotoFile(null);
            setCategory("Roads");

            if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
            successTimeoutRef.current = setTimeout(() => setSubmitted(false), 4000);
        }
    };

    const formatDate = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const days = Math.floor(diff / 86400000);
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        return `${days} days ago`;
    };

    return (
        <div className="p-5 md:p-0">
            {/* Success Banner */}
            {submitted && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-up">
                    <span className="material-symbols-outlined text-green-600 icon-filled">task_alt</span>
                    <div>
                        <p className="font-bold text-green-800 text-sm">Grievance Submitted!</p>
                        <p className="text-xs text-green-600">Your complaint has been registered and assigned an ID.</p>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {/* Left: History */}
                <div className="space-y-4">
                    <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">history</span>
                        Past Grievances
                    </h3>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="size-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                        </div>
                    ) : grievances.length === 0 ? (
                        <div className="text-center py-12 text-stone-400 bg-stone-50 rounded-xl">
                            <span className="material-symbols-outlined text-4xl mb-2 block">inbox</span>
                            <p className="text-sm">No grievances yet</p>
                        </div>
                    ) : (
                        grievances.map((g, i) => {
                            const timeline = statusTimeline[g.status] || statusTimeline.submitted;
                            return (
                                <div
                                    key={g.id}
                                    onClick={() => setSelectedGrievance(selectedGrievance?.id === g.id ? null : g)}
                                    className={`bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all cursor-pointer animate-fade-up stagger-${(i % 4) + 1} ${selectedGrievance?.id === g.id ? "border-primary ring-1 ring-primary/20" : "border-stone-100"
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-stone-400 text-lg">
                                                {categories.find(c => c.id === g.category)?.icon || "report_problem"}
                                            </span>
                                            <span className="font-bold text-sm text-slate-900">{g.category}</span>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[g.status]}`}>
                                            {statusLabels[g.status]}
                                        </span>
                                    </div>
                                    <p className="text-sm text-stone-600 line-clamp-2 mb-2">{g.description}</p>
                                    <p className="text-xs text-stone-400">{formatDate(g.created_at)}</p>

                                    {/* Timeline (expanded) */}
                                    {selectedGrievance?.id === g.id && (
                                        <div className="mt-4 pt-4 border-t border-stone-100">
                                            <div className="flex items-center">
                                                {timeline.steps.map((step, si) => (
                                                    <div key={step} className="flex items-center flex-1 last:flex-none">
                                                        <div className="flex flex-col items-center">
                                                            <div className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold ${si < timeline.done ? "bg-primary text-white" : "bg-stone-200 text-stone-400"
                                                                }`}>
                                                                {si < timeline.done ? "✓" : si + 1}
                                                            </div>
                                                            <span className="text-[9px] text-stone-500 mt-1 whitespace-nowrap">{step}</span>
                                                        </div>
                                                        {si < timeline.steps.length - 1 && (
                                                            <div className={`flex-1 h-0.5 mx-1 ${si < timeline.done - 1 ? "bg-primary" : "bg-stone-200"}`} />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            {g.location && (
                                                <p className="text-xs text-stone-500 mt-3 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                                    {g.location}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Right: New Grievance Form */}
                <div className="space-y-5">
                    <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-500">report_problem</span>
                        Report an Issue
                    </h3>

                    {/* Category */}
                    <div>
                        <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">Category</label>
                        <div className="grid grid-cols-3 gap-2">
                            {categories.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setCategory(c.id)}
                                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-sm transition-all ${category === c.id
                                        ? "bg-primary/10 border-primary text-primary font-bold"
                                        : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                                        }`}
                                >
                                    <span className="material-symbols-outlined">{c.icon}</span>
                                    <span className="text-xs">{c.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">Location</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">location_on</span>
                            <input
                                type="text" placeholder="e.g. Near Main Market, Ward 4"
                                value={location} onChange={e => setLocation(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">
                            Description
                            <span className="text-stone-400 font-normal ml-2">{description.length}/500</span>
                        </label>
                        <textarea
                            placeholder="Describe the issue in detail..."
                            value={description} onChange={e => setDescription(e.target.value.slice(0, 500))}
                            rows={4}
                            className="w-full p-4 rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm resize-none"
                        />
                    </div>

                    {/* Attachments */}
                    <div className="flex items-center gap-3">
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                        <button onClick={handleFileUpload} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm transition-colors">
                            <span className="material-symbols-outlined text-lg">photo_camera</span>
                            {photoName || "Add Photo"}
                        </button>
                        <button onClick={() => alert("Voice Note recording feature coming soon.")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm transition-colors">
                            <span className="material-symbols-outlined text-lg">mic</span>
                            Voice Note
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !description.trim()}
                        className="w-full py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
                    >
                        {submitting ? (
                            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span className="material-symbols-outlined">send</span>
                                Submit Grievance
                            </>
                        )}
                    </button>

                    {/* Emergency Contact */}
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center gap-3">
                        <span className="material-symbols-outlined text-orange-500">emergency</span>
                        <div>
                            <p className="text-xs font-bold text-orange-800">Emergency?</p>
                            <p className="text-xs text-orange-600">Call 112 for immediate assistance</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
