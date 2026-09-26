import { BUSINESS } from "./business";

/**
 * ============================================================================
 * SERVICE AREAS
 * ----------------------------------------------------------------------------
 * Primary coverage confirmed by Paul. Suitable projects elsewhere across
 * Scotland and the wider UK can also be discussed - stated as an open
 * possibility, never as a guarantee.
 * ============================================================================
 */

export const AREAS = [
  { name: "Bonnyrigg", note: "Home base" },
  { name: "Midlothian", note: "Primary coverage" },
  { name: "Edinburgh", note: "City coverage" },
  { name: "East Lothian", note: "Coverage" },
  { name: "West Lothian", note: "Coverage" },
  { name: "Fife", note: "Coverage" },
  { name: "Scottish Borders", note: "Coverage" },
] as const;

/** Comma-separated list for metadata, JSON-LD and short copy. */
export const AREA_LIST = AREAS.map((a) => a.name);

export const AREA_SUMMARY = AREA_LIST.join(", ");

/** Membership eligibility is narrower than the general service area. */
export const MEMBERSHIP_AREAS = [
  "Edinburgh",
  "The Lothians",
  "Fife",
  "Scottish Borders",
] as const;

export const BEYOND_COVERAGE =
  "Suitable projects elsewhere across Scotland and the wider UK can also be discussed.";

export const COVERAGE_COPY = `Based in ${BUSINESS.address.town} and serving customers throughout ${AREA_SUMMARY}.`;
