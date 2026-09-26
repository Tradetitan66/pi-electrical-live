/**
 * ============================================================================
 * CUSTOMER REVIEWS
 * ----------------------------------------------------------------------------
 * GENUINE reviews supplied by the client. The text, names, dates and
 * locations are real and are reproduced verbatim - nothing here is written or
 * paraphrased by us.
 *
 * PLATFORM ATTRIBUTION
 * --------------------
 * Paul has confirmed permission to use both MyBuilder and Google reviews.
 * However the platform each individual review came from has not been
 * confirmed, so `platformConfirmed` is false throughout and NO platform is
 * displayed anywhere on the site. See CONTENT_TODO.md.
 *
 * SCHEMA
 * ------
 * No Review / AggregateRating structured data is emitted. Review source
 * attribution and totals are unconfirmed, and unverifiable review markup
 * risks a Google structured-data penalty. Ratings are shown on-page only.
 * ============================================================================
 */

export interface Review {
  id: string;
  /** Verbatim customer text. Never edited. */
  text: string;
  /** Customer name, or an anonymised label where the reviewer was anonymous. */
  reviewer: string;
  rating: number;
  /** Short description of the work, from the original review listing. */
  job: string;
  location: string | null;
  date: string;
  /** Recorded platform, where known. Not displayed while unconfirmed. */
  platform: "MyBuilder" | "Google" | null;
  platformConfirmed: boolean;
}

export const REVIEWS: Review[] = [
  {
    id: "flat-sockets-lights",
    text: "Really good work from PI Electrical. Added plug sockets, spotlights in the kitchen, and replaced an old doorbell and put a light in the attic with switch, for a very reasonable price. Very pleasant guys, arrived on time, and tidied up after themselves. Very pleased, and highly recommend.",
    reviewer: "MyBuilder user",
    rating: 5,
    job: "New sockets and lights for flat",
    location: "Edinburgh",
    date: "27 April 2026",
    platform: "MyBuilder",
    platformConfirmed: false,
  },
  {
    id: "downlights-install",
    text: "Absolutely delighted with the standard of work from PI Electrical. The guys arrived prompt, cleaned up and did a very neat job and were very professional. Will definately contact again for other work.",
    reviewer: "Gillian Wilson",
    rating: 5,
    job: "Downlights install",
    location: "Bathgate",
    date: "20 February 2026",
    platform: null,
    platformConfirmed: false,
  },
  {
    id: "eicr-certificate",
    text: "Paul carried out an EICR for me and I honestly couldn't have asked for better service. He is fully qualified, knowledgeable, and extremely professional throughout the whole process. He completed the Electrical Installation Condition Report thoroughly and explained everything clearly so I understood exactly where I stood. What really impressed me was how supportive he was in helping me achieve my completion certification with the council. He made sure everything was up to standard and compliant, which gave me real peace of mind. Reliable, punctual, and clearly takes pride in doing things properly, not cutting corners. If you need an electrician who knows his job and genuinely helps you get results, I would highly recommend Paul.",
    reviewer: "Anayeth",
    rating: 5,
    job: "EICR and certificate for council",
    location: "Edinburgh",
    date: "17 February 2026",
    platform: null,
    platformConfirmed: false,
  },
  {
    id: "emergency-light-fitting",
    text: "I wasn't home when the job was completed as I had to be at work. My Daughter was left leading the way. It's always a worry when you're not there to show what needs done. Not only was the job completed. He fixed another issue with the socket. He arrived same day within a few hours on a Sunday. Didn't rip me off for a Sunday call out charge. Completed the work I asked to be done. Very reasonably priced. I would highly recommend and definitely use again.",
    reviewer: "Kirsty Ross",
    rating: 5,
    job: "Emergency light fitting",
    location: "Dalkeith",
    date: "16 December 2025",
    platform: null,
    platformConfirmed: false,
  },
  {
    id: "shed-electricity",
    text: "Quote was reasonable, work completed to high standard and communication excellent. Very pleased.",
    reviewer: "Nicola White",
    rating: 5,
    job: "Run electricity to shed",
    location: "Pathhead",
    date: "1 November 2025",
    platform: null,
    platformConfirmed: false,
  },
  {
    id: "wall-light-removal",
    text: "Paul did a brilliant job of removing several wall lights prior to my bedroom being replastered. Speedy responses, very professional. Will use again!",
    reviewer: "MyBuilder user",
    rating: 5,
    job: "Removal of wall lights",
    location: "Edinburgh",
    date: "10 March 2026",
    platform: "MyBuilder",
    platformConfirmed: false,
  },
];

/** Shown in the review section heading. No counts, no aggregate. */
export const REVIEWS_HEADING = "5-Star Customer Reviews";

/** Supporting locations quoted in the reviews, used for the service-area link. */
export const REVIEW_LOCATIONS = [
  "Edinburgh",
  "Dalkeith",
  "Pathhead",
  "Bathgate",
] as const;
