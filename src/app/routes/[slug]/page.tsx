import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Shell from '@/components/Shell';
import BookingForm from '@/components/BookingForm';
import Faq from '@/components/Faq';
import Reviews from '@/components/Reviews';
import { dict, getLang } from '@/lib/i18n';
import { getCarTypes, getFaqs, getReviews, getRoute, getRoutes, getSettings } from '@/lib/data';
import { S, inr, pick, waLink } from '@/lib/util';

export const dynamic = 'force-dynamic';
type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const r = await getRoute(slug);
  if (!r) return {};
  const title = `Ambala to ${r.to_en} Taxi`;
  return {
    title,
    description: `Book a cab from Ambala to ${r.to_en} (about ${r.distance_km} km). Verified drivers, clear per-km fares, one-way and round trips.`,
    alternates: { canonical: `/routes/${slug}` },
  };
}

export default async function RoutePage({ params }: P) {
  const { slug } = await params;
  const lang = await getLang();
  const t = dict[lang];
  const [r, s, cars, routes, faqs, reviews] = await Promise.all([getRoute(slug), getSettings(), getCarTypes(), getRoutes(), getFaqs(), getReviews()]);
  if (!r) notFound();
  const to = pick(r, 'to', lang);
  const sedan = cars.find((c: any) => c.slug === 'sedan') ?? cars[0];
  const wa = waLink(s, `Hi, I want to book a cab from Ambala to ${r.to_en}.`);
  return (
    <Shell>
      <section className="hero">
        <div className="container">
          <p className="muted" style={{ fontSize: 14, marginBottom: 20 }}><Link href="/" style={{ color: 'var(--link)' }}>{t.route.home}</Link> / {t.route.routes} / Ambala → {to}</p>
          <div className="row" style={{ gap: 48, alignItems: 'flex-start' }}>
            <div className="stack" style={{ flex: '1 1 440px', gap: 20 }}>
              <h1>{lang === 'hi' ? `अंबाला से ${to} ${t.route.taxi}` : `Ambala to ${to} ${t.route.taxi}`}</h1>
              <p className="muted" style={{ fontSize: 18, lineHeight: 1.6, maxWidth: 560 }}>{pick(r, 'intro', lang)}</p>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', maxWidth: 560, gap: 14 }}>
                <div className="card" style={{ padding: 16 }}><div className="muted" style={{ fontSize: 13 }}>{t.route.distance}</div><b style={{ fontSize: 22 }}>~{r.distance_km} km</b></div>
                <div className="card" style={{ padding: 16 }}><div className="muted" style={{ fontSize: 13 }}>{t.route.time}</div><b style={{ fontSize: 22 }}>{r.duration_text}</b></div>
                {sedan && <div className="card" style={{ padding: 16 }}><div className="muted" style={{ fontSize: 13 }}>{t.routes.from}</div><b style={{ fontSize: 22, color: 'var(--link)' }}>{inr(Number(sedan.rate_per_km) * r.distance_km)}</b></div>}
              </div>
            </div>
            <div id="book" style={{ flex: '1 1 400px', minWidth: 0 }}>
              <BookingForm lang={lang} t={t.form} cars={cars} whatsappUrl={wa} fixedPickup="Ambala" fixedDrop={r.to_en} distanceKm={r.distance_km} title={t.route.bookRoute} />
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 24 }}>
        <div className="container">
          <h2 style={{ marginBottom: 8 }}>{t.route.faresTitle} {lang === 'hi' ? `अंबाला से ${to}` : `Ambala to ${to}`}</h2>
          <p className="muted" style={{ marginBottom: 24 }}>{t.route.faresNote}</p>
          <div className="scroll-x">
            <table className="fares">
              <thead><tr>{t.route.cols.map((c: string) => <th key={c}>{c}</th>)}</tr></thead>
              <tbody>
                {cars.map((c: any) => (
                  <tr key={c.id}>
                    <td><b>{pick(c, 'name', lang)}</b></td><td className="muted">{c.seats}</td><td className="muted">{inr(c.rate_per_km)}/km</td>
                    <td><b>{inr(Number(c.rate_per_km) * r.distance_km)}</b></td><td><b>{inr(Number(c.rate_per_km) * r.distance_km * 2)}</b></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24, paddingBottom: 24 }}>
        <div className="container row" style={{ gap: 20, alignItems: 'stretch' }}>
          <div className="card" style={{ flex: '1 1 340px', padding: 28 }}>
            <h3 style={{ fontSize: 22, marginBottom: 12 }}>{t.route.includedTitle}</h3>
            <p className="muted" style={{ lineHeight: 1.9 }}>{t.route.included.map((x: string) => <span key={x}>{x}<br /></span>)}</p>
          </div>
          <div className="card" style={{ flex: '1 1 340px', padding: 28 }}>
            <h3 style={{ fontSize: 22, marginBottom: 12 }}>{t.route.extraTitle}</h3>
            <p className="muted" style={{ lineHeight: 1.9 }}>{t.route.extra.map((x: string) => <span key={x}>{x}<br /></span>)}{S(s, 'night_charges', lang)}</p>
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="section">
          <div className="container" style={{ maxWidth: 860 }}>
            <h2 style={{ marginBottom: 28 }}>{t.faq.title}</h2>
            <Faq items={faqs.map((f: any) => ({ q: pick(f, 'q', lang), a: pick(f, 'a', lang) }))} />
          </div>
        </section>
      )}

      <Reviews reviews={reviews} settings={s} lang={lang} t={t.reviews} id="route-reviews" bg="surf" />

      <section className="section">
        <div className="container">
          <h2 style={{ fontSize: 28, marginBottom: 24 }}>{t.route.other}</h2>
          <div className="grid g-cards">
            {routes.filter((x: any) => x.slug !== slug).map((x: any) => (
              <Link key={x.id} href={`/routes/${x.slug}`} className="card row between" style={{ textDecoration: 'none', padding: '16px 18px', fontWeight: 600 }}>
                <span>Ambala → {pick(x, 'to', lang)}</span><span style={{ color: 'var(--link)' }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
