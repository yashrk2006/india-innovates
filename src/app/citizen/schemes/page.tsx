"use client";

import { useState, useEffect, useRef } from "react";
import { getVoterSchemes, applyToScheme } from "@/lib/services";
import { getSchemes } from "@/lib/services/schemes";
import type { VoterSchemeStatus, Scheme } from "@/lib/types";

const filters = ["All", "eligible", "enrolled", "applied"];

const statusConfig: Record<string, { bg: string; text: string; border: string; icon: string; label: string }> = {
    enrolled: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: "check_circle", label: "Enrolled" },
    eligible: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: "star", label: "Eligible" },
    applied: { bg: "bg-stone-100", text: "text-stone-600", border: "border-stone-200", icon: "hourglass_top", label: "Applied" },
};

export default function SchemesPage() {
    const [voterSchemes, setVoterSchemes] = useState<VoterSchemeStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [selectedScheme, setSelectedScheme] = useState<VoterSchemeStatus | null>(null);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [voterStats, allSchemes] = await Promise.all([
                    getVoterSchemes(),
                    getSchemes()
                ]);

                const statusMap = new Map(voterStats.map(vs => [vs.scheme_id, vs]));
                
                const merged: VoterSchemeStatus[] = allSchemes.map(scheme => {
                    const existing = statusMap.get(scheme.id);
                    if (existing) return existing;
                    return {
                        id: -scheme.id,
                        voter_id: 0,
                        scheme_id: scheme.id,
                        status: "eligible" as const,
                        created_at: scheme.created_at,
                        scheme: scheme,
                        outreach_sent: false
                    } as VoterSchemeStatus;
                });

                // Sort so that outreach_sent (sent by manager) schemes appear first
                const sorted = merged.sort((a, b) => {
                    if (a.outreach_sent && !b.outreach_sent) return -1;
                    if (!a.outreach_sent && b.outreach_sent) return 1;
                    return 0;
                });

                setVoterSchemes(sorted);
            } catch (error) {
                console.error("Failed to load schemes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();

        return () => {
            if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
        };
    }, []);

    const filtered = voterSchemes.filter(vs => {
        const scheme = vs.scheme;
        if (!scheme) return false;
        const matchesFilter = activeFilter === "All" || vs.status === activeFilter;
        const matchesSearch = search === "" ||
            scheme.name.toLowerCase().includes(search.toLowerCase()) ||
            (scheme.program ?? "").toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleApply = async () => {
        if (!selectedScheme?.scheme) return;
        setApplying(true);
        const success = await applyToScheme(selectedScheme.scheme.id);
        setApplying(false);
        if (success) {
            setApplied(true);
            setVoterSchemes(prev => prev.map(vs =>
                vs.scheme_id === selectedScheme.scheme_id ? { ...vs, status: "applied" } : vs
            ));
            if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
            successTimeoutRef.current = setTimeout(() => { setSelectedScheme(null); setApplied(false); }, 2000);
        }
    };

    return (
        <div className="p-5 md:p-0 space-y-6" suppressHydrationWarning>
            {/* Search & Filter */}
            <div className="space-y-4" suppressHydrationWarning>
                <div className="relative" suppressHydrationWarning>
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">search</span>
                    <input
                        type="text" placeholder="Search schemes..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" suppressHydrationWarning>
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeFilter === f
                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
                        >
                            {f === "All" ? "All" : statusConfig[f]?.label || f}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-stone-500">{filtered.length} scheme{filtered.length !== 1 ? "s" : ""} found</p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-16">
                    <div className="size-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
            )}

            {/* Schemes Grid */}
            {!loading && (
                <div className="grid gap-4 md:grid-cols-2">
                    {filtered.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-stone-400">
                            <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
                            <p className="text-sm">No schemes match your filters</p>
                        </div>
                    ) : (
                        filtered.map((vs, i) => {
                            const scheme = vs.scheme!;
                            const config = statusConfig[vs.status] || statusConfig.eligible;
                            return (
                                <div
                                    key={vs.id}
                                    onClick={() => { setSelectedScheme(vs); setApplied(false); }}
                                    className={`bg-white rounded-xl border p-5 shadow-sm hover:shadow-md
                                        transition-all cursor-pointer hover:-translate-y-0.5 animate-fade-up stagger-${(i % 4) + 1} ${
                                            vs.outreach_sent ? "border-primary/30 ring-1 ring-primary/10" : "border-stone-100"
                                        }`}
                                >
                                    {vs.outreach_sent && (
                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-primary uppercase tracking-widest mb-3 bg-primary/5 w-fit px-2 py-0.5 rounded-full">
                                            <span className="material-symbols-outlined text-[12px]">campaign</span>
                                            Recommended for You
                                        </div>
                                    )}
                                    <div className="flex items-start gap-4">
                                        <div className={`size-12 shrink-0 rounded-xl ${config.bg} ${config.text} flex items-center justify-center`}>
                                            <span className="material-symbols-outlined">{scheme.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h3 className="font-bold text-slate-900 text-sm">{scheme.name}</h3>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${config.bg} ${config.text} ${config.border}`}>
                                                    <span className="material-symbols-outlined text-[12px]">{config.icon}</span>
                                                    {config.label}
                                                </span>
                                            </div>
                                            <p className="text-xs text-stone-500 mb-2">{scheme.program}</p>
                                            <p className="text-sm text-stone-600 line-clamp-2">{scheme.description}</p>
                                            {scheme.benefit_amount && (
                                                <div className="mt-3 flex items-center gap-2 text-xs">
                                                    <span className="material-symbols-outlined text-primary text-sm">payments</span>
                                                    <span className="font-bold text-primary">{scheme.benefit_amount}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Detail Modal */}
            {selectedScheme && selectedScheme.scheme && (
                <>
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setSelectedScheme(null)} />
                    <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-white rounded-2xl shadow-2xl z-50 overflow-hidden animate-pop">
                        <div className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className={`size-14 shrink-0 rounded-xl ${statusConfig[selectedScheme.status]?.bg} ${statusConfig[selectedScheme.status]?.text} flex items-center justify-center`}>
                                    <span className="material-symbols-outlined text-2xl">{selectedScheme.scheme.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-display font-bold text-lg text-slate-900">{selectedScheme.scheme.name}</h3>
                                    <p className="text-sm text-stone-500">{selectedScheme.scheme.program}</p>
                                </div>
                                <button onClick={() => setSelectedScheme(null)} className="text-stone-400 hover:text-slate-600">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <p className="text-sm text-stone-600 mb-4">{selectedScheme.scheme.description}</p>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-stone-50 rounded-lg p-3">
                                    <p className="text-xs text-stone-500 mb-1">Benefit</p>
                                    <p className="font-bold text-sm text-slate-900">{selectedScheme.scheme.benefit_amount || "—"}</p>
                                </div>
                                <div className="bg-stone-50 rounded-lg p-3">
                                    <p className="text-xs text-stone-500 mb-1">Eligibility</p>
                                    <p className="font-bold text-sm text-slate-900">{selectedScheme.scheme.eligibility_criteria ? JSON.stringify(selectedScheme.scheme.eligibility_criteria) : "Check official portal"}</p>
                                </div>
                            </div>

                            {applied ? (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                                    <span className="material-symbols-outlined text-green-600 text-3xl mb-1 block">task_alt</span>
                                    <p className="font-bold text-green-700 text-sm">Application Submitted!</p>
                                </div>
                            ) : selectedScheme.status === "eligible" ? (
                                <button
                                    onClick={handleApply}
                                    disabled={applying}
                                    className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {applying ? (
                                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">send</span>
                                            Apply Now
                                        </>
                                    )}
                                </button>
                            ) : (
                                <div className={`text-center py-3 rounded-xl font-bold text-sm ${statusConfig[selectedScheme.status]?.bg} ${statusConfig[selectedScheme.status]?.text}`}>
                                    {selectedScheme.status === "enrolled" ? "✓ Already Enrolled" : "Application Under Review"}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
