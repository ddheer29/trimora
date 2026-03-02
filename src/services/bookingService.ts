import api from './apiConfig';
import { Booking, Pagination } from '../types';

export interface BookingsApiResponse {
    status: string;
    data: Booking[];
    pagination: Pagination;
}

export interface SingleBookingApiResponse {
    status: string;
    data: Booking;
}

export const bookingService = {
    // Create booking
    createBooking: async (bookingData: any): Promise<SingleBookingApiResponse> => {
        const response = await api.post('/customers/bookings', bookingData);
        return response.data;
    },

    // Get my bookings
    getMyBookings: async (page = 1, limit = 10): Promise<BookingsApiResponse> => {
        const response = await api.get('/customers/bookings', {
            params: { page, limit },
        });
        return response.data;
    },

    // Get single booking
    getBookingById: async (bookingId: string): Promise<SingleBookingApiResponse> => {
        const response = await api.get(`/customers/bookings/${bookingId}`);
        return response.data;
    },
};
