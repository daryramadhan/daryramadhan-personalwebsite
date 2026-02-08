-- Migration: Add is_published column to projects table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='is_published') THEN
        ALTER TABLE projects ADD COLUMN is_published BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Update existing records to be published
UPDATE projects SET is_published = true WHERE is_published IS NULL;
