export const getOptimizedCloudinaryUrl = (
  url?: string | null,
  width?: number | "auto" | null
): string => {
  if (!url || !url.includes("res.cloudinary.com")) return url || "";
  
  const widthParam = width ? `,c_limit,w_${width}` : "";
  
  // Insert after /upload/ but before version or public_id
  return url.replace(
    /\/image\/upload\/(v\d+\/)?/,
    `/image/upload/f_auto,q_auto${widthParam}/$1`
  );
};
