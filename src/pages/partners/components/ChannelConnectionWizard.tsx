import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { partnerChannels } from "@/mocks/partners";

const countryCodes = [
  { code: "+1", country: "US/Canada" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "India" },
  { code: "+86", country: "China" },
  { code: "+81", country: "Japan" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+39", country: "Italy" },
  { code: "+55", country: "Brazil" },
  { code: "+7", country: "Russia" },
  { code: "+61", country: "Australia" },
  { code: "+52", country: "Mexico" },
  { code: "+34", country: "Spain" },
  { code: "+31", country: "Netherlands" },
  { code: "+46", country: "Sweden" },
  { code: "+65", country: "Singapore" },
  { code: "+971", country: "UAE" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+62", country: "Indonesia" },
  { code: "+90", country: "Turkey" },
];

function generateWhatsAppLink(countryCode: string, phoneNumber: string): string {
  const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, "");
  return `https://wa.me/${countryCode.replace("+", "")}${cleanNumber}`;
}

function generateWhatsAppEmbed(countryCode: string, phoneNumber: string): string {
  const link = generateWhatsAppLink(countryCode, phoneNumber);
  return `<a
  href="${link}"
  target="_blank"
  rel="noopener noreferrer"
  style="display:inline-flex;align-items:center;gap:8px;background:#25D366;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-family:sans-serif;font-size:14px;font-weight:600">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  Chat on WhatsApp
</a>`;
}

function generateLiveChatEmbed(widgetColor: string, welcomeText: string, position: string): string {
  const posRight = position === "bottom-right";
  const posStyle = posRight ? "right:20px;" : "left:20px;";
  const escapedWelcome = welcomeText.replace(/'/g, "\\'");
  return `<script>
(function(){
  if(document.getElementById('_omniChat'))return;
  var C='${widgetColor}',W='${escapedWelcome}',P='${posStyle}';
  var s=document.createElement('style');
  s.textContent='._oc_btn{position:fixed;bottom:20px;'+P+'z-index:2147483647;width:56px;height:56px;border-radius:50%;background:'+C+';box-shadow:0 4px 16px rgba(0,0,0,.18);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .2s,box-shadow .2s}'+
  '._oc_btn:hover{transform:scale(1.08);box-shadow:0 6px 24px rgba(0,0,0,.25)}._oc_btn svg{width:24px;height:24px;fill:#fff}'+
  '._oc_wnd{position:fixed;bottom:88px;'+P+'z-index:2147483646;width:360px;max-width:calc(100vw-32px);height:480px;max-height:calc(100vh-120px);background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.14);display:none;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}'+
  '._oc_wnd._oc_open{display:flex;animation:_oc_fade .25s ease}._oc_hdr{background:'+C+';padding:16px 20px;color:#fff;display:flex;align-items:center;gap:12px;flex-shrink:0}'+
  '._oc_hdr_ava{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:16px}'+
  '._oc_hdr_txt{flex:1;min-width:0}._oc_hdr_txt strong{display:block;font-size:14px}._oc_hdr_txt span{font-size:11px;opacity:.8}'+
  '._oc_close{cursor:pointer;opacity:.8;font-size:20px;line-height:1;background:none;border:none;color:#fff;padding:4px}'+
  '._oc_close:hover{opacity:1}._oc_msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#f9fafb}'+
  '._oc_msg{max-width:85%;padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.45;word-break:break-word}'+
  '._oc_msg_bot{background:#e5e7eb;color:#1f2937;align-self:flex-start;border-bottom-left-radius:4px}'+
  '._oc_msg_user{background:'+C+';color:#fff;align-self:flex-end;border-bottom-right-radius:4px}'+
  '._oc_inp{display:flex;align-items:center;gap:8px;padding:12px 16px;border-top:1px solid #e5e7eb;flex-shrink:0;background:#fff}'+
  '._oc_inp input{flex:1;border:none;outline:none;font-size:13px;padding:10px 0;background:transparent;color:#1f2937}'+
  '._oc_inp input::placeholder{color:#9ca3af}._oc_send{width:36px;height:36px;border-radius:50%;background:'+C+';border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}'+
  '._oc_send svg{width:16px;height:16px;fill:#fff}@keyframes _oc_fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}';
  document.head.appendChild(s);
  var b=document.createElement('div');b.className='_oc_btn';b.id='_omniChat';b.innerHTML='<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/><path d="M7 9h10v2H7zm0 3h7v2H7z"/></svg>';
  var wnd=document.createElement('div');wnd.className='_oc_wnd';
  wnd.innerHTML='<div class="_oc_hdr"><div class="_oc_hdr_ava">💬</div><div class="_oc_hdr_txt"><strong>Support</strong><span>We usually reply in minutes</span></div><button class="_oc_close">&times;</button></div><div class="_oc_msgs"><div class="_oc_msg _oc_msg_bot">'+W+'</div></div><div class="_oc_inp"><input type="text" placeholder="Type your message..." maxlength="500"><button class="_oc_send"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button></div>';
  document.body.appendChild(b);document.body.appendChild(wnd);
  var isOpen=false,input=wnd.querySelector('input'),msgs=wnd.querySelector('._oc_msgs');
  function toggle(){isOpen=!isOpen;wnd.classList.toggle('_oc_open',isOpen);b.innerHTML=isOpen?'<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>':'<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/><path fill="#fff" d="M7 9h10v2H7zm0 3h7v2H7z"/></svg>';if(isOpen)input.focus();}
  b.addEventListener('click',toggle);
  wnd.querySelector('._oc_close').addEventListener('click',function(e){e.stopPropagation();isOpen=false;wnd.classList.remove('_oc_open');b.innerHTML='<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/><path fill="#fff" d="M7 9h10v2H7zm0 3h7v2H7z"/></svg>';});
  function addMsg(txt,isUser){
    var d=document.createElement('div');d.className='_oc_msg '+(isUser?'_oc_msg_user':'_oc_msg_bot');
    d.textContent=txt;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;
  }
  function send(){
    var txt=input.value.trim();if(!txt)return;
    addMsg(txt,true);input.value='';input.focus();
    var replies=['Thanks for reaching out! OPSConnect helps businesses manage all their messaging channels in one place.','Great question! Our unified dashboard supports WhatsApp, Messenger, Instagram, Telegram, LINE, Email, Live Chat, and WeChat.','Did you know we offer AI chatbots, shared team inboxes, real-time translation, and full analytics? Pretty powerful stuff!','Our team typically responds within a few minutes during business hours. Is there anything specific we can help with right now?','Welcome aboard! Setting up channels on OPSConnect takes just a few minutes — head to your dashboard to get started.'];
    var reply=replies[Math.floor(Math.random()*replies.length)];
    setTimeout(function(){addMsg(reply,false)},1000+Math.random()*1500);
  }
  wnd.querySelector('._oc_send').addEventListener('click',send);
  input.addEventListener('keydown',function(e){if(e.key==='Enter')send();});
})();
<\/script>`;
}

export default function ChannelConnectionWizard() {
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- WhatsApp state ---
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [whatsAppCountryCode, setWhatsAppCountryCode] = useState("+1");
  const [whatsAppLink, setWhatsAppLink] = useState<string | null>(null);
  const [whatsAppConfigured, setWhatsAppConfigured] = useState(false);
  const [whatsAppError, setWhatsAppError] = useState<string | null>(null);
  const [copiedWhatsAppLink, setCopiedWhatsAppLink] = useState(false);
  const [copiedWhatsAppEmbed, setCopiedWhatsAppEmbed] = useState(false);

  // --- API key channels state ---
  const [apiKeyInputs, setApiKeyInputs] = useState<Record<string, string>>({});
  const [savedKeys, setSavedKeys] = useState<Record<string, boolean>>({});
  const [completedSetups, setCompletedSetups] = useState<Record<string, boolean>>({});

  // --- Instagram state ---
  const [igForm, setIgForm] = useState({ appId: "", appSecret: "", pageId: "" });
  const [igConfigured, setIgConfigured] = useState(false);

  // --- LINE state ---
  const [lineForm, setLineForm] = useState({ channelId: "", channelSecret: "", accessToken: "" });
  const [lineConfigured, setLineConfigured] = useState(false);

  // --- Email state ---
  const [emailForm, setEmailForm] = useState({ smtpHost: "", smtpPort: "587", emailAddr: "", emailPass: "", imapHost: "" });
  const [emailConfigured, setEmailConfigured] = useState(false);

  // --- Live Chat state ---
  const [lcForm, setLcForm] = useState({ widgetColor: "#1E7FC2", welcomeText: "Hi! How can we help you today?", position: "bottom-right" });
  const [lcConfigured, setLcConfigured] = useState(false);
  const [copiedLcEmbed, setCopiedLcEmbed] = useState(false);

  // --- Live Chat preview state (interactive mini-demo) ---
  const [lcPreviewMessages, setLcPreviewMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
    { role: "bot", text: "Hi there! This is your live widget preview. Try typing a message below!" },
  ]);
  const [lcPreviewInput, setLcPreviewInput] = useState("");
  const lcPreviewMsgsRef = useRef<HTMLDivElement>(null);

  // --- WeChat state ---
  const [wcForm, setWcForm] = useState({ appId: "", appSecret: "", token: "", encodingKey: "" });
  const [wcConfigured, setWcConfigured] = useState(false);

  const [searchParams] = useSearchParams();

  // Load all persistent state from localStorage on mount
  useEffect(() => {
    const storedKeys = localStorage.getItem("omni_saved_keys");
    if (storedKeys) {
      try { setSavedKeys(JSON.parse(storedKeys)); } catch { /* ignore */ }
    }
    const storedCompleted = localStorage.getItem("omni_completed_setups");
    if (storedCompleted) {
      try { setCompletedSetups(JSON.parse(storedCompleted)); } catch { /* ignore */ }
    }

    // Per-channel saved configs
    const savedIg = localStorage.getItem("omni_ig_configured");
    if (savedIg === "true") setIgConfigured(true);

    const savedLine = localStorage.getItem("omni_line_configured");
    if (savedLine === "true") setLineConfigured(true);

    const savedEmail = localStorage.getItem("omni_email_configured");
    if (savedEmail === "true") setEmailConfigured(true);

    const savedLc = localStorage.getItem("omni_lc_configured");
    if (savedLc === "true") setLcConfigured(true);

    const savedWc = localStorage.getItem("omni_wc_configured");
    if (savedWc === "true") setWcConfigured(true);

    const savedWa = localStorage.getItem("omni_wa_configured");
    if (savedWa === "true") {
      const phone = localStorage.getItem("omni_wa_phone") || "";
      const cc = localStorage.getItem("omni_wa_cc") || "+1";
      setWhatsAppNumber(phone);
      setWhatsAppCountryCode(cc);
      setWhatsAppLink(generateWhatsAppLink(cc, phone));
      setWhatsAppConfigured(true);
    }
  }, []);

  // URL param auto-open
  useEffect(() => {
    const channelParam = searchParams.get("channel");
    if (channelParam && partnerChannels.some((ch) => ch.id === channelParam)) {
      setActiveChannel(channelParam);
      const el = document.getElementById("connect");
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    }
  }, [searchParams]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(testTimersRef.current).forEach((t) => clearTimeout(t));
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleClose = () => setActiveChannel(null);

  // --- Generic API key handlers ---
  const handleSaveApiKey = (channelId: string) => {
    const key = (apiKeyInputs[channelId] || "").trim();
    if (!key) { showToast("Please enter an API key or token first."); return; }
    const updated = { ...savedKeys, [channelId]: true };
    setSavedKeys(updated);
    localStorage.setItem("omni_saved_keys", JSON.stringify(updated));
    localStorage.setItem(`omni_api_key_${channelId}`, key);
    showToast("API key saved successfully!");
  };

  const handleCompleteApiSetup = (channelId: string) => {
    if (!savedKeys[channelId]) { showToast("Please save your API key before completing setup."); return; }
    const updated = { ...completedSetups, [channelId]: true };
    setCompletedSetups(updated);
    localStorage.setItem("omni_completed_setups", JSON.stringify(updated));
    const channel = partnerChannels.find((ch) => ch.id === channelId);
    showToast(`${channel?.name || "Channel"} setup completed! Your webhook is ready.`);
  };

  // --- WhatsApp handlers ---
  const handleGenerateWhatsApp = () => {
    const cleanNumber = whatsAppNumber.replace(/[\s\-\(\)]/g, "");
    if (!cleanNumber) { setWhatsAppError("Please enter a valid phone number."); return; }
    if (!/^\d{5,15}$/.test(cleanNumber)) { setWhatsAppError("Phone number should contain 5 to 15 digits."); return; }
    setWhatsAppError(null);
    const link = generateWhatsAppLink(whatsAppCountryCode, whatsAppNumber);
    setWhatsAppLink(link);
    setWhatsAppConfigured(true);
    localStorage.setItem("omni_wa_configured", "true");
    localStorage.setItem("omni_wa_phone", whatsAppNumber);
    localStorage.setItem("omni_wa_cc", whatsAppCountryCode);
  };

  // --- Instagram handlers ---
  const handleIgSave = () => {
    if (!igForm.appId.trim() || !igForm.appSecret.trim() || !igForm.pageId.trim()) {
      showToast("Please fill in all Instagram configuration fields.");
      return;
    }
    setIgConfigured(true);
    localStorage.setItem("omni_ig_configured", "true");
    localStorage.setItem("omni_ig_data", JSON.stringify(igForm));
    showToast("Instagram Messaging configured successfully!");
  };

  // --- LINE handlers ---
  const handleLineSave = () => {
    if (!lineForm.channelId.trim() || !lineForm.channelSecret.trim() || !lineForm.accessToken.trim()) {
      showToast("Please fill in all LINE configuration fields.");
      return;
    }
    setLineConfigured(true);
    localStorage.setItem("omni_line_configured", "true");
    localStorage.setItem("omni_line_data", JSON.stringify(lineForm));
    showToast("LINE Messaging configured successfully!");
  };

  // --- Email handlers ---
  const handleEmailSave = () => {
    if (!emailForm.smtpHost.trim() || !emailForm.emailAddr.trim() || !emailForm.emailPass.trim()) {
      showToast("Please fill in SMTP host, email address, and password.");
      return;
    }
    setEmailConfigured(true);
    localStorage.setItem("omni_email_configured", "true");
    localStorage.setItem("omni_email_data", JSON.stringify(emailForm));
    showToast("Email support configured successfully!");
  };

  // --- Live Chat handlers ---
  const handleLcSave = () => {
    setLcConfigured(true);
    localStorage.setItem("omni_lc_configured", "true");
    localStorage.setItem("omni_lc_data", JSON.stringify(lcForm));
    setLcPreviewMessages([{ role: "bot", text: lcForm.welcomeText }]);
    showToast("Live Chat widget configured successfully!");
  };

  const handleLcPreviewSend = () => {
    const txt = lcPreviewInput.trim();
    if (!txt) return;
    setLcPreviewMessages((prev) => [...prev, { role: "user", text: txt }]);
    setLcPreviewInput("");
    const replies = [
      "Thanks for reaching out! OPSConnect unifies all your messaging channels in one place.",
      "Great question! Our unified dashboard supports WhatsApp, Messenger, Instagram, Telegram, LINE, Email, Live Chat, and WeChat.",
      "Did you know we offer AI chatbots, shared team inboxes, real-time translation, and full analytics?",
      "Our team typically responds within a few minutes. Is there anything specific we can help with?",
      "Welcome aboard! Setting up channels on OPSConnect takes just a few minutes.",
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    setTimeout(() => {
      setLcPreviewMessages((prev) => [...prev, { role: "bot", text: reply }]);
    }, 800 + Math.random() * 1200);
    setTimeout(() => {
      if (lcPreviewMsgsRef.current) {
        lcPreviewMsgsRef.current.scrollTop = lcPreviewMsgsRef.current.scrollHeight;
      }
    }, 100);
  };

  // --- WeChat handlers ---
  const handleWcSave = () => {
    if (!wcForm.appId.trim() || !wcForm.appSecret.trim() || !wcForm.token.trim()) {
      showToast("Please fill in App ID, App Secret, and Token.");
      return;
    }
    setWcConfigured(true);
    localStorage.setItem("omni_wc_configured", "true");
    localStorage.setItem("omni_wc_data", JSON.stringify(wcForm));
    showToast("WeChat Official Account configured successfully!");
  };

  // --- Rendering helpers ---

  const renderHeader = (channel: typeof partnerChannels[number], configured: boolean) => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: channel.color + "20" }}>
          <i className={`${channel.icon} text-xl`} style={{ color: channel.color }}></i>
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold text-foreground-950">{channel.name} Setup</h3>
          <p className="text-xs text-foreground-500">{configured ? "Configuration complete!" : "Configure your integration"}</p>
        </div>
      </div>
      <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-md cursor-pointer text-foreground-400 hover:text-foreground-700 hover:bg-background-200/50 transition-colors">
        <i className="ri-close-line"></i>
      </button>
    </div>
  );

  const renderApiKeySteps = (channel: typeof partnerChannels[number]) => {
    const isCompleted = completedSetups[channel.id];
    const hasSavedKey = savedKeys[channel.id];
    return (
      <div className="space-y-4">
        {channel.steps.map((step) => {
          const isStepTwo = step.num === 2;
          const isStepThree = step.num === 3;
          const stepDone = isCompleted || (isStepTwo ? hasSavedKey : isStepThree ? hasSavedKey : true);
          return (
            <div key={step.num} className={`flex gap-4 bg-background-50 rounded-lg p-4 md:p-5 border transition-colors ${stepDone ? "border-accent-200/60" : "border-background-200/50"}`}>
              <div className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 ${stepDone ? "bg-accent-100" : "bg-primary-100"}`}>
                <span className={`text-xs font-bold ${stepDone ? "text-accent-600" : "text-primary-600"}`}>{step.num}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground-900">{step.title}</h4>
                <p className="text-xs text-foreground-500 mt-1 leading-relaxed">{step.desc}</p>
                {isStepTwo && (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      value={apiKeyInputs[channel.id] || ""}
                      onChange={(e) => setApiKeyInputs((prev) => ({ ...prev, [channel.id]: e.target.value }))}
                      placeholder={hasSavedKey ? "••••••••••••••••" : "Enter your API key or token..."}
                      readOnly={hasSavedKey}
                      className={`flex-1 text-xs border rounded-md px-3 py-2 outline-none transition-colors ${hasSavedKey ? "bg-background-100 border-accent-200/60 text-foreground-400 cursor-default" : "bg-background-100 border-background-200/70 focus:border-primary-400 text-foreground-800"}`}
                    />
                    {hasSavedKey ? (
                      <button onClick={() => {
                        const updated = { ...savedKeys }; delete updated[channel.id];
                        setSavedKeys(updated);
                        localStorage.setItem("omni_saved_keys", JSON.stringify(updated));
                        localStorage.removeItem(`omni_api_key_${channel.id}`);
                        setApiKeyInputs((prev) => ({ ...prev, [channel.id]: "" }));
                        showToast("API key removed. You can enter a new one.");
                      }} className="text-xs font-medium text-foreground-500 hover:text-foreground-700 transition-colors whitespace-nowrap cursor-pointer px-4 py-2 rounded-md border border-background-200/70">
                        Change
                      </button>
                    ) : (
                      <button onClick={() => handleSaveApiKey(channel.id)} className="text-xs font-medium bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer px-4 py-2 rounded-md">
                        Save
                      </button>
                    )}
                  </div>
                )}
                {isStepThree && (
                  <div className="mt-3">
                    <p className="text-xs text-foreground-400 mb-1">Your webhook URL (paste this into the platform's dashboard):</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-background-100 border border-background-200/70 rounded-md px-3 py-2 text-foreground-600 font-mono break-all">
                        {`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/webhook-${channel.id}`}
                      </code>
                      <button onClick={() => { navigator.clipboard.writeText(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/webhook-${channel.id}`); showToast("Webhook URL copied!"); }} className="text-xs font-medium text-foreground-600 hover:text-foreground-950 transition-colors whitespace-nowrap cursor-pointer px-3 py-2 rounded-md border border-background-200/70">
                        <i className="ri-file-copy-line"></i> Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                {stepDone ? (
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-accent-100"><i className="ri-check-line text-xs text-accent-600"></i></span>
                ) : (
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-background-200/50"><i className="ri-more-line text-xs text-foreground-300"></i></span>
                )}
              </div>
            </div>
          );
        })}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-background-200/50">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isCompleted ? "bg-accent-500" : hasSavedKey ? "bg-accent-500 animate-pulse" : "bg-foreground-300 animate-pulse"}`} />
            <span className="text-xs text-foreground-500">{isCompleted ? "Connection status: Active" : hasSavedKey ? "Connection status: Ready to complete" : "Connection status: Awaiting API key"}</span>
          </div>
          <button onClick={() => handleCompleteApiSetup(channel.id)} disabled={isCompleted} className={`text-sm font-semibold whitespace-nowrap cursor-pointer px-5 py-2.5 rounded-md transition-colors ${isCompleted ? "bg-accent-100 text-accent-600 cursor-default" : "bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600"}`}>
            {isCompleted ? "Setup Completed" : "Complete Setup"}
          </button>
        </div>
      </div>
    );
  };

  const renderField = (label: string, value: string, onChange: (v: string) => void, placeholder: string, type: string = "text") => (
    <div>
      <label className="block text-xs font-medium text-foreground-600 mb-1.5">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-background-50 border border-background-200/70 rounded-md px-3 py-2.5 text-sm text-foreground-800 outline-none focus:border-primary-400 transition-colors placeholder:text-foreground-300" />
    </div>
  );

  const renderInstagramForm = () => {
    if (igConfigured) {
      return renderConfiguredState("Instagram Messaging", "#E4405F", "ri-instagram-line", () => { setIgConfigured(false); localStorage.removeItem("omni_ig_configured"); showToast("Configuration reset. You can reconfigure now."); });
    }
    return (
      <div className="space-y-5">
        <p className="text-sm text-foreground-700">Connect your Instagram Professional account to manage DMs from your unified inbox.</p>
        <div className="grid grid-cols-1 gap-4">
          {renderField("Instagram App ID", igForm.appId, (v) => setIgForm((p) => ({ ...p, appId: v })), "e.g. 123456789012345")}
          {renderField("App Secret", igForm.appSecret, (v) => setIgForm((p) => ({ ...p, appSecret: v })), "Enter your Meta app secret", "password")}
          {renderField("Facebook Page ID", igForm.pageId, (v) => setIgForm((p) => ({ ...p, pageId: v })), "e.g. 987654321098765")}
        </div>
        <button onClick={handleIgSave} className="w-full text-sm font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer px-5 py-3 rounded-md">
          Connect Instagram
        </button>
      </div>
    );
  };

  const renderLineForm = () => {
    if (lineConfigured) {
      return renderConfiguredState("LINE Messaging", "#00C300", "ri-line-line", () => { setLineConfigured(false); localStorage.removeItem("omni_line_configured"); showToast("Configuration reset. You can reconfigure now."); });
    }
    return (
      <div className="space-y-5">
        <p className="text-sm text-foreground-700">Configure your LINE Official Account to engage customers across Asian markets.</p>
        <div className="grid grid-cols-1 gap-4">
          {renderField("Channel ID", lineForm.channelId, (v) => setLineForm((p) => ({ ...p, channelId: v })), "e.g. 1655123456")}
          {renderField("Channel Secret", lineForm.channelSecret, (v) => setLineForm((p) => ({ ...p, channelSecret: v })), "Enter your LINE channel secret", "password")}
          {renderField("Channel Access Token", lineForm.accessToken, (v) => setLineForm((p) => ({ ...p, accessToken: v })), "Enter your long-lived access token", "password")}
        </div>
        <button onClick={handleLineSave} className="w-full text-sm font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer px-5 py-3 rounded-md">
          Connect LINE
        </button>
      </div>
    );
  };

  const renderEmailForm = () => {
    if (emailConfigured) {
      return renderConfiguredState("Email Support", "#EA4335", "ri-mail-line", () => { setEmailConfigured(false); localStorage.removeItem("omni_email_configured"); showToast("Configuration reset. You can reconfigure now."); });
    }
    return (
      <div className="space-y-5">
        <p className="text-sm text-foreground-700">Connect your email inbox to manage support emails alongside all your messaging channels.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderField("SMTP Host", emailForm.smtpHost, (v) => setEmailForm((p) => ({ ...p, smtpHost: v })), "e.g. smtp.gmail.com")}
          {renderField("SMTP Port", emailForm.smtpPort, (v) => setEmailForm((p) => ({ ...p, smtpPort: v })), "e.g. 587")}
          {renderField("Email Address", emailForm.emailAddr, (v) => setEmailForm((p) => ({ ...p, emailAddr: v })), "e.g. support@yourcompany.com", "email")}
          {renderField("Password / App Password", emailForm.emailPass, (v) => setEmailForm((p) => ({ ...p, emailPass: v })), "Enter app-specific password", "password")}
        </div>
        {renderField("IMAP Host (optional)", emailForm.imapHost, (v) => setEmailForm((p) => ({ ...p, imapHost: v })), "e.g. imap.gmail.com")}
        <button onClick={handleEmailSave} className="w-full text-sm font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer px-5 py-3 rounded-md">
          Connect Email
        </button>
      </div>
    );
  };

  const renderLiveChatForm = () => {
    if (lcConfigured) {
      const embedCode = generateLiveChatEmbed(lcForm.widgetColor, lcForm.welcomeText, lcForm.position);
      return (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="w-8 h-8 flex items-center justify-center rounded-full bg-accent-100"><i className="ri-check-line text-accent-600 text-sm"></i></span><div><p className="text-sm font-semibold text-foreground-900">Widget Ready</p><p className="text-xs text-foreground-500">Copy the embed code below</p></div></div>
            <button onClick={() => { setLcConfigured(false); localStorage.removeItem("omni_lc_configured"); showToast("Configuration reset."); }} className="text-xs font-medium text-foreground-500 hover:text-foreground-700 transition-colors whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-md border border-background-200/70">Reconfigure</button>
          </div>
          <div className="bg-background-100 rounded-lg border border-background-200/70 p-4 space-y-3">
            <p className="text-xs font-semibold text-foreground-700 uppercase tracking-wider">Embed Code</p>
            <p className="text-xs text-foreground-500 leading-relaxed">Paste this snippet before the closing &lt;/body&gt; tag on your website.</p>
            <div className="relative">
              <pre className="text-xs font-mono bg-foreground-950 text-background-50 rounded-md p-4 overflow-x-auto leading-relaxed">{embedCode}</pre>
              <button onClick={() => { navigator.clipboard.writeText(embedCode); setCopiedLcEmbed(true); setTimeout(() => setCopiedLcEmbed(false), 2000); }} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-md cursor-pointer text-background-50/50 hover:text-background-50 hover:bg-foreground-800 transition-colors">
                <i className={`text-sm ${copiedLcEmbed ? "ri-check-line text-accent-400" : "ri-file-copy-line"}`}></i>
              </button>
            </div>
          </div>
          <div className="bg-background-100 rounded-lg border border-background-200/70 p-4 space-y-3">
            <p className="text-xs font-semibold text-foreground-700 uppercase tracking-wider">Widget Preview — Try it live!</p>
            <div className="bg-white rounded-xl border border-background-200/70 overflow-hidden">
              {/* Chat header */}
              <div className="flex items-center gap-2.5 px-4 py-3" style={{ backgroundColor: lcForm.widgetColor }}>
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <i className="ri-chat-3-line text-sm text-white"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">OmniChat</p>
                  <p className="text-[10px] text-white/80">We reply in a few seconds</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-accent-400"></span>
              </div>
              {/* Messages */}
              <div ref={lcPreviewMsgsRef} className="h-56 overflow-y-auto bg-[#f9fafb] p-4 flex flex-col gap-2.5">
                {lcPreviewMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-[fadeInUp_0.25s_ease-out]`}>
                    <div className={`max-w-[80%] px-3 py-2 text-xs leading-relaxed rounded-2xl ${msg.role === "user" ? "rounded-br-md text-white" : "rounded-bl-md bg-background-200/80 text-foreground-800"}`} style={msg.role === "user" ? { backgroundColor: lcForm.widgetColor } : {}}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              {/* Input */}
              <div className="flex items-center gap-2 px-3 py-2.5 border-t border-background-200/70 bg-white">
                <input
                  type="text"
                  value={lcPreviewInput}
                  onChange={(e) => setLcPreviewInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleLcPreviewSend(); }}
                  placeholder="Try typing a message..."
                  maxLength={500}
                  className="flex-1 text-xs bg-transparent outline-none text-foreground-800 placeholder:text-foreground-300 py-1.5"
                />
                <button onClick={handleLcPreviewSend} className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer flex-shrink-0 transition-transform hover:scale-105" style={{ backgroundColor: lcForm.widgetColor }}>
                  <i className="ri-send-plane-fill text-xs text-white"></i>
                </button>
              </div>
            </div>
            <p className="text-[10px] text-foreground-400 text-center">This is a live demo — type a message and see how your widget responds!</p>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-5">
        <p className="text-sm text-foreground-700">Customize your live chat widget before embedding it on your website.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground-600 mb-1.5">Widget Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={lcForm.widgetColor} onChange={(e) => setLcForm((p) => ({ ...p, widgetColor: e.target.value }))} className="w-10 h-10 rounded-md border border-background-200/70 cursor-pointer" />
              <span className="text-xs text-foreground-500 font-mono">{lcForm.widgetColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground-600 mb-1.5">Widget Position</label>
            <div className="flex gap-2">
              {["bottom-right", "bottom-left"].map((pos) => (
                <button key={pos} onClick={() => setLcForm((p) => ({ ...p, position: pos }))} className={`text-xs font-medium whitespace-nowrap cursor-pointer px-3 py-2 rounded-md border transition-colors ${lcForm.position === pos ? "border-primary-500 bg-primary-50 text-primary-600" : "border-background-200/70 text-foreground-600 hover:border-background-300"}`}>
                  {pos === "bottom-right" ? "Bottom Right" : "Bottom Left"}
                </button>
              ))}
            </div>
          </div>
        </div>
        {renderField("Welcome Message", lcForm.welcomeText, (v) => setLcForm((p) => ({ ...p, welcomeText: v })), "Hi! How can we help you?")}
        <button onClick={handleLcSave} className="w-full text-sm font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer px-5 py-3 rounded-md">
          Generate Widget Code
        </button>
      </div>
    );
  };

  const renderWeChatForm = () => {
    if (wcConfigured) {
      return renderConfiguredState("WeChat Official", "#07C160", "ri-wechat-line", () => { setWcConfigured(false); localStorage.removeItem("omni_wc_configured"); showToast("Configuration reset. You can reconfigure now."); });
    }
    return (
      <div className="space-y-5">
        <p className="text-sm text-foreground-700">Connect your WeChat Official Account to serve customers across China.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderField("App ID", wcForm.appId, (v) => setWcForm((p) => ({ ...p, appId: v })), "e.g. wx1234567890abcdef")}
          {renderField("App Secret", wcForm.appSecret, (v) => setWcForm((p) => ({ ...p, appSecret: v })), "Enter your WeChat app secret", "password")}
          {renderField("Server Token", wcForm.token, (v) => setWcForm((p) => ({ ...p, token: v })), "Custom verification token")}
          {renderField("Encoding AES Key", wcForm.encodingKey, (v) => setWcForm((p) => ({ ...p, encodingKey: v })), "43-character encoding key (optional)")}
        </div>
        <button onClick={handleWcSave} className="w-full text-sm font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer px-5 py-3 rounded-md">
          Connect WeChat
        </button>
      </div>
    );
  };

  const renderConfiguredState = (name: string, color: string, icon: string, onReconfigure: () => void) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-accent-100"><i className="ri-check-line text-accent-600 text-sm"></i></span>
          <div><p className="text-sm font-semibold text-foreground-900">{name} Connected</p><p className="text-xs text-foreground-500">Your integration is active and ready</p></div>
        </div>
        <button onClick={onReconfigure} className="text-xs font-medium text-foreground-500 hover:text-foreground-700 transition-colors whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-md border border-background-200/70">Reconfigure</button>
      </div>
      <div className="bg-background-100 rounded-lg border border-background-200/70 p-4 flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: color + "20" }}>
          <i className={`${icon} text-lg`} style={{ color }}></i>
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground-700">Status: Active</p>
          <p className="text-xs text-foreground-400">Messages are flowing through your unified inbox</p>
        </div>
        <div className="ml-auto"><span className="w-2.5 h-2.5 rounded-full bg-accent-500 inline-block" /></div>
      </div>
    </div>
  );

  const renderWhatsAppForm = () => {
    if (whatsAppConfigured && whatsAppLink) {
      return (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="w-8 h-8 flex items-center justify-center rounded-full bg-accent-100"><i className="ri-check-line text-accent-600 text-sm"></i></span><div><p className="text-sm font-semibold text-foreground-900">WhatsApp Connected</p><p className="text-xs text-foreground-500">Your chat link is ready</p></div></div>
            <button onClick={() => { setWhatsAppConfigured(false); setWhatsAppLink(null); localStorage.removeItem("omni_wa_configured"); }} className="text-xs font-medium text-foreground-500 hover:text-foreground-700 transition-colors whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-md border border-background-200/70">Reconfigure</button>
          </div>
          <div className="bg-background-100 rounded-lg border border-background-200/70 p-4 space-y-3">
            <p className="text-xs font-semibold text-foreground-700 uppercase tracking-wider">Your WhatsApp Link</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-background-50 border border-background-200/70 rounded-md px-3 py-2 text-foreground-600 font-mono break-all">{whatsAppLink}</code>
              <button onClick={() => { navigator.clipboard.writeText(whatsAppLink); setCopiedWhatsAppLink(true); setTimeout(() => setCopiedWhatsAppLink(false), 2000); }} className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-md cursor-pointer text-foreground-400 hover:text-foreground-700 hover:bg-background-200/70 transition-colors">
                <i className={`text-sm ${copiedWhatsAppLink ? "ri-check-line text-accent-500" : "ri-file-copy-line"}`}></i>
              </button>
            </div>
            <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors cursor-pointer">Test link <i className="ri-external-link-line"></i></a>
          </div>
          <div className="bg-background-100 rounded-lg border border-background-200/70 p-4 space-y-3">
            <p className="text-xs font-semibold text-foreground-700 uppercase tracking-wider">Embed on Your Website</p>
            <div className="relative">
              <pre className="text-xs font-mono bg-foreground-950 text-background-50 rounded-md p-4 overflow-x-auto leading-relaxed">{generateWhatsAppEmbed(whatsAppCountryCode, whatsAppNumber)}</pre>
              <button onClick={() => { navigator.clipboard.writeText(generateWhatsAppEmbed(whatsAppCountryCode, whatsAppNumber)); setCopiedWhatsAppEmbed(true); setTimeout(() => setCopiedWhatsAppEmbed(false), 2000); }} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-md cursor-pointer text-background-50/50 hover:text-background-50 hover:bg-foreground-800 transition-colors">
                <i className={`text-sm ${copiedWhatsAppEmbed ? "ri-check-line text-accent-400" : "ri-file-copy-line"}`}></i>
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-5">
        <p className="text-sm text-foreground-700">Enter your WhatsApp Business phone number to generate your chat link.</p>
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <label className="block text-xs font-medium text-foreground-600 mb-1.5">Country</label>
            <div className="relative">
              <select value={whatsAppCountryCode} onChange={(e) => setWhatsAppCountryCode(e.target.value)} className="appearance-none bg-background-50 border border-background-200/70 rounded-md pl-3 pr-8 py-2.5 text-sm text-foreground-800 cursor-pointer outline-none focus:border-primary-400 transition-colors w-[130px]">
                {countryCodes.map((c) => (<option key={c.code} value={c.code}>{c.code} {c.country}</option>))}
              </select>
              <i className="ri-arrow-down-s-line text-xs text-foreground-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"></i>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-foreground-600 mb-1.5">Phone Number</label>
            <input type="tel" value={whatsAppNumber} onChange={(e) => { setWhatsAppError(null); setWhatsAppNumber(e.target.value); }} placeholder="e.g. 212 555 1234" className="w-full bg-background-50 border border-background-200/70 rounded-md px-3 py-2.5 text-sm text-foreground-800 outline-none focus:border-primary-400 transition-colors placeholder:text-foreground-300" />
          </div>
        </div>
        {whatsAppError && (<div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 rounded-md px-3 py-2"><i className="ri-error-warning-line"></i>{whatsAppError}</div>)}
        <button onClick={handleGenerateWhatsApp} className="w-full text-sm font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer px-5 py-3 rounded-md">Generate WhatsApp Chat Link</button>
      </div>
    );
  };

  // --- Test Connection State ---
  const [testState, setTestState] = useState<Record<string, "idle" | "sending" | "success" | "error">>({});
  const [testChatMessages, setTestChatMessages] = useState<Record<string, { role: "sent" | "received"; text: string; time: string }[]>>({});
  const testTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const isChannelConfigured = (channelId: string): boolean => {
    switch (channelId) {
      case "whatsapp": return whatsAppConfigured;
      case "instagram": return igConfigured;
      case "line": return lineConfigured;
      case "email": return emailConfigured;
      case "livechat": return lcConfigured;
      case "wechat": return wcConfigured;
      default: return completedSetups[channelId] || false;
    }
  };

  const handleTestConnection = (channelId: string) => {
    // Clear any existing timer for this channel
    if (testTimersRef.current[channelId]) {
      clearTimeout(testTimersRef.current[channelId]);
      delete testTimersRef.current[channelId];
    }
    setTestState((prev) => ({ ...prev, [channelId]: "sending" }));
    const channel = partnerChannels.find((ch) => ch.id === channelId);

    // Initialize chat messages with the sent test
    const sentMsg = { role: "sent" as const, text: `Test message from OPSConnect via ${channel?.name || channelId}`, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setTestChatMessages((prev) => ({ ...prev, [channelId]: [sentMsg] }));

    // Simulate delivery + auto-reply
    const t1 = setTimeout(() => {
      setTestState((prev) => ({ ...prev, [channelId]: "success" }));
      const replyMsg = {
        role: "received" as const,
        text: channelId === "telegram"
          ? "Telegram Bot: Test received! Your bot is connected and responding correctly."
          : "Messenger: Test received! Your page is connected and responding correctly.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setTestChatMessages((prev) => {
        const existing = prev[channelId] || [];
        return { ...prev, [channelId]: [...existing, replyMsg] };
      });
      showToast(`Test message sent through ${channel?.name || "channel"} successfully!`);
      delete testTimersRef.current[channelId];
    }, 1500);
    testTimersRef.current[channelId] = t1;

    // Reset button to idle after showing success for a bit
    const t2 = setTimeout(() => {
      setTestState((prev) => ({ ...prev, [channelId]: "idle" }));
      delete testTimersRef.current[channelId];
    }, 4500);
    // Store t2 alongside t1
    testTimersRef.current[`${channelId}_reset`] = t2;
  };

  return (
    <section className="py-16 md:py-20 px-4 md:px-6 bg-background-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-3">Connect Your Channels</p>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950 leading-tight">Choose a channel to get started</h2>
          <p className="mt-3 text-sm md:text-base text-foreground-600 max-w-lg mx-auto">Each integration takes just a few minutes. Follow the setup for each channel you want to connect.</p>
        </div>

        {/* Channel Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-8">
          {partnerChannels.map((channel) => {
            const configured = isChannelConfigured(channel.id);
            return (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(activeChannel === channel.id ? null : channel.id)}
                className={`text-left rounded-xl border-2 p-5 md:p-6 cursor-pointer transition-all duration-300 ${
                  activeChannel === channel.id
                    ? "border-primary-500 bg-primary-50"
                    : configured
                      ? "border-accent-200/60 bg-accent-50/50"
                      : "border-background-200/70 bg-background-100 hover:border-background-300"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-background-200/80">
                    <i className={`${channel.icon} text-xl`} style={{ color: channel.color }}></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-sm md:text-base font-semibold text-foreground-900">{channel.name}</h3>
                    {configured && <span className="text-[10px] font-medium text-accent-600 bg-accent-100 px-1.5 py-0.5 rounded-full">Connected</span>}
                  </div>
                </div>
                <p className="text-xs text-foreground-500 leading-relaxed">{channel.description}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary-500">
                  {activeChannel === channel.id ? (<>Hide setup <i className="ri-arrow-up-line"></i></>) : (<>Set up now <i className="ri-arrow-right-line"></i></>)}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Channel Panel */}
        {activeChannel && (
          <div className="bg-background-100 rounded-xl border border-background-200/70 overflow-hidden transition-all duration-300">
            <div className="p-6 md:p-8">
              {activeChannel === "whatsapp" && (
                <>
                  {renderHeader(partnerChannels.find((c) => c.id === "whatsapp")!, whatsAppConfigured)}
                  {renderWhatsAppForm()}
                  {/* Test Connection */}
                  <div className="mt-6 pt-4 border-t border-background-200/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-foreground-700">Test Connection</p>
                        <p className="text-xs text-foreground-400">Send a test message to verify your integration</p>
                      </div>
                      {testState["whatsapp"] === "sending" ? (
                        <span className="text-xs font-medium text-foreground-500 flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /> Sending...</span>
                      ) : testState["whatsapp"] === "success" ? (
                        <span className="text-xs font-medium text-accent-600 flex items-center gap-1.5"><i className="ri-checkbox-circle-line"></i> Sent!</span>
                      ) : (
                        <button onClick={() => handleTestConnection("whatsapp")} disabled={!whatsAppConfigured} className={`text-xs font-semibold whitespace-nowrap cursor-pointer px-4 py-2 rounded-md transition-colors ${whatsAppConfigured ? "bg-secondary-500 text-background-50 dark:text-foreground-950 hover:bg-secondary-600" : "bg-background-200/70 text-foreground-300 cursor-not-allowed"}`}>
                          <i className="ri-send-plane-line mr-1.5"></i>Test Now
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeChannel === "instagram" && (
                <>
                  {renderHeader(partnerChannels.find((c) => c.id === "instagram")!, igConfigured)}
                  {renderInstagramForm()}
                  <div className="mt-6 pt-4 border-t border-background-200/50">
                    <div className="flex items-center justify-between">
                      <div><p className="text-xs font-semibold text-foreground-700">Test Connection</p><p className="text-xs text-foreground-400">Send a test DM to verify</p></div>
                      {testState["instagram"] === "sending" ? (
                        <span className="text-xs font-medium text-foreground-500 flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /> Sending...</span>
                      ) : testState["instagram"] === "success" ? (
                        <span className="text-xs font-medium text-accent-600 flex items-center gap-1.5"><i className="ri-checkbox-circle-line"></i> Sent!</span>
                      ) : (
                        <button onClick={() => handleTestConnection("instagram")} disabled={!igConfigured} className={`text-xs font-semibold whitespace-nowrap cursor-pointer px-4 py-2 rounded-md transition-colors ${igConfigured ? "bg-secondary-500 text-background-50 dark:text-foreground-950 hover:bg-secondary-600" : "bg-background-200/70 text-foreground-300 cursor-not-allowed"}`}>
                          <i className="ri-send-plane-line mr-1.5"></i>Test Now
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeChannel === "line" && (
                <>
                  {renderHeader(partnerChannels.find((c) => c.id === "line")!, lineConfigured)}
                  {renderLineForm()}
                  <div className="mt-6 pt-4 border-t border-background-200/50">
                    <div className="flex items-center justify-between">
                      <div><p className="text-xs font-semibold text-foreground-700">Test Connection</p><p className="text-xs text-foreground-400">Send a test message through LINE</p></div>
                      {testState["line"] === "sending" ? (
                        <span className="text-xs font-medium text-foreground-500 flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /> Sending...</span>
                      ) : testState["line"] === "success" ? (
                        <span className="text-xs font-medium text-accent-600 flex items-center gap-1.5"><i className="ri-checkbox-circle-line"></i> Sent!</span>
                      ) : (
                        <button onClick={() => handleTestConnection("line")} disabled={!lineConfigured} className={`text-xs font-semibold whitespace-nowrap cursor-pointer px-4 py-2 rounded-md transition-colors ${lineConfigured ? "bg-secondary-500 text-background-50 dark:text-foreground-950 hover:bg-secondary-600" : "bg-background-200/70 text-foreground-300 cursor-not-allowed"}`}>
                          <i className="ri-send-plane-line mr-1.5"></i>Test Now
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeChannel === "email" && (
                <>
                  {renderHeader(partnerChannels.find((c) => c.id === "email")!, emailConfigured)}
                  {renderEmailForm()}
                  <div className="mt-6 pt-4 border-t border-background-200/50">
                    <div className="flex items-center justify-between">
                      <div><p className="text-xs font-semibold text-foreground-700">Test Connection</p><p className="text-xs text-foreground-400">Send a test email to verify SMTP</p></div>
                      {testState["email"] === "sending" ? (
                        <span className="text-xs font-medium text-foreground-500 flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /> Sending...</span>
                      ) : testState["email"] === "success" ? (
                        <span className="text-xs font-medium text-accent-600 flex items-center gap-1.5"><i className="ri-checkbox-circle-line"></i> Sent!</span>
                      ) : (
                        <button onClick={() => handleTestConnection("email")} disabled={!emailConfigured} className={`text-xs font-semibold whitespace-nowrap cursor-pointer px-4 py-2 rounded-md transition-colors ${emailConfigured ? "bg-secondary-500 text-background-50 dark:text-foreground-950 hover:bg-secondary-600" : "bg-background-200/70 text-foreground-300 cursor-not-allowed"}`}>
                          <i className="ri-send-plane-line mr-1.5"></i>Test Now
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeChannel === "livechat" && (
                <>
                  {renderHeader(partnerChannels.find((c) => c.id === "livechat")!, lcConfigured)}
                  {renderLiveChatForm()}
                  <div className="mt-6 pt-4 border-t border-background-200/50">
                    <div className="flex items-center justify-between">
                      <div><p className="text-xs font-semibold text-foreground-700">Test Connection</p><p className="text-xs text-foreground-400">Simulate a visitor chat on your widget</p></div>
                      {testState["livechat"] === "sending" ? (
                        <span className="text-xs font-medium text-foreground-500 flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /> Sending...</span>
                      ) : testState["livechat"] === "success" ? (
                        <span className="text-xs font-medium text-accent-600 flex items-center gap-1.5"><i className="ri-checkbox-circle-line"></i> Sent!</span>
                      ) : (
                        <button onClick={() => handleTestConnection("livechat")} disabled={!lcConfigured} className={`text-xs font-semibold whitespace-nowrap cursor-pointer px-4 py-2 rounded-md transition-colors ${lcConfigured ? "bg-secondary-500 text-background-50 dark:text-foreground-950 hover:bg-secondary-600" : "bg-background-200/70 text-foreground-300 cursor-not-allowed"}`}>
                          <i className="ri-send-plane-line mr-1.5"></i>Test Now
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeChannel === "wechat" && (
                <>
                  {renderHeader(partnerChannels.find((c) => c.id === "wechat")!, wcConfigured)}
                  {renderWeChatForm()}
                  <div className="mt-6 pt-4 border-t border-background-200/50">
                    <div className="flex items-center justify-between">
                      <div><p className="text-xs font-semibold text-foreground-700">Test Connection</p><p className="text-xs text-foreground-400">Verify your WeChat server configuration</p></div>
                      {testState["wechat"] === "sending" ? (
                        <span className="text-xs font-medium text-foreground-500 flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /> Verifying...</span>
                      ) : testState["wechat"] === "success" ? (
                        <span className="text-xs font-medium text-accent-600 flex items-center gap-1.5"><i className="ri-checkbox-circle-line"></i> Verified!</span>
                      ) : (
                        <button onClick={() => handleTestConnection("wechat")} disabled={!wcConfigured} className={`text-xs font-semibold whitespace-nowrap cursor-pointer px-4 py-2 rounded-md transition-colors ${wcConfigured ? "bg-secondary-500 text-background-50 dark:text-foreground-950 hover:bg-secondary-600" : "bg-background-200/70 text-foreground-300 cursor-not-allowed"}`}>
                          <i className="ri-send-plane-line mr-1.5"></i>Test Now
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* API-based channels: telegram, messenger */}
              {(activeChannel === "telegram" || activeChannel === "messenger") && (
                <>
                  {partnerChannels
                    .filter((ch) => ch.id === activeChannel)
                    .map((channel) => {
                      const hasKey = savedKeys[channel.id];
                      const isCompleted = completedSetups[channel.id];
                      const currentTestState = testState[channel.id] || "idle";
                      const chatMsgs = testChatMessages[channel.id] || [];
                      return (
                        <div key={channel.id}>
                          {renderHeader(channel, isCompleted || hasKey)}
                          {renderApiKeySteps(channel)}

                          {/* Test Connection Section */}
                          <div className="mt-6 pt-4 border-t border-background-200/50">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs font-semibold text-foreground-700">Test Connection</p>
                                <p className="text-xs text-foreground-400">
                                  {channel.id === "telegram"
                                    ? "Send a test message to your bot and see the response"
                                    : "Send a test message through Messenger and see the response"}
                                </p>
                              </div>
                              {currentTestState === "sending" ? (
                                <span className="text-xs font-medium text-foreground-500 flex items-center gap-2">
                                  <span className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /> Testing chat...
                                </span>
                              ) : currentTestState === "success" ? (
                                <span className="text-xs font-medium text-accent-600 flex items-center gap-1.5">
                                  <i className="ri-checkbox-circle-line"></i> Connected!
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleTestConnection(channel.id)}
                                  disabled={!hasKey}
                                  className={`text-xs font-semibold whitespace-nowrap cursor-pointer px-4 py-2 rounded-md transition-colors ${
                                    hasKey
                                      ? "bg-secondary-500 text-background-50 dark:text-foreground-950 hover:bg-secondary-600"
                                      : "bg-background-200/70 text-foreground-300 cursor-not-allowed"
                                  }`}
                                >
                                  <i className="ri-send-plane-line mr-1.5"></i>Test Chat
                                </button>
                              )}
                            </div>

                            {/* Mini Chat Simulation */}
                            {chatMsgs.length > 0 && (
                              <div className="mt-4 bg-background-50 rounded-lg border border-background-200/70 p-4 animate-[fadeInUp_0.3s_ease-out]">
                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-background-200/50">
                                  <div className="w-7 h-7 flex items-center justify-center rounded-full" style={{ backgroundColor: (channel.color || "#999") + "20" }}>
                                    <i className={`${channel.icon} text-xs`} style={{ color: channel.color }}></i>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-foreground-800">{channel.name} Test Chat</p>
                                    <p className="text-[10px] text-foreground-400">
                                      {currentTestState === "sending" ? "Sending test message..." : "Test completed successfully"}
                                    </p>
                                  </div>
                                  {currentTestState === "sending" && (
                                    <span className="ml-auto w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
                                  )}
                                </div>
                                <div className="space-y-2.5">
                                  {chatMsgs.map((msg, idx) => (
                                    <div
                                      key={idx}
                                      className={`flex ${msg.role === "sent" ? "justify-end" : "justify-start"} animate-[fadeInUp_0.25s_ease-out]`}
                                    >
                                      <div
                                        className={`max-w-[80%] rounded-lg px-3 py-2 ${
                                          msg.role === "sent"
                                            ? "bg-primary-500 text-background-50 dark:text-foreground-950 rounded-br-sm"
                                            : "bg-background-200/80 text-foreground-800 rounded-bl-sm"
                                        }`}
                                      >
                                        <p className="text-xs leading-relaxed">{msg.text}</p>
                                        <p className={`text-[10px] mt-1 ${msg.role === "sent" ? "text-background-50/70" : "text-foreground-400"}`}>{msg.time}</p>
                                      </div>
                                    </div>
                                  ))}
                                  {currentTestState === "sending" && (
                                    <div className="flex justify-start">
                                      <div className="bg-background-200/80 rounded-lg rounded-bl-sm px-3 py-2">
                                        <div className="flex items-center gap-1.5">
                                          <span className="w-1.5 h-1.5 rounded-full bg-foreground-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                                          <span className="w-1.5 h-1.5 rounded-full bg-foreground-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                                          <span className="w-1.5 h-1.5 rounded-full bg-foreground-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-[fadeInUp_0.3s_ease-out]">
          <div className="flex items-center gap-2.5 bg-foreground-950 text-background-50 text-sm px-5 py-3 rounded-lg shadow-lg">
            <i className="ri-checkbox-circle-line text-accent-400"></i>
            {toastMessage}
          </div>
        </div>
      )}
    </section>
  );
}