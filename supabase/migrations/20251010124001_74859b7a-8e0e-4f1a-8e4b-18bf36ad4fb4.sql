-- Create consultations table
CREATE TABLE public.consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT,
  company TEXT,
  consultation_date DATE NOT NULL,
  consultation_time TIME NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own consultations
CREATE POLICY "Users can view all consultations for availability" 
ON public.consultations 
FOR SELECT 
USING (true);

-- Create policy for users to insert their own consultations
CREATE POLICY "Users can create consultations" 
ON public.consultations 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_consultations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_consultations_updated_at
BEFORE UPDATE ON public.consultations
FOR EACH ROW
EXECUTE FUNCTION public.update_consultations_updated_at();

-- Create index for faster date/time queries
CREATE INDEX idx_consultations_date_time ON public.consultations(consultation_date, consultation_time);