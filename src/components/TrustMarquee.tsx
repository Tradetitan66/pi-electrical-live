"use client";

import { useState } from "react";
import { cx } from "@/lib/cx";

export interface MarqueeFact {
  id: string;
  value: string;
  label: string;
}

/**
 * How many times the fact list is repeated inside the track.
 *
 * The track translates by exactly one copy width, so copy N lands precisely
 * where copy N-1 was and the loop is seamless.
 *
 * The no-gap condition is NOT "one copy is wider than the viewport". The track
 * starts at N copies wide and ends shifted left by a single copy, so the worst
 * case is at the end of a cycle, when (N-1) copies must still cover the
 * viewport. With 6 copies that leaves 5 copies of cover: about 4.7x the widest
 * measured copy (941px on the home page), so it holds on any realistic display.
 * A 3-fact set would need about 3.2 copies at a 1440px viewport, so 4 was the
 * previous value and it did gap on very wide screens.
 *
 * COPIES must stay in step with --marquee-copies in globals.css, which the
 * keyframe divides by. The test asserts the two agree.
 */
const COPIES = 6;

interface TrustMarqueeProps {
  facts: readonly MarqueeFact[];
  /** Accessible name for the region, and the context for the pause control. */
  label: string;
  /**
   * "compact" - one horizontal row, green tick, value and label inline.
   *            Used on the home page, where the three facts read as a strip.
   * "stacked" - value above an uppercase label, in a definition list.
   *            Used on the projects page, where the facts are part of the
   *            written credentials and the bigger type carries better.
   */
  variant?: "compact" | "stacked";
  className?: string;
}

/**
 * The verified-credentials strip, scrolling continuously.
 *
 * Accessibility notes, because a moving strip is easy to get wrong:
 *
 *  - Only the FIRST copy is exposed to assistive tech. The other three are
 *    `aria-hidden`, so the facts are announced once rather than four times.
 *    `aria-hidden` alone is not enough for the CSS below to hide the clones
 *    under reduced motion, so clones also carry a class.
 *  - The loop is pausable. WCAG 2.2.2 requires a mechanism to stop content
 *    that moves automatically for more than five seconds, and pausing on hover
 *    does not satisfy it for keyboard or touch users, so there is a real
 *    button. It is a plain button whose accessible name changes, NOT
 *    `aria-pressed`: a play/pause control that also changes its visible text
 *    is confusing to announce.
 *  - It also stops on hover and on focus-within, so it never moves while
 *    someone is reading it or has focus inside it.
 *  - Under `prefers-reduced-motion: reduce` the animation is removed entirely
 *    and the clones are hidden, leaving a plain static row of the real facts.
 *    The toggle is hidden too, since there is then nothing to pause.
 *
 * Pause state is deliberately three-valued rather than a boolean:
 *
 *   null  - untouched. The visitor has not expressed a preference, so the
 *           convenience pauses (hover, focus-within) apply.
 *   true  - explicitly paused by the button. Stays paused regardless of where
 *           the pointer is.
 *   false - explicitly resumed by the button. This OVERRIDES the convenience
 *           pauses, otherwise pressing Play while the pointer was still resting
 *           on the strip would appear to do nothing, because :hover would
 *           immediately re-pause it.
 */
export default function TrustMarquee({
  facts,
  label,
  variant = "compact",
  className,
}: TrustMarqueeProps) {
  const [override, setOverride] = useState<boolean | null>(null);
  const paused = override ?? false;
  const stacked = variant === "stacked";

  const copies = Array.from({ length: COPIES }, (_, copy) => copy);

  const content = (copy: number) =>
    facts.map((fact) => {
      const clone = copy > 0;
      const key = `${copy}-${fact.id}`;

      if (stacked) {
        return (
          <div
            key={key}
            aria-hidden={clone || undefined}
            className={cx(
              "marquee__item flex flex-col justify-center px-6 py-3",
              clone && "marquee__item--clone",
            )}
          >
            <dd className="font-display text-xl font-extrabold tracking-[-0.02em] text-ink">
              {fact.value}
            </dd>
            <dt className="mt-1 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-muted">
              {fact.label}
            </dt>
          </div>
        );
      }

      return (
        <li
          key={key}
          aria-hidden={clone || undefined}
          className={cx(
            "marquee__item flex items-center gap-3 py-1 pl-6 pr-10",
            clone && "marquee__item--clone",
          )}
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green text-black"
          >
            <span className="text-sm leading-none">✓</span>
          </span>
          <span className="text-sm font-semibold text-ink">
            {fact.value}{" "}
            <span className="font-normal text-muted">{fact.label}</span>
          </span>
        </li>
      );
    });

  return (
    <section
      aria-label={label}
      data-paused={override === null ? undefined : override}
      className={cx(
        "marquee relative border-y border-line bg-white",
        className,
      )}
    >
      {/*
        overflow-hidden is load-bearing: without it the translating track widens
        the page and produces a horizontal scrollbar on the whole document.
      */}
      <div className="marquee__viewport overflow-hidden">
        {stacked ? (
          <dl className="marquee__track">
            {copies.map((copy) => content(copy))}
          </dl>
        ) : (
          <ul role="list" className="marquee__track">
            {copies.map((copy) => content(copy))}
          </ul>
        )}
      </div>

      {/*
        Absolutely positioned so it adds no height to the strip, on an opaque
        pill because the moving text passes underneath it.
      */}
      <button
        type="button"
        onClick={() => setOverride(!paused)}
        aria-label={
          paused
            ? `Resume scrolling ${label.toLowerCase()}`
            : `Pause scrolling ${label.toLowerCase()}`
        }
        className="marquee__toggle absolute top-1/2 right-3 z-10 flex h-8 -translate-y-1/2 items-center rounded-full border border-line bg-white px-3 text-xs font-semibold text-ink"
      >
        <span aria-hidden="true">{paused ? "▶" : "❚❚"}</span>
        <span className="ml-1.5">{paused ? "Play" : "Pause"}</span>
      </button>
    </section>
  );
}
