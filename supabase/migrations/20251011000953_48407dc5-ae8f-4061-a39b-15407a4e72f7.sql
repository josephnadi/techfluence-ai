-- Remove the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Users can view all consultations for availability" ON consultations;

-- Create a view for checking slot availability without exposing PII
CREATE OR REPLACE VIEW public.consultation_availability AS
SELECT 
  consultation_date,
  consultation_time,
  status
FROM consultations
WHERE status = 'scheduled';

-- Grant access to the view for anonymous users (for availability checking only)
GRANT SELECT ON public.consultation_availability TO anon;
GRANT SELECT ON public.consultation_availability TO authenticated;