-- Add RESTRICTIVE policies to deny INSERT, UPDATE, DELETE on users table
-- All user management should be done through Edge Functions with service role key

CREATE POLICY "Deny all direct insert to users table"
  ON public.users FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Deny all direct update to users table"
  ON public.users FOR UPDATE
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Deny all direct delete from users table"
  ON public.users FOR DELETE
  USING (false);

-- Also add missing policies for buildings table
CREATE POLICY "Deny all direct insert to buildings table"
  ON public.buildings FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Deny all direct update to buildings table"
  ON public.buildings FOR UPDATE
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Deny all direct delete from buildings table"
  ON public.buildings FOR DELETE
  USING (false);