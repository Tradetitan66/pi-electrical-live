/**
 * ============================================================================
 * SCROLL TO ANCHOR
 * ----------------------------------------------------------------------------
 * A native jump to `#id` is silently dropped while an overlay scroll-lock is
 * in force, because lockPageScroll() sets `body { position: fixed }` and a
 * fixed body leaves the document with no scroll range to move within.
 *
 * That is why an in-page link inside the mobile menu appeared to do nothing:
 * the browser attempted the jump, had nowhere to go, and then the lock's own
 * cleanup rewound the viewport. This module performs the jump itself, and
 * waits for the lock to lift if it is still holding the page.
 *
 * Framework-free and DOM-only, like lib/overlay.ts.
 * ============================================================================
 */

/** An overlay scroll-lock is active: body is pinned and cannot scroll. */
function scrollIsLocked(): boolean {
  return getComputedStyle(document.body).position === "fixed";
}

/** Run `run` on the first frame where no overlay scroll-lock is active. */
export function whenScrollUnlocked(run: () => void, attempts = 30): void {
  if (attempts <= 0 || !scrollIsLocked()) {
    run();
    return;
  }
  requestAnimationFrame(() => whenScrollUnlocked(run, attempts - 1));
}

/**
 * Scroll `#id` into view, retrying while a scroll-lock blocks it.
 *
 * Returns whether the target exists. A missing target is a normal outcome on
 * routes that do not render the section, and the caller is expected to fall
 * back to a cross-page navigation rather than treat it as an error.
 */
export function scrollToAnchor(id: string, attempts = 10): boolean {
  const target = document.getElementById(id);
  if (!target) return false;

  target.scrollIntoView();

  /* The first attempt is dropped if the lock is still up, so keep trying
     until the page can actually move. */
  if (scrollIsLocked() && attempts > 0) {
    requestAnimationFrame(() => scrollToAnchor(id, attempts - 1));
  }

  return true;
}
