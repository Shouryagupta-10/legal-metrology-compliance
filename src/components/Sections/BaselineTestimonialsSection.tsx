import React from 'react';

export const BaselineTestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "Our FMCG packaging design iterations now clear legal compliance in minutes instead of weeks. The on-canvas Schedule II font gauge caught a critical Table 1 violation before 500k units went to print.",
      author: "Priya Sharma",
      role: "VP Quality & Packaging, Heritage Consumer Brands"
    },
    {
      quote: "The Unit Sale Price calculator and 1-click artwork redline feature completely eliminated show-cause notices for our retail product line across 4 states.",
      author: "Rajesh Kulkarni",
      role: "Head of Regulatory & Compliance, Apex Foods Ltd."
    },
    {
      quote: "A game changer for e-commerce catalog audits. Scanning 200+ vendor listings under Rule 6(10) takes seconds and outputs publication-ready statutory inspection certificates.",
      author: "Anand Sen",
      role: "Lead Legal Counsel, Bharat Marketplace"
    }
  ];

  return (
    <section id="testimonials" className="py-20 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-2xl">
        <div className="baseline-eyebrow tone-dark mb-3">
          <span className="eyebrow-dot" />
          <span>Statutory Auditing Impact</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-medium uppercase tracking-tight leading-[0.95] text-[var(--ink)]">
          Trusted across FMCG &amp; retail brands
        </h2>
      </div>

      {/* 3-Up Grid */}
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {testimonials.map((item, idx) => (
          <li
            key={idx}
            className="group rounded-[var(--radius-card)] bg-[var(--surface)] p-6 sm:p-7 border border-[var(--hairline)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-white"
          >
            <div>
              <span className="text-4xl font-serif text-[var(--brand)] block leading-none select-none">
                “
              </span>
              <blockquote className="text-sm sm:text-base text-[var(--ink)] leading-relaxed mt-4 font-normal">
                {item.quote}
              </blockquote>
            </div>

            <figcaption className="mt-8 pt-4 border-t border-[var(--hairline)]">
              <div className="text-sm font-medium text-[var(--ink)]">
                {item.author}
              </div>
              <div className="text-xs text-[var(--ink-soft)] mt-0.5">
                {item.role}
              </div>
            </figcaption>
          </li>
        ))}
      </ul>
    </section>
  );
};
