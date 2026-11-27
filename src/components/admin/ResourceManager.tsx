'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { slugify } from '@/lib/util';

export type Field = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'bool' | 'image' | 'date' | 'select';
  options?: string[];
  help?: string;
  half?: boolean;
};

type Props = {
  table: string;
  title: string;
  hint?: string;
  fields: Field[];
  columns: string[];
  orderBy?: string;
  descending?: boolean;
  defaults?: Record<string, any>;
  slugFrom?: string;
  addLabel?: string;
};

function soon(d?: string | null) {
  if (!d) return false;
  const days = (new Date(d).getTime() - Date.now()) / 86400000;
  return days < 30;
}

export default function ResourceManager({ table, title, hint, fields, columns, orderBy = 'created_at', descending, defaults = {}, slugFrom, addLabel = 'Add new' }: Props) {
  const sb = supabaseBrowser();
  const [rows, setRows] = useState<any[]>([]);
  const [edit, setEdit] = useState<any | null>(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const byKey = Object.fromEntries(fields.map((f) => [f.key, f]));

  async function load() {
    const { data, error } = await sb.from(table).select('*').order(orderBy, { ascending: !descending });
    if (error) setMsg(error.message); else setRows(data ?? []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg('');
    const payload: any = { ...edit };
    const id = payload.id;
    delete payload.id; delete payload.created_at;
    if (slugFrom && !payload.slug) payload.slug = slugify(String(payload[slugFrom] || ''));
    fields.forEach((f) => {
      if (f.type === 'number') payload[f.key] = payload[f.key] === '' || payload[f.key] == null ? null : Number(payload[f.key]);
      if (f.type === 'date' && !payload[f.key]) payload[f.key] = null;
    });
    const q = id ? sb.from(table).update(payload).eq('id', id) : sb.from(table).insert(payload);
    const { error } = await q;
    setBusy(false);
    if (error) { setMsg(error.message); return; }
    setEdit(null); setMsg('Saved.'); load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    const { error } = await sb.from(table).delete().eq('id', id);
    if (error) setMsg(error.message); else { setMsg('Deleted.'); load(); }
  }

  async function upload(key: string, file: File) {
    setMsg('Uploading…');
    const path = `${table}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const { error } = await sb.storage.from('media').upload(path, file);
    if (error) { setMsg(error.message); return; }
    const { data } = sb.storage.from('media').getPublicUrl(path);
    setEdit((x: any) => ({ ...x, [key]: data.publicUrl }));
    setMsg('Image uploaded. Press Save to keep it.');
  }

  function cell(r: any, key: string) {
    const f = byKey[key];
    const v = r[key];
    if (f?.type === 'bool') return v ? 'Yes' : 'No';
    if (f?.type === 'image') return v ? <img src={v} alt="" style={{ width: 44, height: 32, objectFit: 'cover', borderRadius: 4 }} /> : '–';
    if (f?.type === 'date') return <span className={soon(v) ? 'warn' : ''}>{v || '–'}</span>;
    if (v == null || v === '') return '–';
    const s = String(v);
    return s.length > 60 ? s.slice(0, 60) + '…' : s;
  }

  return (
    <section style={{ marginBottom: 40 }}>
      <div className="row between" style={{ marginBottom: 6 }}>
        <h1>{title}</h1>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => { setMsg(''); setEdit({ ...defaults }); }}>{addLabel}</button>
      </div>
      {hint && <p className="muted" style={{ fontSize: 14, marginBottom: 16 }}>{hint}</p>}
      {msg && <div role="status" className="chip" style={{ marginBottom: 14, display: 'block', borderRadius: 10 }}>{msg}</div>}

      {edit && (
        <form onSubmit={save} className="panel stack" style={{ marginBottom: 24, gap: 16 }}>
          <h2 style={{ fontSize: 20 }}>{edit.id ? 'Edit' : 'New'}</h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {fields.map((f) => (
              <label key={f.key} className="f" style={f.type === 'textarea' || f.type === 'image' ? { gridColumn: '1 / -1' } : undefined}>
                {f.label}
                {f.type === 'textarea' ? (
                  <textarea value={edit[f.key] ?? ''} onChange={(e) => setEdit({ ...edit, [f.key]: e.target.value })} />
                ) : f.type === 'bool' ? (
                  <input type="checkbox" checked={!!edit[f.key]} onChange={(e) => setEdit({ ...edit, [f.key]: e.target.checked })} style={{ width: 22, height: 22 }} />
                ) : f.type === 'select' ? (
                  <select value={edit[f.key] ?? ''} onChange={(e) => setEdit({ ...edit, [f.key]: e.target.value })}>{f.options!.map((o) => <option key={o}>{o}</option>)}</select>
                ) : f.type === 'image' ? (
                  <span className="row" style={{ gap: 12 }}>
                    {edit[f.key] ? <img src={edit[f.key]} alt="" style={{ width: 96, height: 64, objectFit: 'cover', borderRadius: 8 }} /> : null}
                    <input type="file" accept="image/*" style={{ height: 'auto', width: 'auto', border: 0, padding: 0 }} onChange={(e) => e.target.files?.[0] && upload(f.key, e.target.files[0])} />
                    {edit[f.key] ? <button type="button" className="btn btn-outline btn-sm" onClick={() => setEdit({ ...edit, [f.key]: '' })}>Remove</button> : null}
                  </span>
                ) : (
                  <input type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'} step={f.type === 'number' ? 'any' : undefined} value={edit[f.key] ?? ''} onChange={(e) => setEdit({ ...edit, [f.key]: e.target.value })} />
                )}
                {f.help && <span className="muted" style={{ fontWeight: 400, fontSize: 12 }}>{f.help}</span>}
              </label>
            ))}
          </div>
          <div className="row" style={{ gap: 10 }}>
            <button className="btn btn-primary btn-sm" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setEdit(null)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="scroll-x">
        <table className="tbl">
          <thead><tr>{columns.map((c) => <th key={c}>{byKey[c]?.label ?? c}</th>)}<th /></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                {columns.map((c) => <td key={c}>{cell(r, c)}</td>)}
                <td style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
                  <button type="button" className="btn btn-outline btn-sm" style={{ height: 36 }} onClick={() => { setMsg(''); setEdit({ ...r }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</button>{' '}
                  <button type="button" className="btn btn-outline btn-sm" style={{ height: 36, color: '#c0392b' }} onClick={() => remove(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={columns.length + 1} className="muted">Nothing here yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
