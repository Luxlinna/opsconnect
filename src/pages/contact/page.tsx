import { useState } from "react";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";

const DEMO_FORM_URL = "https://readdy.ai/api/form/d8i2nlr700fk75v20eo0";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    teamSize: "",
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

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-24 md:pt-28 pb-14 md:pb-18 px-4 md:px-6 bg-background-50">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-3">
              Get in Touch
            </p>
            <h1 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold text-foreground-950 leading-tight">
              Let's talk about your
              <br />
              customer experience.
            </h1>
            <p className="mt-4 text-sm md:text-base text-foreground-600 max-w-xl mx-auto leading-relaxed">
              Fill out the form below and our team will get back to you within 24 hours with a personalized demo tailored to your business needs.
            </p>
          </div>
        </section>

        <section className="pb-16 md:pb-20 px-4 md:px-6 bg-background-50">
          <div className="max-w-2xl mx-auto">
            {submitted ? (
              <div className="bg-background-100 rounded-xl border border-background-200/70 p-8 md:p-10 text-center">
                <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-accent-100 mb-5">
                  <i className="ri-check-line text-2xl text-accent-600"></i>
                </div>
                <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground-950">
                  Thanks for reaching out!
                </h2>
                <p className="mt-3 text-sm text-foreground-600 leading-relaxed max-w-md mx-auto">
                  We've received your demo request. A member of our team will review your information and get back to you within 24 hours to schedule your personalized walkthrough.
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-foreground-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full text-sm bg-background-50 border border-background-200/70 rounded-md px-3 py-2.5 outline-none focus:border-primary-400 transition-colors"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-foreground-700 mb-1.5">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full text-sm bg-background-50 border border-background-200/70 rounded-md px-3 py-2.5 outline-none focus:border-primary-400 transition-colors"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-xs font-medium text-foreground-700 mb-1.5">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="w-full text-sm bg-background-50 border border-background-200/70 rounded-md px-3 py-2.5 outline-none focus:border-primary-400 transition-colors"
                      placeholder="Acme Inc."
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-medium text-foreground-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full text-sm bg-background-50 border border-background-200/70 rounded-md px-3 py-2.5 outline-none focus:border-primary-400 transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label htmlFor="teamSize" className="block text-xs font-medium text-foreground-700 mb-1.5">
                    Team Size
                  </label>
                  <select
                    id="teamSize"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleChange}
                    className="w-full text-sm bg-background-50 border border-background-200/70 rounded-md px-3 py-2.5 outline-none focus:border-primary-400 transition-colors cursor-pointer"
                  >
                    <option value="">Select team size...</option>
                    <option value="1-5">1-5 agents</option>
                    <option value="6-20">6-20 agents</option>
                    <option value="21-50">21-50 agents</option>
                    <option value="51-200">51-200 agents</option>
                    <option value="200+">200+ agents</option>
                  </select>
                </div>

                <div className="mb-5">
                  <label htmlFor="message" className="block text-xs font-medium text-foreground-700 mb-1.5">
                    Tell us about your needs
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    maxLength={500}
                    className="w-full text-sm bg-background-50 border border-background-200/70 rounded-md px-3 py-2.5 outline-none focus:border-primary-400 transition-colors resize-none"
                    placeholder="Which channels are you most interested in? What's your current setup? Any specific requirements?"
                  />
                  <p className="text-xs text-foreground-400 mt-1 text-right">{charCount}/500</p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full text-sm font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap cursor-pointer px-6 py-3 rounded-md"
                >
                  {submitting ? "Submitting..." : "Request Demo"}
                </button>

                <p className="text-xs text-foreground-400 text-center mt-4">
                  By submitting, you agree to our{" "}
                  <a href="#" className="text-primary-500 hover:text-primary-600 cursor-pointer">Privacy Policy</a> and consent to being contacted about our services.
                </p>
              </form>
            )}
          </div>
        </section>

        <section className="py-12 md:py-16 px-4 md:px-6 bg-background-100">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "ri-mail-line", title: "Email Us", detail: "hello@opsconnect.io" },
              { icon: "ri-phone-line", title: "Call Us", detail: "+1 (800) 555-OMNI" },
              { icon: "ri-map-pin-line", title: "Visit Us", detail: "San Francisco, CA" },
              { icon: "ri-time-line", title: "Response Time", detail: "Within 24 hours" },
            ].map((info) => (
              <div key={info.title} className="text-center">
                <div className="w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-background-200/80 mb-3">
                  <i className={`${info.icon} text-lg text-foreground-700`}></i>
                </div>
                <h4 className="text-sm font-semibold text-foreground-900">{info.title}</h4>
                <p className="text-xs text-foreground-500 mt-1">{info.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}