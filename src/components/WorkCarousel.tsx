"use client";

import Image from "next/image";
import { useAutoAdvance, ALL_WIDTHS } from "@/lib/auto-advance";
import { cx } from "@/lib/cx";
import SectionHeading from "./SectionHeading";
import { WORK_GALLERY } from "@/data/media";

/**
 * ============================================================================
 * WORK CAROUSEL
 * ----------------------------------------------------------------------------
 * Six photographs of completed work, directly below the hero, advancing itself
 * one slide at a time.
 *
 * ---------------------------------------------------------------------------
 * WHY IT ADVANCES ON DESKTOP TOO, WHEN QUICKACTIONS DOES NOT
 * ---------------------------------------------------------------------------
 * QuickActions stops at sm, because from sm up it is a multi-column grid with
 * every tile already visible - there is nothing to advance. This is a real
 * scroller at every width, showing one slide at a time, so it is passed
 * ALL_WIDTHS. A carousel that moves on a phone and sits frozen at 1280px, next
 * to a phone that is visibly cycling, reads as broken.
 *
 * ---------------------------------------------------------------------------
 * THE DOTS ARE REAL BUTTONS HERE, AND SO ARE THE ARROWS
 * ---------------------------------------------------------------------------
 * The QuickActions indicators are `aria-hidden` and deliberately inert, which
 * is right for decorative tiles that are all already reachable by scrolling.
 * These are not: with six slides at one per view, the dots and the arrows are
 * the only affordance for jumping straight to slide 5. So they are <button>s
 * carrying aria-current, and the dot list is a labelled group.
 *
 * The arrows wrap rather than disabling at the ends, so a visitor who reaches
 * slide 1 and presses back gets the last photograph instead of a control that
 * does nothing - which is also what the auto-advance loop itself does.
 * ---------------------------------------------------------------------------
 * ALT TEXT IS CURRENTLY TODO
 * ---------------------------------------------------------------------------
 * Every entry in WORK_GALLERY still carries a `TODO(alt)` description. See the
 * warning in data/media.ts. Until those are written the images are effectively
 * invisible to a screen reader, which is why they are marked rather than
 * silently empty.
 * ============================================================================
 */

/** 3.5s x 6 = a 21s loop, tighter than the 4s QuickActions uses for its five. */
const INTERVAL_MS = 3500;

export default function WorkCarousel() {
  const { ref, index, goTo, next, prev, stop } = useAutoAdvance<HTMLUListElement>({
    count: WORK_GALLERY.length,
    interval: INTERVAL_MS,
    maxWidth: ALL_WIDTHS,
    loop: true,
  });

  return (
    <section
      aria-labelledby="work-heading"
      className="border-b border-line bg-warm"
    >
      <div className="shell py-16 sm:py-24">
<SectionHeading
  id="work-heading"
  eyebrow="Recent work"
  title="Electrical work across homes & businesses"
  intro="A selection of recent projects completed across Edinburgh, the Lothians and Fife."
  className="mb-10"
/>

        {/*
          The scroller. Same interaction contract as QuickActions: any pointer,
          touch, focus, wheel or key event means the visitor has taken over, so
          the loop stops permanently and never resumes. See lib/auto-advance.ts
          for why that is a stop rather than a pause.
        */}
        <ul
          ref={ref}
          data-work-carousel
          onPointerDown={stop}
          onTouchStart={stop}
          onFocus={stop}
          onWheel={stop}
          onKeyDown={stop}
          className={cx(
            "-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto",
            "px-5 pb-2 sm:-mx-6 sm:px-6",
          )}
        >
          {WORK_GALLERY.map((image, i) => (
            <li
              key={image.src}
              data-work-slide
              data-active={i === index ? "true" : undefined}
              /* One slide per view on a phone, two on a tablet and up, with the
                 basis being w-4/5 against a px-5 gutter, so 92vw of frame inside
                 the shell.

                 A looping runway (two extra slides at the tail) gives the arrows
                 enough room to step every photo into the start edge rather than
                 skipping it - see lib/auto-advance.ts, which corrects position
                 across the runway. */
              className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[38vw]"
            >
              <div
                className={cx(
                  "relative overflow-hidden rounded-lg bg-surface",
                  "shadow-[0_2px_0_0_rgba(21,24,22,0.08)]",
                )}
                style={{ aspectRatio: "4 / 5" }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  /* object-cover does the cropping: work-01 is landscape and
                     the frame is portrait, so it loses most of its width. */
                  className="object-cover"
                  style={
                    image.position
                      ? { objectPosition: image.position }
                      : undefined
                  }
                  sizes={image.sizes}
                  /* Never priority. This sits below the fold on every
                     viewport, and a priority image here would compete with the
                     hero for the LCP slot. */
                  quality={75}
                />
              </div>
            </li>
          ))}

          {/*
            Looping runway: two copies of the first photographs at the tail, so
            the arrows can step continuously past slide 6 and come back to
            slide 1 without grinding to a dead end. These are hidden from
            assistive tech because they are identical to the originals; the
            visitor sees the same photo as the loop turns over.
          */}
          {WORK_GALLERY.slice(0, 2).map((image) => (
            <li
              key={image.src + "-runway"}
              data-work-slide
              data-runway="true"
              aria-hidden="true"
              className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[38vw]"
            >
              <div
                className={cx(
                  "relative overflow-hidden rounded-lg bg-surface",
                  "shadow-[0_2px_0_0_rgba(21,24,22,0.08)]",
                )}
                style={{ aspectRatio: "4 / 5" }}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  className="object-cover"
                  quality={75}
                  style={{ objectPosition: "center 20%" }}
                  sizes={image.sizes}
                />
              </div>
            </li>
          ))}
        </ul>

        {/*
          Controls: arrows either side of the position dots.

          The arrows are buttons, not decoration, and they are labelled with the
          destination rather than the glyph. Neither can ever be disabled,
          because the strip wraps: "previous" from the first slide is the last
          one, and "next" from the last is the first. A dead arrow at either end
          would imply a hard stop that does not exist.

          They deliberately do NOT stop the auto-advance loop, the same as the
          dots: pressing an arrow is deliberate navigation, not the visitor
          grabbing the strip mid-slide. They also sit outside the <ul>, so
          pressing one does not trip the stop handlers wired to the slides.
        */}
        <div className="mt-6 flex items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            data-work-prev
            onClick={prev}
            aria-label="Previous photograph"
            className={cx(
              "grid h-11 w-11 shrink-0 place-items-center rounded-full",
              "border border-line bg-white text-lg leading-none text-ink",
              "transition-colors duration-200",
              "hover:border-black hover:bg-black hover:text-white",
              "active:bg-black active:text-white",
            )}
          >
            <span aria-hidden="true">←</span>
          </button>

          {/*
            Indicator buttons. Labelled as a group so the count is announced, and
            each carries an explicit target rather than a bare position, since
            the positions alone ("3") mean nothing out of context.
          */}
          <div
            role="group"
            aria-label={`Choose a photograph, ${WORK_GALLERY.length} in total`}
            data-work-dots
            className="flex items-center justify-center gap-2"
          >
            {WORK_GALLERY.map((image, dot) => (
              <button
                key={image.src}
                type="button"
                data-work-dot
                data-active={dot === index ? "true" : undefined}
                aria-current={dot === index ? "true" : undefined}
                aria-label={`Photograph ${dot + 1} of ${WORK_GALLERY.length}`}
                onClick={() => goTo(dot)}
                className={cx(
                  "rounded-full p-1 transition-all duration-300",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cx(
                    "block rounded-full transition-all duration-300",
                    dot === index
                      ? "h-1.5 w-5 bg-[#2a2a2a]"
                      : "h-1.5 w-1.5 bg-white/25",
                  )}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            data-work-next
            onClick={next}
            aria-label="Next photograph"
            className={cx(
              "grid h-11 w-11 shrink-0 place-items-center rounded-full",
              "border border-line bg-white text-lg leading-none text-ink",
              "transition-colors duration-200",
              "hover:border-black hover:bg-black hover:text-white",
              "active:bg-black active:text-white",
            )}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
