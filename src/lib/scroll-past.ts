"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * ============================================================================
 * FIRST-SECTION SCROLL GATE
 * ----------------------------------------------------------------------------
 * Tracks whether the visitor has scrolled past the first section of the page.
 *
 * The mobile action bar carries Call and Free quote, which duplicates the CTAs
 * already in the hero or page banner. Showing both at once is clutter, and on a
 * phone it costs vertical space the hero is already short of. So the bar stays
 * hidden until the first section has left the screen, and hides again if the
 * visitor scrolls back up to it.
 *
 * An element opts in with `data-first-section`. Hero, PageBanner and the 404
 * page all carry it.
 *
 * IntersectionObserver rather than a scroll listener: it fires only when the
 * answer actually changes, so this costs nothing while the page is at rest.
 *
 * Framework-free in the same way as lib/overlay.ts - it touches the DOM and
 * knows nothing about the components it is gating.
 * ============================================================================
 */

const SELECTOR = "[data-first-section]";

/**
 * `true` once the first section has scrolled fully above the viewport.
 *
 * rootMargin is left at its default (viewport edges), so the transition happens
 * when the section is completely gone rather than the moment it starts leaving.
 */
export function useScrollPastFirstSection(): boolean {
  const pathname = usePathname();

  /* `path` is stored alongside the flag so a client-side navigation invalidates
     the previous answer without a setState in the effect body. A new route is
     at the top of the document, so its first section is on screen and the bar
     must be hidden - but the observer callback for the new element has not run
     yet, and would otherwise leave a frame of stale `true` on screen. */
  const [seen, setSeen] = useState({ path: pathname, past: false });
  const past = seen.path === pathname ? seen.past : false;

  useEffect(() => {
    /* Every route marks its first section. The `main` fallback means a page
       that forgot the attribute still gets a working bar, just one that waits
       for the whole page rather than the hero. */
    const target =
      document.querySelector(SELECTOR) ?? document.querySelector("main");

    /* Unreachable: app/layout.tsx always renders <main>. Guarded only to
       satisfy the null check. Leaving `past` false is the safe direction,
       since it keeps the bar out of the way until something scrolls it in. */
    if (!target) return;

    /* The observer callback is the only place state is written. It is async by
       nature, so the first notification for the new element both corrects the
       answer for this route and re-syncs `path`. */
    const observer = new IntersectionObserver(
      ([entry]) => {
        /* isIntersecting stays true while any part of the section is on
           screen. Once it is false the section is above the viewport, because
           the section is the first thing on the page and cannot be below it
           without the observer having already reported it as intersecting. */
        setSeen({ path: pathname, past: !entry.isIntersecting });
      },
      { threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [pathname]);

  return past;
}
