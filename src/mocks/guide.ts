export const guideSteps = [
  {
    step: 1,
    title: "Create Your Account",
    description: "Sign up with your business email and set up your organization profile. Choose your plan and configure your team settings.",
    icon: "ri-user-add-line",
    details: [
      "Visit the signup page and enter your business email",
      "Verify your email address through the confirmation link",
      "Set up your organization name, timezone, and brand profile",
      "Choose a plan that fits your team size and needs",
      "Invite your team members via email invitation",
    ],
  },
  {
    step: 2,
    title: "Connect Your Channels",
    description: "Link all your messaging platforms to OPSConnect. Each channel takes just a few minutes to set up with our guided wizards.",
    icon: "ri-plug-line",
    details: [
      "Navigate to Settings > Channels in your dashboard",
      "Select a channel (WhatsApp, Messenger, Instagram, etc.)",
      "Follow the step-by-step connection wizard for each platform",
      "Authorize access through OAuth or API key configuration",
      "Test the connection by sending a test message",
    ],
  },
  {
    step: 3,
    title: "Configure AI Chatbot",
    description: "Set up your intelligent chatbot to handle common queries, qualify leads, and provide 24/7 automated support.",
    icon: "ri-robot-line",
    details: [
      "Open the AI Studio from your dashboard",
      "Choose a template or start from scratch with the no-code builder",
      "Define conversation flows and intent triggers",
      "Train the AI with your FAQ content and knowledge base",
      "Set up human handoff rules for complex queries",
    ],
  },
  {
    step: 4,
    title: "Set Up Team Inbox",
    description: "Organize your team's workflow with smart assignment rules, collision detection, and collaborative tools.",
    icon: "ri-inbox-line",
    details: [
      "Configure your team structure and roles",
      "Set up assignment rules based on skills, language, or workload",
      "Enable collision detection to prevent duplicate responses",
      "Create canned responses and templates for common replies",
      "Set up internal notes and @mentions for team collaboration",
    ],
  },
  {
    step: 5,
    title: "Customize & Go Live",
    description: "Fine-tune your settings, integrate with your existing tools, and launch your unified customer service platform.",
    icon: "ri-rocket-line",
    details: [
      "Customize your chat widget appearance and behavior",
      "Set up business hours and away messages",
      "Connect your CRM, helpdesk, or e-commerce platform via integrations",
      "Configure analytics dashboards and reporting preferences",
      "Launch and monitor your first conversations in real-time",
    ],
  },
];

export const channelSetupGuides = [
  { name: "WhatsApp", icon: "ri-whatsapp-line", time: "~5 min", difficulty: "Easy" },
  { name: "Facebook Messenger", icon: "ri-messenger-line", time: "~5 min", difficulty: "Easy" },
  { name: "Instagram", icon: "ri-instagram-line", time: "~5 min", difficulty: "Easy" },
  { name: "Telegram", icon: "ri-telegram-line", time: "~3 min", difficulty: "Easy" },
  { name: "LINE", icon: "ri-line-line", time: "~10 min", difficulty: "Medium" },
  { name: "Email", icon: "ri-mail-line", time: "~3 min", difficulty: "Easy" },
  { name: "Live Chat", icon: "ri-chat-3-line", time: "~2 min", difficulty: "Easy" },
  { name: "WeChat", icon: "ri-wechat-line", time: "~15 min", difficulty: "Medium" },
];

export const guideFAQ = [
  {
    question: "Do I need technical skills to set up the platform?",
    answer: "Not at all! Our guided setup wizards walk you through every step. Most channels connect with just a few clicks. For advanced features like custom API integrations, our documentation has clear, code-level examples you can share with your development team.",
  },
  {
    question: "How do I migrate from another platform?",
    answer: "We provide migration tools to import your contacts, conversation history, and settings from most major platforms. Our onboarding team will assist you throughout the migration process to ensure zero data loss and minimal downtime.",
  },
  {
    question: "Can I test the platform before going live?",
    answer: "Yes! You can use sandbox/test modes for each channel to verify everything works before your customers see it. We recommend running a few days of internal testing with your team before going live with real customers.",
  },
];