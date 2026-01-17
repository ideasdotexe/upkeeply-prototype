-- Drop the insecure public read policies
DROP POLICY IF EXISTS "Allow public read for login" ON public.users;
DROP POLICY IF EXISTS "Allow public read for buildings" ON public.buildings;

-- Create restrictive policies that deny direct access to users table
-- (authentication is now handled by Edge Functions with service role key)
CREATE POLICY "Deny all direct access to users table"
  ON public.users FOR SELECT
  USING (false);

-- Buildings table: deny direct access (access via Edge Function only)
CREATE POLICY "Deny all direct access to buildings table"
  ON public.buildings FOR SELECT
  USING (false);