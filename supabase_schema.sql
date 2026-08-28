-- ==============================================================================
-- GRAYPLASMA HARDENED DATABASE SCHEMA & RBAC POLICIES (SUPABASE)
-- Run this in Supabase Project Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Monitors Table with Extended GTID Lab Specs & Versioning
CREATE TABLE IF NOT EXISTS public.monitors (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  tier TEXT NOT NULL,
  "tierDescription" TEXT,
  price NUMERIC NOT NULL,
  "originalPrice" NUMERIC,
  "recommendedPrice" NUMERIC,
  thumbnail TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  "quickSpecs" JSONB DEFAULT '[]'::jsonb,
  "expertVerdict" TEXT,
  pros JSONB DEFAULT '[]'::jsonb,
  cons JSONB DEFAULT '[]'::jsonb,
  specs JSONB DEFAULT '{}'::jsonb,
  marketplaces JSONB DEFAULT '[]'::jsonb,
  "priceHistory" JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  
  -- Notion & Display Engineering Fields
  "aspectRatio" TEXT,
  curvature TEXT,
  "displayInputs" JSONB,
  "panelBitDepth" TEXT,
  "standCapability" TEXT,
  "usbHub" TEXT,
  "marketClass" TEXT,
  "createdDateText" TEXT,
  "lastUpdatedDate" TEXT,
  "linkShopee" TEXT,
  "linkTokopedia" TEXT,
  "linkTiktokShop" TEXT,
  "frontImage" TEXT,
  "rearImage" TEXT,
  "statusReason" TEXT,
  "gtidReviewUrl" TEXT,
  introduction TEXT,
  "bannerImage" TEXT,
  "deepDiveTitle" TEXT,
  "deepDiveDescription" TEXT,
  "deepDiveNote" TEXT,
  "calmanCharts" JSONB,
  "accessoriesIncluded" JSONB,
  "additionalStores" JSONB,
  "responseTimeData" JSONB,

  -- Modern GTID Lab Testing Fields
  "subpixelLayout" TEXT,
  "coatingType" TEXT,
  "vrrSpecs" JSONB,
  "overshootData" JSONB,
  "labTestingMatrix" JSONB,

  -- Versioning & Optimistic Locking
  version_id INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Desks Table
CREATE TABLE IF NOT EXISTS public.desks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
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
  version_id INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Peripherals Table
CREATE TABLE IF NOT EXISTS public.peripherals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  price NUMERIC,
  brand TEXT,
  verdict TEXT,
  notes TEXT,
  "shopeeUrl" TEXT,
  "recommendedFor" TEXT,
  version_id INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
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
  version_id INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.monitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peripherals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aftersales ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 5. PUBLIC READ ACCESS POLICIES (Everyone can read catalog)
-- ==============================================================================
DROP POLICY IF EXISTS "Public Read Monitors" ON public.monitors;
CREATE POLICY "Public Read Monitors" ON public.monitors 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Desks" ON public.desks;
CREATE POLICY "Public Read Desks" ON public.desks 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Peripherals" ON public.peripherals;
CREATE POLICY "Public Read Peripherals" ON public.peripherals 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Aftersales" ON public.aftersales;
CREATE POLICY "Public Read Aftersales" ON public.aftersales 
  FOR SELECT USING (true);

-- ==============================================================================
-- 6. HARDENED ADMIN RBAC POLICIES (Only JWT claim role='admin' can write/delete)
-- ==============================================================================
DROP POLICY IF EXISTS "Admin Full Access Monitors" ON public.monitors;
DROP POLICY IF EXISTS "Admin RBAC Access Monitors" ON public.monitors;
CREATE POLICY "Admin RBAC Access Monitors" ON public.monitors 
  FOR ALL TO authenticated 
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admin Full Access Desks" ON public.desks;
DROP POLICY IF EXISTS "Admin RBAC Access Desks" ON public.desks;
CREATE POLICY "Admin RBAC Access Desks" ON public.desks 
  FOR ALL TO authenticated 
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admin Full Access Peripherals" ON public.peripherals;
DROP POLICY IF EXISTS "Admin RBAC Access Peripherals" ON public.peripherals;
CREATE POLICY "Admin RBAC Access Peripherals" ON public.peripherals 
  FOR ALL TO authenticated 
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admin Full Access Aftersales" ON public.aftersales;
DROP POLICY IF EXISTS "Admin RBAC Access Aftersales" ON public.aftersales;
CREATE POLICY "Admin RBAC Access Aftersales" ON public.aftersales 
  FOR ALL TO authenticated 
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ==============================================================================
-- 7. SECURE STORAGE BUCKET & RBAC POLICIES
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gp-assets', 'gp-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
CREATE POLICY "Public Storage Read" ON storage.objects 
  FOR SELECT USING (bucket_id = 'gp-assets');

DROP POLICY IF EXISTS "Public Storage Insert" ON storage.objects;
DROP POLICY IF EXISTS "Admin Storage Insert" ON storage.objects;
DROP POLICY IF EXISTS "Admin RBAC Storage Insert" ON storage.objects;
CREATE POLICY "Admin RBAC Storage Insert" ON storage.objects 
  FOR INSERT TO authenticated 
  WITH CHECK (bucket_id = 'gp-assets' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Public Storage Update" ON storage.objects;
DROP POLICY IF EXISTS "Admin Storage Update" ON storage.objects;
DROP POLICY IF EXISTS "Admin RBAC Storage Update" ON storage.objects;
CREATE POLICY "Admin RBAC Storage Update" ON storage.objects 
  FOR UPDATE TO authenticated 
  USING (bucket_id = 'gp-assets' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Public Storage Delete" ON storage.objects;
DROP POLICY IF EXISTS "Admin Storage Delete" ON storage.objects;
DROP POLICY IF EXISTS "Admin RBAC Storage Delete" ON storage.objects;
CREATE POLICY "Admin RBAC Storage Delete" ON storage.objects 
  FOR DELETE TO authenticated 
  USING (bucket_id = 'gp-assets' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
