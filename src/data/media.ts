/**
 * ============================================================================
 * MEDIA SLOTS
 * ----------------------------------------------------------------------------
 * The single place image assets are configured.
 *
 * Paul will supply the real photography later. Until then every slot has
 * `src: null` and the <MediaSlot> component renders a labelled placeholder at
 * a locked aspect ratio - so there is no layout shift when a real image is
 * dropped in, and no fabricated alt text.
 *
 * There is no `hero` slot any more. The hero is text-only; the photography
 * lives in the work carousel below it. See WORK_GALLERY at the foot of this
 * file - that one is real assets, and its alt text is still TODO.
 *
 * TO ATTACH A REAL IMAGE
 * ----------------------
 * 1. Put the file in /public/images (prefer a descriptive, space-free name).
 * 2. Set `src: "/images/your-file.jpg"`.
 * 3. Set `alt` to describe what is actually in the photo.
 * 4. Set `priority: true` ONLY on the single LCP image (the hero).
 *
 * Alt text guidance: describe the work shown, not the file. "Rewired consumer
 * unit with labelled circuits in a renovated kitchen" is useful. "Electrical
 * work" is not. Decorative images should use alt: "".
 * ============================================================================
 */

export interface MediaSlotConfig {
  /** What image belongs here. Rendered on the placeholder. */
  needs: string;
  src: string | null;
  alt: string;
  /** CSS aspect-ratio value, e.g. "4 / 5". Locks layout before an image lands. */
  ratio: string;
  /** Preload this image. Use on the hero only. */
  priority?: boolean;
  /** sizes attribute for the responsive srcset. */
  sizes?: string;
  /** Object position hint once a real image is attached. */
  position?: string;
}

export const MEDIA = {
  aboutPrimary: {
    needs: "Photograph of Paul, or Paul on site",
    src: null,
    alt: "",
    ratio: "3 / 4",
    sizes: "(min-width: 1024px) 46vw, 100vw",
  },
  aboutSecondary: {
    needs: "Supporting detail photograph",
    src: null,
    alt: "",
    ratio: "1 / 1",
    sizes: "(min-width: 1024px) 22vw, 40vw",
  },
  domesticBreak: {
    needs: "Large photograph - extension or renovation electrical work",
    src: "/images/work-07.webp",
    alt: "Large photograph - extension or renovation electrical work. Full domestic and commercial scope, from a single socket to a complete installation. PI Electrical covers Bonnyrigg and the surrounding region.",
    ratio: "16 / 10",
    sizes: "100vw",
  },
  membership: {
    needs: "Optional membership photograph",
    src: null,
    alt: "",
    ratio: "3 / 2",
    sizes: "(min-width: 1024px) 40vw, 100vw",
  },
  emergency: {
    needs: "Optional emergency / fault-finding photograph",
    src: null,
    alt: "",
    ratio: "16 / 9",
    sizes: "100vw",
  },
} as const satisfies Record<string, MediaSlotConfig>;

export type MediaKey = keyof typeof MEDIA;

/* ============================================================================
 * WORK CAROUSEL
 * ---------------------------------------------------------------------------
 * Six photographs of completed work, shown in a self-advancing carousel
 * directly below the hero. Every one of these is a real asset, so unlike the
 * slots above there is no placeholder fallback and no `needs` prompt.
 *
 * ---------------------------------------------------------------------------
 * ALT TEXT IS A PLACEHOLDER AND MUST BE REPLACED
 * ---------------------------------------------------------------------------
 * Every `alt` below begins `TODO(alt)`. That is deliberate and it is not a
 * coding convenience: the model that assembled this had no image-input
 * capability and could not see what the photographs contain. Rather than
 * write plausible-sounding descriptions, which would be fabricated claims
 * about a real client's work, the field is left obviously unfinished.
 *
 * `grep -rn "TODO(alt)" src/` lists every one. Each needs a real sentence
 * describing the work in the frame - "Rewired consumer unit with labelled
 * circuits in a renovated kitchen", not "Electrical work". Until then these
 * read as empty to a screen reader, which is why they are marked rather than
 * quietly left as "".
 *
 * ---------------------------------------------------------------------------
 * WORK-01 IS LANDSCAPE IN A PORTRAIT FRAME
 * ---------------------------------------------------------------------------
 * work-01 is 1600x1181 (1.355 landscape); the other five are 0.78-0.90
 * portrait. The carousel frame is a uniform 4/5, so this one is object-cover
 * cropped and loses roughly 59% of its width. That was a conscious decision -
 * keeping all six beat dropping to five for ratio consistency - but the crop
 * point is centre, because it was not possible to see where the subject sits.
 * If the subject gets cut, `objectPosition` on that entry is the fix, and it
 * is the one field here that most needs a human eye.
 * ============================================================================
 */

export interface GalleryImage {
  src: string;
  /** See the alt-text warning above. Replace before this ships to customers. */
  alt: string;
  /** Native ratio of the source file, recorded so the crop is not a surprise. */
  native: string;
  /** sizes attribute for the responsive srcset. */
  sizes: string;
  /** object-position, only where the default centre crop is known to be wrong. */
  position?: string;
}

export const WORK_GALLERY: GalleryImage[] = [
  {
    src: "/images/work-01.webp",
    alt: "TODO(alt): landscape shot, cropped hard in a 4/5 frame - describe the work and note the subject is centred",
    native: "1600 / 1181",
    sizes: "(min-width: 1024px) 44vw, 92vw",
  },
  {
    src: "/images/work-02.webp",
    alt: "TODO(alt): describe the work shown in this photograph",
    native: "1313 / 1600",
    sizes: "(min-width: 1024px) 44vw, 92vw",
  },
  {
    src: "/images/work-03.webp",
    alt: "TODO(alt): describe the work shown in this photograph",
    native: "1253 / 1600",
    sizes: "(min-width: 1024px) 44vw, 92vw",
  },
  {
    src: "/images/work-04.webp",
    alt: "TODO(alt): high-detail shot - describe the work and what the detail shows",
    native: "1416 / 1572",
    sizes: "(min-width: 1024px) 44vw, 92vw",
  },
  {
    src: "/images/work-05.webp",
    alt: "TODO(alt): describe the work shown in this photograph",
    native: "1369 / 1600",
    sizes: "(min-width: 1024px) 44vw, 92vw",
  },
  {
    src: "/images/work-06.webp",
    alt: "TODO(alt): describe the work shown in this photograph",
    native: "1404 / 1564",
    sizes: "(min-width: 1024px) 44vw, 92vw",
  },
];

/** Project photos are configured per-project in data/projects.ts instead. */
