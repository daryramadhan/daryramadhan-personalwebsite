-- Add class_name column for grid layout control
alter table projects 
add column if not exists class_name text;

-- (Role and Client already exist in the schema, but just in case they were missed in a previous apply)
-- alter table projects add column if not exists role text;
-- alter table projects add column if not exists client text;
