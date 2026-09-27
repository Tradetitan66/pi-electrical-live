"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";
import { track } from "@/lib/analytics";
import { useQuoteJump } from "@/lib/use-quote-jump";
import {
  bindOverlayKeys,
  captureFocus,
  focusFirstInPanel,
  inertBackground,
  lockPageScroll,
} from "@/lib/overlay";
import { BUSINESS } from "@/data/business";
import { NAV_LINKS } from "@/data/navigation";

/**
 * Full-screen mobile navigation.
 *
 * Accessibility handled here:
 *  - opaque panel, so page content cannot visually compete with it
 *  - body scroll lock, iOS safe (position: fixed)
 *  - Escape closes
 *  - focus moves into the panel on open and returns to the trigger on close
 *  - focus is trapped while open
 *  - background is inert, keeping the accessibility tree and focus tree in sync
 *
 * Closing on route change is NOT handled here - <Header> owns that, because the
 * panel is only mounted once the menu is already open and an effect on
 * `pathname` would fire on mount rather than on navigation.
 */
export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  /* Read-only, for `aria-current` highlighting. It deliberately does NOT
     trigger closing - <Header> owns that. */
  const pathname = usePathname();

  /* Closing the panel releases the scroll-lock, and a native jump attempted
     before that release is dropped by the browser. This handler closes first
     and jumps once the page can move again. See lib/scroll-to-anchor.ts. */
  const quote = useQuoteJump(onClose);

  useEffect(() => {
    if (!open) return;

    const restoreFocus = captureFocus();
    const unlockScroll = lockPageScroll();
    const uninert = inertBackground(panelRef.current);
    const unbindKeys = bindOverlayKeys(panelRef.current, onClose);

    /* Defer, so focus lands after the panel has been painted. */
    const focusTimer = window.setTimeout(() => {
      focusFirstInPanel(panelRef.current);
    }, 20);

    return () => {
      window.clearTimeout(focusTimer);
      unbindKeys();
      uninert();
      unlockScroll();
      /* After uninert(): the trigger sits behind the panel and is inert until
         the attribute is gone. */
      restoreFocus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      id="mobile-menu"
      className="on-dark fixed inset-0 z-[70] flex flex-col bg-black motion-safe:animate-[pi-fade_0.18s_ease-out] lg:hidden"
    >
      <nav
        aria-label="Mobile"
        className="flex flex-1 flex-col justify-center gap-1 overflow-y-auto px-5 pt-20 pb-8"
      >
        {NAV_LINKS.map((link, i) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={cx(
                "flex min-h-16 items-center justify-between border-b border-white/10 py-4 font-display text-3xl font-extrabold uppercase tracking-[-0.03em]",
                active ? "text-green" : "text-white",
              )}
              style={{ animation: "pi-rise 0.4s both", animationDelay: `${i * 55}ms` }}
            >
              {link.label}
              <span
                aria-hidden="true"
                className={cx("text-2xl", active ? "text-green" : "text-white/30")}
              >
                →
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="safe-b border-t border-white/10 px-5 py-5">
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="absolute top-3 right-3 rounded-lg bg-black/80 text-white h-8 w-8 flex items-center justify-center text-sm font-semibold"
        >
          ✕
        </button>
        <a
          href={BUSINESS.phone.href}
          onClick={() => {
            track("phone_clicked", { location: "mobile_bar", action: "mobile_menu" });
            onClose();
          }}
          className="mb-3 flex min-h-14 items-center justify-center rounded-lg border border-white/35 font-semibold text-white"
        >
          Call {BUSINESS.owner} - {BUSINESS.phone.display}
        </a>
        <a
          href={quote.href}
          onClick={quote.onClick}
          className="flex min-h-14 items-center justify-center rounded-lg bg-green font-semibold text-black"
        >
          Get a free quote
        </a>
        <p className="mt-3 text-center text-xs leading-relaxed text-muted-dark">
          Can&apos;t get through? Please leave a voicemail and Paul will get
          back to you.
        </p>
      </div>
    </div>
  );
}
