import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import Button from "@/components/Button";
import { MEMBERSHIP, MEMBERSHIP_DISCLAIMER } from "@/data/membership";
import { MEMBERSHIP_AREAS } from "@/data/areas";
import { BUSINESS } from "@/data/business";

export const metadata: Metadata = {
  title: "Electrical Maintenance Membership",
  description:
    "PI Electrical Maintenance Membership: £15/month by Direct Debit for labour-only cover on eligible electrical faults and call-outs in Edinburgh, the Lothians, Fife and the Scottish Borders. Materials charged separately. 14-day waiting period.",
  alternates: { canonical: "/maintenance-membership" },
  openGraph: {
    title: "Electrical Maintenance Membership | PI Electrical",
    description:
      "£15/month Direct Debit for labour-only cover on eligible electrical faults and call-outs. Materials charged separately.",
    url: "/maintenance-membership",
  },
};

/**
 * Maintenance membership.
 *
 * A real, purchasable product, so the page has to be genuinely useful rather
 * than a teaser. The framing decisions that matter:
 *
 *  1. The price and the material exclusion are printed at the SAME weight,
 *     every time the price appears. A "£15/month" headline on its own reads as
 *     all-inclusive, and that gap between expectation and reality is the single
 *     most likely source of a complaint.
 *  2. The 14-day waiting period is stated at the top, not buried. A customer
 *     who discovers it after paying has been sold something they did not
 *     understand.
 *  3. Exclusions get their own section. Burying them is not "protecting the
 *     business", it is just losing the dispute later.
 *  4. The GoCardless link opens in a new tab and is never an automatic
 *     redirect, so the terms are always on screen before any payment step.
 *  5. This page is a summary. The binding agreement is provided at Direct
 *     Debit setup, and the page says so prominently.
 *
 * Wordings listed in MEMBERSHIP.prohibitedPhrasing ("unlimited call-outs",
 * "guaranteed emergency attendance", "UK-wide cover") are deliberately unused
 * anywhere on this page.
 */
export default function MembershipPage() {
  return (
    <>
      <PageBanner
        eyebrow="Optional"
        title="Electrical Maintenance Membership"
        intro={MEMBERSHIP.summary}
      >
        {/* Price block. Exclusion sits immediately beside the price. */}
        <div className="flex flex-col gap-5 rounded-[2px] border border-line bg-white p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-display text-5xl font-extrabold tracking-[-0.035em] text-ink">
                {MEMBERSHIP.priceDisplay}
              </span>
              <span className="text-base font-semibold text-muted">
                / {MEMBERSHIP.cadence}
              </span>
            </div>
            <p className="mt-1.5 text-sm font-semibold text-ink">
              Paid by {MEMBERSHIP.paymentMethod}
            </p>
          </div>

          <div className="border-t border-line pt-4 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-ink">
              {MEMBERSHIP.materialsNotice}
            </p>
            <p className="mt-1.5 max-w-[34ch] text-sm leading-relaxed text-muted">
              Cover is for labour only. You pay for any parts or materials used.
            </p>
          </div>
        </div>
      </PageBanner>

      {/* ------------------------------------------------------------------ */}
      {/* Summary, not the contract                                           */}
      {/* ------------------------------------------------------------------ */}
      <section aria-label="About this summary" className="border-b border-line bg-white">
        <div className="shell py-10">
          <p className="max-w-[80ch] rounded-[2px] border-l-4 border-line-strong bg-surface px-5 py-4 text-[0.9375rem] leading-relaxed text-ink">
            <span className="font-semibold">Please read this first:</span>{" "}
            {MEMBERSHIP_DISCLAIMER} This page sets out the headline terms in
            plain English so you know what you are agreeing to.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* What it is, at a glance                                             */}
      {/* ------------------------------------------------------------------ */}
      <section aria-labelledby="at-a-glance" className="bg-warm">
        <div className="shell py-16 sm:py-20">
          <h2 id="at-a-glance" className="text-display-sm text-ink">
            At a glance
          </h2>

          <ul role="list" className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-2">
            {MEMBERSHIP.valueProposition.map((item) => (
              <li key={item} className="flex items-start gap-3 bg-warm px-5 py-4">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2a2a2a] text-black"
                >
                  <span className="text-[0.6875rem] leading-none">✓</span>
                </span>
                <span className="text-[0.9375rem] leading-relaxed text-ink">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Included / excluded - paired, never separated                       */}
      {/* ------------------------------------------------------------------ */}
      <section aria-labelledby="covered" className="bg-warm">
        <div className="shell pb-16 sm:pb-20">
          <h2 id="covered" className="sr-only">
            What is and is not covered
          </h2>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Included */}
            <div className="rounded-[2px] border border-line bg-white p-6 sm:p-8">
              <p className="eyebrow text-foreground">Included</p>
              <h3 className="mt-3 text-display-sm text-ink">
                What the membership covers
              </h3>
              <ul className="mt-6 flex flex-col gap-2.5">
                {MEMBERSHIP.included.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 border-b border-line pb-2.5 text-[0.9375rem] leading-relaxed text-ink last:border-b-0 last:pb-0"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2a2a2a]-ink"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-muted">
                {MEMBERSHIP.includedNote}
              </p>
            </div>

            {/* Excluded */}
            <div className="rounded-[2px] border border-line bg-white p-6 sm:p-8">
              <p className="eyebrow text-foreground">Not included</p>
              <h3 className="mt-3 text-display-sm text-ink">
                What it does not cover
              </h3>

              <ul className="mt-6 flex flex-col gap-2.5">
                {MEMBERSHIP.excludedHeadline.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 border-b border-line pb-2.5 text-[0.9375rem] font-medium leading-relaxed text-ink last:border-b-0 last:pb-0"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black text-white"
                    >
                      <span className="text-[0.6875rem] leading-none">×</span>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <details className="group mt-6 border-t border-line pt-4">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-sm font-semibold text-ink marker:hidden">
                  See the full list of exclusions
                  <span
                    aria-hidden="true"
                    className="text-xl text-foreground transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <ul className="mt-4 flex flex-col gap-2">
                  {MEMBERSHIP.excluded.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-muted"
                    >
                      <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" />
                      {item}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Waiting period - stated prominently, not buried                      */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="waiting-period"
        className="on-dark bg-black text-white"
      >
        <div className="shell py-14 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <p className="eyebrow text-white">Important</p>
              <h2 id="waiting-period" className="mt-4 text-display-sm text-white">
                {MEMBERSHIP.waitingPeriod.days}-day waiting period
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[0.9375rem] leading-relaxed text-muted-dark sm:text-base">
                {MEMBERSHIP.waitingPeriod.text}
              </p>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted-dark">
                Need something attended now? Call{" "}
                <a
                  href={BUSINESS.phone.href}
                  className="font-semibold text-white underline underline-offset-4"
                >
                  {BUSINESS.phone.display}
                </a>{" "}
                for a standard chargeable job instead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* How it works                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section aria-labelledby="how-it-works" className="bg-warm">
        <div className="shell py-16 sm:py-20">
          <h2 id="how-it-works" className="text-display-sm text-ink">
            How it works
          </h2>

          <ol className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {MEMBERSHIP.howItWorks.map((step) => (
              <li key={step.step} className="flex gap-4 bg-warm p-5">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2a2a2a] font-mono text-sm font-bold text-black"
                >
                  {step.step}
                </span>
                <span className="text-[0.9375rem] leading-relaxed text-ink">
                  {step.title}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Eligibility, fair use, availability, cancellation, liability        */}
      {/* ------------------------------------------------------------------ */}
      <section aria-labelledby="the-fine-print" className="border-y border-line bg-white">
        <div className="shell py-16 sm:py-20">
          <h2 id="the-fine-print" className="text-display-sm text-ink">
            The terms in detail
          </h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-x-14">
            <Term
              title="Where you live"
              text={`${MEMBERSHIP.area.text} Eligible areas are ${MEMBERSHIP_AREAS.join(", ")}.`}
            />
            <Term
              title={MEMBERSHIP.fairUsage.title}
              text={MEMBERSHIP.fairUsage.text}
            />
            <Term
              title={MEMBERSHIP.availability.title}
              text={MEMBERSHIP.availability.text}
            />
            <Term
              title={MEMBERSHIP.cancellation.title}
              text={`${MEMBERSHIP.cancellation.customer} ${MEMBERSHIP.cancellation.provider}`}
            />
            <Term
              title={MEMBERSHIP.liability.title}
              text={MEMBERSHIP.liability.text}
            />
            <div>
              <h3 className="font-display text-lg font-extrabold tracking-[-0.02em] text-ink">
                Questions first?
              </h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">
                Call {BUSINESS.owner} on{" "}
                <a
                  href={BUSINESS.phone.href}
                  className="font-semibold text-foreground underline underline-offset-4"
                >
                  {BUSINESS.phone.display}
                </a>{" "}
                and ask before you sign up. There is no obligation to join.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Join                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section id="join" aria-labelledby="join-heading" className="bg-surface scroll-mt-28">
        <div className="shell py-16 sm:py-20">
          <div className="mx-auto max-w-[62ch] text-center">
            <h2 id="join-heading" className="text-display-md text-ink">
              Ready to join?
            </h2>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted sm:text-lg">
              Set up the Direct Debit with GoCardless. You will see the full
              agreement and the {MEMBERSHIP.waitingPeriod.days}-day waiting
              period before anything is taken, and you can cancel at any time by
              written notice.
            </p>

            <div className="mt-9 flex flex-col items-center gap-4">
              <Button
                href={MEMBERSHIP.signupUrl}
                size="lg"
                arrow
                external
                analyticsEvent="membership_signup_clicked"
                analyticsLocation="membership"
                analyticsAction="membership_gocardless"
              >
                {MEMBERSHIP.ctaLabelFull}
              </Button>

              {/*
                aria-live: the 14-day caveat is announced when the signup link
                is focused, not only when it is seen.
              */}
              <p
                aria-live="polite"
                className="max-w-[48ch] text-sm font-semibold leading-relaxed text-ink"
              >
                {MEMBERSHIP.waitingPeriodNotice}
              </p>
              <p className="max-w-[56ch] text-sm leading-relaxed text-muted">
                {MEMBERSHIP.materialsNotice} Payments are taken by{" "}
                {MEMBERSHIP.paymentMethod}. Opens in a new tab, and the binding
                agreement is provided by GoCardless before any payment is
                taken.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Term({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-t border-line pt-5">
      <h3 className="font-display text-lg font-extrabold tracking-[-0.02em] text-ink">
        {title}
      </h3>
      <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">
        {text}
      </p>
    </div>
  );
}
