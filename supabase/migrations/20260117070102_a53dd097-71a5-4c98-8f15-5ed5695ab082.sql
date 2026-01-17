-- Create users table for authentication
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id TEXT NOT NULL,
  building_id TEXT NOT NULL,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  designation TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, building_id, username)
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow public read for login validation (no auth required for login)
CREATE POLICY "Allow public read for login" 
ON public.users 
FOR SELECT 
USING (true);

-- Insert the initial user
INSERT INTO public.users (company_id, building_id, username, password_hash, designation, email)
VALUES ('DellProp', '16 Yonge St', 'vchirag', 'vchirag', 'Property Manager', 'mihirmehta.artist@gmail.com');