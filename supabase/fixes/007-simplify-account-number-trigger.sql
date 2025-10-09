-- Simplify account number trigger by removing account_numbers table insert
-- The trigger will only generate and assign account_numbers to profiles
-- This avoids FK constraint and RLS issues

DROP TRIGGER IF EXISTS assign_account_number_trigger ON public.profiles;

CREATE OR REPLACE FUNCTION assign_account_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate account number if not already set
  IF NEW.account_number IS NULL THEN
    NEW.account_number := generate_account_number(NEW.role);
  END IF;
  
  -- REMOVED: Insert into account_numbers tracking table
  -- This was causing FK constraint violations and RLS issues
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger as BEFORE INSERT (keeps account number generation working)
CREATE TRIGGER assign_account_number_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION assign_account_number();

