import Link from 'next/link';
import Shell from '@/components/Shell';
import BookingForm from '@/components/BookingForm';
import FareCalculator from '@/components/FareCalculator';
import Faq from '@/components/Faq';
import Reviews from '@/components/Reviews';
import { dict, getLang } from '@/lib/i18n';
import { getCarTypes, getFaqs, getReviews, getRoutes, getSettings } from '@/lib/data';
import { S, inr, pick, telLink, waLink } from '@/lib/util';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const lang = await getLang();
  const t = dict[lang];
  const [s, cars, routes, faqs, reviews] = await Promise.all([getSettings(), getCarTypes(), getRoutes(), getFaqs(), getReviews()]);
  const sedan = cars.find((c: any) => c.slug === 'sedan') ?? cars[0];
  const wa = waLink(s, 'Hi, I want to book a cab.');
  const years = S(s, 'years', 'en');
  const h1a = S(s, 'hero_h1a', lang) || t.hero.h1a;
  const h1b = S(s, 'hero_h1b', lang) || t.hero.h1b;
  const sub = S(s, 'hero_sub', lang) || t.hero.sub;
  return (
    <Shell>
      <section className="hero" id="top">
        <div className="container row" style={{ gap: 48, alignItems: 'center' }}>
          <div className="stack" style={{ flex: '1 1 440px', gap: 20 }}>
            <span className="chip" style={{ alignSelf: 'flex-start' }}>{t.hero.eyebrow.replace('{years}', years)}</span>
            <h1>{h1a} <span style={{ color: 'var(--link)' }}>{h1b}</span></h1>
            <p className="muted" style={{ fontSize: 18, lineHeight: 1.6, maxWidth: 500 }}>{sub}</p>
            <div className="row" style={{ gap: 14 }}>
              <a href="#book" className="btn btn-primary">{t.hero.book}</a>
              <a href="#fare" className="btn btn-outline">{t.hero.fares}</a>
            </div>
          </div>
          <div id="book" style={{ flex: '1 1 440px', minWidth: 0 }}>
            <BookingForm lang={lang} t={t.form} cars={cars} whatsappUrl={wa} />
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 24 }}>
        <div className="container grid g-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {t.trust.map(([h, p]: string[]) => (<div key={h} className="card"><h3 style={{ marginBottom: 6 }}>{h}</h3><p className="muted" style={{ fontSize: 14 }}>{p}</p></div>))}
        </div>
      </section>

      <section id="fleet" className="section">
        <div className="container">
          <h2 style={{ marginBottom: 8 }}>{t.fleet.title}</h2>
          <p className="muted" style={{ marginBottom: 28 }}>{t.fleet.sub}</p>
          <div className="grid g-cards">
            {cars.map((c: any) => (
              <article key={c.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {c.image_url ? <img src={c.image_url} alt={pick(c, 'name', lang)} className="photo" /> : <div className="ph photo">{pick(c, 'name', lang)}</div>}
                <div style={{ padding: 18 }}>
                  <h3>{pick(c, 'name', lang)}</h3>
                  <p className="muted" style={{ fontSize: 13, margin: '4px 0 14px' }}>{c.models}</p>
                  <div className="row between" style={{ fontSize: 14 }}><span>{c.seats}</span><span className="amber">{inr(c.rate_per_km)}{t.fleet.perKm}</span></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="fare" className="section surf">
        <div className="container row" style={{ gap: 44, alignItems: 'stretch' }}>
          <div className="stack" style={{ flex: '1 1 320px', gap: 14 }}>
            <span className="chip" style={{ alignSelf: 'flex-start' }}>{t.fare.badge}</span>
            <h2 style={{ fontSize: 38, lineHeight: 1.1 }}>{t.fare.title}</h2>
            <p className="muted" style={{ fontSize: 16, lineHeight: 1.6 }}>{t.fare.sub}</p>
          </div>
          <div style={{ flex: '2 1 540px', minWidth: 0 }}><FareCalculator lang={lang} t={t.fare} cars={cars} /></div>
        </div>
      </section>

      <section id="routes" className="section">
        <div className="container">
          <h2 style={{ marginBottom: 28 }}>{t.routes.title}</h2>
          <div className="grid g-wide" style={{ gap: 16 }}>
            {routes.map((r: any) => (
              <Link key={r.id} href={`/routes/${r.slug}`} className="card row between" style={{ textDecoration: 'none', padding: 20 }}>
                <span><b style={{ fontSize: 17 }}>Ambala → {pick(r, 'to', lang)}</b><br /><span className="muted" style={{ fontSize: 14 }}>~{r.distance_km} km · {r.duration_text}</span></span>
                {sedan && <span style={{ textAlign: 'right' }}><span className="muted" style={{ display: 'block', fontSize: 12 }}>{t.routes.from}</span><b style={{ fontSize: 18, color: 'var(--link)' }}>{inr(Number(sedan.rate_per_km) * r.distance_km)}</b></span>}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section surf">
        <div className="container">
          <h2 style={{ marginBottom: 28 }}>{t.how.title}</h2>
          <div className="grid g-auto">
            {t.how.steps.map(([h, p]: string[], i: number) => (<div key={h} className="card"><div className="step">{i + 1}</div><h3 style={{ marginBottom: 8 }}>{h}</h3><p className="muted" style={{ fontSize: 15, lineHeight: 1.6 }}>{p}</p></div>))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid g-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <div className="card" style={{ background: 'var(--res)', color: '#fff', padding: 28 }}>
            <h3 style={{ fontSize: 22, marginBottom: 10 }}>{t.services.tours[0]}</h3>
            <p style={{ color: '#c5d0ea', lineHeight: 1.6 }}>{t.services.tours[1]}</p>
            <Link href="/tours" style={{ display: 'inline-block', marginTop: 16, color: '#ff9f1c', fontWeight: 600, textDecoration: 'none' }}>{t.services.tours[2]}</Link>
          </div>
          <div className="card" style={{ padding: 28 }}><h3 style={{ fontSize: 22, marginBottom: 10 }}>{t.services.airport[0]}</h3><p className="muted" style={{ lineHeight: 1.6 }}>{t.services.airport[1]}</p></div>
          <div className="card" style={{ padding: 28 }}><h3 style={{ fontSize: 22, marginBottom: 10 }}>{t.services.corp[0]}</h3><p className="muted" style={{ lineHeight: 1.6 }}>{t.services.corp[1]}</p></div>
        </div>
      </section>

      <Reviews reviews={reviews} settings={s} lang={lang} t={t.reviews} bg="surf" />

      {faqs.length > 0 && (
        <section id="faq" className="section">
          <div className="container" style={{ maxWidth: 860 }}>
            <h2 style={{ marginBottom: 28 }}>{t.faq.title}</h2>
            <Faq items={faqs.map((f: any) => ({ q: pick(f, 'q', lang), a: pick(f, 'a', lang) }))} />
          </div>
        </section>
      )}

      <section id="visit" className="section surf">
        <div className="container row" style={{ gap: 28, alignItems: 'stretch' }}>
          <div className="card stack" style={{ flex: '1 1 340px', padding: 32, gap: 18 }}>
            <h2 style={{ fontSize: 30 }}>{t.visit.title}</h2>
            <div><div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>{t.visit.office}</div><div style={{ fontSize: 16, marginTop: 4 }}>{S(s, 'address', lang)}</div></div>
            <div><div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>{t.visit.phone}</div><a href={telLink(s)} style={{ fontSize: 16 }}>{S(s, 'phone', lang)}</a></div>
            <div><div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>{t.visit.email}</div><a href={`mailto:${S(s, 'email', 'en')}`} style={{ fontSize: 16 }}>{S(s, 'email', 'en')}</a></div>
            <div><div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>{t.visit.desk}</div><div style={{ fontSize: 16, marginTop: 4 }}>{S(s, 'hours', lang)}</div></div>
          </div>
          <div style={{ flex: '1 1 460px', minHeight: 320, borderRadius: 20, overflow: 'hidden', border: '1px solid var(--line)' }}>
            {S(s, 'map_embed_url', 'en')
              ? <iframe title="Map" src={S(s, 'map_embed_url', 'en')} style={{ border: 0, width: '100%', height: '100%', minHeight: 320 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              : <div className="ph" style={{ height: '100%', minHeight: 320 }}>{S(s, 'address', lang)}</div>}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <div className="res row between" style={{ borderRadius: 24, padding: '44px 40px', gap: 24 }}>
            <div style={{ flex: '1 1 360px' }}><h2 style={{ marginBottom: 8 }}>{t.cta.title}</h2><p style={{ color: '#c5d0ea' }}>{t.cta.sub}</p></div>
            <div className="row" style={{ gap: 12 }}>
              <a href={wa} className="btn btn-amber">{t.cta.whatsapp}</a>
              <a href={telLink(s)} className="btn" style={{ border: '1px solid #5a6c9e', color: '#fff' }}>{t.cta.call}</a>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
