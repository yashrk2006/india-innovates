
export default function SchemesSection() {
    return (
        <div className="pt-8 pb-4">
            <div className="px-5 flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-bold text-slate-800">My Schemes</h3>
                <button className="text-primary text-sm font-bold hover:underline">View All</button>
            </div>
            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto gap-4 px-5 pb-4 no-scrollbar snap-x snap-mandatory">
                {/* Scheme Card 1 */}
                <div className="snap-center shrink-0 w-[280px] bg-white rounded-xl p-4 shadow-card border border-stone-100 flex flex-col justify-between h-[180px]">
                    <div>
                        <div className="flex justify-between items-start mb-3">
                            <div className="bg-green-100 text-primary p-2 rounded-lg">
                                <span className="material-symbols-outlined">agriculture</span>
                            </div>
                            <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wide rounded-md border border-green-200">
                                Enrolled
                            </span>
                        </div>
                        <h4 className="font-bold text-lg text-slate-800 leading-tight mb-1">PM Kisan Samman Nidhi</h4>
                        <p className="text-sm text-stone-500 line-clamp-2">Financial benefit of ₹6,000 per year for landholding farmers.</p>
                    </div>
                    <div className="pt-3 mt-auto border-t border-stone-100 flex justify-between items-center">
                        <span className="text-xs font-semibold text-stone-400">Next Installment: Oct 2023</span>
                        <span className="material-symbols-outlined text-stone-400 text-sm">chevron_right</span>
                    </div>
                </div>

                {/* Scheme Card 2 */}
                <div className="snap-center shrink-0 w-[280px] bg-white rounded-xl p-4 shadow-card border border-stone-100 flex flex-col justify-between h-[180px]">
                    <div>
                        <div className="flex justify-between items-start mb-3">
                            <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                                <span className="material-symbols-outlined">health_and_safety</span>
                            </div>
                            <span className="px-2 py-1 bg-orange-50 text-orange-700 text-[10px] font-bold uppercase tracking-wide rounded-md border border-orange-200">
                                Eligible
                            </span>
                        </div>
                        <h4 className="font-bold text-lg text-slate-800 leading-tight mb-1">Ayushman Bharat</h4>
                        <p className="text-sm text-stone-500 line-clamp-2">Health cover of ₹5 Lakh per family per year for secondary care.</p>
                    </div>
                    <div className="pt-3 mt-auto border-t border-stone-100 flex justify-between items-center">
                        <button className="text-xs font-bold text-primary uppercase tracking-wide">Apply Now</button>
                        <span className="material-symbols-outlined text-primary text-sm">arrow_forward</span>
                    </div>
                </div>

                {/* Scheme Card 3 */}
                <div className="snap-center shrink-0 w-[280px] bg-white rounded-xl p-4 shadow-card border border-stone-100 flex flex-col justify-between h-[180px]">
                    <div>
                        <div className="flex justify-between items-start mb-3">
                            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                <span className="material-symbols-outlined">home_work</span>
                            </div>
                            <span className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold uppercase tracking-wide rounded-md border border-stone-200">
                                Applied
                            </span>
                        </div>
                        <h4 className="font-bold text-lg text-slate-800 leading-tight mb-1">PM Awas Yojana</h4>
                        <p className="text-sm text-stone-500 line-clamp-2">Housing for all in urban areas with interest subsidy.</p>
                    </div>
                    <div className="pt-3 mt-auto border-t border-stone-100 flex justify-between items-center">
                        <span className="text-xs font-semibold text-stone-400">Status: Under Review</span>
                        <span className="material-symbols-outlined text-stone-400 text-sm">chevron_right</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
