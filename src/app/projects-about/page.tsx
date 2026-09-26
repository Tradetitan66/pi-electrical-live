import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import ProjectGallery from "@/components/ProjectGallery";
import SectionHeading from "@/components/SectionHeading";
import MediaSlot from "@/components/MediaSlot";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import ReviewsGrid from "@/components/ReviewsGrid";
import FinalCta from "@/components/FinalCta";
import { MEDIA } from "@/data/media";
import { BUSINESS, TRUST_FACTS, SECONDARY_TRUST_FACTS } from "@/data/business";
import TrustMarquee from "@/components/TrustMarquee";
import { AREA_SUMMARY } from "@/data/areas";
import { RANGE_STATEMENT } from "@/data/services";

export const metadata: Metadata = {
  title: "Projects & About",
  description:
    "About PI Electrical and the work carried out by Paul across Edinburgh, the Lothians and Fife. Completed-work projects, commercial experience and customer reviews.",
  alternates: { canonical: "/projects-about" },
  openGraph: {
    title: "Projects & About | PI Electrical",
    description:
      "Completed electrical work across Edinburgh, the Lothians and Fife, and what working with PI Electrical is like.",
    url: "/projects-about",
  },
};

/**
 * Projects & About.
 *
 * ONE PAGE, TWO JOBS: who Paul is, and what the work looks like. Splitting
 * these across separate routes was rejected - a visitor checking either one
 * needs the other to judge it, and a separate About page would be three lines
 * long.
 *
 * CLIENT NAMING
 * GR8 Construction is named as a client. Logo use was NOT approved, so it is
 * referenced in text only - no logo image, no invented partnership language.
 * See CONTENT_TODO.md for the unresolved items.
 */
export default function ProjectsAboutPage() {
  return (
    <>
      <PageBanner
        eyebrow="Projects & About"
        title="One electrician, properly qualified, taking on the work properly"
        intro={RANGE_STATEMENT}
        meta={
          <p className="max-w-[58ch] text-[0.9375rem] leading-relaxed text-muted">
            {BUSINESS.name} is run by {BUSINESS.owner}, a fully qualified
            electrician based in {BUSINESS.address.town}. Work is carried out
            across {AREA_SUMMARY} and surrounding areas.
          </p>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            href="/#quote"
            size="lg"
            arrow
            analyticsEvent="quote_cta_clicked"
            analyticsLocation="projects_page"
            analyticsAction="projects_banner_quote"
          >
            Get a free quote
          </Button>
          <Button
            href={BUSINESS.phone.href}
            size="lg"
            variant="outline"
            analyticsEvent="phone_clicked"
            analyticsLocation="projects_page"
            analyticsAction="projects_banner_call"
          >
            Call {BUSINESS.phone.display}
          </Button>
        </div>
      </PageBanner>

      {/* ---------------------------------------------------------------- */}
      {/* About                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section aria-labelledby="about-heading" className="bg-warm">
        <div className="shell py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <SectionHeading
                id="about-heading"
                eyebrow="About"
                title="Straight answers, tidy work, and no surprises on the invoice"
              />

              <div className="mt-8 flex flex-col gap-5 text-[0.9375rem] leading-relaxed text-muted sm:text-base">
                <p>
                  {BUSINESS.owner} has been a fully qualified electrician for{" "}
                  {BUSINESS.facts.fullyQualifiedYears} years, working across
                  domestic and commercial electrical projects. {BUSINESS.name}{" "}
                  is a small business on purpose: you speak to the person doing
                  the work, not a call centre.
                </p>
                <p>
                  Public liability insurance is held to {BUSINESS.facts.publicLiability}
                  , and where certification is required for the electrical work
                  completed, the relevant certificates are provided. Quotes are
                  free and carry no obligation, and there is no job too small.
                </p>
                <p>
                  The work spans everything from changing a socket through to
                  full rewires, kitchen installations, extensions, new builds and
                  commercial fit-outs, alongside fault finding, EICRs, PAT
                  testing and emergency call-outs accepted day and night.
                </p>
                <p>
                  Emergency attendance is subject to availability, and no fixed
                  response time is promised - the site would rather be accurate
                  than reassuring.
                </p>
              </div>

              <p className="mt-10 text-sm leading-relaxed text-muted">
                Exact qualification and certificate names are not published
                because they have not yet been confirmed - they are available on
                request.
              </p>
            </div>

            {/* Photograph slots */}
            <div className="lg:col-span-6">
              <Reveal>
                <MediaSlot
                  slot={MEDIA.aboutPrimary}
                  className="w-full"
                  sizes="(min-width: 1024px) 46vw, 100vw"
                />
              </Reveal>
              <div className="mt-5 grid grid-cols-2 gap-5">
                <Reveal delay={80}>
                  <MediaSlot
                    slot={MEDIA.aboutSecondary}
                    sizes="(min-width: 1024px) 22vw, 45vw"
                  />
                </Reveal>
                <Reveal delay={160}>
                  <MediaSlot
                    slot={MEDIA.emergency}
                    sizes="(min-width: 1024px) 22vw, 45vw"
                  />
                </Reveal>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Photographs of {BUSINESS.owner} and recent work are being added.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/*
        Verified facts, no invented credentials.

        This sits as its own full-width band below the two-column grid rather
        than inside the prose column. In a half-width column the strip is only
        about 640px, and a marquee that narrow scrolls past too fast to read.
        Here it gets the full shell width, which is also what bounds the number
        of duplicate copies the marquee needs.
      */}
      <TrustMarquee
        facts={[...TRUST_FACTS, ...SECONDARY_TRUST_FACTS]}
        variant="stacked"
        label="Verified credentials"
      />

      {/* ---------------------------------------------------------------- */}
      {/* Clients                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section
        aria-labelledby="clients-heading"
        className="border-y border-line bg-white"
      >
        <div className="shell py-14 sm:py-16">
          <h2 id="clients-heading" className="text-display-sm text-ink">
            Working with others
          </h2>
          <p className="mt-4 max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted">
            {BUSINESS.name} works alongside builders, renovators and
            contractors as well as directly with homeowners and businesses.
          </p>

          <ul role="list" className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BUSINESS.referencedClients.map((client) => (
              <li
                key={client.name}
                className="rounded-[2px] border border-line bg-warm p-5"
              >
                <p className="font-display text-lg font-extrabold tracking-[-0.02em] text-ink">
                  {client.name}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  Construction work carried out for {client.name}.
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Gallery                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section aria-labelledby="projects-heading" className="bg-warm">
        <div className="shell py-16 sm:py-24">
          <SectionHeading
            id="projects-heading"
            eyebrow="Completed work"
            title="Recent projects"
            intro="Domestic and commercial work, with before-and-after comparisons where they are available."
            className="mb-12"
          />
          <ProjectGallery />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Reviews                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section aria-labelledby="projects-reviews-heading" className="border-t border-line bg-white">
        <div className="shell py-16 sm:py-24">
          <ReviewsGrid headingId="projects-reviews-heading" />
        </div>
      </section>

      <FinalCta />
    </>
  );
}
