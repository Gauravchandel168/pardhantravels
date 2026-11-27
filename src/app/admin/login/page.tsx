'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function Login() {
  const router = useRouter();
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(''); setBusy(true);
    const f = new FormData(e.currentTarget);
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email: String(f.get('email')), password: String(f.get('password')) });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    router.push('/admin'); router.refresh();
  }
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--surf)' }}>
      <form onSubmit={submit} className="card stack" style={{ width: '100%', maxWidth: 400, padding: 32, gap: 16 }}>
        <div className="logo"><b>P</b><span>Pardhan Travels</span></div>
        <h1 style={{ fontSize: 24 }}>Admin login</h1>
        <label className="f">Email<input name="email" type="email" required autoComplete="email" /></label>
        <label className="f">Password<input name="password" type="password" required autoComplete="current-password" /></label>
        {err && <div role="alert" className="err">{err}</div>}
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </main>
  );
}
