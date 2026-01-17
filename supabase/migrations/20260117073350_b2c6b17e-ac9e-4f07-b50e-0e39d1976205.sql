-- Create buildings table
CREATE TABLE public.buildings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  building_id text NOT NULL UNIQUE,
  name text NOT NULL,
  address text,
  building_type text DEFAULT 'Residential',
  year_built integer,
  units integer DEFAULT 0,
  floors integer DEFAULT 0,
  parking_spots integer DEFAULT 0,
  amenities text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;

-- Allow public read for buildings (needed for login flow)
CREATE POLICY "Allow public read for buildings"
  ON public.buildings FOR SELECT
  USING (true);

-- Insert sample building data matching the existing user
INSERT INTO public.buildings (building_id, name, address, building_type, year_built, units, floors, parking_spots, amenities)
VALUES ('16 yonge st', '16 Yonge Street', '16 Yonge Street, Toronto', 'Residential', 2005, 48, 12, 72, 'Pool, Gym');