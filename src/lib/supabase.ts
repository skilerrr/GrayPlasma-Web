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

/**
 * Uploads a compressed WebP file to Supabase Storage Bucket ('gp-assets')
 * Returns the public URL of the uploaded image.
 */
export async function uploadImageToSupabase(
  file: File,
  folder: "monitors" | "desks" | "banners" = "monitors"
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
