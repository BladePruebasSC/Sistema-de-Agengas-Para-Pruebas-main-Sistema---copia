-- Migration: Create manual_services table
-- Date: 2025-01-20
-- Description: Create table for services performed without appointments

-- Create manual_services table for services performed without appointments
CREATE TABLE IF NOT EXISTS public.manual_services (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    client_name TEXT NOT NULL,
    client_phone TEXT,
    service_id TEXT NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL,
    price INTEGER NOT NULL,
    barber_id UUID REFERENCES public.barbers(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add comments for documentation
COMMENT ON TABLE public.manual_services IS 'Servicios realizados sin cita previa';
COMMENT ON COLUMN public.manual_services.price IS 'Precio del servicio en centavos';
COMMENT ON COLUMN public.manual_services.barber_id IS 'ID del asistente que realizó el servicio (opcional)';
COMMENT ON COLUMN public.manual_services.notes IS 'Notas adicionales sobre el servicio';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_manual_services_date ON public.manual_services(date);
CREATE INDEX IF NOT EXISTS idx_manual_services_barber_id ON public.manual_services(barber_id);
CREATE INDEX IF NOT EXISTS idx_manual_services_service_id ON public.manual_services(service_id);

-- Verify table creation
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'manual_services' 
ORDER BY ordinal_position;
