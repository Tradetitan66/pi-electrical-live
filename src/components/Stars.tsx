import { cx } from "@/lib/cx";

/**
 * Star rating.
 *
 * The visible stars are decorative; the whole group is exposed once to
 * assistive tech as a single image with a full label. This avoids announcing
 * five separate "star" graphics for every review.
 *
 * COLOUR - Google's rating yellow
 * ------------------------------
 * The stars are meaningful non-text graphics - they are the visual carrier of
 * the rating - so WCAG 1.4.11 requires 3:1 against the surface behind them.
 * They previously used the brand green, which measured 1.83:1 on the white
 * review cards and 1.70:1 on the warm background: a real failure.
 *
 * They are now Google's rating yellow (#FABB05, the Google Maps / Business
 * Profile star colour - hue 44.6deg, 96% saturation). That hex measures
 * 11.30:1 on the black footer, so it is used verbatim there. On the light
 * cards the same hex is only 1.72:1 on white, so the light-surface token is
 * that identical colour darkened: hue 46.7deg (2.1deg off), same saturation,
 * 3.75:1 on white and 3.50:1 on warm. It reads as the same Google yellow.
 *
 * Two tokens, not one: no single yellow clears 3:1 on white, warm and black
 * at once. Pass `tone="dark"` where the stars sit on black.
 */
export default function Stars({
  rating,
  tone = "light",
  className,
}: {
  rating: number;
  /** Which surface the stars sit on. Light = white/warm cards, dark = black. */
  tone?: "light" | "dark";
  className?: string;
}) {
  const label = `Rated ${rating} out of 5`;

  return (
    <span role="img" aria-label={label} className={className}>
      <span
        aria-hidden="true"
        className={cx(
          "inline-flex gap-0.5",
          tone === "dark" ? "text-star-dark" : "text-star",
        )}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            viewBox="0 0 20 20"
            className="h-3.5 w-3.5 fill-current"
            focusable="false"
          >
            <path d="M10 1.6l2.47 5.32 5.83.66-4.32 3.97 1.15 5.76L10 14.44l-5.13 2.87 1.15-5.76L1.7 7.58l5.83-.66L10 1.6z" />
          </svg>
        ))}
      </span>
    </span>
  );
}
