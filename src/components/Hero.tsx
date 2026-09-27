"use client";

import { useState, useEffect } from "react";
import Button from "./Button";
import MediaSlot from "./MediaSlot";
import { QUOTE_ANCHOR } from "@/lib/anchors";
import { useAnchorHref } from "@/lib/use-quote-jump";
import { TRUST_FACTS, BUSINESS } from "@/data/business";
import { AREA_SUMMARY } from "@/data/areas";
import { MEDIA } from "@/data/media";

/**
 * Hero.
 *
 * Server component - the entrance animation is pure CSS via .hero-enter, so
 * there is no JavaScript on the critical path.
 *
 * The heading is the LCP element, so it is text rather than an image, and the
 * photograph slot sits to the right where it cannot delay it. On a phone the
 * photograph is dropped below the fold entirely.
 */
export default function Hero() {
  const quoteHref = useAnchorHref(QUOTE_ANCHOR);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-line pt-header"
    >
      {/* Faint grid, evoking graph paper / a technical drawing. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(21,24,22,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(21,24,22,0.05) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 70% 0%, black, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 70% 0%, black, transparent 75%)",
        }}
      />

      <div className="shell">
        <div className="grid items-end gap-10 py-14 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:py-28">
          {/* Copy */}
          <div className="lg:col-span-7">
            <p className="hero-enter hero-enter-1 eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-green-ink">
              <span>Domestic</span>
              <span aria-hidden="true" className="text-line">
                /
              </span>
              <span>Commercial</span>
              <span aria-hidden="true" className="text-line">
                /
              </span>
              <span>Emergency</span>
            </p>

            <h1
              id="hero-heading"
              className="hero-enter hero-enter-2 mt-6 text-display-xl text-ink"
            >
              <span className="block">Electricians</span>
              <span className="block">across</span>
              <span className="block text-green-ink"><RotatingArea /></span>
            </h1>

            <p className="hero-enter hero-enter-3 mt-7 max-w-[54ch] text-lg leading-relaxed text-muted sm:text-xl">
              {BUSINESS.facts.fullyQualifiedNote} Public liability covered to{" "}
              {BUSINESS.facts.publicLiability}. Free, no-obligation quotes -
              and no job is too small.
            </p>

            <div className="hero-enter hero-enter-4 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                href={quoteHref}
                size="lg"
                arrow
                analyticsEvent="quote_cta_clicked"
                analyticsLocation="hero"
                analyticsAction="hero_primary"
              >
                Get a free quote
              </Button>
              <Button
                href={BUSINESS.phone.href}
                size="lg"
                variant="outline"
                analyticsEvent="phone_clicked"
                analyticsLocation="hero"
                analyticsAction="hero_call"
              >
                Call {BUSINESS.phone.display}
              </Button>
            </div>

            {/* Trust strip */}
            <dl className="hero-enter hero-enter-5 mt-12 grid grid-cols-3 gap-px overflow-hidden border border-line bg-line">
              {TRUST_FACTS.map((fact) => (
                <div key={fact.id} className="bg-warm px-3 py-4 sm:px-5 sm:py-5">
                  <dt className="sr-only">{fact.label}</dt>
                  <dd>
                    <span className="block font-display text-xl font-extrabold tracking-[-0.02em] text-ink sm:text-2xl">
                      {fact.value}
                    </span>
                    <span className="mt-1 block text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-muted sm:text-xs">
                      {fact.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Photograph */}
          <div className="hero-enter hero-enter-6 lg:col-span-5">
            <MediaSlot
              slot={MEDIA.hero}
              className="w-full shadow-[0_2px_0_0_rgba(21,24,22,0.08)]"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Covering {AREA_SUMMARY} and surrounding areas. Based in{" "}
              {BUSINESS.address.town}, {BUSINESS.address.region}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RotatingArea() {
  const areas = ["Edinburgh", "Lothians", "Fife"];
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % areas.length), 1000);
    return () => clearInterval(timer);
  }, [areas.length]);
  return <span className="text-green-ink transition-opacity duration-300 ease-in-out">{areas[index]}</span>;
}
