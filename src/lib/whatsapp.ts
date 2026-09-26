import { BUSINESS } from "@/data/business";

/**
 * ============================================================================
 * WHATSAPP ENQUIRY MODULE
 * ----------------------------------------------------------------------------
 * Deliberately UI-agnostic: pure functions, no React, no DOM. The form builds
 * a structured message, this module formats and encodes it.
 *
 * HOW THE FLOW WORKS (and what it deliberately does NOT do)
 * ---------------------------------------------------------
 * There is no server-side form submission and no database. The visitor fills
 * the form, the message is built in the browser, and WhatsApp opens with the
 * text pre-filled. The customer presses Send themselves, then can attach
 * photos or videos directly inside WhatsApp.
 *
 * Click-to-Chat cannot attach a local file from a wa.me link, so no upload
 * infrastructure exists here. That is intentional, not an omission.
 *
 * Enquiry data is never persisted: it lives in component state only long
 * enough to build the link, and is not sent to analytics.
 * ============================================================================
 */

export type WorkType = "domestic" | "commercial" | "emergency" | "unsure";
export type PreferredContact = "whatsapp" | "phone" | "email";

export interface QuoteFormValues {
  workType: WorkType | null;
  name: string;
  /** Optional - omitted from the message entirely when blank. */
  phone: string;
  postcode: string;
  job: string;
  /** Optional - omitted from the message entirely when blank. */
  preferredContact: PreferredContact | null;
}

export const EMPTY_FORM: QuoteFormValues = {
  workType: null,
  name: "",
  phone: "",
  postcode: "",
  job: "",
  preferredContact: null,
};

export const WORK_TYPE_OPTIONS: ReadonlyArray<{
  value: WorkType;
  label: string;
}> = [
  { value: "domestic", label: "Domestic" },
  { value: "commercial", label: "Commercial" },
  { value: "emergency", label: "Emergency" },
  { value: "unsure", label: "Not sure" },
];

export const WORK_TYPE_LABEL: Record<WorkType, string> = {
  domestic: "Domestic",
  commercial: "Commercial",
  emergency: "Emergency",
  unsure: "Not sure",
};

export const CONTACT_LABEL: Record<PreferredContact, string> = {
  whatsapp: "WhatsApp",
  phone: "Phone",
  email: "Email",
};

/** Collapses whitespace and drops anything empty, so no blank fields appear. */
function clean(value: string | null | undefined): string {
  if (!value) return "";
  return value.replace(/\s+/g, " ").trim();
}

/** `Name: value` lines, skipping any field the visitor left blank. */
function lines(entries: ReadonlyArray<readonly [string, string]>): string {
  return entries
    .map(([label, value]) => {
      const v = clean(value);
      return v ? `${label}: ${v}` : null;
    })
    .filter((line): line is string => line !== null)
    .join("\n");
}

/**
 * Emergency enquiries collapse to the shortest useful format: name, the
 * problem, and where they are. Anything more gets in the way of a customer
 * dealing with an urgent fault.
 */
export function buildEmergencyMessage(values: QuoteFormValues): string {
  const body = lines([
    ["Name", values.name],
    ["Problem", values.job],
    ["Postcode", values.postcode],
    ["Phone", values.phone],
  ]);

  return [
    "Hi PI Electrical, I need help with an urgent electrical problem.",
    "",
    body,
    "",
    "Please contact me when possible.",
  ]
    .filter((part) => part !== "")
    .join("\n");
}

/** The full quote enquiry. */
export function buildQuoteMessage(values: QuoteFormValues): string {
  const type = values.workType
    ? WORK_TYPE_LABEL[values.workType]
    : "";

  const body = lines([
    ["Name", values.name],
    ["Type of work", type],
    ["Job", values.job],
    ["Postcode", values.postcode],
    [
      "Preferred contact",
      values.preferredContact
        ? CONTACT_LABEL[values.preferredContact]
        : "",
    ],
    ["Phone", values.phone],
  ]);

  return [
    "Hi PI Electrical, I'd like a free quote.",
    "",
    body,
    "",
    "Please let me know when you're available. Thanks.",
  ]
    .filter((part) => part !== "")
    .join("\n");
}

/** Picks the correct template from the form's work type. */
export function buildMessage(values: QuoteFormValues): string {
  return values.workType === "emergency"
    ? buildEmergencyMessage(values)
    : buildQuoteMessage(values);
}

/**
 * wa.me takes the number only - no +, spaces, brackets or hyphens.
 * Assembled from BUSINESS so the number is never duplicated.
 */
export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${BUSINESS.phone.whatsapp}?text=${encodeURIComponent(
    message,
  )}`;
}

export function quoteUrl(values: QuoteFormValues): string {
  return buildWhatsAppUrl(buildMessage(values));
}

/**
 * One-tap WhatsApp for contexts with no form - the emergency buttons and the
 * secondary WhatsApp CTAs. Pre-fills a short greeting so the customer only has
 * to add their details.
 */
export function directWhatsAppUrl(kind: "emergency" | "quote" = "quote") {
  const message =
    kind === "emergency"
      ? "Hi PI Electrical, I need help with an urgent electrical problem.\n\nName:\nProblem:\nPostcode:\n\nPlease contact me when possible."
      : "Hi PI Electrical, I'd like to talk about electrical work for my property.\n\nName:\nJob:\nPostcode:\n\nPlease let me know when you're available. Thanks.";

  return buildWhatsAppUrl(message);
}

/** Supporting copy shown in the form panel. */
export const WHATSAPP_HINTS = {
  free: "Free • No obligation • Sent directly to Paul",
  attach:
    "Attach photos in WhatsApp after sending.",
  copyFallback:
    "WhatsApp could not be opened. You can call Paul on 07445 846762 or copy your enquiry below.",
  copyLabel: "Copy message",
  copied: "Copied",
  voicemail:
    "Can't get through? Please leave a voicemail and Paul will get back to you.",
  whatsappHint: "Paul replies when available.",
} as const;
