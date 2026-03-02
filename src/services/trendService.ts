import api from './apiConfig';
import { Pagination } from '../types';

export interface TrendGalleryItem {
    type: 'video' | 'photo';
    thumbnailUrl?: string;
    mediaUrl?: string;
    salonId: string;
    createdAt: string;
}

export interface TrendGalleryResponse {
    status: string;
    data: TrendGalleryItem[];
    pagination: Pagination;
}

export interface ReelResponse {
    status: string;
    data: any[]; // Populated reel data
    pagination: Pagination;
}

export const trendService = {
    // Get trend gallery feed
    getGalleryFeed: async (page = 1, limit = 30): Promise<TrendGalleryResponse> => {
        const response = await api.get('/customers/trends/gallery', {
            params: { page, limit },
        });
        return response.data;
    },

    // Get reel feed
    getReelsFeed: async (page = 1, limit = 8): Promise<ReelResponse> => {
        const response = await api.get('/customers/trends/reels', {
            params: { page, limit },
        });
        return response.data;
    },
};
