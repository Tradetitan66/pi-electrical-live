"use client";

import { BUSINESS, HERO_INTRO } from "@/data/business";
import Button from "./Button";

/**
 * Hero.
 *
 * Premium dark theme hero with 3-value row beneath CTAs.
 * Refined editorial layout with clean spacing.
 */
export default function Hero() {
  const quoteHref = "#quote";

  return (
    <section
      aria-labelledby="hero-heading"
      data-first-section
      className="relative pt-header"
      style={{ backgroundColor: "#2A2A2A" }}
    >
      <div className="shell mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:py-28 xl:py-32">
        <div className="max-w-[800px] mx-auto">
          <div className="flex flex-col gap-8">
            {/* Eyebrow */}
            <p
              className="font-sans text-[14px] font-medium uppercase tracking-[0.14em]"
              style={{ color: "#B8B8B2" }}
            >
              DOMESTIC / COMMERCIAL / EMERGENCY
            </p>

            {/* Main Heading */}
            <h1
              id="hero-heading"
              className="font-display font-bold tracking-[-0.03em] leading-[0.95] max-w-[900px] mx-auto"
              style={{
                fontSize: "clamp(56px, 6vw, 88px)",
                color: "#FFFFFF"
              }}
            >
              Providing all aspects<br className="hidden sm:block" /> of electrical work.
            </h1>

            {/* Supporting Copy */}
            <p
              className="max-w-[650px] text-[20px] leading-[1.55] sm:text-[17px]"
              style={{ color: "#D0D0CB" }}
            >
              {HERO_INTRO}
            </p>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                href={quoteHref}
                size="lg"
                analyticsEvent="quote_cta_clicked"
                analyticsLocation="hero"
                analyticsAction="hero_primary"
                className="hero-cta-primary font-semibold px-6 py-4 rounded-[6px] transition-all duration-300 ease-in-out"
              >
                Get a free quote →
              </Button>
              <Button
                href={BUSINESS.phone.href}
                size="lg"
                variant="outline"
                analyticsEvent="phone_clicked"
                analyticsLocation="hero"
                analyticsAction="hero_call"
                className="font-semibold bg-transparent text-white border border-[#747474] hover:bg-[#383838] hover:border-[#888888] px-6 py-4 rounded-[6px] transition-all duration-300 ease-in-out"
              >
                Call {BUSINESS.phone.display}
              </Button>
            </div>

            {/* Divider */}
            <div
              className="mt-12 h-px w-full"
              style={{ backgroundColor: "#474747" }}
            />

            {/* 3-Value Row */}
            <div className="mt-12 grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
              {/* Column 1: NEAT WORKMANSHIP */}
              <div className="flex flex-col gap-3">
                <h3
                  className="font-sans text-[14px] font-bold uppercase tracking-[0.14em]"
                  style={{ color: "#F4F4F1" }}
                >
                  NEAT WORKMANSHIP
                </h3>
                <p
                  className="font-sans text-[16px] leading-[1.6]"
                  style={{ color: "#B8B8B2" }}
                >
                  A finish we&apos;re proud to put our name to.
                </p>
              </div>

              {/* Column 2: CLEAR COMMUNICATION */}
              <div className="flex flex-col gap-3">
                <h3
                  className="font-sans text-[14px] font-bold uppercase tracking-[0.14em]"
                  style={{ color: "#F4F4F1" }}
                >
                  CLEAR COMMUNICATION
                </h3>
                <p
                  className="font-sans text-[16px] leading-[1.6]"
                  style={{ color: "#B8B8B2" }}
                >
                  From first message to final finish.
                </p>
              </div>

              {/* Column 3: PROFESSIONAL SERVICE */}
              <div className="flex flex-col gap-3">
                <h3
                  className="font-sans text-[14px] font-bold uppercase tracking-[0.14em]"
                  style={{ color: "#F4F4F1" }}
                >
                  PROFESSIONAL SERVICE
                </h3>
                <p
                  className="font-sans text-[16px] leading-[1.6]"
                  style={{ color: "#B8B8B2" }}
                >
                  Punctual, tidy and easy to deal with.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
