"use client";

import { useState } from "react";
import { useLanguage } from "@/components/citizen/LanguageContext";
import { motion } from "framer-motion";

const trackings = [
    {
        refNo: "VTR8201948",
        type: "New Voter Registration (Form 6)",
        status: "In Progress",
        updated: "Today, 10:30 AM",
        currentStep: 2,
        steps: [
            { label: "Submitted", date: "Mar 15, 2026", done: true },
            { label: "Field Verification", date: "Mar 18, 2026", done: true },
            { label: "Processing by BLO", date: "In Progress", done: false },
            { label: "ID Card Dispatched", date: "Pending", done: false },
            { label: "Delivered", date: "Pending", done: false }
        ]
    },
    {
        refNo: "COR9928173",
        type: "Address Correction (Form 8)",
        status: "Completed",
        updated: "Mar 10, 2026",
        currentStep: 4,
        steps: [
            { label: "Submitted", date: "Mar 01, 2026", done: true },
            { label: "Verification", date: "Mar 03, 2026", done: true },
            { label: "Processing", date: "Mar 05, 2026", done: true },
            { label: "Updated in Roll", date: "Mar 08, 2026", done: true },
            { label: "Digital ID Ready", date: "Mar 10, 2026", done: true }
        ]
    }
];

export default function ApplicationStatusTracker() {
    const { language, t } = useLanguage();
    const [searchRef, setSearchRef] = useState("");
    const [selectedTrack, setSelectedTrack] = useState(trackings[0]);

    return (
        <div className="space-y-8 pb-10">
            {/* Search Section */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm transition-all hover:shadow-md">
                <h3 className="font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">search</span>
                    {t("track_application")}
                </h3>
                <div className="flex gap-3">
                    <div className="relative flex-1 group">
                        <input 
                            type="text" 
                            placeholder={t("enter_ref_id")}
                            value={searchRef}
                            onChange={(e) => setSearchRef(e.target.value)}
                            className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none group-hover:bg-white"
                        />
                        <button className="absolute right-3 top-2 px-3 py-1.5 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                            {t("track_application").split(" ")[0]}
                        </button>
                    </div>
                </div>
                <p className="mt-3 text-[10px] text-stone-400 font-medium px-2">
                    {t("ref_id_note")}
                </p>
            </div>

            {/* Active Tracking Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Tracker Visualization */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-slate-900 leading-tight">{selectedTrack.type}</h4>
                                <p className="text-xs text-stone-500 mt-1">Ref: {selectedTrack.refNo}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${selectedTrack.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                {selectedTrack.status}
                            </span>
                        </div>
                        
                        <div className="p-8">
                            <div className="relative flex justify-between">
                                {/* Connector Line */}
                                <div className="absolute top-4 left-0 right-0 h-0.5 bg-stone-100 -z-0"></div>
                                <div 
                                    className="absolute top-4 left-0 h-0.5 bg-primary -z-0 transition-all duration-1000" 
                                    style={{ width: `${(selectedTrack.currentStep / (selectedTrack.steps.length - 1)) * 100}%` }}
                                ></div>

                                {selectedTrack.steps.map((step, idx) => (
                                    <div key={idx} className="relative z-10 flex flex-col items-center gap-4 w-1/5 text-center">
                                        <div className={`size-9 rounded-full flex items-center justify-center transition-all duration-500 shadow-md ${idx <= selectedTrack.currentStep ? 'bg-primary text-white' : 'bg-white border-2 border-stone-100 text-stone-300'}`}>
                                            {idx < selectedTrack.currentStep ? (
                                                <span className="material-symbols-outlined text-sm font-bold">check</span>
                                            ) : (
                                                <span className="text-xs font-bold">{idx + 1}</span>
                                            )}
                                        </div>
                                        <div>
                                            <p className={`text-[10px] font-bold leading-tight ${idx <= selectedTrack.currentStep ? 'text-slate-900' : 'text-stone-400'}`}>
                                                {step.label}
                                            </p>
                                            <p className="text-[9px] text-stone-400 mt-0.5 uppercase tracking-tighter font-medium">
                                                {step.date}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CPGRAMS-style Detailed History */}
                        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-primary">history</span>
                                <h5 className="font-bold text-slate-900">Application Lifecycle Details</h5>
                            </div>
                            <div className="space-y-6">
                                {selectedTrack.steps.filter(s => s.done).reverse().map((step, i) => (
                                    <div key={i} className="flex gap-4 relative">
                                        {i < selectedTrack.steps.filter(s => s.done).length - 1 && (
                                            <div className="absolute top-8 left-4 w-0.5 h-full bg-stone-100"></div>
                                        )}
                                        <div className="size-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-sm">check_circle</span>
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <div className="flex justify-between items-start">
                                                <p className="font-bold text-sm text-slate-800">{step.label}</p>
                                                <span className="text-[10px] font-bold text-stone-400 bg-stone-50 px-2 py-0.5 rounded uppercase">Action Taken</span>
                                            </div>
                                            <p className="text-[11px] text-stone-500 mt-1">{step.date} · Verified by Booth Level Officer</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 bg-stone-50/50 border-t border-stone-100 flex items-center justify-between">
                            <p className="text-[10px] text-stone-500">Last updated: <span className="font-bold text-stone-700">{selectedTrack.updated}</span></p>
                            <button className="text-[10px] font-bold text-primary hover:underline">Get Detailed Report</button>
                        </div>
                    </div>

                    <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 flex gap-4 items-start">
                        <div className="size-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                            <span className="material-symbols-outlined">support_agent</span>
                        </div>
                        <div>
                            <h5 className="font-bold text-sm text-slate-900 leading-tight">{t("need_help_application")}</h5>
                            <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                                If your application is stuck for more than 15 days, you can directly connect with your local Booth Level Officer (BLO) for assistance.
                            </p>
                        </div>
                        <button className="ml-auto px-4 py-2 bg-white border border-stone-200 rounded-xl text-[10px] font-bold text-slate-700 hover:bg-stone-50 transition-colors shrink-0">
                            {t("contact_blo")}
                        </button>
                    </div>
                </div>

                {/* Tracking History List */}
                <div className="space-y-4">
                    <h3 className="font-display font-bold text-slate-900 px-2">{t("history")}</h3>
                    {trackings.map((track) => (
                        <button 
                            key={track.refNo}
                            onClick={() => setSelectedTrack(track)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedTrack.refNo === track.refNo ? 'bg-white border-primary shadow-lg shadow-primary/5 ring-1 ring-primary/20' : 'bg-white/50 border-stone-100 hover:bg-white hover:border-stone-200'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-stone-400 tracking-wider">#{track.refNo}</span>
                                <span className={`text-[10px] font-bold ${track.status === 'Completed' ? 'text-green-600' : 'text-blue-600'}`}>
                                    {track.status}
                                </span>
                            </div>
                            <p className="font-bold text-xs text-slate-900 truncate">{track.type}</p>
                            <p className="text-[10px] text-stone-500 mt-0.5">{track.updated}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
