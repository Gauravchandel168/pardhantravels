'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  links: { href: string; label: string }[];
  callHref: string;
  callLabel: string;
  menuLabel: string;
  children: React.ReactNode; // language + theme toggles
};

export default function HeaderNav({ links, callHref, callLabel, menuLabel, children }: Props) {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="hnav">
      <a href={callHref} className="callmini" aria-label={callLabel}>
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>
      </a>
      <button type="button" className="hamb" aria-expanded={open} aria-controls="mnav" aria-label={menuLabel} onClick={() => setOpen((o) => !o)}>
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      <div id="mnav" className="hpanel" data-open={open}>
        <nav className="main" aria-label="Main">
          {links.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>)}
        </nav>
        <div className="hactions">
          {children}
          <a href={callHref} className="btn btn-amber btn-sm callfull">{callLabel}</a>
        </div>
      </div>
    </div>
  );
}
