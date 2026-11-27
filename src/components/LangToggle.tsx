'use client';
import { useRouter } from 'next/navigation';

export default function LangToggle({ lang }: { lang: 'en' | 'hi' }) {
  const router = useRouter();
  function set(l: 'en' | 'hi') {
    document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }
  return (
    <div role="group" aria-label="Language" style={{ display: 'flex', border: '1px solid var(--field-line)', borderRadius: 999, overflow: 'hidden' }}>
      <button type="button" className="pill" style={{ border: 0, borderRadius: 0, height: 42 }} aria-pressed={lang === 'en'} onClick={() => set('en')}>EN</button>
      <button type="button" className="pill" style={{ border: 0, borderRadius: 0, height: 42 }} aria-pressed={lang === 'hi'} onClick={() => set('hi')}>हिं</button>
    </div>
  );
}
