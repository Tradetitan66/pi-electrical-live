import Image from "next/image";
import { cx } from "@/lib/cx";
import type { MediaSlotConfig } from "@/data/media";

/**
 * Renders a real photograph when one is configured, or a labelled placeholder
 * when it is not.
 *
 * The placeholder is a designed surface, not a broken image: it holds the same
 * aspect ratio as the real asset, so swapping a photo in causes no layout
 * shift, and it names exactly which photograph is needed.
 */
export default function MediaSlot({
  slot,
  className,
  imgClassName,
  tone = "light",
  priority,
  sizes,
}: {
  slot: MediaSlotConfig;
  className?: string;
  imgClassName?: string;
  tone?: "light" | "dark";
  priority?: boolean;
  sizes?: string;
}) {
  const dark = tone === "dark";
  const isReal = Boolean(slot.src);

  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-lg",
        dark ? "bg-charcoal" : "bg-surface",
        className,
      )}
      style={{ aspectRatio: slot.ratio }}
    >
      {isReal ? (
        <Image
          src={slot.src as string}
          alt={slot.alt}
          fill
          className={cx("object-cover", imgClassName)}
          style={slot.position ? { objectPosition: slot.position } : undefined}
          sizes={sizes ?? slot.sizes}
          priority={priority ?? slot.priority}
          quality={75}
        />
      ) : (
        <div
          className={cx(
            "absolute inset-0 flex flex-col justify-end gap-2 p-4 sm:p-5",
            "border border-dashed",
            dark ? "border-white/15" : "border-line",
          )}
        >
          <span
            aria-hidden="true"
            className={cx(
              "absolute right-4 top-4 h-2 w-2 rounded-full",
              dark ? "bg-green/50" : "bg-green/50",
            )}
          />
          <span
            className={cx(
              "eyebrow leading-snug",
              dark ? "text-green/70" : "text-green-ink/60",
            )}
          >
            Photo slot
          </span>
          <span
            className={cx(
              "text-sm leading-snug",
              dark ? "text-muted-dark" : "text-muted",
            )}
          >
            {slot.needs}
          </span>
        </div>
      )}
    </div>
  );
}
