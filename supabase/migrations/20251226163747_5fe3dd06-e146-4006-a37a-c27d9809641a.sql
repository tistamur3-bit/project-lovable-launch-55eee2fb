
-- Create processing_users table
CREATE TABLE public.processing_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create navigation_instructions table
CREATE TABLE public.navigation_instructions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  route TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on both tables
ALTER TABLE public.processing_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_instructions ENABLE ROW LEVEL SECURITY;

-- Create policies for processing_users (allow all operations for public access)
CREATE POLICY "Allow public read on processing_users"
ON public.processing_users
FOR SELECT
USING (true);

CREATE POLICY "Allow public insert on processing_users"
ON public.processing_users
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update on processing_users"
ON public.processing_users
FOR UPDATE
USING (true);

CREATE POLICY "Allow public delete on processing_users"
ON public.processing_users
FOR DELETE
USING (true);

-- Create policies for navigation_instructions (allow all operations for public access)
CREATE POLICY "Allow public read on navigation_instructions"
ON public.navigation_instructions
FOR SELECT
USING (true);

CREATE POLICY "Allow public insert on navigation_instructions"
ON public.navigation_instructions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update on navigation_instructions"
ON public.navigation_instructions
FOR UPDATE
USING (true);

CREATE POLICY "Allow public delete on navigation_instructions"
ON public.navigation_instructions
FOR DELETE
USING (true);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.processing_users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.navigation_instructions;
