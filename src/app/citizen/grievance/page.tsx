"use client";

import { useState } from "react";

export default function GrievancePage() {
    const [category, setCategory] = useState("Roads");

    const categories = [
        { id: "Roads", icon: "add_road", label: "Roads" },
        { id: "Water", icon: "water_drop", label: "Water" },
        { id: "Health", icon: "medical_services", label: "Health" },
        { id: "Waste", icon: "delete", label: "Waste" },
        { id: "Power", icon: "lightbulb", label: "Power" },
        { id: "Other", icon: "more_horiz", label: "Other" },
    ];

    const pastGrievances = [
        {
            id: "GRV-2023-001",
            category: "Water",
            desc: "Low water pressure in Sector 4",
            date: "2 days ago",
            status: "In Progress",
            statusColor: "text-orange-600 bg-orange-50 border-orange-200"
        },
        {
            id: "GRV-2023-002",
            category: "Roads",
            desc: "Pothole near Main Market entrance",
            date: "5 days ago",
            status: "Resolved",
            statusColor: "text-green-600 bg-green-50 border-green-200"
        }
    ];

    return (
        <div className="flex flex-col md:flex-row h-full gap-6 md:p-8 p-5">
            {/* Left Panel: History & Status (Hidden on Mobile unless toggled, or stacked) */}
            <div className="w-full md:w-1/3 flex flex-col gap-6 order-2 md:order-1">
                <div>
                    <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">You have 1 active grievance.</h2>
                    <div className="space-y-3">
                        {pastGrievances.map((g) => (
                            <div key={g.id} className="bg-white p-4 rounded-xl border border-stone-200 hover:border-primary/50 transition-colors shadow-sm cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-stone-400">{g.id}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${g.statusColor}`}>
                                        {g.status}
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">{g.category} Issue</h4>
                                <p className="text-sm text-stone-500 line-clamp-1 mb-3">{g.desc}</p>
                                <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-xs text-stone-400">
                                    <span>{g.date}</span>
                                    <span>View Details &rarr;</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-auto hidden md:block">
                    <h4 className="font-bold text-blue-900 mb-2">Need immediate help?</h4>
                    <p className="text-sm text-blue-700 mb-3">For emergencies like fire or major accidents, please call the emergency helpline directly.</p>
                    <button className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 transition-colors">
                        Call 112
                    </button>
                </div>
            </div>

            {/* Right Panel: New Grievance Form */}
            <div className="w-full md:w-2/3 md:h-full order-1 md:order-2 flex flex-col">
                <div className="mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-secondary">New Report</span>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">Lodge a Grievance</h3>
                </div>

                <div className="bg-white rounded-2xl shadow-card overflow-hidden flex flex-col md:flex-row flex-1 border border-stone-100">
                    {/* Form content wrapper */}
                    <div className="p-6 md:p-8 flex flex-col gap-6 flex-grow overflow-y-auto">

                        {/* Section 1: Category Selection */}
                        <div className="space-y-3">
                            <label className="block text-lg font-bold text-slate-900">1. Select Category</label>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategory(cat.id)}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-2 ${category === cat.id
                                            ? "border-2 border-primary bg-primary/5 text-primary"
                                            : "border-slate-200 hover:border-primary/50 text-stone-500 hover:text-primary"
                                            }`}
                                    >
                                        <span className={`material-symbols-outlined text-3xl ${category === cat.id ? "icon-filled" : ""}`}>{cat.icon}</span>
                                        <span className={`text-xs md:text-sm ${category === cat.id ? "font-semibold" : "font-medium"}`}>{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Section 2: Description */}
                        <div className="space-y-3 flex-grow">
                            <label className="block text-lg font-bold text-slate-900">2. Describe Issue</label>
                            <div className="relative group flex-grow">
                                <textarea
                                    className="w-full h-40 md:h-full min-h-[160px] p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-base resize-none transition-all placeholder:text-stone-400 text-slate-900"
                                    placeholder="Describe the location and nature of the problem..."
                                ></textarea>
                                {/* Inside Input Actions */}
                                <div className="absolute bottom-3 right-3 flex gap-2">
                                    <button className="size-10 rounded-full bg-white border border-stone-200 shadow-sm hover:bg-stone-50 flex items-center justify-center text-stone-600 transition-colors" title="Upload Photo">
                                        <span className="material-symbols-outlined text-xl">add_a_photo</span>
                                    </button>
                                    <button className="size-10 rounded-full bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center text-secondary transition-colors animate-pulse" title="Voice Input">
                                        <span className="material-symbols-outlined text-xl icon-filled">mic</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-stone-500">
                                <span className="material-symbols-outlined text-base">info</span>
                                <span>Voice recording helps us understand the issue better.</span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button className="w-full bg-slate-900 text-white hover:bg-slate-800 font-bold text-lg py-4 rounded-xl shadow-lg transition-all transform active:scale-[0.98] mt-auto">
                            Submit Grievance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
