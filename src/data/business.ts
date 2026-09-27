/**
 * ============================================================================
 * PI ELECTRICAL - BUSINESS CONFIG
 * ----------------------------------------------------------------------------
 * Single source of truth for identity, contact details, verified facts and
 * coverage. Every component reads from here - nothing hardcodes a phone
 * number, email address or area name.
 *
 * VERIFIED vs PLACEHOLDER
 * -----------------------
 * Anything below marked `TODO` is NOT confirmed and must not be published as
 * fact. See CONTENT_TODO.md for the full register.
 * ============================================================================
 */

/**
 * TODO(BLOCKING): Production domain is not confirmed. Every canonical URL,
 * OpenGraph tag, sitemap entry and JSON-LD `url` derives from this value.
 * Replace with the real domain before launch, e.g. "https://pielectrical.co.uk".
 */
export const SITE_URL = "https://www.pielectrical.example";

export const BUSINESS = {
  name: "PI Electrical",
  owner: "Paul",
  role: "Fully qualified electrician",

  /** Shown in the header/footer. Typographic, so the logo file is not needed. */
  wordmark: { lead: "PI", rest: "Electrical" },

  phone: {
    /** UK display format. */
    display: "07445 846762",
    /** International format with the leading zero dropped - required by wa.me. */
    international: "+447445846762",
    /** wa.me takes the number only: no +, spaces, brackets or hyphens. */
    whatsapp: "447445846762",
    href: "tel:+447445846762",
  },

  email: {
    display: "Paulinnes2306@hotmail.com",
    href: "mailto:Paulinnes2306@hotmail.com",
  },

  address: {
    line1: "9a Durham Place",
    town: "Bonnyrigg",
    postcode: "EH19 3EX",
    region: "Midlothian",
    country: "Scotland",
    countryCode: "GB",
    href: "https://www.google.com/maps/search/?api=1&query=9a+Durham+Place+Bonnyrigg+EH19+3EX",
  },

  /**
   * VERIFIED FACTS (confirmed by Paul / PI Electrical).
   *
   * Phrasing rule enforced across the site: the five years refers to how long
   * Paul has been FULLY QUALIFIED. It is never rendered as "5 years in
   * business" or a bare "5 years' experience", which would read as time
   * trading and would be a different claim.
   *
   * Written as "5+" / "over 5" rather than a flat "5", so the claim is a floor
   * and not a ceiling. It does not need re-editing every year, and it stays
   * true as the real figure grows. The number itself stays single-sourced on
   * `fullyQualifiedYears` - never type the 5 again in copy.
   */
  facts: {
    fullyQualified: true,
    fullyQualifiedYears: 5,
    fullyQualifiedNote:
      "Paul has been a fully qualified electrician for over 5 years, working across domestic and commercial electrical projects.",
    publicLiability: "£2 million",
    publicLiabilityNote:
      "Fully covered with public liability insurance up to £2 million.",
    certificatesProvided: true,
    certificatesNote:
      "Where certification is required for the electrical work completed, the relevant certificates will be provided.",
    freeQuotes: true,
    noJobTooSmall: true,
  },

  /**
   * Emergency wording is deliberately compliance-safe.
   *
   * Paul does attend night call-outs, but attendance is subject to
   * availability. A "24/7" or "guaranteed response" claim would be
   * unsubstantiated and therefore misleading under the Consumer Protection
   * from Unfair Trading Regulations 2008. The site says "day and night" and
   * always carries the availability qualifier.
   */
  emergency: {
    acceptsDayAndNight: true,
    attendanceSubjectToAvailability: true,
    qualification:
      "Electrical emergency? PI Electrical accepts emergency call-outs day and night. Attendance is subject to availability, and we will make reasonable efforts to respond as quickly as possible.",
    shortLabel: "Emergency call-outs available",
    enquiriesLabel: "24/7 emergency call-out enquiries",
  },

  /**
   * Clients Paul has explicitly authorised us to name publicly.
   *
   * GR8 Construction: name mention approved. Logo use NOT approved.
   * TODO: Toytown is NOT approved for publication - do not add it here until
   * Paul confirms both the mention and any logo permission.
   */
  referencedClients: [
    {
      name: "GR8 Construction",
      mentionApproved: true,
      logoApproved: false,
    },
  ],

  hours: {
    /** No fixed opening hours were confirmed, so none are published. */
    emergency: "Day and night emergency call-outs accepted",
  },
} as const;

/**
 * Hero lead line. Sits directly under the h1, above the credentials note -
 * the range of work is what the visitor is looking for first, the
 * qualifications are the reassurance that follows.
 */
export const HERO_INTRO =
  "From small repairs and socket changes to full rewires, kitchen electrics, home renovations and commercial projects, all work is carried out directly by Paul at PI Electrical.";

/** Short trust facts used in the strip and badges. Verified only. */
export const TRUST_FACTS = [
  {
    id: "qualified",
    value: `${BUSINESS.facts.fullyQualifiedYears}+ Years`,
    label: "Fully qualified",
  },
  { id: "insurance", value: "£2M", label: "Public liability" },
  { id: "quotes", value: "Free", label: "No-obligation quotes" },
  { id: "size", value: "Any size", label: "No job too small" },
] as const;

export const SECONDARY_TRUST_FACTS = [
  {
    id: "certificates",
    value: "Certified",
    label: "Certificates where required",
  },
  { id: "scope", value: "Domestic", label: "& commercial" },
  { id: "emergency", value: "Day & night", label: "Emergency call-outs" },
] as const;
