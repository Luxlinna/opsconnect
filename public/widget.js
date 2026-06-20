/**
 * OPSConnect Embeddable Chat Widget
 *
 * Usage:
 *   <script src="https://your-domain.com/widget.js"
 *     data-partner-id="PART-XXXX-XXXX"
 *     data-name="Your Business"
 *     data-avatar="YB"
 *     data-color-from="#24396D"
 *     data-color-to="#38BDEB"
 *     data-api="https://<project>.supabase.co/functions/v1"
 *     data-lang="km"
 *     data-messenger="https://m.me/yourpage"
 *     data-whatsapp="1234567890"
 *     data-telegram="yourusername"
 *     data-line="your-line-id"
 *     data-instagram="yourusername"
 *     data-email="hello@yourbusiness.com">
 *   </script>
 *
 *  data-lang is optional — auto-detected from browser language if omitted.
 *  Visitors can also switch language using the globe icon in the widget sidebar.
 *  Supported: en, km, zh, ja, ko, th, vi, id, fr, es
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
    colorFrom:  attr('color-from',  '#24396D'),
    colorTo:    attr('color-to',    '#38BDEB'),
    api:        attr('api',         ''),
    lang:       attr('lang',        ''),
    messenger:  attr('messenger',   ''),
    whatsapp:   attr('whatsapp',    ''),
    telegram:   attr('telegram',    ''),
    line:       attr('line',        ''),
    instagram:  attr('instagram',   ''),
    email:      attr('email',       ''),
  };

  // ── Language detection ─────────────────────────────────────────────
  var rawLang = cfg.lang || (navigator.language || 'en');
  var lang = rawLang.toLowerCase().split('-')[0];

  // ── Translations ───────────────────────────────────────────────────
  var T = {
    en: {
      sublbl_ai:               'AI Assistant · Online now',
      sublbl_lv:               'Live Agent · Online now',
      sublbl_lang:             'Select Language',
      ai_placeholder:          'Ask me anything…',
      lv_title:                'Talk to a Live Agent',
      lv_desc:                 'Connect directly with the {name} support team for personalized help.',
      lv_connect:              'Connect Now',
      lv_placeholder_name:     'Your name…',
      lv_placeholder_contact:  'Email or phone…',
      lv_placeholder_agent:    'Message the agent…',
      ask_name:                'Sure! Before connecting you, may I have your name?',
      ask_contact:             'Thanks, {name}! What\'s your email address or phone number so the agent can follow up with you?',
      connecting:              'Connecting you to a live agent…',
      connected:               '✅ Connected! A support agent will reply here shortly.',
      connect_failed:          'Could not connect right now. Press Send to try again.',
      retry_placeholder:       'Press Send to retry…',
      greeting:                'Hi there! 👋 I\'m {name}\'s AI assistant. How can I help you today?',
      error:                   'Sorry, I\'m having trouble right now. Please try again or use the channel links.',
      no_api:                  'Please reach out via the channel icons in the sidebar!',
      chip_fallback:           'Here is the information about {topic}. For more details please type your question below.',
    },
    km: {
      sublbl_ai:               'AI · អនឡាញ',
      sublbl_lv:               'ភ្នាក់ងារ · អនឡាញ',
      sublbl_lang:             'ជ្រើសរើសភាសា',
      ai_placeholder:          'សួរខ្ញុំអ្វីក៏បាន…',
      lv_title:                'ពិគ្រោះជាមួយភ្នាក់ងារ',
      lv_desc:                 'ភ្ជាប់ទំនាក់ទំនងជាមួយក្រុមផ្ដល់ជំនួយ {name}។',
      lv_connect:              'ភ្ជាប់ឥឡូវ',
      lv_placeholder_name:     'ឈ្មោះរបស់អ្នក…',
      lv_placeholder_contact:  'អ៊ីមែល ឬ ទូរស័ព្ទ…',
      lv_placeholder_agent:    'ផ្ញើសារទៅភ្នាក់ងារ…',
      ask_name:                'បានហើយ! មុននឹងភ្ជាប់ តើខ្ញុំអាចដឹងឈ្មោះអ្នកបានទេ?',
      ask_contact:             'អរគុណ {name}! សូមផ្ដល់អ៊ីមែល ឬ លេខទូរស័ព្ទ ដើម្បីភ្នាក់ងារទំនាក់ទំនងមកវិញ?',
      connecting:              'កំពុងភ្ជាប់ជាមួយភ្នាក់ងារ…',
      connected:               '✅ ភ្ជាប់ជោគជ័យ! ភ្នាក់ងារនឹងឆ្លើយក្នុងពេលឆាប់ៗ។',
      connect_failed:          'មិនអាចភ្ជាប់បានពេលនេះ។ ចុចផ្ញើ ដើម្បីព្យាយាមម្ដងទៀត។',
      retry_placeholder:       'ចុចផ្ញើ ដើម្បីព្យាយាមម្ដងទៀត…',
      greeting:                'សួស្ដី! 👋 ខ្ញុំជា AI Assistant របស់ {name}។ តើខ្ញុំអាចជួយអ្នកដូចម្ដេច?',
      error:                   'សូមអភ័យទោស! មានបញ្ហាបច្ចេកទេស។ សូមព្យាយាមម្ដងទៀត ឬប្រើតំណភ្ជាប់ក្នុងប្រអប់ចំហៀង។',
      no_api:                  'សូមទំនាក់ទំនងតាមរូបតំណាងបណ្ដាញក្នុងប្រអប់ចំហៀង!',
      chip_fallback:           'នេះជាព័ត៌មានអំពី {topic}។ សម្រាប់ព័ត៌មានបន្ថែម សូមវាយសំណួររបស់អ្នកខាងក្រោម។',
    },
    zh: {
      sublbl_ai:               'AI 助手 · 在线',
      sublbl_lv:               '在线客服 · 在线',
      sublbl_lang:             '选择语言',
      ai_placeholder:          '有什么可以帮您…',
      lv_title:                '联系人工客服',
      lv_desc:                 '直接与 {name} 支持团队联系，获得个性化帮助。',
      lv_connect:              '立即连接',
      lv_placeholder_name:     '您的姓名…',
      lv_placeholder_contact:  '电子邮件或电话…',
      lv_placeholder_agent:    '向客服发送消息…',
      ask_name:                '好的！连接之前，请问您的姓名是？',
      ask_contact:             '谢谢，{name}！请提供您的电子邮件或电话，以便客服跟进。',
      connecting:              '正在连接人工客服…',
      connected:               '✅ 已连接！客服人员将很快回复您。',
      connect_failed:          '当前无法连接。请按发送重试。',
      retry_placeholder:       '按发送重试…',
      greeting:                '您好！👋 我是 {name} 的 AI 助手，有什么可以帮您？',
      error:                   '抱歉，目前遇到了一些问题。请重试或使用频道链接。',
      no_api:                  '请通过左侧栏的频道图标联系我们！',
      chip_fallback:           '以下是关于 {topic} 的信息。如需了解更多，请在下方输入您的问题。',
    },
    ja: {
      sublbl_ai:               'AIアシスタント · オンライン',
      sublbl_lv:               '担当者 · オンライン',
      sublbl_lang:             '言語を選択',
      ai_placeholder:          '何でも聴いてください…',
      lv_title:                '担当者に相談する',
      lv_desc:                 '{name}のサポートチームに直接つながり、個別サポートを受けられます。',
      lv_connect:              '今すぐつながる',
      lv_placeholder_name:     'お名前…',
      lv_placeholder_contact:  'メールまたは電話番号…',
      lv_placeholder_agent:    'エージェントにメッセージ…',
      ask_name:                '承知しました！つなぐ前に、お名前を教えていただけますか？',
      ask_contact:             'ありがとうございます、{name}さん！担当者がご連絡できるよう、メールアドレスまたは電話番号を教えてください。',
      connecting:              '担当者につないでいます…',
      connected:               '✅ 接続しました！担当者がすぐに返答いたします。',
      connect_failed:          '現在つなげません。送信ボタンを押して再試行してください。',
      retry_placeholder:       '送信ボタンで再試行…',
      greeting:                'こんにちは！👋 {name}のAIアシスタントです。何かお手伝いできますか？',
      error:                   '申し訳ございません、現在問題が発生しています。再試行するか、チャンネルリンクをご利用ください。',
      no_api:                  'サイドバーのチャンネルアイコンからお問い合わせください！',
      chip_fallback:           '{topic}に関する情報です。詳細については、下に質問を入力してください。',
    },
    ko: {
      sublbl_ai:               'AI 어시스턴트 · 온라인',
      sublbl_lv:               '상담원 · 온라인',
      sublbl_lang:             '언어 선택',
      ai_placeholder:          '무었이든 물어보세요…',
      lv_title:                '실시간 상담원 연결',
      lv_desc:                 '{name} 지원팀과 직접 연결하여 맞춤 도움을 받으세요.',
      lv_connect:              '지금 연결하기',
      lv_placeholder_name:     '이름을 입력하세요…',
      lv_placeholder_contact:  '이메일 또는 전화번호…',
      lv_placeholder_agent:    '상담원에게 메시지 보내기…',
      ask_name:                '알겠습니다! 연결하기 전에 성함을 알 수 있을까요?',
      ask_contact:             '감사합니다, {name}님! 상담원이 연락드릴 수 있도록 이메일 또는 전화번호를 알려주세요.',
      connecting:              '상담원과 연결 중…',
      connected:               '✅ 연결되었습니다! 상담원이 곳 답변드립니다.',
      connect_failed:          '현재 연결할 수 없습니다. 전송 버튼을 눌러 다시 시도하세요.',
      retry_placeholder:       '전송 버튼으로 재시도…',
      greeting:                '안녕하세요! 👋 {name}의 AI 어시스턴트입니다. 무었을 도와드릴까요?',
      error:                   '죄송합니다, 현재 문제가 발생했습니다. 다시 시도하거나 채널 링크를 이용해 주세요.',
      no_api:                  '사이드바의 채널 아이콘을 통해 문의해 주세요!',
      chip_fallback:           '{topic}에 대한 정보입니다. 자세한 내용은 아래에 질문을 입력하세요.',
    },
    th: {
      sublbl_ai:               'AI · ออนไลน์',
      sublbl_lv:               'เจ้าหน้าที่ · ออนไลน์',
      sublbl_lang:             'เลือกภาษา',
      ai_placeholder:          'ถามอะไรก็ได้…',
      lv_title:                'พูดคุยกับเจ้าหน้าที่',
      lv_desc:                 'ติดต่อโดยตรงกับทีมสนับสนุน {name} เพื่อรับความช่วยเหลือส่วนตัว',
      lv_connect:              'เชื่อมต่อเดี๋ยวนี้',
      lv_placeholder_name:     'ชื่อของคุณ…',
      lv_placeholder_contact:  'อีเมลหรือเบอร์โทร…',
      lv_placeholder_agent:    'ส่งข้อความถึงเจ้าหน้าที่…',
      ask_name:                'ได้เลย! ก่อนเชื่อมต่อ ขอทราบชื่อของคุณได้ไหม?',
      ask_contact:             'ขอบคุณ {name}! กรุณาให้อีเมลหรือเบอร์โทรศัพท์ เพื่อให้เจ้าหน้าที่ติดต่อกลับ',
      connecting:              'กำลังเชื่อมต่อกับเจ้าหน้าที่…',
      connected:               '✅ เชื่อมต่อแล้ว! เจ้าหน้าที่จะตอบกลับในไม่ช้า',
      connect_failed:          'ไม่สามารถเชื่อมต่อได้ในขณะนี้ กดส่งเพื่อลองใหม่',
      retry_placeholder:       'กดส่งเพื่อลองใหม่…',
      greeting:                'สวัสดี! 👋 ฉันคือ AI Assistant ของ {name} มีอะไรให้ช่วยไหม?',
      error:                   'ขอโทษ ขณะนี้มีปัญหาทางเทคนิค กรุณาลองใหม่หรือใช้ลิงก์ช่องทาง',
      no_api:                  'กรุณาติดต่อผ่านไอคอนช่องทางในแถบด้านข้าง!',
      chip_fallback:           'นี่คือข้อมูลเกี่ยวกับ {topic} สำหรับรายละเอียดเพิ่มเติม กรุณาพิมพ์คำถามด้านล่าง',
    },
    vi: {
      sublbl_ai:               'Trợ lý AI · Trực tuyến',
      sublbl_lv:               'Nhân viên · Trực tuyến',
      sublbl_lang:             'Chọn ngôn ngữ',
      ai_placeholder:          'Hỏi tôi bất cứ điều gì…',
      lv_title:                'Nói chuyện với nhân viên',
      lv_desc:                 'Kết nối trực tiếp với đội ngũ hỗ trợ {name} để được giúp đỡ cá nhân.',
      lv_connect:              'Kết nối ngay',
      lv_placeholder_name:     'Tên của bạn…',
      lv_placeholder_contact:  'Email hoặc số điện thoại…',
      lv_placeholder_agent:    'Nhắn tin cho nhân viên…',
      ask_name:                'Được rồi! Trước khi kết nối, tôi có thể biết tên bạn không?',
      ask_contact:             'Cảm ơn {name}! Bạn có thể cho địa chỉ email hoặc số điện thoại để nhân viên liên hệ lại không?',
      connecting:              'Đang kết nối với nhân viên…',
      connected:               '✅ Đã kết nối! Nhân viên sẽ trả lời bạn trong giây lát.',
      connect_failed:          'Không thể kết nối lúc này. Nhấn Gửi để thử lại.',
      retry_placeholder:       'Nhấn Gửi để thử lại…',
      greeting:                'Xin chào! 👋 Tôi là trợ lý AI của {name}. Tôi có thể giúp gì cho bạn?',
      error:                   'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại hoặc sử dụng các liên kết kênh.',
      no_api:                  'Vui lòng liên hệ qua các biểu tượng kênh ở thanh bên!',
      chip_fallback:           'Đây là thông tin về {topic}. Để biết thêm chi tiết, hãy nhập câu hỏi của bạn bên dưới.',
    },
    id: {
      sublbl_ai:               'Asisten AI · Online',
      sublbl_lv:               'Agen Langsung · Online',
      sublbl_lang:             'Pilih Bahasa',
      ai_placeholder:          'Tanyakan apa saja…',
      lv_title:                'Bicara dengan Agen Langsung',
      lv_desc:                 'Terhubung langsung dengan tim dukungan {name} untuk bantuan personal.',
      lv_connect:              'Hubungkan Sekarang',
      lv_placeholder_name:     'Nama Anda…',
      lv_placeholder_contact:  'Email atau nomor telepon…',
      lv_placeholder_agent:    'Pesan untuk agen…',
      ask_name:                'Baik! Sebelum menghubungkan Anda, boleh saya tahu nama Anda?',
      ask_contact:             'Terima kasih, {name}! Apa alamat email atau nomor telepon Anda agar agen dapat menghubungi Anda?',
      connecting:              'Menghubungkan Anda ke agen langsung…',
      connected:               '✅ Terhubung! Agen akan membalas sebentar lagi.',
      connect_failed:          'Tidak dapat terhubung sekarang. Tekan Kirim untuk mencoba lagi.',
      retry_placeholder:       'Tekan Kirim untuk mencoba lagi…',
      greeting:                'Halo! 👋 Saya asisten AI dari {name}. Bagaimana saya bisa membantu Anda?',
      error:                   'Maaf, saya sedang mengalami masalah. Silakan coba lagi atau gunakan tautan saluran.',
      no_api:                  'Silakan hubungi melalui ikon saluran di bilah samping!',
      chip_fallback:           'Berikut adalah informasi tentang {topic}. Untuk detail lebih lanjut, ketik pertanyaan Anda di bawah.',
    },
    fr: {
      sublbl_ai:               "Assistant IA · En ligne",
      sublbl_lv:               "Agent en direct · En ligne",
      sublbl_lang:             "Choisir la langue",
      ai_placeholder:          "Posez-moi une question…",
      lv_title:                "Parler à un agent",
      lv_desc:                 "Connectez-vous directement avec l'équipe de support {name} pour une aide personnalisée.",
      lv_connect:              "Se connecter maintenant",
      lv_placeholder_name:     "Votre nom…",
      lv_placeholder_contact:  "E-mail ou téléphone…",
      lv_placeholder_agent:    "Message à l'agent…",
      ask_name:                "Bien sûr ! Avant de vous connecter, puis-je avoir votre nom ?",
      ask_contact:             "Merci, {name} ! Quelle est votre adresse e-mail ou votre numéro de téléphone ?",
      connecting:              "Connexion à un agent en direct…",
      connected:               "✅ Connecté ! Un agent vous répondra sous peu.",
      connect_failed:          "Impossible de se connecter pour le moment. Appuyez sur Envoyer pour réessayer.",
      retry_placeholder:       "Appuyez sur Envoyer pour réessayer…",
      greeting:                "Bonjour ! 👋 Je suis l'assistant IA de {name}. Comment puis-je vous aider ?",
      error:                   "Désolé, je rencontre des difficultés. Veuillez réessayer ou utiliser les liens de canaux.",
      no_api:                  "Veuillez nous contacter via les icônes de canaux dans la barre latérale !",
      chip_fallback:           "Voici les informations sur {topic}. Pour plus de détails, saisissez votre question ci-dessous.",
    },
    es: {
      sublbl_ai:               'Asistente IA · En línea',
      sublbl_lv:               'Agente en vivo · En línea',
      sublbl_lang:             'Seleccionar idioma',
      ai_placeholder:          'Pregúntame lo que sea…',
      lv_title:                'Hablar con un agente',
      lv_desc:                 'Conéctate directamente con el equipo de soporte de {name} para ayuda personalizada.',
      lv_connect:              'Conectar ahora',
      lv_placeholder_name:     'Tu nombre…',
      lv_placeholder_contact:  'Correo o teléfono…',
      lv_placeholder_agent:    'Mensaje al agente…',
      ask_name:                '¡Claro! Antes de conectarte, ¿puedo saber tu nombre?',
      ask_contact:             '¡Gracias, {name}! ¿Cuál es tu correo electrónico o número de teléfono para que el agente pueda contactarte?',
      connecting:              'Conectándote con un agente en vivo…',
      connected:               '✅ ¡Conectado! Un agente te responderá en breve.',
      connect_failed:          'No se puede conectar ahora. Presiona Enviar para intentarlo de nuevo.',
      retry_placeholder:       'Presiona Enviar para reintentar…',
      greeting:                '¡Hola! 👋 Soy el asistente de IA de {name}. ¿En qué puedo ayudarte?',
      error:                   'Lo siento, estoy teniendo problemas ahora mismo. Inténtalo de nuevo o usa los enlaces de canales.',
      no_api:                  '¡Por favor, contáctanos mediante los iconos de canales en la barra lateral!',
      chip_fallback:           'Aquí está la información sobre {topic}. Para más detalles, escribe tu pregunta a continuación.',
    },
  };

  function t(key, vars) {
    var locale = T[lang] ? lang : 'en';
    var str = (T[locale] && T[locale][key]) || T['en'][key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        str = str.split('{' + k + '}').join(vars[k]);
      });
    }
    return str;
  }

  // ── Language names (shown in their own script) ─────────────────────
  var LANG_NAMES = {
    en: 'English', km: 'ខ្មែរ', zh: '中文', ja: '日本語',
    ko: '한국어',  th: 'ภาษาไทย', vi: 'Tiếng Việt',
    id: 'Indonesia', fr: 'Français', es: 'Español',
  };

  var G = 'linear-gradient(135deg,' + cfg.colorFrom + ',' + cfg.colorTo + ')';

  // ── Styles ────────────────────────────────────────────────────────
  var css = document.createElement('style');
  css.textContent =
    '#_oc_widget_root{position:fixed;bottom:24px;right:24px;z-index:2147483647;font-family:"Kantumruy Pro","Source Sans 3",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;display:flex;flex-direction:column;align-items:flex-end;gap:12px}' +
    '#_ocw_btn{width:60px;height:60px;border-radius:50%;background:' + G + ';border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,.25);transition:transform .2s}' +
    '#_ocw_btn:hover{transform:scale(1.1)}' +
    '#_ocw_panel{display:none;flex-direction:column;width:400px;max-width:calc(100vw - 48px);height:540px;max-height:calc(100vh - 110px);background:#fff;border-radius:20px;box-shadow:0 8px 40px rgba(0,0,0,.18);overflow:hidden}' +
    '#_ocw_panel.open{display:flex;animation:_ocw_in .25s ease}' +
    '@keyframes _ocw_in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}' +
    '#_ocw_hdr{background:' + G + ';padding:13px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0}' +
    '#_ocw_ava{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;color:#fff;flex-shrink:0}' +
    '#_ocw_info{flex:1;min-width:0}' +
    '#_ocw_info strong{display:block;color:#fff;font-size:14px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '#_ocw_sublbl{font-size:11px;color:rgba(255,255,255,.85);margin-top:1px;display:flex;align-items:center;gap:4px}' +
    '#_ocw_sublbl::before{content:"";width:6px;height:6px;background:#4ade80;border-radius:50%;display:inline-block;flex-shrink:0}' +
    '#_ocw_close{background:none;border:none;color:rgba(255,255,255,.75);font-size:22px;cursor:pointer;line-height:1;padding:0 2px;flex-shrink:0}' +
    '#_ocw_close:hover{color:#fff}' +
    '#_ocw_hdr_lang{background:none;border:none;color:rgba(255,255,255,.7);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:4px;border-radius:8px;flex-shrink:0;transition:all .15s}' +
    '#_ocw_hdr_lang:hover{color:#fff;background:rgba(255,255,255,.15)}' +
    '#_ocw_hdr_lang.active{color:#fff;background:rgba(255,255,255,.25)}' +
    '#_ocw_body{display:flex;flex:1;overflow:hidden}' +
    '#_ocw_sb{width:54px;border-right:1px solid #efefef;display:flex;flex-direction:column;align-items:center;padding:8px 0;gap:2px;background:#f9f9fb;flex-shrink:0;overflow-y:auto}' +
    '._ocw_sbi{width:40px;height:40px;border-radius:11px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#b0b8c4;text-decoration:none;transition:all .15s;position:relative;flex-shrink:0;background:transparent}' +
    '._ocw_sbi:hover{background:#f0f2f5;color:#374151}' +
    '._ocw_sbi.active{background:' + G + ';color:#fff;box-shadow:0 2px 8px rgba(0,0,0,.15)}' +
    '._ocw_sbd{width:30px;height:1px;background:#e8eaed;margin:5px 0;flex-shrink:0}' +
    '#_ocw_main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}' +
    '._ocw_msgs{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;background:#f7f8fc}' +
    '._ocw_bot{background:#fff;color:#1f2937;padding:9px 13px;border-radius:16px 16px 16px 4px;font-size:13px;line-height:1.5;max-width:90%;box-shadow:0 1px 3px rgba(0,0,0,.07);align-self:flex-start}' +
    '._ocw_usr{background:' + G + ';color:#fff;padding:9px 13px;border-radius:16px 16px 4px 16px;font-size:13px;line-height:1.5;max-width:90%;align-self:flex-end}' +
    '._ocw_sys{background:rgba(0,0,0,.05);color:#6b7280;padding:6px 14px;border-radius:20px;font-size:11px;text-align:center;align-self:center;font-weight:500}' +
    '._ocw_dots{display:flex;gap:4px;align-items:center;padding:10px 13px;background:#fff;border-radius:16px 16px 16px 4px;align-self:flex-start;box-shadow:0 1px 3px rgba(0,0,0,.07)}' +
    '._ocw_dots span{width:6px;height:6px;background:#bbb;border-radius:50%;animation:_ocw_dot 1.2s infinite}' +
    '._ocw_dots span:nth-child(2){animation-delay:.2s}._ocw_dots span:nth-child(3){animation-delay:.4s}' +
    '@keyframes _ocw_dot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}' +
    '._ocw_ftr{display:flex;align-items:center;gap:8px;padding:10px 12px;border-top:1px solid #e8eaed;background:#fff;flex-shrink:0}' +
    '._ocw_inp{flex:1;border:1.5px solid #e5e7eb;border-radius:22px;padding:8px 14px;font-size:13px;outline:none;transition:border .2s;background:#f9fafb;color:#111}' +
    '._ocw_inp:focus{border-color:' + cfg.colorFrom + ';background:#fff}' +
    '._ocw_snd{width:38px;height:38px;border-radius:50%;background:' + G + ';border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}' +
    '._ocw_snd:hover{opacity:.85}._ocw_snd:disabled{opacity:.35;cursor:default}' +
    '._ocw_chips{display:flex;flex-wrap:wrap;gap:5px;padding:5px 12px 8px;background:#f7f8fc;border-top:1px solid #eef0f3}' +
    '._ocw_chip{padding:4px 10px;border-radius:14px;border:1.5px solid ' + cfg.colorFrom + ';color:' + cfg.colorFrom + ';background:#fff;font-size:11px;font-weight:500;cursor:pointer;transition:all .15s;white-space:nowrap;line-height:1.4}' +
    '._ocw_chip:hover{background:' + G + ';color:#fff;border-color:transparent}' +
    '._ocw_chip.active{background:' + G + ';color:#fff;border-color:transparent}' +
    '#_ocw_lv_idle{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px 24px;text-align:center;gap:14px;background:#f7f8fc}' +
    '#_ocw_lv_idle .lv_ico{width:60px;height:60px;border-radius:50%;background:' + G + ';display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,.15);color:#fff}' +
    '#_ocw_lv_idle h3{font-size:15px;font-weight:700;color:#111827;margin:0}' +
    '#_ocw_lv_idle p{font-size:12px;color:#6b7280;margin:0;line-height:1.6;max-width:220px}' +
    '#_ocw_lv_connect{padding:10px 28px;border-radius:24px;background:' + G + ';border:none;cursor:pointer;color:#fff;font-size:13px;font-weight:600;box-shadow:0 2px 10px rgba(0,0,0,.15);transition:opacity .15s}' +
    '#_ocw_lv_connect:hover{opacity:.88}' +
    // Language panel
    '#_ocw_lang_panel{flex:1;display:none;flex-direction:column;overflow:hidden;background:#f7f8fc}' +
    '#_ocw_lang_hdr{padding:14px 16px 10px;border-bottom:1px solid #e8eaed;background:#fff;flex-shrink:0}' +
    '#_ocw_lang_hdr span{font-size:13px;font-weight:600;color:#374151}' +
    '#_ocw_lang_list{flex:1;overflow-y:auto;padding:8px 6px}' +
    '._ocw_lang_opt{width:100%;text-align:left;padding:10px 14px;border:none;border-radius:10px;background:transparent;cursor:pointer;font-size:13px;color:#374151;display:flex;align-items:center;justify-content:space-between;transition:background .12s;font-family:inherit}' +
    '._ocw_lang_opt:hover{background:#eef0f4}' +
    '._ocw_lang_opt.active{background:' + G + ';color:#fff;font-weight:600}';
  document.head.appendChild(css);

  // ── SVG icons ─────────────────────────────────────────────────────
  var SEND_ICO     = '<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
  var TOGGLE_ICO   = '<svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/></svg>';
  var AI_ICO       = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>';
  var LIVE_ICO     = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h1v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-2v8h1c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/></svg>';
  var LIVE_BIG_ICO = '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h1v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-2v8h1c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/></svg>';
  var LANG_ICO     = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>';
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

  // ── Build language option list ─────────────────────────────────────
  var langOptsHTML = Object.keys(LANG_NAMES).map(function (code) {
    var isActive = code === lang;
    return '<button class="_ocw_lang_opt' + (isActive ? ' active' : '') + '" data-lang="' + code + '">' +
      LANG_NAMES[code] +
      (isActive ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>' : '') +
      '</button>';
  }).join('');

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
          '<div id="_ocw_sublbl">' + t('sublbl_ai') + '</div>' +
        '</div>' +
        '<button id="_ocw_hdr_lang" title="Language">' + LANG_ICO + '</button>' +
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
              '<input id="_ocw_ai_inp" class="_ocw_inp" type="text" placeholder="' + t('ai_placeholder') + '" maxlength="500" disabled>' +
              '<button id="_ocw_ai_snd" class="_ocw_snd" disabled>' + SEND_ICO + '</button>' +
            '</div>' +
          '</div>' +

          // ── Live Agent panel ───────────────────────────────────
          '<div id="_ocw_lv" style="display:none;flex:1;flex-direction:column;overflow:hidden">' +
            '<div id="_ocw_lv_idle" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px 24px;text-align:center;gap:14px;background:#f7f8fc">' +
              '<div class="lv_ico">' + LIVE_BIG_ICO + '</div>' +
              '<h3 id="_ocw_lv_title" style="font-size:15px;font-weight:700;color:#111827;margin:0">' + t('lv_title') + '</h3>' +
              '<p id="_ocw_lv_desc" style="font-size:12px;color:#6b7280;margin:0;line-height:1.6;max-width:200px">' + t('lv_desc', { name: cfg.name }) + '</p>' +
              '<button id="_ocw_lv_connect">' + t('lv_connect') + '</button>' +
            '</div>' +
            '<div id="_ocw_lv_chat" style="display:none;flex:1;flex-direction:column;overflow:hidden">' +
              '<div id="_ocw_lv_msgs" class="_ocw_msgs"></div>' +
              '<div class="_ocw_ftr">' +
                '<input id="_ocw_lv_inp" class="_ocw_inp" type="text" placeholder="' + t('lv_placeholder_agent') + '" maxlength="500" disabled>' +
                '<button id="_ocw_lv_snd" class="_ocw_snd" disabled>' + SEND_ICO + '</button>' +
              '</div>' +
            '</div>' +
          '</div>' +

          // ── Language selector panel ────────────────────────────
          '<div id="_ocw_lang_panel">' +
            '<div id="_ocw_lang_hdr"><span id="_ocw_lang_title">' + t('sublbl_lang') + '</span></div>' +
            '<div id="_ocw_lang_list">' + langOptsHTML + '</div>' +
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
  var prevTab    = 'ai';   // tab to return to after language selection

  // AI
  var aiPanel    = document.getElementById('_ocw_ai');
  var aiMsgs     = document.getElementById('_ocw_ai_msgs');
  var chipsWrap  = document.getElementById('_ocw_chips_wrap');
  var aiInp      = document.getElementById('_ocw_ai_inp');
  var aiSnd      = document.getElementById('_ocw_ai_snd');
  var aiHistory  = [];
  var lastQ      = '';
  var aiStarted  = false;
  var pendingTopics = null;

  // Live
  var lvPanel    = document.getElementById('_ocw_lv');
  var lvIdle     = document.getElementById('_ocw_lv_idle');
  var lvChat     = document.getElementById('_ocw_lv_chat');
  var lvMsgs     = document.getElementById('_ocw_lv_msgs');
  var lvInp      = document.getElementById('_ocw_lv_inp');
  var lvSnd      = document.getElementById('_ocw_lv_snd');
  var lvTitleEl  = document.getElementById('_ocw_lv_title');
  var lvDescEl   = document.getElementById('_ocw_lv_desc');
  var lvConnectEl = document.getElementById('_ocw_lv_connect');
  var liveStep      = 'idle';
  var liveChatId    = null;
  var pollSince     = null;
  var pollTimer     = null;
  var visitorName   = '';
  var visitorContact = '';

  // Language panel
  var langPanel  = document.getElementById('_ocw_lang_panel');
  var langTitle  = document.getElementById('_ocw_lang_title');

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
    var td = document.createElement('div');
    td.className = '_ocw_dots';
    td.innerHTML = '<span></span><span></span><span></span>';
    appendScroll(container, td);
    return td;
  }
  function rmDots(el) { if (el && el.parentNode) el.parentNode.removeChild(el); }

  function botSay(container, text, cb) {
    var td = showDots(container);
    setTimeout(function () { rmDots(td); appendScroll(container, msgEl(text, false)); if (cb) cb(); }, 750);
  }

  // ── Language switcher ─────────────────────────────────────────────
  function changeLang(code) {
    lang = code;

    // Update header sublbl based on which content tab is active
    sublbl.textContent = t(prevTab === 'lv' ? 'sublbl_lv' : 'sublbl_ai');

    // Update AI input placeholder
    aiInp.placeholder = t('ai_placeholder');

    // Update live input placeholder based on current step
    if (liveStep === 'collect_name') {
      lvInp.placeholder = t('lv_placeholder_name');
    } else if (liveStep === 'collect_contact') {
      lvInp.placeholder = t('lv_placeholder_contact');
    } else if (liveStep === 'failed') {
      lvInp.placeholder = t('retry_placeholder');
    } else {
      lvInp.placeholder = t('lv_placeholder_agent');
    }

    // Update live-agent idle card
    lvTitleEl.textContent = t('lv_title');
    lvDescEl.textContent  = t('lv_desc', { name: cfg.name });
    lvConnectEl.textContent = t('lv_connect');

    // Update lang panel header
    langTitle.textContent = t('sublbl_lang');

    // Refresh checkmarks on lang options
    var opts = document.querySelectorAll('._ocw_lang_opt');
    var CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
    opts.forEach(function (btn) {
      var isNow = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', isNow);
      var existing = btn.querySelector('svg');
      if (existing) btn.removeChild(existing);
      if (isNow) btn.insertAdjacentHTML('beforeend', CHECK);
    });

    // Re-render greeting in new language if no user messages yet
    if (aiStarted && aiHistory.length === 0) {
      var savedTopics = widgetTopics.slice();
      aiMsgs.innerHTML = '';
      hideChips();
      aiInp.disabled = true;
      aiSnd.disabled = true;
      botSay(aiMsgs, t('greeting', { name: cfg.name }), function () {
        aiInp.disabled = false;
        aiSnd.disabled = false;
        if (savedTopics.length) showChips(savedTopics);
      });
    }

    // Return to the tab the user was on before opening language picker
    switchTab(prevTab);
  }

  // ── Topic chips ───────────────────────────────────────────────────
  var widgetTopics  = [];
  var activeChipEl  = null;

  function showChips(topics) {
    if (!topics || !topics.length) return;
    widgetTopics = topics;
    chipsWrap.innerHTML = '';
    var row = document.createElement('div');
    row.className = '_ocw_chips';
    topics.forEach(function (topic) {
      var label   = typeof topic === 'string' ? topic : topic.label;
      var content = typeof topic === 'string' ? null  : topic.content;
      var btn = document.createElement('button');
      btn.className = '_ocw_chip';
      btn.textContent = label;
      btn.addEventListener('click', function () {
        if (activeChipEl) activeChipEl.classList.remove('active');
        activeChipEl = btn;
        btn.classList.add('active');
        addAiMsg(label, true);

        // Route through AI when a non-English language is active so the response
        // comes back in the right language instead of the server's static English text
        if (cfg.api && cfg.partnerId && lang !== 'en') {
          aiInp.disabled = true;
          aiSnd.disabled = true;
          var snap = aiHistory.slice();
          var dots = showDots(aiMsgs);
          fetch(cfg.api + '/ai-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ partner_id: cfg.partnerId, message: label, history: snap, lang: lang })
          })
          .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
          .then(function (data) {
            rmDots(dots);
            var reply = data.reply || t('error');
            aiHistory.push({ role: 'user',      content: label });
            aiHistory.push({ role: 'assistant', content: reply });
            if (aiHistory.length > 20) aiHistory = aiHistory.slice(-20);
            appendScroll(aiMsgs, msgEl(reply, false));
            aiInp.disabled = false;
            aiSnd.disabled = false;
            if (data.collect_info) setTimeout(function () { switchTab('lv'); }, 900);
          })
          .catch(function () {
            rmDots(dots);
            appendScroll(aiMsgs, msgEl(t('error'), false));
            aiInp.disabled = false;
            aiSnd.disabled = false;
          });
        } else {
          var answer = content || null;
          var dots = showDots(aiMsgs);
          setTimeout(function () {
            rmDots(dots);
            var reply = answer || t('chip_fallback', { topic: label });
            appendScroll(aiMsgs, msgEl(reply, false));
            aiHistory.push({ role: 'user',      content: label });
            aiHistory.push({ role: 'assistant', content: reply });
            if (aiHistory.length > 20) aiHistory = aiHistory.slice(-20);
          }, 400);
        }
      });
      row.appendChild(btn);
    });
    chipsWrap.appendChild(row);
    chipsWrap.style.display = 'block';
  }

  function hideChips() {
    chipsWrap.style.display = 'none';
    chipsWrap.innerHTML = '';
    widgetTopics  = [];
    activeChipEl  = null;
    pendingTopics = null;
  }

  function fetchTopics() {
    if (!cfg.api || !cfg.partnerId) return;
    fetch(cfg.api + '/widget-init?partner_id=' + encodeURIComponent(cfg.partnerId))
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var topics = data.topics || [];
        if (!topics.length) return;
        if (aiStarted) { showChips(topics); } else { pendingTopics = topics; }
      })
      .catch(function () {});
  }

  // ── Tab switching ─────────────────────────────────────────────────
  function switchTab(tab) {
    activeTab = tab;
    document.getElementById('_ocw_tab_ai').classList.toggle('active', tab === 'ai');
    document.getElementById('_ocw_tab_lv').classList.toggle('active', tab === 'lv');
    document.getElementById('_ocw_hdr_lang').classList.toggle('active', tab === 'lang');
    aiPanel.style.display       = tab === 'ai'   ? 'flex' : 'none';
    lvPanel.style.display       = tab === 'lv'   ? 'flex' : 'none';
    langPanel.style.display     = tab === 'lang' ? 'flex' : 'none';

    if (tab === 'ai') {
      prevTab = 'ai';
      sublbl.textContent = t('sublbl_ai');
      if (!aiInp.disabled) aiInp.focus();
    } else if (tab === 'lv') {
      prevTab = 'lv';
      sublbl.textContent = t('sublbl_lv');
      if (liveStep === 'idle' && cfg.api) {
        autoConnect();
      } else if (liveStep === 'connected') {
        if (!lvInp.disabled) lvInp.focus();
        if (!pollTimer) startPolling();
      }
    } else if (tab === 'lang') {
      sublbl.textContent = t('sublbl_lang');
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

  // ── Live connect flow ─────────────────────────────────────────────
  function autoConnect() {
    if (liveStep !== 'idle') return;
    liveStep = 'collect_name';
    visitorName = '';
    visitorContact = '';
    liveChatId = null;
    lvMsgs.innerHTML = '';
    lvIdle.style.display = 'none';
    lvChat.style.display = 'flex';
    lvInp.disabled = false;
    lvSnd.disabled = false;
    botSay(lvMsgs, t('ask_name'), function () {
      lvInp.placeholder = t('lv_placeholder_name');
      lvInp.focus();
    });
  }

  function doConnect() {
    liveStep = 'connecting';
    lvInp.disabled = true;
    lvSnd.disabled = true;
    addLvSys(t('connecting'));

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
      addLvSys(t('connected'));
      lvInp.placeholder = t('lv_placeholder_agent');
      lvInp.disabled = false;
      lvSnd.disabled = false;
      lvInp.focus();
      startPolling();
    })
    .catch(function () {
      addLvSys(t('connect_failed'));
      liveStep = 'failed';
      lvInp.disabled = false;
      lvSnd.disabled = false;
      lvInp.placeholder = t('retry_placeholder');
      lvInp.value = '';
    });
  }

  function sendLive() {
    var txt = lvInp.value.trim();
    if (lvInp.disabled) return;
    if (liveStep === 'failed') { doConnect(); return; }
    if (!txt) return;
    addLvMsg(txt, true);
    lvInp.value = '';

    if (liveStep === 'collect_name') {
      visitorName = txt;
      liveStep = 'collect_contact';
      botSay(lvMsgs, t('ask_contact', { name: visitorName }), function () {
        lvInp.placeholder = t('lv_placeholder_contact');
        lvInp.focus();
      });
      return;
    }
    if (liveStep === 'collect_contact') {
      visitorContact = txt;
      lvInp.placeholder = t('lv_placeholder_agent');
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

    if (!cfg.api) { botSay(aiMsgs, t('no_api'), null); return; }

    aiInp.disabled = true;
    aiSnd.disabled = true;
    var snap = aiHistory.slice();
    var dots = showDots(aiMsgs);

    fetch(cfg.api + '/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partner_id: cfg.partnerId, message: txt, history: snap, lang: lang })
    })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (data) {
      rmDots(dots);
      var reply = data.reply || t('no_api');
      aiHistory.push({ role: 'user',      content: txt   });
      aiHistory.push({ role: 'assistant', content: reply });
      if (aiHistory.length > 20) aiHistory = aiHistory.slice(-20);
      addAiMsg(reply, false);
      aiInp.disabled = false;
      aiSnd.disabled = false;
      if (data.collect_info) {
        setTimeout(function () { switchTab('lv'); }, 900);
      } else {
        aiInp.focus();
      }
    })
    .catch(function () {
      rmDots(dots);
      addAiMsg(t('error'), false);
      aiInp.disabled = false;
      aiSnd.disabled = false;
    });
  }

  // ── Toggle panel ──────────────────────────────────────────────────
  function toggle() {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    if (isOpen) {
      if (!aiStarted && activeTab === 'ai') {
        aiStarted = true;
        fetchTopics();
        botSay(aiMsgs, t('greeting', { name: cfg.name }), function () {
          aiInp.disabled = false;
          aiSnd.disabled = false;
          aiInp.focus();
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
  document.getElementById('_ocw_hdr_lang').addEventListener('click', function () { switchTab('lang'); });
  document.getElementById('_ocw_lv_connect').addEventListener('click', function () { if (cfg.api) autoConnect(); });
  aiSnd.addEventListener('click', function () { hideChips(); sendAi(); });
  aiInp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { hideChips(); sendAi(); } });
  lvSnd.addEventListener('click', sendLive);
  lvInp.addEventListener('keydown', function (e) { if (e.key === 'Enter') sendLive(); });

  // Language option clicks (delegated to the list container)
  document.getElementById('_ocw_lang_list').addEventListener('click', function (e) {
    var btn = e.target.closest('._ocw_lang_opt');
    if (btn) changeLang(btn.getAttribute('data-lang'));
  });
})();
