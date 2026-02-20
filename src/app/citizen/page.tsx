import SchemesSection from "@/components/citizen/SchemesSection";
import AreaUpdatesSection from "@/components/citizen/AreaUpdatesSection";

function QuickStats() {
    return (
        <div className="grid grid-cols-2 gap-3 px-5 pt-2 pb-6 md:grid-cols-4 md:gap-6">
            <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm flex flex-col items-center justify-center text-center gap-2">
                <div className="size-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                    <span className="material-symbols-outlined">how_to_vote</span>
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-900 leading-none">142</p>
                    <p className="text-xs text-stone-500 font-medium uppercase tracking-wide mt-1">Booth No.</p>
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm flex flex-col items-center justify-center text-center gap-2">
                <div className="size-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                    <span className="material-symbols-outlined">warning</span>
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-900 leading-none">2</p>
                    <p className="text-xs text-stone-500 font-medium uppercase tracking-wide mt-1">Pending Grievances</p>
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm flex flex-col items-center justify-center text-center gap-2">
                <div className="size-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <span className="material-symbols-outlined">assignment</span>
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-900 leading-none">5</p>
                    <p className="text-xs text-stone-500 font-medium uppercase tracking-wide mt-1">Active Schemes</p>
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm flex flex-col items-center justify-center text-center gap-2">
                <div className="size-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                    <span className="material-symbols-outlined">event</span>
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-900 leading-none">12</p>
                    <p className="text-xs text-stone-500 font-medium uppercase tracking-wide mt-1">Days to Poll</p>
                </div>
            </div>
        </div>
    );
}

function WelcomeWidget() {
    return (
        <div className="px-5 pt-6 pb-2 md:hidden">
            <h1 className="font-display text-3xl font-bold text-slate-900 leading-tight">
                Good Morning,<br />
                <span className="text-primary">Rajesh</span>
            </h1>
            <p className="text-stone-500 text-sm mt-1">Here is what is happening in Varanasi North today.</p>
        </div>
    );
}

export default function CitizenHomePage() {
    return (
        <div className="min-h-full space-y-2">
            <WelcomeWidget />

            <QuickStats />

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:px-5">
                <div className="md:col-span-2">
                    <SchemesSection />
                </div>
                <div className="md:col-span-2">
                    <AreaUpdatesSection />
                </div>
            </div>
        </div>
    );
}
