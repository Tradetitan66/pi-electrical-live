"use client";

import { useEffect, useState } from "react";

/**
 * rAF-throttled "has the page scrolled" flag.
 *
 * The previous site had two independent un-throttled scroll listeners, each
 * re-rendering a component on every scroll event. This is one shared,
 * throttled implementation that only triggers a state change when the boolean
 * actually flips.
 */
export function useScrolled(threshold = 16): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      setScrolled((current) => {
        const next = window.scrollY > threshold;
        return next === current ? current : next;
      });
    };

    const onScroll = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(read);
      }
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return scrolled;
}
