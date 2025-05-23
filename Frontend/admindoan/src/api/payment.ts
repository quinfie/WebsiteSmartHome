import api from './axios.config'; // Import the configured axios instance
import { BaseResponse } from '../types/common';

// Remove the local API_URL definition
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface PaymentInformationModel {
    orderType: string;
    amount: number;
    orderDescription: string;
    name: string;
}

export interface PaymentResponseModel {
    orderDescription: string;
    transactionId: string;
    orderId: string;
    paymentMethod: string;
    paymentId: string;
    success: boolean;
    token: string;
    vnPayResponseCode: string;
}

export const paymentApi = {
    createVNPayPayment: async (data: PaymentInformationModel): Promise<BaseResponse<{ paymentUrl: string }>> => {
        try {
            // Use the imported api instance
            const response = await api.post('/vnpay/create-payment', data); // Use relative path
            return response.data;
        } catch (error) {
            console.error('Error creating VNPay payment:', error);
            // Re-throw the error after logging
            throw error;
        }
    },

    getPaymentStatus: async (orderId: string): Promise<BaseResponse<PaymentResponseModel>> => {
        try {
            const response = await api.get(`/vnpay/payment-status?orderId=${orderId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting payment status:', error);
            throw error;
        }
    }
}; 