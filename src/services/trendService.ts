import api from './apiConfig';
import { Pagination } from '../types';

export interface TrendPost {
  _id: string;
  salonId: {
    _id: string;
    name: string;
    locationName?: string;
    rating?: number;
    images: string[];
  };
  type: 'video' | 'photo';
  mediaUrl: string;
  thumbnailUrl?: string;
  description?: string;
  tags?: string[];
  likesCount: number;
  isLiked: boolean;
  sharesCount: number;
  createdAt: string;
}

export interface TrendGalleryResponse {
  status: string;
  results: number;
  pagination: Pagination;
  data: {
    posts: TrendPost[];
  };
}

export interface ReelResponse {
  status: string;
  results: number;
  pagination: Pagination;
  data: {
    posts: TrendPost[];
  };
}

export const trendService = {
  // Get trend gallery feed
  getGalleryFeed: async (
    page = 1,
    limit = 30,
    salonId?: string,
    keyword?: string,
  ): Promise<TrendGalleryResponse> => {
    const response = await api.get('/customers/trends/gallery', {
      params: { page, limit, salonId, keyword },
    });
    return response.data;
  },

  // Get reel feed
  getReelsFeed: async (
    page = 1,
    limit = 8,
    salonId?: string,
  ): Promise<ReelResponse> => {
    const response = await api.get('/customers/trends/reels', {
      params: { page, limit, salonId },
    });
    return response.data;
  },

  // Like/Unlike a Post
  likePost: async (
    postId: string,
  ): Promise<{
    status: string;
    data: { likesCount: number; isLiked: boolean };
  }> => {
    const response = await api.patch(`/customers/posts/${postId}/like`);
    return response.data;
  },

  // Share a Post
  sharePost: async (
    postId: string,
  ): Promise<{ status: string; data: { sharesCount: number } }> => {
    const response = await api.patch(`/customers/posts/${postId}/share`);
    return response.data;
  },

  // Add a Comment
  addComment: async (
    postId: string,
    text: string,
  ): Promise<{ status: string; data: { comment: any } }> => {
    const response = await api.post(`/customers/posts/${postId}/comments`, {
      text,
    });
    return response.data;
  },

  // Get Post Comments
  getPostComments: async (
    postId: string,
    page = 1,
    limit = 20,
  ): Promise<{
    status: string;
    data: { comments: any[] };
    pagination: Pagination;
  }> => {
    const response = await api.get(`/customers/posts/${postId}/comments`, {
      params: { page, limit },
    });
    return response.data;
  },
};
