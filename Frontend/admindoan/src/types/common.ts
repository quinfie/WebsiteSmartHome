// src/types/common.ts

export interface PagedResult<T> {
    items: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }

export interface BaseResponse<T> {
    data: T;
    message: string;
    statusCode: number;
    code: string;
    success: boolean;
}

// Add PaymentResponseDto interface
export interface PaymentResponseDto {
    paymentUrl: string;
    orderId: string;
    amount: number;
    status: string;
}

// DTO for paginated data
export interface PagedResponse<T> {
    data: T[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
}
  