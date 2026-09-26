import { MEMBERSHIP_AREAS } from "./areas";

/**
 * ============================================================================
 * ELECTRICAL MAINTENANCE MEMBERSHIP
 * ----------------------------------------------------------------------------
 * A real, purchasable product. The facts below were supplied by Paul from the
 * membership agreement.
 *
 * IMPORTANT - SUMMARY, NOT THE CONTRACT
 * -------------------------------------
 * The wording on /maintenance-membership is a plain-English summary of the
 * agreement, not the agreement itself. The binding agreement is provided at
 * Direct Debit setup. Nothing here paraphrases PI Electrical's exclusion of
 * liability beyond the supplied terms. TODO: replace with the verbatim
 * agreement text when available - see CONTENT_TODO.md.
 *
 * The single most important framing point: this is LABOUR-ONLY cover. The
 * price and the material exclusion are presented at equal visual weight,
 * because a GBP 15 monthly figure otherwise reads as all-inclusive.
 * ============================================================================
 */

export const MEMBERSHIP = {
  name: "Electrical Maintenance Membership",
  price: 15,
  currency: "GBP",
  priceDisplay: "£15",
  cadence: "month",
  priceLine: "£15 / month",
  paymentMethod: "Direct Debit",
  ctaLabel: "Set up Direct Debit",
  ctaLabelFull: "Set up Direct Debit - £15/month",

  /**
   * GoCardless hosted mandate setup. Confirmed live by the client.
   * Rendered only after the terms above are on screen, in a new tab, and
   * never as an automatic redirect.
   */
  signupUrl:
    "https://pay.gocardless.com/BRT01KQWVCED19XPBFPDMPCHJZM2F",

  /** Shown as a live region so assistive tech announces the caveat. */
  waitingPeriodNotice: "14-day waiting period. Terms and 14-day waiting period apply.",

  summary:
    "Labour-only cover for eligible electrical faults and call-outs at your property.",

  materialsNotice: "Materials are charged separately.",

  valueProposition: [
    "Labour included for eligible call-outs",
    "Materials and replacement parts not included",
    "14-day waiting period",
    `Available in ${MEMBERSHIP_AREAS.join(", ")}`,
    "Appointments and emergency attendance subject to availability",
  ] as const,

  included: [
    "Fault finding",
    "Emergency electrical call-out labour",
    "Minor electrical repairs",
    "Sockets & switches",
    "Lighting circuits",
    "Protective device work",
    "General eligible domestic electrical faults",
  ] as const,

  /**
   * Headline exclusions. Deliberately limited to the items a homeowner is
   * most likely to assume are covered - burying these is the fastest way to
   * turn a GBP 15 member into a complaint.
   */
  excludedHeadline: [
    "Materials, parts and replacement products",
    "Consumer unit replacements",
    "Full rewires and new installations",
    "EICRs and certification work, unless separately agreed",
  ] as const,

  excluded: [
    "Materials, parts, fittings and replacement products",
    "Consumer unit replacements",
    "Full rewires",
    "New installations and upgrades",
    "EICRs, unless separately agreed",
    "Certification work, unless separately agreed",
    "Damage caused by misuse",
    "Damage caused by neglect",
    "Damage caused by vandalism",
    "Damage caused by flooding or fire",
    "Damage caused by third-party works",
    "Appliances that do not form part of the fixed electrical installation",
    "Commercial properties, unless agreed in writing",
  ] as const,

  includedNote:
    "PI Electrical determines whether work falls within the scope of the membership.",

  /** No numerical cap exists. Deliberately expressed as fair use, not a limit. */
  fairUsage: {
    title: "Fair use",
    text: "The membership is intended for genuine maintenance and repair requirements. PI Electrical may refuse or cancel cover where call-outs are excessive or unreasonable, the service is being abused, the property is unsafe, or payments are not maintained.",
    callOutLimit: null,
  },

  availability: {
    title: "Attendance and availability",
    text: "Membership appointments remain subject to engineer availability. Emergency attendance times are not guaranteed. PI Electrical will make reasonable efforts to attend as quickly as possible.",
  },

  cancellation: {
    title: "Cancellation",
    customer:
      "You may cancel at any time by written notice. No refunds are given for part months already paid.",
    provider:
      "PI Electrical may cancel the membership for non-payment, abuse of service, unsafe working conditions, or breach of the agreement.",
  },

  liability: {
    title: "Liability",
    text: "The agreement states that PI Electrical will not be liable for consequential loss or damage, loss of power, loss of earnings, business interruption, or pre-existing faults identified before the membership commenced. Nothing in the agreement affects your statutory rights.",
    statutoryRights: true,
  },

  waitingPeriod: {
    days: 14,
    text: "There is a 14-day waiting period after the Direct Debit is set up. A covered call-out cannot be requested during the first 14 days, and faults reported during this period are treated as standard chargeable work.",
  },

  area: {
    eligible: MEMBERSHIP_AREAS,
    text: "Membership properties must be located within Edinburgh, the Lothians, Fife or the Scottish Borders. PI Electrical may refuse or cancel a membership where a property falls outside the service area.",
    /** This is not a UK-wide product and must never be advertised as one. */
    ukWide: false,
  },

  howItWorks: [
    { step: "1", title: "Join via Direct Debit" },
    { step: "2", title: "14-day waiting period begins" },
    { step: "3", title: "Membership stays active while payments remain up to date" },
    { step: "4", title: "Contact PI Electrical when an eligible electrical problem occurs" },
    { step: "5", title: "Covered labour is included" },
    { step: "6", title: "You pay for any required materials or parts" },
  ] as const,

  /** Copy guards. Wording we must never use, kept here so it stays unused. */
  prohibitedPhrasing: [
    "Complete electrical protection",
    "Never pay an electrician again",
    "Unlimited electrical cover",
    "Unlimited call-outs",
    "Guaranteed emergency attendance",
    "UK-wide cover",
  ] as const,
} as const;

export const MEMBERSHIP_DISCLAIMER =
  "This page is a plain-English summary of the membership terms, not the agreement itself. The binding agreement is provided when you set up the Direct Debit.";
