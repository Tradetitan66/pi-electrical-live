/**
 * ============================================================================
 * IN-PAGE ANCHORS
 * ----------------------------------------------------------------------------
 * One place that knows which routes render which section, so a link to a
 * section is never a guess.
 *
 * A bare fragment such as `#quote` resolves against the CURRENT url, not the
 * site root. That makes it silently inert on any route that does not render
 * the section - no error, no navigation, the link just does nothing. The
 * mobile action bar and the mobile menu are global, so their quote buttons
 * were dead on /privacy, /maintenance-membership and every 404.
 *
 * The rule is data, not per-call-site judgement: list the routes that render
 * each target and let anchorHref() choose between a same-page jump and a
 * cross-page one.
 *
 * Adding a route that renders FinalCta or AreasBand means adding one line here.
 * ============================================================================
 */

export const QUOTE_ANCHOR = "quote";
export const AREAS_ANCHOR = "areas";

/** Routes rendering <FinalCta id="quote">. */
const QUOTE_ROUTES = ["/", "/services", "/projects-about"];

/** Routes rendering <AreasBand id="areas">. */
const AREAS_ROUTES = ["/"];

const LOCAL_ROUTES: Record<string, string[]> = {
  [QUOTE_ANCHOR]: QUOTE_ROUTES,
  [AREAS_ANCHOR]: AREAS_ROUTES,
};

/**
 * `href` for a link to `#id` that works from `pathname`.
 *
 * Returns a bare fragment when the target is on the current page, so the jump
 * stays in-page with no navigation, and an absolute path when it is not.
 */
export function anchorHref(id: string, pathname: string): string {
  const routes = LOCAL_ROUTES[id];
  return routes?.includes(pathname) ? `#${id}` : `/#${id}`;
}

/** True when `#id` exists on `pathname`, i.e. no navigation is needed. */
export function anchorIsLocal(id: string, pathname: string): boolean {
  return anchorHref(id, pathname).startsWith("#");
}
