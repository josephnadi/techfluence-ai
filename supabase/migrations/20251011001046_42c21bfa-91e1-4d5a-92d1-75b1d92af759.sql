-- Drop and recreate the view without security definer
DROP VIEW IF EXISTS public.consultation_availability;

-- Create a regular view (not security definer) for availability checking
CREATE VIEW public.consultation_availability 
WITH (security_invoker=true) AS
SELECT 
  consultation_date,
  consultation_time,
  status
FROM consultations
WHERE status = 'scheduled';

-- Grant access to anonymous and authenticated users
GRANT SELECT ON public.consultation_availability TO anon;
GRANT SELECT ON public.consultation_availability TO authenticated;