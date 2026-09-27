"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/cx";
import { BUSINESS } from "@/data/business";
import { AREA_LIST } from "@/data/areas";
import { directWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Quick-action band directly under the hero.
 *
 * The five things a visitor on a phone actually wants: call, WhatsApp, a
 * quote, emergency help, and "do you cover me".
 *
 * Horizontally scrollable on narrow screens rather than squeezed into five
 * unreadable columns. `role="list"` keeps the grouping announced properly
 * even though the layout is a scroller.
 */

const TILES = [
  {
    id: "call",
    label: "Call Paul",
    detail: BUSINESS.phone.display,
    href: BUSINESS.phone.href,
    event: "phone_clicked" as const,
    action: "quick_actions_call",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    detail: "Send photos & details",
    href: directWhatsAppUrl("quote"),
    event: "whatsapp_quote_clicked" as const,
    action: "quick_actions_whatsapp",
  },
  {
    id: "quote",
    label: "Free quote",
    detail: "No obligation",
    href: "#quote",
    event: "quote_cta_clicked" as const,
    action: "quick_actions_quote",
  },
  {
    id: "emergency",
    label: "Emergency",
    detail: "Day & night",
    href: BUSINESS.phone.href,
    event: "phone_clicked" as const,
    action: "quick_actions_emergency",
  },
  {
    id: "areas",
    label: "Areas",
    detail: `${AREA_LIST[0]} + more`,
    href: "#areas",
    event: null,
    action: "quick_actions_areas",
  },
];

export default function QuickActions() {
  return (
    <section aria-label="Quick actions" className="border-b border-line bg-white">
      <div className="shell">
        <ul
          role="list"
          className="-mx-5 flex snap-x snap-mandatory gap-px overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5"
        >
          {TILES.map((tile) => {
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