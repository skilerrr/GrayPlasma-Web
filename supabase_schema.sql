-- ==============================================================================
-- GRAYPLASMA DATABASE SCHEMA FOR SUPABASE
-- Run this in Supabase Project Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Monitors Table
CREATE TABLE IF NOT EXISTS public.monitors (
  id TEXT PRIMARY KEY,
  slug TEXT,
  brand TEXT,
  model TEXT,
  "fullName" TEXT,
  tier TEXT,
  "tierDescription" TEXT,
  price NUMERIC,
  "originalPrice" NUMERIC,
  thumbnail TEXT,
  gallery JSONB,
  "quickSpecs" JSONB,
  "expertVerdict" TEXT,
  pros JSONB,
  cons JSONB,
  specs JSONB,
  marketplaces JSONB,
  "priceHistory" JSONB,
  tags JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Desks Table
CREATE TABLE IF NOT EXISTS public.desks (
  id TEXT PRIMARY KEY,
  name TEXT,
  category TEXT,
  keterangan JSONB,
  price NUMERIC,
  type TEXT,
  "catatanBadge" TEXT,
  description TEXT,
  notes TEXT,
  "markdownContent" TEXT,
  "shopeeUrl" TEXT,
  specs JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Peripherals Table
CREATE TABLE IF NOT EXISTS public.peripherals (
  id TEXT PRIMARY KEY,
  name TEXT,
  category TEXT,
  price NUMERIC,
  brand TEXT,
  verdict TEXT,
  notes TEXT,
  "shopeeUrl" TEXT,
  "recommendedFor" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Aftersales Table
CREATE TABLE IF NOT EXISTS public.aftersales (
  brand TEXT PRIMARY KEY,
  rating TEXT,
  distributor TEXT,
  "warrantyPeriod" TEXT,
  summary TEXT,
  status TEXT,
  points JSONB,
  "contactUrl" TEXT,
  "claimSystem" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.monitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peripherals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aftersales ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access
DROP POLICY IF EXISTS "Public Read Monitors" ON public.monitors;
CREATE POLICY "Public Read Monitors" ON public.monitors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Desks" ON public.desks;
CREATE POLICY "Public Read Desks" ON public.desks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Peripherals" ON public.peripherals;
CREATE POLICY "Public Read Peripherals" ON public.peripherals FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Aftersales" ON public.aftersales;
CREATE POLICY "Public Read Aftersales" ON public.aftersales FOR SELECT USING (true);

-- Allow Insert / Update / Delete
DROP POLICY IF EXISTS "Admin Full Access Monitors" ON public.monitors;
CREATE POLICY "Admin Full Access Monitors" ON public.monitors FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin Full Access Desks" ON public.desks;
CREATE POLICY "Admin Full Access Desks" ON public.desks FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin Full Access Peripherals" ON public.peripherals;
CREATE POLICY "Admin Full Access Peripherals" ON public.peripherals FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin Full Access Aftersales" ON public.aftersales;
CREATE POLICY "Admin Full Access Aftersales" ON public.aftersales FOR ALL USING (true);

-- Create Storage Bucket for Compressed WebP Assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gp-assets', 'gp-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Public Read Policy
CREATE POLICY "Public Storage Read" ON storage.objects FOR SELECT USING (bucket_id = 'gp-assets');
CREATE POLICY "Public Storage Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gp-assets');
CREATE POLICY "Public Storage Update" ON storage.objects FOR UPDATE USING (bucket_id = 'gp-assets');
CREATE POLICY "Public Storage Delete" ON storage.objects FOR DELETE USING (bucket_id = 'gp-assets');
