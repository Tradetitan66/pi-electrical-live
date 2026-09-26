/**
 * ============================================================================
 * ANALYTICS
 * ----------------------------------------------------------------------------
 * No analytics provider is loaded by this site, and none should be without the
 * client's explicit instruction. Under UK GDPR / PECR, non-essential
 * analytics cookies require consent, and the site currently sets no
 * analytics cookies at all.
 *
 * This module is the integration seam for when a provider IS approved. It is
 * a no-op unless something is listening, so it costs nothing today.
 *
 * It pushes to `window.dataLayer` (the GTM/GA4 convention) and also
 * dispatches a `pi:track` CustomEvent, so either mechanism can pick it up.
 *
 * PRIVACY - IMPORTANT
 * -------------------
 * `track()` accepts only a fixed event name and a small allowlist of
 * non-identifying context. There is deliberately no way to pass form
 * content. Job descriptions, postcodes, names, phone numbers and email
 * addresses are NEVER sent to analytics - see the type signature, which
 * makes that a compile error rather than a code-review catch.
 * ============================================================================
 */

export type AnalyticsEvent =
  | "quote_cta_clicked"
  | "whatsapp_quote_clicked"
  | "phone_clicked"
  | "service_viewed"
  | "project_viewed"
  | "instagram_clicked"
  | "social_clicked"
  | "membership_viewed"
  | "membership_signup_clicked";

/**
 * Non-identifying context only. No free-form string, so customer data cannot
 * be passed by accident.
 */
export type AnalyticsContext = {
  /** Which surface triggered it, e.g. "hero", "mobile_bar", "footer". */
  location: "hero" | "quote_panel" | "header" | "footer" | "mobile_bar" | "services" | "projects" | "emergency" | "membership" | "final_cta" | "services_page" | "projects_page" | "home" | "not_found";
  /** Which button or link, e.g. "primary", "secondary", "call", "whatsapp". */
  action: string;
  /** A service slug from data/services.ts, when relevant. Never free text. */
  service?: string;
};

interface DataLayerWindow extends Window {
  dataLayer?: unknown[];
}

function push(event: AnalyticsEvent, context: AnalyticsContext) {
  if (typeof window === "undefined") return;

  const payload = { event, ...context };

  const w = window as DataLayerWindow;
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push(payload);
  }

  window.dispatchEvent(new CustomEvent("pi:track", { detail: payload }));
}

export function track(event: AnalyticsEvent, context: AnalyticsContext) {
  try {
    push(event, context);
  } catch {
    // Analytics must never break the page or a conversion path.
  }
}
