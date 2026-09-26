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
  hero: {
    needs: "Hero photograph - Paul working, or a completed installation",
    src: null,
    alt: "",
    ratio: "4 / 5",
    priority: true,
    sizes: "(min-width: 1024px) 50vw, 100vw",
  },
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
    src: null,
    alt: "",
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

/** Project photos are configured per-project in data/projects.ts instead. */
