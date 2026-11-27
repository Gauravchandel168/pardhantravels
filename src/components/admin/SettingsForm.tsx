'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';

type Item = { key: string; label: string; bilingual?: boolean; multiline?: boolean; help?: string };
const GROUPS: { title: string; items: Item[] }[] = [
  { title: 'Contact', items: [
    { key: 'phone', label: 'Phone number (shown on website)', help: 'Example: +91 98963 13950' },
    { key: 'whatsapp', label: 'WhatsApp number (digits only, with country code)', help: 'Example: 919896313950' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address', bilingual: true },
    { key: 'hours', label: 'Booking desk hours', bilingual: true },
    { key: 'gstin', label: 'GSTIN (optional)' },
    { key: 'map_embed_url', label: 'Google Maps embed link', help: 'Google Maps > Share > Embed a map > copy only the src="..." link.' },
  ]},
  { title: 'Trust', items: [
    { key: 'years', label: 'Years of experience', help: 'Just the number, for example 20' },
    { key: 'rating', label: 'Google rating (optional)', help: 'Example: 4.8. Leave empty to hide.' },
    { key: 'review_count', label: 'Number of Google reviews (optional)' },
    { key: 'google_review_url', label: 'Google reviews link (optional)' },
  ]},
  { title: 'Homepage text (leave empty to use the default text)', items: [
    { key: 'hero_h1a', label: 'Headline, first part', bilingual: true },
    { key: 'hero_h1b', label: 'Headline, highlighted part', bilingual: true },
    { key: 'hero_sub', label: 'Sub text under the headline', bilingual: true, multiline: true },
  ]},
  { title: 'Policies shown on the website', items: [
    { key: 'cancellation_policy', label: 'Cancellation policy (shown after a booking)', bilingual: true, multiline: true },
    { key: 'night_charges', label: 'Night and waiting charges (shown on route pages)', bilingual: true, multiline: true },
  ]},
];

export default function SettingsForm() {
  const sb = supabaseBrowser();
  const [vals, setVals] = useState<Record<string, { en: string; hi: string }>>({});
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    sb.from('settings').select('*').then(({ data, error }) => {
      if (error) { setMsg(error.message); return; }
      const m: any = {};
      (data ?? []).forEach((r: any) => (m[r.key] = { en: r.en, hi: r.hi }));
      setVals(m);
    });
    // eslint-disable-next-line
  }, []);

  const set = (k: string, lang: 'en' | 'hi', v: string) => setVals((x) => ({ ...x, [k]: { en: x[k]?.en ?? '', hi: x[k]?.hi ?? '', [lang]: v } }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg('');
    const all = GROUPS.flatMap((g) => g.items).map((i) => ({ key: i.key, en: vals[i.key]?.en ?? '', hi: vals[i.key]?.hi ?? '' }));
    const { error } = await sb.from('settings').upsert(all);
    setBusy(false);
    setMsg(error ? error.message : 'Saved. The website now shows the new details.');
  }

  return (
    <form onSubmit={save}>
      <div className="row between" style={{ marginBottom: 16 }}>
        <h1>Site settings</h1>
        <button className="btn btn-primary btn-sm" disabled={busy}>{busy ? 'Saving…' : 'Save all'}</button>
      </div>
      {msg && <div role="status" className="chip" style={{ marginBottom: 14, display: 'block', borderRadius: 10 }}>{msg}</div>}
      {GROUPS.map((g) => (
        <div key={g.title} className="panel stack" style={{ marginBottom: 20, gap: 16 }}>
          <h2 style={{ fontSize: 18 }}>{g.title}</h2>
          {g.items.map((i) => (
            <div key={i.key} className="grid" style={{ gridTemplateColumns: i.bilingual ? 'repeat(auto-fit, minmax(260px, 1fr))' : '1fr' }}>
              <label className="f">{i.label}{i.bilingual ? ' (English)' : ''}
                {i.multiline ? <textarea value={vals[i.key]?.en ?? ''} onChange={(e) => set(i.key, 'en', e.target.value)} /> : <input value={vals[i.key]?.en ?? ''} onChange={(e) => set(i.key, 'en', e.target.value)} />}
                {i.help && <span className="muted" style={{ fontWeight: 400, fontSize: 12 }}>{i.help}</span>}
              </label>
              {i.bilingual && (
                <label className="f">{i.label} (Hindi)
                  {i.multiline ? <textarea value={vals[i.key]?.hi ?? ''} onChange={(e) => set(i.key, 'hi', e.target.value)} /> : <input value={vals[i.key]?.hi ?? ''} onChange={(e) => set(i.key, 'hi', e.target.value)} />}
                </label>
              )}
            </div>
          ))}
        </div>
      ))}
    </form>
  );
}
