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

/** Above this the QuickActions list is a multi-column grid, not a scroller. */
const MOBILE_MAX = "(max-width: 639.98px)";

/** Debounce after a touch, so a tap that never scrolls still stops the loop. */
const SETTLE_MS = 500;

export interface AutoAdvance<T extends HTMLElement> {
  /** Attach to the scrolling element. */
  ref: React.RefObject<T | null>;
  /** Index of the item nearest the left edge, for the position indicators. */
  index: number;
  /** True once the visitor has interacted. Exposed for tests and future UI. */
  stopped: boolean;
  /** Stop the loop permanently. Wired to the strip's interaction handlers. */
  stop: () => void;
}

export function useAutoAdvance<T extends HTMLElement>({
  interval = 4000,
  count,
}: {
  /** Delay between steps, in ms. */
  interval?: number;
  /** Number of items. The loop wraps at this many. */
  count: number;
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

  /** Index of the tile whose start edge is nearest the scroller's start edge. */
  const measureIndex = useCallback((): number => {
    const el = ref.current;
    if (!el) return 0;

    const first = el.firstElementChild as HTMLElement | null;
    if (!first) return 0;

    const step = first.offsetWidth;
    if (step <= 0) return 0;

    const raw = Math.round(el.scrollLeft / step);
    return Math.max(0, Math.min(count - 1, raw));
  }, [count]);

  /** Signed distance to bring `child`'s start edge to the scroller's start edge. */
  const offsetOf = useCallback((child: HTMLElement): number => {
    const el = ref.current;
    if (!el) return 0;
    return child.getBoundingClientRect().left - el.getBoundingClientRect().left;
  }, []);

  /** Advance one step and return the new index, or null if it should not move. */
  const step_ = useCallback((): number | null => {
    const el = ref.current;
    if (!el || count <= 1) return null;

    /* Nothing to scroll into: at desktop widths this is a grid with
       overflow visible, so scrollWidth equals clientWidth. */
    if (el.scrollWidth <= el.clientWidth) return null;

    const next = (measureIndex() + 1) % count;
    const child = el.children[next] as HTMLElement | null;
    if (!child) return null;

    selfScrollRef.current = true;
    el.scrollTo({ left: el.scrollLeft + offsetOf(child), behavior: "smooth" });
    /* The smooth scroll emits scroll events for roughly this long. Clearing
       the flag afterwards stops the next tick racing it. */
    window.setTimeout(() => {
      selfScrollRef.current = false;
    }, SETTLE_MS);

    setIndex(next);
    return next;
  }, [count, measureIndex, offsetOf]);

  /* ---------------------------------------------------------------------
   * The loop
   * ------------------------------------------------------------------ */

  useEffect(() => {
    if (stoppedRef.current || count <= 1) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia(MOBILE_MAX);

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

      if (step_() === null) return;

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
  }, [count, interval, step_, clearTimer]);

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
      frame = requestAnimationFrame(() => setIndex(measureIndex()));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, [measureIndex]);

  return { ref, index, stopped, stop };
}
