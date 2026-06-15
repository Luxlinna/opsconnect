import { Link } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import BackToTop from "@/components/feature/BackToTop";
import ChannelConnectionWizard from "./components/ChannelConnectionWizard";
import DeveloperResources from "./components/DeveloperResources";
import PartnerRegistration from "./components/PartnerRegistration";
import IntegrationHub from "@/pages/home/components/IntegrationHub";

export default function Partners() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative pt-24 md:pt-28 pb-14 md:pb-18 px-4 md:px-6 bg-background-50">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-100 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent-500" />
              <span className="text-xs font-medium text-accent-700">Partner Program</span>
            </div>
            <h1 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold text-foreground-950 leading-tight">
              Connect your messaging
              <br />
              channels in one place.
            </h1>
            <p className="mt-4 text-sm md:text-base text-foreground-600 max-w-xl mx-auto leading-relaxed">
              Partner with OPSConnect to integrate WhatsApp, Telegram, and Facebook Messenger into your platform. Get API access, embeddable widgets, and real-time sync - all from one unified dashboard.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#connect"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("connect");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer px-6 py-3 rounded-md"
              >
                Start Connecting
              </a>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-foreground-700 hover:text-foreground-950 transition-colors whitespace-nowrap cursor-pointer px-6 py-3 rounded-md border border-background-300"
              >
                View Dashboard
              </Link>
              <a
                href="#developer"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("developer");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm font-medium text-foreground-700 hover:text-foreground-950 transition-colors whitespace-nowrap cursor-pointer px-6 py-3 rounded-md border border-background-300"
              >
                View API Docs
              </a>
            </div>
          </div>
        </section>

        <PartnerRegistration />

        <div id="connect">
          <ChannelConnectionWizard />
        </div>

        <section className="py-12 md:py-16 px-4 md:px-6 bg-background-100">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
              {[
                { value: "< 5 min", label: "Average setup time", icon: "ri-timer-line" },
                { value: "99.99%", label: "API uptime SLA", icon: "ri-cloud-line" },
                { value: "24/7", label: "Partner support", icon: "ri-customer-service-2-line" },
              ].map((stat) => (
                <div key={stat.label} className="bg-background-50 rounded-xl border border-background-200/70 p-6">
                  <div className="w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-primary-100 mb-3">
                    <i className={`${stat.icon} text-lg text-primary-600`}></i>
                  </div>
                  <div className="font-heading text-xl md:text-2xl font-bold text-foreground-950">{stat.value}</div>
                  <div className="text-xs text-foreground-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <IntegrationHub />

        <div id="developer">
          <DeveloperResources />
        </div>

        <section className="py-16 md:py-20 px-4 md:px-6 bg-background-50">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground-950">
              Ready to integrate?
            </h2>
            <p className="mt-3 text-sm text-foreground-600 leading-relaxed">
              Start connecting your messaging channels today and give your customers a seamless omnichannel experience.
            </p>
            <a
              href="#connect"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("connect");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-block mt-6 text-sm font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer px-7 py-3 rounded-md"
            >
              Get Started Free
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}