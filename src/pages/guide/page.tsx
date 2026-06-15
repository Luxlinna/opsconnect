import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import GuideSteps from "./components/GuideSteps";
import ChannelSetupSection from "./components/ChannelSetupSection";
import GuideFAQ from "./components/GuideFAQ";

export default function Guide() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative pt-24 md:pt-28 pb-14 md:pb-18 px-4 md:px-6 bg-background-50">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-3">
              Onboarding Guide
            </p>
            <h1 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold text-foreground-950 leading-tight">
              Welcome to OPSConnect.
              <br />
              Let's get you set up.
            </h1>
            <p className="mt-4 text-sm md:text-base text-foreground-600 max-w-xl mx-auto leading-relaxed">
              Follow this step-by-step guide to connect all your messaging channels, configure your AI chatbot, and launch your unified customer service platform. Most teams are fully operational in under 30 minutes.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#steps"
                className="text-sm font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer px-6 py-3 rounded-md"
              >
                Start Setup Guide
              </a>
              <a
                href="#channels"
                className="text-sm font-medium text-foreground-700 hover:text-foreground-950 transition-colors whitespace-nowrap cursor-pointer px-6 py-3 rounded-md border border-background-300"
              >
                View Channel Setup
              </a>
            </div>
          </div>
        </section>

        <div id="steps">
          <GuideSteps />
        </div>
        <div id="channels">
          <ChannelSetupSection />
        </div>
        <GuideFAQ />

        <section className="py-16 md:py-20 px-4 md:px-6 bg-background-100">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground-950">
              Ready to launch your unified inbox?
            </h2>
            <p className="mt-3 text-sm text-foreground-600 leading-relaxed">
              Everything's set up. Start managing all your customer conversations from one beautiful dashboard.
            </p>
            <a
              href="/"
              className="inline-block mt-6 text-sm font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer px-7 py-3 rounded-md"
            >
              Go to Dashboard
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}