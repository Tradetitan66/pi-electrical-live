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
              
            />

            <p className="mt-6 text-sm leading-relaxed text-muted">
              {WHATSAPP_HINTS.whatsappHint} {WHATSAPP_HINTS.attach}
            </p>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <p className="mb-4 text-sm leading-relaxed text-muted">
              Clicked Get a free quote above? Fill this in and WhatsApp opens ready to send.
            </p>
            <div className="rounded-2xl border border-line bg-warm p-5 shadow-[0_1px_0_0_rgba(21,24,22,0.06)] sm:p-8">
              <WhatsAppQuoteForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
