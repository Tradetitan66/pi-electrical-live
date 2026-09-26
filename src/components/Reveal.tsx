"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Scroll reveal: a short fade and small translate as the element enters the
 * viewport. CSS does the animating; this component only toggles a class.
 *
 * ROBUSTNESS - the whole page must never be invisible.
 * The previous implementation set `opacity: 0` in CSS and relied entirely on
 * JavaScript adding the "visible" class, so with JavaScript disabled, blocked
 * or erroring, most of the page never appeared. Two defences here:
 *
 *  1. The hiding rule is scoped to `.reveal-ready .reveal`, and that class is
 *     only added to <html> by an inline script after it has confirmed
 *     IntersectionObserver exists. No JS means no hiding.
 *  2. A failsafe timer forces the element visible shortly after mount, so an
 *     observer that never fires still cannot hide content.
 */

const TAGS = {
  div: "div",
  section: "section",
  figure: "figure",
  li: "li",
  span: "span",
} as const;

export type RevealTag = keyof typeof TAGS;

type RevealProps = {
  as?: RevealTag;
  children: ReactNode;
  className?: string;
  /** Stagger in milliseconds. */
  delay?: number;
  /** Skip the animation entirely. */
  noAnimation?: boolean;
};

export default function Reveal({
  as = "div",
  children,
  className,
  delay = 0,
  noAnimation = false,
}: RevealProps) {
  const Tag = TAGS[as] as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  // Visible from the first paint when the animation is switched off, so no
  // effect is needed to "turn it on" after mount.
  const [visible, setVisible] = useState(noAnimation);

  useEffect(() => {
    if (noAnimation) return;

    const node = ref.current;
    if (!node) return;

    // No IntersectionObserver: become visible on the next tick rather than
    // staying hidden. Still a callback, never a synchronous setState in the
    // effect body.
    if (typeof IntersectionObserver === "undefined") {
      const timer = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(timer);
    }

    // Failsafe: whatever happens, become visible.
    const failsafe = window.setTimeout(() => setVisible(true), 1500);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            window.clearTimeout(failsafe);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
    };
  }, [noAnimation]);

  return (
    <Tag
      ref={ref}
      className={cx("reveal", visible && "is-visible", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
