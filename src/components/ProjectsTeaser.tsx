import Button from "./Button";
import MediaSlot from "./MediaSlot";
import Reveal from "./Reveal";
import { MEDIA } from "@/data/media";
import { RANGE_STATEMENT } from "@/data/services";
import { BUSINESS } from "@/data/business";

/**
 * Projects teaser for the homepage.
 *
 * There are no project photographs yet, so this does NOT render a grid of
 * empty, invented project cards. It renders an honest band: a single labelled
 * slot plus a statement of what the gallery will hold, and a link to the full
 * Projects & About page.
 *
 * The alternative - a masonry of grey boxes captioned with guessed project
 * names - would be fabricated evidence. That is the one thing this site must
 * never do.
 */
export default function ProjectsTeaser() {
  return (
    <section aria-labelledby="projects-teaser-heading" className="bg-warm">
      <div className="shell py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="eyebrow flex items-center gap-2.5 text-foreground">
              <span aria-hidden="true" className="h-px w-6 bg-[#555555]/40" />
              Recent work
            </p>

            <h2
              id="projects-teaser-heading"
              className="mt-6 text-display-md text-ink"
            >
              Proof, not promises
            </h2>

            <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-muted">
              {RANGE_STATEMENT}
            </p>

            <p className="mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted">
              Completed-work photographs are being added as they are cleared for
              use. Rather than fill this space with stock images, the gallery is
              left honest until the real ones are ready.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                href="/projects-about"
                size="lg"
                arrow
                analyticsEvent="quote_cta_clicked"
                analyticsLocation="home"
                analyticsAction="projects_teaser_link"
              >
                Projects &amp; About
              </Button>
              {/* Bare fragment is correct: this component only renders on
                  "/", which always has the quote form below it. If it is ever
                  mounted on another route, use useAnchorHref(QUOTE_ANCHOR). */}
              <Button href="#quote" size="lg" variant="outline">
                Get a free quote
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <MediaSlot
                slot={MEDIA.domesticBreak}
                className="w-full"
                sizes="(min-width: 1024px) 56vw, 100vw"
              />
            </Reveal>

            <p className="mt-3 text-sm leading-relaxed text-muted">
              Full domestic and commercial scope, from a single socket to a
              complete installation. {BUSINESS.name} covers{" "}
              {BUSINESS.address.town} and the surrounding region.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
