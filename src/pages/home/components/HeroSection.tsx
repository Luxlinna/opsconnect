import { useState, useRef, useEffect } from "react";
import { stats } from "@/mocks/homepage";

export default function HeroSection() {
  const [chatMessages, setChatMessages] = useState<{ role: "customer" | "agent"; text: string }[]>([
    { role: "customer", text: "Hey, I need help with my order #45291" },
    { role: "agent", text: "Hi! Sure, let me check that for you right away." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatMsgsRef = useRef<HTMLDivElement>(null);

  const handleChatSend = () => {
    const txt = chatInput.trim();
    if (!txt) return;
    setChatMessages((prev) => [...prev, { role: "customer", text: txt }]);
    setChatInput("");
    const replies = [
      "Thanks for reaching out! OPSConnect unifies WhatsApp, Messenger, Instagram, Telegram, LINE, Email, Live Chat, and WeChat into one seamless dashboard.",
      "Great question! Our shared team inbox makes it easy for your whole support team to collaborate on conversations in real time.",
      "Did you know OPSConnect includes AI-powered chatbots that can handle common questions automatically, 24/7? Saves your team hours every week.",
      "Our real-time translation means you can chat with customers in over 90 languages — they type in theirs, you read in yours.",
      "You can set up any channel in just a few minutes. Head over to our Partners page to grab a step-by-step setup guide.",
      "OPSConnect gives you full analytics and reporting across all your messaging channels so you always know your response times and CSAT scores.",
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { role: "agent", text: reply }]);
    }, 800 + Math.random() * 1400);
  };

  useEffect(() => {
    if (chatMsgsRef.current) {
      chatMsgsRef.current.scrollTop = chatMsgsRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Dark animated background */}
      <div className="absolute inset-0 hero-bg">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />
        <div className="hero-grid" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      </div>

      <div className="relative z-10 w-full px-4 md:px-6 pt-24 md:pt-28 pb-16">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left w-full">
            <div className="hero-rise inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6" style={{ animationDelay: "0ms" }}>
              <span className="w-2 h-2 rounded-full bg-[#29B4EC] animate-pulse" />
              <span className="text-xs font-medium text-white/90">Now supporting 8 messaging channels</span>
            </div>

            <h1 className="hero-rise font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight" style={{ animationDelay: "80ms" }}>
              Every customer
              <br />
              conversation,
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #29B4EC 0%, #a8d8f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>one unified inbox.</span>
            </h1>

            <p className="hero-rise mt-5 text-sm md:text-base text-white/70 max-w-lg mx-auto lg:mx-0 leading-relaxed" style={{ animationDelay: "180ms" }}>
              Connect WhatsApp, Messenger, Instagram, Telegram, LINE, Email, Live Chat, and WeChat.
              AI chatbots handle the simple stuff, your team handles the rest.
            </p>

            <div className="hero-rise mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start" style={{ animationDelay: "280ms" }}>
              <a
                href="/register"
                className="w-full sm:w-auto text-sm font-semibold bg-[#1A7DC4] hover:bg-[#1568a8] text-white hover:-translate-y-0.5 transition-all whitespace-nowrap cursor-pointer px-7 py-3.5 rounded-md text-center shadow-lg shadow-black/30"
              >
                Start Free Trial
              </a>
              <a
                href="#integrations"
                className="w-full sm:w-auto text-sm font-medium text-white/80 hover:text-white hover:border-white/60 transition-all whitespace-nowrap cursor-pointer px-7 py-3.5 rounded-md border border-white/30 text-center"
              >
                See Integrations
              </a>
            </div>

            <div className="hero-rise mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6" style={{ animationDelay: "380ms" }}>
              {stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="font-heading text-xl md:text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/50 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-rise flex-1 w-full max-w-md lg:max-w-lg" style={{ animationDelay: "320ms" }}>
            <div className="hero-card bg-white rounded-xl border border-white/10 shadow-2xl shadow-black/40 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-gray-500 font-medium ml-2">OPSConnect Inbox</span>
                <span className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Live
                </span>
              </div>
              <div ref={chatMsgsRef} className="p-4 space-y-3 min-h-[300px] max-h-[320px] overflow-y-auto bg-gray-50">
                {chatMessages.map((msg, i) => {
                  const isCustomer = msg.role === "customer";
                  return (
                    <div
                      key={i}
                      className={`flex ${isCustomer ? "justify-start" : "justify-end"} animate-[fadeInUp_0.4s_ease-out]`}
                    >
                      <div
                        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          isCustomer
                            ? "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100"
                            : "text-white rounded-br-md"
                        }`}
                        style={!isCustomer ? { background: 'linear-gradient(135deg, #1A7DC4, #29B4EC)' } : undefined}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-2 bg-white">
                <i className="ri-add-circle-line text-lg text-gray-400" />
                <input
                  type="text"
                  placeholder="Try typing a message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleChatSend(); }}
                  className="flex-1 text-xs text-gray-500 bg-transparent outline-none"
                />
                <button onClick={handleChatSend} className="w-8 h-8 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <i className="ri-send-plane-fill text-lg" style={{ color: '#1A7DC4' }}></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Deep dark blue animated gradient */
        .hero-bg {
          background: linear-gradient(135deg,
            #0a1628 0%,
            #0e2044 35%,
            #0d2d5a 65%,
            #0a1e40 100%);
          background-size: 300% 300%;
          animation: heroGradient 20s ease infinite;
        }
        @keyframes heroGradient {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Subtle dot grid */
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(41, 180, 236, 0.15) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 35%, #000 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 35%, #000 40%, transparent 100%);
        }

        /* Glowing blobs in brand blues */
        .hero-blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(80px);
          will-change: transform;
        }
        .hero-blob-1 {
          width: 500px; height: 500px; top: -120px; left: -100px;
          background: rgba(26, 125, 196, 0.3);
          animation: blobFloat1 18s ease-in-out infinite;
        }
        .hero-blob-2 {
          width: 440px; height: 440px; bottom: -100px; right: 5%;
          background: rgba(41, 180, 236, 0.2);
          animation: blobFloat2 22s ease-in-out infinite;
        }
        .hero-blob-3 {
          width: 380px; height: 380px; top: 25%; right: -100px;
          background: rgba(26, 58, 108, 0.5);
          animation: blobFloat3 26s ease-in-out infinite;
        }
        @keyframes blobFloat1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(60px,40px) scale(1.1); }
        }
        @keyframes blobFloat2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-50px,-30px) scale(1.08); }
        }
        @keyframes blobFloat3 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-40px,50px) scale(0.94); }
        }

        /* Content entrance */
        .hero-rise {
          opacity: 0;
          animation: heroRise 0.7s cubic-bezier(0.16, 0.84, 0.44, 1) forwards;
        }
        @keyframes heroRise {
          from { opacity: 0; transform: translateY(26px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Gentle float on chat card */
        .hero-card { animation: cardFloat 7s ease-in-out infinite; }
        @keyframes cardFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-bg, .hero-blob-1, .hero-blob-2, .hero-blob-3,
          .hero-rise, .hero-card { animation: none; }
          .hero-rise { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
