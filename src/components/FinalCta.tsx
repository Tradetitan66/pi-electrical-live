import WhatsAppQuoteForm from "./WhatsAppQuoteForm";
import SectionHeading from "./SectionHeading";
import { BUSINESS } from "@/data/business";
import { WHATSAPP_HINTS } from "@/lib/whatsapp";

/**
 * Closing quote section.
 *
 * The form is embedded directly in the page rather than behind a modal, because
 * /#quote is the target of CTAs from the header, the mobile bar and the hero -
 * a link that lands on a modal trigger feels broken. The same form component
 * is reused inside a modal on the services page for the modal-first path.
 */
export default function FinalCta() {
  return (
    <section
      id="quote"
      aria-labelledby="quote-heading"
      className="border-t border-line bg-surface scroll-mt-28"
    >
      <div className="shell py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Pitch */}
          <div className="lg:col-span-5">
            <SectionHeading
              id="quote-heading"
              eyebrow="Free, no obligation"
              title={
                <>
                  Tell {BUSINESS.owner} what you need, and get a straight answer
                </>
              }
              intro={
                <>
                  Fill this in: WhatsApp opens ready. No account, no server, nothing stored. Not convenient? Just call.
                </>
              }
            />

            <div className="mt-9 flex flex-col gap-3">
              <a
                href={BUSINESS.phone.href}
                className="group flex min-h-16 items-center justify-between rounded-lg border border-line bg-warm px-5 transition-colors hover:border-green-ink"
              >
                <span>
                  <span className="block text-sm font-semibold text-ink">
                    Prefer to ring?
                  </span>
                  <span className="block text-sm text-muted">
                    {WHATSAPP_HINTS.voicemail}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-xl text-green-ink transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </a>


            </div>

            <p className="mt-6 text-sm leading-relaxed text-muted">
              {WHATSAPP_HINTS.whatsappHint} {WHATSAPP_HINTS.attach}
            </p>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="rounded-[2px] border border-line bg-warm p-5 shadow-[0_1px_0_0_rgba(21,24,22,0.06)] sm:p-8">
              <WhatsAppQuoteForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
