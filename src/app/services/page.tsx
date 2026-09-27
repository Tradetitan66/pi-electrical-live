import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import ServiceGroups from "@/components/ServiceGroups";
import EmergencyBand, { EmergencyNote } from "@/components/EmergencyBand";
import MembershipTeaser from "@/components/MembershipTeaser";
import AreasBand from "@/components/AreasBand";
import FinalCta from "@/components/FinalCta";
import QuoteModal from "@/components/QuoteModal";
import Button from "@/components/Button";
import Stars from "@/components/Stars";
import { RANGE_STATEMENT } from "@/data/services";
import { AREA_SUMMARY } from "@/data/areas";
import { BUSINESS } from "@/data/business";
import { REVIEWS } from "@/data/reviews";

export const metadata: Metadata = {
  title: "Electrical Services",
  description:
    "Full range of domestic and commercial electrical services in Edinburgh, the Lothians and Fife: rewires, kitchen electrics, fault finding, EICRs, PAT testing, EV chargers, landlord work and emergency call-outs.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Electrical Services | PI Electrical",
    description:
      "Rewires, kitchen electrics, fault finding, EICRs, PAT testing, EV chargers and emergency call-outs across Edinburgh, the Lothians and Fife.",
    url: "/services",
  },
};

export default function ServicesPage() {
  return (
    <>
      <PageBanner
        eyebrow="Services"
        title="Everything from a new socket to a complete installation"
        intro={RANGE_STATEMENT}
        meta={
          /* Stacked, not inline: the stars sit on their own line above the
             review count, and the two facts are no longer trying to share one
             baseline as the area list wraps. */
          <div className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted">
            <div className="flex flex-col items-start gap-2">
              <Stars rating={5} />
              <p>
                All {REVIEWS.length} supplied reviews rate the work 5&nbsp;stars
              </p>
            </div>
            <p className="mt-2">
              Covering {AREA_SUMMARY.join(", ")} and surrounding areas
            </p>
          </div>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <QuoteModal />
          <Button
            href={BUSINESS.phone.href}
            size="lg"
            variant="outline"
            analyticsEvent="phone_clicked"
            analyticsLocation="services_page"
            analyticsAction="services_banner_call"
          >
            Call {BUSINESS.phone.display}
          </Button>
        </div>
      </PageBanner>

      {/* Grouped service list */}
      <section aria-label="Full service list" className="bg-warm">
        <div className="shell py-16 sm:py-24">
          <ServiceGroups />
        </div>
      </section>

      {/* Emergency */}
      <EmergencyBand />

      {/* Membership */}
      <MembershipTeaser />

      {/* Emergency compliance note, restated in context */}
      <section aria-label="Emergency terms" className="border-t border-line bg-white">
        <div className="shell py-12">
          <EmergencyNote className="max-w-[70ch] text-[0.9375rem] leading-relaxed text-muted" />
        </div>
      </section>

      <AreasBand />
      <FinalCta />
    </>
  );
}
