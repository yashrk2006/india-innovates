"use client";

import { useState } from "react";

const schemes = [
    {
        id: 1,
        title: "PM Kisan Samman Nidhi",
        program: "Ministry of Agriculture",
        desc: "Financial benefit of ₹6,000 per year for landholding farmers, payable in three equal installments of ₹2,000 each.",
        status: "Enrolled",
        statusColor: "green",
        icon: "agriculture",
        nextPayment: "Oct 2023"
    },
    {
        id: 2,
        title: "Ayushman Bharat",
        program: "Ministry of Health",
        desc: "Health cover of ₹5 Lakh per family per year for secondary and tertiary care hospitalization.",
        status: "Eligible",
        statusColor: "orange",
        icon: "health_and_safety",
        action: "Apply Now"
    },
    {
        id: 3,
        title: "PM Awas Yojana",
        program: "Ministry of Housing",
        desc: "Housing for all in urban areas with interest subsidy for first-time homebuyers.",
        status: "Applied",
        statusColor: "stone",
        icon: "home_work",
        statusText: "Under Review"
    },
    {
        id: 4,
        title: "Ujjwala Yojana 2.0",
        program: "Ministry of Petroleum",
        desc: "Free LPG connection for women from BPL households with financial support for first refill.",
        status: "Eligible",
        statusColor: "orange",
        icon: "propane",
        action: "Apply Now"
    },
    {
        id: 5,
        title: "Skill India Mission",
        program: "Ministry of Skill Dev",
        desc: "Training courses in various industrial trades to empower youth with skill sets.",
        status: "Eligible",
        statusColor: "orange",
        icon: "school",
        action: "Explore Courses"
    }
];

export default function SchemesPage() {
    const [filter, setFilter] = useState("All");

    return (
        <div className="md:p-8 p-5 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 leading-tight">Government Schemes</h1>
                    <p className="text-stone-500 text-sm mt-1">Benefits and programs available for you.</p>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {["All", "Eligible", "Enrolled", "Applied"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors whitespace-nowrap ${filter === f ? 'bg-primary text-white border-primary' : 'bg-white border-stone-200 text-stone-600 hover:border-primary/50'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {schemes.map((scheme) => (
                    <div key={scheme.id} className="bg-white rounded-xl p-5 shadow-sm border border-stone-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`size-12 rounded-xl flex items-center justify-center ${scheme.statusColor === 'green' ? 'bg-green-100 text-green-700' : scheme.statusColor === 'blue' ? 'bg-blue-100 text-blue-700' : scheme.statusColor === 'orange' ? 'bg-orange-100 text-orange-700' : 'bg-stone-100 text-stone-600'}`}>
                                    <span className="material-symbols-outlined text-2xl">{scheme.icon}</span>
                                </div>
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${scheme.statusColor === 'green' ? 'bg-green-50 text-green-700 border-green-200' : scheme.statusColor === 'orange' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-stone-100 text-stone-600 border-stone-200'}`}>
                                    {scheme.status}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">{scheme.title}</h3>
                            <p className="text-xs text-stone-500 font-medium uppercase tracking-wide mb-3">{scheme.program}</p>
                            <p className="text-sm text-stone-600 leading-relaxed mb-4">{scheme.desc}</p>
                        </div>

                        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                            {scheme.status === "Enrolled" && (
                                <span className="text-xs font-semibold text-stone-500">Next: {scheme.nextPayment}</span>
                            )}
                            {scheme.status === "Applied" && (
                                <span className="text-xs font-semibold text-stone-500">Status: {scheme.statusText}</span>
                            )}
                            {scheme.status === "Eligible" && (
                                <button className="text-xs font-bold text-primary uppercase tracking-wide hover:underline">Apply Now</button>
                            )}

                            <button className="text-stone-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
