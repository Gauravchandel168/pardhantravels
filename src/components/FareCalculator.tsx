'use client';
import { useState } from 'react';
import { inr } from '@/lib/util';

export default function FareCalculator({ lang, t, cars }: { lang: 'en' | 'hi'; t: any; cars: any[] }) {
  const [carId, setCarId] = useState<string>(cars[1]?.id ?? cars[0]?.id ?? '');
  const [km, setKm] = useState<string>('50');
  const [round, setRound] = useState(false);
  const car = cars.find((c) => c.id === carId);
  const total = (Number(km) || 0) * (round ? 2 : 1);
  const fare = car ? total * Number(car.rate_per_km) : 0;
  const name = (c: any) => (lang === 'hi' && c.name_hi ? c.name_hi : c.name_en);
  if (!cars.length) return null;
  return (
    <div className="card stack" style={{ padding: 26, gap: 18 }}>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
        {cars.map((c) => (
          <button key={c.id} type="button" className="opt" aria-pressed={carId === c.id} onClick={() => setCarId(c.id)}>
            <span style={{ display: 'block', fontWeight: 600 }}>{name(c)}</span>
            <span className="muted" style={{ display: 'block', fontSize: 13, marginTop: 4 }}>{inr(c.rate_per_km)}/km</span>
          </button>
        ))}
      </div>
      <div className="row" style={{ alignItems: 'flex-end', gap: 20 }}>
        <label className="f" style={{ flex: '1 1 200px' }}>{t.distance}
          <input type="number" min={1} value={km} onChange={(e) => setKm(e.target.value)} style={{ height: 52, fontSize: 18 }} />
        </label>
        <label className="row" style={{ gap: 10, minHeight: 52, fontSize: 15 }}>
          <input type="checkbox" checked={round} onChange={(e) => setRound(e.target.checked)} style={{ width: 20, height: 20 }} />{t.round}
        </label>
      </div>
      <div className="res row between" style={{ gap: 16 }}>
        <div>
          <div style={{ fontSize: 14, color: '#c5d0ea' }}>{t.estimated} · {car ? name(car) : ''} · {total} km</div>
          <div className="price">{inr(fare)}</div>
        </div>
        <a href="#book" className="btn btn-amber">{t.book}</a>
      </div>
    </div>
  );
}
