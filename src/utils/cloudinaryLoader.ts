export default function cloudinaryLoader({
  src, 
  width, 
  quality,
}: { 
  src: string; 
  width: number; 
  quality?: number 
}) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (!src) return "";

  // If it's already a full Cloudinary URL, inject transformations
  if (src.includes("res.cloudinary.com")) {
    return src.replace(
      /\/image\/upload\/(v\d+\/)?/,
      `/image/upload/f_auto,q_${quality || "auto"},w_${width}/$1`
    );
  }

  // If it's a local or different URL, just return it (or you could handle differently)
  if (src.startsWith("/") || src.startsWith("http")) {
    return src;
  }

  // Otherwise, treat it as a public_id
  if (!cloudName) {
    console.warn("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
    return src;
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_${quality || "auto"},w_${width}/${src}`;
}
