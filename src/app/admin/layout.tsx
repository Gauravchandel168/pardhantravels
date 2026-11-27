import type { Metadata } from 'next';
import { supabaseServer } from '@/lib/supabase/server';
import AdminNav from '@/components/admin/AdminNav';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sb = await supabaseServer();
  const { data } = await sb.auth.getUser();
  if (!data.user) return <>{children}</>; // the login page
  const { data: ok } = await sb.rpc('is_admin');
  if (!ok) {
    return (
      <main style={{ maxWidth: 520, margin: '15vh auto', padding: 24 }}>
        <h1 style={{ fontSize: 26, marginBottom: 12 }}>No admin access</h1>
        <p className="muted">You are signed in as {data.user.email}, but this account is not an admin. Ask the site owner to add it to the admins table.</p>
        <a className="btn btn-outline" style={{ marginTop: 20 }} href="/admin/login">Back to login</a>
      </main>
    );
  }
  return (
    <div className="admin">
      <AdminNav />
      <main>{children}</main>
    </div>
  );
}
