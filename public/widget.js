/**
 * OPSConnect Embeddable Chat Widget
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
 */
(function () {
  if (document.getElementById('_oc_widget_root')) return;

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
    partnerId:  attr('partner-id',  ''),
    name:       attr('name',        'Support'),
    avatar:     attr('avatar',      '?'),
    colorFrom:  attr('color-from',  '#0099FF'),
    colorTo:    attr('color-to',    '#A033FF'),
    api:        attr('api',         ''),
    messenger:  attr('messenger',   ''),
    whatsapp:   attr('whatsapp',    ''),
    telegram:   attr('telegram',    ''),
    line:       attr('line',        ''),
    instagram:  attr('instagram',   ''),
    email:      attr('email',       ''),
  };

  var G = 'linear-gradient(135deg,' + cfg.colorFrom + ',' + cfg.colorTo + ')';

  // ── Styles ────────────────────────────────────────────────────────
  var css = document.createElement('style');
  css.textContent =
    '#_oc_widget_root{position:fixed;bottom:24px;right:24px;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;display:flex;flex-direction:column;align-items:flex-end;gap:12px}' +
    '#_ocw_btn{width:60px;height:60px;border-radius:50%;background:' + G + ';border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,.25);transition:transform .2s}' +
    '#_ocw_btn:hover{transform:scale(1.1)}' +
    // Panel: header + body side by side
    '#_ocw_panel{display:none;flex-direction:column;width:400px;max-width:calc(100vw - 48px);height:540px;max-height:calc(100vh - 110px);background:#fff;border-radius:20px;box-shadow:0 8px 40px rgba(0,0,0,.18);overflow:hidden}' +
    '#_ocw_panel.open{display:flex;animation:_ocw_in .25s ease}' +
    '@keyframes _ocw_in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}' +
    // Header
    '#_ocw_hdr{background:' + G + ';padding:13px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0}' +
    '#_ocw_ava{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;color:#fff;flex-shrink:0}' +
    '#_ocw_info{flex:1;min-width:0}' +
    '#_ocw_info strong{display:block;color:#fff;font-size:14px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '#_ocw_sublbl{font-size:11px;color:rgba(255,255,255,.85);margin-top:1px;display:flex;align-items:center;gap:4px}' +
    '#_ocw_sublbl::before{content:"";width:6px;height:6px;background:#4ade80;border-radius:50%;display:inline-block;flex-shrink:0}' +
    '#_ocw_close{background:none;border:none;color:rgba(255,255,255,.75);font-size:22px;cursor:pointer;line-height:1;padding:0 2px;flex-shrink:0}' +
    '#_ocw_close:hover{color:#fff}' +
    // Body = sidebar + main
    '#_ocw_body{display:flex;flex:1;overflow:hidden}' +
    // Left sidebar
    '#_ocw_sb{width:54px;border-right:1px solid #efefef;display:flex;flex-direction:column;align-items:center;padding:8px 0;gap:2px;background:#f9f9fb;flex-shrink:0;overflow-y:auto}' +
    '._ocw_sbi{width:40px;height:40px;border-radius:11px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#b0b8c4;text-decoration:none;transition:all .15s;position:relative;flex-shrink:0;background:transparent}' +
    '._ocw_sbi:hover{background:#f0f2f5;color:#374151}' +
    '._ocw_sbi.active{background:' + G + ';color:#fff;box-shadow:0 2px 8px rgba(0,0,0,.15)}' +
    '._ocw_sbd{width:30px;height:1px;background:#e8eaed;margin:5px 0;flex-shrink:0}' +
    // Main content area
    '#_ocw_main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}' +
    // Messages containers
    '._ocw_msgs{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;background:#f7f8fc}' +
    // Bubbles
    '._ocw_bot{background:#fff;color:#1f2937;padding:9px 13px;border-radius:16px 16px 16px 4px;font-size:13px;line-height:1.5;max-width:90%;box-shadow:0 1px 3px rgba(0,0,0,.07);align-self:flex-start}' +
    '._ocw_usr{background:' + G + ';color:#fff;padding:9px 13px;border-radius:16px 16px 4px 16px;font-size:13px;line-height:1.5;max-width:90%;align-self:flex-end}' +
    '._ocw_sys{background:rgba(0,0,0,.05);color:#6b7280;padding:6px 14px;border-radius:20px;font-size:11px;text-align:center;align-self:center;font-weight:500}' +
    // Typing dots
    '._ocw_dots{display:flex;gap:4px;align-items:center;padding:10px 13px;background:#fff;border-radius:16px 16px 16px 4px;align-self:flex-start;box-shadow:0 1px 3px rgba(0,0,0,.07)}' +
    '._ocw_dots span{width:6px;height:6px;background:#bbb;border-radius:50%;animation:_ocw_dot 1.2s infinite}' +
    '._ocw_dots span:nth-child(2){animation-delay:.2s}._ocw_dots span:nth-child(3){animation-delay:.4s}' +
    '@keyframes _ocw_dot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}' +
    // Footer input row
    '._ocw_ftr{display:flex;align-items:center;gap:8px;padding:10px 12px;border-top:1px solid #e8eaed;background:#fff;flex-shrink:0}' +
    '._ocw_inp{flex:1;border:1.5px solid #e5e7eb;border-radius:22px;padding:8px 14px;font-size:13px;outline:none;transition:border .2s;background:#f9fafb;color:#111}' +
    '._ocw_inp:focus{border-color:' + cfg.colorFrom + ';background:#fff}' +
    '._ocw_snd{width:38px;height:38px;border-radius:50%;background:' + G + ';border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}' +
    '._ocw_snd:hover{opacity:.85}._ocw_snd:disabled{opacity:.35;cursor:default}' +
    // Quick-reply topic chips
    '._ocw_chips{display:flex;flex-wrap:wrap;gap:6px;padding:6px 12px 10px;background:#f7f8fc}' +
    '._ocw_chip{padding:7px 14px;border-radius:20px;border:1.5px solid ' + cfg.colorFrom + ';color:' + cfg.colorFrom + ';background:#fff;font-size:12px;font-weight:500;cursor:pointer;transition:all .15s;white-space:nowrap}' +
    '._ocw_chip:hover{background:' + G + ';color:#fff;border-color:transparent}' +
    // Live agent idle card
    '#_ocw_lv_idle{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px 24px;text-align:center;gap:14px;background:#f7f8fc}' +
    '#_ocw_lv_idle .lv_ico{width:60px;height:60px;border-radius:50%;background:' + G + ';display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,.15);color:#fff}' +
    '#_ocw_lv_idle h3{font-size:15px;font-weight:700;color:#111827;margin:0}' +
    '#_ocw_lv_idle p{font-size:12px;color:#6b7280;margin:0;line-height:1.6;max-width:220px}' +
    '#_ocw_lv_connect{padding:10px 28px;border-radius:24px;background:' + G + ';border:none;cursor:pointer;color:#fff;font-size:13px;font-weight:600;box-shadow:0 2px 10px rgba(0,0,0,.15);transition:opacity .15s}' +
    '#_ocw_lv_connect:hover{opacity:.88}';
  document.head.appendChild(css);

  // ── SVG icons ─────────────────────────────────────────────────────
  var SEND_ICO     = '<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
  var TOGGLE_ICO   = '<svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/></svg>';
  var AI_ICO       = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>';
  var LIVE_ICO     = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h1v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-2v8h1c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/></svg>';
  var LIVE_BIG_ICO = '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h1v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-2v8h1c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/></svg>';
  var MSG_ICO      = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.26L19.752 8l-6.561 6.963z"/></svg>';
  var WA_ICO       = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
  var TG_ICO       = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>';
  var LN_ICO       = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>';
  var IG_ICO       = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>';
  var EM_ICO       = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>';

  // ── Normalize URLs ────────────────────────────────────────────────
  function normalizeUrl(val, base) {
    if (!val) return '#';
    var v = val.trim().replace(/^@/, '');
    if (/^https?:\/\//i.test(v) || /^mailto:/i.test(v)) return v;
    if (/^[a-zA-Z0-9-]+\.[a-zA-Z]+\//.test(v)) return 'https://' + v;
    return base + v;
  }

  // ── Build sidebar ─────────────────────────────────────────────────
  var sbHTML =
    '<div id="_ocw_sb">' +
      '<button class="_ocw_sbi active" id="_ocw_tab_ai" title="AI Chatbot">'  + AI_ICO   + '</button>' +
      '<button class="_ocw_sbi"        id="_ocw_tab_lv" title="Live Agent">'  + LIVE_ICO + '</button>';

  var chHTML = '';
  if (cfg.messenger)  chHTML += '<a class="_ocw_sbi" href="' + normalizeUrl(cfg.messenger, 'https://m.me/')           + '" target="_blank" rel="noopener" title="Messenger">' + MSG_ICO + '</a>';
  if (cfg.whatsapp)   chHTML += '<a class="_ocw_sbi" href="' + normalizeUrl(cfg.whatsapp,  'https://wa.me/')           + '" target="_blank" rel="noopener" title="WhatsApp">'  + WA_ICO  + '</a>';
  if (cfg.telegram)   chHTML += '<a class="_ocw_sbi" href="' + normalizeUrl(cfg.telegram,  'https://t.me/')            + '" target="_blank" rel="noopener" title="Telegram">'   + TG_ICO  + '</a>';
  if (cfg.line)       chHTML += '<a class="_ocw_sbi" href="' + normalizeUrl(cfg.line,      'https://line.me/ti/p/~')   + '" target="_blank" rel="noopener" title="LINE">'       + LN_ICO  + '</a>';
  if (cfg.instagram)  chHTML += '<a class="_ocw_sbi" href="' + normalizeUrl(cfg.instagram, 'https://ig.me/m/')         + '" target="_blank" rel="noopener" title="Instagram">'  + IG_ICO  + '</a>';
  if (cfg.email)      chHTML += '<a class="_ocw_sbi" href="' + normalizeUrl(cfg.email,     'mailto:')                  + '" rel="noopener" title="Email">'                       + EM_ICO  + '</a>';
  if (chHTML) sbHTML += '<div class="_ocw_sbd"></div>' + chHTML;
  sbHTML += '</div>';

  // ── DOM ───────────────────────────────────────────────────────────
  var root = document.createElement('div');
  root.id = '_oc_widget_root';
  root.innerHTML =
    '<div id="_ocw_panel">' +
      '<div id="_ocw_hdr">' +
        '<div id="_ocw_ava">' + cfg.avatar + '</div>' +
        '<div id="_ocw_info">' +
          '<strong>' + cfg.name + '</strong>' +
          '<div id="_ocw_sublbl">AI Assistant · Online now</div>' +
        '</div>' +
        '<button id="_ocw_close" title="Close">&times;</button>' +
      '</div>' +
      '<div id="_ocw_body">' +
        sbHTML +
        '<div id="_ocw_main">' +

          // ── AI Chat panel ──────────────────────────────────────
          '<div id="_ocw_ai" style="display:flex;flex:1;flex-direction:column;overflow:hidden">' +
            '<div id="_ocw_ai_msgs" class="_ocw_msgs"></div>' +
            '<div id="_ocw_chips_wrap" style="display:none;flex-shrink:0"></div>' +
            '<div class="_ocw_ftr">' +
              '<input id="_ocw_ai_inp" class="_ocw_inp" type="text" placeholder="Ask me anything…" maxlength="500" disabled>' +
              '<button id="_ocw_ai_snd" class="_ocw_snd" disabled>' + SEND_ICO + '</button>' +
            '</div>' +
          '</div>' +

          // ── Live Agent panel ───────────────────────────────────
          '<div id="_ocw_lv" style="display:none;flex:1;flex-direction:column;overflow:hidden">' +
            // Idle / connect card
            '<div id="_ocw_lv_idle" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px 24px;text-align:center;gap:14px;background:#f7f8fc">' +
              '<div class="lv_ico">' + LIVE_BIG_ICO + '</div>' +
              '<h3 style="font-size:15px;font-weight:700;color:#111827;margin:0">Talk to a Live Agent</h3>' +
              '<p style="font-size:12px;color:#6b7280;margin:0;line-height:1.6;max-width:200px">Connect directly with the ' + cfg.name + ' support team for personalized help.</p>' +
              '<button id="_ocw_lv_connect">Connect Now</button>' +
            '</div>' +
            // Live chat area (shown after connecting)
            '<div id="_ocw_lv_chat" style="display:none;flex:1;flex-direction:column;overflow:hidden">' +
              '<div id="_ocw_lv_msgs" class="_ocw_msgs"></div>' +
              '<div class="_ocw_ftr">' +
                '<input id="_ocw_lv_inp" class="_ocw_inp" type="text" placeholder="Message the agent…" maxlength="500" disabled>' +
                '<button id="_ocw_lv_snd" class="_ocw_snd" disabled>' + SEND_ICO + '</button>' +
              '</div>' +
            '</div>' +
          '</div>' +

        '</div>' +
      '</div>' +
    '</div>' +
    '<button id="_ocw_btn" title="Chat with us">' + TOGGLE_ICO + '</button>';
  document.body.appendChild(root);

  // ── State ─────────────────────────────────────────────────────────
  var panel      = document.getElementById('_ocw_panel');
  var sublbl     = document.getElementById('_ocw_sublbl');
  var isOpen     = false;
  var activeTab  = 'ai';

  // AI
  var aiPanel    = document.getElementById('_ocw_ai');
  var aiMsgs     = document.getElementById('_ocw_ai_msgs');
  var chipsWrap  = document.getElementById('_ocw_chips_wrap');
  var aiInp      = document.getElementById('_ocw_ai_inp');
  var aiSnd      = document.getElementById('_ocw_ai_snd');
  var aiHistory  = [];
  var lastQ      = '';
  var aiStarted  = false;
  var pendingTopics = null;   // topics fetched but waiting for greeting to finish

  // Live
  var lvPanel    = document.getElementById('_ocw_lv');
  var lvIdle     = document.getElementById('_ocw_lv_idle');
  var lvChat     = document.getElementById('_ocw_lv_chat');
  var lvMsgs     = document.getElementById('_ocw_lv_msgs');
  var lvInp      = document.getElementById('_ocw_lv_inp');
  var lvSnd      = document.getElementById('_ocw_lv_snd');
  var liveStep      = 'idle';   // 'idle' | 'collect_name' | 'collect_contact' | 'connecting' | 'connected'
  var liveChatId    = null;
  var pollSince     = null;
  var pollTimer     = null;
  var visitorName   = '';
  var visitorContact = '';

  // ── Helpers ───────────────────────────────────────────────────────
  function msgEl(text, isUser) {
    var d = document.createElement('div');
    d.className = isUser ? '_ocw_usr' : '_ocw_bot';
    d.textContent = text;
    var w = document.createElement('div');
    w.style.cssText = 'display:flex;flex-direction:column;align-items:' + (isUser ? 'flex-end' : 'flex-start') + ';margin-bottom:2px';
    w.appendChild(d);
    return w;
  }

  function sysEl(text) {
    var d = document.createElement('div');
    d.className = '_ocw_sys';
    d.textContent = text;
    return d;
  }

  function appendScroll(container, el) {
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }

  function addAiMsg(text, isUser) { appendScroll(aiMsgs, msgEl(text, isUser)); }
  function addLvMsg(text, isUser, label) {
    var w = msgEl(text, isUser);
    if (label && !isUser) {
      var lbl = document.createElement('span');
      lbl.style.cssText = 'font-size:10px;color:#9ca3af;margin-bottom:2px;padding:0 4px';
      lbl.textContent = label;
      w.insertBefore(lbl, w.firstChild);
    }
    appendScroll(lvMsgs, w);
  }
  function addLvSys(text) { appendScroll(lvMsgs, sysEl(text)); }

  function showDots(container) {
    var t = document.createElement('div');
    t.className = '_ocw_dots';
    t.innerHTML = '<span></span><span></span><span></span>';
    appendScroll(container, t);
    return t;
  }
  function rmDots(el) { if (el && el.parentNode) el.parentNode.removeChild(el); }

  function botSay(container, text, cb) {
    var t = showDots(container);
    setTimeout(function () { rmDots(t); appendScroll(container, msgEl(text, false)); if (cb) cb(); }, 750);
  }

  // ── Topic chips ───────────────────────────────────────────────────
  function showChips(topics) {
    if (!topics || !topics.length) return;
    chipsWrap.innerHTML = '';
    var row = document.createElement('div');
    row.className = '_ocw_chips';
    topics.forEach(function (label) {
      var btn = document.createElement('button');
      btn.className = '_ocw_chip';
      btn.textContent = label;
      btn.addEventListener('click', function () {
        hideChips();
        aiInp.value = label;
        sendAi();
      });
      row.appendChild(btn);
    });
    chipsWrap.appendChild(row);
    chipsWrap.style.display = 'block';
  }

  function hideChips() {
    chipsWrap.style.display = 'none';
    chipsWrap.innerHTML = '';
    pendingTopics = null;
  }

  function fetchTopics() {
    if (!cfg.api || !cfg.partnerId) return;
    fetch(cfg.api + '/widget-init?partner_id=' + encodeURIComponent(cfg.partnerId))
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var topics = data.topics || [];
        if (!topics.length) return;
        if (aiStarted) {
          // Greeting already shown — show chips now
          showChips(topics);
        } else {
          // Greeting not shown yet — hold topics until after greeting
          pendingTopics = topics;
        }
      })
      .catch(function () {});
  }

  // ── Tab switching ─────────────────────────────────────────────────
  function switchTab(tab) {
    activeTab = tab;
    document.getElementById('_ocw_tab_ai').classList.toggle('active', tab === 'ai');
    document.getElementById('_ocw_tab_lv').classList.toggle('active', tab === 'lv');
    aiPanel.style.display = tab === 'ai' ? 'flex' : 'none';
    lvPanel.style.display = tab === 'lv' ? 'flex' : 'none';

    if (tab === 'ai') {
      sublbl.textContent = 'AI Assistant · Online now';
      if (!aiInp.disabled) aiInp.focus();
    } else {
      sublbl.textContent = 'Live Agent · Online now';
      if (liveStep === 'idle' && cfg.api) {
        autoConnect();
      } else if (liveStep === 'connected') {
        if (!lvInp.disabled) lvInp.focus();
        if (!pollTimer) startPolling();
      }
    }
  }

  // ── Polling ───────────────────────────────────────────────────────
  function startPolling() {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(function () {
      if (!liveChatId || !cfg.api) return;
      var url = cfg.api + '/live-chat?action=poll&chat_id=' + liveChatId;
      if (pollSince) url += '&since=' + encodeURIComponent(pollSince);
      fetch(url)
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (!data.messages || !data.messages.length) return;
          data.messages.forEach(function (m) {
            addLvMsg(m.content, false, (m.sender_name || 'Agent') + ' · Support');
          });
          pollSince = data.messages[data.messages.length - 1].created_at;
        })
        .catch(function () {});
    }, 3000);
  }
  function stopPolling() { if (pollTimer) { clearInterval(pollTimer); pollTimer = null; } }

  // ── Live connect: start collection flow ──────────────────────────
  function autoConnect() {
    if (liveStep !== 'idle') return;
    liveStep = 'collect_name';
    lvIdle.style.display = 'none';
    lvChat.style.display = 'flex';
    lvInp.disabled = false;
    lvSnd.disabled = false;
    botSay(lvMsgs, 'Sure! Before connecting you, may I have your name?', function () {
      lvInp.placeholder = 'Your name…';
      lvInp.focus();
    });
  }

  function doConnect() {
    liveStep = 'connecting';
    lvInp.disabled = true;
    lvSnd.disabled = true;
    addLvSys('Connecting you to a live agent…');

    fetch(cfg.api + '/live-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action:          'start',
        partner_id:      cfg.partnerId,
        visitor_name:    visitorName,
        visitor_contact: visitorContact,
        initial_message: lastQ || 'Visitor requested live agent support',
        ai_history:      aiHistory.slice(-20),
      })
    })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (!data.chat_id) throw new Error('no chat_id');
      liveChatId = data.chat_id;
      pollSince  = new Date().toISOString();
      liveStep   = 'connected';
      addLvSys('✅ Connected! A support agent will reply here shortly.');
      lvInp.placeholder = 'Message the agent…';
      lvInp.disabled = false;
      lvSnd.disabled = false;
      lvInp.focus();
      startPolling();
    })
    .catch(function () {
      addLvSys('Could not connect right now. Please try again or use a channel below.');
      liveStep = 'idle';
      lvIdle.style.display = 'flex';
      lvChat.style.display = 'none';
    });
  }

  // ── Send live message (handles collection steps + live chat) ─────
  function sendLive() {
    var txt = lvInp.value.trim();
    if (!txt || lvInp.disabled) return;
    addLvMsg(txt, true);
    lvInp.value = '';

    if (liveStep === 'collect_name') {
      visitorName = txt;
      liveStep = 'collect_contact';
      botSay(lvMsgs, 'Thanks, ' + visitorName + '! What\'s your email address or phone number so the agent can follow up with you?', function () {
        lvInp.placeholder = 'Email or phone…';
        lvInp.focus();
      });
      return;
    }

    if (liveStep === 'collect_contact') {
      visitorContact = txt;
      lvInp.placeholder = 'Message the agent…';
      doConnect();
      return;
    }

    if (liveStep === 'connected' && liveChatId && cfg.api) {
      fetch(cfg.api + '/live-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'message', chat_id: liveChatId, content: txt, visitor_name: visitorName })
      }).catch(function () {});
    }
  }

  // ── Send AI message ───────────────────────────────────────────────
  function sendAi() {
    var txt = aiInp.value.trim();
    if (!txt || aiInp.disabled) return;
    addAiMsg(txt, true);
    aiInp.value = '';
    lastQ = txt;

    if (!cfg.api) {
      botSay(aiMsgs, 'Please reach out via the channel icons in the sidebar!', null);
      return;
    }

    aiInp.disabled = true;
    aiSnd.disabled = true;
    var snap = aiHistory.slice();
    var dots = showDots(aiMsgs);

    fetch(cfg.api + '/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partner_id: cfg.partnerId, message: txt, history: snap })
    })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (data) {
      rmDots(dots);
      var reply = data.reply || 'Let me connect you with our support team.';
      aiHistory.push({ role: 'user',      content: txt   });
      aiHistory.push({ role: 'assistant', content: reply });
      if (aiHistory.length > 20) aiHistory = aiHistory.slice(-20);
      addAiMsg(reply, false);
      aiInp.disabled = false;
      aiSnd.disabled = false;
      if (data.collect_info) {
        aiInp.disabled = false;
        aiSnd.disabled = false;
        // Auto-switch to live agent tab to begin collection
        setTimeout(function () { switchTab('lv'); }, 900);
      } else {
        aiInp.focus();
      }
    })
    .catch(function () {
      rmDots(dots);
      addAiMsg('Sorry, I\'m having trouble right now. Please try again or use the channel links.', false);
      aiInp.disabled = false;
      aiSnd.disabled = false;
    });
  }

  // ── Toggle panel ──────────────────────────────────────────────────
  function toggle() {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    if (isOpen) {
      // Show AI greeting on first open
      if (!aiStarted && activeTab === 'ai') {
        aiStarted = true;
        fetchTopics();   // start fetching in parallel
        botSay(aiMsgs, 'Hi there! 👋 I\'m ' + cfg.name + '\'s AI assistant. How can I help you today?', function () {
          aiInp.disabled = false;
          aiSnd.disabled = false;
          aiInp.focus();
          // Show chips that arrived while greeting was animating
          if (pendingTopics) { showChips(pendingTopics); pendingTopics = null; }
        });
      } else if (activeTab === 'ai' && !aiInp.disabled) {
        aiInp.focus();
      }
      if (activeTab === 'lv' && liveStep === 'connected' && !pollTimer) startPolling();
    } else {
      stopPolling();
    }
  }

  // ── Events ────────────────────────────────────────────────────────
  document.getElementById('_ocw_btn').addEventListener('click', toggle);
  document.getElementById('_ocw_close').addEventListener('click', toggle);
  document.getElementById('_ocw_tab_ai').addEventListener('click', function () { switchTab('ai'); });
  document.getElementById('_ocw_tab_lv').addEventListener('click', function () { switchTab('lv'); });
  document.getElementById('_ocw_lv_connect').addEventListener('click', function () { if (cfg.api) autoConnect(); });
  aiSnd.addEventListener('click', function () { hideChips(); sendAi(); });
  aiInp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { hideChips(); sendAi(); } });
  aiInp.addEventListener('input', function () { if (aiInp.value.trim()) hideChips(); });
  lvSnd.addEventListener('click', sendLive);
  lvInp.addEventListener('keydown', function (e) { if (e.key === 'Enter') sendLive(); });
})();
