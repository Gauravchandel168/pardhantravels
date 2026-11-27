-- Pardhan Travels — database schema. Run this whole file once in Supabase: SQL Editor > New query > Run.

create extension if not exists pgcrypto;

-- ---------- tables ----------
create table if not exists settings (
  key text primary key,
  en text not null default '',
  hi text not null default ''
);

create table if not exists car_types (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_hi text not null default '',
  models text not null default '',
  seats text not null default '',
  rate_per_km numeric not null default 0,
  min_km_per_day int not null default 250,
  night_halt numeric not null default 0,
  waiting_per_hour numeric not null default 0,
  image_url text not null default '',
  sort int not null default 0,
  active boolean not null default true
);

create table if not exists routes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  to_en text not null,
  to_hi text not null default '',
  distance_km int not null default 0,
  duration_text text not null default '',
  intro_en text not null default '',
  intro_hi text not null default '',
  image_url text not null default '',
  sort int not null default 0,
  active boolean not null default true
);

create table if not exists packages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_hi text not null default '',
  nights int not null default 0,
  days int not null default 1,
  places_en text not null default '',
  places_hi text not null default '',
  price numeric,
  price_note text not null default '',
  image_url text not null default '',
  sort int not null default 0,
  active boolean not null default true
);

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  q_en text not null,
  q_hi text not null default '',
  a_en text not null,
  a_hi text not null default '',
  sort int not null default 0,
  active boolean not null default true
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating int not null default 5 check (rating between 1 and 5),
  text text not null,
  route text not null default '',
  source text not null default 'Google',
  status text not null default 'pending' check (status in ('pending','published','hidden')),
  created_at timestamptz not null default now()
);

create table if not exists drivers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null default '',
  licence_expiry date,
  assigned_vehicle text not null default '',
  status text not null default 'Available',
  created_at timestamptz not null default now()
);

create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  reg_number text unique not null,
  model text not null default '',
  seats int not null default 4,
  insurance_expiry date,
  permit_expiry date,
  fitness_expiry date,
  status text not null default 'Available',
  created_at timestamptz not null default now()
);

create sequence if not exists booking_seq start 1001;

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  ref text unique not null,
  created_at timestamptz not null default now(),
  name text not null default '',
  mobile text not null,
  trip_type text not null default '',
  pickup text not null default '',
  drop_location text not null default '',
  car_type text not null default '',
  travel_date date,
  travel_time time,
  est_fare numeric,
  notes text not null default '',
  status text not null default 'New',
  driver_id uuid references drivers(id) on delete set null,
  final_fare numeric,
  advance_paid numeric not null default 0
);

create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- ---------- admin check ----------
create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- ---------- public booking function (the only way customers write data) ----------
create or replace function create_booking(p jsonb) returns text
language plpgsql security definer set search_path = public as $$
declare v_ref text;
begin
  if coalesce(trim(p->>'mobile'), '') !~ '^[0-9+ ]{10,15}$' then
    raise exception 'invalid mobile number';
  end if;
  v_ref := 'PT-' || nextval('booking_seq');
  insert into bookings (ref, name, mobile, trip_type, pickup, drop_location, car_type, travel_date, travel_time, est_fare, notes)
  values (
    v_ref,
    left(coalesce(p->>'name', ''), 80),
    trim(p->>'mobile'),
    left(coalesce(p->>'trip_type', ''), 40),
    left(coalesce(p->>'pickup', ''), 120),
    left(coalesce(p->>'drop_location', ''), 120),
    left(coalesce(p->>'car_type', ''), 60),
    nullif(p->>'travel_date', '')::date,
    nullif(p->>'travel_time', '')::time,
    nullif(p->>'est_fare', '')::numeric,
    left(coalesce(p->>'notes', ''), 300)
  );
  return v_ref;
end $$;
grant execute on function create_booking(jsonb) to anon, authenticated;

-- ---------- row level security ----------
alter table settings enable row level security;
alter table car_types enable row level security;
alter table routes enable row level security;
alter table packages enable row level security;
alter table faqs enable row level security;
alter table reviews enable row level security;
alter table drivers enable row level security;
alter table vehicles enable row level security;
alter table bookings enable row level security;
alter table admins enable row level security;

-- everyone can read the public website content
create policy "public read settings" on settings for select using (true);
create policy "public read car_types" on car_types for select using (active);
create policy "public read routes" on routes for select using (active);
create policy "public read packages" on packages for select using (active);
create policy "public read faqs" on faqs for select using (active);
create policy "public read reviews" on reviews for select using (status = 'published');

-- admins can do everything
create policy "admin all settings" on settings for all using (is_admin()) with check (is_admin());
create policy "admin all car_types" on car_types for all using (is_admin()) with check (is_admin());
create policy "admin all routes" on routes for all using (is_admin()) with check (is_admin());
create policy "admin all packages" on packages for all using (is_admin()) with check (is_admin());
create policy "admin all faqs" on faqs for all using (is_admin()) with check (is_admin());
create policy "admin all reviews" on reviews for all using (is_admin()) with check (is_admin());
create policy "admin all drivers" on drivers for all using (is_admin()) with check (is_admin());
create policy "admin all vehicles" on vehicles for all using (is_admin()) with check (is_admin());
create policy "admin all bookings" on bookings for all using (is_admin()) with check (is_admin());
create policy "admin read self" on admins for select using (user_id = auth.uid());

-- ---------- image storage ----------
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;
create policy "media public read" on storage.objects for select using (bucket_id = 'media');
create policy "media admin insert" on storage.objects for insert with check (bucket_id = 'media' and is_admin());
create policy "media admin update" on storage.objects for update using (bucket_id = 'media' and is_admin());
create policy "media admin delete" on storage.objects for delete using (bucket_id = 'media' and is_admin());

-- ---------- starting content (edit everything later from the admin panel) ----------
insert into settings (key, en, hi) values
  ('phone', '+91 98963 13950', ''),
  ('whatsapp', '919896313950', ''),
  ('email', 'taxport001@gmail.com', ''),
  ('address', 'VPO Nahoni, Ambala, Haryana', 'VPO नाहोनी, अंबाला, हरियाणा'),
  ('hours', 'Open 24×7', '24×7 खुला'),
  ('years', '20', '')
on conflict (key) do nothing;

-- SAMPLE RATES: set your real per-km rates in Admin > Car types
insert into car_types (slug, name_en, name_hi, models, seats, rate_per_km, min_km_per_day, night_halt, waiting_per_hour, sort) values
  ('hatchback', 'Hatchback', 'हैचबैक', 'Swift, WagonR', '4 seats', 11, 250, 300, 100, 1),
  ('sedan', 'Sedan', 'सेडान', 'Dzire, Etios, Aura', '4 seats', 12, 250, 300, 100, 2),
  ('suv', 'SUV', 'SUV', 'Ertiga, XUV700, Scorpio-N', '6–7 seats', 16, 250, 400, 150, 3),
  ('innova-crysta', 'Innova Crysta', 'इनोवा क्रिस्टा', 'Toyota Innova Crysta', '7 seats', 18, 250, 500, 200, 4),
  ('tempo-traveller', 'Tempo Traveller', 'टेम्पो ट्रैवलर', 'Force Traveller', '12–17 seats', 24, 300, 600, 250, 5)
on conflict (slug) do nothing;

-- Distances are approximate: check them in Admin > Routes
insert into routes (slug, to_en, to_hi, distance_km, duration_text, intro_en, intro_hi, sort) values
  ('chandigarh', 'Chandigarh', 'चंडीगढ़', 50, '1 hr', 'Book a clean AC cab from Ambala to Chandigarh with a verified driver. One-way and round trips, any time of day.', 'अंबाला से चंडीगढ़ के लिए साफ AC कैब बुक करें, वेरिफाइड ड्राइवर के साथ। वन-वे और राउंड ट्रिप, दिन या रात।', 1),
  ('delhi', 'Delhi', 'दिल्ली', 200, '4 hr', 'Book a clean AC cab from Ambala to Delhi with a verified driver. One-way and round trips, any time of day.', 'अंबाला से दिल्ली के लिए साफ AC कैब बुक करें, वेरिफाइड ड्राइवर के साथ। वन-वे और राउंड ट्रिप, दिन या रात।', 2),
  ('delhi-airport', 'Delhi Airport (IGI)', 'दिल्ली एयरपोर्ट (IGI)', 215, '4.5 hr', 'Airport drop and pickup between Ambala and Delhi IGI, timed to your flight.', 'अंबाला से दिल्ली IGI एयरपोर्ट ड्रॉप और पिकअप, आपकी फ्लाइट के समय पर।', 3),
  ('shimla', 'Shimla', 'शिमला', 150, '4 hr', 'Book a clean AC cab from Ambala to Shimla with a verified driver. One-way and round trips, any time of day.', 'अंबाला से शिमला के लिए साफ AC कैब बुक करें, वेरिफाइड ड्राइवर के साथ। वन-वे और राउंड ट्रिप, दिन या रात।', 4),
  ('haridwar', 'Haridwar', 'हरिद्वार', 200, '4.5 hr', 'Book a clean AC cab from Ambala to Haridwar with a verified driver. One-way and round trips, any time of day.', 'अंबाला से हरिद्वार के लिए साफ AC कैब बुक करें, वेरिफाइड ड्राइवर के साथ। वन-वे और राउंड ट्रिप, दिन या रात।', 5),
  ('amritsar', 'Amritsar', 'अमृतसर', 250, '5 hr', 'Book a clean AC cab from Ambala to Amritsar with a verified driver. One-way and round trips, any time of day.', 'अंबाला से अमृतसर के लिए साफ AC कैब बुक करें, वेरिफाइड ड्राइवर के साथ। वन-वे और राउंड ट्रिप, दिन या रात।', 6)
on conflict (slug) do nothing;

-- Packages are car and driver only. Add prices in Admin > Tour packages
insert into packages (slug, name_en, name_hi, nights, days, places_en, places_hi, sort) values
  ('shimla-manali', 'Shimla and Manali', 'शिमला और मनाली', 5, 6, 'Shimla, Kufri, Manali, Solang Valley, Atal Tunnel.', 'शिमला, कुफरी, मनाली, सोलंग वैली, अटल टनल।', 1),
  ('char-dham', 'Char Dham Yatra', 'चार धाम यात्रा', 10, 11, 'Yamunotri, Gangotri, Kedarnath and Badrinath.', 'यमुनोत्री, गंगोत्री, केदारनाथ और बद्रीनाथ।', 2),
  ('amritsar-wagah', 'Amritsar and Wagah', 'अमृतसर और वाघा', 2, 3, 'Golden Temple, Jallianwala Bagh and the Wagah border ceremony.', 'स्वर्ण मंदिर, जलियाँवाला बाग और वाघा बॉर्डर सेरेमनी।', 3),
  ('rajasthan', 'Rajasthan circuit', 'राजस्थान दर्शन', 7, 8, 'Jaipur, Pushkar, Jodhpur and Udaipur.', 'जयपुर, पुष्कर, जोधपुर और उदयपुर।', 4),
  ('haridwar-rishikesh', 'Haridwar and Rishikesh', 'हरिद्वार और ऋषिकेश', 2, 3, 'Ganga aarti, Laxman Jhula and riverside Rishikesh.', 'गंगा आरती, लक्ष्मण झूला और ऋषिकेश।', 5),
  ('vaishno-devi', 'Vaishno Devi', 'वैष्णो देवी', 3, 4, 'Katra base and Vaishno Devi darshan.', 'कटरा और वैष्णो देवी दर्शन।', 6)
on conflict (slug) do nothing;

insert into faqs (q_en, q_hi, a_en, a_hi, sort) values
  ('How do I book a cab?', 'कैब कैसे बुक करूँ?', 'Fill in the booking form or call us. We confirm the fare and share your driver and car details on WhatsApp.', 'बुकिंग फॉर्म भरिए या हमें कॉल कीजिए। हम WhatsApp पर किराया कन्फर्म करके ड्राइवर और गाड़ी की जानकारी भेजते हैं।', 1),
  ('How is the fare calculated?', 'किराया कैसे तय होता है?', 'Fares are per kilometre by car type. Toll, parking and state tax are extra, as per actuals. Use the fare calculator for an estimate.', 'किराया गाड़ी के प्रकार के हिसाब से प्रति किमी तय होता है। टोल, पार्किंग और स्टेट टैक्स असल के हिसाब से अलग लगते हैं। अनुमान के लिए फेयर कैलकुलेटर देखिए।', 2),
  ('How do I pay?', 'भुगतान कैसे करूँ?', 'You can pay by UPI or cash. If an advance is needed, we tell you when we confirm your booking.', 'आप UPI या कैश से भुगतान कर सकते हैं। एडवांस की ज़रूरत हो तो बुकिंग कन्फर्म करते समय बता दिया जाता है।', 3),
  ('Can I cancel or change my booking?', 'क्या बुकिंग रद्द या बदल सकता हूँ?', 'Call or WhatsApp us as early as you can and we will help you change or cancel.', 'जितनी जल्दी हो सके हमें कॉल या WhatsApp कीजिए, हम बदलाव या रद्द करने में मदद करेंगे।', 4),
  ('Are your drivers verified?', 'क्या आपके ड्राइवर वेरिफाइड हैं?', 'Yes. Every driver is background-checked and carries valid documents. Our cars have valid permit, insurance and fitness.', 'जी हाँ। हर ड्राइवर का बैकग्राउंड चेक होता है और उनके पास वैध दस्तावेज़ हैं। हमारी गाड़ियों का परमिट, बीमा और फिटनेस वैध है।', 5),
  ('Do you run night and early-morning trips?', 'क्या रात और सुबह जल्दी की ट्रिप होती हैं?', 'Yes, we are open 24×7. Night charges, if any, are confirmed when you book.', 'जी हाँ, हम 24×7 खुले हैं। रात का चार्ज, अगर लगता है, तो बुकिंग के समय बता दिया जाता है।', 6);

-- ---------- after creating your admin users in Supabase Auth, run this (use your real emails) ----------
-- insert into admins (user_id) select id from auth.users where email in ('YOUR_EMAIL', 'UNCLE_EMAIL');
