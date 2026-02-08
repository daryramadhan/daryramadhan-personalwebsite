-- Add project_type column
alter table projects 
add column if not exists project_type text default 'selected_work';

-- Update existing rows (if any)
-- update projects set project_type = 'case_study' where title like '%Case Study%';
