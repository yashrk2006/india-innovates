"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./LanguageContext";

export default function ESarthiBot() {
    const [isOpen, setIsOpen] = useState(false);
    const { t, language } = useLanguage();
    const [messages, setMessages] = useState([
        { role: "bot", content: language === 'HI' ? "नमस्ते! मैं ई-सारथी हूँ। मैं आपकी कैसे मदद कर सकता हूँ?" : "Namaste! I am E-Sarthi. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        
        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");

        // Simulated AI Response
        setTimeout(() => {
            let response = "";
            const lowerInput = input.toLowerCase();
            
            if (lowerInput.includes("voter") || lowerInput.includes("pancard") || lowerInput.includes("card")) {
                response = language === 'HI' ? "आप 'मतदाता सेवा' अनुभाग में अपना डिजिटल आईडी देख सकते हैं।" : "You can check your Digital ID in the 'Voter Services' section.";
            } else if (lowerInput.includes("booth") || lowerInput.includes("polling")) {
                response = language === 'HI' ? "पोलिंग स्टेशन नेविगेटर आपको आपके बूथ तक ले जाएगा।" : "The Polling Station Navigator will guide you to your booth.";
            } else {
                response = language === 'HI' ? "मैं समझ गया। क्या आप निर्वाचन संबंधी किसी और जानकारी में रुचि रखते हैं?" : "I understand. Are you interested in any other election-related information?";
            }

            setMessages([...newMessages, { role: "bot", content: response }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-24 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute bottom-20 right-0 w-80 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined">smart_toy</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">E-Sarthi AI</h4>
                                    <div className="flex items-center gap-1">
                                        <div className="size-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-[10px] text-white/70 font-medium">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-lg">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                        msg.role === 'user' 
                                        ? 'bg-primary text-white rounded-tr-none' 
                                        : 'bg-white text-slate-700 shadow-sm border border-stone-100 rounded-tl-none'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-stone-100 bg-white">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={language === 'HI' ? "संदेश टाइप करें..." : "Type a message..."}
                                    className="flex-1 bg-stone-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                                />
                                <button 
                                    onClick={handleSend}
                                    className="bg-primary text-white size-10 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined">send</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`size-16 rounded-full flex items-center justify-center shadow-2xl transition-colors ${
                    isOpen ? 'bg-slate-900 text-white' : 'bg-primary text-white'
                }`}
            >
                <span className="material-symbols-outlined text-3xl">
                    {isOpen ? 'close' : 'chat_bubble'}
                </span>
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500"></span>
                    </span>
                )}
            </motion.button>
        </div>
    );
}
