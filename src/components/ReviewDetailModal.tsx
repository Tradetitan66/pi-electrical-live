"use client";

import { useState } from "react";
import Modal from "./Modal";
import { REVIEWS } from "@/data/reviews";

export default function ReviewDetailModal({
  reviewId,
  open,
  onClose,
}: {
  reviewId: string;
  open: boolean;
  onClose: () => void;
}) {
  const review = REVIEWS.find((r) => r.id === reviewId);
  if (!review) return null;

  return (
    <Modal open={open} onClose={onClose} labelledBy={`review-${review.id}`} panelClassName="max-w-xl">
      <div className="space-y-4">
        <h3 id={`review-${review.id}`} className="text-xl font-extrabold text-ink">
          {review.reviewer}
        </h3>
        <p className="text-[0.9375rem] leading-relaxed text-ink">&ldquo;{review.text}&rdquo;</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="https://share.google/j2Aw5u3c4NUoEa0CA"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[#2a2a2a] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1a1a1a]"
          >
            Read on Google
          </a>
          <a
            href="https://www.mybuilder.com/profile/pi-electrical"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-line px-4 py-2.5 text-sm font-bold text-ink hover:border-line-strong hover:text-foreground"
          >
            Read on MyBuilder
          </a>
        </div>
        <button
          onClick={onClose}
          aria-label="Close review"
          className="mt-2 rounded-lg bg-black/80 text-white h-8 w-8 flex items-center justify-center text-sm font-bold absolute top-2 right-2"
        >
          ✕
        </button>
      </div>
    </Modal>
  );
}
