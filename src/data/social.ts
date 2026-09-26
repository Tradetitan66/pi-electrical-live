/**
 * ============================================================================
 * SOCIAL PROFILES
 * ----------------------------------------------------------------------------
 * Confirmed by the client. Used in the footer and tracked as a single
 * `instagram_clicked` / generic outbound event with no personal data.
 * ============================================================================
 */

export const SOCIAL = {
  facebook: {
    label: "Facebook",
    href: "https://www.facebook.com/share/1F7XC3RE5D/",
    handle: null,
  },
  instagram: {
    label: "Instagram",
    href: "https://www.instagram.com/pi_electrical_/",
    handle: "@pi_electrical_",
  },
} as const;

export type SocialKey = keyof typeof SOCIAL;
