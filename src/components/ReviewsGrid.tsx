import Stars from "./Stars";
import Reveal from "./Reveal";
import { REVIEWS, REVIEWS_HEADING, REVIEW_LOCATIONS } from "@/data/reviews";

/**
 * Real customer reviews.
 *
 * HONESTY RULES ENFORCED HERE
 *  - No "5.0 from 120 reviews". There is no verified total and no verified
 *    platform, so no aggregate is displayed anywhere.
 *  - No platform logo or name. `platformConfirmed` is false for every review,
 *    so attributing any of them to a specific site would be a guess.
 *  - Review text is reproduced verbatim, including the customer's spelling.
 *    "Definately" and "complimented" are their words, not ours.
 *  - No AggregateRating or Review structured data, which would require the
 *    unconfirmed source and count.
 *
 * Layout: a masonry-style two-column flow on desktop using CSS columns, which
 * needs no JavaScript and reflows naturally as text lengths differ.
 */

export default function ReviewsGrid({
  limit,
  headingId,
  showHeading = true,
}: {
  limit?: number;
  headingId: string;
  showHeading?: boolean;
}) {
  const reviews = typeof limit === "number" ? REVIEWS.slice(0, limit) : REVIEWS;

  return (
    <div>
      {showHeading ? (
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <h2 id={headingId} className="text-display-md text-ink">
            {REVIEWS_HEADING}
          </h2>
          <p className="max-w-[30ch] text-sm leading-relaxed text-muted">
            Genuine reviews from customers across{" "}
            {REVIEW_LOCATIONS.slice(0, 3).join(", ")}.
          </p>
        </div>
      ) : null}

      <div className="columns-1 gap-5 md:columns-2 lg:gap-6">
        {reviews.map((review, i) => (
          <Reveal
            key={review.id}
            className="mb-5 break-inside-avoid lg:mb-6"
            delay={(i % 2) * 90}
          >
            <figure className="flex h-full flex-col rounded-[2px] border border-line bg-white p-6">
              <Stars rating={review.rating} />

              <blockquote className="mt-4 flex-1">
                <p className="text-[0.9375rem] leading-relaxed text-ink">
                  &ldquo;{review.text}&rdquo;
                </p>
              </blockquote>

              <figcaption className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line pt-4 text-sm">
                <span className="font-semibold text-ink">{review.reviewer}</span>
                <span aria-hidden="true" className="text-line">
                  &middot;
                </span>
                <span className="text-muted">{review.job}</span>
                {review.location ? (
                  <>
                    <span aria-hidden="true" className="text-line">
                      &middot;
                    </span>
                    <span className="text-muted">{review.location}</span>
                  </>
                ) : null}
                <span className="ml-auto text-xs text-muted/80">
                  <time>{review.date}</time>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
