import { useState } from "react";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { pricingPlans, pricingFAQ, comparisonFeatures } from "@/mocks/pricing";

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-24 md:pt-32 pb-10 md:pb-14 px-4 md:px-6 bg-background-50">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary-100/30 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full bg-accent-100/30 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-3">Pricing Plans</p>
            <h1 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold text-foreground-950 leading-tight">
              Simple, transparent pricing
              <br />
              that scales with you.
            </h1>
            <p className="mt-4 text-sm md:text-base text-foreground-600 max-w-xl mx-auto leading-relaxed">
              Start with a 7-day free trial. No credit card required. Upgrade, downgrade, or cancel anytime.
            </p>

            {/* Toggle */}
            <div className="mt-8 inline-flex items-center gap-3 bg-background-100 rounded-full border border-background-200/70 p-1">
              <button
                onClick={() => setYearly(false)}
                className={`text-sm font-semibold whitespace-nowrap cursor-pointer px-5 py-2 rounded-full transition-all ${
                  !yearly ? "bg-primary-500 text-background-50 dark:text-foreground-950" : "text-foreground-600 hover:text-foreground-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={`text-sm font-semibold whitespace-nowrap cursor-pointer px-5 py-2 rounded-full transition-all ${
                  yearly ? "bg-primary-500 text-background-50 dark:text-foreground-950" : "text-foreground-600 hover:text-foreground-900"
                }`}
              >
                Yearly
                <span className="ml-1.5 text-[10px] font-medium bg-accent-100 text-accent-700 px-1.5 py-0.5 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-14 md:pb-20 px-4 md:px-6 bg-background-50">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {pricingPlans.map((plan) => {
              const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-xl border-2 p-6 md:p-7 flex flex-col ${
                    plan.highlight
                      ? "border-primary-500 bg-primary-50/50"
                      : "border-background-200/70 bg-background-100 hover:border-background-300"
                  }`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-background-50 dark:text-foreground-950 text-[10px] font-bold uppercase tracking-wider px-4 py-1 rounded-full whitespace-nowrap">
                      Most Popular
                    </span>
                  )}

                  <div className="mb-5">
                    <h3 className="font-heading text-lg font-bold text-foreground-950">{plan.name}</h3>
                    <p className="text-xs text-foreground-500 mt-1 leading-relaxed">{plan.description}</p>
                  </div>

                  <div className="mb-5">
                    {price === 0 ? (
                      <>
                        <div className="font-heading text-3xl md:text-4xl font-bold text-foreground-950">Free</div>
                        <p className="text-xs text-accent-600 font-medium mt-1">7 days — no card needed</p>
                      </>
                    ) : price !== null ? (
                      <>
                        <div className="flex items-baseline gap-1">
                          <span className="font-heading text-3xl md:text-4xl font-bold text-foreground-950">${price}</span>
                          <span className="text-sm text-foreground-500">/mo</span>
                        </div>
                        {yearly && (
                          <p className="text-xs text-foreground-400 mt-1">Billed annually (${plan.yearlyPrice}/mo)</p>
                        )}
                      </>
                    ) : (
                      <div className="font-heading text-2xl md:text-3xl font-bold text-foreground-950">Let's talk</div>
                    )}
                  </div>

                  <a
                    href="/contact"
                    className={`w-full text-sm font-semibold whitespace-nowrap cursor-pointer px-5 py-2.5 rounded-md text-center transition-colors mb-6 ${
                      plan.highlight
                        ? "bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600"
                        : plan.id === "enterprise"
                          ? "bg-foreground-950 text-background-50 hover:bg-foreground-800"
                          : "bg-secondary-500 text-background-50 dark:text-foreground-950 hover:bg-secondary-600"
                    }`}
                  >
                    {plan.cta}
                  </a>

                  <div className="space-y-2.5 flex-1">
                    {plan.features.map((feat) => (
                      <div key={feat.name} className="flex items-start gap-2.5">
                        {feat.included ? (
                          <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 rounded-full bg-accent-100 mt-0.5">
                            <i className="ri-check-line text-[10px] text-accent-600"></i>
                          </span>
                        ) : (
                          <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <i className="ri-close-line text-sm text-foreground-300"></i>
                          </span>
                        )}
                        <span className={`text-xs leading-relaxed ${feat.included ? "text-foreground-700" : "text-foreground-400 line-through"}`}>
                          {feat.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-14 md:py-20 px-4 md:px-6 bg-background-100">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-3">Compare Plans</p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950">Feature comparison at a glance</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-background-300/60">
                    <th className="text-left py-4 px-4 font-semibold text-foreground-900 text-xs uppercase tracking-wider">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold text-foreground-700 text-xs">Starter</th>
                    <th className="text-center py-4 px-4 font-semibold text-foreground-900 text-xs bg-primary-50/30">Grow</th>
                    <th className="text-center py-4 px-4 font-semibold text-foreground-700 text-xs">Business</th>
                    <th className="text-center py-4 px-4 font-semibold text-foreground-700 text-xs">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, i) => (
                    <tr key={row.name} className={`border-b border-background-200/50 ${i % 2 === 0 ? "bg-background-50/50" : ""}`}>
                      <td className="py-3.5 px-4 text-xs font-medium text-foreground-800">{row.name}</td>
                      <td className="py-3.5 px-4 text-center text-xs text-foreground-600">{row.starter}</td>
                      <td className="py-3.5 px-4 text-center text-xs text-foreground-800 font-medium bg-primary-50/30">{row.grow}</td>
                      <td className="py-3.5 px-4 text-center text-xs text-foreground-600">{row.business}</td>
                      <td className="py-3.5 px-4 text-center text-xs text-foreground-600">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Enterprise Callout */}
        <section className="py-14 md:py-20 px-4 md:px-6 bg-background-50">
          <div className="max-w-4xl mx-auto bg-background-100 rounded-2xl border border-background-200/70 p-8 md:p-10 flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-3">Enterprise</p>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground-950 leading-tight">
                Need something tailored?
              </h2>
              <p className="mt-3 text-sm text-foreground-600 leading-relaxed max-w-md">
                We offer custom pricing, dedicated infrastructure, advanced security reviews, custom SLAs, and white-glove onboarding for large organizations. Let's build the perfect plan for your team.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <a
                  href="/contact"
                  className="text-sm font-semibold bg-foreground-950 text-background-50 hover:bg-foreground-800 transition-colors whitespace-nowrap cursor-pointer px-6 py-2.5 rounded-md text-center"
                >
                  Contact Sales
                </a>
                <a
                  href="#faq"
                  className="text-sm font-medium text-foreground-600 hover:text-foreground-900 transition-colors whitespace-nowrap cursor-pointer px-6 py-2.5 rounded-md border border-background-200/70 text-center"
                >
                  View FAQ
                </a>
              </div>
            </div>
            <div className="flex-shrink-0 grid grid-cols-2 gap-3">
              {[
                { icon: "ri-building-line", label: "Custom SLA" },
                { icon: "ri-shield-check-line", label: "SOC 2 / HIPAA" },
                { icon: "ri-user-star-line", label: "Dedicated Manager" },
                { icon: "ri-server-line", label: "Private Cloud" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2 bg-background-50 rounded-lg border border-background-200/70 px-4 py-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-accent-100">
                    <i className={`${item.icon} text-sm text-accent-600`}></i>
                  </div>
                  <span className="text-[10px] font-medium text-foreground-700 whitespace-nowrap">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-14 md:py-20 px-4 md:px-6 bg-background-100">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-3">FAQ</p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950">Frequently asked questions</h2>
            </div>
            <div className="space-y-3">
              {pricingFAQ.map((faq, i) => (
                <div key={i} className="bg-background-50 rounded-xl border border-background-200/70 overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer hover:bg-background-100 transition-colors"
                  >
                    <span className="text-sm font-medium text-foreground-900 pr-4">{faq.question}</span>
                    <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full bg-background-200/80 transition-transform duration-200" style={{ transform: expandedFaq === i ? "rotate(45deg)" : "rotate(0deg)" }}>
                      <i className="ri-add-line text-xs text-foreground-600"></i>
                    </span>
                  </button>
                  {expandedFaq === i && (
                    <div className="px-5 pb-4 animate-[fadeInUp_0.2s_ease-out]">
                      <p className="text-sm text-foreground-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-16 md:py-22 px-4 md:px-6 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://readdy.ai/api/search-image?query=Warm%20abstract%20gradient%20background%20with%20soft%20flowing%20curves%2C%20orange%20and%20cream%20tones%20blending%20organically%2C%20minimalist%20modern%20design%2C%20light%20airy%20atmosphere%20with%20subtle%20texture%2C%20clean%20professional%20aesthetic%2C%20high%20quality%20digital%20art%20render%20with%20gentle%20color%20transitions%2C%20abstract%20connective%20node%20patterns%20faintly%20visible%20in%20the%20background&width=1920&height=600&seq=cta-bg-v2&orientation=landscape"
              alt=""
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2 className="font-heading text-2xl md:text-4xl font-bold text-background-50 leading-tight">
              Ready to unify your messaging?
            </h2>
            <p className="mt-4 text-sm md:text-base text-background-50/70 leading-relaxed">
              Start your 14-day free trial today. No credit card, no commitment, full access to all features.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/contact"
                className="text-sm font-semibold bg-background-50 text-foreground-950 hover:bg-background-100 transition-colors whitespace-nowrap cursor-pointer px-8 py-3.5 rounded-md"
              >
                Start Free Trial
              </a>
              <a
                href="#faq"
                className="text-sm font-medium text-background-50/90 hover:text-background-50 transition-colors whitespace-nowrap cursor-pointer px-8 py-3.5 rounded-md border border-background-50/30"
              >
                Talk to Sales
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}