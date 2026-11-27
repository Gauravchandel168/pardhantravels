import type { Metadata } from 'next';
import Link from 'next/link';
import Shell from '@/components/Shell';
import { dict, getLang } from '@/lib/i18n';
import { getSettings } from '@/lib/data';
import { S, inr, waLink } from '@/lib/util';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Booking received', robots: { index: false } };

export default async function Thanks({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const q = await searchParams;
  const one = (k: string) => String(Array.isArray(q[k]) ? q[k]![0] : q[k] ?? '').slice(0, 120);
  const lang = await getLang();
  const t = dict[lang];
  const s = await getSettings();
  const ref = one('ref');
  const msg = `Hi, my booking reference is ${ref}. Route: ${one('route')}. ${one('date') ? 'Pickup: ' + one('date') + '.' : ''}`;
  return (
    <Shell>
      <section className="hero" style={{ minHeight: '60vh' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 64, height: 64, borderRadius: 999, background: 'var(--tint)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
            </div>
            <h1 style={{ fontSize: 38, marginBottom: 10 }}>{t.thanks.title}</h1>
            <p className="muted" style={{ fontSize: 17 }}>{t.thanks.ref} <b style={{ color: 'var(--fg)' }}>{ref}</b>. {t.thanks.soon}</p>
          </div>
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 20, marginBottom: 16 }}>{t.thanks.summary}</h2>
            <div className="grid" style={{ gridTemplateColumns: '140px 1fr', gap: '14px 16px', fontSize: 15 }}>
              <span className="muted">{t.thanks.route}</span><b>{one('route')}</b>
              {one('date') && <><span className="muted">{t.thanks.pickup}</span><b>{one('date')}</b></>}
              {one('car') && <><span className="muted">{t.thanks.car}</span><b>{one('car')}</b></>}
              {one('fare') && <><span className="muted">{t.thanks.fare}</span><b style={{ color: 'var(--link)', fontSize: 18 }}>{inr(one('fare'))}</b></>}
            </div>
          </div>
          <div className="card" style={{ padding: 28, marginTop: 18 }}>
            <h2 style={{ fontSize: 20, marginBottom: 16 }}>{t.thanks.next}</h2>
            <div className="stack" style={{ gap: 16 }}>
              {t.thanks.steps.map((x: string, i: number) => (<div key={i} className="row" style={{ gap: 14, flexWrap: 'nowrap', alignItems: 'flex-start' }}><span className="step" style={{ margin: 0, flex: '0 0 32px', width: 32, height: 32 }}>{i + 1}</span><span className="muted" style={{ lineHeight: 1.6 }}>{x}</span></div>))}
            </div>
          </div>
          {S(s, 'cancellation_policy', lang) && <p className="muted" style={{ textAlign: 'center', marginTop: 20, fontSize: 13 }}>{S(s, 'cancellation_policy', lang)}</p>}
          <div className="row" style={{ justifyContent: 'center', marginTop: 24, gap: 12 }}>
            <a href={waLink(s, msg)} className="btn btn-primary">{t.thanks.chat}</a>
            <Link href="/" className="btn btn-outline">{t.thanks.home}</Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
