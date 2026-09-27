"use client";

import { useId, useState } from "react";
import Link from "next/link";
import Button from "./Button";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/cx";
import { HOME_SERVICE_ROWS } from "@/data/services";

/**
 * The eight numbered service rows.
 *
 * Built as a real disclosure list rather than a set of always-open cards:
 * eight expanded cards on a phone is a wall of text, and the range is easier to
 * read as a numbered index.
 *
 * Accessibility:
 *  - each row's summary is a <button> with aria-expanded + aria-controls
 *  - the panel is a labelled region, so a screen reader can jump to it
 *  - the first row is open by default, so the component never looks broken
 *  - the whole row is clickable, but the tap target is the button, not a
 *    wrapping <div> with a click handler
 *  - "+" / "×" glyphs are aria-hidden; the state is conveyed by aria-expanded
 *
 * One row at a time. Opening a row closes whichever was open, so the list reads
 * as a single index rather than a growing wall of text, and the eye is only ever
 * asked to track one moving boundary. Re-clicking the open row still closes it,
 * so it is possible to collapse everything and see the full list of eight.
 *
 * Note this is a set of independent disclosure buttons that happen to be
 * mutually exclusive, not the ARIA `accordion` pattern. That pattern would
 * require roving tabindex and arrow-key navigation between headers, which these
 * rows neither implement nor need: each row is its own control, reached by Tab.
 */
export default function ServiceAccordion() {
  const uid = useId();
  const [open, setOpen] = useState<string | null>(HOME_SERVICE_ROWS[0].id);

  const toggle = (id: string) => {
    // `open` is this render's value, which is the state at click time, so this
    // is a reliable "was it open before I clicked?" test.
    const wasOpen = open === id;
    setOpen(wasOpen ? null : id);
    // Only an open is a view. Closing used to fire this too, which logged a
    // service_viewed for a row the visitor was actively hiding.
    if (!wasOpen) {
      track("service_viewed", {
        location: "home",
        action: "home_service_row",
        service: id,
      });
    }
  };

  return (
    <div>
      <ul role="list" className="border-t border-line">
        {HOME_SERVICE_ROWS.map((row) => {
          const expanded = open === row.id;
          const panelId = `${uid}-panel-${row.id}`;
          const buttonId = `${uid}-button-${row.id}`;

          return (
            <li key={row.id} className="border-b border-line">
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => toggle(row.id)}
                  className="group flex w-full items-center gap-4 py-6 text-left transition-colors hover:bg-surface/60 sm:gap-7 sm:py-7"
                >
                  <span
                    aria-hidden="true"
                    className="w-8 shrink-0 font-mono text-xs font-semibold text-green-ink/70 sm:w-10 sm:text-sm"
                  >
                    {row.index}
                  </span>

                  <span className="flex-1 font-display text-xl font-extrabold tracking-[-0.02em] text-ink sm:text-2xl lg:text-3xl">
                    {row.title}
                  </span>

                  <span
                    aria-hidden="true"
                    className={cx(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-lg leading-none transition-all duration-300",
                      expanded
                        ? "rotate-45 border-green-ink bg-green text-black"
                        : "border-line text-ink group-hover:border-green-ink",
                    )}
                  >
                    +
                  </span>
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!expanded}
                className="pb-7 pl-12 pr-4 sm:pl-16 lg:pl-20"
              >
                <p className="max-w-[62ch] text-base leading-relaxed text-muted sm:text-lg">
                  {row.text}
                </p>
                <Link
                  href="/services"
                  onClick={() =>
                    track("service_viewed", {
                      location: "home",
                      action: "home_service_row_link",
                      service: row.id,
                    })
                  }
                  className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-green-ink hover:underline hover:underline-offset-4"
                >
                  All services
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button
          href="/services"
          size="lg"
          arrow
          analyticsEvent="quote_cta_clicked"
          analyticsLocation="home"
          analyticsAction="services_full_list"
        >
          See the full service list
        </Button>
        <Button href="#quote" size="lg" variant="outline">
          Or get a free quote
        </Button>
      </div>
    </div>
  );
}
