import Link from "next/link";

export default function VoterCard() {
    return (
        <div className="px-5 pt-6 pb-2">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-soft bg-gradient-to-br from-primary to-primary-dark text-white p-6">
                {/* Decorative patterns */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black opacity-10 rounded-full -ml-8 -mb-8 blur-xl"></div>

                <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-semibold tracking-wide mb-3">
                                <span className="material-symbols-outlined text-[14px]">verified</span>
                                VERIFIED VOTER
                            </div>
                            <h2 className="font-display text-3xl font-bold leading-tight mb-1">Namaste,<br />Rajesh Kumar</h2>
                            <p className="text-emerald-100 text-sm opacity-90">EPIC No: UP/65/291/001234</p>
                        </div>
                        <div className="size-16 rounded-full border-2 border-white/30 overflow-hidden bg-emerald-800 shadow-inner relative">
                            {/* Using standard img for now as remote pattern needs config or Next Image with correct internal path */}
                            <img
                                alt="Portrait of an Indian man smiling"
                                className="w-full h-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3J1WeCCl8xIB9H2eEmeXu8IwTeUxUNNB5daxtbY_3gXgPzpgNnAM_1QdqDuMke1ok64ZC_wTbkN7bQZuvreUOsdEEXOJbXl28S2jnf3Br105ATD--gdMOks8CHgln8Zhn0dxdjhksglLhJWAn4GEJs8CGMiWKihlTwoBARAIR9lc17pZDGvxo1_KoMo0cswWqyErlO_GUrgvXpSeHa9fqXICXyjhLSWBr9ryoWgbBlwe9Cr77RH7HPqCFT2Ol9IjgOg3-c7E_fw"
                            />
                        </div>
                    </div>

                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <div className="flex items-start gap-3">
                            <div className="bg-white/10 rounded-lg p-2 shrink-0 text-white">
                                <span className="material-symbols-outlined">how_to_vote</span>
                            </div>
                            <div>
                                <p className="text-xs text-emerald-100 uppercase tracking-wider mb-0.5">Your Polling Booth</p>
                                <p className="font-bold text-lg leading-tight">Booth No. 142</p>
                                <p className="text-sm text-emerald-50 mt-1">Panchayat Bhawan, Shivpur, Varanasi</p>
                            </div>
                            <button
                                onClick={() => alert("Redirecting to Booth Details map...")}
                                className="ml-auto self-center bg-white text-primary hover:bg-emerald-50 rounded-lg p-2 transition-colors"
                            >
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
