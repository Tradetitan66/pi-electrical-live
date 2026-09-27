"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/cx";
import { AREAS_ANCHOR, QUOTE_ANCHOR, anchorHref } from "@/lib/anchors";
import { BUSINESS } from "@/data/business";
import { AREA_LIST } from "@/data/areas";
import { directWhatsAppUrl } from "@/lib/whatsapp";
import { useAutoAdvance } from "@/lib/auto-advance";

/**
 * Quick-action band directly under the hero.
 *
 * The five things a visitor on a phone actually wants: call, WhatsApp, a
 * quote, emergency help, and "do you cover me".
 *
 * Horizontally scrollable on narrow screens rather than squeezed into five
 * unreadable columns. `role="list"` keeps the grouping announced properly
 * even though the layout is a scroller.
 *
 * On phones only about one and a half tiles fit, so the strip advances itself
 * one tile at a time to advertise the ones nobody would swipe to. The moment
 * the visitor touches, focuses or scrolls the strip it stops for good and never
 * moves again on its own - see lib/auto-advance.ts, including the deliberate
 * WCAG 2.2.2 deviation documented there.
 *
 * Two tiles link to in-page sections rather than to a fixed URL. Their href is
 * resolved per route from lib/anchors.ts, because a bare "#quote" is inert on
 * any page that does not render that section.
 */

type Tile = {
  id: string;
  label: string;
  detail: string;
  /** Set for tiles that link to an in-page section; resolved against the route. */
  anchor?: string;
  href: string;
  event: "phone_clicked" | "whatsapp_quote_clicked" | "quote_cta_clicked" | null;
  action: string;
};

const TILES: Tile[] = [
  {
    id: "call",
    label: "Call Paul",
    detail: BUSINESS.phone.display,
    href: BUSINESS.phone.href,
    event: "phone_clicked",
    action: "quick_actions_call",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    detail: "Send photos & details",
    href: directWhatsAppUrl("quote"),
    event: "whatsapp_quote_clicked",
    action: "quick_actions_whatsapp",
  },
  {
    id: "quote",
    label: "Free quote",
    detail: "No obligation",
    anchor: QUOTE_ANCHOR,
    /* Placeholder. Replaced with the route-correct href on every render. */
    href: `#${QUOTE_ANCHOR}`,
    event: "quote_cta_clicked",
    action: "quick_actions_quote",
  },
  {
    id: "emergency",
    label: "Emergency",
    detail: "Day & night",
    href: BUSINESS.phone.href,
    event: "phone_clicked",
    action: "quick_actions_emergency",
  },
  {
    id: "areas",
    label: "Areas",
    detail: `${AREA_LIST[0]} + more`,
    anchor: AREAS_ANCHOR,
    /* Placeholder. Replaced with the route-correct href on every render. */
    href: `#${AREAS_ANCHOR}`,
    event: null,
    action: "quick_actions_areas",
  },
];

export default function QuickActions() {
  const pathname = usePathname();
  const tiles = TILES.map((tile) =>
    tile.anchor ? { ...tile, href: anchorHref(tile.anchor, pathname) } : tile,
  );

  /* Mobile-only self-advance. `index` drives the position dots. */
  const { ref, index, stop } = useAutoAdvance<HTMLUListElement>({
    count: tiles.length,
  });

  return (
    <section aria-label="Quick actions" className="border-b border-line bg-white">
      <div className="shell">
        <ul
          ref={ref}
          role="list"
          /* Any of these means the visitor is driving, so the loop stops for
             good. The wheel and key handlers cover a trackpad or an arrow key
             without a pointer ever touching the strip. */
          onPointerDown={stop}
          onTouchStart={stop}
          onFocus={stop}
          onWheel={stop}
          onKeyDown={stop}
          className="-mx-5 flex snap-x snap-mandatory gap-px overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5"
        >
          {tiles.map((tile) => {
            const external = /^tel:|^https:/.test(tile.href);

            return (
              <li
                key={tile.id}
                className="w-[72%] shrink-0 snap-start border-line sm:w-auto sm:border-r sm:last:border-r-0"
              >
                {external ? (
                  <a
                    href={tile.href}
                    {...(tile.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    onClick={() =>
                      tile.event &&
                      track(tile.event, {
                        location: "home",
                        action: tile.action,
                      })
                    }
                    className="group flex min-h-20 flex-col justify-center gap-1 px-4 py-4 transition-colors hover:bg-surface focus-visible:bg-surface"
                  >
                    <TileContent label={tile.label} detail={tile.detail} />
                  </a>
                ) : (
                  <Link
                    href={tile.href}
                    onClick={() =>
                      tile.event &&
                      track(tile.event, {
                        location: "home",
                        action: tile.action,
                      })
                    }
                    className="group flex min-h-20 flex-col justify-center gap-1 px-4 py-4 transition-colors hover:bg-surface focus-visible:bg-surface"
                  >
                    <TileContent label={tile.label} detail={tile.detail} />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/*
          Position indicators, phone widths only - from sm up the list is a
          static grid with everything already visible, so a position indicator
          would be meaningless.

          Decorative: the tiles are already announced as a list, so repeating
          them here would only add noise. Deliberately not interactive, since
          there is no control to offer.
        */}
        <div
          aria-hidden="true"
          data-quick-actions-dots
          className="flex items-center justify-center gap-1.5 pb-3 sm:hidden"
        >
          {tiles.map((tile, dot) => (
            <span
              key={tile.id}
              data-quick-actions-dot
              data-active={dot === index ? "true" : undefined}
              className={cx(
                "h-1.5 rounded-full transition-all duration-300",
                dot === index ? "w-5 bg-green" : "w-1.5 bg-green-ink/25",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TileContent({ label, detail }: { label: string; detail: string }) {
  return (
    <>
      <span className="flex items-center gap-2 font-display text-base font-extrabold uppercase tracking-[-0.01em] text-ink">
        <span
          aria-hidden="true"
          className={cx(
            "h-1.5 w-1.5 rounded-full",
            label === "Emergency" ? "bg-green" : "bg-green-ink/35",
          )}
        />
        {label}
        <span
          aria-hidden="true"
          className="ml-auto text-muted transition-transform duration-200 group-hover:translate-x-0.5"
        >
          →
        </span>
      </span>
      <span className="text-sm text-muted">{detail}</span>
    </>
  );
}