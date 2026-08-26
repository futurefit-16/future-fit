"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
    id: string;
    text: string;
    from: "user" | "bot";
    time: string;
}

const QUICK_REPLIES = [
    "Track my order",
    "Size guide",
    "Return policy",
    "Talk to support",
];

const BOT_RESPONSES: Record<string, string> = {
    "track my order": "To track your order, please share your Payment ID or registered phone number. Our team will get back to you within 24 hours at hello@wearfuturefit.com.",
    "size guide": "We offer Oversized Tees, Round Neck Tees, and Hoodies in sizes S, M, L, and XL. Try our AI Fit Finder from the menu to discover your perfect size in seconds!",
    "return policy": "We offer 7-day easy returns on all unworn items with tags intact. Email hello@wearfuturefit.com to initiate a return.",
    "talk to support": "You can reach us at hello@wearfuturefit.com or call +91 (555) 123-4567. We respond within 24 hours!",
};

function getTimestamp(): string {
    return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function getBotReply(text: string): string {
    const lower = text.toLowerCase().trim();
    for (const [key, value] of Object.entries(BOT_RESPONSES)) {
        if (lower.includes(key)) return value;
    }
    return "Thanks for reaching out! For specific queries, email us at hello@wearfuturefit.com or try one of the quick options above. We typically respond within 24 hours.";
}

export default function ChatBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: "welcome", text: "Hi! How can we help you today?", from: "bot", time: getTimestamp() },
    ]);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;
        const userMsg: Message = { id: `u-${Date.now()}`, text: text.trim(), from: "user", time: getTimestamp() };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        setTimeout(() => {
            const botMsg: Message = { id: `b-${Date.now()}`, text: getBotReply(text), from: "bot", time: getTimestamp() };
            setMessages((prev) => [...prev, botMsg]);
        }, 600);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-foreground text-background rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform"
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Chat panel */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] h-[480px] max-h-[calc(100vh-8rem)] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-border bg-card flex items-center gap-3">
                        <div className="w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center text-xs font-black">FF</div>
                        <div className="flex-1">
                            <p className="text-sm font-bold">Future Fit Support</p>
                            <p className="text-xs text-green-500">Online</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-muted rounded-full transition-colors">
                            <X size={16} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${msg.from === "user" ? "bg-foreground text-background rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"}`}>
                                    <p>{msg.text}</p>
                                    <p className={`text-[10px] mt-1 ${msg.from === "user" ? "text-background/60" : "text-muted-foreground"}`}>{msg.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick replies */}
                    <div className="px-4 py-2 border-t border-border flex gap-2 overflow-x-auto no-scrollbar">
                        {QUICK_REPLIES.map((reply) => (
                            <button key={reply} onClick={() => sendMessage(reply)}
                                className="shrink-0 px-3 py-1.5 text-xs border border-border rounded-full hover:bg-secondary transition-colors whitespace-nowrap">
                                {reply}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-border flex gap-2">
                        <input
                            type="text" value={input} onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 p-2 bg-secondary rounded-lg text-sm outline-none focus:ring-2 focus:ring-foreground"
                        />
                        <button type="submit" disabled={!input.trim()}
                            className="p-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity disabled:opacity-30">
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
