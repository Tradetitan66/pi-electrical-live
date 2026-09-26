import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Editorial section header: a small green eyebrow, an oversized heading, and
 * an optional intro. The green is limited to the eyebrow so the heading stays
 * the loudest thing in the section.
 */
export default function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  tone = "light",
  align = "left",
  className,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Heading element id, so the parent <section> can point aria-labelledby at it. */
  id: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}) {
  const dark = tone === "dark";

  return (
    <div
      className={cx(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <p
        className={cx(
          "eyebrow flex items-center gap-2.5",
          dark ? "text-green" : "text-green-ink",
        )}
      >
        <span
          aria-hidden="true"
          className={cx(
            "h-px w-6",
            dark ? "bg-green/60" : "bg-green-ink/40",
          )}
        />
        {eyebrow}
      </p>

      <h2
        id={id}
        className={cx(
          "text-display-lg max-w-[22ch]",
          dark ? "text-white" : "text-ink",
          align === "center" && "max-w-[24ch]",
        )}
      >
        {title}
      </h2>

      {intro ? (
        <p
          className={cx(
            "max-w-[58ch] text-base leading-relaxed sm:text-lg",
            dark ? "text-muted-dark" : "text-muted",
          )}
        >
          {intro}
        </p>
      ) : null}

      {children}
    </div>
  );
}
