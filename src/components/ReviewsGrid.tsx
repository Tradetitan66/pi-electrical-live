"use client";

import { useState } from "react";
import Stars from "./Stars";
import Reveal from "./Reveal";
import ReviewDetailModal from "./ReviewDetailModal";
import { REVIEWS, REVIEWS_HEADING, REVIEW_LOCATIONS } from "@/data/reviews";

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
  const [openReview, setOpenReview] = useState<string | null>(null);

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

      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto no-scrollbar px-1 pb-4 md:columns-2 md:overflow-visible md:gap-5 lg:gap-6">
        {reviews.map((review, i) => (
          <Reveal
            key={review.id}
            className="snap-start shrink-0 w-[85%] md:w-auto md:break-inside-avoid md:mb-5 lg:mb-6"
            delay={(i % 2) * 90}
          >
            <figure className="flex h-full flex-col rounded-[2px] border border-line bg-white p-6 shadow-[0_1px_0_0_rgba(21,24,22,0.04)]">
              <Stars rating={review.rating} />

              <blockquote className="mt-4 flex-1">
                <p className="text-[0.9375rem] leading-relaxed text-ink">
                  &ldquo;{review.text.length > 220 ? review.text.slice(0, 220) + "..." : review.text}&rdquo;
                </p>
              </blockquote>

              {review.text.length > 220 ? (
                <button
                  onClick={() => setOpenReview(review.id)}
                  className="mt-3 text-sm font-semibold text-green-ink hover:underline underline-offset-2"
                >
                  Read more
                </button>
              ) : null}

              <figcaption className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line pt-4 text-sm">
                <span className="font-semibold text-ink">{review.reviewer}</span>
                <span aria-hidden="true" className="text-line">&middot;</span>
                <span className="text-muted">{review.job}</span>
                {review.location ? (
                  <>
                    <span aria-hidden="true" className="text-line">&middot;</span>
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

      <div className="mt-8 flex items-center gap-3">
        <a
          href="https://share.google/j2Aw5u3c4NUoEa0CA"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-green px-4 py-2 text-sm font-bold text-black hover:bg-green-strong"
        >
          Read on Google
        </a>
        <a
          href="https://www.mybuilder.com/profile/pi-electrical"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-line px-4 py-2 text-sm font-bold text-ink hover:border-green-ink hover:text-green-ink"
        >
          Read on MyBuilder
        </a>
      </div>

      <ReviewDetailModal
        reviewId={openReview ?? ""}
        open={!!openReview}
        onClose={() => setOpenReview(null)}
      />
    </div>
  );
}
