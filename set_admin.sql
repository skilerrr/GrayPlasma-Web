-- Script reset password akun admin GrayPlasma ke: admingrayplasma2026
-- Buka file ini di VS Code, copy semua isinya, lalu paste ke SQL Editor Supabase.

UPDATE auth.users
SET encrypted_password = crypt('admingrayplasma2026', gen_salt('bf'))
WHERE email IN ('skylerngawur@gmail.com', 'grayplasma@grayplasma.local');

INSERT INTO public.admin_profiles (id, username, email, name, role, role_title, permissions, is_active)
VALUES
  ('664c40bd-9c56-438b-8edb-ae1dfc77906c', 'skilerrr', 'skylerngawur@gmail.com', 'Skyler', 'super_admin', 'Master Administrator', '["*"]'::jsonb, true),
  ('00000000-0000-0000-0000-000000000001', 'grayplasma', 'grayplasma@grayplasma.local', 'Grayplasma', 'super_admin', 'Master Administrator', '["*"]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  is_active = true,
  permissions = '["*"]'::jsonb;

-- Fungsi agar Super Admin bisa ubah password anggota tim langsung dari Web UI (menerima UUID, Email, atau Username dummy):
CREATE OR REPLACE FUNCTION public.admin_set_user_password(target_identifier TEXT, new_password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  resolved_id UUID;
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Hanya Super Admin yang berhak mengubah password.';
  END IF;

  -- 1. Jika identifier formatnya UUID
  IF target_identifier ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    resolved_id := target_identifier::UUID;
  END IF;

  -- 2. Jika belum ketemu, cari di auth.users berdasarkan email
  IF resolved_id IS NULL THEN
    SELECT u.id INTO resolved_id
    FROM auth.users u
    WHERE lower(u.email) = lower(target_identifier)
       OR lower(u.email) = lower(replace(target_identifier, 'admin-', '')) || '@grayplasma.local'
       OR lower(u.email) = lower(replace(target_identifier, 'admin-', '')) || '@grayplasma.id'
    LIMIT 1;
  END IF;

  -- 3. Jika belum ketemu, cari di admin_profiles berdasarkan username / id
  IF resolved_id IS NULL THEN
    SELECT p.id INTO resolved_id
    FROM public.admin_profiles p
    WHERE lower(p.username) = lower(replace(target_identifier, 'admin-', ''))
       OR lower(p.email) = lower(target_identifier)
    LIMIT 1;
  END IF;

  IF resolved_id IS NULL THEN
    RAISE EXCEPTION 'User "%" tidak ditemukan di auth.users', target_identifier;
  END IF;

  UPDATE auth.users
  SET encrypted_password = crypt(new_password, gen_salt('bf'))
  WHERE id = resolved_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.admin_set_user_password(TEXT, TEXT) TO authenticated, service_role;
NOTIFY pgrst, 'reload schema';
