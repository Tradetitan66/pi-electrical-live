import type { Metadata, Viewport } from "next";
import { Inter, Archivo } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileActionBar from "@/components/MobileActionBar";
import { BUSINESS, SITE_URL } from "@/data/business";
import { AREA_LIST } from "@/data/areas";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "PI Electrical | Electrician in Edinburgh, Lothians & Fife",
    template: "%s | PI Electrical",
  },
  description:
    "Qualified electrician providing domestic, commercial and emergency electrical services across Edinburgh, the Lothians, Fife and surrounding areas. Free no-obligation quotes.",
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/images/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/images/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/images/apple-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: BUSINESS.name,
    title: "PI Electrical | Electrician in Edinburgh, Lothians & Fife",
    description:
      "Domestic and commercial electrical work across Edinburgh, the Lothians, Fife and surrounding areas. Free no-obligation quotes.",
    url: SITE_URL,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "PI Electrical - fully qualified electrician covering Edinburgh, the Lothians and Fife",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PI Electrical | Electrician in Edinburgh, Lothians & Fife",
    description:
      "Domestic and commercial electrical work across Edinburgh, the Lothians, Fife and surrounding areas.",
    images: ["/opengraph-image.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0d0c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Only verified facts are published here.
 *
 * Deliberately absent: aggregateRating, reviewCount, review, awards,
 * foundingDate, priceRange, accreditation and insurance. None of those are
 * confirmed, and unverified review or rating markup risks a Google
 * structured-data penalty.
 */
function structuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Electrician",
        "@id": `${SITE_URL}/#business`,
        name: BUSINESS.name,
        description: BUSINESS.facts.fullyQualifiedNote,
        url: SITE_URL,
        telephone: BUSINESS.phone.international,
        email: BUSINESS.email.display,
        image: `${SITE_URL}/opengraph-image`,
        logo: `${SITE_URL}/images/mark.png`,
        address: {
          "@type": "PostalAddress",
          streetAddress: BUSINESS.address.line1,
          addressLocality: BUSINESS.address.town,
          addressRegion: BUSINESS.address.region,
          postalCode: BUSINESS.address.postcode,
          addressCountry: BUSINESS.address.countryCode,
        },
        areaServed: [...AREA_LIST, "Scotland", "United Kingdom"],
        employee: {
          "@type": "Person",
          name: BUSINESS.owner,
          jobTitle: BUSINESS.role,
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Electrical services",
          itemListElement: [
            "Domestic electrical work",
            "Commercial electrical work",
            "Emergency electrical services",
            "Electrical rewiring",
            "Kitchen electrical installation",
            "Home renovation electrical work",
            "Extensions and new builds",
            "Garden room and outdoor electrics",
            "Electrical fault finding",
            "EICR",
            "PAT testing",
            "Smoke and fire alarm installation",
            "Landlord electrical work",
            "EV charging installation",
          ].map((name) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BUSINESS.name,
        publisher: { "@id": `${SITE_URL}/#business` },
        inLanguage: "en-GB",
      },
    ],
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-GB"
      /*
        The reveal safety switch below adds `reveal-ready` to <html> before
        React hydrates, so the live className intentionally differs from the
        server-rendered one. This is the documented use for
        suppressHydrationWarning: the attribute React is responsible for is the
        font variables, and the extra class is ours, added deliberately.
      */
      suppressHydrationWarning
      className={`${inter.variable} ${archivo.variable} h-full antialiased`}
    >
      <head>
        {/*
          Scroll-reveal safety switch. The CSS that hides `.reveal` is scoped to
          `.reveal-ready`, and this class is only added here - after confirming
          IntersectionObserver exists. With JavaScript unavailable, blocked or
          erroring, the class is never added and all content stays visible.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if('IntersectionObserver' in window){document.documentElement.classList.add('reveal-ready')}}catch(e){}",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-lg focus:bg-black focus:px-5 focus:py-3 focus:font-semibold focus:text-green"
        >
          Skip to content
        </a>
        <Header />
        {/*
          tabIndex={-1} is REQUIRED, not optional: a skip link's whole job is to
          move keyboard focus past the header. Without it the browser only
          scrolls and focus stays on <body>, so the next Tab went straight back
          into the header navigation - the link skipped the header visually but
          not for a keyboard user.

          The focus ring is suppressed on purpose here, and only here. This is a
          non-interactive scroll target, not a control; the visible feedback is
          the skip link appearing and the page jumping. Every interactive
          element keeps its ring.
        */}
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
        <MobileActionBar />
      </body>
    </html>
  );
}
