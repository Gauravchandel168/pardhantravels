# Pardhan Travels – website + admin panel

Next.js 16 (React) + Supabase (database, login, image storage). Hindi + English, light + dark mode.

## Setup (about 15 minutes)

1. Create a free project at https://supabase.com.
2. Supabase → SQL Editor → paste all of `supabase/schema.sql` → Run.
3. Supabase → Authentication → Users → Add user (email + password) for each owner (2 users).
4. In SQL Editor run, with your emails:
   `insert into admins(user_id) select id from auth.users where email in ('you@example.com','uncle@example.com');`
5. Copy `.env.example` to `.env.local` and fill the values from Supabase → Project Settings → API:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL` (your domain).
6. `npm install` then `npm run dev` → http://localhost:3000. Admin: http://localhost:3000/admin

## Deploy
Push to GitHub → import in Vercel → add the same 3 environment variables → connect your domain.

## What the admin controls
Bookings (status, driver, final fare, advance), car types and per-km rates, routes, tour packages,
drivers and vehicles (expiry warnings), reviews, FAQs, and site settings (phone, address, hours,
homepage text, policies, rating, map).

## Before going live
- The seeded car rates (11/12/16/18/24 per km) and route distances are SAMPLES. Set real ones in admin.
- Add real photos, GSTIN, Google Maps embed link and real reviews in admin.
- Check cancellation and night-charge policy text in Site settings.
# pardhantravels
