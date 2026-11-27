export type Lang = 'en' | 'hi';
export type Settings = Record<string, { en: string; hi: string }>;

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export function S(settings: Settings, key: string, lang: Lang): string {
  const v = settings[key];
  if (!v) return '';
  return (lang === 'hi' && v.hi ? v.hi : v.en) || '';
}

export function pick(row: any, field: string, lang: Lang): string {
  if (!row) return '';
  const hi = row[`${field}_hi`];
  return (lang === 'hi' && hi ? hi : row[`${field}_en`]) || '';
}

export function inr(n: number | string | null | undefined): string {
  const v = Number(n);
  return '₹' + (isFinite(v) ? Math.round(v) : 0).toLocaleString('en-IN');
}

export function telLink(settings: Settings): string {
  return 'tel:' + S(settings, 'phone', 'en').replace(/[^+\d]/g, '');
}

export function waLink(settings: Settings, text = ''): string {
  const num = S(settings, 'whatsapp', 'en').replace(/\D/g, '');
  return `https://wa.me/${num}${text ? '?text=' + encodeURIComponent(text) : ''}`;
}

export function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
