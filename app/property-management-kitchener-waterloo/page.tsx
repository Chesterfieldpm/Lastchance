import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Property Management Kitchener-Waterloo | 6% Monthly, No Leasing Fee",
  description:
    "Chesterfield Property Management in Kitchener-Waterloo: 6% monthly, no leasing fee. Fast leasing, strict screening, responsive maintenance, transparent owner reporting.",
  alternates: {
    canonical: "/property-management-kitchener-waterloo",
  },
  openGraph: {
    title: "Property Management Kitchener-Waterloo | 6% Monthly, No Leasing Fee",
    description:
      "KW property management for single-family, condos, and small multis. Month-to-month, no leasing fee. Get a free rent analysis.",
    type: "website",
    url: "/property-management-kitchener-waterloo",
  },
};

export default function KWLanding() {
  const faq = [
    {
      q: "How much do you charge in Kitchener-Waterloo?",
      a: "6% of collected rent monthly. No leasing fee. Month-to-month.",
    },
    {
      q: "How fast can you lease my property?",
      a: "Our median time-to-lease is ~12 days (seasonality and unit factors apply).",
    },
    {
      q: "What’s included?",
      a: "Pricing + marketing, screening, lease execution, rent collection, maintenance coordination, statements/tax package, LTB-compliant notices.",
    },
    {
      q: "Do you manage condos and single-family homes?",
      a: "Yes, including SFH, condos, duplex/fourplex, and boutique portfolios.",
    },
    {
      q: "How do I get started?",
      a: "Request a free rent analysis below. We’ll confirm pricing and onboard you within one business day.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Property Management Kitchener-Waterloo",
    areaServed: ["Kitchener", "Waterloo"],
    provider: {
      "@type": "LocalBusiness",
      name: "Chesterfield Property Management",
      telephone: "+1-519-722-3378",
      address: {
        "@type": "PostalAddress",
        streetAddress: "161 Victoria Street South",
        addressLocality: "Kitchener",
        addressRegion: "ON",
        postalCode: "N2G 2B7",
        addressCountry: "CA",
      },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Management pricing",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Full-service property management",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "6",
            priceCurrency: "PERCENT",
            unitText: "of collected rent",
          },
        },
      ],
    },
  };

  return (
    <main className="bg-ink text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Property Management Kitchener-Waterloo
        </h1>
        <p className="mt-4 text-white/80 text-lg max-w-3xl">
          6% monthly. No leasing fee. Month-to-month. We combine pricing
          intelligence, fast leasing, and tight maintenance SLAs to raise NOI and
          reduce stress for KW landlords.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/#lead"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue text-white px-5 py-3 text-base font-medium hover:opacity-90"
          >
            Get a free rent analysis
          </a>
          <a
            href="https://calendly.com/chesterfieldgroup/30min"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-white text-ink px-5 py-3 text-base font-medium hover:opacity-90"
          >
            Book a 30-min call
          </a>
        </div>
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-xl font-semibold">Why KW landlords switch</h2>
            <ul className="mt-3 list-disc list-inside text-white/80 space-y-2 text-sm">
              <li>6% monthly fee and **no leasing fee** aligns incentives</li>
              <li>Data-driven pricing to cut days-vacant</li>
              <li>Strict screening + LTB-compliant process</li>
              <li>Responsive maintenance with clear SLAs</li>
              <li>Clean statements and year-end tax package</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-xl font-semibold">Average KW rents (CMHC 2024)</h2>
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <div className="rounded bg-white/5 border border-white/10 p-3">
                1-bed <div className="font-mono">$1,499</div>
              </div>
              <div className="rounded bg-white/5 border border-white/10 p-3">
                2-bed <div className="font-mono">$1,747</div>
              </div>
              <div className="rounded bg-white/5 border border-white/10 p-3">
                3-bed+ <div className="font-mono">$1,789</div>
              </div>
            </div>
            <div className="text-xs text-white/60 mt-2">
              Source: CMHC 2024 Rental Market Survey (Kitchener-Cambridge-Waterloo CMA)
            </div>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-xl font-semibold">Service areas</h2>
            <ul className="mt-3 text-sm text-white/80 space-y-1">
              <li>
                <Link className="underline hover:opacity-90" href="/areas/kitchener">
                  Kitchener property management
                </Link>
              </li>
              <li>
                <Link className="underline hover:opacity-90" href="/areas/waterloo">
                  Waterloo property management
                </Link>
              </li>
              <li>
                <Link className="underline hover:opacity-90" href="/areas/cambridge">
                  Cambridge property management
                </Link>
              </li>
              <li>
                <Link className="underline hover:opacity-90" href="/areas/guelph">
                  Guelph property management
                </Link>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-xl font-semibold">FAQ (KW)</h2>
            <div className="mt-3 space-y-3">
              {faq.map((f, i) => (
                <details key={i} className="rounded-xl border border-white/10 p-4 bg-white/5">
                  <summary className="font-medium cursor-pointer">{f.q}</summary>
                  <p className="mt-2 text-white/80 text-sm">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <a
            href="/#lead"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue text-white px-5 py-3 text-base font-medium hover:opacity-90"
          >
            Get your rent analysis
          </a>
        </div>
      </section>
    </main>
  );
}
