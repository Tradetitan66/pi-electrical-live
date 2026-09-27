import Link from "next/link";
import Wordmark from "./Wordmark";
import BrandLink from "./BrandLink";
import Stars from "./Stars";
import TrackedLink from "./TrackedLink";
import { BUSINESS } from "@/data/business";
import { NAV_LINKS } from "@/data/navigation";
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
            <ul className="mt-4 flex gap-3">
              <li>
                <TrackedLink
                  event="social_clicked"
                  location="footer"
                  action="footer_facebook"
                  href="https://www.facebook.com/share/1F7XC3RE5D/"
                  aria-label="Facebook"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/85 transition-colors hover:border-green hover:text-green"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </TrackedLink>
              </li>
              <li>
                <TrackedLink
                  event="social_clicked"
                  location="footer"
                  action="footer_reviews"
                  href="https://www.mybuilder.com/profile/pi-electrical/reviews"
                  aria-label="Reviews"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/85 transition-colors hover:border-green hover:text-green"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
                  </svg>
                </TrackedLink>
              </li>
              <li>
                <TrackedLink
                  event="instagram_clicked"
                  location="footer"
                  action="footer_instagram"
                  href="https://www.instagram.com/pi_electrical_/"
                  aria-label="Instagram"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/85 transition-colors hover:border-green hover:text-green"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1.5" />
                  </svg>
                </TrackedLink>
              </li>
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
