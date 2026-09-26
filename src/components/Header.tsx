"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Wordmark from "./Wordmark";
import BrandLink from "./BrandLink";
import MobileMenu from "./MobileMenu";
import Button from "./Button";
import { useScrolled } from "@/hooks/useScrolled";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/cx";
import { BUSINESS } from "@/data/business";
import { NAV_LINKS } from "@/data/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled(12);
  const pathname = usePathname();
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  /**
   * Close the menu when the route changes - during render, not in an effect.
   *
   * This was originally a `useEffect` on `pathname` inside <MobileMenu>, which
   * was wrong twice over: the panel only mounts *after* the trigger opened it,
   * so the effect fired immediately and closed the menu the instant it opened;
   * and StrictMode's deliberate double-invocation of effects on mount defeated
   * a `isFirstRun` ref guard anyway.
   *
   * Tracking the previous pathname and adjusting state during render is React's
   * documented pattern for reacting to a changed input, and it is immune to
   * both problems.
   */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-[60] transition-colors duration-300",
          scrolled
            ? "border-b border-line bg-warm/95 backdrop-blur-md supports-[backdrop-filter]:bg-warm/80"
            : "border-b border-transparent bg-warm",
        )}
      >
        <div className="shell">
          <div className="flex h-header items-center justify-between gap-4">
            <BrandLink
              onNavigate={closeMenu}
              className="-ml-1 shrink-0 rounded-lg py-2 pr-2"
            >
              <Wordmark size="md" />
            </BrandLink>

            {/* Desktop navigation */}
            <nav
              aria-label="Main"
              className="hidden items-center gap-8 lg:flex"
            >
              {NAV_LINKS.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "relative py-2 text-sm font-medium transition-colors",
                      active
                        ? "text-green-ink"
                        : "text-ink hover:text-green-ink",
                    )}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={cx(
                        "absolute -bottom-0.5 left-0 h-px bg-green-ink transition-all duration-300",
                        active ? "w-full" : "w-0",
                      )}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href={BUSINESS.phone.href}
                onClick={() =>
                  track("phone_clicked", { location: "header", action: "header_phone" })
                }
                className="hidden items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-green-ink lg:inline-flex"
              >
                <span aria-hidden="true" className="text-green-ink">
                  ●
                </span>
                {BUSINESS.phone.display}
              </a>

              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="-mr-2 flex h-11 w-11 items-center justify-center rounded-lg text-ink lg:hidden"
              >
                <span aria-hidden="true" className="relative block h-4 w-6">
                  <span
                    className={cx(
                      "absolute left-0 block h-px w-6 bg-current transition-all duration-300",
                      menuOpen ? "top-1.5 rotate-45" : "top-0",
                    )}
                  />
                  <span
                    className={cx(
                      "absolute left-0 top-1.5 block h-px w-6 bg-current transition-all duration-200",
                      menuOpen ? "opacity-0" : "opacity-100",
                    )}
                  />
                  <span
                    className={cx(
                      "absolute left-0 block h-px w-6 bg-current transition-all duration-300",
                      menuOpen ? "top-1.5 -rotate-45" : "top-3",
                    )}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {menuOpen ? <MobileMenu open onClose={closeMenu} /> : null}
    </>
  );
}
