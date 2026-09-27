"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";
import { cx } from "@/lib/cx";

/**
 * Button system.
 *
 * Corners are rounded to 8px so the controls read as approachable and
 * clickable, while cards and panels stay square to keep the editorial edge.
 *
 * Green is a FILL on light surfaces and always paired with ink text, because
 * the brand green only scores 1.52:1 as text on the warm background. The
 * `dark` flag switches the pairing for use on near-black sections.
 */

export type ButtonVariant = "primary" | "outline" | "ghost";
export type ButtonSize = "md" | "lg";

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Renders on a near-black section. */
  dark?: boolean;
  className?: string;
  /** Trailing arrow glyph, animated on hover. */
  arrow?: boolean;
  analyticsEvent?: AnalyticsEvent;
  analyticsLocation?: Parameters<typeof track>[1]["location"];
  analyticsAction?: string;
  analyticsService?: string;
};

type LinkProps = BaseProps & {
  href: string;
  external?: boolean;
  onNavigate?: () => void;
  "aria-label"?: string;
};

type ButtonProps = BaseProps & {
  href?: undefined;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  "aria-label"?: string;
};

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-[#2a2a2a] text-white hover:bg-[#1a1a1a] border border-transparent",
  outline:
    "border border-line text-ink hover:bg-black hover:text-white hover:border-black",
  ghost: "border border-transparent text-ink hover:text-foreground",
};

const VARIANTS_DARK: Record<ButtonVariant, string> = {
  primary:
    "bg-[#2a2a2a] text-white hover:bg-[#1a1a1a] border border-transparent",
  outline:
    "border border-white/35 text-white hover:border-white hover:text-white",
  ghost: "border border-transparent text-white hover:text-white",
};

const SIZES: Record<ButtonSize, string> = {
  md: "min-h-12 px-5 text-sm",
  lg: "min-h-14 px-7 text-[0.9375rem]",
};

export default function Button(props: LinkProps | ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    dark = false,
    className,
    arrow = false,
    analyticsEvent,
    analyticsLocation,
    analyticsAction,
    analyticsService,
  } = props;

  const palette = dark ? VARIANTS_DARK[variant] : VARIANTS[variant];

  const classes = cx(
    "group/btn inline-flex items-center justify-center gap-2.5 rounded-lg font-semibold tracking-[0.02em] touch-manipulation",
    "transition-colors duration-200",
    "disabled:cursor-not-allowed disabled:opacity-50",
    SIZES[size],
    palette,
    className,
  );

  const content = (
    <>
      <span className="text-center leading-tight">{children}</span>
      {arrow ? (
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-hover/btn:translate-x-1"
        >
          →
        </span>
      ) : null}
    </>
  );

  const fire = () => {
    if (analyticsEvent && analyticsLocation) {
      track(analyticsEvent, {
        location: analyticsLocation,
        action: analyticsAction ?? "click",
        ...(analyticsService ? { service: analyticsService } : {}),
      });
    }
  };

  if ("href" in props && props.href !== undefined) {
    const { href, external, onNavigate } = props;
    const isExternal = external ?? /^https?:|^tel:|^mailto:/.test(href);

    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          onClick={fire}
          aria-label={props["aria-label"]}
          {...(href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className={classes}
        onClick={() => {
          fire();
          onNavigate?.();
        }}
        aria-label={props["aria-label"]}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      className={classes}
      onClick={() => {
        fire();
        props.onClick?.();
      }}
      disabled={props.disabled}
      aria-label={props["aria-label"]}
    >
      {content}
    </button>
  );
}
