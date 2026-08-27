import React from 'react';
import { Star } from 'lucide-react';
import { Reveal } from '../Effects/Reveal';

export const BaselineTestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "Our packaging redesigns now clear compliance in minutes, not weeks. The on-canvas font gauge caught a critical violation before 500k units hit print — pure magic.",
      author: "Priya Sharma",
      role: "VP Quality & Packaging, Heritage Consumer Brands",
      color: "var(--coral)",
      emoji: "🎯"
    },
    {
      quote: "The Unit Sale Price calculator and one-click artwork fix wiped out show-cause notices across four states. I actually look forward to audits now.",
      author: "Rajesh Kulkarni",
      role: "Head of Regulatory & Compliance, Apex Foods Ltd.",
      color: "var(--sky)",
      emoji: "🚀"
    },
    {
      quote: "A total game changer for e-commerce catalog audits. Scanning 200+ vendor listings takes seconds and spits out publication-ready inspection certificates.",
      author: "Anand Sen",
      role: "Lead Legal Counsel, Bharat Marketplace",
      color: "var(--lime-deep)",
      emoji: "✨"
    }
  ];

  return (
    <section id="testimonials" className="py-20 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <Reveal variant="up" className="max-w-2xl">
        <div className="baseline-eyebrow tone-dark mb-3">
          <span className="eyebrow-dot" />
          <span>People actually love using this</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-display font-semibold uppercase tracking-tight leading-[0.95] text-[var(--ink)]">
          Trusted (and enjoyed) across <span className="text-gradient-candy">FMCG &amp; retail</span>
        </h2>
      </Reveal>

      {/* 3-Up Grid */}
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {testimonials.map((item, idx) => (
          <Reveal key={idx} variant="up" delay={(idx + 1) as 1 | 2 | 3}>
            <li
              className="pop-card group h-full rounded-[var(--radius-card)] bg-[var(--surface)] p-6 sm:p-7 border-2 flex flex-col justify-between shadow-sm"
              style={{ borderColor: 'var(--hairline)' }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-sm float-idle-slow"
                    style={{ backgroundColor: item.color, animationDelay: `${idx * 0.4}s` }}
                  >
                    {item.emoji}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-[var(--sunny)] text-[var(--sunny)]" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-sm sm:text-base text-[var(--ink)] leading-relaxed font-normal">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>

              <figcaption className="mt-8 pt-4 border-t border-[var(--hairline)]">
                <div className="text-sm font-semibold text-[var(--ink)]">
                  {item.author}
                </div>
                <div className="text-xs text-[var(--ink-soft)] mt-0.5">
                  {item.role}
                </div>
              </figcaption>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
};
