"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cx } from "@/lib/cx";
import {
  bindOverlayKeys,
  captureFocus,
  focusFirstInPanel,
  inertBackground,
  lockPageScroll,
} from "@/lib/overlay";

/**
 * Accessible dialog primitive.
 *
 * Fixes the failure modes the previous implementation had:
 *  - focus trap: Tab is constrained to the dialog, so it cannot escape into
 *    the page behind while `aria-modal` tells AT that background is hidden
 *  - initial focus: focus moves INTO the dialog on open, so a screen-reader
 *    user gets confirmation that something opened
 *  - focus restoration: focus returns to the triggering element on close
 *  - `inert` on the background: keyboard and pointer both ignore it, so the
 *    accessible tree and the focus tree can never disagree
 *  - iOS-safe scroll lock: `position: fixed` rather than `overflow: hidden`,
 *    which Safari ignores
 *  - scrollbar compensation: prevents the whole page shifting sideways on
 *    desktop when the scrollbar disappears
 *
 * The behaviour itself lives in `@/lib/overlay`, shared with the mobile menu.
 */

/**
 * "Have we hydrated yet?", without a setState-in-effect.
 *
 * The portal can only be created in the browser, but the server must not
 * render it or hydration mismatches. useSyncExternalStore with an empty
 * subscribe and a server snapshot of `false` is the supported way to express
 * exactly that, and unlike a mount effect it does not schedule a second render.
 */
const neverChanges = () => () => {};
function useHydrated() {
  return useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  );
}

export default function Modal({
  open,
  onClose,
  labelledBy,
  children,
  className,
  panelClassName,
}: {
  open: boolean;
  onClose: () => void;
  /** id of the element that names the dialog. */
  labelledBy: string;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
}) {
  const hydrated = useHydrated();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const restoreFocus = captureFocus();
    const unlockScroll = lockPageScroll();
    const uninert = inertBackground(panelRef.current);
    const unbindKeys = bindOverlayKeys(panelRef.current, onClose);

    /* Defer, so focus lands after the dialog has been painted. */
    const focusFirst = window.setTimeout(() => {
      focusFirstInPanel(panelRef.current);
    }, 20);

    return () => {
      window.clearTimeout(focusFirst);
      unbindKeys();
      uninert();
      unlockScroll();
      restoreFocus();
    };
  }, [open, onClose]);

  if (!hydrated || !open) return null;

  const dialog = (
    <div className={cx("fixed inset-0 z-[80] flex", className)}>
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/85 backdrop-blur-sm motion-safe:animate-[pi-fade_0.2s_ease-out]"
        tabIndex={-1}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={cx(
          "relative m-auto max-h-[92dvh] w-full max-w-4xl overflow-y-auto overscroll-contain",
          "rounded-[2px] bg-warm p-5 shadow-2xl sm:p-8",
          panelClassName,
        )}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
