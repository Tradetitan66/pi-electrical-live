import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { SERVICE_BANDS, RANGE_STATEMENT } from "@/data/services";
import { BUSINESS } from "@/data/business";

/**
 * The six service bands, in the order given by SERVICE_BANDS.
 *
 * The range runs from "change a socket" to "complete installation", which is a
 * 20x spread in scale. Presenting that as a flat grid of identical cards either
 * oversells the small jobs or undersells the big ones, so it is grouped into
 * bands with an index number, each with a one-line summary.
 *
 * One uniform render over SERVICE_BANDS. Commercial used to be a second,
 * separately hardcoded block appended after the map, which meant its position
 * and its "06" lived in this file while the other five lived in the data - two
 * places to edit for one reorder, and no way to change the order from the data
 * at all. Order and numbering are now both owned by the data; see BAND_ORDER.
 *
 * Static markup, no accordion: on this page the visitor has already chosen to
 * read the full list, so hiding it behind clicks would be hostile.
 */
export default function ServiceGroups() {
  return (
    <div className="flex flex-col gap-20 sm:gap-24">
      {/*
        The page <h1> lives in the banner, and each band below is an <h3>, so
        without this the outline skips a level. It is the section heading for
        the whole list; the bands nest under it. No intro, because the banner
        already states the range statement on this page.
      */}
      <SectionHeading
        eyebrow="Full range"
        title="Every service, in six bands"
        id="service-range-heading"
      />

      {SERVICE_BANDS.map((band) => (
        <Reveal key={band.id}>
          <section aria-labelledby={`group-${band.id}`}>
            <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow text-green-ink">{band.index}</p>
                <h3
                  id={`group-${band.id}`}
                  className="mt-3 text-display-sm text-ink"
                >
                  {band.title}
                </h3>
              </div>
              <p className="max-w-[40ch] text-[0.9375rem] leading-relaxed text-muted sm:text-right">
                {band.summary}
              </p>
            </div>

            <ul
              role="list"
              className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3"
            >
              {band.items.map((item) => (
                // Keyed on title, not slug: all band item titles are unique and
                // keys only need to be unique among siblings in one list, which
                // is one band. Commercial items have no slug to key on anyway.
                <li key={item.title}>
                  <h4 className="font-display text-lg font-extrabold tracking-[-0.02em] text-ink">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>

            {band.showWhoWeWorkWith ? (
              <p className="mt-8 text-sm leading-relaxed text-muted">
                {BUSINESS.name} also works with contractors and builders on larger
                projects.{" "}
                <Link
                  href="/projects-about"
                  className="font-semibold text-green-ink underline underline-offset-4"
                >
                  See who we work with
                </Link>
                .
              </p>
            ) : null}
          </section>
        </Reveal>
      ))}
    </div>
  );
}

/** Closing statement, reused on the projects page. */
export function RangeNote() {
  return <p className="max-w-[52ch] text-lg leading-relaxed text-muted">{RANGE_STATEMENT}</p>;
}
