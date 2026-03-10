/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect } from "react";
import { getInfrastructureProjects, toggleLikeProject } from "@/lib/services";
import type { InfrastructureProject } from "@/lib/types";

function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const updatePosition = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const pos = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
        setSliderPosition(pos);
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseMove = (e: React.MouseEvent) => { if (isDragging) updatePosition(e.clientX); };
    const handleTouchMove = (e: React.TouchEvent) => updatePosition(e.touches[0].clientX);

    useEffect(() => {
        const stop = () => setIsDragging(false);
        window.addEventListener("mouseup", stop);
        window.addEventListener("mousemove", (e) => { if (isDragging) updatePosition(e.clientX); });
        return () => window.removeEventListener("mouseup", stop);
    }, [isDragging]);

    return (
        <div
            ref={containerRef}
            className="relative h-52 md:h-64 w-full group cursor-ew-resize select-none touch-none rounded-t-xl overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
        >
            <div className="absolute inset-0 w-full h-full bg-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="Before" className="w-full h-full object-cover grayscale opacity-80" src={before} />
                <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">BEFORE</div>
            </div>

            <div className="absolute inset-0 h-full overflow-hidden border-r-2 border-white shadow-xl z-10" style={{ width: `${sliderPosition}%` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    alt="After"
                    className="absolute top-0 left-0 max-w-none h-full object-cover"
                    style={{ width: containerRef.current ? containerRef.current.offsetWidth : "100%" }}
                    src={after}
                />
                <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">AFTER</div>
            </div>

            {/* Handle */}
            <div className="absolute top-0 bottom-0 z-20 flex items-center justify-center" style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}>
                <div className="size-10 rounded-full bg-white shadow-xl border-2 border-stone-200 flex items-center justify-center">
                    <span className="material-symbols-outlined text-stone-500 text-lg">drag_indicator</span>
                </div>
            </div>
        </div>
    );
}

export default function AreaUpdatesPage() {
    const [updates, setUpdates] = useState<InfrastructureProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [likedIds, setLikedIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        getInfrastructureProjects().then(data => {
            setUpdates(data);
            setLoading(false);
        });
    }, []);

    const categories = ["All", ...Array.from(new Set(updates.map(u => u.type ?? "Other")))];
    const filtered = filter === "All" ? updates : updates.filter(u => (u.type ?? "Other") === filter);

    const handleLike = async (update: InfrastructureProject) => {
        const isLiked = likedIds.has(update.id);
        const newCount = await toggleLikeProject(update.id, update.likes_count, isLiked);
        setUpdates(prev => prev.map(u => u.id === update.id ? { ...u, likes_count: newCount } : u));
        setLikedIds(prev => {
            const next = new Set(prev);
            isLiked ? next.delete(update.id) : next.add(update.id);
            return next;
        });
    };

    const formatDate = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const days = Math.floor(diff / 86400000);
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        return `${days} days ago`;
    };

    return (
        <div className="p-5 md:p-0 space-y-6">
            {/* Stats */}
            {!loading && (
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "Projects", value: updates.length, icon: "construction" },
                        { label: "Completed", value: updates.filter(u => u.progress === 100).length, icon: "task_alt" },
                        { label: "In Progress", value: updates.filter(u => u.progress < 100).length, icon: "pending" },
                    ].map(s => (
                        <div key={s.label} className="bg-white rounded-xl border border-stone-100 p-3 text-center shadow-sm">
                            <span className="material-symbols-outlined text-primary mb-1 block">{s.icon}</span>
                            <p className="font-bold text-xl text-slate-900">{s.value}</p>
                            <p className="text-xs text-stone-500">{s.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {categories.map(c => (
                    <button
                        key={c ?? "Other"}
                        onClick={() => setFilter(c ?? "Other")}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${filter === c
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-16">
                    <div className="size-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
            )}

            {/* Cards */}
            {!loading && (
                <div className="space-y-6">
                    {filtered.map((update, i) => (
                        <div key={update.id} className={`bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden animate-fade-up stagger-${(i % 4) + 1}`}>
                            {/* Before/After slider if images exist */}
                            {update.before_image_url && update.after_image_url && (
                                <BeforeAfterSlider before={update.before_image_url} after={update.after_image_url} />
                            )}

                            {/* No image placeholder */}
                            {(!update.before_image_url || !update.after_image_url) && (
                                <div className={`h-24 flex items-center justify-center ${update.icon_bg}`}>
                                    <span className="material-symbols-outlined text-5xl opacity-30">{update.icon}</span>
                                </div>
                            )}

                            <div className="p-5">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className={`size-10 rounded-xl shrink-0 flex items-center justify-center ${update.icon_bg}`}>
                                        <span className="material-symbols-outlined">{update.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h3 className="font-bold text-slate-900">{update.title}</h3>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">{update.type}</span>
                                        </div>
                                        <p className="text-sm text-stone-500">{formatDate(update.created_at)}</p>
                                    </div>
                                </div>

                                <p className="text-sm text-stone-600 mb-4">{update.description}</p>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs font-bold mb-1">
                                        <span className="text-stone-500">Progress</span>
                                        <span className={update.progress === 100 ? "text-green-600" : "text-primary"}>{update.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 animate-fill-bar ${update.progress === 100 ? "bg-green-500" : "bg-primary"}`}
                                            style={{ width: `${update.progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                                    <button
                                        onClick={() => handleLike(update)}
                                        className={`flex items-center gap-1.5 text-sm font-bold transition-all hover:scale-105 active:scale-95 ${likedIds.has(update.id) ? "text-red-500" : "text-stone-400 hover:text-red-400"}`}
                                    >
                                        <span className={`material-symbols-outlined ${likedIds.has(update.id) ? "icon-filled" : ""}`}>favorite</span>
                                        {update.likes_count}
                                    </button>
                                    <button
                                        onClick={() => alert("Comments section coming soon.")}
                                        className="flex items-center gap-1.5 text-sm font-bold text-stone-400 hover:text-blue-500 transition-colors"
                                    >
                                        <span className="material-symbols-outlined">chat_bubble</span>
                                        {update.comments_count}
                                    </button>
                                    <button
                                        onClick={() => alert(`Sharing link for: ${update.title}...`)}
                                        className="ml-auto flex items-center gap-1.5 text-sm font-bold text-stone-400 hover:text-primary transition-colors"
                                    >
                                        <span className="material-symbols-outlined">share</span>
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
