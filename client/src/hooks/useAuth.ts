import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest, getQueryFn } from '@/lib/queryClient';
import { type User, type InsertUser, type LoginUser } from '@shared/schema';

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      return apiRequest('POST', '/api/auth/register', userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginUser) => {
      return apiRequest('POST', '/api/auth/login', credentials);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/auth/logout');
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  const typedUser = user as User | null | undefined;
  const isAuthenticated = !!user && !error;
  const isPremium = isAuthenticated && (
    typedUser?.role === 'admin' ||
    (typedUser?.subscriptionTier === 'premium' && typedUser?.subscriptionStatus === 'active')
  );
  const isAdmin = isAuthenticated && typedUser?.role === 'admin';

  return {
    user: typedUser,
    isLoading,
    isAuthenticated,
    isPremium: !!isPremium,
    isAdmin: !!isAdmin,
    subscriptionTier: (typedUser?.subscriptionTier || 'free') as string,
    subscriptionStatus: (typedUser?.subscriptionStatus || 'none') as string,
    register: registerMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
