"use client";

import React from "react";

interface VoterCardProps {
    voter?: any;
    loading?: boolean;
}

export default function VoterCard({ voter, loading }: VoterCardProps) {
    if (loading) {
        return (
            <div className="w-full max-w-md bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl animate-pulse aspect-[1.586/1]">
                <div className="h-full flex flex-col justify-between opacity-50">
                    <div className="flex justify-between items-start">
                        <div className="size-12 bg-white/20 rounded-full" />
                        <div className="h-8 w-24 bg-white/20 rounded" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-white/20 rounded" />
                        <div className="h-6 w-48 bg-white/20 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    const name = voter?.eci?.name || voter?.name || "Citizen";
    const epic = voter?.eci?.epic_no || "UP/65/291/000000";
    const booth = voter?.eci?.booth_name || "Booth 142, Varanasi";
    const part = voter?.eci?.part_no || "142";

    return (
        <div className="w-full max-w-md bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 aspect-[1.586/1] border border-orange-400/30">
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
            
            {/* Ashok Chakra Watermark */}
            <div className="absolute -right-10 -bottom-10 size-48 opacity-10 rotate-12 flex items-center justify-center">
                <span className="material-symbols-outlined text-[180px]">brightness_7</span>
            </div>

            <div className="relative h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="size-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                            <span className="material-symbols-outlined text-2xl">how_to_vote</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-100">Election Commission</p>
                            <p className="text-xs font-medium opacity-80">Identity Card</p>
                        </div>
                    </div>
                    <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg border border-white/30">
                        <p className="font-mono font-bold text-sm tracking-widest">{epic}</p>
                    </div>
                </div>

                <div className="flex gap-6 items-end">
                    <div className="flex-1">
                        <div className="mb-4">
                            <p className="text-[10px] uppercase tracking-wider text-orange-200 font-bold mb-1">Voter Name</p>
                            <h3 className="text-xl font-bold truncate">{name}</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-orange-200 font-bold mb-0.5">Part No.</p>
                                <p className="font-bold text-sm">{part}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-orange-200 font-bold mb-0.5">Polling Booth</p>
                                <p className="font-bold text-sm truncate">{booth}</p>
                            </div>
                        </div>
                    </div>
                    <div className="size-20 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-2 shrink-0">
                        <div className="w-full h-full bg-orange-100/20 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl opacity-40">qr_code_2</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
