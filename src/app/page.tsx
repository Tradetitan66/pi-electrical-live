import Hero from "@/components/Hero";
import QuickActions from "@/components/QuickActions";
import WorkCarousel from "@/components/WorkCarousel";
import ServiceAccordion from "@/components/ServiceAccordion";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import EmergencyBand from "@/components/EmergencyBand";
import MembershipTeaser from "@/components/MembershipTeaser";
import ReviewsGrid from "@/components/ReviewsGrid";
import ProjectsTeaser from "@/components/ProjectsTeaser";
import AreasBand from "@/components/AreasBand";
import FinalCta from "@/components/FinalCta";
import { SECONDARY_TRUST_FACTS } from "@/data/business";
import TrustMarquee from "@/components/TrustMarquee";

/**
 * Home.
 *
 * SECTION ORDER is deliberate: answer "can I trust this person and can they do
 * the job" before asking for anything. The quote form is last, and every
 * earlier CTA is an anchor link to it rather than a dead button.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <WorkCarousel />
      <QuickActions />

      {/* Services */}
      <section aria-labelledby="services-heading" className="bg-warm">
        <div className="shell py-16 sm:py-24">
          <SectionHeading
            id="services-heading"
            eyebrow="What we do"
            title="The full range, from one socket to a complete installation"
            intro="Eight areas of work, and no job too small. Open a row to see what it covers."
            className="mb-12"
          />
          <ServiceAccordion />
        </div>
      </section>

      {/* Secondary trust strip - breaks up the page and adds verified facts */}
      <TrustMarquee
        facts={SECONDARY_TRUST_FACTS}
        label="Further credentials"
      />

      <EmergencyBand />
      <MembershipTeaser />

      {/* Reviews */}
      <section aria-labelledby="reviews-heading" className="bg-warm">
        <div className="shell py-16 sm:py-24">
          <ReviewsGrid headingId="reviews-heading" limit={4} />
          <Reveal className="mt-10">
            <p className="text-sm leading-relaxed text-muted">
              Reviews are reproduced exactly as customers wrote them.
            </p>
          </Reveal>
        </div>
      </section>

      <ProjectsTeaser />
      <AreasBand />
      <FinalCta />
    </>
  );
}
