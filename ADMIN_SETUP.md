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

### 3b. Create the admins allow-list (who can manage the store)
Run this once. Being an admin = having your email in the `admins` table. Only
existing admins can edit it, so it's self-securing after you seed the first row.

```sql
create table if not exists admins (
  email      text primary key,
  invited_by text,
  created_at timestamptz default now()
);
alter table admins enable row level security;

-- Any signed-in user may read the list (needed by the app to check membership).
create policy "read admins" on admins for select to authenticated using (true);
-- Only existing admins may add/remove admins.
create policy "admins manage admins" on admins for all to authenticated
  using (lower(auth.jwt() ->> 'email') in (select email from admins))
  with check (lower(auth.jwt() ->> 'email') in (select email from admins));
```

Then tie catalog writes to admins too (replace the earlier `authenticated`
policies if you want stricter control) — optional but recommended:

```sql
-- only admins (not just any signed-in user) can write the catalog
drop policy if exists "admin write categories" on categories;
drop policy if exists "admin write products"   on products;
create policy "admin write categories" on categories for all to authenticated
  using (lower(auth.jwt() ->> 'email') in (select email from admins))
  with check (lower(auth.jwt() ->> 'email') in (select email from admins));
create policy "admin write products" on products for all to authenticated
  using (lower(auth.jwt() ->> 'email') in (select email from admins))
  with check (lower(auth.jwt() ->> 'email') in (select email from admins));
```

### 4. Create your first admin user + seed the allow-list
**Authentication → Users → Add user** → set an email + password. Then bootstrap
that email into the allow-list (SQL Editor):

```sql
insert into admins (email) values ('you@email.com');  -- your login email, lowercase
```

From now on you invite everyone else from the **Users** tab in `/admin` — no SQL
needed. A signed-in Supabase user who is **not** on the allow-list is denied.

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

## Managing admins (the Users tab)

Once Supabase is configured, `/admin` gets a **Users** tab where any admin can:

- **Invite an admin** — enter an email → they're added to the allow-list and
  emailed a sign-in link (their account is created if new). They set their own
  password via the reset flow.
- **Reset password** — sends the standard Supabase password-reset email to that
  user. Clicking the link brings them back to `/admin` with a "Set a new
  password" screen.
- **Revoke** — removes an admin from the allow-list (you can't revoke yourself).

All of this uses **client-safe** Supabase Auth calls — the browser never holds a
privileged key.

### Optional: admin-set passwords / formal invites (service_role)
Directly *setting* another user's password to a specific value, or issuing a
formal `inviteUserByEmail`, requires the **service_role** key, which must never
be in frontend code. If you need that, add a **Supabase Edge Function** that
holds the service_role secret and verifies the caller is an admin before calling
`supabase.auth.admin.*`. The email-based reset flow above covers the common case
without any server.

---

## Notes & safety

- The **anon key is safe** to ship in the frontend — RLS is what protects
  writes. Never expose the `service_role` key.
- The storefront always **falls back to the seed catalog** if Supabase is
  unreachable, so the site never breaks.
- Images uploaded in production go to the public `catalog-images` bucket and are
  referenced by URL; in local mode they're inlined as data URLs in your browser.
