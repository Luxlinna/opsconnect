export const platforms = [
  { name: "WhatsApp", icon: "ri-whatsapp-line", color: "#25D366", description: "Connect with billions of users on the world's most popular messaging app" },
  { name: "Facebook Messenger", icon: "ri-messenger-line", color: "#0084FF", description: "Engage customers where they spend their time on social media" },
  { name: "Instagram", icon: "ri-instagram-line", color: "#E4405F", description: "Turn DM conversations into meaningful customer relationships" },
  { name: "Telegram", icon: "ri-telegram-line", color: "#26A5E4", description: "Reach tech-savvy audiences with fast and secure messaging" },
  { name: "LINE", icon: "ri-line-line", color: "#00C300", description: "Tap into Asian markets with the region's dominant messaging platform" },
  { name: "Email", icon: "ri-mail-line", color: "#EA4335", description: "Unify your email support alongside all your messaging channels" },
  { name: "Live Chat", icon: "ri-chat-3-line", color: "#1E7FC2", description: "Convert website visitors instantly with real-time chat widgets" },
  { name: "WeChat", icon: "ri-wechat-line", color: "#07C160", description: "Access China's everything-app for complete customer engagement" },
];

export const coreFeatures = [
  {
    id: "ai-chatbots",
    title: "AI Chatbots & Automation",
    subtitle: "Smart conversations, 24/7",
    description: "Deploy intelligent chatbots that handle common queries, qualify leads, and route complex issues to the right team member. Build custom conversation flows with zero coding required.",
    highlights: ["No-code flow builder", "NLP intent detection", "Multi-turn conversations", "Seamless human handoff"],
    imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=800&fit=crop",
  },
  {
    id: "team-inbox",
    title: "Shared Team Inboxes",
    subtitle: "One place, every message",
    description: "Bring all your messaging channels into a single collaborative inbox. Assign conversations, leave internal notes, and ensure no customer ever falls through the cracks.",
    highlights: ["Unified message stream", "Smart assignment rules", "Collision detection", "Internal team notes"],
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=800&fit=crop",
  },
  {
    id: "crm",
    title: "CRM & Contact Management",
    subtitle: "Know every customer",
    description: "Build rich customer profiles that automatically sync across all channels. Track interaction history, segment audiences, and personalize every conversation with context at your fingertips.",
    highlights: ["Unified contact profiles", "Interaction timeline", "Custom tags & segments", "GDPR-compliant data"],
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop",
  },
  {
    id: "translation",
    title: "Real-time Translation",
    subtitle: "Break every language barrier",
    description: "Communicate effortlessly with customers worldwide. Our AI-powered translation engine supports over 100 languages, translating messages in both directions instantly as you type.",
    highlights: ["100+ languages supported", "Bidirectional translation", "Industry-specific terminology", "Tone preservation"],
    imageUrl: "https://images.unsplash.com/photo-1508780709619-79562169bc64?w=1200&h=800&fit=crop",
  },
  {
    id: "analytics",
    title: "Analytics & Reporting",
    subtitle: "Data-driven decisions",
    description: "Get deep insights into your team's performance and customer satisfaction. Beautiful dashboards, custom reports, and real-time metrics help you continuously improve your service quality.",
    highlights: ["Real-time dashboards", "CSAT & NPS tracking", "Custom report builder", "Team performance analytics"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
  },
];

export const integrationConnectors = [
  {
    name: "REST API",
    icon: "ri-code-s-slash-line",
    description: "Full RESTful API with comprehensive endpoints for every feature",
    detail: "Our REST API gives you programmatic access to every feature in OPSConnect. Send and receive messages, manage contacts, create chatbots, pull analytics, and configure webhooks — all through clean, versioned endpoints with predictable JSON responses.",
    bullets: ["Bearer token & API key authentication", "Versioned endpoints (v1, v2)", "Rate limit: 1000 req/min per key", "All responses in JSON format", "Pagination via cursor-based tokens", "Comprehensive error codes & messages"],
    codeExample: "curl -H 'Authorization: Bearer $API_KEY' \\\n  https://api.opsconnect.io/v2/messages",
  },
  {
    name: "Webhooks",
    icon: "ri-webhook-line",
    description: "Real-time event notifications pushed directly to your endpoints",
    detail: "Stop polling for changes. Our webhook system pushes real-time event notifications directly to your HTTP endpoints the moment something happens — a new message arrives, a contact is updated, a chatbot triggers, or an agent replies. You configure which events you care about, and we deliver the payload instantly.",
    bullets: ["30+ event types across all modules", "Signed payloads with HMAC-SHA256", "Automatic retry with exponential backoff", "Custom headers support", "Delivery logs & failure alerts", "IP whitelisting for added security"],
    codeExample: "{\n  \"event\": \"message.received\",\n  \"channel\": \"whatsapp\",\n  \"timestamp\": \"2026-06-06T12:00:00Z\",\n  \"data\": { ... }\n}",
  },
  {
    name: "Zapier",
    icon: "ri-flashlight-line",
    description: "Connect with 5000+ apps through automated Zapier workflows",
    detail: "Our native Zapier integration lets you connect OPSConnect to over 5,000 apps without writing a single line of code. Automatically create CRM contacts from new conversations, log messages to Google Sheets, trigger Slack notifications for urgent queries, or sync data bidirectionally between tools your team already uses.",
    bullets: ["15+ triggers: new message, resolved conversation, contact created", "20+ actions: send message, update contact, create chatbot flow", "One-click setup via Zapier marketplace", "Supports multi-step Zaps with filters & paths", "Field mapping with autocomplete", "Error handling & replay from Zapier dashboard"],
    codeExample: "Trigger: New Message in OPSConnect\n  → Filter: Tag equals 'urgent'\n    → Action: Send Slack DM to #support-team",
  },
  {
    name: "Custom SDKs",
    icon: "ri-terminal-box-line",
    description: "Native SDKs for Python, JavaScript, Ruby, PHP, and more",
    detail: "Skip raw HTTP calls and use our idiomatic, well-documented SDKs in your language of choice. Each SDK wraps our REST API with type-safe methods, automatic retry logic, connection pooling, and built-in webhook signature verification — so you can integrate in minutes, not days.",
    bullets: ["Python (pip install opsconnect)", "JavaScript / TypeScript (npm install @opsconnect/sdk)", "Ruby (gem install opsconnect)", "PHP (composer require opsconnect/sdk)", "Go (go get github.com/opsconnect/sdk)", "Java & .NET coming Q3 2026"],
    codeExample: "// TypeScript example\nimport { OPSConnect } from '@opsconnect/sdk';\nconst client = new OPSConnect({ apiKey });\nawait client.messages.send({ channel: 'whatsapp', to: '+123', body: 'Hi!' });",
  },
  {
    name: "GraphQL",
    icon: "ri-git-branch-line",
    description: "Flexible data queries with our modern GraphQL endpoint",
    detail: "Request exactly the data you need — nothing more, nothing less. Our GraphQL API lets you compose queries across messages, contacts, analytics, and channels in a single round-trip. Perfect for mobile apps, dashboards with limited bandwidth, and complex data-fetching scenarios where REST would require multiple calls.",
    bullets: ["Single endpoint: /graphql", "Introspection enabled for tooling", "Real-time subscriptions via WebSocket", "Batched queries & persisted documents", "Rate limiting by query complexity", "GraphQL Playground included in dashboard"],
    codeExample: "query {\n  messages(channel: WHATSAPP, limit: 10) {\n    edges { node { id, body, from { name }, createdAt } }\n  }\n}",
  },
  {
    name: "SSO / SAML",
    icon: "ri-shield-keyhole-line",
    description: "Enterprise-grade single sign-on with popular identity providers",
    detail: "Give your team secure, one-click access to OPSConnect through your existing identity provider. We support SAML 2.0, OpenID Connect, and OAuth 2.0 — compatible with Okta, Azure AD, Google Workspace, OneLogin, Auth0, and any custom IdP. Enforce MFA, set session timeouts, and manage user provisioning automatically.",
    bullets: ["SAML 2.0, OIDC, OAuth 2.0 support", "Pre-built connectors for Okta, Azure AD, Google, Auth0", "Just-in-Time (JIT) user provisioning", "SCIM 2.0 for automated deprovisioning", "IdP-initiated & SP-initiated flows", "Enforce MFA & session policies at IdP level"],
    codeExample: "IdP Metadata URL: https://your-org.okta.com/app/xxx/sso/saml/metadata\n→ Paste into OPSConnect SSO settings\n  → Users sign in via Okta dashboard",
  },
];

export const testimonials = [
  {
    name: "Sarah Chen",
    role: "Head of Customer Success",
    company: "TechFlow Inc.",
    avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20an%20Asian%20woman%20in%20her%2030s%2C%20warm%20friendly%20smile%2C%20clean%20cream%20background%2C%20soft%20natural%20lighting%2C%20modern%20business%20casual%20attire%2C%20simple%20minimalist%20composition%2C%20editorial%20portrait%20photography%20style&width=200&height=200&seq=avatar-sarah-chen&orientation=squarish",
    content: "We handle 15,000+ conversations monthly across 6 channels. OPSConnect cut our response time by 60% and our CSAT scores have never been higher. The unified inbox is a game-changer for our team of 40 agents.",
  },
  {
    name: "Marcus Rodriguez",
    role: "VP of Operations",
    company: "GlobalRetail Group",
    avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20a%20Hispanic%20man%20in%20his%2040s%2C%20confident%20expression%2C%20clean%20cream%20background%2C%20soft%20natural%20lighting%2C%20business%20casual%20blazer%2C%20minimalist%20composition%2C%20editorial%20portrait%20photography%20style&width=200&height=200&seq=avatar-marcus-rodriguez&orientation=squarish",
    content: "The real-time translation alone has opened up 12 new markets for us. Our team now supports customers in 15 languages without hiring a single translator. The ROI has been absolutely incredible.",
  },
  {
    name: "Emma Williams",
    role: "Director of Digital",
    company: "StyleHouse Brands",
    avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20a%20Caucasian%20woman%20in%20her%2030s%2C%20friendly%20professional%20smile%2C%20clean%20cream%20background%2C%20soft%20natural%20lighting%2C%20modern%20business%20attire%2C%20minimalist%20composition%2C%20editorial%20portrait%20photography%20style&width=200&height=200&seq=avatar-emma-williams&orientation=squarish",
    content: "The AI chatbot automates 40% of our first-response queries. Our customers get instant answers 24/7 and our team focuses on high-value conversations. The analytics dashboard helps us continuously optimize.",
  },
  {
    name: "David Park",
    role: "CTO",
    company: "FinServe Partners",
    avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20an%20Asian%20man%20in%20his%2030s%2C%20professional%20expression%2C%20clean%20cream%20background%2C%20soft%20natural%20lighting%2C%20modern%20business%20attire%2C%20minimalist%20composition%2C%20editorial%20portrait%20photography%20style&width=200&height=200&seq=avatar-david-park&orientation=squarish",
    content: "Security was our top concern and OPSConnect delivered. SOC 2 compliant, end-to-end encryption, and granular access controls. We integrated via their API in under two weeks. The developer experience is excellent.",
  },
  {
    name: "Lisa Thompson",
    role: "Customer Experience Manager",
    company: "TravelEase",
    avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20a%20Caucasian%20woman%20in%20her%2040s%2C%20warm%20smile%2C%20clean%20cream%20background%2C%20soft%20natural%20lighting%2C%20business%20casual%20style%2C%20minimalist%20composition%2C%20editorial%20portrait%20photography%20style&width=200&height=200&seq=avatar-lisa-thompson&orientation=squarish",
    content: "Managing WhatsApp, Instagram, and live chat used to be chaos with three separate tools. Now everything flows into one beautiful interface. Our team morale improved because the workflow is so much smoother.",
  },
  {
    name: "James Okonkwo",
    role: "Founder & CEO",
    company: "AfriTech Solutions",
    avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20an%20African%20man%20in%20his%2030s%2C%20confident%20professional%20expression%2C%20clean%20cream%20background%2C%20soft%20natural%20lighting%2C%20modern%20business%20attire%2C%20minimalist%20composition%2C%20editorial%20portrait%20photography%20style&width=200&height=200&seq=avatar-james-okonkwo&orientation=squarish",
    content: "As a startup, we needed something that scaled with us. Started with 3 agents, now at 50. The platform grew seamlessly with our business. The CRM integration with our existing tools was surprisingly smooth.",
  },
];

export const faqData = [
  {
    question: "How long does it take to set up all messaging channels?",
    answer: "Most channels can be connected in under 10 minutes. WhatsApp and Facebook Messenger setup typically takes 5-10 minutes each, while other platforms like Instagram and Telegram connect almost instantly through OAuth. Our setup wizard walks you through each step.",
  },
  {
    question: "Can I customize the AI chatbot's responses and behavior?",
    answer: "Absolutely! Our no-code flow builder lets you design conversation paths, set up intent detection, create custom responses, and define handoff rules. You can also train the AI on your knowledge base, FAQs, and past conversations for more accurate, brand-consistent replies.",
  },
  {
    question: "How does real-time translation work across different channels?",
    answer: "Our translation engine automatically detects the customer's language and translates messages bidirectionally in real-time. It supports over 100 languages with industry-specific terminology models. Team members see messages in their preferred language while customers receive responses in theirs - seamlessly.",
  },
  {
    question: "Is my customer data secure and compliant?",
    answer: "Security is fundamental to our platform. We are SOC 2 Type II certified, GDPR compliant, and offer end-to-end encryption for all messages. Data is encrypted at rest and in transit. We also provide granular role-based access controls, audit logging, and customizable data retention policies.",
  },
  {
    question: "What kind of analytics and reports can I generate?",
    answer: "You get real-time dashboards tracking response times, resolution rates, CSAT scores, agent performance, channel volume, and more. Custom report builder lets you create tailored reports. All data can be exported as CSV, PDF, or accessed via API for your own BI tools.",
  },
  {
    question: "Do you offer a free trial?",
    answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required. You can connect all your channels, test the AI chatbot, and explore the analytics dashboard. Our team is available to help you get the most out of your trial.",
  },
  {
    question: "What support do you provide during onboarding?",
    answer: "Every plan includes guided onboarding with a dedicated success manager. We provide live training sessions, migration assistance from other platforms, and a comprehensive knowledge base with step-by-step guides. Premium plans include priority support with a dedicated account team.",
  },
  {
    question: "Can I integrate OPSConnect with my existing tools?",
    answer: "Yes, we offer extensive integration options. Our REST API and webhooks allow deep integration with your existing stack. We also have native integrations with popular CRMs, helpdesks, and e-commerce platforms, plus Zapier support connecting you to 5000+ other apps.",
  },
];

export const securityFeatures = [
  { icon: "ri-shield-check-line", label: "SOC 2 Type II Certified" },
  { icon: "ri-lock-line", label: "End-to-End Encryption" },
  { icon: "ri-file-shield-line", label: "GDPR Compliant" },
  { icon: "ri-key-line", label: "SSO & SAML Support" },
  { icon: "ri-eye-off-line", label: "Data Masking" },
  { icon: "ri-history-line", label: "Audit Logging" },
];

export const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Book a Demo", href: "/demo" },
  { label: "Integrations", href: "/#integrations" },
  { label: "Partners", href: "/partners" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Profile", href: "/partner-profile" },
  { label: "Guide", href: "/guide" },
  { label: "Contact", href: "/contact" },
];

export const stats = [
  { value: "10K+", label: "Businesses Trust Us" },
  { value: "150M+", label: "Messages Processed Daily" },
  { value: "99.9%", label: "Uptime Guaranteed" },
  { value: "100+", label: "Languages Supported" },
];