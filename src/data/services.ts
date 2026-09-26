/**
 * ============================================================================
 * SERVICES
 * ----------------------------------------------------------------------------
 * All of the below were explicitly confirmed by Paul. Grouped rather than
 * rendered as a flat wall of identical cards so the range is obvious without
 * overwhelming - the range genuinely runs from changing a socket through to
 * complete installations.
 *
 * HOME_RENOVATIONS / REWIRES / KITCHEN_ELECTRICS are promoted to their own
 * array because Paul confirmed these are the jobs he is currently doing most
 * often. That is a frequency fact, not a claim that other work is unwanted.
 * ============================================================================
 */

export type ServiceKey =
  | "rewires-full"
  | "rewires-partial"
  | "kitchens"
  | "renovations"
  | "extensions"
  | "new-builds"
  | "garden-rooms"
  | "lighting"
  | "sockets-switches"
  | "consumer-units"
  | "fault-finding"
  | "repairs"
  | "outdoor"
  | "eicr"
  | "pat"
  | "smoke-fire-alarms"
  | "landlord"
  | "ev-chargers"
  | "emergency";

export interface ServiceItem {
  slug: ServiceKey;
  title: string;
  text: string;
}

export interface ServiceGroup {
  id: string;
  title: string;
  summary: string;
  items: ServiceItem[];
}

/**
 * A band as rendered on the services page.
 *
 * Deliberately looser than ServiceGroup: `items` is just title + text, so the
 * commercial list can sit in the same array even though its entries carry no
 * `slug`. Commercial scope is not quoted as a job type, so it has no ServiceKey.
 *
 * `index` is filled in from the band's position, never hand-written. See
 * SERVICE_BANDS below.
 */
export interface ServiceBand {
  id: string;
  index: string;
  title: string;
  summary: string;
  items: readonly { title: string; text: string }[];
  /** Commercial only: adds the "See who we work with" closing line. */
  showWhoWeWorkWith?: boolean;
}

/** A band before its number is assigned. */
type BandContent = Omit<ServiceBand, "index">;

/** The three job types Paul is currently doing most often. */
export const FEATURED_SERVICES = [
  {
    slug: "renovations",
    title: "Home Renovations",
    text: "Full and partial rewiring carried out as part of wider renovation work, coordinated with the other trades on site.",
  },
  {
    slug: "rewires",
    title: "Rewires",
    text: "Full and partial rewires for older properties, renovations and larger improvement projects.",
  },
  {
    slug: "kitchens",
    title: "Kitchen Electrics",
    text: "Kitchen lighting, sockets, appliances and circuits installed properly as part of a new kitchen or refresh.",
  },
] as const;

/** Grouped service architecture used on the services page. */
export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: "home-improvements",
    title: "Home Improvements",
    summary:
      "Larger projects where the electrical work is part of something bigger.",
    items: [
      {
        slug: "rewires-full",
        title: "Full Rewires",
        text: "Complete rewiring for older properties, major renovations and larger improvement projects.",
      },
      {
        slug: "rewires-partial",
        title: "Partial Rewires",
        text: "Rewiring of specific circuits or areas, where a full rewire is not required.",
      },
      {
        slug: "kitchens",
        title: "Kitchen Electrics",
        text: "Lighting, sockets, appliance circuits and work carried out alongside a new or refitted kitchen.",
      },
      {
        slug: "renovations",
        title: "Home Renovation Electrics",
        text: "Electrical work as part of a wider renovation, planned around the other trades on site.",
      },
      {
        slug: "extensions",
        title: "Extensions",
        text: "Electrical installation for extensions, from new circuits and sockets through to lighting and outside power.",
      },
      {
        slug: "new-builds",
        title: "New Builds",
        text: "Electrical installation for new build properties, working to the agreed programme of work.",
      },
      {
        slug: "garden-rooms",
        title: "Garden Rooms",
        text: "Power, lighting and heating supply for garden rooms, studios and other outbuildings.",
      },
    ],
  },
  {
    id: "everyday-electrical",
    title: "Everyday Electrical",
    summary:
      "The smaller jobs that still need doing properly. No job is too small.",
    items: [
      {
        slug: "lighting",
        title: "Lighting",
        text: "Interior and exterior lighting, downlights, spotlights and fixture installation.",
      },
      {
        slug: "sockets-switches",
        title: "Sockets & Switches",
        text: "Additional sockets, socket and switch replacement, and repositioning where a layout has changed.",
      },
      {
        slug: "consumer-units",
        title: "Consumer Unit Work",
        text: "Consumer unit related work, including alterations to circuits and protective devices.",
      },
      {
        slug: "fault-finding",
        title: "Fault Finding",
        text: "Tracing and diagnosing faults that cause tripping circuits, dead sockets or flickering lights.",
      },
      {
        slug: "repairs",
        title: "General Electrical Repairs",
        text: "General domestic electrical repairs, from a single faulty fitting upwards.",
      },
      {
        slug: "outdoor",
        title: "Outdoor Electrics",
        text: "Outdoor lighting, sheds, outbuildings and power brought safely outside.",
      },
    ],
  },
  {
    id: "testing-safety",
    title: "Testing & Safety",
    summary:
      "Inspection, testing and the work landlords and businesses are required to keep on top of.",
    items: [
      {
        slug: "eicr",
        title: "EICRs",
        text: "Electrical Installation Condition Reports, with the results explained clearly so you know where you stand.",
      },
      {
        slug: "pat",
        title: "PAT Testing",
        text: "Portable appliance testing for workplaces, landlords and shared equipment.",
      },
      {
        slug: "smoke-fire-alarms",
        title: "Smoke & Fire Alarms",
        text: "Smoke alarm and fire alarm installation, including interlinked and mains-powered systems.",
      },
      {
        slug: "landlord",
        title: "Landlord Electrical Work",
        text: "Electrical work for landlords and tenanted properties, including maintenance and remedial work.",
      },
    ],
  },
  {
    id: "modern-electrical",
    title: "Modern Electrical",
    summary: "Current-standard installations for newer homes and new builds.",
    items: [
      {
        slug: "ev-chargers",
        title: "EV Charger Installation",
        text: "Electric vehicle charger installation, with the supply and routing planned properly rather than adapted afterwards.",
      },
    ],
  },
  {
    id: "emergency",
    title: "Emergency",
    summary:
      "Faults that cannot wait. Call-outs are accepted day and night, subject to availability.",
    items: [
      {
        slug: "emergency",
        title: "Emergency Call-Outs",
        text: "Emergency electrical call-outs accepted day and night. Attendance is subject to availability.",
      },
    ],
  },
];

/** Flat lookup used by the quote form and SEO copy. */
export const SERVICE_INDEX: Record<ServiceKey, ServiceItem> =
  SERVICE_GROUPS.flatMap((g) => g.items).reduce(
    (acc, item) => ({ ...acc, [item.slug]: item }),
    {} as Record<ServiceKey, ServiceItem>,
  );

/** The eight numbered rows on the homepage accordion. */
export const HOME_SERVICE_ROWS = [
  {
    id: "rewires",
    index: "01",
    title: "Rewires",
    text: "Full and partial rewires for renovations, older properties and larger improvement projects.",
    groupId: "home-improvements",
  },
  {
    id: "lighting-sockets",
    index: "02",
    title: "Lighting & Sockets",
    text: "Interior and exterior lighting, additional sockets and switch replacement.",
    groupId: "everyday-electrical",
  },
  {
    id: "consumer-units",
    index: "03",
    title: "Consumer Units",
    text: "Consumer unit related work, circuit alterations and protective devices.",
    groupId: "everyday-electrical",
  },
  {
    id: "extensions-renovations",
    index: "04",
    title: "Extensions & Renovations",
    text: "Electrical work as part of extensions, renovations and wider property projects.",
    groupId: "home-improvements",
  },
  {
    id: "new-builds",
    index: "05",
    title: "New Builds",
    text: "Electrical installation for new build properties, working to the agreed programme of work.",
    groupId: "home-improvements",
  },
  {
    id: "garden-rooms-outdoor",
    index: "06",
    title: "Garden Rooms & Outdoor Electrics",
    text: "Power, lighting and heating for garden rooms, sheds and outbuildings.",
    groupId: "home-improvements",
  },
  {
    id: "commercial",
    index: "07",
    title: "Commercial Electrical",
    text: "Electrical support for businesses, contractors and commercial properties.",
    groupId: "commercial",
  },
  {
    id: "fault-finding-emergencies",
    index: "08",
    title: "Fault Finding & Emergencies",
    text: "Fault diagnosis and emergency call-outs accepted day and night, subject to availability.",
    groupId: "emergency",
  },
] as const;

/** Commercial scope. Confirmed experience - no invented client relationships. */
export const COMMERCIAL_SERVICES = [
  {
    title: "Restaurants & Hotels",
    text: "Electrical work for hospitality premises, including fit-outs, lighting and maintenance.",
  },
  {
    title: "Schools & Education",
    text: "Electrical work for schools and education premises, including testing and maintenance.",
  },
  {
    title: "Shop Fitting",
    text: "Shop fitting and retail electrical installation, from new fit-outs to alterations.",
  },
  {
    title: "Commercial Installations",
    text: "Full commercial electrical installations for new and refitted premises.",
  },
  {
    title: "Commercial Maintenance",
    text: "Ongoing electrical maintenance and repair for commercial properties.",
  },
  {
    title: "Testing & Fault Finding",
    text: "PAT testing, inspection and fault finding for commercial premises.",
  },
] as const;

/**
 * Commercial as a band, so the services page renders all six from one list.
 * Previously this content was hardcoded in the component, which meant the band
 * number lived in two files and the order could not be changed from the data.
 */
const COMMERCIAL_BAND: BandContent = {
  id: "commercial",
  title: "Commercial Electrical",
  summary:
    "For businesses, contractors and commercial properties across the region.",
  items: COMMERCIAL_SERVICES,
  showWhoWeWorkWith: true,
};

const BAND_CONTENT: Record<string, BandContent> = {
  ...Object.fromEntries(SERVICE_GROUPS.map((group) => [group.id, group])),
  commercial: COMMERCIAL_BAND,
};

/**
 * Page order for the six bands. Commercial is deliberately third: it is a large
 * share of the work and was previously last, where it read as an afterthought.
 *
 * This list is the single source of truth for both order and numbering. To move
 * a band, move it here - the number follows automatically. Nothing below can
 * drift out of step with the order the way a hand-written "06" could.
 */
const BAND_ORDER = [
  "home-improvements",
  "everyday-electrical",
  "commercial",
  "testing-safety",
  "modern-electrical",
  "emergency",
] as const;

export const SERVICE_BANDS: ServiceBand[] = BAND_ORDER.map((id, position) => {
  const band = BAND_CONTENT[id];
  if (!band) {
    throw new Error(`BAND_ORDER lists "${id}", which has no matching band.`);
  }
  return { ...band, index: String(position + 1).padStart(2, "0") };
});

/** Full domestic list, used for the "range" statement and SEO coverage. */
export const DOMESTIC_ALL = SERVICE_GROUPS.flatMap((g) => g.items);

export const RANGE_STATEMENT =
  "From changing a socket to PAT testing, rewires and complete installations. No job too big or too small.";
