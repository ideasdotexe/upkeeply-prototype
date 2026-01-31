-- Create the update_updated_at_column function FIRST
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create inspections table for completed inspection records
CREATE TABLE public.inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id TEXT NOT NULL,
  form_id TEXT NOT NULL,
  form_name TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_by UUID,
  status TEXT NOT NULL CHECK (status IN ('completed', 'issues')),
  items_count INTEGER NOT NULL DEFAULT 0,
  issues_count INTEGER DEFAULT 0,
  responses JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create issues table
CREATE TABLE public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  status TEXT NOT NULL CHECK (status IN ('open', 'resolved')) DEFAULT 'open',
  form_name TEXT,
  inspection_id UUID REFERENCES public.inspections(id) ON DELETE SET NULL,
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create template_customizations table for persistent form modifications
CREATE TABLE public.template_customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id TEXT NOT NULL,
  form_id TEXT NOT NULL,
  custom_items JSONB DEFAULT '{}',
  removed_items JSONB DEFAULT '{}',
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(building_id, form_id)
);

-- Enable RLS on all tables
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_customizations ENABLE ROW LEVEL SECURITY;

-- RLS policies - deny direct access, all access via edge functions
CREATE POLICY "Deny direct access to inspections" ON public.inspections FOR SELECT USING (false);
CREATE POLICY "Deny direct insert to inspections" ON public.inspections FOR INSERT WITH CHECK (false);
CREATE POLICY "Deny direct update to inspections" ON public.inspections FOR UPDATE USING (false);
CREATE POLICY "Deny direct delete to inspections" ON public.inspections FOR DELETE USING (false);

CREATE POLICY "Deny direct access to issues" ON public.issues FOR SELECT USING (false);
CREATE POLICY "Deny direct insert to issues" ON public.issues FOR INSERT WITH CHECK (false);
CREATE POLICY "Deny direct update to issues" ON public.issues FOR UPDATE USING (false);
CREATE POLICY "Deny direct delete to issues" ON public.issues FOR DELETE USING (false);

CREATE POLICY "Deny direct access to template_customizations" ON public.template_customizations FOR SELECT USING (false);
CREATE POLICY "Deny direct insert to template_customizations" ON public.template_customizations FOR INSERT WITH CHECK (false);
CREATE POLICY "Deny direct update to template_customizations" ON public.template_customizations FOR UPDATE USING (false);
CREATE POLICY "Deny direct delete to template_customizations" ON public.template_customizations FOR DELETE USING (false);

-- Create indexes for better query performance
CREATE INDEX idx_inspections_building_id ON public.inspections(building_id);
CREATE INDEX idx_inspections_completed_at ON public.inspections(completed_at DESC);
CREATE INDEX idx_issues_building_id ON public.issues(building_id);
CREATE INDEX idx_issues_status ON public.issues(status);
CREATE INDEX idx_template_customizations_building_form ON public.template_customizations(building_id, form_id);

-- Create triggers for updated_at
CREATE TRIGGER update_issues_updated_at
  BEFORE UPDATE ON public.issues
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_template_customizations_updated_at
  BEFORE UPDATE ON public.template_customizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();