ALTER TABLE public.users ADD COLUMN full_name TEXT;

UPDATE public.users SET full_name = 'Chirag Verma' WHERE username = 'vchirag';