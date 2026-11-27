import Link from 'next/link';
import { getSettings } from '@/lib/data';
import { dict, getLang } from '@/lib/i18n';
import { S, telLink } from '@/lib/util';
import ThemeToggle from './ThemeToggle';
import LangToggle from './LangToggle';

export default async function Shell({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  const t = dict[lang];
  const s = await getSettings();
  const phone = S(s, 'phone', lang);
  return (
    <>
      <header className="site">
        <div className="container">
          <Link href="/" className="logo"><b>P</b><span>Pardhan Travels</span></Link>
          <nav className="main" aria-label="Main">
            <Link href="/#fleet">{t.nav.cars}</Link>
            <Link href="/#fare">{t.nav.fares}</Link>
            <Link href="/#routes">{t.nav.routes}</Link>
            <Link href="/tours">{t.nav.tours}</Link>
            <Link href="/#reviews">{t.nav.reviews}</Link>
            <Link href="/#visit">{t.nav.contact}</Link>
          </nav>
          <div className="row" style={{ gap: 10 }}>
            <LangToggle lang={lang} />
            <ThemeToggle />
            <a href={telLink(s)} className="btn btn-amber btn-sm">{t.nav.call} {phone}</a>
          </div>
        </div>
      </header>
      {children}
      <footer className="site">
        <div className="container row between" style={{ alignItems: 'flex-start', gap: 36 }}>
          <div style={{ flex: '1 1 260px' }}>
            <div style={{ fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 8 }}>Pardhan Travels</div>
            <p style={{ lineHeight: 1.7, fontSize: 14 }}>{S(s, 'address', lang)}{S(s, 'gstin', 'en') ? <><br />GSTIN {S(s, 'gstin', 'en')}</> : null}</p>
          </div>
          <div style={{ flex: '1 1 200px', fontSize: 14, lineHeight: 2 }}>
            <h4>{t.footer.contact}</h4>
            <a href={telLink(s)}>{phone}</a><br /><a href={`mailto:${S(s, 'email', 'en')}`}>{S(s, 'email', 'en')}</a>
          </div>
          <div style={{ flex: '1 1 200px', fontSize: 14, lineHeight: 2 }}>
            <h4>{t.footer.services}</h4>{t.footer.servicesText}
          </div>
          <div style={{ flex: '1 1 160px', fontSize: 14, lineHeight: 2 }}>
            <h4>{t.footer.explore}</h4>
            <Link href="/tours">{t.nav.tours}</Link><br /><Link href="/#reviews">{t.nav.reviews}</Link><br /><Link href="/#faq">FAQ</Link>
          </div>
        </div>
        <div className="container" style={{ marginTop: 28, fontSize: 13, opacity: 0.8 }}>© {new Date().getFullYear()} Pardhan Travels. {t.footer.rights}</div>
      </footer>
    </>
  );
}
