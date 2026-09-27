"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";
import { useQuoteJump } from "@/lib/use-quote-jump";
import { useScrollPastFirstSection } from "@/lib/scroll-past";
import { BUSINESS } from "@/data/business";


/**
 * Mobile conversion bar: [ CALL PAUL ] [ FREE QUOTE ].
 *
 * Phone and WhatsApp are both first-class, matching how the business actually
 * works. Paul may be on site when someone rings, so the phone route is a real
 * option rather than a fallback.
 *
 * Requirements handled here:
 *  - iOS safe area: padding-bottom uses env(safe-area-inset-bottom) so the
 *    buttons clear the home indicator
 *  - no duplicated CTAs: the bar is hidden while the first section of the page
 *    is on screen, because the hero and page banner already carry Call and
 *    Free quote. It slides in once that section has been scrolled past, and
 *    hides again if the visitor scrolls back up to it. See lib/scroll-past.ts
 *  - never covers content: the bar's measured height is published to
 *    --mobile-bar-h, which body padding-bottom consumes. While the bar is
 *    hidden its measured height is 0, so the page does not reserve a gap for it
 *  - keyboard and screen-reader safe: the bar is hidden with `hidden`, not
 *    `aria-hidden` on a container of focusable controls, so the focus tree and
 *    the accessibility tree can never disagree
 *  - menu conflict: when the mobile menu opens it sets `inert` on every other
 *    body child, which includes this bar, so it leaves the focus order and is
 *    covered by the opaque menu panel
 *
 * The voicemail hint is deliberately not here - it would double the bar height
 * and eat the viewport. It appears in the mobile menu, the footer and the
 * quote panel.
 */
export default function MobileActionBar() {
  const ref = useRef<HTMLDivElement | null>(null);

  /* Keeps the bar out of the way while the hero or page banner is on screen,
     since those already carry the same two CTAs. */
  const past = useScrollPastFirstSection();

  /* Route-aware and scroll-lock aware: this bar is global, so it is rendered
     on routes that have no #quote target at all. See lib/anchors.ts. */
  const quote = useQuoteJump(() =>
    track("quote_cta_clicked", {
      location: "mobile_bar",
      action: "mobile_bar_quote",
    }),
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const publish = () => {
      /* While the bar is `hidden` its offsetHeight is already 0, so this
         publishes 0px without a special case. body padding-bottom consumes
         this, so the page reserves no gap for a bar that is not showing. */
      const height = node.offsetHeight;
      document.documentElement.style.setProperty(
        "--mobile-bar-h",
        `${height}px`,
      );
    };

    /* Re-runs when the bar is revealed, so the padding appears at the same
       time the bar does rather than one paint later. */
    publish();
    window.addEventListener("resize", publish);
    return () => {
      window.removeEventListener("resize", publish);
      document.documentElement.style.setProperty("--mobile-bar-h", "0px");
    };
  }, [past]);

  return (
    <div
      ref={ref}
      /* Stable hook for the scroll-gate tests, since the className above is
         replaced wholesale when the bar toggles. */
      data-mobile-action-bar
      /* `hidden` rather than `aria-hidden`: it removes both the buttons from
         the focus order and the bar from the accessibility tree, and drops the
         measured height to 0 for --mobile-bar-h. */
      className={
        past
          ? "fixed inset-x-0 bottom-0 z-[65] motion-safe:animate-[pi-rise_0.24s_ease-out] lg:hidden"
          : "hidden"
      }
      // Safe area is applied to the inner bar so the surface still reaches the
      // physical bottom edge on notched devices.
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-2 border-t border-line bg-warm/97 backdrop-blur-md">
        <a
          href={BUSINESS.phone.href}
          onClick={() =>
            track("phone_clicked", { location: "mobile_bar", action: "mobile_bar_call" })
          }
          className="flex min-h-15 items-center justify-center border-r border-line py-3.5 text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-ink"
        >
          Call {BUSINESS.owner}
        </a>
        <a
          href={quote.href}
          onClick={quote.onClick}
          className="flex min-h-15 items-center justify-center bg-green py-3.5 text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-black"
        >
          Free quote
        </a>
      </div>
    </div>
  );
}
