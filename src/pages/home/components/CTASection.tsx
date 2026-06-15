export default function CTASection() {
  return (
    <section className="relative py-20 md:py-28 px-4 md:px-6 overflow-hidden">
      <div className="absolute inset-0 cta-bg">
        <div className="cta-blob cta-blob-1" />
        <div className="cta-blob cta-blob-2" />
        <div className="absolute inset-0 bg-primary-950/30" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold text-background-50 leading-tight">
          Ready to transform your
          <br />
          customer experience?
        </h2>
        <p className="mt-4 text-sm md:text-base text-background-50/70 leading-relaxed">
          Join 10,000+ businesses already using OPSConnect to unify their messaging and delight customers at every touchpoint.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/register"
            className="text-sm font-semibold bg-background-50 text-foreground-950 hover:bg-background-100 transition-colors whitespace-nowrap cursor-pointer px-8 py-3.5 rounded-md"
          >
            Start Free Trial
          </a>
          <a
            href="/demo"
            className="text-sm font-medium text-background-50/90 hover:text-background-50 transition-colors whitespace-nowrap cursor-pointer px-8 py-3.5 rounded-md border border-background-50/30"
          >
            Book a Demo
          </a>
        </div>
        <p className="mt-5 text-xs text-background-50/50">
          No credit card required. 14-day free trial with full access.
        </p>
      </div>

      <style>{`
        .cta-bg {
          background: linear-gradient(120deg,
            oklch(var(--primary-950)) 0%,
            oklch(var(--primary-700)) 50%,
            oklch(var(--accent-700)) 100%);
          background-size: 200% 200%;
          animation: ctaGradient 16s ease infinite;
        }
        @keyframes ctaGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .cta-blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(64px);
          opacity: 0.5;
          will-change: transform;
        }
        .cta-blob-1 {
          width: 360px; height: 360px; top: -120px; left: 5%;
          background: oklch(var(--accent-500));
          animation: ctaBlob1 18s ease-in-out infinite;
        }
        .cta-blob-2 {
          width: 320px; height: 320px; bottom: -140px; right: 8%;
          background: oklch(var(--primary-400));
          animation: ctaBlob2 22s ease-in-out infinite;
        }
        @keyframes ctaBlob1 {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(50px,30px); }
        }
        @keyframes ctaBlob2 {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(-40px,-30px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cta-bg, .cta-blob-1, .cta-blob-2 { animation: none; }
        }
      `}</style>
    </section>
  );
}