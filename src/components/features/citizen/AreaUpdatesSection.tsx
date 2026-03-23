"use client";

import { useState, useRef, useEffect } from "react";

export default function AreaUpdatesSection() {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const width = rect.width;
        const percentage = Math.max(0, Math.min(100, (x / width) * 100));
        setSliderPosition(percentage);
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) handleMove(e.clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        handleMove(e.touches[0].clientX);
    };

    // Global mouse up to catch dragging outside
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mouseup', handleMouseUp);
            return () => window.removeEventListener('mouseup', handleMouseUp);
        }
    }, [isDragging]);

    return (
        <div className="px-5 pb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-bold text-slate-800">My Area Updates</h3>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-card border border-stone-100 mb-5">
                <div
                    ref={containerRef}
                    className="relative h-48 w-full group cursor-ew-resize select-none touch-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onTouchMove={handleTouchMove}
                // For accessibility/keyboard, one would add key handlers here, keeping it simple for now
                >
                    {/* Before Image (Base) */}
                    <div className="absolute inset-0 w-full h-full bg-stone-200">
                        <img
                            alt="Dirt road with construction materials"
                            className="w-full h-full object-cover grayscale opacity-80"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBykN2CG3qzqol_NcVC9F3OBVfX_SptEtxEAWnjXM5boIMX7sSONwyC09E0cRO_aHvL-UtZGGtt3SNUyL9z5zq_afksbavh5FvcezkQuxoRGB3b3VY9-Hdi6MU4F0dc3Jg4AuG667PGlkMsp7rIRTrp1qmsO-XTA3S8w2E_fcSvGDYOrA2rZXKO_XWpp-gen3CE8yHATpUw3fjhP3CaE9Inn2YATEswEk608IN_fIoWMqUqBANOAYUjp-bQvMEraZqct8tyg0mEOA"
                        />
                        <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">BEFORE</div>
                    </div>

                    {/* After Image (Clipped) */}
                    <div
                        className="absolute inset-0 h-full overflow-hidden border-r-2 border-white shadow-xl z-10"
                        style={{ width: `${sliderPosition}%` }}
                    >
                        {/* We use a fixed width image inside to prevent squeezing */}
                        <img
                            alt="New paved concrete road after construction"
                            className="absolute top-0 left-0 max-w-none h-full object-cover"
                            style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100%' }} // Dynamic width matching container
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK7PeQoAetlsqthOVqcolcqjvH1Cy4-daGxOd2Ufqpy5J32ToJYnGXjvicJPLxOd-8nfJqRNeG2s1AoKGj3GhenOiIb5QWvMAb5op6cHy5aW8TgdxikgR0QrE-S5873OMfThqxlQcXvomBz29hI8DCEr1X2PmhHZhRCvhgMU8ps070cC6mmavW22TNWTdxMvmDPTGPp1yLhm0K9SCZixkNmKsjiIb68A_7J5OiV8TXIEyeWG7WTphseJ9no1Yq7uFJUXHIwE3_Hg"
                        />
                        <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">AFTER</div>
                    </div>

                    {/* Slider Handle */}
                    <div
                        className="absolute inset-y-0 w-8 -ml-4 flex items-center justify-center z-20 pointer-events-none"
                        style={{ left: `${sliderPosition}%` }}
                    >
                        <div className="size-8 bg-white rounded-full shadow-lg flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-sm">code</span>
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-600 uppercase">Infrastructure</span>
                        <span className="text-[10px] text-stone-400 font-medium">• 2 days ago</span>
                    </div>
                    <h4 className="font-bold text-lg text-slate-900 leading-snug mb-1">New Concrete Road Paving</h4>
                    <p className="text-sm text-stone-600 mb-3">Completed paving of the 2km stretch in Ward 4, connecting the main market to the residential colony.</p>
                    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                        <div className="flex -space-x-2">
                            <div className="size-6 rounded-full border border-white bg-stone-200"></div>
                            <div className="size-6 rounded-full border border-white bg-stone-300"></div>
                            <div className="size-6 rounded-full border border-white bg-stone-400 flex items-center justify-center text-[8px] font-bold text-white">+12</div>
                        </div>
                        <div className="flex items-center gap-1 text-stone-500">
                            <span className="material-symbols-outlined text-base">thumb_up</span>
                            <span className="text-xs font-semibold">45 Likes</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Another update card (simpler) */}
            <div className="bg-white rounded-xl overflow-hidden shadow-card border border-stone-100 flex items-start gap-4 p-4">
                <div className="size-16 rounded-lg bg-blue-50 text-blue-600 shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">water_drop</span>
                </div>
                <div>
                    <h4 className="font-bold text-base text-slate-900 leading-snug">Clean Water Initiative</h4>
                    <p className="text-sm text-stone-600 mt-1 line-clamp-2">New water purification plant installation begins next Monday near the community hall.</p>
                </div>
            </div>
        </div>
    );
}
