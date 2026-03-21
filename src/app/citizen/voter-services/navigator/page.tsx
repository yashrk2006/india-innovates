"use client";

import { useState } from "react";
import { useLanguage } from "@/components/citizen/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

const boothInfo = {
    name: "Primary School North Wing",
    address: "Ward No. 4, Varanasi North, Uttar Pradesh",
    boothNo: "142",
    distance: "1.2 km",
    walkingTime: "15 mins",
    officer: "Sanjay Kumar",
    officerPhone: "+91 98765 43210",
    queueStatus: "Low", // Low, Medium, High
    lastUpdated: "10 mins ago"
};

export default function PollingStationNavigator() {
    const { language, t } = useLanguage();
    const [showDetails, setShowDetails] = useState(true);

    const openNavigation = () => {
        const query = encodeURIComponent(`${boothInfo.name}, ${boothInfo.address}`);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
    };

    return (
        <div className="relative h-[calc(100vh-180px)] -mt-2 -mx-4 md:-mx-8 overflow-hidden rounded-3xl border border-stone-200">
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-[#f8f9fa] bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/82.9739,25.3176,14,0/800x600?access_token=pk.eyJ1IjoiZGV2LW1hcGJveCIsImEiOiJjbDF2ZnRydmcwMnBqM2ptazZzZ2ZzZ2Z6In0.YVZfOWVvX0Z5Z2Z6WlVfOWVv')] bg-cover bg-center">
                {/* Custom Marker */}
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                >
                    <div className="relative">
                        <div className="size-12 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl animate-pulse">
                            <span className="material-symbols-outlined text-2xl">how_to_vote</span>
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-primary"></div>
                    </div>
                </motion.div>
            </div>

            {/* Floating UI Elements */}
            <div className="absolute top-6 left-6 z-20 flex flex-col gap-3">
                <button 
                    onClick={() => window.history.back()}
                    className="size-10 bg-white rounded-xl shadow-lg border border-stone-200 flex items-center justify-center text-slate-700 hover:bg-stone-50 transition-all"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
            </div>

            <div className="absolute top-6 right-6 z-20">
                <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group">
                        <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">analytics</span>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider flex items-center gap-1">
                            <span className="size-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            {t("ai_queue_est")}
                        </p>
                        <div className="flex items-baseline gap-1">
                            <p className="text-lg font-bold text-slate-900">12</p>
                            <p className="text-[10px] font-bold text-stone-500 uppercase">{t("mins")} {t("wait_time")}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Info Card */}
            <AnimatePresence>
                {showDetails && (
                    <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 300, opacity: 0 }}
                        className="absolute bottom-6 left-6 right-6 md:left-auto md:w-96 z-20"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-display font-bold text-slate-900 leading-tight">
                                            {boothInfo.name}
                                        </h3>
                                        <p className="text-xs text-stone-500 mt-1">Booth #{boothInfo.boothNo}</p>
                                    </div>
                                    <button 
                                        onClick={() => setShowDetails(false)}
                                        className="text-stone-400 hover:text-slate-600"
                                    >
                                        <span className="material-symbols-outlined">keyboard_arrow_down</span>
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-stone-400 mt-0.5">location_on</span>
                                        <p className="text-xs text-stone-600 leading-relaxed font-medium">
                                            {boothInfo.address}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 py-4 border-y border-stone-100">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-lg">directions_walk</span>
                                            <div>
                                                <p className="text-[10px] text-stone-400 font-bold uppercase">{t("distance")}</p>
                                                <p className="text-xs font-bold text-slate-900 tracking-tight">{boothInfo.distance}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-orange-500 text-lg">schedule</span>
                                            <div>
                                                <p className="text-[10px] text-stone-400 font-bold uppercase">{t("time")}</p>
                                                <p className="text-xs font-bold text-slate-900 tracking-tight">{boothInfo.walkingTime}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-stone-200 flex items-center justify-center overflow-hidden">
                                                <span className="material-symbols-outlined text-stone-400">person</span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-stone-500 font-bold">Booth Officer</p>
                                                <p className="text-xs font-bold text-slate-900">{boothInfo.officer}</p>
                                            </div>
                                        </div>
                                        <a href={`tel:${boothInfo.officerPhone}`} className="text-primary hover:text-primary/80 transition-colors">
                                            <span className="material-symbols-outlined">call</span>
                                        </a>
                                    </div>

                                    {/* AI Insights */}
                                    <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="material-symbols-outlined text-primary text-sm">tips_and_updates</span>
                                            <h5 className="text-[10px] font-bold text-primary uppercase tracking-wider">AI Insights</h5>
                                        </div>
                                        <p className="text-[11px] text-stone-600 leading-relaxed italic">
                                            "Peak rush expected between 10:00 AM - 12:30 PM. We recommend visiting before 9:00 AM for minimum wait time."
                                        </p>
                                    </div>
                                </div>

                                <button 
                                    onClick={openNavigation}
                                    className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
                                >
                                    <span className="material-symbols-outlined">near_me</span>
                                    {t("start_navigation")}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Re-open button */}
            {!showDetails && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => setShowDetails(true)}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-6 py-3 bg-white rounded-full shadow-2xl border border-stone-200 font-bold text-sm text-slate-900 flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">info</span>
                    {t("show_booth_details")}
                </motion.button>
            )}
        </div>
    );
}
