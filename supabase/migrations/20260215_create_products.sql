-- Create products table for Future Fit store
create table if not exists public.products (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    price_paise integer not null check (price_paise > 0),
    description text,
    image_url text,
    stock integer not null default 0 check (stock >= 0),
    category text,
    slug text unique not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.products enable row level security;

-- Allow public read access (anyone can browse products)
create policy "Products are publicly readable"
    on public.products for select
    using (true);

-- Index for fast slug lookups
create index if not exists idx_products_slug on public.products (slug);

-- Index for category filtering
create index if not exists idx_products_category on public.products (category);
