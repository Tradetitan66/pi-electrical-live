"use client";

import { track, type AnalyticsContext, type AnalyticsEvent } from "@/lib/analytics";
import { cx } from "@/lib/cx";

/**
 * Tracked outbound link.
 *
 * Lets server components carry analytics without becoming client components.
 *
 * WHY THIS EXISTS: <Footer> is a server component. Passing an onClick straight
 * from a server component is a build error ("Event handlers cannot be passed
 * to Client Component props"), and making the whole footer client just to hold
 * four listeners would ship a large block of otherwise-static markup's
 * hydration cost to phones on slow connections.
 *
 * So the static footer markup stays on the server and only these tiny anchors
 * hydrate. Analytics is still a no-op until a provider is approved - this is
 * the seam, not the transport.
 */
export default function TrackedLink({
  event,
  location,
  action,
  href,
  className,
  children,
  newTab = false,
  ...rest
}: {
  event: AnalyticsEvent;
  location: AnalyticsContext["location"];
  action: string;
  href: string;
  className?: string;
  children: React.ReactNode;
  newTab?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">) {
  const external = /^(tel:|mailto:|https?:)/.test(href);
  const openInNewTab = newTab || (external && href.startsWith("http"));

  return (
    <a
      href={href}
      className={cx(className)}
      {...(openInNewTab && href.startsWith("http")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      onClick={() => track(event, { location, action })}
      {...rest}
    >
      {children}
    </a>
  );
}
