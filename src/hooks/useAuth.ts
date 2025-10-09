import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { queryKeys } from '@/lib/queryClient';
import { 
  LoginInput, 
  SignupInput, 
  UpdateProfileInput, 
  ChangePasswordInput 
} from '@/lib/validations/auth';
import { formatGuestCartForAPI, clearGuestCart } from '@/lib/guestCart';

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  createdAt: string;
  updatedAt?: string;
}

// API functions
const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await fetch('/api/auth/me');
    if (response.status === 401) {
      return null; // Not authenticated
    }
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Fetch user error:', error);
    return null;
  }
};

const loginUser = async (credentials: LoginInput & { guestCart?: any[] }) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }
  
  return response.json();
};

const signupUser = async (userData: SignupInput & { guestCart?: any[] }) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Signup failed');
  }
  
  return response.json();
};

const logoutUser = async () => {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Logout failed');
  }
  
  return response.json();
};

const updateProfile = async (profileData: UpdateProfileInput) => {
  const response = await fetch('/api/user/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Profile update failed');
  }
  
  return response.json();
};

const changePassword = async (passwordData: ChangePasswordInput) => {
  const response = await fetch('/api/user/change-password', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(passwordData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Password change failed');
  }
  
  return response.json();
};

// Custom hooks
export const useUser = () => {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error?.message?.includes('401')) return false;
      return failureCount < 2;
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Update user cache
      queryClient.setQueryData(queryKeys.user, data.user);
      
      // Clear guest cart since it's been merged
      clearGuestCart();
      
      // Invalidate cart to refetch with user data
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      
      toast.success('Welcome back!');
      
      // Redirect to intended page or home
      const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      router.push(redirectTo);
    },
    onError: (error) => {
      toast.error(error.message || 'Login failed');
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      // Update user cache
      queryClient.setQueryData(queryKeys.user, data.user);
      
      // Clear guest cart since it's been merged
      clearGuestCart();
      
      // Invalidate cart to refetch with user data
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      
      toast.success('Account created successfully!');
      
      // Redirect to intended page or home
      const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      router.push(redirectTo);
    },
    onError: (error) => {
      toast.error(error.message || 'Signup failed');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      
      toast.success('Logged out successfully');
      router.push('/');
    },
    onError: (error) => {
      toast.error(error.message || 'Logout failed');
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      // Update user cache
      queryClient.setQueryData(queryKeys.user, data.user);
      
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Profile update failed');
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Password change failed');
    },
  });
};

// Helper hooks
export const useAuthStatus = () => {
  const { data: user, isLoading, error } = useUser();
  
  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    isGuest: !user && !isLoading,
    error,
  };
};

export const useRequireAuth = (redirectTo = '/auth/login') => {
  const { isAuthenticated, isLoading } = useAuthStatus();
  const router = useRouter();

  if (!isLoading && !isAuthenticated) {
    // Store intended destination
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    router.push(redirectTo);
  }

  return { isAuthenticated, isLoading };
};