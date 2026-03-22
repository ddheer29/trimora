import api from './apiConfig';
import { ApiResponse } from './salonService';

export interface PartnerPost {
  _id: string;
  salonId: string;
  type: 'photo' | 'video';
  mediaUrl: string;
  thumbnailUrl: string;
  description?: string;
  tags?: string[];
  likesCount: number;
  sharesCount: number;
  createdAt: string;
}

export interface PartnerPostsResponse {
  status: string;
  results: number;
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
  data: {
    posts: PartnerPost[];
  };
}

export const partnerPostService = {
  // Create a new post
  createPost: async (formData: FormData): Promise<ApiResponse<PartnerPost>> => {
    const response = await api.post('/partner/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all salon posts
  getPartnerPosts: async (page = 1, limit = 10): Promise<PartnerPostsResponse> => {
    const response = await api.get('/partner/posts', {
      params: { page, limit },
    });
    return response.data;
  },

  // Delete a post
  deletePost: async (postId: string): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/partner/posts/${postId}`);
    return response.data;
  },
};
