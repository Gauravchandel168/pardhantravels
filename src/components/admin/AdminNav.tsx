'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';
import ThemeToggle from '../ThemeToggle';

const links = [
  ['/admin', 'Bookings'],
  ['/admin/cars', 'Car types and rates'],
  ['/admin/routes', 'Routes'],
  ['/admin/packages', 'Tour packages'],
  ['/admin/fleet', 'Drivers and vehicles'],
  ['/admin/reviews', 'Reviews'],
  ['/admin/faqs', 'FAQs'],
  ['/admin/settings', 'Site settings'],
];

export default function AdminNav() {
  const path = usePathname();
  const router = useRouter();
  async function out() { await supabaseBrowser().auth.signOut(); router.push('/admin/login'); router.refresh(); }
  return (
    <aside>
      <div className="row" style={{ gap: 10, padding: '0 8px', justifyContent: 'space-between' }}>
        <span className="logo" style={{ fontSize: 17 }}><b style={{ width: 34, height: 34 }}>P</b>Admin</span>
        <ThemeToggle />
      </div>
      <nav aria-label="Admin" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="nav" aria-current={path === href ? 'page' : undefined}>{label}</Link>
        ))}
        <a href="/" className="nav" style={{ marginTop: 12 }} target="_blank" rel="noopener noreferrer">View website ↗</a>
        <button type="button" className="nav" onClick={out} style={{ textAlign: 'left', border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--fg3)' }}>Sign out</button>
      </nav>
    </aside>
  );
}
