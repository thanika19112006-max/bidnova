import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

const faqs: { patterns: string[]; response: string }[] = [
  {
    patterns: ["how do i bid", "how to bid", "place a bid", "bidding"],
    response:
      "To place a bid: 1) Browse auctions on the home page. 2) Click \"Place Bid\" on any active auction. 3) Enter an amount higher than the current bid. 4) Confirm your bid. You'll get a notification if you're outbid!",
  },
  {
    patterns: ["anti-snip", "last second", "extend", "sniping"],
    response:
      "BidNova uses anti-sniping protection! If a bid is placed in the final 30 seconds, the auction automatically extends by 60 seconds. This gives all bidders a fair chance to respond.",
  },
  {
    patterns: ["post auction", "sell", "list item", "create auction"],
    response:
      'To post an auction: 1) Log in to your account. 2) Go to "Sell" in the navbar or visit /postauction. 3) Fill in title, description, base price, duration, and upload an image. 4) Submit and your auction goes live!',
  },
  {
    patterns: ["payment", "pay", "icp", "token", "currency"],
    response:
      "BidNova uses ICP (Internet Computer Protocol) tokens for all transactions. Bids and payments are processed on-chain for maximum security and transparency.",
  },
  {
    patterns: ["win", "winner", "how to win"],
    response:
      'The highest bidder when the auction timer reaches zero wins! You\'ll receive a "You Won!" notification. The winner is displayed on the completed auction page.',
  },
  {
    patterns: ["register", "sign up", "create account"],
    response:
      'BidNova uses Internet Identity for secure, password-free authentication. Click "Sign Up" in the navbar and follow the Internet Identity setup steps.',
  },
];

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const faq of faqs) {
    if (faq.patterns.some((p) => lower.includes(p))) {
      return faq.response;
    }
  }
  return "I can help you with: bidding, posting auctions, anti-sniping, payments, winning auctions, and registration. What would you like to know?";
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Hi! I'm the BidNova assistant. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to bottom whenever message list length changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        text: getBotResponse(input),
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      <style>{`
        @keyframes bot-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes bot-pulse-ring {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes bot-open-spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(0.8); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .bot-float {
          animation: bot-float 2.8s ease-in-out infinite;
        }
        .bot-pulse-ring {
          animation: bot-pulse-ring 2s ease-out infinite;
        }
        .bot-open-spin {
          animation: bot-open-spin 0.4s ease-in-out forwards;
        }
      `}</style>
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen && (
          <div className="mb-4 w-80 bg-navy-card border border-navy-surface rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
            <div className="bg-navy flex items-center justify-between px-4 py-3 border-b border-navy-surface">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-white font-semibold text-sm">
                  BidNova Assistant
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-gold text-navy font-medium"
                        : "bg-navy-surface text-gray-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-navy-surface rounded-xl px-4 py-2 text-gray-400 text-sm">
                    <span className="animate-pulse">typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-3 border-t border-navy-surface flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask me anything..."
                className="bg-navy-surface border-navy-light text-white text-sm placeholder:text-gray-500"
              />
              <Button
                onClick={sendMessage}
                size="sm"
                className="bg-gold hover:bg-gold-dark text-navy px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Animated chat toggle button */}
        <div className="relative flex items-center justify-center">
          {!isOpen && (
            <>
              <span
                className="bot-pulse-ring absolute inset-0 rounded-full border-2"
                style={{
                  borderColor: "oklch(var(--gold) / 0.5)",
                  animationDelay: "0s",
                }}
              />
              <span
                className="bot-pulse-ring absolute inset-0 rounded-full border-2"
                style={{
                  borderColor: "oklch(var(--gold) / 0.3)",
                  animationDelay: "0.8s",
                }}
              />
            </>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            data-ocid="nav.toggle"
            className="relative bg-gold hover:bg-gold-dark text-navy w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
            style={{ fontSize: 28 }}
          >
            {isOpen ? (
              <span
                className="bot-open-spin inline-block leading-none"
                style={{ fontSize: 24 }}
              >
                ✕
              </span>
            ) : (
              <span
                className="bot-float inline-block leading-none select-none"
                style={{ fontSize: 26 }}
              >
                🤖
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
