import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { integrationConnectors } from "@/mocks/homepage";

type Connector = (typeof integrationConnectors)[number];

export default function IntegrationHub() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);

  const handleReadDocs = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === "/partners" || location.pathname.startsWith("/partners")) {
      const el = document.getElementById("developer");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/partners#developer");
    }
  };

  const handleViewSDKs = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === "/partners" || location.pathname.startsWith("/partners")) {
      const el = document.getElementById("developer");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/partners#developer");
    }
  };

  const handleConnectorClick = (connector: Connector) => {
    setSelectedConnector(connector);
  };

  const closeModal = () => {
    setSelectedConnector(null);
  };

  return (
    <>
      <section id="api-hub" className="py-16 md:py-20 px-4 md:px-6 bg-background-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-500 mb-3">
              Unified API Hub
            </p>
            <h2 className="font-heading text-2xl md:text-4xl font-bold text-foreground-950 leading-tight">
              Connect with your entire
              <br />
              tech ecosystem.
            </h2>
            <p className="mt-3 text-sm md:text-base text-foreground-600 max-w-xl mx-auto">
              Our API hub lets you sync data, automate workflows, and build custom integrations with any service.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {integrationConnectors.map((connector) => (
              <div
                key={connector.name}
                onClick={() => handleConnectorClick(connector)}
                className="group bg-background-50 rounded-xl p-5 md:p-6 border border-background-200/70 transition-all duration-300 hover:border-primary-300 cursor-pointer"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-accent-100 group-hover:bg-accent-200 transition-colors">
                  <i className={`${connector.icon} text-lg text-accent-600`}></i>
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground-900">
                  {connector.name}
                </h3>
                <p className="mt-2 text-sm text-foreground-500 leading-relaxed">
                  {connector.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-accent-600 group-hover:text-accent-700 transition-colors">
                  View details <i className="ri-arrow-right-line"></i>
                </span>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-background-50 rounded-xl border border-background-200/70 p-6 md:p-8">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-500 mb-1">
                  Developer-Friendly
                </p>
                <h3 className="font-heading text-lg md:text-xl font-bold text-foreground-950">
                  Build anything with our API
                </h3>
                <p className="mt-2 text-sm text-foreground-600 leading-relaxed">
                  Comprehensive REST and GraphQL APIs with real-time webhooks, detailed documentation, and SDKs for Python, JavaScript, Ruby, PHP, and Go. Build custom workflows that fit your business perfectly.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <a
                  href="/partners#developer"
                  onClick={handleReadDocs}
                  className="text-sm font-semibold bg-foreground-950 text-background-50 hover:bg-foreground-800 transition-colors whitespace-nowrap cursor-pointer px-6 py-2.5 rounded-md text-center"
                >
                  Read API Docs
                </a>
                <a
                  href="/partners#developer"
                  onClick={handleViewSDKs}
                  className="text-sm font-medium text-foreground-700 hover:text-foreground-950 transition-colors whitespace-nowrap cursor-pointer px-6 py-2.5 rounded-md border border-background-300 text-center"
                >
                  View SDKs
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedConnector && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-foreground-950/50 backdrop-blur-sm" />
          <div
            className="relative z-10 bg-background-50 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto border border-background-200/70"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-background-50/95 backdrop-blur-sm border-b border-background-200/70 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-accent-100">
                  <i className={`${selectedConnector.icon} text-lg text-accent-600`}></i>
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground-950">
                  {selectedConnector.name}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background-200/70 transition-colors cursor-pointer text-foreground-400 hover:text-foreground-700"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>

            <div className="px-6 py-5">
              <p className="text-sm text-foreground-600 leading-relaxed">
                {selectedConnector.detail}
              </p>

              <div className="mt-5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground-500 mb-3">
                  Key Capabilities
                </h4>
                <ul className="space-y-2">
                  {selectedConnector.bullets.map((bullet: string) => (
                    <li key={bullet} className="flex items-start gap-2.5 text-sm text-foreground-700">
                      <i className="ri-check-line text-accent-500 flex-shrink-0 mt-0.5"></i>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 bg-foreground-950 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-background-50/50 uppercase tracking-wider">
                    {selectedConnector.name === "Zapier" ? "Example Zap" : selectedConnector.name === "SSO / SAML" ? "Setup Flow" : "Code Example"}
                  </span>
                  <span className="text-xs text-background-50/30">{selectedConnector.name === "Zapier" || selectedConnector.name === "SSO / SAML" ? "" : "bash"}</span>
                </div>
                <pre className="text-xs font-mono text-background-50/80 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                  {selectedConnector.codeExample}
                </pre>
              </div>

              <div className="mt-5 pt-4 border-t border-background-200/70 flex justify-end">
                <button
                  onClick={closeModal}
                  className="text-sm font-medium bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer px-5 py-2 rounded-md"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}