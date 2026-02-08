-- Create the projects table
create table if not exists projects (
  id text primary key default gen_random_uuid(),
  title text not null,
  category text,
  year text,
  image text,
  description text,
  role text,
  client text,
  images text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table projects enable row level security;

-- Create policies (modify 'authenticated' to allow specific access if needed, but for now authenticated users can do everything)
create policy "Public projects are viewable by everyone"
  on projects for select
  using ( true );

create policy "Users can insert projects"
  on projects for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update projects"
  on projects for update
  using ( auth.role() = 'authenticated' );

create policy "Users can delete projects"
  on projects for delete
  using ( auth.role() = 'authenticated' );

-- Create a storage bucket for images
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true);

-- Storage policies
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'project-images' );

create policy "Authenticated users can upload"
  on storage.objects for insert
  with check ( bucket_id = 'project-images' and auth.role() = 'authenticated' );

create policy "Authenticated users can update"
  on storage.objects for update
  with check ( bucket_id = 'project-images' and auth.role() = 'authenticated' );

create policy "Authenticated users can delete"
  on storage.objects for delete
  using ( bucket_id = 'project-images' and auth.role() = 'authenticated' );
