import { cx } from "@/lib/cx";

/**
 * Shared sub-page banner.
 *
 * One component for all three content pages so the top of every page has the
 * same rhythm: green eyebrow rule, oversized heading, one supporting paragraph.
 * The heading is a real <h1> on every page, which is what the SEO and
 * accessibility checks both look for.
 */
export default function PageBanner({
  eyebrow,
  title,
  intro,
  meta,
  children,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  /** Small supporting facts rendered under the intro, e.g. coverage or hours. */
  meta?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-labelledby="page-heading"
      className={cx(
        "relative overflow-hidden border-b border-line pt-header",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(21,24,22,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(21,24,22,0.05) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 80% 100% at 20% 0%, black, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 100% at 20% 0%, black, transparent 70%)",
        }}
      />

      <div className="shell py-12 sm:py-16 lg:py-20">
        <p className="hero-enter hero-enter-1 eyebrow flex items-center gap-2.5 text-green-ink">
          <span aria-hidden="true" className="h-px w-6 bg-green-ink/40" />
          {eyebrow}
        </p>

        <h1
          id="page-heading"
          className="hero-enter hero-enter-2 mt-6 max-w-[24ch] text-display-lg text-ink"
        >
          {title}
        </h1>

        {intro ? (
          <p className="hero-enter hero-enter-3 mt-6 max-w-[58ch] text-lg leading-relaxed text-muted sm:text-xl">
            {intro}
          </p>
        ) : null}

        {meta ? (
          <div className="hero-enter hero-enter-4 mt-7">{meta}</div>
        ) : null}

        {children ? (
          <div className="hero-enter hero-enter-5 mt-9">{children}</div>
        ) : null}
      </div>
    </section>
  );
}
