"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./LanguageContext";

export default function ESarthiBot() {
    const [isOpen, setIsOpen] = useState(false);
    const { t, language } = useLanguage();
    const [messages, setMessages] = useState([
        { role: "bot", content: language === 'HI' ? "नमस्ते! मैं ई-सारथी हूँ। मैं आपकी कैसे मदद कर सकता हूँ?" : language === 'UR' ? "ہیلو! میں ای-سارتھی ہوں۔ میں آپ کی کیسے مدد کر سکتا ہوں؟" : "Namaste! I am E-Sarthi. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(prev => prev + (prev ? " " : "") + transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert(language === 'HI' ? "आपका ब्राउज़र स्पीच रिकग्निशन को सपोर्ट नहीं करता है।" : "Your browser does not support speech recognition.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            // Map LanguageContext codes to BCP 47 locales
            const locales: Record<string, string> = {
                'EN': 'en-IN',
                'HI': 'hi-IN',
                'UR': 'ur-IN'
            };
            recognitionRef.current.lang = locales[language] || 'en-IN';
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        
        const userMessage = { role: "user", content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            // Prepare messages for Sarvam AI (mapping 'bot' to 'assistant')
            const apiMessages = [
                { 
                    role: "system", 
                    content: `You are E-Sarthi, a helpful AI assistant for the India Innovates 2026 Booth Management System. Your goal is to help citizens with voter services, polling station locations, and election information. Be polite and professional. Respond in the user's language (${language === 'HI' ? 'Hindi' : language === 'UR' ? 'Urdu' : 'English'}).`
                },
                ...newMessages.map(m => ({
                    role: m.role === "bot" ? "assistant" : "user",
                    content: m.content
                }))
            ];

            const response = await fetch("http://localhost:5000/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: apiMessages }),
            });

            if (!response.ok) throw new Error("Failed to get AI response");

            const data = await response.json();
            const botContent = data.choices?.[0]?.message?.content || 
                             data.content || 
                             (language === 'HI' ? "क्षमा करें, मैं अभी जवाब नहीं दे सकता।" : language === 'UR' ? "معذرت، میں ابھی جواب نہیں دے سکتا۔" : "Sorry, I cannot respond right now.");

            setMessages([...newMessages, { role: "bot", content: botContent }]);
        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages([...newMessages, { 
                role: "bot", 
                content: language === 'HI' ? "नेटवर्क त्रुटि। कृपया बाद में प्रयास करें।" : language === 'UR' ? "نیٹ ورک کی خرابی۔ براہ کرم بعد میں دوبارہ کوشش کریں۔" : "Network error. Please try again later." 
            }]);
        } finally {
            setIsLoading(false);
        }
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
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-stone-100 shadow-sm flex gap-1">
                                        <div className="size-1.5 bg-stone-300 rounded-full animate-bounce"></div>
                                        <div className="size-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="size-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-stone-100 bg-white">
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <input 
                                        type="text" 
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder={language === 'HI' ? "संदेश टाइप करें..." : language === 'UR' ? "پیغام لکھیں..." : "Type a message..."}
                                        className="w-full bg-stone-100 border-none rounded-xl pl-4 pr-10 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                                    />
                                    <button 
                                        onClick={toggleListening}
                                        className={`absolute right-2 top-1/2 -translate-y-1/2 size-7 rounded-lg flex items-center justify-center transition-all ${
                                            isListening 
                                            ? 'bg-red-100 text-red-600 animate-pulse scale-110 shadow-sm shadow-red-200' 
                                            : 'text-stone-400 hover:text-primary hover:bg-stone-200/50'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">{isListening ? 'mic' : 'mic_none'}</span>
                                    </button>
                                </div>
                                <button 
                                    onClick={handleSend}
                                    disabled={isLoading}
                                    className={`${isLoading ? 'bg-stone-400' : 'bg-primary'} text-white size-10 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20`}
                                >
                                    <span className="material-symbols-outlined">{isLoading ? 'hourglass_empty' : 'send'}</span>
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
