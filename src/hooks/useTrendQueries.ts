import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import { trendService, TrendGalleryResponse, ReelResponse } from '@/services/trendService';
import { queryKeys } from './queryKeys';

// ─── Trends: Infinite Queries ─────────────────────────────────────────────────

export const useGalleryFeed = (salonId?: string, keyword?: string) =>
  useInfiniteQuery<TrendGalleryResponse>({
    queryKey: queryKeys.trends.gallery(salonId, keyword),
    queryFn: ({ pageParam = 1 }) =>
      trendService.getGalleryFeed(pageParam as number, 30, salonId, keyword),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: true,
  });

export const useReelsFeed = (salonId?: string) =>
  useInfiniteQuery<ReelResponse>({
    queryKey: queryKeys.trends.reels(salonId),
    queryFn: ({ pageParam = 1 }) =>
      trendService.getReelsFeed(pageParam as number, 8, salonId),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

// ─── Trends: Comments ─────────────────────────────────────────────────────────

export const usePostComments = (postId: string) =>
  useQuery({
    queryKey: queryKeys.trends.comments(postId),
    queryFn: () => trendService.getPostComments(postId),
    enabled: !!postId,
  });

// ─── Trends: Mutations ────────────────────────────────────────────────────────

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => trendService.likePost(postId),
    onMutate: async (postId) => {
      // Optimistic update: flip the like state in gallery and reels caches
      const updatePostInPages = (
        old: InfiniteData<TrendGalleryResponse | ReelResponse> | undefined,
      ) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              posts: page.data.posts.map((post) =>
                post._id === postId
                  ? {
                      ...post,
                      isLiked: !post.isLiked,
                      likesCount: post.isLiked
                        ? post.likesCount - 1
                        : post.likesCount + 1,
                    }
                  : post,
              ),
            },
          })),
        };
      };

      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ['trends'] });

      // Snapshot previous values for rollback
      const prevGallery = queryClient.getQueriesData({ queryKey: ['trends', 'gallery'] });
      const prevReels = queryClient.getQueriesData({ queryKey: ['trends', 'reels'] });

      // Apply optimistic update to all gallery and reel caches
      queryClient.setQueriesData(
        { queryKey: ['trends', 'gallery'] },
        updatePostInPages,
      );
      queryClient.setQueriesData(
        { queryKey: ['trends', 'reels'] },
        updatePostInPages,
      );

      // Return context for rollback on error
      return { prevGallery, prevReels };
    },
    onError: (_err, _postId, context) => {
      // Rollback on failure
      if (context?.prevGallery) {
        context.prevGallery.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (context?.prevReels) {
        context.prevReels.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      // Sync with server after mutation finishes (success or failure)
      queryClient.invalidateQueries({ queryKey: ['trends'] });
    },
  });
};

export const useSharePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => trendService.sharePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trends'] });
    },
  });
};

export const useAddComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => trendService.addComment(postId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.trends.comments(postId),
      });
    },
  });
};
