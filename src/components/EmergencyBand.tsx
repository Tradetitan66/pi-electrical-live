"use client";

import Button from "./Button";
import { BUSINESS } from "@/data/business";
import { directWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Emergency band.
 *
 * Dark surface section as a visual break on the light page.
 * All accent colours are dark grey (#2a2a2a).
 * The logo mark uses --color-logo-green separately.
 */
export default function EmergencyBand() {
  return (
    <section
      aria-labelledby="emergency-heading"
      className="relative overflow-hidden bg-[#1a1a1a] text-white"
    >
      <div className="shell relative py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-2.5 text-white">
              <span
                aria-hidden="true"
                className="inline-block h-2 w-2 rounded-full bg-[#2a2a2a] motion-safe:animate-pulse"
              />
              {BUSINESS.emergency.enquiriesLabel}
            </p>

            <h2
              id="emergency-heading"
              className="mt-6 text-display-lg text-white"
            >
              Electrical emergency? Call-outs accepted{" "}
              <span className="text-white">day and night</span>.
            </h2>

            <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-muted-dark">
              Tripping circuits, dead sockets, flickering lights, a smell of
              burning, or a socket that has stopped working - call and Paul will
              tell you what to do and whether he can attend.
            </p>

            <p className="mt-4 max-w-[56ch] text-base leading-relaxed text-white/75">
              <span className="font-semibold text-white">Please note:</span>{" "}
              attendance is subject to availability, and we will make reasonable
              efforts to respond as quickly as possible. We do not publish or
              guarantee a fixed response time.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:col-span-5 lg:justify-end">
            <Button
              href={BUSINESS.phone.href}
              size="lg"
              arrow
              className="w-full"
              analyticsEvent="phone_clicked"
              analyticsLocation="emergency"
              analyticsAction="emergency_call_primary"
            >
              Call {BUSINESS.owner} now
            </Button>

            <Button
              href={directWhatsAppUrl("emergency")}
              size="lg"
              variant="outline"
              dark
              external
              className="w-full"
              analyticsEvent="whatsapp_quote_clicked"
              analyticsLocation="emergency"
              analyticsAction="emergency_whatsapp"
            >
              WhatsApp instead
            </Button>

            <p className="mt-1 text-sm leading-relaxed text-muted-dark">
              If you are in immediate danger, or the property is at risk, contact
              the emergency services first.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Compact restatement of the availability qualifier, for the services page. */
export function EmergencyNote({ className }: { className?: string }) {
  return (
    <p className={className ?? "text-sm leading-relaxed text-muted"}>
      {BUSINESS.emergency.qualification}
    </p>
  );
}
