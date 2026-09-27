"use client";

import { useCallback, type MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { anchorIsLocal, anchorHref, QUOTE_ANCHOR } from "./anchors";
import { scrollToAnchor, whenScrollUnlocked } from "./scroll-to-anchor";

/**
 * Route-aware `href` for a link to `#id`.
 *
 * Use this in any client component that links to an in-page section. On a
 * route that renders the section it is a bare fragment and the jump stays
 * in-page; everywhere else it becomes an absolute path, which is the only
 * form that actually works from another page.
 */
export function useAnchorHref(id: string): string {
  return anchorHref(id, usePathname());
}

/**
 * Props that make a quote link work from every route and from inside an
 * overlay.
 *
 * `href` alone is not enough for the two global mobile surfaces. Both live in
 * the layout, so both can be clicked while a scroll-lock is still releasing,
 * and a native jump attempted in that window is dropped. This handler takes
 * over: it closes whatever overlay is open, waits for the page to be
 * scrollable again, then jumps in-page or navigates cross-page.
 *
 * Modified clicks (new tab, new window) and non-primary buttons are left to
 * the browser, so the link still behaves like a link.
 */
export function useQuoteJump(onNavigate?: () => void) {
  const pathname = usePathname();
  const router = useRouter();
  const href = anchorHref(QUOTE_ANCHOR, pathname);

  const onClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();

      /* Release the overlay first: the jump below is meaningless until the
         scroll-lock has lifted. */
      onNavigate?.();

      whenScrollUnlocked(() => {
        /* The target may be absent even on a route that nominally owns it
           (a 404, or a section that has not rendered yet), so verify before
           jumping and fall back to a full navigation. */
        if (!scrollToAnchor(QUOTE_ANCHOR)) {
          router.push(anchorHref(QUOTE_ANCHOR, pathname));
          return;
        }

        if (anchorIsLocal(QUOTE_ANCHOR, pathname)) {
          /* preventDefault stopped the native hash update, so reflect it in
             the URL without pushing a history entry the back button has to
             walk through. */
          window.history.replaceState(null, "", `#${QUOTE_ANCHOR}`);
        }
      });
    },
    [onNavigate, pathname, router],
  );

  return { href, onClick };
}
