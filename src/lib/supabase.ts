import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("https://") &&
  supabaseAnonKey.length > 20
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface SupabaseAdminProfile {
  id: string;
  username?: string;
  email: string;
  name: string;
  role: "super_admin" | "lead_reviewer" | "editor" | "contributor";
  role_title?: string;
  avatar?: string;
  bio?: string;
  permissions?: string[];
  is_active: boolean;
  created_at?: string;
  last_login?: string;
}

/**
 * Sign in admin using official Supabase Auth (Username or Email + Password)
 */
export async function signInAdminWithSupabase(usernameOrEmail: string, password: string): Promise<{
  user: any | null;
  profile: SupabaseAdminProfile | null;
  error: string | null;
}> {
  if (!supabase) {
    return { user: null, profile: null, error: "Supabase belum terkonfigurasi di environment." };
  }

  try {
    const cleanInput = usernameOrEmail.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Resolusi email:
    // 1. Jika sudah mengandung '@', gunakan langsung
    // 2. Jika username, periksa cache admin lokal barangkali ada email akun terdaftar
    let emailToTry = cleanInput;
    if (!cleanInput.includes("@")) {
      if (typeof window !== "undefined") {
        try {
          const raw = window.localStorage.getItem("gp_db_admin_users_v1");
          if (raw) {
            const list = JSON.parse(raw);
            const found = list.find(
              (u: any) =>
                (u.username || "").toLowerCase() === cleanInput ||
                (u.name || "").toLowerCase() === cleanInput
            );
            if (found?.email) {
              emailToTry = found.email.trim().toLowerCase();
            }
          }
        } catch {
          /* ignore storage error */
        }
      }
      if (!emailToTry.includes("@")) {
        emailToTry = `${cleanInput}@grayplasma.local`;
      }
    }

    let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: emailToTry,
      password: cleanPassword,
    });

    // Fallback jika login username via .local gagal, coba domain .id
    if (authError && !cleanInput.includes("@") && emailToTry.endsWith("@grayplasma.local")) {
      const fallbackId = `${cleanInput}@grayplasma.id`;
      const retry = await supabase.auth.signInWithPassword({
        email: fallbackId,
        password: cleanPassword,
      });
      if (!retry.error && retry.data.user) {
        authData = retry.data;
        authError = null;
      }
    }

    if (authError || !authData.user) {
      if (authError?.message?.toLowerCase().includes("email not confirmed")) {
        return {
          user: null,
          profile: null,
          error: "Email akun belum dikonfirmasi di Supabase. Aktifkan 'Auto Confirm User' di Auth Dashboard atau klik link konfirmasi email.",
        };
      }
      return { user: null, profile: null, error: authError?.message || "Autentikasi gagal." };
    }

    // Fetch matching admin profile from public.admin_profiles
    const { data: profileData, error: profileError } = await supabase
      .from("admin_profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError || !profileData) {
      // Fallback: periksa berdasarkan email jika ID auth belum tertaut di baris admin_profiles
      const { data: profileByEmail } = await supabase
        .from("admin_profiles")
        .select("*")
        .eq("email", authData.user.email || "")
        .single();

      if (profileByEmail) {
        // Tautkan UUID auth.users ke admin_profiles
        await supabase
          .from("admin_profiles")
          .update({ id: authData.user.id, last_login: new Date().toISOString() })
          .eq("email", authData.user.email || "");
        return { user: authData.user, profile: profileByEmail as SupabaseAdminProfile, error: null };
      }

      await supabase.auth.signOut();
      return {
        user: null,
        profile: null,
        error: "Akun ini terdaftar di Auth tapi belum memiliki baris profil di tabel public.admin_profiles.",
      };
    }

    if (!profileData.is_active) {
      await supabase.auth.signOut();
      return { user: null, profile: null, error: "Akun ini telah dinonaktifkan oleh Owner." };
    }

    // Update last_login timestamp
    await supabase
      .from("admin_profiles")
      .update({ last_login: new Date().toISOString() })
      .eq("id", authData.user.id);

    return { user: authData.user, profile: profileData as SupabaseAdminProfile, error: null };
  } catch (err: any) {
    return { user: null, profile: null, error: err.message || "Gagal menghubungi server Supabase." };
  }
}

/**
 * Sign out current admin user
 */
export async function signOutAdminFromSupabase(): Promise<void> {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Sign out error", e);
    }
  }
}

/**
 * Get current active admin session & profile from Supabase
 */
export async function getCurrentSupabaseAdmin(): Promise<SupabaseAdminProfile | null> {
  if (!supabase) return null;
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) return null;

    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("*")
      .eq("id", sessionData.session.user.id)
      .single();

    return (profile as SupabaseAdminProfile) || null;
  } catch {
    return null;
  }
}

/**
 * Create or invite a collaborator account (Executed by Super Admin / Owner)
 */
export async function createCollaboratorAccount(params: {
  email: string;
  password?: string;
  name: string;
  username?: string;
  role: "super_admin" | "lead_reviewer" | "editor" | "contributor";
  roleTitle?: string;
  permissions?: string[];
}): Promise<{ success: boolean; message: string; profile?: SupabaseAdminProfile }> {
  if (!supabase) {
    return { success: false, message: "Supabase belum terkonfigurasi." };
  }

  try {
    const temporaryPassword = params.password || "gp" + Math.random().toString(36).substring(2, 8) + "!2026";
    const cleanEmail = params.email.trim().toLowerCase();
    const cleanUsername = (params.username || cleanEmail.split("@")[0]).trim().toLowerCase();

    // 1. Sign up user through Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: temporaryPassword,
      options: {
        data: {
          name: params.name,
          username: cleanUsername,
          role: params.role,
        },
      },
    });

    if (authError || !authData.user) {
      return { success: false, message: authError?.message || "Gagal membuat akun di Supabase Auth." };
    }

    // 2. Insert record into admin_profiles
    const newProfile: SupabaseAdminProfile = {
      id: authData.user.id,
      username: cleanUsername,
      email: cleanEmail,
      name: params.name.trim(),
      role: params.role,
      role_title: params.roleTitle || "Collaborator",
      permissions: params.permissions || ["guides", "faq"],
      is_active: true,
      created_at: new Date().toISOString(),
    };

    const { error: profileError } = await supabase
      .from("admin_profiles")
      .upsert(newProfile);

    if (profileError) {
      console.warn("Error inserting profile to table:", profileError.message);
      return {
        success: false,
        message: `Akun Auth dibuat, namun gagal simpan ke tabel admin_profiles (${profileError.message}). Cek apakah RLS admin_profiles memblokir atau hubungkan akun manual via SQL.`,
        profile: newProfile,
      };
    }

    return {
      success: true,
      message: `Akun untuk ${params.name} (${cleanEmail}) berhasil didaftarkan.`,
      profile: newProfile,
    };
  } catch (err: any) {
    return { success: false, message: err.message || "Gagal memproses pendaftaran kolaborator." };
  }
}

/**
 * Update password admin di Supabase Auth.
 * - Jika akun milik sendiri (atau targetUserId sama dengan user yang login): update lewat auth.updateUser()
 * - Jika akun orang lain: panggil RPC admin_set_user_password (khusus super_admin)
 */
export async function updateAdminPassword(
  newPassword: string,
  targetUserId?: string,
  targetEmail?: string
): Promise<{ success: boolean; message?: string }> {
  if (!supabase) return { success: false, message: "Supabase belum terkonfigurasi." };
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUserId = sessionData.session?.user?.id;
    const currentUserEmail = sessionData.session?.user?.email;

    const isSelf =
      !targetUserId ||
      targetUserId === currentUserId ||
      (Boolean(targetEmail) &&
        Boolean(currentUserEmail) &&
        targetEmail?.trim().toLowerCase() === currentUserEmail?.trim().toLowerCase());

    if (isSelf) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { success: false, message: error.message };
      return { success: true, message: "Password akun Anda berhasil diperbarui di Supabase Auth." };
    }

    // Ubah password user lain lewat fungsi security definer (khusus super admin)
    const { error: rpcError } = await supabase.rpc("admin_set_user_password", {
      target_identifier: targetUserId || targetEmail,
      new_password: newPassword,
    });

    if (rpcError) {
      return {
        success: false,
        message: `Fungsi SQL belum ada di database: jalankan set_admin.sql di Supabase SQL Editor terlebih dahulu (${rpcError.message})`,
      };
    }

    return { success: true, message: "Password admin berhasil diperbarui di Supabase Auth." };
  } catch (err: any) {
    return { success: false, message: err.message || "Gagal mengubah password." };
  }
}

/**
 * Uploads a compressed WebP file to Supabase Storage Bucket ('gp-assets')
 * Returns the public URL of the uploaded image.
 */
export async function uploadImageToSupabase(
  file: File,
  folder: "monitors" | "desks" | "banners" | "avatars" = "monitors"
): Promise<{ url: string; path: string } | null> {
  if (!supabase) return null;

  try {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileName = `${folder}/${timestamp}_${randomStr}.webp`;

    const { data, error } = await supabase.storage
      .from("gp-assets")
      .upload(fileName, file, {
        contentType: "image/webp",
        cacheControl: "31536000",
        upsert: true,
      });

    if (error) {
      console.error("Supabase Storage upload error:", error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("gp-assets")
      .getPublicUrl(data.path);

    return {
      url: publicUrlData.publicUrl,
      path: data.path,
    };
  } catch (err) {
    console.error("Failed to upload image:", err);
    return null;
  }
}
