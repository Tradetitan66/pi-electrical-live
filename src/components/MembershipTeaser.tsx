"use client";

import Button from "./Button";
import { MEMBERSHIP } from "@/data/membership";

/**
 * Membership teaser.
 *
 * Two facts carry equal visual weight, deliberately:
 *   £15/month   AND   materials are charged separately
 *
 * A bare "£15/month" reads as all-inclusive and is the fastest way to turn a
 * new member into a complaint, so the price is never shown without the
 * material exclusion beside it. The 14-day waiting period is stated here too,
 * not hidden on the membership page.
 */
export default function MembershipTeaser() {
  return (
    <section
      aria-labelledby="membership-teaser-heading"
      className="border-y border-line bg-surface"
    >
      <div className="shell py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-2.5 text-green-ink">
              <span aria-hidden="true" className="h-px w-6 bg-green-ink/40" />
              Optional
            </p>

            <h2
              id="membership-teaser-heading"
              className="mt-6 text-display-md max-w-[20ch] text-ink"
            >
              Electrical Maintenance Membership
            </h2>

            <p className="mt-5 max-w-[54ch] text-lg leading-relaxed text-muted">
              {MEMBERSHIP.summary}
            </p>

            <ul className="mt-7 flex flex-col gap-2.5">
              {MEMBERSHIP.valueProposition.slice(0, 3).map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[0.9375rem] text-ink"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-ink"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Price card. Price and exclusion on the same card, same weight. */}
          <div className="lg:col-span-5">
            <div className="rounded-[2px] border border-line bg-warm p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-5xl font-extrabold tracking-[-0.035em] text-ink">
                  {MEMBERSHIP.priceDisplay}
                </span>
                <span className="text-base font-semibold text-muted">
                  / {MEMBERSHIP.cadence}
                </span>
              </div>

              <p className="mt-2 text-sm font-semibold text-ink">
                {MEMBERSHIP.paymentMethod}
              </p>

              <div className="mt-5 border-t border-line pt-5">
                <p className="text-sm font-bold uppercase tracking-[0.08em] text-ink">
                  {MEMBERSHIP.materialsNotice}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  Cover is for labour only. A{" "}
                  {MEMBERSHIP.waitingPeriod.days}-day waiting period applies
                  after you join.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-2.5">
                <Button
                  href="/maintenance-membership"
                  size="lg"
                  arrow
                  className="w-full"
                  analyticsEvent="membership_viewed"
                  analyticsLocation="membership"
                  analyticsAction="membership_teaser_details"
                >
                  What&apos;s included
                </Button>
                <Button
                  href="/maintenance-membership#join"
                  size="md"
                  variant="outline"
                  className="w-full"
                  analyticsEvent="membership_signup_clicked"
                  analyticsLocation="membership"
                  analyticsAction="membership_teaser_join"
                >
                  {MEMBERSHIP.ctaLabel}
                </Button>
              </div>

              <p className="mt-4 text-center text-xs leading-relaxed text-muted">
                {MEMBERSHIP.waitingPeriodNotice}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
