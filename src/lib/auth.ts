import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export interface JWTPayload {
  userId?: string;  // Optional for admin tokens
  email: string;
  role?: string;    // For admin tokens
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  phone?: string;
}

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// JWT token operations
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d', // 7 days
  });
};

export const verifyToken = (token: string): JWTPayload => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
};

// Cookie operations
export const setAuthCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
};

export const removeAuthCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('token');
};

export const getAuthCookie = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
};

// Get user from request
export const getUserFromRequest = async (request?: NextRequest): Promise<JWTPayload | null> => {
  try {
    let token: string | undefined;

    if (request) {
      // For API routes
      token = request.cookies.get('token')?.value || request.cookies.get('admin_token')?.value;
      console.log(`[Auth Debug] API Route - Token from request cookies: ${token ? 'Found' : 'Missing'}`);
    } else {
      // For server components
      token = await getAuthCookie();
      console.log(`[Auth Debug] Server Component - Token from cookie store: ${token ? 'Found' : 'Missing'}`);
    }

    if (!token) {
      console.log('[Auth Debug] No token found in request');
      return null;
    }

    const payload = verifyToken(token);
    console.log(`[Auth Debug] Token verified for user: ${payload.email}`);
    return payload;
  } catch (error) {
    console.error('[Auth Debug] Error getting user from request:', error);
    return null;
  }
};

// Middleware helper
export const requireAuth = async (request: NextRequest): Promise<JWTPayload> => {
  const user = await getUserFromRequest(request);

  if (!user) {
    throw new Error('Authentication required');
  }

  return user;
};

// Client-side token operations (for use in client components)
export const getClientToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  // Try to get from cookie (fallback)
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));

  if (tokenCookie) {
    return tokenCookie.split('=')[1];
  }

  return null;
};

export const removeClientToken = () => {
  if (typeof window === 'undefined') return;

  // Remove cookie
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

// Validation helpers
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};