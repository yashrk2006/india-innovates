"use client";

export default function AreaUpdatesPage() {
    return (
        <div className="md:p-8 p-5 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 leading-tight">Area Updates</h1>
                    <p className="text-stone-500 text-sm mt-1">Development work in Ward 4, Varanasi North.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Main Highlight Card - Spans 2 cols on Desktop */}
                <div className="md:col-span-2 bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100 group">
                    <div className="h-64 md:h-80 relative overflow-hidden">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK7PeQoAetlsqthOVqcolcqjvH1Cy4-daGxOd2Ufqpy5J32ToJYnGXjvicJPLxOd-8nfJqRNeG2s1AoKGj3GhenOiIb5QWvMAb5op6cHy5aW8TgdxikgR0QrE-S5873OMfThqxlQcXvomBz29hI8DCEr1X2PmhHZhRCvhgMU8ps070cC6mmavW22TNWTdxMvmDPTGPp1yLhm0K9SCZixkNmKsjiIb68A_7J5OiV8TXIEyeWG7WTphseJ9no1Yq7uFJUXHIwE3_Hg"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            alt="New Road"
                        />
                        <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded shadow-sm">
                            COMPLETED
                        </div>
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-24 text-white">
                            <div className="flex items-center gap-2 mb-2 text-white/80 text-xs">
                                <span className="material-symbols-outlined text-sm">calendar_month</span>
                                2 days ago
                            </div>
                            <h3 className="text-2xl font-bold leading-tight mb-2">New Concrete Road Paving Completed</h3>
                            <p className="line-clamp-2 text-white/90 text-sm">The 2km stretch connecting the main market to the residential colony has been fully paved and opened for traffic.</p>
                        </div>
                    </div>
                </div>

                {/* Statistics / Summary Card */}
                <div className="bg-primary/5 rounded-xl p-6 border border-primary/10 flex flex-col justify-center gap-6">
                    <h3 className="font-bold text-lg text-slate-900">Ward 4 Snapshot</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-stone-600 text-sm font-medium">Projects Completed</span>
                            <span className="text-2xl font-bold text-primary">12</span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-primary h-full rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-stone-600 text-sm font-medium">Budget Utilized</span>
                            <span className="text-lg font-bold text-slate-900">₹4.2 Cr</span>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-stone-600 text-sm font-medium">Ongoing</span>
                            <span className="text-lg font-bold text-orange-600">3 Works</span>
                        </div>
                    </div>
                    <button className="w-full py-3 bg-white border border-stone-200 rounded-xl text-primary font-bold text-sm hover:bg-primary hover:text-white transition-colors">
                        Download Report
                    </button>
                </div>

                {/* Standard Update Card */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100 flex flex-col h-full">
                    <div className="h-48 relative bg-blue-50 flex items-center justify-center text-blue-500">
                        <span className="material-symbols-outlined text-6xl">water_drop</span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-blue-600 mb-2">Infrastructure</span>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">Clean Water Initiative</h3>
                        <p className="text-sm text-stone-600 mb-4 flex-1">New water purification plant installation begins next Monday near the community hall.</p>
                        <div className="flex items-center justify-between text-xs text-stone-400 font-medium pt-3 border-t border-stone-100">
                            <span>Starts: Feb 24</span>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100 uppercase text-[10px]">Upcoming</span>
                        </div>
                    </div>
                </div>

                {/* Standard Update Card */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100 flex flex-col h-full">
                    <div className="h-48 relative bg-amber-50 flex items-center justify-center text-amber-500">
                        <span className="material-symbols-outlined text-6xl">lightbulb</span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-amber-600 mb-2">Maintenance</span>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">Street Light Repair</h3>
                        <p className="text-sm text-stone-600 mb-4 flex-1">Scheduled maintenance for street lights in Sector 7 and 8.</p>
                        <div className="flex items-center justify-between text-xs text-stone-400 font-medium pt-3 border-t border-stone-100">
                            <span>Starts: Tomorrow</span>
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-100 uppercase text-[10px]">Scheduled</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
