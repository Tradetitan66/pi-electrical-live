"use client";

import { useCallback, useState } from "react";
import Modal from "./Modal";
import WhatsAppQuoteForm from "./WhatsAppQuoteForm";
import Button from "./Button";
import { cx } from "@/lib/cx";

/**
 * Quote CTA that opens the form in a modal.
 *
 * Used on the services page. The form is a shared component, so the modal path
 * and the inline path produce an identical WhatsApp message.
 *
 * Accessibility is handled by <Modal>: focus moves in, is trapped, Escape and
 * the backdrop close it, the background is inert, body scroll is locked, and
 * focus returns to the button that opened it.
 */
export default function QuoteModal({
  label = "Get a free quote",
  size = "lg",
  variant = "primary",
  className,
  mode = "quote",
  includeCallRow = true,
}: {
  label?: string;
  size?: "md" | "lg";
  variant?: "primary" | "outline";
  className?: string;
  mode?: "quote" | "emergency";
  includeCallRow?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <Button
        size={size}
        variant={variant}
        className={className}
        onClick={() => setOpen(true)}
        arrow
        analyticsEvent="quote_cta_clicked"
        analyticsLocation="quote_panel"
        analyticsAction="quote_modal_open"
      >
        {label}
      </Button>

      {open ? (
        <Modal
          open={open}
          onClose={close}
          labelledBy="quote-modal-title"
          panelClassName="max-w-2xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow flex items-center gap-2.5 text-foreground">
                <span aria-hidden="true" className="h-px w-6 bg-[#555555]/40" />
                Free, no obligation
              </p>
              <h2
                id="quote-modal-title"
                className="mt-4 text-display-sm text-ink"
              >
                {mode === "emergency"
                  ? "Send your emergency details"
                  : "Tell us what you need"}
              </h2>
              <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted">
                WhatsApp opens with your details ready to send. Nothing is
                stored and there is no account to create.
              </p>
            </div>

            <button
              type="button"
              onClick={close}
              className={cx(
                "-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
                "text-2xl leading-none text-muted transition-colors hover:text-ink",
              )}
            >
              <span aria-hidden="true">×</span>
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div className="mt-7">
            <WhatsAppQuoteForm mode={mode} onSent={close} />
          </div>

          {includeCallRow ? <CallRow /> : null}
        </Modal>
      ) : null}
    </>
  );
}

function CallRow() {
  return (
    <div className="mt-6 flex flex-col items-center gap-2 border-t border-line pt-5 text-center">
      <p className="text-sm text-muted">Prefer to talk it through?</p>
      <p className="text-sm text-muted">
        Can&apos;t get through? Please leave a voicemail and Paul will get back
        to you.
      </p>
    </div>
  );
}
