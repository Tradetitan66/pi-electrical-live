/**
 * ============================================================================
 * OVERLAY HELPERS
 * ----------------------------------------------------------------------------
 * Shared behaviour for the mobile menu and the modal dialog.
 *
 * These were originally duplicated inside each component. That duplication
 * produced a real bug: the "inert everything behind the panel" loop computed
 * the wrong element to skip and ended up marking the DIALOG ITSELF inert, so
 * the panel was displayed but nothing inside it could receive focus. One
 * implementation, used by both, removes the whole class of mistake.
 *
 * Everything here is deliberately framework-free: it takes a DOM node and
 * returns a cleanup function.
 * ============================================================================
 */

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/** Visible, enabled, focusable descendants of `panel`, in tab order. */
export function getFocusable(panel: HTMLElement | null): HTMLElement[] {
  if (!panel) return [];
  return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement,
  );
}

/** Move focus into the panel, preferring the first control over the container. */
export function focusFirstInPanel(panel: HTMLElement | null) {
  if (!panel) return;
  const focusable = getFocusable(panel);
  if (focusable.length > 0) focusable[0].focus();
  else panel.focus();
}

/**
 * Keep Tab and Shift+Tab inside the panel.
 *
 * Wraps at both ends. Also pulls focus back in if it has somehow ended up
 * outside, which is what stops a shift-tab from the first control walking up
 * into the header.
 */
export function trapTab(panel: HTMLElement | null, event: KeyboardEvent) {
  if (event.key !== "Tab") return;

  const focusable = getFocusable(panel);

  if (focusable.length === 0) {
    event.preventDefault();
    panel?.focus();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement as HTMLElement | null;
  const outside = !panel || !panel.contains(active);

  if (event.shiftKey && (active === first || outside)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || outside)) {
    event.preventDefault();
    first.focus();
  }
}

/**
 * Freeze the page behind the panel.
 *
 * `position: fixed` rather than `overflow: hidden` - Safari ignores
 * overflow:hidden on body, which is the usual reason a "locked" overlay still
 * scrolls on iOS. The scrollbar width is compensated on <html> so the page
 * behind does not shift sideways when the scrollbar disappears.
 *
 * Returns an idempotent restore function.
 */
export function lockPageScroll(): () => void {
  const scrollY = window.scrollY;
  const scrollbar = window.innerWidth - document.documentElement.clientWidth;
  const { body, documentElement } = document;

  const prev = {
    position: body.style.position,
    top: body.style.top,
    width: body.style.width,
    overflow: body.style.overflow,
    paddingRight: documentElement.style.paddingRight,
  };

  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.width = "100%";
  body.style.overflow = "hidden";
  if (scrollbar > 0) documentElement.style.paddingRight = `${scrollbar}px`;

  let restored = false;
  return () => {
    if (restored) return;
    restored = true;

    body.style.position = prev.position;
    body.style.top = prev.top;
    body.style.width = prev.width;
    body.style.overflow = prev.overflow;
    documentElement.style.paddingRight = prev.paddingRight;
    window.scrollTo(0, scrollY);
  };
}

/**
 * Make everything behind the panel inert.
 *
 * `inert` is the only reliable way to stop both pointer and keyboard reaching
 * the background while a dialog is open, and it keeps the accessibility tree
 * and the focus tree in agreement - which `aria-hidden` alone does not, since a
 * focusable element inside an aria-hidden subtree is still focusable. That is
 * exactly the bug this site had with the old mobile action bar.
 *
 * The skip test is `child === panel || child.contains(panel)`, so it works
 * whether the panel is a direct child of <body> (the menu) or nested inside a
 * portal container (the modal). Getting this wrong marks the dialog inert too.
 */
export function inertBackground(panel: HTMLElement | null): () => void {
  if (!panel) return () => {};

  const touched: HTMLElement[] = [];

  for (const child of Array.from(document.body.children)) {
    if (!(child instanceof HTMLElement)) continue;
    if (child === panel || child.contains(panel)) continue;
    if (child.hasAttribute("inert")) continue;
    child.setAttribute("inert", "");
    touched.push(child);
  }

  return () => {
    for (const el of touched) el.removeAttribute("inert");
  };
}

/** Convenience: Escape + focus trap wired to <body> for the life of the panel. */
export function bindOverlayKeys(
  panel: HTMLElement | null,
  onEscape: () => void,
): () => void {
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onEscape();
      return;
    }
    trapTab(panel, event);
  };

  document.addEventListener("keydown", onKeyDown);
  return () => document.removeEventListener("keydown", onKeyDown);
}

/**
 * Remember the currently focused element so focus can be handed back on close.
 *
 * Returns the restore function. Call it AFTER `inertBackground`'s cleanup: the
 * trigger usually lives in the page behind, so it is not focusable until the
 * inert attribute has been taken off.
 */
export function captureFocus(): () => void {
  const previous = document.activeElement as HTMLElement | null;
  return () => {
    // The element may have been unmounted while the overlay was open.
    if (previous?.isConnected) previous.focus();
  };
}
