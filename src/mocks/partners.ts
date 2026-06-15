export const partnerChannels = [
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    icon: "ri-whatsapp-line",
    color: "#25D366",
    description: "Connect your WhatsApp Business account to manage customer conversations through the official WhatsApp Business API.",
    steps: [
      { num: 1, title: "Verify Business", desc: "Ensure your business is verified on Meta Business Platform with a valid phone number." },
      { num: 2, title: "Get API Credentials", desc: "Create a WhatsApp Business App in Meta Developer Console and obtain your Phone Number ID and Access Token." },
      { num: 3, title: "Configure Webhook", desc: "Set up a webhook endpoint to receive incoming messages and status updates in real-time." },
      { num: 4, title: "Test Connection", desc: "Send a test message from your WhatsApp number to verify the integration is working." },
    ],
  },
  {
    id: "telegram",
    name: "Telegram Bot",
    icon: "ri-telegram-line",
    color: "#26A5E4",
    description: "Connect your Telegram Bot to automate conversations and manage customer messages through Telegram's Bot API.",
    steps: [
      { num: 1, title: "Create Bot", desc: "Message @BotFather on Telegram and use /newbot to create your bot. Save the API token." },
      { num: 2, title: "Configure Bot Settings", desc: "Set your bot's name, description, about text, and profile picture through @BotFather." },
      { num: 3, title: "Set Webhook URL", desc: "Register your webhook URL to receive incoming messages. We'll provide your unique webhook endpoint." },
      { num: 4, title: "Enable Inline Mode", desc: "Optionally enable inline queries so users can interact with your bot from any chat." },
    ],
  },
  {
    id: "messenger",
    name: "Facebook Messenger",
    icon: "ri-messenger-line",
    color: "#0084FF",
    description: "Connect your Facebook Page to handle Messenger conversations alongside all your other messaging channels.",
    steps: [
      { num: 1, title: "Link Facebook Page", desc: "Connect your business Facebook Page through OAuth. You'll need admin access to the page." },
      { num: 2, title: "Generate Page Token", desc: "Obtain a Page Access Token with messenger permissions from the Facebook Graph API." },
      { num: 3, title: "Subscribe to Webhooks", desc: "Subscribe your webhook to receive message events, message delivery confirmations, and read receipts." },
      { num: 4, title: "Set Greeting & Menu", desc: "Customize the welcome greeting and persistent menu that users see when they open your chat." },
    ],
  },
  {
    id: "instagram",
    name: "Instagram Messaging",
    icon: "ri-instagram-line",
    color: "#E4405F",
    description: "Connect your Instagram Professional account to manage DMs directly from your unified OPSConnect inbox.",
    steps: [
      { num: 1, title: "Professional Account", desc: "Ensure your Instagram account is set to Professional or Business type in account settings." },
      { num: 2, title: "Connect Facebook Page", desc: "Link your Instagram account to a Facebook Page through Meta Business Suite." },
      { num: 3, title: "API Configuration", desc: "Configure Instagram Messaging API credentials including App ID and App Secret from Meta Developer Console." },
      { num: 4, title: "DM Automation Setup", desc: "Set up automated welcome messages, quick replies, and away messages for your Instagram DMs." },
    ],
  },
  {
    id: "line",
    name: "LINE Messaging",
    icon: "ri-line-line",
    color: "#00C300",
    description: "Connect your LINE Official Account to engage with customers across Asian markets through LINE's Messaging API.",
    steps: [
      { num: 1, title: "Create LINE Account", desc: "Register a LINE Official Account at LINE Developers Console with your business details." },
      { num: 2, title: "Channel Configuration", desc: "Create a Messaging API channel and obtain your Channel ID, Channel Secret, and Access Token." },
      { num: 3, title: "LIFF Integration", desc: "Set up LINE Front-end Framework (LIFF) for rich in-app web experiences within the LINE app." },
      { num: 4, title: "Rich Menu Designer", desc: "Design and upload a rich menu with tappable areas for quick customer actions and navigation." },
    ],
  },
  {
    id: "email",
    name: "Email Support",
    icon: "ri-mail-line",
    color: "#EA4335",
    description: "Connect your email inbox to manage customer support emails alongside all your messaging channels.",
    steps: [
      { num: 1, title: "Email Configuration", desc: "Configure your SMTP and IMAP settings to send and receive emails through OPSConnect." },
      { num: 2, title: "Forwarding Rules", desc: "Set up automatic forwarding rules to route customer emails into your unified inbox." },
      { num: 3, title: "Signature & Templates", desc: "Create email signatures and response templates for consistent brand communication." },
      { num: 4, title: "Spam Protection", desc: "Configure DKIM, SPF, and DMARC records to ensure high email deliverability and prevent spam." },
    ],
  },
  {
    id: "livechat",
    name: "Live Chat Widget",
    icon: "ri-chat-3-line",
    color: "#1E7FC2",
    description: "Embed a customizable live chat widget on your website to convert visitors into conversations instantly.",
    steps: [
      { num: 1, title: "Widget Customization", desc: "Customize your chat widget's colors, positioning, welcome message, and branding." },
      { num: 2, title: "Team Assignment", desc: "Configure routing rules to assign incoming chats to specific team members or departments." },
      { num: 3, title: "Proactive Triggers", desc: "Set up proactive chat invitations based on visitor behavior, time on page, or specific URLs." },
      { num: 4, title: "Offline Form", desc: "Design an offline contact form that captures leads when your team is away from the desk." },
    ],
  },
  {
    id: "wechat",
    name: "WeChat Official",
    icon: "ri-wechat-line",
    color: "#07C160",
    description: "Connect your WeChat Official Account to serve customers across China's essential messaging ecosystem.",
    steps: [
      { num: 1, title: "Account Verification", desc: "Verify your WeChat Official Account with business license and identity documents. Service accounts preferred for API access." },
      { num: 2, title: "Server Configuration", desc: "Configure your server URL, Token, and EncodingAESKey in the WeChat Official Account backend." },
      { num: 3, title: "Menu & Auto-Reply", desc: "Build custom menus, keyword auto-replies, and welcome messages for your followers." },
      { num: 4, title: "Mini Program Setup", desc: "Optionally link a WeChat Mini Program for richer in-app experiences and e-commerce capabilities." },
    ],
  },
];

export const apiEndpoints = [
  { method: "POST", path: "/api/v1/messages/send", description: "Send a message to any connected channel" },
  { method: "GET", path: "/api/v1/conversations", description: "List all conversations across channels" },
  { method: "POST", path: "/api/v1/webhooks/register", description: "Register a webhook for real-time events" },
  { method: "GET", path: "/api/v1/contacts", description: "Retrieve unified contact profiles" },
];

export const embedCodeExample = `<script>
(function(){
  if(document.getElementById('_omniWidget'))return;
  var style=document.createElement('style');
  style.textContent='._ow_btn{position:fixed;bottom:24px;right:24px;z-index:2147483647;width:56px;height:56px;border-radius:50%;background:#1E7FC2;box-shadow:0 4px 16px rgba(30,127,194,.35);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .2s,box-shadow .2s}'+
  '._ow_btn:hover{transform:scale(1.08);box-shadow:0 6px 24px rgba(30,127,194,.5)}'+
  '._ow_btn svg{width:24px;height:24px;fill:#fff}'+
  '._ow_pnl{position:fixed;bottom:92px;right:24px;z-index:2147483646;width:380px;max-width:calc(100vw-32px);height:520px;max-height:calc(100vh-140px);background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.15);display:none;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}'+
  '._ow_pnl._ow_open{display:flex;animation:_ow_in .25s ease}'+
  '._ow_hdr{background:linear-gradient(135deg,#1B3F73,#2E9FDE);padding:20px;color:#fff;display:flex;align-items:center;gap:12px;flex-shrink:0}'+
  '._ow_ava{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px}'+
  '._ow_hdr_info{flex:1}._ow_hdr_info strong{display:block;font-size:14px}._ow_hdr_info span{font-size:11px;opacity:.85}'+
  '._ow_close{background:none;border:none;color:#fff;font-size:22px;cursor:pointer;padding:4px;opacity:.8;line-height:1}'+
  '._ow_close:hover{opacity:1}._ow_body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#f9fafb}'+
  '._ow_bubble{max-width:85%;padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.5;word-break:break-word}'+
  '._ow_bot{background:#e5e7eb;color:#1f2937;align-self:flex-start;border-bottom-left-radius:4px}'+
  '._ow_user{background:#1E7FC2;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}'+
  '._ow_ftr{display:flex;align-items:center;gap:8px;padding:12px 16px;border-top:1px solid #e5e7eb;flex-shrink:0;background:#fff}'+
  '._ow_ftr input{flex:1;border:none;outline:none;font-size:13px;padding:10px 0;background:transparent;color:#1f2937}'+
  '._ow_ftr input::placeholder{color:#9ca3af}'+
  '._ow_send{width:38px;height:38px;border-radius:50%;background:#1E7FC2;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .2s}'+
  '._ow_send:hover{background:#FF5722}._ow_send svg{width:16px;height:16px;fill:#fff}'+
  '@keyframes _ow_in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}';
  document.head.appendChild(style);
  var btn=document.createElement('div');btn.className='_ow_btn';btn.id='_omniWidget';
  btn.innerHTML='<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/><path d="M7 9h10v2H7zm0 3h7v2H7z"/></svg>';
  var pnl=document.createElement('div');pnl.className='_ow_pnl';
  pnl.innerHTML='<div class="_ow_hdr"><div class="_ow_ava">O</div><div class="_ow_hdr_info"><strong>OPSConnect</strong><span>We reply within minutes</span></div><button class="_ow_close">&times;</button></div><div class="_ow_body"><div class="_ow_bubble _ow_bot">Hi there! 👋 Welcome to OPSConnect. How can we help you today?</div></div><div class="_ow_ftr"><input type="text" placeholder="Type a message..." maxlength="500"><button class="_ow_send"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button></div>';
  document.body.appendChild(btn);document.body.appendChild(pnl);
  var isOpen=false,input=pnl.querySelector('input'),body=pnl.querySelector('._ow_body');
  function toggle(){isOpen=!isOpen;pnl.classList.toggle('_ow_open',isOpen);btn.innerHTML=isOpen?'<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>':'<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/><path fill="#fff" d="M7 9h10v2H7zm0 3h7v2H7z"/></svg>';if(isOpen)input.focus();}
  btn.addEventListener('click',toggle);
  pnl.querySelector('._ow_close').addEventListener('click',function(e){e.stopPropagation();isOpen=false;pnl.classList.remove('_ow_open');btn.innerHTML='<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/><path fill="#fff" d="M7 9h10v2H7zm0 3h7v2H7z"/></svg>';});
  function addBubble(txt,isUser){
    var d=document.createElement('div');d.className='_ow_bubble '+(isUser?'_ow_user':'_ow_bot');d.textContent=txt;body.appendChild(d);body.scrollTop=body.scrollHeight;
  }
  function send(){
    var txt=input.value.trim();if(!txt)return;addBubble(txt,true);input.value='';input.focus();
    var replies=["Thanks for your message! OPSConnect helps businesses unify all their messaging channels in one place.","That's a great question. OPSConnect supports WhatsApp, Messenger, Instagram, Telegram, LINE, Email, Live Chat, and WeChat — all in one dashboard.","We appreciate your interest in OPSConnect! Our platform includes AI chatbots, shared team inboxes, real-time translation, and advanced analytics.","I'd be happy to help with that. Can you share a bit more detail about what you're looking to set up?","Thanks for reaching out! Setting up channels on OPSConnect takes just a few minutes — check out our Partners page for step-by-step guides."];
    setTimeout(function(){addBubble(replies[Math.floor(Math.random()*replies.length)],false)},1000+Math.random()*1500);
  }
  pnl.querySelector('._ow_send').addEventListener('click',send);
  input.addEventListener('keydown',function(e){if(e.key==='Enter')send();});
})();
<\/script>`;