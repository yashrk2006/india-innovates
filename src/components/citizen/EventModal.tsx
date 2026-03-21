"use client";
import { motion, AnimatePresence } from "framer-motion";

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: {
        title: string;
        date: string;
        location: string;
        description: string;
        officialLink: string;
        icon: string;
    } | null;
}

export default function EventModal({ isOpen, onClose, event }: EventModalProps) {
    if (!event) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-40px)] max-w-lg bg-white rounded-3xl shadow-2xl z-[61] overflow-hidden"
                    >
                        <div className="relative h-32 bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                            <div className="size-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                                <span className="material-symbols-outlined text-4xl">{event.icon}</span>
                            </div>
                            <button 
                                onClick={onClose}
                                className="absolute top-4 right-4 size-8 rounded-full bg-black/10 hover:bg-black/20 text-white flex items-center justify-center transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-wider">Upcoming Event</span>
                                <span className="text-stone-400 text-[10px]">•</span>
                                <span className="text-stone-500 text-[10px] font-bold uppercase tracking-wider">{event.date}</span>
                            </div>
                            
                            <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">{event.title}</h2>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-3">
                                    <div className="size-8 rounded-lg bg-stone-50 flex items-center justify-center shrink-0 border border-stone-100">
                                        <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Location</p>
                                        <p className="text-sm font-medium text-slate-700">{event.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="size-8 rounded-lg bg-stone-50 flex items-center justify-center shrink-0 border border-stone-100">
                                        <span className="material-symbols-outlined text-primary text-lg">info</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">About this event</p>
                                        <p className="text-sm text-stone-600 leading-relaxed">{event.description}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <a 
                                    href={event.officialLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-4 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
                                >
                                    Visit Official Government Site
                                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                                </a>
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-stone-50 text-stone-600 font-bold rounded-2xl hover:bg-stone-100 transition-colors"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>

                        {/* Aesthetic Footer */}
                        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="size-5 rounded bg-primary/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-[10px] font-bold">verified</span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Government Verified Event</span>
                            </div>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" className="h-6 opacity-20 grayscale" alt="India Emblem" />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
