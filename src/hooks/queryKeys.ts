/**
 * Centralized query key factory for all React Query keys in the app.
 * Using factories ensures type-safety and makes cache invalidation predictable.
 */
export const queryKeys = {
  // ─── Customer: Salons ────────────────────────────────────────────────────────
  salons: {
    all: ['salons'] as const,
    nearby: (lat: number, lon: number, maxDistance?: number, page?: number) =>
      ['salons', 'nearby', lat, lon, maxDistance, page] as const,
    byService: (name: string, lat: number, lon: number, page?: number) =>
      ['salons', 'by-service', name, lat, lon, page] as const,
    search: (keyword: string, page?: number) =>
      ['salons', 'search', keyword, page] as const,
    byId: (id: string) => ['salons', id] as const,
    services: (id: string, page?: number) =>
      ['salons', id, 'services', page] as const,
    stylists: (id: string) => ['salons', id, 'stylists'] as const,
    timeSlots: (
      salonId: string,
      stylistId: string,
      date: string,
      serviceId: string,
    ) =>
      [
        'salons',
        salonId,
        'stylists',
        stylistId,
        'timeslots',
        date,
        serviceId,
      ] as const,
  },

  // ─── Partner ─────────────────────────────────────────────────────────────────
  partner: {
    salon: ['partner', 'salon'] as const,
    salonPreview: ['partner', 'salon', 'preview'] as const,
    stylists: ['partner', 'stylists'] as const,
    services: ['partner', 'services'] as const,
    bookings: (page?: number) => ['partner', 'bookings', page] as const,
    bookingDetail: (id: string) => ['partner', 'bookings', id] as const,
    dashboard: (range: string) => ['partner', 'dashboard', range] as const,
    upcomingBookings: ['partner', 'bookings', 'upcoming'] as const,
    bookingTimeline: ['partner', 'bookings', 'timeline'] as const,
  },

  // ─── Customer: Bookings ───────────────────────────────────────────────────────
  bookings: {
    all: ['bookings'] as const,
    list: (status: string, page?: number) =>
      ['bookings', 'list', status, page] as const,
    byId: (id: string) => ['bookings', id] as const,
  },

  // ─── Trends ──────────────────────────────────────────────────────────────────
  trends: {
    gallery: (salonId?: string, keyword?: string) =>
      ['trends', 'gallery', salonId, keyword] as const,
    reels: (salonId?: string) => ['trends', 'reels', salonId] as const,
    comments: (postId: string) => ['trends', postId, 'comments'] as const,
  },

  // ─── User ─────────────────────────────────────────────────────────────────────
  user: {
    profile: ['user', 'profile'] as const,
  },
} as const;
