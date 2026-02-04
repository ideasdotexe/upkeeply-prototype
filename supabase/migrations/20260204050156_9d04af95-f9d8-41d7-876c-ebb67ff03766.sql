-- Create drafts table for saving inspection form drafts
CREATE TABLE public.drafts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  building_id text NOT NULL,
  form_id text NOT NULL,
  responses jsonb DEFAULT '{}'::jsonb,
  custom_sections jsonb DEFAULT '[]'::jsonb,
  removed_items jsonb DEFAULT '{}'::jsonb,
  updated_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(building_id, form_id)
);

-- Enable RLS
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;

-- Deny direct access - all access via edge functions
CREATE POLICY "Deny direct access to drafts" 
ON public.drafts 
FOR SELECT 
USING (false);

CREATE POLICY "Deny direct insert to drafts" 
ON public.drafts 
FOR INSERT 
WITH CHECK (false);

CREATE POLICY "Deny direct update to drafts" 
ON public.drafts 
FOR UPDATE 
USING (false);

CREATE POLICY "Deny direct delete to drafts" 
ON public.drafts 
FOR DELETE 
USING (false);

-- Add trigger for updated_at
CREATE TRIGGER update_drafts_updated_at
BEFORE UPDATE ON public.drafts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();