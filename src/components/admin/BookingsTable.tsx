'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { inr } from '@/lib/util';

const STATUSES = ['New', 'Confirmed', 'On trip', 'Completed', 'Cancelled'];
const CHIP: Record<string, [string, string]> = {
  New: ['var(--warn-bg)', 'var(--warn-fg)'], Confirmed: ['var(--info-bg)', 'var(--info-fg)'], 'On trip': ['var(--ok-bg)', 'var(--ok-fg)'],
  Completed: ['var(--mute-bg)', 'var(--mute-fg)'], Cancelled: ['var(--mute-bg)', 'var(--mute-fg)'],
};

export default function BookingsTable() {
  const sb = supabaseBrowser();
  const [rows, setRows] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [tab, setTab] = useState('All');
  const [q, setQ] = useState('');
  const [msg, setMsg] = useState('');

  async function load() {
    const [b, d] = await Promise.all([
      sb.from('bookings').select('*').order('created_at', { ascending: false }),
      sb.from('drivers').select('id,name').order('name'),
    ]);
    if (b.error) setMsg(b.error.message); else setRows(b.data ?? []);
    setDrivers(d.data ?? []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  async function patch(id: string, values: any) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...values } : r)));
    const { error } = await sb.from('bookings').update(values).eq('id', id);
    setMsg(error ? error.message : 'Saved.');
  }

  const count = (s: string) => (s === 'All' ? rows.length : rows.filter((r) => r.status === s).length);
  const shown = rows.filter((r) => (tab === 'All' || r.status === tab) && (!q || `${r.ref} ${r.name} ${r.mobile} ${r.pickup} ${r.drop_location}`.toLowerCase().includes(q.toLowerCase())));
  const done = rows.filter((r) => r.status === 'Completed');
  const earned = done.reduce((a, r) => a + Number(r.final_fare ?? r.est_fare ?? 0), 0);

  return (
    <section>
      <div className="row between" style={{ marginBottom: 20 }}>
        <h1>Bookings</h1>
        <input className="in" style={{ maxWidth: 280 }} placeholder="Search name, mobile or ID" aria-label="Search bookings" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="grid g-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 24 }}>
        <div className="stat"><span className="muted" style={{ fontSize: 13 }}>Total bookings</span><b>{rows.length}</b></div>
        <div className="stat"><span className="muted" style={{ fontSize: 13 }}>New, need action</span><b>{count('New')}</b></div>
        <div className="stat"><span className="muted" style={{ fontSize: 13 }}>Cars on trip</span><b>{count('On trip')}</b></div>
        <div className="stat"><span className="muted" style={{ fontSize: 13 }}>Completed value</span><b>{inr(earned)}</b></div>
      </div>
      <div role="group" aria-label="Filter by status" className="row" style={{ gap: 8, marginBottom: 16 }}>
        {['All', ...STATUSES].map((s) => <button key={s} type="button" className="pill" aria-pressed={tab === s} onClick={() => setTab(s)}>{s} · {count(s)}</button>)}
      </div>
      {msg && <div role="status" className="chip" style={{ marginBottom: 14, display: 'block', borderRadius: 10 }}>{msg}</div>}
      <div className="scroll-x">
        <table className="tbl" style={{ minWidth: 1100 }}>
          <thead><tr><th>ID</th><th>Customer</th><th>Trip</th><th>Pickup</th><th>Status</th><th>Driver</th><th>Est. fare</th><th>Final fare</th><th>Advance</th></tr></thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id}>
                <td><b>{r.ref}</b><br /><span className="muted" style={{ fontSize: 12 }}>{new Date(r.created_at).toLocaleDateString('en-IN')}</span></td>
                <td>{r.name || '–'}<br /><a href={`tel:${r.mobile}`} style={{ color: 'var(--link)' }}>{r.mobile}</a>{' · '}<a href={`https://wa.me/${r.mobile.replace(/\D/g, '').replace(/^(\d{10})$/, '91$1')}?text=${encodeURIComponent(`Hello from Pardhan Travels. Your booking ${r.ref} is confirmed.`)}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--link)' }}>WhatsApp</a></td>
                <td>{r.pickup} → {r.drop_location}<br /><span className="muted" style={{ fontSize: 12 }}>{r.trip_type} · {r.car_type}{r.notes ? ` · ${r.notes}` : ''}</span></td>
                <td>{r.travel_date || '–'}{r.travel_time ? <><br /><span className="muted" style={{ fontSize: 12 }}>{String(r.travel_time).slice(0, 5)}</span></> : null}</td>
                <td>
                  <select aria-label="Status" value={r.status} onChange={(e) => patch(r.id, { status: e.target.value })} style={{ background: CHIP[r.status]?.[0], color: CHIP[r.status]?.[1], fontWeight: 600 }}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td>
                  <select aria-label="Driver" value={r.driver_id ?? ''} onChange={(e) => patch(r.id, { driver_id: e.target.value || null })} style={{ maxWidth: 150 }}>
                    <option value="">Assign driver</option>
                    {drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </td>
                <td>{r.est_fare ? inr(r.est_fare) : '–'}</td>
                <td><input type="number" aria-label="Final fare" style={{ width: 96 }} defaultValue={r.final_fare ?? ''} onBlur={(e) => patch(r.id, { final_fare: e.target.value === '' ? null : Number(e.target.value) })} /></td>
                <td><input type="number" aria-label="Advance paid" style={{ width: 88 }} defaultValue={r.advance_paid ?? 0} onBlur={(e) => patch(r.id, { advance_paid: Number(e.target.value) || 0 })} /></td>
              </tr>
            ))}
            {!shown.length && <tr><td colSpan={9} className="muted">No bookings yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
