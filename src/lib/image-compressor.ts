/**
 * WebP Image Compressor & Optimizer
 * Compresses images client-side before upload to Supabase Storage / Local DB.
 * - Downscales large resolutions (max dimension 1200px)
 * - Converts heavy JPG/PNG to efficient WebP (quality 0.8)
 * - Reduces file size by 85% - 95% (typically from 5MB -> 40KB-80KB)
 */

export interface CompressedImageResult {
  file: File;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  savedPercentage: number;
  width: number;
  height: number;
}

export async function compressImage(
  file: File,
  maxDimension = 1200,
  quality = 0.8
): Promise<CompressedImageResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio preserving resize
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Unable to create 2D canvas context"));
          return;
        }

        // Apply smooth interpolation
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Image compression failed"));
              return;
            }

            const cleanFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const compressedFile = new File([blob], cleanFileName, {
              type: "image/webp",
              lastModified: Date.now(),
            });

            const dataUrl = canvas.toDataURL("image/webp", quality);
            const savedPercentage = Math.round(
              ((file.size - blob.size) / file.size) * 100
            );

            resolve({
              file: compressedFile,
              dataUrl,
              originalSize: file.size,
              compressedSize: blob.size,
              savedPercentage: Math.max(0, savedPercentage),
              width,
              height,
            });
          },
          "image/webp",
          quality
        );
      };

      img.onerror = () => reject(new Error("Failed to load image for compression"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

/**
 * Uploads compressed file to Supabase Storage if available, or returns dataUrl
 */
export async function uploadOrProcessImage(
  file: File,
  folder = "articles"
): Promise<{ url: string; isRemote: boolean; compressedSize: number }> {
  const result = await compressImage(file);
  
  // Try Supabase Storage if configured
  try {
    const { supabase, isSupabaseConfigured } = await import("@/lib/supabase");
    if (isSupabaseConfigured && supabase) {
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`;
      const { data, error } = await supabase.storage
        .from("gp-assets")
        .upload(fileName, result.file, {
          contentType: "image/webp",
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from("gp-assets")
          .getPublicUrl(fileName);
        return {
          url: publicUrlData.publicUrl,
          isRemote: true,
          compressedSize: result.compressedSize,
        };
      }
    }
  } catch (err) {
    console.warn("Storage upload fallback to Data URL", err);
  }

  return {
    url: result.dataUrl,
    isRemote: false,
    compressedSize: result.compressedSize,
  };
}

/**
 * Handles paste event from clipboard in any text area or content editor
 */
export async function handleClipboardImagePaste(
  e: React.ClipboardEvent<HTMLTextAreaElement | HTMLInputElement>,
  options?: {
    folder?: string;
    onStart?: () => void;
    onSuccess?: (markdownSnippet: string, url: string) => void;
    onError?: (err: any) => void;
  }
): Promise<boolean> {
  const items = e.clipboardData?.items;
  if (!items) return false;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type.indexOf("image") !== -1) {
      const file = item.getAsFile();
      if (file) {
        e.preventDefault();
        options?.onStart?.();

        try {
          const { url } = await uploadOrProcessImage(file, options?.folder || "articles");
          const markdownSnippet = `\n\n![Gambar Lampiran](${url})\n\n`;
          options?.onSuccess?.(markdownSnippet, url);
          return true;
        } catch (err) {
          options?.onError?.(err);
          return false;
        }
      }
    }
  }

  return false;
}

