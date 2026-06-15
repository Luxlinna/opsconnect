export const dashboardStats = [
  { value: "6", label: "Connected Channels", icon: "ri-link", trend: "+2 this week" },
  { value: "1,847", label: "Messages Today", icon: "ri-message-3-line", trend: "+12% vs yesterday" },
  { value: "43", label: "Active Conversations", icon: "ri-chat-3-line", trend: "8 awaiting reply" },
  { value: "98.2%", label: "Response Rate", icon: "ri-thumb-up-line", trend: "Last 30 days" },
];

export const channelMetrics: Record<string, { connectedSince: string; messagesToday: number; totalMessages: number; avgResponseTime: string }> = {
  whatsapp: { connectedSince: "June 1, 2026", messagesToday: 423, totalMessages: 12850, avgResponseTime: "2.3 min" },
  telegram: { connectedSince: "May 20, 2026", messagesToday: 187, totalMessages: 5840, avgResponseTime: "1.8 min" },
  messenger: { connectedSince: "May 15, 2026", messagesToday: 312, totalMessages: 9210, avgResponseTime: "3.1 min" },
  instagram: { connectedSince: "June 3, 2026", messagesToday: 256, totalMessages: 4320, avgResponseTime: "2.7 min" },
  line: { connectedSince: "May 28, 2026", messagesToday: 94, totalMessages: 2180, avgResponseTime: "4.2 min" },
  email: { connectedSince: "April 10, 2026", messagesToday: 518, totalMessages: 28500, avgResponseTime: "12.5 min" },
  livechat: { connectedSince: "June 5, 2026", messagesToday: 47, totalMessages: 1200, avgResponseTime: "0.8 min" },
  wechat: { connectedSince: "June 2, 2026", messagesToday: 10, totalMessages: 340, avgResponseTime: "5.6 min" },
};

export const recentActivity = [
  { channel: "whatsapp", event: "New conversation started", customer: "Emma R.", time: "2 minutes ago" },
  { channel: "email", event: "Support ticket resolved", customer: "James K.", time: "15 minutes ago" },
  { channel: "messenger", event: "Bot handoff to agent", customer: "Sarah L.", time: "23 minutes ago" },
  { channel: "instagram", event: "DM received with image", customer: "Maria G.", time: "31 minutes ago" },
  { channel: "telegram", event: "Automated reply sent", customer: "Alex P.", time: "42 minutes ago" },
  { channel: "livechat", event: "Widget triggered on /demo", customer: "Visitor #2847", time: "1 hour ago" },
  { channel: "line", event: "Rich menu interaction", customer: "Yuki T.", time: "2 hours ago" },
];

export const analyticsTrends: Record<string, { day: string; value: number }[]> = {
  whatsapp: [
    { day: "Mon", value: 58 }, { day: "Tue", value: 72 }, { day: "Wed", value: 65 }, { day: "Thu", value: 81 }, { day: "Fri", value: 90 }, { day: "Sat", value: 42 }, { day: "Sun", value: 15 },
  ],
  telegram: [
    { day: "Mon", value: 22 }, { day: "Tue", value: 35 }, { day: "Wed", value: 28 }, { day: "Thu", value: 40 }, { day: "Fri", value: 38 }, { day: "Sat", value: 14 }, { day: "Sun", value: 10 },
  ],
  messenger: [
    { day: "Mon", value: 40 }, { day: "Tue", value: 48 }, { day: "Wed", value: 55 }, { day: "Thu", value: 62 }, { day: "Fri", value: 58 }, { day: "Sat", value: 30 }, { day: "Sun", value: 19 },
  ],
  instagram: [
    { day: "Mon", value: 30 }, { day: "Tue", value: 35 }, { day: "Wed", value: 42 }, { day: "Thu", value: 38 }, { day: "Fri", value: 48 }, { day: "Sat", value: 36 }, { day: "Sun", value: 27 },
  ],
  line: [
    { day: "Mon", value: 10 }, { day: "Tue", value: 15 }, { day: "Wed", value: 13 }, { day: "Thu", value: 18 }, { day: "Fri", value: 16 }, { day: "Sat", value: 9 }, { day: "Sun", value: 13 },
  ],
  email: [
    { day: "Mon", value: 75 }, { day: "Tue", value: 88 }, { day: "Wed", value: 72 }, { day: "Thu", value: 95 }, { day: "Fri", value: 82 }, { day: "Sat", value: 40 }, { day: "Sun", value: 26 },
  ],
  livechat: [
    { day: "Mon", value: 5 }, { day: "Tue", value: 8 }, { day: "Wed", value: 12 }, { day: "Thu", value: 7 }, { day: "Fri", value: 10 }, { day: "Sat", value: 3 }, { day: "Sun", value: 2 },
  ],
  wechat: [
    { day: "Mon", value: 1 }, { day: "Tue", value: 2 }, { day: "Wed", value: 3 }, { day: "Thu", value: 2 }, { day: "Fri", value: 1 }, { day: "Sat", value: 0 }, { day: "Sun", value: 1 },
  ],
};

export const customerNames = [
  "Emma R.", "James K.", "Sarah L.", "Maria G.", "Alex P.", "Yuki T.",
  "Daniel M.", "Olivia W.", "Noah B.", "Sophia C.", "Liam T.", "Ava J.",
  "Ethan H.", "Mia K.", "Lucas G.", "Isabella N.", "Benjamin D.", "Charlotte F.",
];

export const messagePreviews = [
  "Hey, I need help with my recent order",
  "When will my package arrive?",
  "I want to schedule a demo",
  "Can you send me the pricing details?",
  "My payment isn't going through",
  "Thanks for the quick response!",
  "Do you offer refunds?",
  "I'd like to upgrade my plan",
  "What time do you close today?",
  "Can I speak with someone human?",
  "The app keeps crashing on Android",
  "Is there a mobile version?",
];

export const apiUsageStats = {
  totalRequests: 284750,
  requestsThisMonth: 42180,
  rateLimit: "10,000 req/min",
  endpoints: [
    { path: "/api/v1/messages/send", calls: 145200, pct: 51 },
    { path: "/api/v1/conversations", calls: 62800, pct: 22 },
    { path: "/api/v1/contacts", calls: 41300, pct: 15 },
    { path: "/api/v1/webhooks/register", calls: 19800, pct: 7 },
    { path: "/api/v1/analytics", calls: 15650, pct: 5 },
  ],
  lastUsed: "2 minutes ago",
  avgLatency: "87ms",
};

export const monthlyReportData: Record<string, { totalMessages: number; resolved: number; avgResponseMin: number; csat: number; peakHours: string; topCustomer: string }> = {
  whatsapp: { totalMessages: 12850, resolved: 11920, avgResponseMin: 2.3, csat: 94.2, peakHours: "10AM - 2PM UTC", topCustomer: "Emma R." },
  telegram: { totalMessages: 5840, resolved: 5480, avgResponseMin: 1.8, csat: 96.1, peakHours: "8AM - 12PM UTC", topCustomer: "Alex P." },
  messenger: { totalMessages: 9210, resolved: 8520, avgResponseMin: 3.1, csat: 91.8, peakHours: "12PM - 4PM UTC", topCustomer: "Sarah L." },
  instagram: { totalMessages: 4320, resolved: 3980, avgResponseMin: 2.7, csat: 93.5, peakHours: "2PM - 6PM UTC", topCustomer: "Maria G." },
  line: { totalMessages: 2180, resolved: 1920, avgResponseMin: 4.2, csat: 89.3, peakHours: "6AM - 10AM UTC", topCustomer: "Yuki T." },
  email: { totalMessages: 28500, resolved: 26400, avgResponseMin: 12.5, csat: 87.6, peakHours: "9AM - 5PM UTC", topCustomer: "James K." },
  livechat: { totalMessages: 1200, resolved: 1150, avgResponseMin: 0.8, csat: 97.4, peakHours: "11AM - 3PM UTC", topCustomer: "Visitor #2847" },
  wechat: { totalMessages: 340, resolved: 310, avgResponseMin: 5.6, csat: 90.2, peakHours: "8AM - 11AM UTC", topCustomer: "Lucas G." },
};

export const teamMembers = [
  { id: "tm-1", name: "Alice Johnson", email: "alice@company.com", role: "Admin", avatarColor: "#E4405F" },
  { id: "tm-2", name: "Bob Martinez", email: "bob@company.com", role: "Agent", avatarColor: "#26A5E4" },
  { id: "tm-3", name: "Claire Nguyen", email: "claire@company.com", role: "Agent", avatarColor: "#25D366" },
  { id: "tm-4", name: "Derek Wu", email: "derek@company.com", role: "Viewer", avatarColor: "#FF6B35" },
];