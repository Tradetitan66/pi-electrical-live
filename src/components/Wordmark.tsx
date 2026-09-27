import Image from "next/image";
import { cx } from "@/lib/cx";
import { BUSINESS } from "@/data/business";

/**
 * Brand lockup: circular logo mark + typographic brand name.
 *
 * WHY A DISC, AND WHY IT IS BLACK
 * -------------------------------
 * The supplied artwork is an RGB PNG with a solid black background and no alpha
 * channel. The black cannot be knocked out programmatically, because the mark
 * contains roughly 13,900 black pixels of its OWN internal detail (the gaps and
 * strokes inside the bolt) - a luminance key would punch holes straight through
 * it. So the circle is produced by clipping the black square with
 * `rounded-full`, which leaves a black roundel with the green bolt inside it.
 * No image processing, and the artwork stays pixel-identical.
 *
 * SAFE TO CROP: the bolt's bounding box is 763x985 inside the 1254x1254 square,
 * and its furthest point sits 531px from the centre - comfortably inside the
 * inscribed circle (r=627). A circular crop therefore loses no artwork.
 *
 * DO NOT SCALE THE IMAGE INSIDE THE DISC past 1.18x. At 1x the bolt already
 * fills 78.5% of the disc, which is the right proportion for a roundel; any
 * inner scaling would push the bolt's top tip past the clip.
 *
 * The bolt is `alt=""` on purpose. It is decorative next to the visible
 * "PI Electrical" text, and both call sites wrap this in a Link with an
 * explicit `aria-label`, so a real alt value would only create a duplicate
 * announcement.
 *
 * SURFACES
 * The header is light, so the disc reads as a solid badge. The footer is
 * `bg-black`, where a black disc would disappear, so dark surfaces get a
 * hairline inset ring and the circle still reads as a badge.
 *
 * SWAPPING IN A FULL LOCKUP
 * -------------------------
 * Set `logoImage` below to a path such as "/images/logo-transparent.png" and
 * this renders that wide lockup instead of the disc + text. The supplied logo
 * artwork must be transparent and high enough resolution; do not trace or
 * recreate the mark in CSS.
 */

export const BRAND = {
  /** Optional wide lockup. `null` = use the circular mark + typographic name. */
  logoImage: null as string | null,
  /** Favicon, derived from the real mark. See scripts/build-brand-assets.mjs. */
  favicon: "/favicon.ico",
  /**
   * The real mark artwork: a green lightning bolt on a solid black square.
   * Used inside the disc (clipped to a circle) and on black surfaces.
   */
  mark: "/images/mark.png",
  /** Social sharing card, generated from the real mark. */
  socialCard: "/opengraph-image.png",
} as const;

export default function Wordmark({
  tone = "light",
  size = "md",
  className,
  priority,
}: {
  tone?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
}) {
  const dark = tone === "dark";

  /** Text scale, and the matching disc diameter so the two stay optically paired. */
  const scale = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }[size];

  const disc = {
    sm: 28,
    md: 32,
    lg: 38,
  }[size];

  if (BRAND.logoImage) {
    return (
      <span className={cx("inline-flex items-center", className)}>
        <Image
          src={BRAND.logoImage}
          alt={`${BUSINESS.name} logo`}
          width={size === "lg" ? 220 : size === "md" ? 180 : 150}
          height={size === "lg" ? 60 : size === "md" ? 50 : 42}
          priority={priority}
          quality={90}
          className="h-auto w-auto"
        />
      </span>
    );
  }

  return (
    <span
      className={cx(
        "inline-flex items-center gap-2.5",
        className,
      )}
    >
      {/*
        Circular logo. `bg-black` sits behind the image so the antialiased
        clip edge blends into black rather than the page behind it.
      */}
      <Image
        src={BRAND.mark}
        alt=""
        width={disc}
        height={disc}
        priority={priority}
        className={cx(
          "shrink-0 rounded-full bg-black object-cover",
          /* `inset-ring-*`, not `ring-*` + `ring-inset`: in Tailwind v4
             `ring-inset` is not a utility, so the offset-based ring never gets
             its custom properties initialised and the whole box-shadow
             declaration is dropped. `inset-ring-*` is self-contained. */
          dark && "inset-ring-1 inset-ring-white/15",
        )}
      />

      <span
        className={cx(
          "font-display font-extrabold uppercase leading-none tracking-[-0.02em]",
          scale,
        )}
      >
        <span className={dark ? "text-white" : undefined} style={dark ? undefined : { color: '#6dd491' }}>PI</span>
        <span
          className={cx("ml-[0.28em]", dark ? "text-white" : "text-ink")}
        >
          Electrical
        </span>
      </span>
    </span>
  );
}
