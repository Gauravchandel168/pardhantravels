import { cache } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { Settings } from './util';

const client = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'missing-key',
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

const DEFAULT_SETTINGS: Settings = {
  phone: { en: '+91 98963 13950', hi: '' },
  whatsapp: { en: '919896313950', hi: '' },
  email: { en: 'taxport001@gmail.com', hi: '' },
  address: { en: 'VPO Nahoni, Ambala, Haryana', hi: 'VPO नाहोनी, अंबाला, हरियाणा' },
  hours: { en: 'Open 24×7', hi: '24×7 खुला' },
  years: { en: '20', hi: '' },
};

async function rows<T = any>(table: string, order: string): Promise<T[]> {
  try {
    const { data, error } = await client().from(table).select('*').order(order, { ascending: true });
    if (error) return [];
    return (data as T[]) ?? [];
  } catch {
    return [];
  }
}

export const getSettings = cache(async (): Promise<Settings> => {
  const out: Settings = { ...DEFAULT_SETTINGS };
  try {
    const { data } = await client().from('settings').select('*');
    (data ?? []).forEach((r: any) => (out[r.key] = { en: r.en ?? '', hi: r.hi ?? '' }));
  } catch {}
  return out;
});

export const getCarTypes = cache(() => rows('car_types', 'sort'));
export const getRoutes = cache(() => rows('routes', 'sort'));
export const getPackages = cache(() => rows('packages', 'sort'));
export const getFaqs = cache(() => rows('faqs', 'sort'));
export const getReviews = cache(async () => {
  const r = await rows('reviews', 'created_at');
  return r.reverse();
});
export const getRoute = cache(async (slug: string) => (await getRoutes()).find((r: any) => r.slug === slug) ?? null);
