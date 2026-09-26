import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import { BUSINESS } from "@/data/business";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How PI Electrical handles your personal information and cookies, under UK GDPR and PECR.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

/**
 * Privacy.
 *
 * This page has to describe what the site ACTUALLY does, not what a template
 * says it does. The important property here is that it is accurate:
 *
 *  - There is no contact form that posts to a server. The quote form builds a
 *    WhatsApp message in the browser, so nothing is transmitted to us until
 *    the visitor chooses to send it.
 *  - There is no analytics provider, no tracking pixel and no advertising
 *    cookie, because none has been approved. The analytics module in the
 *    codebase is a no-op unless something is deliberately connected.
 *  - There is no localStorage, no sessionStorage and no cookies of any kind
 *    set by this site.
 *
 * A privacy page claiming "we use cookies to improve your experience" on a
 * site that sets none would be worse than no page at all.
 *
 * TODO before launch: the hosting provider's identity and the UK GDPR
 * controller/contact details must be confirmed with Paul. See CONTENT_TODO.md.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageBanner
        eyebrow="Legal"
        title="Privacy"
        intro="How PI Electrical handles your personal information, in plain English."
      />

      <section className="bg-warm">
        <div className="shell py-16 sm:py-20">
          <div className="max-w-[68ch]">
            <Section
              title="Who we are"
              body={
                <>
                  {BUSINESS.name} is a sole trader run by {BUSINESS.owner}, an
                  electrician based at {BUSINESS.address.line1},{" "}
                  {BUSINESS.address.town}, {BUSINESS.address.postcode},{" "}
                  {BUSINESS.address.region}. {BUSINESS.address.country} is
                  where we are registered to do business.
                </>
              }
            />

            <Section
              title="What we collect"
              body={
                <>
                  <p>
                    This website does not have a form that sends data to us. If
                    you use the quote form, the information you type is used in
                    your own browser to build a WhatsApp message. It is not
                    transmitted to, or stored by, this website.
                  </p>
                  <p>
                    If you send that message, or call, or email, we will hold
                    your contact details and the details of the work in order to
                    reply, quote and carry out the job. We will keep that
                    information for as long as needed to deal with the enquiry
                    and any resulting work, and for the records we are required
                    to keep.
                  </p>
                </>
              }
            />

            <Section
              title="Cookies and analytics"
              body={
                <>
                  <p>
                    This site sets no cookies. It uses no analytics, no
                    advertising or social pixels, and no cross-site tracking.
                    Nothing about your visit is recorded by us.
                  </p>
                  <p>
                    Your browser may store standard technical information to make
                    the site work, and if you use WhatsApp, email or a phone
                    link, you leave this site and are then subject to that
                    service&apos;s own privacy policy.
                  </p>
                </>
              }
            />

            <Section
              title="Your rights"
              body={
                <>
                  Under UK GDPR you can ask us for a copy of the personal
                  information we hold about you, ask us to correct or delete it,
                  or object to how we use it. Because most of what we hold
                  arrives by phone, WhatsApp or email rather than through this
                  site, the quickest route is to contact {BUSINESS.owner} directly
                  - we can usually action a request immediately.
                </>
              }
            />

            <Section
              title="Contact"
              body={
                <>
                  Email{" "}
                  <a
                    href={BUSINESS.email.href}
                    className="font-semibold text-green-ink underline underline-offset-4"
                  >
                    {BUSINESS.email.display}
                  </a>{" "}
                  or call{" "}
                  <a
                    href={BUSINESS.phone.href}
                    className="font-semibold text-green-ink underline underline-offset-4"
                  >
                    {BUSINESS.phone.display}
                  </a>
                  .
                </>
              }
            />

            <p className="mt-12 border-t border-line pt-6 text-sm leading-relaxed text-muted">
              This page was last reviewed when the site was built. If anything
              about how the site works changes, this page will be updated before
              the change goes live.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function Section({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <section className="border-t border-line py-8 first:border-t-0 first:pt-0">
      <h2 className="text-display-sm text-ink">{title}</h2>
      <div className="mt-4 flex flex-col gap-4 text-[0.9375rem] leading-relaxed text-muted sm:text-base">
        {body}
      </div>
    </section>
  );
}
