"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./LanguageContext";

export default function ESarthiBot() {
    const [isOpen, setIsOpen] = useState(false);
    const { t, language } = useLanguage();
    const [messages, setMessages] = useState<any[]>([]);
    const [hasInitialized, setHasInitialized] = useState(false);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isProcessingVoice, setIsProcessingVoice] = useState(false);
    const API_BASE_URL = ""; // Use relative paths for local Next.js API routes
    
    // MediaRecorder refs
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const getInitialMessage = () => {
        if (language === 'HI') return "नमस्ते! मैं ई-सारथी हूँ। मैं आपकी कैसे मदद कर सकता हूँ?";
        if (language === 'UR') return "ہیلو! میں ای-سارتھی ہوں۔ میں آپ کی کیسے مدد کر सकता हूं؟";
        return "Namaste! I am E-Sarthi. How can I help you today?";
    };

    useEffect(() => {
        if (!hasInitialized) {
            setMessages([{ role: "bot", content: getInitialMessage() }]);
            setHasInitialized(true);
        }
    }, [language, hasInitialized]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                await sendAudioToBackend(audioBlob);
                stream.getTracks().forEach(track => track.stop()); // Stop microphone
            };

            mediaRecorder.start();
            setIsListening(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert(language === 'HI' ? "माइक्रोफोन एक्सेस करने में त्रुटि।" : "Error accessing microphone.");
        }
    };

    const sendAudioToBackend = async (blob: Blob) => {
        setIsProcessingVoice(true);
        try {
            const formData = new FormData();
            formData.append('audio', blob, 'recording.wav');
            
            const locales: Record<string, string> = {
                'EN': 'en-IN',
                'HI': 'hi-IN',
                'UR': 'hi-IN'
            };
            formData.append('language_code', locales[language] || 'hi-IN');

            const response = await fetch(`${API_BASE_URL}/api/ai/stt`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "STT fetch failed");

            const transcript = data.transcript || "";
            
            if (transcript) {
                setInput(prev => prev + (prev ? " " : "") + transcript);
            }
        } catch (error: any) {
            console.error("STT Error:", error);
            alert(`STT Error: ${error.message}`);
        } finally {
            setIsProcessingVoice(false);
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

            const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: apiMessages }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `Server returned ${response.status}`);
            }

            const botContent = data.choices?.[0]?.message?.content || data.content;
            
            if (!botContent) {
                 throw new Error("No response content from AI service");
            }

            setMessages([...newMessages, { role: "bot", content: botContent }]);
        } catch (error: any) {
            console.error("Chatbot error:", error);
            const errorMsg = error.message === "Failed to fetch" 
                ? "Network error: Connection failed or timed out." 
                : `Error: ${error.message}`;
                
            setMessages([...newMessages, { 
                role: "bot", 
                content: language === 'HI' ? `त्रुटि: ${errorMsg}` : `Chat Error: ${errorMsg}` 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end" suppressHydrationWarning>
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
                            {(isLoading || isProcessingVoice) && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-stone-100 shadow-sm flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <div className="size-1.5 bg-stone-300 rounded-full animate-bounce"></div>
                                            <div className="size-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                            <div className="size-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                        </div>
                                        {isProcessingVoice && <span className="text-[10px] text-stone-400 italic">Transcribing...</span>}
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
                                        disabled={isProcessingVoice}
                                        className={`absolute right-2 top-1/2 -translate-y-1/2 size-7 rounded-lg flex items-center justify-center transition-all ${
                                            isListening 
                                            ? 'bg-red-100 text-red-600 animate-pulse scale-110 shadow-sm shadow-red-200' 
                                            : isProcessingVoice ? 'text-stone-300' : 'text-stone-400 hover:text-primary hover:bg-stone-200/50'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">{isListening ? 'mic' : 'mic_none'}</span>
                                    </button>
                                </div>
                                <button 
                                    onClick={handleSend}
                                    disabled={isLoading || isProcessingVoice}
                                    className={`${(isLoading || isProcessingVoice) ? 'bg-stone-400' : 'bg-primary'} text-white size-10 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20`}
                                >
                                    <span className="material-symbols-outlined">{(isLoading || isProcessingVoice) ? 'hourglass_empty' : 'send'}</span>
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
