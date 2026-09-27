"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * ============================================================================
 * AUTO-ADVANCING HORIZONTAL STRIP
 * ----------------------------------------------------------------------------
 * Steps a snap-scrolled list forward one item at a time on its own, so the
 * items nobody would otherwise swipe to advertise themselves.
 *
 * Built for the QuickActions band under the hero. Framework-free in the same
 * way as lib/scroll-past.ts and lib/overlay.ts: it drives DOM scroll position
 * and knows nothing about the list it is driving.
 *
 * ---------------------------------------------------------------------------
 * PAUSE IS NOT STOP
 * ---------------------------------------------------------------------------
 * Two different things, and conflating them is the bug this design avoids.
 *
 * PAUSE (resumable). The tab is hidden, the viewport is desktop-sized, or the
 * visitor prefers reduced motion. Nothing about the visitor's intent changed,
 * so the loop picks up again.
 *
 * STOP (permanent). The visitor touched, focused, or scrolled the strip. At that
 * point they are driving, and the strip must never move again on its own. This
 * is the mis-tap guard: a tile shifting under a finger that is reaching for it
 * is how someone ends up tapping "Emergency" when they meant "Free quote".
 *
 * Note what is NOT a pause: the strip being scrolled out of view. It cycles from
 * page load. The homepage hero is about 1435px tall on a phone, so the band does
 * not appear until roughly 600px of scrolling, and gating the loop on visibility
 * made the feature look entirely dead - you had to already be looking at the
 * band for it to move. Cycling up front means it is turning by the time it is
 * reached. The trade is that the tile a visitor arrives at is whichever one the
 * loop happens to be on, rather than always "Call Paul".
 * ---------------------------------------------------------------------------
 * ACCESSIBILITY: A KNOWN, DELIBERATE WCAG 2.2.2 DEVIATION
 * ---------------------------------------------------------------------------
 * This is auto-moving content that runs for more than five seconds, and the
 * stop is incidental - the visitor has to happen to interact - rather than an
 * explicit control. WCAG 2.2.2 asks for a mechanism to pause, stop, or hide it,
 * so this does not comply. That is a known, accepted trade-off rather than an
 * oversight, taken to keep the band free of a pause button.
 *
 * What is done to limit the harm: it is phone-only (the desktop layout is a
 * static grid with nothing to scroll), it pauses when the tab is hidden, it
 * pauses while an overlay has the page inert, it never runs under reduced
 * motion, one loop is about twenty seconds, and any interaction stops it for
 * good.
 *
 * If this ever needs to comply, the change is small: expose `stopped` and render
 * a play/pause button beside the indicators. The stop machinery is already here.
 * ============================================================================
 */

/**
 * Default width ceiling. Above it the QuickActions list becomes a multi-column
 * grid with nothing to scroll, so advancing it would be a no-op - the loop is
 * simply pointless there rather than wrong.
 *
 * Callers that advance at every width (the work carousel) pass their own.
 */
const MOBILE_MAX = "(max-width: 639.98px)";

/** Matches every viewport, for callers that scroller at all screen sizes. */
export const ALL_WIDTHS = "(min-width: 0px)";

/** Debounce after a touch, so a tap that never scrolls still stops the loop. */
const SETTLE_MS = 500;

export interface AutoAdvance<T extends HTMLElement> {
  /** Attach to the scrolling element. */
  ref: React.RefObject<T | null>;
  /**
   * Index of the item nearest the left edge, for the position indicators.
   * Always within 0..count-1, even on a looping strip, so callers can use it
   * against their own items without knowing about the runway copies.
   */
  index: number;
  /** True once the visitor has interacted. Exposed for tests and future UI. */
  stopped: boolean;
  /** Stop the loop permanently. Wired to the strip's interaction handlers. */
  stop: () => void;
  /**
   * Bring a given slide to the start edge, e.g. from an indicator button.
   *
   * Returns false if the target is unreachable or the position is already
   * correct, so callers can avoid a pointless smooth scroll. Deliberately does
   * NOT stop the loop: clicking a dot is not the visitor taking over the
   * carousel, they are still browsing. A real drag or tap on a slide does
   * stop it, via the interaction handlers.
   */
  goTo: (index: number) => boolean;
  /**
   * One slide forward / back, wrapping around at the ends. Returns the new
   * index, or null if there was nowhere to move, so the auto-advance loop can
   * tell a real step from a no-op and stand itself down.
   *
   * Like `goTo`, these do NOT stop the loop. Pressing an arrow is deliberate
   * navigation, not the visitor grabbing the strip, so the carousel keeps
   * turning. Because the strip wraps, neither arrow is ever disabled.
   */
  next: () => number | null;
  prev: () => number | null;
}

export function useAutoAdvance<T extends HTMLElement>({
  interval = 4000,
  count,
  maxWidth = MOBILE_MAX,
  loop = false,
}: {
  /** Delay between steps, in ms. */
  interval?: number;
  /** Number of items. The loop wraps at this many. */
  count: number;
  /** Media query bounding the widths that advance. */
  maxWidth?: string;
  /**
   * Set when the caller repeats the first slides at the end of the strip as
   * runway, so the last real slide can be scrolled to the start edge and the
   * strip can keep going forwards without a dead end. See the LONG NOTE on
   * runway copies in WorkCarousel.tsx for why a strip of photos needs this.
   *
   * Off by default: QuickActions is a plain list with no runway, and folding
   * positions that are not there would be nonsense.
   */
  loop?: boolean;
}): AutoAdvance<T> {
  const ref = useRef<T | null>(null);

  /* Starts at 0 and is corrected from real scroll position, so the indicators
     are right even before the first tick and after a manual swipe. */
  const [index, setIndex] = useState(0);
  const [stopped, setStopped] = useState(false);

  const stoppedRef = useRef(false);
  /* Guards the interaction listeners while our own smooth scroll is in
     flight, so the loop does not cancel itself on tick one. */
  const selfScrollRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    stoppedRef.current = true;
    setStopped(true);
    clearTimer();
  }, [clearTimer]);

  /* ---------------------------------------------------------------------
   * Position, measured from the live layout
   * ------------------------------------------------------------------ */

  /** Signed distance to bring `child`'s start edge to the scroller's start edge. */
  const offsetOf = useCallback((child: HTMLElement): number => {
    const el = ref.current;
    if (!el) return 0;
    return child.getBoundingClientRect().left - el.getBoundingClientRect().left;
  }, []);

  /**
   * Absolute position in the strip: how many slides from the first, counting
   * any runway copies at the end. Measured from live geometry rather than
   * computed as `scrollLeft / slideWidth`, which is wrong twice over - it
   * ignores the flex gap, so the answer drifts further off the further along
   * the strip you go, and it cannot describe a clamped end at all.
   *
   * On a looping strip the position is folded back into the first cycle, and
   * the scroll is corrected to match, before the value is returned. The copy
   * the visitor is looking at is identical to the real slide it stands in for,
   * so the correction is invisible - and without it the strip would grind to a
   * halt on the runway and the indicators would keep climbing past count.
   */
  const measureAbsolute = useCallback((): number => {
    const el = ref.current;
    if (!el) return 0;

    const last = el.children.length - 1;
    if (last <= 0) return 0;

    /* Nothing to scroll: a multi-column grid with overflow visible, e.g.
       QuickActions from sm up. There is no position to report. */
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) return 0;

    let found: number;

    if (el.scrollLeft <= 0) {
      found = 0;
    } else if (el.scrollLeft >= max - 1) {
      /* Clamped at the far end. The last slide may not be flush with the start
         edge there, so it is named directly rather than measured. */
      found = last;
    } else {
      const base = el.getBoundingClientRect().left;
      let best = 0;
      let bestDistance = Infinity;

      for (let i = 0; i <= last; i += 1) {
        const child = el.children[i] as HTMLElement;
        const distance = Math.abs(child.getBoundingClientRect().left - base);
        /* Strictly less, so an exact tie resolves to the earlier slide, which is
           the one the browser snaps to when the strip is dragged to a
           midpoint. */
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      }

      found = best;
    }

    if (!loop || found < count) return found;

    const wrapped = found - count;
    const child = el.children[wrapped] as HTMLElement | null;
    if (!child) return found;

    /* Instant, never smooth: this is a correction under the visitor's feet, and
       animating it would fling them back across the whole gallery. */
    selfScrollRef.current = true;
    el.scrollTo({
      left: Math.max(0, Math.min(max, el.scrollLeft + offsetOf(child))),
      behavior: "instant",
    });
    window.setTimeout(() => {
      selfScrollRef.current = false;
    }, SETTLE_MS);

    return wrapped;
  }, [count, loop, offsetOf]);

  /**
   * Where the scroller would have to sit to bring slide `target` to the start
   * edge, or null if there is nowhere to go.
   *
   * Two things make this more than `scrollLeft + offsetOf(child)`:
   *
   * 1. It clamps to the real scrollable range. A strip does not always have the
   *    runway to bring every slide to the start edge, and the browser silently
   *    discards the overshoot - so the strip stops moving while the indicators
   *    claim it did. A looping strip has runway and never hits this.
   *
   * 2. It reports null when the resolved position is where the strip already
   *    is, so a caller can skip an unreachable target instead of firing a
   *    smooth scroll that announces nothing happened.
   */
  const resolve = useCallback(
    (
      target: number,
    ): { want: number; child: HTMLElement } | null => {
      const el = ref.current;
      if (!el || count <= 1) return null;
      if (target < 0 || target >= el.children.length) return null;

      /* Nothing to scroll: at desktop widths this is a grid with overflow
         visible, so scrollWidth equals clientWidth. */
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return null;

      const child = el.children[target] as HTMLElement | null;
      if (!child) return null;

      const from = el.scrollLeft;
      const want = Math.max(0, Math.min(max, from + offsetOf(child)));

      /* Sub-pixel tolerance throughout: scrollLeft is fractional and settles
         a hair under the values the layout maths predicts. */
      if (Math.abs(want - from) <= 1) return null;

      return { want, child };
    },
    [count, offsetOf],
  );

  /**
   * Scroll to slide `target`, and return the index that ends up on screen.
   * Null means it could not move. Every move goes through here - the timed loop,
   * the indicator buttons and the prev/next arrows - so they cannot disagree
   * about the guards, about clamping, or about when to clear selfScrollRef.
   */
  const moveTo = useCallback(
    (target: number): number | null => {
      const el = ref.current;
      const plan = resolve(target);
      if (!el || !plan) return null;

      selfScrollRef.current = true;
      el.scrollTo({ left: plan.want, behavior: "smooth" });
      /* The smooth scroll emits scroll events for roughly this long. Clearing
         the flag afterwards stops the next tick racing it. */
      window.setTimeout(() => {
        selfScrollRef.current = false;
      }, SETTLE_MS);

      const shown = loop && target >= count ? target - count : target;
      setIndex(shown);
      return shown;
    },
    [count, loop, resolve],
  );

  /**
   * Step one slide in `dir`, wrapping at the ends, and return the new index.
   *
   * The wrap is the fiddly part. On a looping strip, stepping forward off the
   * last slide aims at the first runway copy rather than at slide 1 itself:
   * the copy is the same photograph, so the wrap costs one ordinary stride
   * forwards instead of a fast sweep back across the entire strip, which is
   * what a plain `scrollTo(0)` looks like. Stepping back off the first slide
   * needs no such trick - the last real slide is already there to step back to.
   *
   * The walk over `hop` is what keeps this honest on a strip with no runway,
   * where the slide next to the one on screen may have nowhere to go: it keeps
   * going until it finds one that can move, or gives up, so an arrow is never
   * left doing nothing while the visitor is pressing it.
   */
  const step = useCallback(
    (dir: 1 | -1): number | null => {
      const from = measureAbsolute();
      const total = ref.current?.children.length ?? 0;
      if (count <= 1 || total <= 1) return null;

      for (let hop = 1; hop <= count; hop += 1) {
        const reached = from + dir * hop;
        const virtual = ((reached % count) + count) % count;

        const target =
          loop && reached >= count
            ? count /* first runway copy */
            : loop && reached < 0
              ? count - 1 /* last real slide */
              : virtual;

        if (target < 0 || target >= total) continue;

        const moved = moveTo(target);
        if (moved !== null) return moved;
      }

      return null;
    },
    [count, loop, measureAbsolute, moveTo],
  );

  /** Step forward, wrapping past the last slide back to the first. */
  const next = useCallback((): number | null => step(1), [step]);

  /** Step back, wrapping before the first slide round to the last. */
  const prev = useCallback((): number | null => step(-1), [step]);

  /** Scroll so that slide `target` sits at the start edge. */
  const goTo = useCallback(
    (target: number): boolean => {
      if (target < 0 || target >= count) return false;

      /* Already parked there, so a smooth scroll would only burn a cycle
         telling the visitor the click did nothing. */
      if (target === measureAbsolute()) return false;

      return moveTo(target) !== null;
    },
    [count, measureAbsolute, moveTo],
  );

  /* ---------------------------------------------------------------------
   * The loop
   * ------------------------------------------------------------------ */

  useEffect(() => {
    if (stoppedRef.current || count <= 1) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia(maxWidth);

    const tick = () => {
      timerRef.current = null;

      /* Any of these pauses the loop without ending it. */
      if (stoppedRef.current) return;
      if (reduceMotion.matches) return;
      if (!mobile.matches) return;
      if (document.hidden) return;

      /* An open overlay (mobile menu, quote modal) marks everything outside
         the panel inert. Moving a strip the visitor cannot see or reach is
         wasted work and it desynchronises the indicators, so sit it out. */
      if (ref.current?.closest("[inert]")) return;

      if (next() === null) return;

      timerRef.current = setTimeout(tick, interval);
    };

    const schedule = () => {
      clearTimer();
      if (!stoppedRef.current) timerRef.current = setTimeout(tick, interval);
    };

    /* Deliberately no IntersectionObserver here. The band sits far below the
       fold on a phone, so pausing while it is off screen meant it had not moved
       a step by the time anyone could see it. It cycles from page load instead. */

    /* Hidden tab, or a resize across the breakpoint: recompute. */
    const onVisibility = () => {
      if (document.hidden) clearTimer();
      else schedule();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onMedia = () => schedule();
    reduceMotion.addEventListener("change", onMedia);
    mobile.addEventListener("change", onMedia);

    schedule();

    return () => {
      clearTimer();
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMotion.removeEventListener("change", onMedia);
      mobile.removeEventListener("change", onMedia);
    };
  }, [count, interval, maxWidth, next, clearTimer]);

  /* ---------------------------------------------------------------------
   * Keep the indicators honest after a manual swipe
   * ------------------------------------------------------------------ */

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const onScroll = () => {
      if (selfScrollRef.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setIndex(measureAbsolute()));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, [measureAbsolute]);

  return { ref, index, stopped, stop, goTo, next, prev };
}
