import api from './apiConfig';
import { Booking, CustomerBooking, CustomerBookingsApiResponse, Pagination } from '../types';

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

    // Get my bookings (Legacy/Generic)
    getMyBookings: async (page = 1, limit = 10): Promise<BookingsApiResponse> => {
        const response = await api.get('/customers/bookings', {
            params: { page, limit },
        });
        return response.data;
    },

    // Get bookings by status (New Optimized)
    getAppointments: async (status: 'upcoming' | 'completed' | 'cancelled', page = 1, limit = 10): Promise<CustomerBookingsApiResponse> => {
        const response = await api.get('/customers/bookings', {
            params: { status, page, limit },
        });
        return response.data;
    },

    // Get single booking
    getBookingById: async (bookingId: string): Promise<SingleBookingApiResponse> => {
        const response = await api.get(`/customers/bookings/${bookingId}`);
        return response.data;
    },

    // Cancel booking
    cancelBooking: async (bookingId: string): Promise<any> => {
        const response = await api.post(`/customers/bookings/${bookingId}/cancel`);
        return response.data;
    },

    // Reschedule booking
    rescheduleBooking: async (bookingId: string, newDate: string, newTime: string): Promise<any> => {
        const response = await api.post(`/customers/bookings/${bookingId}/reschedule`, {
            newDate,
            newTime,
        });
        return response.data;
    },

    // Review booking
    reviewBooking: async (bookingId: string, rating: number, review: string): Promise<any> => {
        const response = await api.post(`/customers/bookings/${bookingId}/review`, {
            rating,
            review,
        });
        return response.data;
    },

    // Get rebook data
    getRebookData: async (bookingId: string): Promise<any> => {
        const response = await api.get(`/customers/bookings/${bookingId}/rebook-data`);
        return response.data;
    },
};
