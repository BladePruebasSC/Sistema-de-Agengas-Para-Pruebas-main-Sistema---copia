/*
  # Update foreign key constraints to allow cascade deletion

  1. Changes
    - Update holidays table foreign key to CASCADE on barber deletion
    - Update blocked_times table foreign key to CASCADE on barber deletion  
    - Update reviews table foreign key to SET NULL on barber deletion
    - Add RLS policies for services table

  2. Security
    - Enable RLS on services table
    - Add appropriate policies for services management
*/

-- Update holidays table foreign key constraint
ALTER TABLE public.holidays
DROP CONSTRAINT IF EXISTS fk_holidays_barber_id;

ALTER TABLE public.holidays
ADD CONSTRAINT fk_holidays_barber_id
FOREIGN KEY (barber_id)
REFERENCES public.barbers(id)
ON DELETE CASCADE;

-- Update blocked_times table foreign key constraint
ALTER TABLE public.blocked_times
DROP CONSTRAINT IF EXISTS idx_blocked_times_barber_id;

-- First drop the index if it exists as a constraint
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'blocked_times_barber_id_fkey'
        AND table_name = 'blocked_times'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.blocked_times
        DROP CONSTRAINT blocked_times_barber_id_fkey;
    END IF;
END $$;

ALTER TABLE public.blocked_times
ADD CONSTRAINT blocked_times_barber_id_fkey
FOREIGN KEY (barber_id)
REFERENCES public.barbers(id)
ON DELETE CASCADE;

-- Reviews table already has SET NULL behavior from previous migration

-- Enable RLS on services table
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Add policies for services table
CREATE POLICY "Enable read access for all users" 
ON public.services FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Enable insert for authenticated users only" 
ON public.services FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" 
ON public.services FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only" 
ON public.services FOR DELETE 
TO authenticated 
USING (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_name ON public.services(name);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON public.services(is_active);