import { useState } from "react";
import { apiEndpoints, embedCodeExample } from "@/mocks/partners";

export default function DeveloperResources() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const handleCopyEndpoint = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedEndpoint(path);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCodeExample);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <section className="py-16 md:py-20 px-4 md:px-6 bg-background-100">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-500 mb-3">
            Developer Resources
          </p>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950 leading-tight">
            API endpoints & embed tools
          </h2>
          <p className="mt-3 text-sm md:text-base text-foreground-600">
            Integrate OPSConnect into your application with our REST API or embed the chat widget directly on your site.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-heading text-lg font-bold text-foreground-950 mb-4">Core API Endpoints</h3>
            <div className="space-y-3">
              {apiEndpoints.map((ep) => (
                <div
                  key={ep.path}
                  className="bg-background-50 rounded-lg border border-background-200/70 p-4 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-md flex-shrink-0 ${
                        ep.method === "POST"
                          ? "bg-primary-100 text-primary-700"
                          : "bg-accent-100 text-accent-700"
                      }`}
                    >
                      {ep.method}
                    </span>
                    <div className="min-w-0">
                      <code className="text-xs text-foreground-700 font-mono block truncate">{ep.path}</code>
                      <p className="text-xs text-foreground-400 mt-0.5">{ep.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyEndpoint(ep.path)}
                    className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-md cursor-pointer text-foreground-400 hover:text-foreground-700 hover:bg-background-200/70 transition-colors"
                  >
                    <i className={`text-sm ${copiedEndpoint === ep.path ? "ri-check-line text-accent-500" : "ri-file-copy-line"}`}></i>
                  </button>
                </div>
              ))}
            </div>

            <a
              href="/partners#developer"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("developer");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors cursor-pointer"
            >
              View full API documentation <i className="ri-arrow-right-line"></i>
            </a>
          </div>

          <div>
            <h3 className="font-heading text-lg font-bold text-foreground-950 mb-4">Website Embed Widget</h3>
            <div className="bg-foreground-950 text-background-50 rounded-lg border border-foreground-800 p-5 relative">
              <button
                onClick={handleCopyEmbed}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-md cursor-pointer text-background-50/40 hover:text-background-50 hover:bg-foreground-800 transition-colors"
              >
                <i className={`text-sm ${copiedEmbed ? "ri-check-line text-accent-400" : "ri-file-copy-line"}`}></i>
              </button>
              <pre className="text-xs font-mono leading-relaxed overflow-x-auto pr-8 text-background-50/70">
{embedCodeExample}
              </pre>
            </div>
            <p className="mt-3 text-xs text-foreground-400">
              Paste this snippet just before the closing <code className="text-foreground-600">&lt;/body&gt;</code> tag on any website. The widget is fully self-contained and works immediately — no external dependencies or API keys needed for demo. Customize the accent color directly in the script.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}