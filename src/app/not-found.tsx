import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/Button";
import { NAV_LINKS } from "@/data/navigation";
import { BUSINESS } from "@/data/business";

/**
 * 404.
 *
 * Next.js renders this inside the root layout, so it inherits the header,
 * footer and mobile action bar. It is deliberately useful rather than cute: a
 * broken link on a trades site usually means someone is trying to reach a
 * service, so the page offers the service list and a way to describe the job.
 *
 * The status code is set by Next automatically - do not try to set it here.
 */

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page does not exist. Browse our electrical services, or call Paul to describe the job.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section
      /* Next renders this inside the root layout, so the mobile action bar is
         present. Marks the first section so that bar stays hidden until the
         visitor scrolls past it. */
      data-first-section
      className="bg-warm"
    >
      <div className="shell flex min-h-[70dvh] flex-col justify-center py-20 sm:py-28">
        <p className="eyebrow text-foreground">Error 404</p>

        <h1 className="mt-6 text-display-lg max-w-[16ch] text-ink">
          That page is not on the board
        </h1>

        <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted">
          The link may be old, or mistyped. Everything {BUSINESS.name} does is
          listed below, or just describe the job and we will tell you whether it
          is ours.
        </p>

        <nav aria-label="Site sections" className="mt-10">
          <ul role="list" className="flex flex-wrap gap-x-8 gap-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-display text-xl font-extrabold uppercase tracking-[-0.02em] text-ink underline decoration-[#2a2a2a] decoration-2 underline-offset-8 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Button href={BUSINESS.phone.href} analyticsEvent="phone_clicked" analyticsLocation="not_found">
            Call {BUSINESS.phone.display}
          </Button>
          <Button
            /* Absolute, not "#quote": the 404 page renders no quote form, so
               a bare fragment would resolve against /404 and do nothing. */
            href="/#quote"
            variant="outline"
            analyticsEvent="quote_cta_clicked"
            analyticsLocation="not_found"
          >
            Describe the job
          </Button>
        </div>
      </div>
    </section>
  );
}
