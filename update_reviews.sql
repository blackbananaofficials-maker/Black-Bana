-- Run this in your Supabase SQL Editor to update the reviews table

ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Optionally, set existing reviews to be featured so they don't disappear from the homepage
UPDATE public.reviews SET is_featured = true;
