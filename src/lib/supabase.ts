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
 * Sign in admin using official Supabase Auth (Email + Password)
 */
export async function signInAdminWithSupabase(email: string, password: string): Promise<{
  user: any | null;
  profile: SupabaseAdminProfile | null;
  error: string | null;
}> {
  if (!supabase) {
    return { user: null, profile: null, error: "Supabase belum terkonfigurasi di environment." };
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (authError || !authData.user) {
      return { user: null, profile: null, error: authError?.message || "Autentikasi gagal." };
    }

    // Fetch matching admin profile from public.admin_profiles
    const { data: profileData, error: profileError } = await supabase
      .from("admin_profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError || !profileData) {
      // Fallback: If profile row doesn't exist yet, check metadata or create one
      const fallbackProfile: SupabaseAdminProfile = {
        id: authData.user.id,
        email: authData.user.email || email,
        name: authData.user.user_metadata?.name || "Admin Member",
        role: (authData.user.app_metadata?.role as any) || "super_admin",
        role_title: "Administrator",
        is_active: true,
        permissions: ["*"],
      };

      // Try inserting into admin_profiles
      await supabase.from("admin_profiles").upsert(fallbackProfile);
      return { user: authData.user, profile: fallbackProfile, error: null };
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
  role: "super_admin" | "lead_reviewer" | "editor" | "contributor";
  roleTitle?: string;
  permissions?: string[];
}): Promise<{ success: boolean; message: string; profile?: SupabaseAdminProfile }> {
  if (!supabase) {
    return { success: false, message: "Supabase belum terkonfigurasi." };
  }

  try {
    const temporaryPassword = params.password || "gp" + Math.random().toString(36).substring(2, 8) + "!2026";

    // 1. Sign up user through Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: params.email.trim(),
      password: temporaryPassword,
      options: {
        data: {
          name: params.name,
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
      email: params.email.trim(),
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
    }

    return {
      success: true,
      message: `Akun untuk ${params.name} (${params.email}) berhasil didaftarkan. Password awal: ${temporaryPassword}`,
      profile: newProfile,
    };
  } catch (err: any) {
    return { success: false, message: err.message || "Gagal memproses pendaftaran kolaborator." };
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
