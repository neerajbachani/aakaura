import { authenticate } from "@/middleware/auth";
import { ApiError, errorHandler } from "@/middleware/errorHandler";
import { uploadToCloudinary } from "@/utils/upload";
import { successResponse } from "@/utils/response";


// Simple direct export without wrapper to avoid any class/prototype issues
export async function POST(req: Request) {
  try {
    await authenticate(req);

    const formData = await req.formData();
    const image = formData.get("image") as Blob;

    if (!image || !(image instanceof Blob)) {
      return Response.json(
        { success: false, error: "Image is required" },
        { status: 400 }
      );
    }

    const fileType = image.type;
    if (!fileType.startsWith("image/")) {
      return Response.json(
        { success: false, error: "File must be an image" },
        { status: 400 }
      );
    }

    const imageUrl = await uploadToCloudinary(image);
    
    return Response.json(
      { success: true, data: { imageUrl }, message: "Image uploaded successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    const message = error.message || "Internal Server Error";
    
    return Response.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
