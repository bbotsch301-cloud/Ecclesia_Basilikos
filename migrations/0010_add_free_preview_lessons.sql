-- Add free_preview_lessons column to courses table if it doesn't exist
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS free_preview_lessons INTEGER DEFAULT 1;
