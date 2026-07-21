# Catalog Admin — setup

The site ships with a built-in admin portal at **`/admin`** (a discreet "Admin"
link is also in the footer). It does full CRUD on **products** and
**categories**, including **image upload**, and the storefront reads its data
live so edits appear immediately.

It runs in one of two modes, chosen automatically from your environment:

| Mode | When | Where edits persist | Shared? |
|---|---|---|---|
| **Local preview** | no Supabase env vars | this browser's `localStorage` | ❌ only you |
| **Production** | Supabase env vars set | Supabase Postgres + Storage | ✅ every visitor |

With **no configuration**, the site behaves exactly as before — the catalog is
seeded from `src/data.ts` and nothing changes until an admin makes an edit.

---

## Local preview mode (works out of the box)

1. Visit `/admin`.
2. Enter the passcode (default **`admin`**, or set `VITE_ADMIN_PASSCODE`).
3. Add / edit / delete products & categories, upload images.

Edits are saved to your browser only — great for trying it out. Use the
**"Reset to original demo catalog"** link to clear your local changes.

> Local mode is **not** secure and is **not** shared. Use Supabase for a real,
> production-grade, multi-user backend.

---

## Production mode with Supabase (edits go live for everyone)

### 1. Create a Supabase project
Sign up at <https://supabase.com>, create a project, and from
**Project Settings → API** copy the **Project URL** and the **anon public key**.

### 2. Create the tables + policies
Open **SQL Editor** and run:

```sql
-- Categories
create table if not exists categories (
  key        text primary key,
  label      text not null,
  emoji      text default '🐟',
  img        text,
  sort       int  default 0,
  created_at timestamptz default now()
);

-- Products
create table if not exists products (
  id          text primary key,
  name        text not null,
  local       text,
  category    text references categories(key) on update cascade on delete set null,
  price       numeric not null default 0,
  mrp         numeric not null default 0,
  unit        text,
  pieces      text,
  serves      text,
  tags        jsonb,
  description text,
  rating      numeric default 0,
  reviews     int default 0,
  img         text,
  sold_out    boolean default false,
  start_from  boolean default false,
  created_at  timestamptz default now()
);

-- Row Level Security: anyone can READ, only signed-in admins can WRITE
alter table categories enable row level security;
alter table products   enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "public read products"   on products   for select using (true);

create policy "admin write categories" on categories
  for all to authenticated using (true) with check (true);
create policy "admin write products" on products
  for all to authenticated using (true) with check (true);
```

### 3. Create the image storage bucket
**Storage → New bucket** → name it exactly **`catalog-images`** → mark it
**Public**. Then add write access for signed-in admins (SQL Editor):

```sql
create policy "public read images" on storage.objects
  for select using (bucket_id = 'catalog-images');

create policy "admin upload images" on storage.objects
  for insert to authenticated with check (bucket_id = 'catalog-images');

create policy "admin manage images" on storage.objects
  for update to authenticated using (bucket_id = 'catalog-images');
```

### 4. Create your admin user
**Authentication → Users → Add user** → set an email + password. Only users you
create here can sign in to `/admin` and write to the catalog.

### 5. Set the environment variables
Copy `.env.example` to `.env` (local) and add the same vars to your hosting
provider (GitHub Pages via repo secrets / your CI, Vercel, Netlify, etc.):

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
```

Rebuild / redeploy. The admin banner now shows **"Connected to Supabase."**

### 6. Import the demo catalog (one time)
Sign in to `/admin` and click **"Import demo catalog into Supabase"** to populate
the tables with the current products & categories. After that, manage everything
from the portal — every save is live in production for all visitors.

---

## Notes & safety

- The **anon key is safe** to ship in the frontend — RLS is what protects
  writes. Never expose the `service_role` key.
- The storefront always **falls back to the seed catalog** if Supabase is
  unreachable, so the site never breaks.
- Images uploaded in production go to the public `catalog-images` bucket and are
  referenced by URL; in local mode they're inlined as data URLs in your browser.
