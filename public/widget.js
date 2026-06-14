/**
 * OmniConnect Embeddable Chat Widget
 *
 * Usage:
 *   <script src="https://your-domain.com/widget.js"
 *     data-partner-id="PART-XXXX-XXXX"
 *     data-name="Your Business"
 *     data-avatar="YB"
 *     data-color-from="#0099FF"
 *     data-color-to="#A033FF"
 *     data-api="https://<project>.supabase.co/functions/v1"
 *     data-messenger="https://m.me/yourpage"
 *     data-whatsapp="1234567890"
 *     data-telegram="yourusername"
 *     data-line="your-line-id"
 *     data-instagram="yourusername"
 *     data-email="hello@yourbusiness.com">
 *   </script>
 *
 * All data-* attributes are optional — omit any you don't need.
 * Social links are hidden automatically when not provided.
 */
(function () {
  if (document.getElementById('_oc_widget_root')) return;

  // ── Config: read from this <script> tag's data-* attributes ──────────────
  var me = document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName('script');
      return scripts[scripts.length - 1];
    })();

  function attr(key, fallback) {
    var v = me && me.getAttribute('data-' + key);
    return v !== null && v !== '' ? v : fallback;
  }

  var cfg = {
    partnerId:   attr('partner-id',  ''),
    name:        attr('name',        'Support'),
    avatar:      attr('avatar',      '?'),
    colorFrom:   attr('color-from',  '#0099FF'),
    colorTo:     attr('color-to',    '#A033FF'),
    api:         attr('api',         ''),
    messenger:   attr('messenger',   ''),
    whatsapp:    attr('whatsapp',    ''),
    telegram:    attr('telegram',    ''),
    line:        attr('line',        ''),
    instagram:   attr('instagram',   ''),
    email:       attr('email',       ''),
    greeting:    attr('greeting',    ''),
  };

  var gradient = 'linear-gradient(135deg,' + cfg.colorFrom + ',' + cfg.colorTo + ')';
  var greeting = cfg.greeting ||
    'Hi there! 👋 Welcome to ' + cfg.name + '. Please share your name, email or phone number, and what you want to ask about. We’ll notify the business team on this website automatically.';

  // ── Styles ────────────────────────────────────────────────────────────────
  var css = document.createElement('style');
  css.textContent =
    '#_oc_widget_root{position:fixed;bottom:24px;right:24px;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;display:flex;flex-direction:column;align-items:flex-end;gap:12px}' +
    '#_ocw_btn{width:60px;height:60px;border-radius:50%;background:' + gradient + ';border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,.25);transition:transform .2s}' +
    '#_ocw_btn:hover{transform:scale(1.1)}' +
    '#_ocw_panel{display:none;flex-direction:column;width:360px;max-width:calc(100vw - 48px);height:520px;max-height:calc(100vh - 110px);background:#fff;border-radius:20px;box-shadow:0 8px 40px rgba(0,0,0,.18);overflow:hidden}' +
    '#_ocw_panel.open{display:flex;animation:_ocw_in .25s ease}' +
    '@keyframes _ocw_in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}' +
    '#_ocw_hdr{background:' + gradient + ';padding:16px 18px;display:flex;align-items:center;gap:12px;flex-shrink:0}' +
    '#_ocw_ava{width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;color:#fff;flex-shrink:0}' +
    '#_ocw_info{flex:1}#_ocw_info strong{display:block;color:#fff;font-size:15px;font-weight:700}' +
    '#_ocw_online{font-size:12px;color:rgba(255,255,255,.9);display:flex;align-items:center;gap:5px;margin-top:2px}' +
    '#_ocw_online::before{content:"";width:7px;height:7px;background:#4ade80;border-radius:50%;display:inline-block}' +
    '#_ocw_close{background:none;border:none;color:rgba(255,255,255,.8);font-size:24px;cursor:pointer;line-height:1;padding:0 4px}' +
    '#_ocw_close:hover{color:#fff}' +
    '#_ocw_social{background:#f0f4ff;padding:10px 14px;display:flex;gap:8px;flex-shrink:0;flex-wrap:wrap}' +
    '#_ocw_social:empty{display:none}' +
    '._ocw_sc{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:20px;text-decoration:none;font-size:11px;font-weight:700;color:#fff;white-space:nowrap}' +
    '#_ocw_msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#f7f8fc}' +
    '._ocw_bot{background:#fff;color:#1f2937;padding:10px 14px;border-radius:18px 18px 18px 4px;font-size:13px;line-height:1.5;max-width:82%;box-shadow:0 1px 4px rgba(0,0,0,.08);align-self:flex-start}' +
    '._ocw_usr{background:' + gradient + ';color:#fff;padding:10px 14px;border-radius:18px 18px 4px 18px;font-size:13px;line-height:1.5;max-width:82%;align-self:flex-end}' +
    '._ocw_dots{display:flex;gap:4px;align-items:center;padding:10px 14px;background:#fff;border-radius:18px 18px 18px 4px;align-self:flex-start;box-shadow:0 1px 4px rgba(0,0,0,.08)}' +
    '._ocw_dots span{width:7px;height:7px;background:#bbb;border-radius:50%;animation:_ocw_dot 1.2s infinite}' +
    '._ocw_dots span:nth-child(2){animation-delay:.2s}._ocw_dots span:nth-child(3){animation-delay:.4s}' +
    '@keyframes _ocw_dot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}' +
    '#_ocw_ftr{display:flex;align-items:center;gap:8px;padding:10px 14px;border-top:1px solid #e5e7eb;background:#fff;flex-shrink:0}' +
    '#_ocw_inp{flex:1;border:1.5px solid #e5e7eb;border-radius:24px;padding:9px 16px;font-size:13px;outline:none;transition:border .2s;background:#f9fafb;color:#111}' +
    '#_ocw_inp:focus{border-color:' + cfg.colorFrom + ';background:#fff}' +
    '#_ocw_snd{width:40px;height:40px;border-radius:50%;background:' + gradient + ';border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}' +
    '#_ocw_snd:hover{opacity:.85}#_ocw_snd:disabled{opacity:.4;cursor:default}';
  document.head.appendChild(css);

  // ── Build social links HTML ───────────────────────────────────────────────
  function socialLink(href, bg, icon, label) {
    return '<a class="_ocw_sc" href="' + href + '" target="_blank" rel="noopener" style="background:' + bg + '">' + icon + label + '</a>';
  }

  var messengerIcon  = '<svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.26L19.752 8l-6.561 6.963z"/></svg>';
  var whatsappIcon   = '<svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
  var telegramIcon   = '<svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>';
  var lineIcon       = '<svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>';
  var instagramIcon  = '<svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>';
  var emailIcon      = '<svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>';

  var socialHTML = '';
  function normalizeUrl(val, base) {
    if (!val) return '';
    var v = val.trim().replace(/^@/, '');
    if (/^https?:\/\//i.test(v) || /^mailto:/i.test(v)) return v;
    if (/^[a-zA-Z0-9-]+\.[a-zA-Z]+\//.test(v)) return 'https://' + v;
    return base + v;
  }

  if (cfg.messenger) socialHTML += socialLink(normalizeUrl(cfg.messenger, 'https://m.me/'),           gradient,   messengerIcon,  'Messenger');
  if (cfg.whatsapp)  socialHTML += socialLink(normalizeUrl(cfg.whatsapp,  'https://wa.me/'),           '#25D366',  whatsappIcon,   'WhatsApp');
  if (cfg.telegram)  socialHTML += socialLink(normalizeUrl(cfg.telegram,  'https://t.me/'),            '#229ED9',  telegramIcon,   'Telegram');
  if (cfg.line)      socialHTML += socialLink(normalizeUrl(cfg.line,      'https://line.me/ti/p/~'),   '#00C300',  lineIcon,       'LINE');
  if (cfg.instagram) socialHTML += socialLink(normalizeUrl(cfg.instagram, 'https://ig.me/m/'),         '#E4405F',  instagramIcon,  'Instagram');
  if (cfg.email)     socialHTML += socialLink(normalizeUrl(cfg.email,     'mailto:'),                  '#EA4335',  emailIcon,      'Email');

  // ── DOM ───────────────────────────────────────────────────────────────────
  var root = document.createElement('div');
  root.id = '_oc_widget_root';
  root.innerHTML =
    '<div id="_ocw_panel">' +
      '<div id="_ocw_hdr">' +
        '<div id="_ocw_ava">' + cfg.avatar + '</div>' +
        '<div id="_ocw_info"><strong>' + cfg.name + '</strong><div id="_ocw_online">Online now</div></div>' +
        '<button id="_ocw_close" title="Close">&times;</button>' +
      '</div>' +
      '<div id="_ocw_social">' + socialHTML + '</div>' +
      '<div id="_ocw_msgs"></div>' +
      '<div id="_ocw_ftr">' +
        '<input id="_ocw_inp" type="text" placeholder="Type a message…" maxlength="500">' +
        '<button id="_ocw_snd"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>' +
      '</div>' +
    '</div>' +
    '<button id="_ocw_btn" title="Chat with us">' +
      '<svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/></svg>' +
    '</button>';
  document.body.appendChild(root);

  // ── State & logic ─────────────────────────────────────────────────────────
  var panel  = document.getElementById(‘_ocw_panel’);
  var msgs   = document.getElementById(‘_ocw_msgs’);
  var inp    = document.getElementById(‘_ocw_inp’);
  var snd    = document.getElementById(‘_ocw_snd’);
  var isOpen = false;

  // ‘chat’            → AI is answering questions
  // ‘collect_name’    → AI triggered escalation; collecting visitor name
  // ‘collect_contact’ → collecting visitor contact (email/phone)
  var step         = ‘chat’;
  var chatHistory  = [];   // [{role, content}] sent to /ai-chat for context
  var lastQuestion = ‘’;   // the visitor’s last message before escalation was triggered
  var visitorName  = ‘’;
  var visitorContact = ‘’;

  function addMsg(text, isUser) {
    var d = document.createElement(‘div’);
    d.className = isUser ? ‘_ocw_usr’ : ‘_ocw_bot’;
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showDots() {
    var t = document.createElement(‘div’);
    t.className = ‘_ocw_dots’;
    t.innerHTML = ‘<span></span><span></span><span></span>’;
    msgs.appendChild(t);
    msgs.scrollTop = msgs.scrollHeight;
    return t;
  }

  function removeDots(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  // Show typing dots for a fixed delay then call cb
  function botDelay(text, cb) {
    var t = showDots();
    setTimeout(function () { removeDots(t); if (text) addMsg(text, false); if (cb) cb(); inp.focus(); }, 750);
  }

  function toggle() {
    isOpen = !isOpen;
    panel.classList.toggle(‘open’, isOpen);
    if (isOpen && chatHistory.length === 0) {
      botDelay(‘Hi there! 👋 I\’m ‘ + cfg.name + ‘\’s AI assistant. How can I help you today?’);
    }
    if (isOpen) inp.focus();
  }

  function afterContactSubmit(ok) {
    botDelay(
      ok
        ? ‘Got it! Our team will follow up with you at ‘ + visitorContact + ‘. Feel free to keep chatting if you have more questions!’
        : ‘Sorry, something went wrong. Please try again.’,
      function () {
        if (ok) { step = ‘chat’; }          // allow continued chatting after escalation
        else    { step = ‘collect_contact’; } // retry
        inp.disabled = false;
        snd.disabled = false;
      }
    );
  }

  function send() {
    var txt = inp.value.trim();
    if (!txt || inp.disabled) return;
    addMsg(txt, true);
    inp.value = ‘’;

    // ── Collecting name after AI escalation ──────────────────────────────────
    if (step === ‘collect_name’) {
      visitorName = txt;
      step = ‘collect_contact’;
      botDelay(‘Thanks, ‘ + visitorName + ‘! What email address or phone number should we use to reach you?’);
      return;
    }

    // ── Collecting contact, then saving to support_requests ──────────────────
    if (step === ‘collect_contact’) {
      visitorContact = txt;
      inp.disabled = true;
      snd.disabled = true;
      if (cfg.api) {
        fetch(cfg.api + ‘/chat-support’, {
          method: ‘POST’,
          headers: { ‘Content-Type’: ‘application/json’ },
          body: JSON.stringify({
            partner_id:      cfg.partnerId,
            visitor_name:    visitorName,
            visitor_contact: visitorContact,
            message:         lastQuestion,
          })
        }).then(function (r) { afterContactSubmit(r.ok); }).catch(function () { afterContactSubmit(false); });
      } else {
        afterContactSubmit(true);
      }
      return;
    }

    // ── Main AI chat ─────────────────────────────────────────────────────────
    if (!cfg.api) {
      botDelay(‘Please reach out to us via the contact channels above — we\’d love to help!’);
      return;
    }

    inp.disabled = true;
    snd.disabled = true;
    lastQuestion = txt;

    var historySnapshot = chatHistory.slice();
    var dots = showDots();

    fetch(cfg.api + ‘/ai-chat’, {
      method: ‘POST’,
      headers: { ‘Content-Type’: ‘application/json’ },
      body: JSON.stringify({
        partner_id: cfg.partnerId,
        message:    txt,
        history:    historySnapshot,
      })
    })
    .then(function (r) {
      if (!r.ok) throw new Error(‘HTTP ‘ + r.status);
      return r.json();
    })
    .then(function (data) {
      removeDots(dots);
      var reply = data.reply || ‘I\’m not sure about that. Let me connect you with our team.’;
      chatHistory.push({ role: ‘user’,      content: txt   });
      chatHistory.push({ role: ‘assistant’, content: reply });
      if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
      addMsg(reply, false);

      if (data.collect_info) {
        step = ‘collect_name’;
        botDelay(‘To connect you with our team, may I have your name first?’, function () {
          inp.disabled = false;
          snd.disabled = false;
        });
      } else {
        inp.disabled = false;
        snd.disabled = false;
        inp.focus();
      }
    })
    .catch(function () {
      removeDots(dots);
      addMsg(‘Sorry, I\’m having trouble right now. Please try again or use the contact links above.’, false);
      inp.disabled = false;
      snd.disabled = false;
    });
  }

  document.getElementById(‘_ocw_btn’).addEventListener(‘click’, toggle);
  document.getElementById(‘_ocw_close’).addEventListener(‘click’, toggle);
  snd.addEventListener(‘click’, send);
  inp.addEventListener(‘keydown’, function (e) { if (e.key === ‘Enter’) send(); });
})();
