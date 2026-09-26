/**
 * Primary navigation.
 *
 * Home / Services / Projects & About only. Contact is deliberately NOT a page -
 * phone and WhatsApp are available from CTAs on every screen instead.
 * The maintenance membership is a utility route, linked from the services page
 * and the footer rather than the main nav, so the three-page architecture
 * stays intact.
 */
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Projects & About", href: "/projects-about" },
] as const;
