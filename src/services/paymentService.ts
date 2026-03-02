import api from './apiConfig';

export interface RazorpayOrderResponse {
    status: string;
    data: {
        orderId: string;
        amount: number;
        currency: string;
        bookingId: string;
    };
}

export interface PaymentVerifyResponse {
    status: string;
    message: string;
    data: {
        booking: any;
    };
}

export const paymentService = {
    // Create Razorpay order
    createOrder: async (bookingId: string): Promise<RazorpayOrderResponse> => {
        const response = await api.post('/payments/create-order', { bookingId });
        return response.data;
    },

    // Verify payment
    verifyPayment: async (paymentData: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }): Promise<PaymentVerifyResponse> => {
        const response = await api.post('/payments/verify', paymentData);
        return response.data;
    },
};
