export const getOptimizedCloudinaryUrl = (
  url?: string | null,
  width: number | "auto" = 800
): string => {
  if (!url || !url.includes("res.cloudinary.com")) return url || "";
  
  // Insert after /upload/ but before version or public_id
  return url.replace(
    /\/image\/upload\/(v\d+\/)?/,
    `/image/upload/f_auto,q_auto,w_${width}/$1`
  );
};
