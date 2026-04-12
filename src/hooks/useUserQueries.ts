import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { queryKeys } from './queryKeys';

// ─── User Profile ────────────────────────────────────────────────────────────

export const useProfile = () =>
  useQuery({
    queryKey: queryKeys.user.profile,
    queryFn: () => userService.getProfile(),
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => userService.updateProfile(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile });
    },
  });
};
