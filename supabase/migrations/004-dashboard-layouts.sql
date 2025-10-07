-- Create dashboard_layouts table
CREATE TABLE IF NOT EXISTS dashboard_layouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  layout_config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dashboard_layouts_user_id ON dashboard_layouts(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_layouts_is_default ON dashboard_layouts(is_default);
CREATE INDEX IF NOT EXISTS idx_dashboard_layouts_updated_at ON dashboard_layouts(updated_at);

-- Create RLS policies
ALTER TABLE dashboard_layouts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own layouts
CREATE POLICY "Users can view their own dashboard layouts" ON dashboard_layouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dashboard layouts" ON dashboard_layouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dashboard layouts" ON dashboard_layouts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dashboard layouts" ON dashboard_layouts
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_dashboard_layouts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_dashboard_layouts_updated_at
  BEFORE UPDATE ON dashboard_layouts
  FOR EACH ROW
  EXECUTE FUNCTION update_dashboard_layouts_updated_at();

-- Create function to ensure only one default layout per user
CREATE OR REPLACE FUNCTION ensure_single_default_layout()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting a layout as default, unset all other defaults for this user
  IF NEW.is_default = TRUE THEN
    UPDATE dashboard_layouts 
    SET is_default = FALSE 
    WHERE user_id = NEW.user_id 
    AND id != NEW.id 
    AND is_default = TRUE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to ensure only one default layout per user
CREATE TRIGGER ensure_single_default_layout_trigger
  BEFORE INSERT OR UPDATE ON dashboard_layouts
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_layout();
