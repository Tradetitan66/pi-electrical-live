import { AREAS, BEYOND_COVERAGE } from "@/data/areas";
import { BUSINESS } from "@/data/business";

/**
 * Service-area band.
 *
 * Areas are rendered as a real <ul> list rather than a comma string, so a
 * screen-reader user can count them and jump between them. Coverage claims are
 * read straight from data/areas.ts - nothing is hand-typed here, which is how
 * the previous site ended up claiming an area it no longer covered.
 *
 * "Not on the list?" is answered immediately and honestly: the business will
 * consider suitable projects further afield, but it is not a claim of coverage.
 */
export default function AreasBand() {
  return (
    <section
      id="areas"
      aria-labelledby="areas-heading"
      className="border-y border-line bg-white"
    >
      <div className="shell py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <p className="eyebrow flex items-center gap-2.5 text-green-ink">
              <span aria-hidden="true" className="h-px w-6 bg-green-ink/40" />
              Where we work
            </p>
            <h2 id="areas-heading" className="mt-6 text-display-md text-ink">
              Areas covered
            </h2>
            
          </div>

          <div className="lg:col-span-8">
            <ul
              role="list"
              className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3"
            >
              {AREAS.map((area) => (
                <li
                  key={area.name}
                  className="flex min-h-16 flex-col justify-center gap-0.5 bg-warm px-4 py-4"
                >
                  <span className="font-display text-base font-extrabold tracking-[-0.015em] text-ink">
                    {area.name}
                  </span>
                  {area.note ? (
                    <span className="text-xs leading-snug text-muted">
                      {area.note}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-[2px] border-l-4 border-green-ink bg-surface px-5 py-4">
              <p className="font-semibold text-ink">Not on the list?</p>
              <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">
                {BEYOND_COVERAGE}
              </p>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-muted">
              Based in {BUSINESS.address.town}, {BUSINESS.address.region} - full
              address on request, or ask and Paul will confirm he covers your
              postcode.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
