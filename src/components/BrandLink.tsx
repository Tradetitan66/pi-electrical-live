"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { BUSINESS } from "@/data/business";

/**
 * The brand lockup, linked to the home page.
 *
 * Used by both the header and the footer so there is exactly one definition of
 * "clicking the logo goes home". Two behaviours worth naming:
 *
 * 1. From another page it navigates to "/" and Next scrolls to the top. That
 *    is instant, because `scroll-behavior` on the scrolling element is `auto`.
 *    It was previously `smooth`, which animated the reset: measured at 2433ms
 *    from the bottom of /services, so the visitor watched the old page swoop
 *    while the new one had already rendered.
 *
 * 2. On the home page already, a link to "/" is a no-op - Next does not
 *    re-navigate and the scroll position is left where it was. But people
 *    click a site logo expecting to return to the top, so that case now
 *    scrolls to top explicitly. It is cheap, and it is what every mature site
 *    does.
 *
 * The children are passed in from a server component, so the Wordmark markup
 * itself is still server-rendered; only this small wrapper is client JS.
 */
export default function BrandLink({
  children,
  className,
  onNavigate,
}: {
  children: ReactNode;
  className?: string;
  /** Extra handler, e.g. the header closing the mobile menu. Runs first. */
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const handleClick = useCallback(() => {
    onNavigate?.();
    if (!isHome) return;
    // Instant, and it also restores focus sanity if the visitor was deep in
    // the page with the keyboard.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [isHome, onNavigate]);

  return (
    <Link
      href="/"
      onClick={handleClick}
      aria-label={`${BUSINESS.name} home`}
      className={cx("inline-block", className)}
    >
      {children}
    </Link>
  );
}
