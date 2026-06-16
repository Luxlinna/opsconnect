import { useEffect } from "react";

const REPLIES = [
  "Thanks for reaching out! OPSConnect unifies WhatsApp, Messenger, Instagram, Telegram, LINE, Email, Live Chat, and WeChat into one seamless dashboard.",
  "Great question! Our shared team inbox makes it easy for your whole support team to collaborate on conversations in real time.",
  "Did you know OPSConnect includes AI-powered chatbots that can handle common questions automatically, 24/7? Saves your team hours every week.",
  "Our real-time translation lets you chat with customers in over 90 languages — they type in theirs, you read in yours.",
  "You can set up any channel in just a few minutes. Head over to our Partners page for a step-by-step guide for WhatsApp, Instagram, LINE, and more.",
  "OPSConnect gives you full analytics across all your messaging channels, so you always know your team's response times and satisfaction scores.",
  "We'd love to help you get set up! Is there a specific channel you're looking to connect first — WhatsApp, Messenger, Instagram, or something else?",
];

const C = "#1E7FC2";

const CSS = `
._ocl_btn{position:fixed;bottom:24px;right:24px;z-index:2147483647;width:56px;height:56px;border-radius:50%;background:${C};box-shadow:0 4px 16px rgba(30,127,194,.25);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .2s,box-shadow .2s}
._ocl_btn:hover{transform:scale(1.08);box-shadow:0 6px 24px rgba(30,127,194,.4)}
._ocl_btn svg{width:24px;height:24px;fill:#fff}
._ocl_wnd{position:fixed;bottom:92px;right:24px;z-index:2147483646;width:380px;max-width:calc(100vw - 32px);height:520px;max-height:calc(100vh - 140px);background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.15);display:none;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
._ocl_wnd._ocl_open{display:flex;animation:_ocl_in .25s ease}
._ocl_hdr{background:linear-gradient(135deg,#1B3F73,#2E9FDE);padding:16px 20px;color:#fff;display:flex;align-items:center;gap:12px;flex-shrink:0}
._ocl_ava{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px}
._ocl_info{flex:1;min-width:0}._ocl_info strong{display:block;font-size:14px}._ocl_info span{font-size:11px;opacity:.85}
._ocl_close{background:none;border:none;color:#fff;font-size:22px;cursor:pointer;padding:4px;opacity:.8;line-height:1}
._ocl_close:hover{opacity:1}
._ocl_msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#f9fafb}
._ocl_bubble{max-width:85%;padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.5;word-break:break-word}
._ocl_bot{background:#e5e7eb;color:#1f2937;align-self:flex-start;border-bottom-left-radius:4px}
._ocl_user{background:${C};color:#fff;align-self:flex-end;border-bottom-right-radius:4px}
._ocl_inp{display:flex;align-items:center;gap:8px;padding:12px 16px;border-top:1px solid #e5e7eb;flex-shrink:0;background:#fff}
._ocl_inp input{flex:1;border:none;outline:none;font-size:13px;padding:10px 0;background:transparent;color:#1f2937}
._ocl_inp input::placeholder{color:#9ca3af}
._ocl_send{width:38px;height:38px;border-radius:50%;background:${C};border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .2s}
._ocl_send:hover{background:#15396B}
._ocl_send svg{width:16px;height:16px;fill:#fff}
@keyframes _ocl_in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
`;

const ICON_CHAT = `<svg viewBox="0 0 24 24"><path fill="#fff" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/><path fill="#fff" d="M7 9h10v2H7zm0 3h7v2H7z"/></svg>`;
const ICON_CLOSE = `<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;

export default function DemoChatWidget() {
  useEffect(() => {
    // Inject styles
    const style = document.createElement("style");
    style.id = "_ocl_style";
    style.textContent = CSS;
    document.head.appendChild(style);

    // Button
    const btn = document.createElement("div");
    btn.className = "_ocl_btn";
    btn.id = "_ocLive";
    btn.innerHTML = ICON_CHAT;

    // Window
    const wnd = document.createElement("div");
    wnd.className = "_ocl_wnd";
    wnd.innerHTML = `
      <div class="_ocl_hdr">
        <div class="_ocl_ava">O</div>
        <div class="_ocl_info"><strong>OPSConnect</strong><span>We usually reply within minutes</span></div>
        <button class="_ocl_close">&times;</button>
      </div>
      <div class="_ocl_msgs">
        <div class="_ocl_bubble _ocl_bot">Hey there! 👋 Welcome to OPSConnect — your unified messaging hub. How can we help you today?</div>
      </div>
      <div class="_ocl_inp">
        <input type="text" placeholder="Type a message…" maxlength="500">
        <button class="_ocl_send"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
      </div>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(wnd);

    const msgs  = wnd.querySelector("._ocl_msgs") as HTMLElement;
    const input = wnd.querySelector("input") as HTMLInputElement;
    let isOpen  = false;

    function addBubble(txt: string, isUser: boolean) {
      const d = document.createElement("div");
      d.className = "_ocl_bubble " + (isUser ? "_ocl_user" : "_ocl_bot");
      d.textContent = txt;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function send() {
      const txt = input.value.trim();
      if (!txt) return;
      addBubble(txt, true);
      input.value = "";
      input.focus();
      const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
      setTimeout(() => addBubble(reply, false), 1000 + Math.random() * 1500);
    }

    function toggle() {
      isOpen = !isOpen;
      wnd.classList.toggle("_ocl_open", isOpen);
      btn.innerHTML = isOpen ? ICON_CLOSE : ICON_CHAT;
      if (isOpen) input.focus();
    }

    function closeWidget(e: Event) {
      e.stopPropagation();
      isOpen = false;
      wnd.classList.remove("_ocl_open");
      btn.innerHTML = ICON_CHAT;
    }

    btn.addEventListener("click", toggle);
    (wnd.querySelector("._ocl_close") as HTMLElement).addEventListener("click", closeWidget);
    (wnd.querySelector("._ocl_send") as HTMLElement).addEventListener("click", send);
    input.addEventListener("keydown", (e: KeyboardEvent) => { if (e.key === "Enter") send(); });

    // Cleanup on unmount — removes widget from all non-home pages
    return () => {
      btn.remove();
      wnd.remove();
      style.remove();
    };
  }, []);

  return null;
}
