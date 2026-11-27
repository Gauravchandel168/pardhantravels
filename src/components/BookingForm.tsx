'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';
import { inr } from '@/lib/util';

type Props = {
  lang: 'en' | 'hi';
  t: any;
  cars: any[];
  whatsappUrl: string;
  mode?: 'cab' | 'tour';
  fixedPickup?: string;
  fixedDrop?: string;
  distanceKm?: number;
  title?: string;
};

export default function BookingForm({ lang, t, cars, whatsappUrl, mode = 'cab', fixedPickup, fixedDrop, distanceKm, title }: Props) {
  const router = useRouter();
  const [trip, setTrip] = useState<'one-way' | 'round-trip' | 'airport' | 'local'>('one-way');
  const [carId, setCarId] = useState<string>(cars[1]?.id ?? cars[0]?.id ?? '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const car = cars.find((c) => c.id === carId);
  const carName = (c: any) => (lang === 'hi' && c.name_hi ? c.name_hi : c.name_en);
  const est = distanceKm && car ? Number(car.rate_per_km) * distanceKm * (trip === 'round-trip' ? 2 : 1) : null;
  const tripLabels: Record<string, string> = { 'one-way': t.oneWay, 'round-trip': t.roundTrip, airport: t.airport, local: t.local };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr('');
    const f = new FormData(e.currentTarget);
    if (f.get('website')) return; // spam trap
    const mobile = String(f.get('mobile') || '').trim();
    if (!/^[0-9+ ]{10,15}$/.test(mobile)) { setErr(t.invalid); return; }
    const pickup = fixedPickup ?? String(f.get('pickup') || '');
    const drop = fixedDrop ?? String(f.get('drop') || '');
    const date = String(f.get('date') || '');
    const time = String(f.get('time') || '');
    const notes = mode === 'tour' ? `${f.get('days') || '?'} days, ${f.get('people') || '?'} people` : '';
    setBusy(true);
    const { data, error } = await supabaseBrowser().rpc('create_booking', {
      p: {
        name: String(f.get('name') || ''), mobile,
        trip_type: mode === 'tour' ? 'Tour enquiry' : ({ 'one-way': 'One-way', 'round-trip': 'Round trip', airport: 'Airport', local: 'Local' } as any)[trip],
        pickup, drop_location: drop, car_type: car?.name_en ?? '',
        travel_date: date, travel_time: time, est_fare: est ?? '', notes,
      },
    });
    setBusy(false);
    if (error || !data) { setErr(t.error); return; }
    const q = new URLSearchParams({ ref: String(data), route: `${pickup} → ${drop}`, car: car?.name_en ?? '', date: `${date} ${time}`.trim(), fare: est ? String(Math.round(est)) : '' });
    router.push(`/thanks?${q.toString()}`);
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={submit} className="card stack" style={{ padding: 26, gap: 16 }} aria-label={title || t.title}>
      <h2 style={{ fontSize: 22 }}>{title || t.title}</h2>
      {mode === 'cab' && (
        <div role="group" aria-label={t.tripType} className="row" style={{ gap: 8 }}>
          {(['one-way', 'round-trip', 'airport', 'local'] as const).map((k) => (
            <button key={k} type="button" className="pill" aria-pressed={trip === k} onClick={() => setTrip(k)}>{tripLabels[k]}</button>
          ))}
        </div>
      )}
      <div className="grid g-2">
        <label className="f">{mode === 'tour' ? t.destination : t.pickup}
          {mode === 'tour'
            ? <input name="drop" required />
            : <input name="pickup" required defaultValue={fixedPickup} readOnly={!!fixedPickup} placeholder="Ambala Cantt" />}
        </label>
        {mode === 'cab' && (
          <label className="f">{t.drop}
            <input name="drop" required defaultValue={fixedDrop} readOnly={!!fixedDrop} placeholder="Chandigarh" />
          </label>
        )}
        <label className="f">{t.date}<input name="date" type="date" min={today} required /></label>
        {mode === 'cab'
          ? <label className="f">{t.time}<input name="time" type="time" required /></label>
          : <label className="f">{t.days}<input name="days" type="number" min={1} placeholder="5" /></label>}
        {mode === 'tour' && <label className="f">{t.people}<input name="people" type="number" min={1} placeholder="4" /></label>}
        <label className="f">{t.car}
          <select name="car" value={carId} onChange={(e) => setCarId(e.target.value)}>
            {cars.map((c) => <option key={c.id} value={c.id}>{carName(c)}</option>)}
          </select>
        </label>
        <label className="f">{t.name}<input name="name" autoComplete="name" /></label>
        <label className="f">{t.mobile}<input name="mobile" type="tel" required inputMode="tel" autoComplete="tel" placeholder="98XXXXXXXX" /></label>
      </div>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {est !== null && (
        <div className="muted" style={{ fontSize: 14 }}>{t.estimate}: <b style={{ color: 'var(--fg)', fontSize: 18 }}>{inr(est)}</b></div>
      )}
      {err && <div role="alert" className="err">{err}</div>}
      <div className="row" style={{ gap: 10 }}>
        <button type="submit" className="btn btn-primary" style={{ flex: '1 1 180px' }} disabled={busy}>{busy ? t.sending : mode === 'tour' ? t.plan : t.bookNow}</button>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ flex: '1 1 160px' }}>{t.whatsapp}</a>
      </div>
      <p className="muted" style={{ fontSize: 13 }}>{t.note}</p>
    </form>
  );
}
