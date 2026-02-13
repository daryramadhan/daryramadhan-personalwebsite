-- Create the partners table
create table public.partners (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  logo_url text not null,
  sort_order integer default 0
);

-- Enable RLS (Row Level Security)
alter table public.partners enable row level security;

-- Create policies

-- Allow public read access
create policy "Public partners are viewable by everyone"
  on public.partners for select
  using ( true );

-- Allow authenticated users (admin) to insert
create policy "Admins can insert partners"
  on public.partners for insert
  with check ( auth.role() = 'authenticated' );

-- Allow authenticated users (admin) to update
create policy "Admins can update partners"
  on public.partners for update
  using ( auth.role() = 'authenticated' );

-- Allow authenticated users (admin) to delete
create policy "Admins can delete partners"
  on public.partners for delete
  using ( auth.role() = 'authenticated' );
