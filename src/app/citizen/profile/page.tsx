"use client";

import VoterCard from "@/components/citizen/VoterCard";

function UserStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100">
                <h3 className="font-bold text-lg text-slate-900 mb-4">Participation Score</h3>
                <div className="flex items-center gap-4">
                    <div className="size-20 rounded-full border-4 border-primary/20 flex items-center justify-center text-2xl font-bold text-primary relative">
                        85
                        <svg className="absolute inset-0 size-full -rotate-90">
                            <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-primary" strokeDasharray="200" strokeDashoffset="30" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm text-stone-500">You are in the top</p>
                        <p className="text-xl font-bold text-slate-900">15% of Voters</p>
                        <p className="text-xs text-green-600 font-medium mt-1">+5 pts this week</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100">
                <h3 className="font-bold text-lg text-slate-900 mb-4">Badges Earned</h3>
                <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="size-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center border border-yellow-200">
                            <span className="material-symbols-outlined">verified</span>
                        </div>
                        <span className="text-xs font-medium text-stone-600">Verified</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="size-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200">
                            <span className="material-symbols-outlined">campaign</span>
                        </div>
                        <span className="text-xs font-medium text-stone-600">Voice</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 grayscale opacity-50">
                        <div className="size-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center border border-stone-200">
                            <span className="material-symbols-outlined">groups</span>
                        </div>
                        <span className="text-xs font-medium text-stone-600">Leader</span>
                    </div>
                </div>
            </div>
        </div>
    );
}


import { useRouter } from "next/navigation";

// ... existing code ...

export default function ProfilePage() {
    const router = useRouter();

    const handleLogout = () => {
        document.cookie = "citizen_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        router.push("/auth?role=citizen");
    };

    return (
        <div className="space-y-6 md:p-5">
            <div className="px-5 md:px-0 pt-6 md:pt-0">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 leading-tight">My Identity</h1>
                <p className="text-stone-500 text-sm mt-1">Manage your voter profile and digital verification.</p>
            </div>

            {/* Voter Card Section */}
            <div className="md:max-w-xl">
                <VoterCard />
            </div>

            {/* Stats Section */}
            <div className="px-5 md:px-0 pb-8 space-y-6">
                <UserStats />

                <button onClick={handleLogout} className="w-full py-4 text-red-600 font-bold bg-white border border-red-100 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <span className="material-symbols-outlined">logout</span>
                    Sign Out
                </button>
            </div>
        </div>
    );
}
