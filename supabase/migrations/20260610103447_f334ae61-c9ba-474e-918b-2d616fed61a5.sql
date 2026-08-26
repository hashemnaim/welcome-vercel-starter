
CREATE TABLE public.vendor_stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  store_name TEXT NOT NULL,
  store_url TEXT,
  color TEXT,
  module_id INTEGER,
  module_name TEXT,
  category_ids JSONB DEFAULT '[]'::jsonb,
  category_names JSONB DEFAULT '[]'::jsonb,
  package_id INTEGER,
  plan_name TEXT,
  plan_price TEXT,
  business_plan TEXT,
  owner_name TEXT,
  owner_email TEXT,
  owner_phone TEXT,
  external_token TEXT,
  external_store_id INTEGER,
  api_result JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, slug)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vendor_stores TO authenticated;
GRANT ALL ON public.vendor_stores TO service_role;

ALTER TABLE public.vendor_stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stores"
  ON public.vendor_stores FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stores"
  ON public.vendor_stores FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stores"
  ON public.vendor_stores FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stores"
  ON public.vendor_stores FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_vendor_stores_updated_at
  BEFORE UPDATE ON public.vendor_stores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_vendor_stores_user_id ON public.vendor_stores(user_id);
