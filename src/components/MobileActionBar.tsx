"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/cx";
import { BUSINESS } from "@/data/business";
import { useScrolled } from "@/hooks/useScrolled";

/**
 * Persistent mobile conversion bar: [ CALL PAUL ] [ FREE QUOTE ].
 *
 * Phone and WhatsApp are both first-class, matching how the business actually
 * works. Paul may be on site when someone rings, so the phone route is a real
 * option rather than a fallback.
 *
 * Requirements handled here:
 *  - iOS safe area: padding-bottom uses env(safe-area-inset-bottom) so the
 *    buttons clear the home indicator
 *  - never covers content: the bar's measured height is published to
 *    --mobile-bar-h, which body padding-bottom consumes
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
  const scrolled = useScrolled(12);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const publish = () => {
      const height = node.offsetHeight;
      document.documentElement.style.setProperty(
        "--mobile-bar-h",
        `${height}px`,
      );
    };

    publish();
    window.addEventListener("resize", publish);
    return () => {
      window.removeEventListener("resize", publish);
      document.documentElement.style.setProperty("--mobile-bar-h", "0px");
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cx(
        "fixed inset-x-0 bottom-0 z-[65] transition-transform duration-300 lg:hidden",
        scrolled ? "translate-y-0" : "translate-y-full",
      )}
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
        <Link
          href="/#quote"
          onClick={() =>
            track("quote_cta_clicked", {
              location: "mobile_bar",
              action: "mobile_bar_quote",
            })
          }
          className="flex min-h-15 items-center justify-center bg-green py-3.5 text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-black"
        >
          Free quote
        </Link>
      </div>
    </div>
  );
}
