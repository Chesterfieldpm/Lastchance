'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  MapPin,
  Sparkles,
  Star,
} from 'lucide-react';

const CALENDLY_URL = 'https://calendly.com/chesterfieldgroup/30min';

/** Types */
type KpiTileProps = {
  number: number;
  label: string;
  prefix?: string;
  suffix?: string;
  helper?: string;
};

type Review = {
  author: string;
  rating: number;
  text: string;
  time?: string;
};

type FormState = {
  email: string;
  city: 'Kitchener' | 'Waterloo' | 'Cambridge' | 'Guelph';
  units: string;
  name: string;
  phone: string;
  address: string;
  notes: string;
};

function KpiTile({
  number,
  label,
  prefix = '',
  suffix = '',
  helper = '',
}: KpiTileProps) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let raf: number;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setVal(number);
      return;
    }

    const step = () => {
      setVal((v) => {
        const next = v + Math.max(0.5, number / 40);
        if (next >= number) {
          cancelAnimationFrame(raf);
          return number;
        }
        return next;
      });
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [number]);

  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
      <div className="text-3xl font-extrabold tracking-tight font-mono tabular-nums">
        {prefix}
        {Number(val).toFixed(Number.isInteger(number) ? 0 : 1)}
        {suffix}
      </div>
      <div className="text-sm mt-1">{label}</div>
      {helper && <div className="text-xs text-white/70 mt-1">{helper}</div>}
    </div>
  );
}

function Logo() {
  const [err, setErr] = useState(false);
  if (!err) {
    return (
      <img
        src="/logo.svg"
        alt="Chesterfield Property Management logo"
        className="h-9 w-auto"
        onError={() => setErr(true)}
      />
    );
  }
  return (
    <div className="w-9 h-9 rounded-xl bg-white text-ink grid place-content-center font-semibold">
      CP
    </div>
  );
}

export default function HomePage() {
  // Calculator
  const [rent, setRent] = useState<number>(1800);
  const [doors, setDoors] = useState<number>(3);
  const typicalPct = 0.85; // 85% of one month’s rent per unit
  const savings = (rent || 0) * typicalPct * (doors || 0);

  // Lead form (2 steps)
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormState>({
    email: '',
    city: 'Kitchener',
    units: '1',
    name: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reviews (fallback to static until /api/reviews is wired to Google)
  const [reviews, setReviews] = useState<Review[]>([
    {
      author: 'K. Thompson',
      rating: 5,
      text: 'Professional, fast, and transparent. My unit leased in under two weeks.',
      time: '2 months ago',
    },
    {
      author: 'D. Patel',
      rating: 5,
      text: 'Great communication and clear statements. Highly recommend.',
      time: '3 weeks ago',
    },
    {
      author: 'A. Nguyen',
      rating: 5,
      text: 'Maintenance handled same day and kept me in the loop.',
      time: '1 month ago',
    },
  ]);

  // SEO JSON-LD
  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: 'Chesterfield Property Management',
      areaServed: ['Kitchener', 'Waterloo', 'Cambridge', 'Guelph'],
      telephone: '+1-519-722-3378',
    }),
    []
  );

  useEffect(() => {
    fetch('/api/reviews')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && Array.isArray(d.reviews) && d.reviews.length) {
          setReviews(d.reviews as Review[]);
        }
      })
      .catch(() => {});
  }, []);

  const rents: Record<
    FormState['city'],
    { one: number; two: number; three: number; foot: string }
  > = {
    Kitchener: {
      one: 1499,
      two: 1747,
      three: 1789,
      foot: 'Source: CMHC 2024 Rental Market Survey (KCW CMA)',
    },
    Waterloo: {
      one: 1499,
      two: 1747,
      three: 1789,
      foot: 'Source: CMHC 2024 Rental Market Survey (KCW CMA)',
    },
    Cambridge: {
      one: 1499,
      two: 1747,
      three: 1789,
      foot: 'Source: CMHC 2024 Rental Market Survey (KCW CMA)',
    },
    Guelph: {
      one: 1598,
      two: 1736,
      three: 1935,
      foot: 'Source: CMHC 2024 Rental Market Survey (Guelph CMA)',
    },
  };

  async function submitLead() {
    setError(null);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          toEmail: 'brandon@chesterfieldgroup.ca',
          source: 'homepage',
        }),
      });
      if (!res.ok) throw new Error('Request failed: ' + res.status);
      setSuccess(true);
    } catch (e: unknown) {
      const msg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as any).message)
          : 'Something went wrong. Please try again.';
      setError(msg);
    }
  }

  function chooseCity(city: FormState['city']) {
    setForm((f) => ({ ...f, city }));
    document.getElementById('lead')?.scrollIntoView({ behavior: 'smooth' });
    setStep(1);
  }

  return (
    <main className="min-h-screen bg-ink text-white">
      <script
        type="application/ld+json"
        // @ts-expect-error: JSON-LD injection
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-ink/75 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <Logo />
            <div className="font-semibold tracking-tight group-hover:opacity-90 transition">
              Chesterfield Property Management
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm text-white/80">
            <a href="#calc" className="hover:text-white">
              Calculator
            </a>
            <a href="#cases" className="hover:text-white">
              Case Studies
            </a>
            <a href="#areas" className="hover:text-white">
              Areas
            </a>
            <a href="#faq" className="hover:text-white">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="tel:+15197223378"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm hover:bg-white/5"
            >
              (519) 722-3378
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-ink px-4 py-2 text-sm hover:opacity-90"
              data-analytics="cta_book_call"
            >
              <CalendarClock className="size-4" /> Book review
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_70%_-10%,rgba(47,115,255,0.3),transparent)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
              <Sparkles className="size-4" /> Data-driven property management •
              KWCG
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              No Leasing Fee. <span className="opacity-80">Just Results.</span>
            </h1>
            <p className="mt-3 text-white/80 text-lg max-w-xl">
              Fast leasing, strong screening, and tight maintenance SLAs—so you
              grow NOI without the stress.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
              <span className="font-semibold">Pricing:</span>{' '}
              <span>6% of collected rent per month • No leasing fee • Month-to-month</span>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href="#calc"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue text-white px-5 py-3 text-base font-medium hover:opacity-90 transition"
                data-analytics="cta_calc"
              >
                Estimate my savings <ArrowRight className="size-5" />
              </a>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-white text-ink px-5 py-3 text-base font-medium hover:opacity-90 transition"
              >
                Book portfolio review
              </a>
            </div>

            <div className="mt-5 flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-1 text-sm">
                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                <b>4.9</b>
                <span className="opacity-80">· Live Google reviews below</span>
              </div>
            </div>
          </div>

          {/* KPI panel */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
            <div className="grid grid-cols-3 gap-3">
              <KpiTile
                number={12}
                suffix="d"
                label="Time-to-lease"
                helper="Median days from listing to signed lease (last 90 days)."
              />
              <KpiTile
                number={96}
                prefix=">"
                suffix="%"
                label="Occupancy"
                helper="Portfolio occupancy across managed units (rolling 6-month avg)."
              />
              <KpiTile
                number={3.2}
                suffix="h"
                label="Avg. response"
                helper="Median time to first reply on maintenance & leasing inquiries."
              />
            </div>
            <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="text-sm text-white/70">Vacancy trend</div>
              <div className="mt-2 h-24 rounded bg-gradient-to-r from-blue/30 to-mint/30 grid place-content-center text-xs text-white/60">
                sparkline placeholder
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator + Compare */}
      <section id="calc" className="py-14 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6 items-start">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="font-semibold flex items-center gap-2">
              <BarChart3 className="size-5" /> Savings calculator
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
              <input
                value={rent}
                onChange={(e) => setRent(Number(e.target.value) || 0)}
                placeholder="Monthly rent"
                className="rounded-xl bg-[#0f1216] border border-white/10 px-3 py-2"
              />
              <input
                value={doors}
                onChange={(e) => setDoors(Number(e.target.value) || 0)}
                placeholder="# of units"
                className="rounded-xl bg-[#0f1216] border border-white/10 px-3 py-2"
              />
              <button
                className="col-span-2 rounded-xl bg-blue text-white px-4 py-2 font-medium"
                data-analytics="calc_submit"
              >
                Calculate
              </button>
              <div className="col-span-2 rounded-xl bg-blue text-white p-3 text-center font-medium">
                Est. savings on leasing fees: $
                {Number.isFinite(savings) ? savings.toLocaleString() : 0}
              </div>
              <div className="col-span-2 text-xs text-white/60">
                Assumes typical leasing fee ≈ {Math.round(typicalPct * 100)}% of
                one month’s rent per unit.
              </div>
            </div>
          </div>

          <div id="compare" className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="font-semibold mb-3">Us vs Typical PM vs Self-manage</div>
            <div className="grid grid-cols-3 text-sm">
              <div className="opacity-70">Feature</div>
              <div className="font-medium">Us</div>
              <div className="opacity-70">Typical PM</div>
            </div>
            <div className="mt-2 space-y-2 text-sm">
              {[
                ['Monthly fee', '6% of collected rent', '8–10%'],
                ['Leasing fee', '$0', '75–100% month rent'],
                ['Owner portal', 'Included', 'Varies'],
                ['Maintenance SLAs', 'Yes', '-'],
                ['Contract term', 'Month-to-month', '12 months'],
              ].map(([f, a, b]) => (
                <div
                  key={String(f)}
                  className="grid grid-cols-3 gap-3 py-2 border-b border-white/10"
                >
                  <div className="opacity-70">{f}</div>
                  <div className="text-mint">{a}</div>
                  <div className="opacity-70">{b}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case studies */}
      <section id="cases" className="py-14 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Case studies
          </h2>
          <p className="text-white/70 mt-2 max-w-2xl">
            Before → After metrics with a clear playbook. Numbers below are
            placeholders — replace with verified results.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mt-6">
            {[
              {
                name: '431 Krug',
                city: 'Kitchener',
                kpis: ['−18 days vacant/year', '+$9.4k NOI', 'Leased in 12 days'],
                what: [
                  'Demand-based pricing',
                  'Pro photos + showing cadence',
                  'Make-ready checklist',
                ],
              },
              {
                name: 'The Arlo',
                city: '(TBD)',
                kpis: [
                  'Renewal rate +12%',
                  'Rent uplift vs comps',
                  'Preventative maintenance plan',
                ],
                what: [
                  'Positioning vs comps',
                  'Screening for long-term fit',
                  'Ops cadence & SLAs',
                ],
              },
            ].map((c) => (
              <div
                key={c.name}
                className="rounded-2xl bg-white/5 border border-white/10 p-4"
              >
                <div className="text-sm text-white/70">{c.city}</div>
                <div className="mt-1 font-medium">{c.name}</div>
                <ul className="mt-2 text-sm list-disc list-inside space-y-1">
                  {c.kpis.map((k, i) => (
                    <li key={i}>{k}</li>
                  ))}
                </ul>
                <div className="mt-3 text-xs text-white/60">
                  What we did: {c.what.join(' • ')}
                </div>
                <a
                  href="#lead"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector('#lead')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-4 inline-flex items-center gap-2 text-sm underline"
                >
                  See what we'd change for your unit <ArrowRight className="size-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service areas */}
      <section id="areas" className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-lg font-semibold mb-3">Service areas</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['Kitchener', 'Waterloo', 'Cambridge', 'Guelph'] as const).map((c) => (
              <button
                key={c}
                onClick={() => chooseCity(c)}
                className="text-left rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="size-4" /> {c}
                </div>
                <div className="text-xs text-white/70">Avg rents (CMHC 2024)</div>
                <div className="flex gap-2 text-sm">
                  <span className="px-2 py-1 rounded bg-white/5 border border-white/10">
                    1-bed $
                    {(c === 'Guelph' ? rents.Guelph.one : rents.Kitchener.one).toLocaleString()}
                  </span>
                  <span className="px-2 py-1 rounded bg-white/5 border border-white/10">
                    2-bed $
                    {(c === 'Guelph' ? rents.Guelph.two : rents.Kitchener.two).toLocaleString()}
                  </span>
                  <span className="px-2 py-1 rounded bg-white/5 border border-white/10">
                    3-bed+ $
                    {(c === 'Guelph' ? rents.Guelph.three : rents.Kitchener.three).toLocaleString()}
                  </span>
                </div>
                <div className="text-[11px] text-white/50">
                  {c === 'Guelph'
                    ? rents.Guelph.foot
                    : rents.Kitchener.foot}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-14 border-t border-white/10 bg-[#0f1216]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Landlord FAQ
          </h2>
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-6 grid gap-4">
          {[
            {
              q: 'Do you really charge no leasing fee?',
              a: 'Yes. You pay only monthly management when rent is collected—aligning incentives for long-term tenancy quality.',
            },
            {
              q: 'What’s included in management?',
              a: 'Leasing & marketing, screening, rent collection, maintenance coordination, legal notices, statements/tax package, and compliance.',
            },
            {
              q: 'Do you require a long-term contract?',
              a: 'Month-to-month with 30-day notice; we earn retention by performance.',
            },
            {
              q: 'How do you screen tenants?',
              a: 'Credit, income, landlord refs, ID/fraud checks, employment, and LTB compliance.',
            },
            {
              q: 'Who handles maintenance approvals?',
              a: 'We coordinate vendors; you set approval limits. Emergency protocols included.',
            },
            {
              q: 'How and when do I get paid?',
              a: 'Owner payouts after cleared rent; monthly statements + year-end tax package.',
            },
            {
              q: 'What if a tenant stops paying?',
              a: 'We follow LTB processes (N-notices, applications) and manage next steps professionally.',
            },
            {
              q: 'Do you manage condos and single-family homes?',
              a: 'Yes—condos, SFH, small multis (duplex/fourplex) and boutique portfolios up to ~20 doors.',
            },
            {
              q: 'How do you price my unit?',
              a: 'CMHC comparables + live demand/seasonality, unit condition, parking, and pet policy.',
            },
            {
              q: 'How do I get started?',
              a: 'Use the calculator, then request a rent analysis. We’ll confirm pricing and onboard you within one business day.',
            },
          ].map((it, i) => (
            <details key={i} className="rounded-2xl border border-white/10 p-5 bg-white/5">
              <summary className="font-medium cursor-pointer">{it.q}</summary>
              <p className="mt-2 text-white/80 text-sm">{it.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Lead form */}
      <section id="lead" className="py-16 bg-white text-ink">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Get your free rent analysis
              </h2>
              <p className="text-neutral-600 mt-2">
                Step {step} of 2 — we’ll email your estimate and follow up to confirm
                details.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-neutral-700">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 text-mint" /> No leasing fee—ever
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 text-mint" /> 6% monthly management
                  (when rent is collected)
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 text-mint" /> Coverage across KWCG
                </li>
              </ul>
            </div>

            {!success ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (step === 1) setStep(2);
                  else await submitLead();
                }}
                className="rounded-2xl bg-white p-6 border grid gap-4"
                data-analytics={step === 1 ? 'lead_step1_submit' : 'lead_submit_success'}
              >
                {step === 1 ? (
                  <>
                    <div>
                      <label className="text-sm">Email</label>
                      <input
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        required
                        type="email"
                        className="mt-1 w-full rounded-xl border px-3 py-2"
                        placeholder="you@email.com"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm">City</label>
                        <select
                          value={form.city}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, city: e.target.value as FormState['city'] }))
                          }
                          className="mt-1 w-full rounded-xl border px-3 py-2"
                        >
                          {(['Kitchener', 'Waterloo', 'Cambridge', 'Guelph'] as const).map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm"># of units</label>
                        <select
                          value={form.units}
                          onChange={(e) => setForm((f) => ({ ...f, units: e.target.value }))}
                          className="mt-1 w-full rounded-xl border px-3 py-2"
                        >
                          {['1', '2–4', '5–9', '10+'].map((u) => (
                            <option key={u}>{u}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue text-white px-5 py-3 text-base font-medium hover:opacity-90">
                      Continue
                    </button>
                  </>
                ) : (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm">Name</label>
                        <input
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          required
                          className="mt-1 w-full rounded-xl border px-3 py-2"
                          placeholder="Jane Doe"
                        />
                      </div>
                      <div>
                        <label className="text-sm">Phone</label>
                        <input
                          value={form.phone}
                          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                          className="mt-1 w-full rounded-xl border px-3 py-2"
                          placeholder="(519) 555-1234"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm">Property address</label>
                      <input
                        value={form.address}
                        onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                        className="mt-1 w-full rounded-xl border px-3 py-2"
                        placeholder="123 King St W, Kitchener"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Notes</label>
                      <textarea
                        value={form.notes}
                        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                        className="mt-1 w-full rounded-xl border px-3 py-2"
                        rows={3}
                        placeholder="Timelines, pets, parking, etc."
                      />
                    </div>
                    {error && <div className="text-sm text-red-600">{error}</div>}
                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue text-white px-5 py-3 text-base font-medium hover:opacity-90"
                      >
                        Request analysis <ArrowRight className="size-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-sm text-neutral-600 hover:underline"
                      >
                        Back
                      </button>
                    </div>
                  </>
                )}
              </form>
            ) : (
              <div className="rounded-2xl bg-white p-6 border grid gap-3">
                <div className="text-lg font-semibold">
                  Thanks! We’ll follow up within one business day.
                </div>
                <div className="text-sm text-neutral-700">
                  We’ll email your preliminary rent analysis shortly. You can also{' '}
                  <a className="underline" href={CALENDLY_URL} target="_blank" rel="noreferrer">
                    book a 30-min call
                  </a>{' '}
                  now.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0f1216]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3">
              <Logo />
              <div className="font-semibold tracking-tight">
                Chesterfield Property Management
              </div>
            </div>
            <p className="text-sm text-white/70 mt-4">
              Maximize your rental income and minimize stress. Proudly managing in
              Kitchener, Waterloo, Cambridge & Guelph.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a className="hover:underline" href="#">
                  About
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#calc">
                  Calculator
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#cases">
                  Case studies
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#lead">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a className="hover:underline" href="#faq">
                  FAQ
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#areas">
                  Service areas
                </a>
              </li>
              <li>
                <a
                  className="hover:underline"
                  href="https://share.google/41LInfVkCLfqUv3Sp"
                  target="_blank"
                  rel="noreferrer"
                >
                  Google reviews
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-1 text-sm text-white/80">
              <li>161 Victoria Street South, Kitchener, ON N2G 2B7</li>
              <li>Mon–Fri 9am–6pm</li>
              <li>
                <a className="hover:underline" href="tel:+15197223378">
                  (519) 722-3378
                </a>
              </li>
              <li>
                <a className="hover:underline" href="mailto:hello@chesterfieldgroup.ca">
                  hello@chesterfieldgroup.ca
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-white/60 py-6">
          © {new Date().getFullYear()} Chesterfield Property Management. All rights reserved.
        </div>
      </footer>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-3 inset-x-3 md:hidden z-40">
        <div className="rounded-xl bg-white text-ink shadow-lg border flex overflow-hidden">
          <a href="tel:+15197223378" className="flex-1 text-center py-3 font-medium border-r">
            Call
          </a>
          <a href="#lead" className="flex-1 text-center py-3 font-medium bg-blue text-white">
            Get analysis
          </a>
        </div>
      </div>
    </main>
  );
}
