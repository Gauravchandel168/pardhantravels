import type { Metadata } from 'next';
import Link from 'next/link';
import Shell from '@/components/Shell';
import BookingForm from '@/components/BookingForm';
import { dict, getLang } from '@/lib/i18n';
import { getCarTypes, getPackages, getSettings } from '@/lib/data';
import { inr, pick, waLink } from '@/lib/util';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Tour packages from Ambala',
  description: 'Car and driver for Shimla–Manali, Char Dham, Amritsar, Rajasthan, Haridwar–Rishikesh and Vaishno Devi tours from Ambala.',
};

export default async function Tours() {
  const lang = await getLang();
  const t = dict[lang];
  const [s, cars, packages] = await Promise.all([getSettings(), getCarTypes(), getPackages()]);
  return (
    <Shell>
      <section className="hero">
        <div className="container stack" style={{ gap: 18 }}>
          <p className="muted" style={{ fontSize: 14 }}><Link href="/" style={{ color: 'var(--link)' }}>{t.route.home}</Link> / {t.nav.tours}</p>
          <h1>{t.tours.title}</h1>
          <p className="muted" style={{ fontSize: 18, lineHeight: 1.6, maxWidth: 640 }}>{t.tours.sub}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 22 }}>
            {packages.map((p: any) => (
              <article key={p.id} className="card stack" style={{ padding: 0, overflow: 'hidden', gap: 0 }}>
                {p.image_url ? <img src={p.image_url} alt={pick(p, 'name', lang)} className="photo" style={{ height: 190 }} /> : <div className="ph photo" style={{ height: 190 }}>{pick(p, 'name', lang)}</div>}
                <div className="stack" style={{ padding: 24, gap: 12, flex: 1 }}>
                  <span className="amber" style={{ alignSelf: 'flex-start' }}>{p.nights} {t.tours.nights} / {p.days} {t.tours.days}</span>
                  <h2 style={{ fontSize: 22 }}>{pick(p, 'name', lang)}</h2>
                  <p className="muted" style={{ fontSize: 15, lineHeight: 1.6, flex: 1 }}>{pick(p, 'places', lang)}</p>
                  <div className="row between" style={{ borderTop: '1px solid var(--line)', paddingTop: 16 }}>
                    <span style={{ fontSize: 14 }}>{p.price ? <>{t.tours.carFare} <b>{inr(p.price)}</b>{p.price_note ? <span className="muted"> · {p.price_note}</span> : null}</> : t.tours.onRequest}</span>
                    <a className="btn btn-primary btn-sm" href={waLink(s, `Hi, I want to enquire about the ${p.name_en} package.`)}>{t.tours.enquire}</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="muted" style={{ marginTop: 20, fontSize: 13 }}>{t.tours.note}</p>
        </div>
      </section>

      <section id="plan" className="section surf">
        <div className="container row" style={{ gap: 40, alignItems: 'flex-start' }}>
          <div className="stack" style={{ flex: '1 1 320px', gap: 14 }}>
            <h2 style={{ fontSize: 38, lineHeight: 1.1 }}>{t.form.tourTitle}</h2>
            <p className="muted" style={{ fontSize: 16, lineHeight: 1.6 }}>{t.tours.customSub}</p>
          </div>
          <div style={{ flex: '1 1 460px', minWidth: 0 }}>
            <BookingForm lang={lang} t={t.form} cars={cars} whatsappUrl={waLink(s, 'Hi, I want to plan a trip.')} mode="tour" fixedPickup="Ambala" title={t.form.tourTitle} />
          </div>
        </div>
      </section>
    </Shell>
  );
}
