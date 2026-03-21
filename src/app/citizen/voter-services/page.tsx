"use client";

import { useLanguage } from "@/components/citizen/LanguageContext";
import { motion } from "framer-motion";

const forms = [
    {
        id: "form6",
        title: "Form 6",
        description: "Application for New Voter Registration",
        hindi_desc: "नए मतदाता पंजीकरण के लिए आवेदन",
        link: "https://www.eci.gov.in/eci-backend/public/api/download?url=L09mZmljZWRvY3VtZW50cy9RWm9uZS82LnBkZg==",
        icon: "person_add"
    },
    {
        id: "form6a",
        title: "Form 6A",
        description: "Registration for Overseas (NRI) Voters",
        hindi_desc: "प्रवासी (एनआरआई) मतदाताओं के लिए पंजीकरण",
        link: "https://www.eci.gov.in/eci-backend/public/api/download?url=L09mZmljZWRvY3VtZW50cy9RWm9uZS82QS5wZGY=",
        icon: "public"
    },
    {
        id: "form7",
        title: "Form 7",
        description: "Objection to Inclusion / Deletion of Name",
        hindi_desc: "नाम शामिल करने / हटाने पर आपत्ति",
        link: "https://www.eci.gov.in/eci-backend/public/api/download?url=L09mZmljZWRvY3VtZW50cy9RWm9uZS83LnBkZg==",
        icon: "person_remove"
    },
    {
        id: "form8",
        title: "Form 8",
        description: "Correction of Entries / Shifting within Assembly",
        hindi_desc: "प्रविष्टियों का सुधार / विधानसभा के भीतर स्थानांतरण",
        link: "https://www.eci.gov.in/eci-backend/public/api/download?url=L09mZmljZWRvY3VtZW50cy9RWm9uZS84LnBkZg==",
        icon: "edit_note"
    }
];

export default function VoterServicesPage() {
    const { language, t } = useLanguage();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
                            {t("official_voter_services")}
                        </h2>
                        <p className="text-stone-600">
                            {t("voter_services_subtitle")}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <a 
                            href="https://voters.eci.gov.in/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-white border border-stone-200 rounded-xl font-bold text-sm text-slate-700 hover:bg-stone-50 transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <span className="material-symbols-outlined text-lg">open_in_new</span>
                            {t("visit_eci_portal")}
                        </a>
                    </div>
                </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                    onClick={() => window.location.href = '/citizen/voter-services/navigator'}
                    className="flex items-center gap-4 p-6 bg-white border border-stone-200 rounded-3xl hover:border-primary/30 hover:shadow-lg transition-all text-left"
                >
                    <div className="size-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <span className="material-symbols-outlined text-3xl">map</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900">{t("polling_station_navigator")}</h4>
                        <p className="text-xs text-stone-500 mt-1">{t("navigator_desc")}</p>
                    </div>
                </button>
                <button 
                    onClick={() => window.location.href = '/citizen/voter-services/tracker'}
                    className="flex items-center gap-4 p-6 bg-white border border-stone-200 rounded-3xl hover:border-primary/30 hover:shadow-lg transition-all text-left"
                >
                    <div className="size-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                        <span className="material-symbols-outlined text-3xl">track_changes</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900">{t("application_tracker")}</h4>
                        <p className="text-xs text-stone-500 mt-1">{t("tracker_desc")}</p>
                    </div>
                </button>
            </div>

            {/* Voter Roll Verification */}
            <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded text-[10px] font-bold uppercase tracking-widest">New Update</span>
                            <span className="text-slate-400 text-[10px] font-medium">Electoral Roll · March 2026</span>
                        </div>
                        <h3 className="text-2xl font-display font-bold text-white mb-3">Is your name in the Voter Roll?</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            The Election Commission has released the updated electoral roll for the upcoming 2026 elections. Verify your name and serial number to ensure your right to vote.
                        </p>
                        <button 
                            onClick={() => alert("Searching Electoral Roll...")}
                            className="px-8 py-3.5 bg-primary text-white rounded-2xl font-bold text-sm hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-primary/20"
                        >
                            Verify in Voter Roll
                        </button>
                    </div>
                    <div className="relative group/search">
                        <div className="size-48 bg-white/5 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-sm group-hover/search:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined text-6xl text-primary/40 group-hover/search:text-primary transition-colors">how_to_reg</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Forms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 gap-4"
                >
                    <h3 className="font-display font-bold text-xl text-slate-900 px-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">description</span>
                        {language === 'HI' ? "डाउनलोड करने योग्य फॉर्म" : "Downloadable Forms"}
                    </h3>
                    {forms.map((form) => (
                        <motion.div 
                            key={form.id}
                            variants={itemVariants}
                            className="bg-white border border-stone-200 p-5 rounded-2xl hover:shadow-lg hover:border-primary/20 transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="size-12 rounded-xl bg-stone-50 flex items-center justify-center text-stone-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-2xl">{form.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900 mb-1">{form.title}</h4>
                                    <p className="text-sm text-stone-500 mb-4 leading-relaxed">
                                        {language === 'HI' ? form.hindi_desc : form.description}
                                    </p>
                                    <a 
                                        href={form.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline"
                                    >
                                        <span className="material-symbols-outlined text-lg">download</span>
                                        {language === 'HI' ? "पीडीएफ डाउनलोड करें" : "Download PDF"}
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Guidance Section */}
                <div className="space-y-6">
                    <h3 className="font-display font-bold text-xl text-slate-900 px-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">help_outline</span>
                        {language === 'HI' ? "त्वरित मार्गदर्शन" : "Quick Guidance"}
                    </h3>
                    
                    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-stone-100 bg-stone-50/50">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-orange-500">priority_high</span>
                                {language === 'HI' ? "मुझे कौन सा फॉर्म चाहिए?" : "Which Form Do I Need?"}
                            </h4>
                        </div>
                        <div className="p-6 space-y-4">
                            {[
                                { q: "I am turning 18", a: "Use Form 6 to register as a new voter." },
                                { q: "My name is spelled wrong", a: "Use Form 8 for any corrections." },
                                { q: "I moved to a different house", a: "Use Form 8 to update your address." },
                                { q: "Someone in my family passed away", a: "Use Form 7 for name deletion." }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-stone-50 transition-colors group">
                                    <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold mt-1 shrink-0">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-900 mb-0.5 group-hover:text-primary transition-colors">{item.q}</p>
                                        <p className="text-xs text-stone-500 leading-relaxed">{item.a}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-primary/5 border-t border-primary/10">
                            <button 
                                onClick={() => alert("Connecting to helpdesk...")}
                                className="w-full py-3 bg-white border border-primary/20 rounded-xl text-primary font-bold text-sm hover:bg-white/50 transition-all shadow-sm"
                            >
                                Get Expert Assistance
                            </button>
                        </div>
                    </div>

                    {/* Important Deadlines */}
                    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary">event_upcoming</span>
                            </div>
                            <div>
                                <h4 className="font-bold tracking-tight">Deadlines Alert</h4>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Election 2026</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                                <span className="text-xs font-medium text-slate-300">Voter Registration Closes</span>
                                <span className="text-xs font-bold text-primary">April 15, 2026</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 opacity-50">
                                <span className="text-xs font-medium text-slate-300">Correction Correction Window</span>
                                <span className="text-xs font-bold">Closed</span>
                            </div>
                        </div>
                        <p className="mt-4 text-[10px] text-slate-400 leading-relaxed italic">
                            *Please ensure all documents are valid before uploading to the official ECI portal.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
