import { coreFeatures } from "@/mocks/homepage";

export default function FeatureSections() {
  return (
    <section id="features" className="py-16 md:py-20 px-4 md:px-6 bg-background-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-3">
            Features
          </p>
          <h2 className="font-heading text-2xl md:text-4xl font-bold text-foreground-950 leading-tight">
            Everything you need to deliver
            <br />
            exceptional customer experiences.
          </h2>
        </div>

        <div className="flex flex-col gap-16 md:gap-20">
          {coreFeatures.map((feature, index) => {
            const isReversed = index % 2 === 1;
            return (
              <div
                key={feature.id}
                id={feature.id}
                className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-8 lg:gap-12`}
              >
                <div className="flex-1 w-full">
                  <div className="relative rounded-xl overflow-hidden bg-background-100 aspect-[3/2]">
                    <img
                      src={feature.imageUrl}
                      alt={feature.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent-500 mb-2">
                    {feature.subtitle}
                  </p>
                  <h3 className="font-heading text-xl md:text-3xl font-bold text-foreground-950 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-sm md:text-base text-foreground-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {feature.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2.5 text-sm text-foreground-700">
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-accent-100 flex-shrink-0">
                          <i className="ri-check-line text-xs text-accent-600"></i>
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}