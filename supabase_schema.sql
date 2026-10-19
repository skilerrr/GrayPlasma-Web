-- ==============================================================================
-- GRAYPLASMA COMPLETE HARDENED DATABASE SCHEMA & RBAC POLICIES (SUPABASE)
-- Execute this script in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. ADMIN PROFILES & ROLE-BASED ACCESS CONTROL (RBAC)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'lead_reviewer', 'editor', 'contributor')),
  role_title TEXT DEFAULT 'Content Editor',
  avatar TEXT,
  bio TEXT,
  permissions JSONB DEFAULT '["*"]'::jsonb,
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an active admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid() AND is_active = true
  ) OR (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if current user is super_admin (owner)
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid() AND role = 'super_admin' AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin profiles policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.admin_profiles;
CREATE POLICY "Admins can view all profiles" ON public.admin_profiles
  FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Super admins can manage all profiles" ON public.admin_profiles;
CREATE POLICY "Super admins can manage all profiles" ON public.admin_profiles
  FOR ALL TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Admins can update own profile" ON public.admin_profiles;
CREATE POLICY "Admins can update own profile" ON public.admin_profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- 2b. ADMIN PERTAMA — SENGAJA TIDAK DI-SEED LEWAT SQL
-- ==============================================================================
-- JANGAN bikin akun admin dengan INSERT langsung ke auth.users.
-- Row hasil INSERT manual kehilangan nilai kolom token NOT NULL
-- (confirmation_token, recovery_token, email_change, ...) sehingga GoTrue
-- balas 500 "Database error querying schema" dan SELURUH auth project mati.
--
-- Cara yang benar:
--   1. Supabase Dashboard -> Authentication -> Users -> "Add user"
--      (isi email + password, centang "Auto Confirm User")
--   2. Baru sambungkan profilnya:
--
--      INSERT INTO public.admin_profiles (id, username, email, name, role, role_title, permissions, is_active)
--      SELECT u.id, 'usernamekamu', u.email, 'Nama Kamu', 'super_admin', 'Master Administrator', '["*"]'::jsonb, true
--      FROM auth.users u WHERE u.email = 'email@kamu.com'
--      ON CONFLICT (id) DO NOTHING;
--
-- Password default TIDAK lagi ditulis di file ini.

-- ==============================================================================
-- 3. MONITORS TABLE (GTID Lab Testing Specifications)
-- ==============================================================================
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

-- ==============================================================================
-- 4. DESKS TABLE (Standing Desk & Plywood Database)
-- ==============================================================================
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

-- ==============================================================================
-- 5. PERIPHERALS TABLE (Monitor Arms, Screenbars, Cable Trays)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.peripherals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC,
  brand TEXT,
  verdict TEXT,
  notes TEXT,
  "shopeeUrl" TEXT,
  "tokopediaUrl" TEXT,
  "tiktokUrl" TEXT,
  type TEXT,
  "versionDetail" TEXT,
  warranty TEXT,
  "recommendedFor" TEXT,
  "isPublished" BOOLEAN DEFAULT true,
  version_id INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. AFTERSALES BRANDS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.aftersales (
  brand TEXT PRIMARY KEY,
  rating TEXT,
  distributor TEXT,
  "warrantyPeriod" TEXT,
  summary TEXT,
  status TEXT,
  points JSONB DEFAULT '[]'::jsonb,
  "contactUrl" TEXT,
  "claimSystem" TEXT,
  version_id INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. AFTERSALES CARDS (Kanban Board)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.aftersales_cards (
  id TEXT PRIMARY KEY,
  "columnId" TEXT NOT NULL,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  rating TEXT,
  summary TEXT,
  "coverImage" TEXT,
  "order" INT DEFAULT 0,
  points JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  "detailsMarkdown" TEXT,
  "contactInfo" JSONB DEFAULT '{}'::jsonb,
  version_id INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. GLOBAL SITE SETTINGS (Key-Value Store)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. HOMEPAGE SETTINGS & SUBPAGE DIRECTORY
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.homepage_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 10. HIERARCHY NODES (Dynamic Routes, Notion Articles & Guides)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.hierarchy_nodes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  "fullPath" TEXT NOT NULL,
  category TEXT,
  icon TEXT,
  "coverImage" TEXT,
  description TEXT,
  "contentMarkdown" TEXT,
  "onClickAction" TEXT DEFAULT 'route',
  tags JSONB DEFAULT '[]'::jsonb,
  "order" INT DEFAULT 0,
  "isPublished" BOOLEAN DEFAULT true,
  "discordCallbackSummary" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 11. FAQ ITEMS (Q&A Knowledge Base)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.faq_items (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  important BOOLEAN DEFAULT false,
  "order" INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 12. ACTIVITY LOGS (Admin Audit Trail)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id TEXT PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_name TEXT NOT NULL,
  admin_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_name TEXT NOT NULL,
  details TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 13. ENABLE ROW LEVEL SECURITY (RLS) FOR ALL PUBLIC TABLES
-- ==============================================================================
ALTER TABLE public.monitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peripherals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aftersales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aftersales_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hierarchy_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 14. PUBLIC READ POLICIES (All visitors can view catalog & guides)
-- ==============================================================================
DROP POLICY IF EXISTS "Public Read Monitors" ON public.monitors;
CREATE POLICY "Public Read Monitors" ON public.monitors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Desks" ON public.desks;
CREATE POLICY "Public Read Desks" ON public.desks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Peripherals" ON public.peripherals;
CREATE POLICY "Public Read Peripherals" ON public.peripherals FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Aftersales" ON public.aftersales;
CREATE POLICY "Public Read Aftersales" ON public.aftersales FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Aftersales Cards" ON public.aftersales_cards;
CREATE POLICY "Public Read Aftersales Cards" ON public.aftersales_cards FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Site Settings" ON public.site_settings;
CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Homepage Settings" ON public.homepage_settings;
CREATE POLICY "Public Read Homepage Settings" ON public.homepage_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Hierarchy Nodes" ON public.hierarchy_nodes;
CREATE POLICY "Public Read Hierarchy Nodes" ON public.hierarchy_nodes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read FAQ Items" ON public.faq_items;
CREATE POLICY "Public Read FAQ Items" ON public.faq_items FOR SELECT USING (true);

-- ==============================================================================
-- 15. AUTHENTICATED ADMIN MUTATION POLICIES (Only Verified Admins Can Modify)
-- ==============================================================================
DROP POLICY IF EXISTS "Admin Full Access Monitors" ON public.monitors;
DROP POLICY IF EXISTS "Admin RBAC Access Monitors" ON public.monitors;
CREATE POLICY "Admin RBAC Access Monitors" ON public.monitors 
  FOR ALL TO authenticated 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Full Access Desks" ON public.desks;
DROP POLICY IF EXISTS "Admin RBAC Access Desks" ON public.desks;
CREATE POLICY "Admin RBAC Access Desks" ON public.desks 
  FOR ALL TO authenticated 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Full Access Peripherals" ON public.peripherals;
DROP POLICY IF EXISTS "Admin RBAC Access Peripherals" ON public.peripherals;
CREATE POLICY "Admin RBAC Access Peripherals" ON public.peripherals 
  FOR ALL TO authenticated 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Full Access Aftersales" ON public.aftersales;
DROP POLICY IF EXISTS "Admin RBAC Access Aftersales" ON public.aftersales;
CREATE POLICY "Admin RBAC Access Aftersales" ON public.aftersales 
  FOR ALL TO authenticated 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Full Access Aftersales Cards" ON public.aftersales_cards;
CREATE POLICY "Admin RBAC Access Aftersales Cards" ON public.aftersales_cards 
  FOR ALL TO authenticated 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Full Access Site Settings" ON public.site_settings;
CREATE POLICY "Admin RBAC Access Site Settings" ON public.site_settings 
  FOR ALL TO authenticated 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Full Access Homepage Settings" ON public.homepage_settings;
CREATE POLICY "Admin RBAC Access Homepage Settings" ON public.homepage_settings 
  FOR ALL TO authenticated 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Full Access Hierarchy Nodes" ON public.hierarchy_nodes;
CREATE POLICY "Admin RBAC Access Hierarchy Nodes" ON public.hierarchy_nodes 
  FOR ALL TO authenticated 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Full Access FAQ Items" ON public.faq_items;
CREATE POLICY "Admin RBAC Access FAQ Items" ON public.faq_items 
  FOR ALL TO authenticated 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Full Access Activity Logs" ON public.activity_logs;
CREATE POLICY "Admin Full Access Activity Logs" ON public.activity_logs 
  FOR ALL TO authenticated 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 16. SECURE STORAGE BUCKET & RBAC POLICIES
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gp-assets', 'gp-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
CREATE POLICY "Public Storage Read" ON storage.objects 
  FOR SELECT USING (bucket_id = 'gp-assets');

DROP POLICY IF EXISTS "Admin Storage Insert" ON storage.objects;
DROP POLICY IF EXISTS "Admin RBAC Storage Insert" ON storage.objects;
CREATE POLICY "Admin RBAC Storage Insert" ON storage.objects 
  FOR INSERT TO authenticated 
  WITH CHECK (bucket_id = 'gp-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admin Storage Update" ON storage.objects;
DROP POLICY IF EXISTS "Admin RBAC Storage Update" ON storage.objects;
CREATE POLICY "Admin RBAC Storage Update" ON storage.objects 
  FOR UPDATE TO authenticated 
  USING (bucket_id = 'gp-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admin Storage Delete" ON storage.objects;
DROP POLICY IF EXISTS "Admin RBAC Storage Delete" ON storage.objects;
CREATE POLICY "Admin RBAC Storage Delete" ON storage.objects 
  FOR DELETE TO authenticated 
  USING (bucket_id = 'gp-assets' AND public.is_admin());

-- ==============================================================================
-- 17. PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_monitors_brand ON public.monitors(brand);
CREATE INDEX IF NOT EXISTS idx_monitors_tier ON public.monitors(tier);
CREATE INDEX IF NOT EXISTS idx_monitors_price ON public.monitors(price);
CREATE INDEX IF NOT EXISTS idx_hierarchy_nodes_full_path ON public.hierarchy_nodes("fullPath");
CREATE INDEX IF NOT EXISTS idx_aftersales_cards_col ON public.aftersales_cards("columnId");
CREATE INDEX IF NOT EXISTS idx_admin_profiles_role ON public.admin_profiles(role);
