/**
 * ============================================================================
 * PROJECTS
 * ----------------------------------------------------------------------------
 * Paul is supplying approximately 10-20 completed-work photographs, and will
 * try to include before/after examples. The architecture below is built and
 * ready for them.
 *
 * THE ARRAY IS INTENTIONALLY EMPTY
 * --------------------------------
 * Until Paul supplies photographs with titles, locations and descriptions,
 * this stays empty and the gallery renders a designed "pending" state.
 *
 * Nothing is invented to fill it. A gallery of empty cards captioned with
 * guessed project names and locations would be fabricated evidence, which is
 * exactly the thing this site must not do.
 *
 * To add a project: append an object below. The gallery, filters, lightbox
 * and before/after viewer pick it up with no component changes.
 * ============================================================================
 */

export type ProjectCategory = "domestic" | "commercial";

export interface ProjectPhoto {
  src: string;
  alt: string;
  orientation: "portrait" | "landscape" | "square";
}

export interface Project {
  /** Stable id. Never key on image path or title. */
  id: string;
  title: string;
  category: ProjectCategory;
  /** City / area, only where Paul has confirmed it. */
  location: string | null;
  description: string;
  /** Bullet list of work completed. Only what Paul confirms. */
  workCompleted: string[];
  photos: ProjectPhoto[];
  /**
   * When true the gallery renders a before/after comparison using photos[0] as
   * "before" and photos[1] as "after". Requires exactly two photos.
   */
  beforeAfter: boolean;
  /** Marks a visually larger cell in the asymmetric grid. */
  size: "large" | "small";
}

export const PROJECTS: Project[] = [];

/** Categories for the gallery filter. Only the confirmed domestic/commercial split. */
export const PROJECT_FILTERS = [
  { id: "all", label: "All" },
  { id: "domestic", label: "Domestic" },
  { id: "commercial", label: "Commercial" },
] as const satisfies ReadonlyArray<{ id: string; label: string }>;

export type ProjectFilterId = (typeof PROJECT_FILTERS)[number]["id"];

export const PROJECTS_PENDING = PROJECTS.length === 0;

/** Shown where a project has no confirmed location. */
export const LOCATION_UNCONFIRMED = "Location to be confirmed";
