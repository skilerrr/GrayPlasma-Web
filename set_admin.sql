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

-- Fungsi agar Super Admin bisa ubah password anggota tim langsung dari Web UI:
CREATE OR REPLACE FUNCTION public.admin_set_user_password(target_user_id UUID, new_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Hanya Super Admin yang berhak mengubah password.';
  END IF;

  UPDATE auth.users
  SET encrypted_password = crypt(new_password, gen_salt('bf'))
  WHERE id = target_user_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
