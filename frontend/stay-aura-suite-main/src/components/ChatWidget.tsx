import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

interface Message {
  from: "user" | "bot";
  text: string;
}

const CHATBOT_URL = "http://localhost:5050/chat";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "👋 Hi! I'm Astra, your Hotel Whitmore Stays assistant. Ask me about rooms, bookings, payments, or anything hotel-related!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages(prev => [...prev, { from: "user", text: msg }]);
    setLoading(true);
    try {
      const res = await fetch(CHATBOT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { from: "bot", text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { from: "bot", text: "Sorry, I'm having trouble connecting. Please try again shortly." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 sm:w-96 bg-card rounded-2xl shadow-elevated flex flex-col overflow-hidden border border-border"
          style={{ height: "480px" }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-accent text-accent-foreground">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-display font-semibold">Astra</p>
              <p className="text-xs opacity-80">Hotel Whitmore Stays Assistant</p>
            </div>
            <button onClick={() => setOpen(false)} className="opacity-80 hover:opacity-100 transition-opacity">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-background">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm font-body whitespace-pre-line leading-relaxed ${
                  m.from === "user"
                    ? "bg-accent text-accent-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-2 rounded-2xl rounded-bl-sm">
                  <span className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-border bg-card flex gap-2 items-center">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything..."
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <button onClick={send} disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-lg bg-accent text-accent-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity">
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button onClick={() => setOpen(o => !o)}
        className="w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-elevated flex items-center justify-center hover:scale-105 transition-transform">
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
