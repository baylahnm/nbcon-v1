-- Final migration (v1.9.0): drop deprecated role column now that RLS uses is_admin
-- Safety: Ensure all RLS policies/functions reference is_admin or get_user_role()
-- Apply during maintenance window after successful staging verification

ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;
