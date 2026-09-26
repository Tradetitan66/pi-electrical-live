import Link from "next/link";
import Wordmark from "./Wordmark";
import BrandLink from "./BrandLink";
import Stars from "./Stars";
import TrackedLink from "./TrackedLink";
import { BUSINESS } from "@/data/business";
import { NAV_LINKS } from "@/data/navigation";
import { SOCIAL } from "@/data/social";
import { AREA_LIST } from "@/data/areas";
import { MEMBERSHIP } from "@/data/membership";

/**
 * Site footer. Server component - only the four tracked links hydrate, via
 * <TrackedLink> islands.
 *
 * Every contact value is read from data/business.ts, including the address
 * lines. The previous version hardcoded "Bonnyrigg" and the postcode here
 * while reading the correct values from config three lines above, so editing
 * the address in one place silently left a stale value in the footer.
 */

const YEAR = new Date().getFullYear();

export default function Footer() {
  const socialEntries = [
    { key: "facebook" as const, ...SOCIAL.facebook },
    { key: "instagram" as const, ...SOCIAL.instagram },
  ];

  return (
    <footer className="on-dark bg-black text-white">
      <div className="shell pb-10 pt-16 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <BrandLink>
              <Wordmark tone="dark" size="lg" />
            </BrandLink>
            <div className="mt-5">
              <Stars rating={5} tone="dark" />
            </div>
            <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-muted-dark">
              Domestic and commercial electrical work for homeowners, builders
              and businesses across {AREA_LIST.slice(0, 4).join(", ")} and
              surrounding areas.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer" className="lg:col-span-3">
            <h2 className="eyebrow text-green">Explore</h2>
            <ul className="mt-5 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-sm text-white/85 transition-colors hover:text-green"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/maintenance-membership"
                  className="inline-flex min-h-11 items-center text-sm text-white/85 transition-colors hover:text-green"
                >
                  Maintenance Membership
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="inline-flex min-h-11 items-center text-sm text-white/85 transition-colors hover:text-green"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h2 className="eyebrow text-green">Contact</h2>
            <address className="mt-5 flex flex-col gap-1 not-italic">
              <TrackedLink
                event="phone_clicked"
                location="footer"
                action="footer_phone"
                href={BUSINESS.phone.href}
                className="inline-flex min-h-11 items-center text-sm font-semibold text-white transition-colors hover:text-green"
              >
                {BUSINESS.phone.display}
              </TrackedLink>
              <a
                href={BUSINESS.email.href}
                className="inline-flex min-h-11 items-center break-all text-sm text-white/85 transition-colors hover:text-green"
              >
                {BUSINESS.email.display}
              </a>
              <p className="mt-3 text-sm leading-relaxed text-muted-dark">
                {BUSINESS.address.line1}
                <br />
                {BUSINESS.address.town}, {BUSINESS.address.postcode}
                <br />
                {BUSINESS.address.region}, {BUSINESS.address.country}
              </p>
            </address>
            <p className="mt-3 max-w-[30ch] text-xs leading-relaxed text-muted-dark">
              {BUSINESS.name} is run by {BUSINESS.owner}. Working on site? Paul
              may not always be able to answer immediately - please leave a
              voicemail and he&apos;ll get back to you.
            </p>
          </div>

          {/* Coverage */}
          <div className="lg:col-span-2">
            <h2 className="eyebrow text-green">Coverage</h2>
            <ul className="mt-5 flex flex-col gap-1.5">
              {["Edinburgh", "Lothians", "Fife", "Scotland"].map((area) => (
                <li key={area} className="text-sm text-white/85">
                  {area}
                </li>
              ))}
            </ul>

            <h2 className="eyebrow mt-8 text-green">Follow</h2>
            <ul className="mt-4 flex flex-col gap-1">
              {socialEntries.map((social) => (
                <li key={social.key}>
                  <TrackedLink
                    event={
                      social.key === "instagram"
                        ? "instagram_clicked"
                        : "social_clicked"
                    }
                    location="footer"
                    action={`footer_${social.key}`}
                    href={social.href}
                    className="inline-flex min-h-11 items-center gap-2 text-sm text-white/85 transition-colors hover:text-green"
                  >
                    {social.label}
                    {social.handle ? (
                      <span className="text-muted-dark">{social.handle}</span>
                    ) : null}
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Membership strip - a real product, so it gets a permanent home */}
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/85">
            <span className="font-semibold text-green">
              {MEMBERSHIP.priceLine}
            </span>{" "}
            Electrical Maintenance Membership - labour cover for eligible
            electrical faults and call-outs.
          </p>
          <Link
            href="/maintenance-membership"
            className="inline-flex min-h-11 shrink-0 items-center text-sm font-semibold text-green hover:text-green-strong"
          >
            See what&apos;s included →
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-muted-dark sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {YEAR} {BUSINESS.name}. All rights reserved.
          </p>
          <p>
            {BUSINESS.address.town} · {BUSINESS.address.postcode} ·{" "}
            {BUSINESS.address.region}
          </p>
        </div>
      </div>
    </footer>
  );
}
