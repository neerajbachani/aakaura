import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function verifyAdminToken(request: NextRequest) {
  try {
    const token = request.cookies.get("admin_token")?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string; role: string };
    
    // For admin login, we don't need to check database since it's env-based
    if (decoded.role === "admin") {
      return {
        id: "admin",
        email: decoded.email,
        name: "Admin",
        role: "ADMIN"
      };
    }

    return null;
  } catch (error) {
    console.error("Admin token verification failed:", error);
    return null;
  }
}

export async function verifyUserToken(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    const user = await prisma.user.findFirst({
      where: { 
        id: decoded.userId,
        isActive: true
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    return user;
  } catch (error) {
    console.error("User token verification failed:", error);
    return null;
  }
}