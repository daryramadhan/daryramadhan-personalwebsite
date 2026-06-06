-- Add live_link column to projects table
alter table projects add column if not exists live_link text;
