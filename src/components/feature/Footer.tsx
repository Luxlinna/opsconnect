import { useState } from "react";

const NEWSLETTER_FORM_URL = "https://readdy.ai/api/form/d8i2jbhhmtkvo7bfqpcg";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch(NEWSLETTER_FORM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email }).toString(),
      });
      setSubmitted(true);
      setEmail("");
    } catch {
      // silently fail
    }
  };

  return (
    <footer className="bg-foreground-950 text-background-50">
      <div className="px-4 md:px-6 py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div>
            <span className="flex items-center gap-2 font-heading text-xl md:text-2xl font-bold tracking-tight select-none">
              <img src="/logo.svg" alt="OPSConnect" className="h-8 md:h-9 w-auto" />
              <span style={{ color: '#29B4EC' }}>OPS</span>
              <span style={{ color: '#ffffff' }}>Connect</span>
            </span>
            <p className="mt-3 text-sm text-background-50/60 leading-relaxed">
              Unify all your messaging channels in one powerful platform. AI-powered, team-friendly, and built for scale.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-background-50/40 mb-4">
              Product
            </h4>
            <ul className="flex flex-col gap-2.5">
              {["Features", "Book a Demo", "Integrations", "Partners", "Guide", "API Docs"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-background-50/70 hover:text-background-50 transition-colors cursor-pointer whitespace-nowrap">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-background-50/40 mb-4">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5">
              {["About", "Blog", "Careers", "Contact", "Partners"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-background-50/70 hover:text-background-50 transition-colors cursor-pointer whitespace-nowrap">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-background-50/40 mb-4">
              Stay Updated
            </h4>
            {submitted ? (
              <p className="text-sm text-accent-400 font-medium">
                Thanks for subscribing!
              </p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} data-readdy-form className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-transparent border-b border-background-50/20 text-sm text-background-50 placeholder:text-background-50/30 py-2 pr-10 outline-none focus:border-primary-400 transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center cursor-pointer text-background-50/50 hover:text-primary-400 transition-colors"
                  >
                    <i className="ri-arrow-right-line text-lg"></i>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-background-50/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background-50/40">
            &copy; {new Date().getFullYear()} OPSConnect. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["ri-twitter-x-line", "ri-linkedin-line", "ri-github-line", "ri-youtube-line"].map((icon) => (
              <a
                key={icon}
                href="#"
                className="w-8 h-8 flex items-center justify-center cursor-pointer text-background-50/40 hover:text-background-50 transition-colors"
                rel="nofollow"
              >
                <i className={`${icon} text-lg`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}