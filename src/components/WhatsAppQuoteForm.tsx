"use client";

import {
  useCallback,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/cx";
import { BUSINESS } from "@/data/business";
import {
  EMPTY_FORM,
  WORK_TYPE_OPTIONS,
  buildMessage,
  buildWhatsAppUrl,
  type QuoteFormValues,
  type PreferredContact,
  type WorkType,
} from "@/lib/whatsapp";

/**
 * ============================================================================
 * QUOTE ENQUIRY FORM
 * ----------------------------------------------------------------------------
 * The primary conversion path, built around WhatsApp rather than a server form.
 *
 * WHY WHATSAPP AND NOT A BACKEND
 * There is no server, database or email handler anywhere in this project. The
 * visitor fills the form, the message is built in the browser, and WhatsApp
 * opens with the text pre-filled. Paul receives it on the number he already
 * uses for calls, and the customer attaches photos inside WhatsApp where they
 * can actually be seen on a phone. This also avoids storing anyone's details
 * and avoids a spam honeypot.
 *
 * ACCESSIBILITY NOTES
 *  - One <form> with a real <fieldset>/<legend> radio group, not a div grid of
 *    clickable spans, so the four work types are announced as one question
 *  - Every input has a persistent visible <label>; placeholders are never used
 *    as labels
 *  - Errors are wired with aria-describedby + aria-invalid, summarised in a
 *    role="alert" region, and focus moves to the first invalid field
 *  - The WhatsApp failure fallback is a live region, so a screen-reader user is
 *    told when the app did not open rather than silently losing their message
 *  - Nothing is persisted: no localStorage, no sessionStorage, no cookies
 *
 * PRIVACY
 *  - No field content is ever passed to analytics - the type signature in
 *    lib/analytics.ts makes that a compile error, not a review catch
 *  - Nothing leaves the browser except the message the visitor chose to send
 * ============================================================================
 */

type Errors = Partial<Record<keyof QuoteFormValues, string>>;
type Status = "idle" | "sent" | "fallback";

/** Permissive UK postcode check: outward + optional inward, spaces optional. */
const POSTCODE_RE = /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d?[A-Za-z]{0,2}$/;

function validate(values: QuoteFormValues, mode: Mode): Errors {
  const errors: Errors = {};

  if (mode !== "emergency" && !values.workType) {
    errors.workType = "Please choose the closest match for the type of work.";
  }

  if (values.name.trim().length < 2) {
    errors.name = "Please enter your name so Paul knows who is enquiring.";
  }

  if (values.job.trim().length < 5) {
    errors.job = "Please describe the job in a few words.";
  }

  if (!values.postcode.trim()) {
    errors.postcode = "Please enter your postcode - it tells us if we cover you.";
  } else if (!POSTCODE_RE.test(values.postcode.trim())) {
    errors.postcode = "That doesn't look like a UK postcode. Check it and try again.";
  }

  // Phone is optional, but if supplied it must be dialable.
  if (values.phone.trim()) {
    const digits = values.phone.replace(/\D/g, "");
    if (digits.length < 7) {
      errors.phone = "Please enter a full phone number, or leave this blank.";
    }
  }

  return errors;
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy path below.
  }

  const holder = document.createElement("textarea");
  holder.value = text;
  holder.setAttribute("readonly", "");
  holder.style.position = "fixed";
  holder.style.top = "0";
  holder.style.left = "0";
  holder.style.opacity = "0";
  document.body.appendChild(holder);
  holder.select();

  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(holder);
  return ok;
}

export type Mode = "quote" | "emergency";

const FIELD =
  "w-full min-h-12 rounded-lg border bg-white px-3.5 text-[0.9375rem] text-ink placeholder:text-muted/70 transition-colors";

export default function WhatsAppQuoteForm({
  mode = "quote",
  className,
  onSent,
}: {
  mode?: Mode;
  className?: string;
  onSent?: () => void;
}) {
  const uid = useId();
  const [values, setValues] = useState<QuoteFormValues>({
    ...EMPTY_FORM,
    workType: "domestic" as WorkType,
    preferredContact: "whatsapp" as PreferredContact,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const emergency = mode === "emergency";

  const errorList = Object.values(errors).filter(Boolean) as string[];

  const set = useCallback(
    <K extends keyof QuoteFormValues>(key: K, value: QuoteFormValues[K]) => {
      setValues((current) => ({ ...current, [key]: value }));
      // Clear a field's error as soon as it is edited, so the visitor is not
      // told something is wrong about a value they have already fixed.
      setErrors((current) => {
        if (!current[key]) return current;
        const next = { ...current };
        delete next[key];
        return next;
      });
    },
    [],
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = validate(values, mode);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      const firstKey = (
        [
          "workType",
          "name",
          "job",
          "postcode",
          "phone",
        ] as const
      ).find((key) => found[key]);

      if (firstKey) {
        const target = formRef.current?.querySelector<HTMLElement>(
          `[name="${firstKey}"]`,
        );
        target?.focus();
      }
      return;
    }

    const message = buildMessage(values);
    const url = buildWhatsAppUrl(message);

    track("whatsapp_quote_clicked", {
      location: "quote_panel",
      action: emergency ? "form_emergency" : "form_quote",
      ...(values.workType && !emergency ? { service: values.workType } : {}),
    });

    const win = window.open(url, "_blank", "noopener,noreferrer");

    if (win) {
      setStatus("sent");
      onSent?.();
      return;
    }

    // Popup blocked. Fall back to showing the message in-page rather than
    // letting the visitor think their enquiry was sent.
    setStatus("fallback");
    window.setTimeout(() => {
      if (messageRef.current) {
        messageRef.current.focus();
        messageRef.current.select();
      }
    }, 60);
  };

  const onCopy = async () => {
    const ok = await copyText(buildMessage(values));
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    }
  };

  const fieldClass = (key: keyof QuoteFormValues) =>
    cx(
      FIELD,
      errors[key]
        ? "border-red-600 bg-red-50"
        : "border-line hover:border-muted focus-within:border-green-ink",
    );

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className={cx("flex flex-col gap-5", className)}
    >
      {/*
        Error summary. role="alert" so it is announced the moment it appears,
        and aria-live because it can also be read after the fact.
      */}
      <div aria-live="assertive">
        {errorList.length > 0 ? (
          <div
            role="alert"
            className="rounded-[2px] border-l-4 border-red-600 bg-red-50 px-4 py-3"
          >
            <p className="text-sm font-bold text-red-900">
              {errorList.length === 1
                ? "One field needs attention"
                : `${errorList.length} fields need attention`}
            </p>
            <ul className="mt-1.5 flex list-disc flex-col gap-1 pl-5 text-sm text-red-900/90">
              {errorList.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Work type                                                           */}
      {/* ---------------------------------------------------------------- */}
      {!emergency ? (
        <fieldset
          aria-describedby={errors.workType ? `${uid}-workType-err` : undefined}
        >
          <legend className="mb-2 text-sm font-semibold text-ink">
            What kind of work is it?
          </legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {WORK_TYPE_OPTIONS.map((option) => {
              const active = values.workType === option.value;
              return (
                <label
                  key={option.value}
                  className={cx(
                    "relative flex min-h-12 cursor-pointer items-center justify-center rounded-lg border px-2 text-center text-sm font-semibold transition-colors",
                    errors.workType ? "border-red-600" : "border-line",
                    active
                      ? "border-green-ink bg-green text-black"
                      : "bg-white text-ink hover:border-muted",
                  )}
                >
                  <input
                    type="radio"
                    name="workType"
                    value={option.value}
                    checked={active}
                    onChange={() => set("workType", option.value as WorkType)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
          {errors.workType ? (
            <p
              id={`${uid}-workType-err`}
              className="mt-2 text-sm font-medium text-red-700"
            >
              {errors.workType}
            </p>
          ) : null}
        </fieldset>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Name                                                                */}
      {/* ---------------------------------------------------------------- */}
      <div>
        <label
          htmlFor={`${uid}-name`}
          className="mb-2 block text-sm font-semibold text-ink"
        >
          Your name{" "}
          <span className="font-normal text-muted">(required)</span>
        </label>
        <input
          id={`${uid}-name`}
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? `${uid}-name-err` : undefined}
          className={fieldClass("name")}
        />
        {errors.name ? (
          <p id={`${uid}-name-err`} className="mt-2 text-sm font-medium text-red-700">
            {errors.name}
          </p>
        ) : null}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Job                                                                 */}
      {/* ---------------------------------------------------------------- */}
      <div>
        <label
          htmlFor={`${uid}-job`}
          className="mb-2 block text-sm font-semibold text-ink"
        >
          {emergency ? "What is the problem?" : "What do you need done?"}{" "}
          <span className="font-normal text-muted">(required)</span>
        </label>
        <textarea
          id={`${uid}-job`}
          name="job"
          rows={emergency ? 3 : 4}
          value={values.job}
          onChange={(e) => set("job", e.target.value)}
          aria-invalid={errors.job ? true : undefined}
          aria-describedby={cx(
            `${uid}-job-hint`,
            errors.job ? ` ${uid}-job-err` : undefined,
          )}
          className={cx(fieldClass("job"), "py-3 leading-relaxed")}
        />
        <p id={`${uid}-job-hint`} className="mt-2 text-sm text-muted">
          A sentence or two is plenty. You can add photos once WhatsApp opens.
        </p>
        {errors.job ? (
          <p id={`${uid}-job-err`} className="mt-1 text-sm font-medium text-red-700">
            {errors.job}
          </p>
        ) : null}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Postcode                                                            */}
      {/* ---------------------------------------------------------------- */}
      <div>
        <label
          htmlFor={`${uid}-postcode`}
          className="mb-2 block text-sm font-semibold text-ink"
        >
          Postcode{" "}
          <span className="font-normal text-muted">(required)</span>
        </label>
        <input
          id={`${uid}-postcode`}
          name="postcode"
          type="text"
          inputMode="text"
          autoComplete="postal-code"
          autoCapitalize="characters"
          spellCheck={false}
          value={values.postcode}
          onChange={(e) => set("postcode", e.target.value)}
          aria-invalid={errors.postcode ? true : undefined}
          aria-describedby={cx(
            `${uid}-postcode-hint`,
            errors.postcode ? ` ${uid}-postcode-err` : undefined,
          )}
          className={cx(fieldClass("postcode"), "max-w-[13rem] uppercase")}
        />
        <p id={`${uid}-postcode-hint`} className="mt-2 text-sm text-muted">
          Checks we cover your area before you wait for a reply.
        </p>
        {errors.postcode ? (
          <p
            id={`${uid}-postcode-err`}
            className="mt-1 text-sm font-medium text-red-700"
          >
            {errors.postcode}
          </p>
        ) : null}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Phone + preferred contact                                           */}
      {/* ---------------------------------------------------------------- */}
      <div className={cx("grid gap-5", !emergency && "sm:grid-cols-2")}>
        <div>
          <label
            htmlFor={`${uid}-phone`}
            className="mb-2 block text-sm font-semibold text-ink"
          >
            Phone{" "}
            <span className="font-normal text-muted">
              {emergency ? "(required)" : "(optional)"}
            </span>
          </label>
          <input
            id={`${uid}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
            className={fieldClass("phone")}
          />
          {errors.phone ? (
            <p
              id={`${uid}-phone-err`}
              className="mt-2 text-sm font-medium text-red-700"
            >
              {errors.phone}
            </p>
          ) : null}
        </div>

        {!emergency ? (
          <div>
            <label
              htmlFor={`${uid}-contact`}
              className="mb-2 block text-sm font-semibold text-ink"
            >
              How should Paul reply?
            </label>
            <select
              id={`${uid}-contact`}
              name="preferredContact"
              value={values.preferredContact ?? "whatsapp"}
              onChange={(e) =>
                set("preferredContact", e.target.value as PreferredContact)
              }
              className={cx(
                fieldClass("preferredContact"),
                "appearance-none bg-[length:1rem] bg-[right_0.9rem_center] bg-no-repeat pr-10",
              )}
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%23626963' stroke-width='1.75' stroke-linecap='round'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E\")",
              }}
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="phone">A phone call</option>
            </select>
          </div>
        ) : null}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Submit                                                             */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-col gap-3 pt-1">
        <button
          type="submit"
          className={cx(
            "flex min-h-14 w-full items-center justify-center gap-2.5 rounded-lg px-6",
            "text-[0.9375rem] font-bold tracking-[0.02em] text-black transition-colors",
            "bg-green hover:bg-green-strong",
          )}
        >
          <span>
            {emergency
              ? "Send my details on WhatsApp"
              : "Get my free quote on WhatsApp"}
          </span>
          <span aria-hidden="true">→</span>
        </button>

        <p className="text-center text-xs leading-relaxed text-muted">
          Free, no obligation, sent straight to {BUSINESS.owner}. You can attach
          photos inside WhatsApp after sending.
        </p>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Status + copy fallback                                            */}
      {/* ---------------------------------------------------------------- */}
      <div aria-live="polite">
        {status === "sent" ? (
          <p className="rounded-[2px] border-l-4 border-green-ink bg-surface px-4 py-3 text-sm text-ink">
            WhatsApp should now be open with your message. Press send in
            WhatsApp, and attach any photos there. If nothing opened, call{" "}
            <a
              href={BUSINESS.phone.href}
              className="font-semibold text-green-ink underline underline-offset-2"
            >
              {BUSINESS.phone.display}
            </a>
            .
          </p>
        ) : null}

        {status === "fallback" ? (
          <div className="rounded-[2px] border-l-4 border-amber-600 bg-amber-50 px-4 py-3">
            <p className="text-sm font-semibold text-ink">
              WhatsApp could not be opened automatically
            </p>
            <p className="mt-1 text-sm text-ink/85">
              Copy the message below into WhatsApp, or call{" "}
              <a
                href={BUSINESS.phone.href}
                className="font-semibold text-green-ink underline underline-offset-2"
              >
                {BUSINESS.phone.display}
              </a>
              .
            </p>

            <label htmlFor={`${uid}-fallback`} className="sr-only">
              Your enquiry message, ready to copy
            </label>
            <textarea
              id={`${uid}-fallback`}
              ref={messageRef}
              readOnly
              rows={8}
              value={buildMessage(values)}
              className={cx(FIELD, "mt-3 py-3 font-mono text-sm")}
            />

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onCopy}
                className="min-h-11 rounded-lg bg-black px-4 text-sm font-semibold text-white"
              >
                {copied ? "Copied ✓" : "Copy message"}
              </button>
              <a
                href={BUSINESS.phone.href}
                className="inline-flex min-h-11 items-center rounded-lg border border-line px-4 text-sm font-semibold text-ink"
              >
                Call {BUSINESS.owner}
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}
