-- Ensure admin can update/delete consultations (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'consultations' 
      AND policyname = 'Admins can update consultations'
  ) THEN
    CREATE POLICY "Admins can update consultations"
    ON public.consultations
    FOR UPDATE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'consultations' 
      AND policyname = 'Admins can delete consultations'
  ) THEN
    CREATE POLICY "Admins can delete consultations"
    ON public.consultations
    FOR DELETE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;