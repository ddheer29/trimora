import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/bookingService';
import { queryKeys } from './queryKeys';

// ─── Customer: Booking Queries ────────────────────────────────────────────────

export const useAppointments = (
  status: 'upcoming' | 'completed' | 'cancelled',
  page = 1,
  limit = 10,
) =>
  useQuery({
    queryKey: queryKeys.bookings.list(status, page),
    queryFn: () => bookingService.getAppointments(status, page, limit),
  });

export const useBookingById = (bookingId: string) =>
  useQuery({
    queryKey: queryKeys.bookings.byId(bookingId),
    queryFn: () => bookingService.getBookingById(bookingId),
    enabled: !!bookingId,
  });

// ─── Partner: Booking Timeline ────────────────────────────────────────────────

export const useBookingTimeline = () =>
  useQuery({
    queryKey: queryKeys.partner.bookingTimeline,
    queryFn: () => bookingService.getBookingTimeline(),
  });

// ─── Customer: Booking Mutations ──────────────────────────────────────────────

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingData: any) => bookingService.createBooking(bookingData),
    onSuccess: () => {
      // Invalidate all appointment lists so they refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => bookingService.cancelBooking(bookingId),
    onSuccess: (_data, bookingId) => {
      // Invalidate listing queries and the specific booking
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.byId(bookingId),
      });
    },
  });
};

export const useRescheduleBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      newDate,
      newTime,
    }: {
      bookingId: string;
      newDate: string;
      newTime: string;
    }) => bookingService.rescheduleBooking(bookingId, newDate, newTime),
    onSuccess: (_data, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.byId(bookingId),
      });
    },
  });
};

export const useReviewBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      rating,
      review,
    }: {
      bookingId: string;
      rating: number;
      review: string;
    }) => bookingService.reviewBooking(bookingId, rating, review),
    onSuccess: (_data, { bookingId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.byId(bookingId),
      });
      // Completed appointments list should refresh to reflect new review
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.list('completed'),
      });
    },
  });
};
