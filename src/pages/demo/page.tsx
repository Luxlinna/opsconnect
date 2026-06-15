import { useState } from "react";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";

const DEMO_FORM_URL = "https://readdy.ai/api/form/d8i2nlr700fk75v20eo0";

const TEAM_SIZES = ["1–10", "11–50", "51–200", "201–500", "500+"];
const TIME_SLOTS = ["Morning (9am–12pm)", "Afternoon (12pm–5pm)", "Evening (5pm–8pm)"];

const BENEFITS = [
  { icon: "ri-presentation-line", title: "Live product walkthrough", desc: "A 30-minute guided tour of the unified inbox, AI chatbots, and analytics — tailored to your channels." },
  { icon: "ri-question-answer-line", title: "Answers to your questions", desc: "Talk through pricing, onboarding, and integrations with a product specialist, not a salesperson." },
  { icon: "ri-rocket-2-line", title: "A setup plan for your team", desc: "Leave with a clear roadmap to connect WhatsApp, Messenger, Instagram, and more in days, not weeks." },
];

export default function Demo() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    teamSize: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "message" && value.length > 500) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "message") setCharCount(value.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch(DEMO_FORM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });
      setSubmitted(true);
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-background-200/70 bg-background-50 px-3.5 py-2.5 text-sm text-foreground-900 outline-none transition-colors focus:border-primary-500 placeholder:text-foreground-400";
  const labelClass = "block text-xs font-medium text-foreground-700 mb-1.5";

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-24 md:pt-32 pb-10 md:pb-14 px-4 md:px-6 bg-background-50 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary-100/30 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full bg-accent-100/30 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-3">Book a Demo</p>
            <h1 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold text-foreground-950 leading-tight">
              See OPSConnect in action,
              <br />
              live with our team.
            </h1>
            <p className="mt-4 text-sm md:text-base text-foreground-600 max-w-xl mx-auto leading-relaxed">
              Pick a time that works for you and we'll walk you through a personalized demo built around
              your channels, your team, and your customers. No pressure, no commitment.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="pb-16 md:pb-24 px-4 md:px-6 bg-background-50">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* Left — what to expect */}
            <div className="lg:pt-4">
              <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground-950">
                What to expect
              </h2>
              <div className="mt-6 space-y-6">
                {BENEFITS.map((b) => (
                  <div key={b.title} className="flex items-start gap-4">
                    <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-xl bg-primary-100">
                      <i className={`${b.icon} text-lg text-primary-600`}></i>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground-900">{b.title}</h3>
                      <p className="mt-1 text-sm text-foreground-600 leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-4 rounded-xl border border-background-200/70 bg-background-100 px-5 py-4">
                <div className="flex items-center gap-1.5 text-accent-600">
                  <i className="ri-time-line text-lg"></i>
                </div>
                <p className="text-xs text-foreground-600 leading-relaxed">
                  Demos run about <span className="font-semibold text-foreground-900">30 minutes</span> over video call.
                  We'll email you a calendar invite once you book.
                </p>
              </div>
            </div>

            {/* Right — booking form */}
            <div>
              {submitted ? (
                <div className="bg-background-100 rounded-xl border border-background-200/70 p-8 md:p-10 text-center">
                  <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-accent-100 mb-5">
                    <i className="ri-calendar-check-line text-2xl text-accent-600"></i>
                  </div>
                  <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground-950">
                    Your demo is requested!
                  </h2>
                  <p className="mt-3 text-sm text-foreground-600 leading-relaxed max-w-md mx-auto">
                    Thanks, {formData.name.split(" ")[0] || "there"}! We've received your request and a member of our
                    team will reach out within 24 hours to confirm your slot and send a calendar invite.
                  </p>
                  <a
                    href="/"
                    className="inline-block mt-6 text-sm font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer px-6 py-2.5 rounded-md"
                  >
                    Back to Home
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} data-readdy-form className="bg-background-100 rounded-xl border border-background-200/70 p-6 md:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className={labelClass}>Full Name *</label>
                      <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="Jane Doe" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelClass}>Work Email *</label>
                      <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="jane@company.com" className={inputClass} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="company" className={labelClass}>Company *</label>
                      <input id="company" name="company" type="text" required value={formData.company} onChange={handleChange} placeholder="Acme Inc." className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="teamSize" className={labelClass}>Team Size</label>
                      <select id="teamSize" name="teamSize" value={formData.teamSize} onChange={handleChange} className={inputClass}>
                        <option value="">Select…</option>
                        {TEAM_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="preferredDate" className={labelClass}>Preferred Date</label>
                      <input id="preferredDate" name="preferredDate" type="date" value={formData.preferredDate} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="preferredTime" className={labelClass}>Preferred Time</label>
                      <select id="preferredTime" name="preferredTime" value={formData.preferredTime} onChange={handleChange} className={inputClass}>
                        <option value="">Select…</option>
                        {TIME_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="phone" className={labelClass}>Phone (optional)</label>
                    <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className={inputClass} />
                  </div>

                  <div className="mb-5">
                    <label htmlFor="message" className={labelClass}>Anything we should know?</label>
                    <textarea id="message" name="message" rows={3} value={formData.message} onChange={handleChange} placeholder="Which channels do you want to connect? What are your goals?" className={`${inputClass} resize-none`} />
                    <div className="mt-1 text-right text-[10px] text-foreground-400">{charCount}/500</div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full text-sm font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer px-6 py-3 rounded-md disabled:opacity-60 disabled:cursor-default"
                  >
                    {submitting ? "Sending…" : "Book My Demo"}
                  </button>
                  <p className="mt-3 text-center text-[11px] text-foreground-400">
                    We'll never share your details. By booking you agree to our Terms & Privacy Policy.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
